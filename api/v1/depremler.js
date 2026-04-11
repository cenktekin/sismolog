require('dotenv').config();
const express = require('express');
const app = express();
const request = require("request");
const cheerio = require("cheerio");
const winston = require('winston');

// Logger yapılandırması
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            maxsize: 5242880, // 5MB
            maxFiles: 5
        }),
        new winston.transports.File({ 
            filename: 'logs/combined.log',
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

// Cache mekanizması
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 dakika cache

// Deprem verisi doğrulama fonksiyonu
const validateDepremData = (data) => {
    if (!data || typeof data !== 'object') return false;
    
    const requiredFields = ['tarih', 'saat', 'enlem', 'boylam', 'derinlik', 'buyukluk', 'yer', 'sehir'];
    for (const field of requiredFields) {
        if (!data[field]) return false;
    }

    // Sayısal değerlerin kontrolü
    if (isNaN(parseFloat(data.enlem)) || isNaN(parseFloat(data.boylam)) || 
        isNaN(parseFloat(data.derinlik)) || isNaN(parseFloat(data.buyukluk))) {
        return false;
    }

    return true;
};

// Request timeout ve retry mekanizması
const requestWithRetry = (url, options = {}, maxRetries = 3) => {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        
        const makeRequest = () => {
            attempts++;
            
            const requestOptions = {
                url: url,
                timeout: 5000,
                headers: {
                    'User-Agent': 'Türkiye-Deprem-Takip/1.0'
                },
                ...options
            };
            
            request(requestOptions, (error, response, body) => {
                if (error || response.statusCode !== 200) {
                    logger.error(`Request attempt ${attempts} failed:`, error || `Status: ${response?.statusCode}`);
                    
                    if (attempts < maxRetries) {
                        setTimeout(makeRequest, 1000 * attempts);
                    } else {
                        reject(error || new Error(`HTTP ${response?.statusCode}`));
                    }
                } else {
                    resolve({ ok: true, text: () => Promise.resolve(body) });
                }
            });
        };
        
        makeRequest();
    });
};

class Deprem {
    constructor(tarih, saat, enlem, boylam, derinlik, buyukluk, yer, sehir) {
        this.tarih = tarih;
        this.saat = saat;
        this.enlem = enlem;
        this.boylam = boylam;
        this.derinlik = derinlik;
        this.buyukluk = buyukluk;
        this.yer = yer;
        this.sehir = sehir;
    }
}

async function getirDepremler() {
    try {
        // Cache kontrolü
        const now = Date.now();
        if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
            logger.info(`Cache'den veri döndürülüyor. Cache yaşı: ${Math.round((now - lastFetchTime) / 1000)} saniye`);
            return cachedData;
        }

        const depremler = [];
        const response = await requestWithRetry("http://www.koeri.boun.edu.tr/scripts/lst0.asp");
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);
        const responseText = $("pre").text();
        const result = responseText.split("\n").slice(6);

        for (const element of result) {
            const depremBilgi = element.split(" ").filter(item => item.length > 0);
            
            if (depremBilgi.length < 10) continue;

            const deprem = new Deprem(
                depremBilgi[0],
                depremBilgi[1],
                depremBilgi[2],
                depremBilgi[3],
                depremBilgi[4],
                depremBilgi[6],
                depremBilgi[8],
                depremBilgi[9]
            );

            if (validateDepremData(deprem)) {
                depremler.push(deprem);
            }
        }

        // Cache'i güncelle
        cachedData = depremler;
        lastFetchTime = now;

        logger.info(`Deprem verisi başarıyla alındı ve cache'lendi. Toplam: ${depremler.length}`);
        return depremler;
    } catch (error) {
        logger.error('Deprem verisi alınırken hata oluştu:', error);
        
        // Hata durumunda cache'deki veriyi döndür (varsa)
        if (cachedData) {
            logger.warn('Hata nedeniyle cache\'deki eski veri döndürülüyor');
            return cachedData;
        }
        
        throw error;
    }
}

// Body parser
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// API endpoint'i
app.get('/', [
    // Validation middleware'leri buraya eklenebilir
], async (req, res) => {
    try {
        const depremler = await getirDepremler();
        
        let filteredDepremler = [...depremler];

        if (req.query.tarih) {
            filteredDepremler = filteredDepremler.filter(x => x.tarih === req.query.tarih);
        }

        if (req.query.min) {
            filteredDepremler = filteredDepremler.filter(x => parseFloat(x.buyukluk) >= parseFloat(req.query.min));
        }

        if (req.query.max) {
            filteredDepremler = filteredDepremler.filter(x => parseFloat(x.buyukluk) <= parseFloat(req.query.max));
        }

        if (req.query.sehir) {
            filteredDepremler = filteredDepremler.filter(x => x.sehir === req.query.sehir);
        }

        logger.info(`API request successful. Filtered ${filteredDepremler.length} earthquakes`);
        
        // Cache bilgisini header'a ekle
        const cacheAge = Math.round((Date.now() - lastFetchTime) / 1000);
        res.set({
            'X-Cache-Age': cacheAge,
            'X-Cache-Max-Age': Math.round(CACHE_DURATION / 1000),
            'X-Data-Source': cacheAge < CACHE_DURATION / 1000 ? 'cache' : 'fresh'
        });
        
        res.json(filteredDepremler);
    } catch (error) {
        logger.error('API Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    logger.error('Unhandled Error:', err);
    res.status(500).json({
        error: 'Bir hata oluştu',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error'
    });
});

// Vercel serverless function için export
module.exports = app;