require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Simple cache
let cachedData = null;
let lastFetchTime = 0;
const CACHE_DURATION = 2 * 60 * 1000; // 2 minutes

// Deprem data class
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

// Deprem fetch function - Gerçek Kandilli verisini çeker
async function getirDepremler() {
    try {
        // Cache kontrolü
        const now = Date.now();
        if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
            return cachedData;
        }

        const depremler = [];
        
        // Kandilli'den gerçek veri çekme
        const url = 'http://www.koeri.boun.edu.tr/scripts/lst0.asp';
        
        // Vercel'de çalışacak basit bir request yöntemi
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = await response.text();
        const lines = html.split('\n');
        
        // Veri satırlarını bul (genellikle 6. satırdan başlar)
        const dataLines = lines.slice(6);
        
        for (const line of dataLines) {
            // HTML etiketlerini ve fazlalılıkları temizle
            const cleanLine = line
                .replace(/<[^>]*>/g, '') // HTML etiketlerini kaldır
                .replace(/&nbsp;/g, ' ') // Boşluk karakterlerini düzelt
                .replace(/\s+/g, ' ') // Birden fazla boşluğu tek yap
                .trim();
            
            if (!cleanLine) continue;
            
            // Satırı boşluklara göre ayır
            const parts = cleanLine.split(/\s+/);
            
            // En az 10 parça olmalı (geçerli bir deprem satırı)
            if (parts.length < 10) continue;
            
            // Tarih formatını kontrol et (YYYY.AA.GG)
            if (!parts[0].match(/^\d{4}\.\d{2}\.\d{2}$/)) continue;
            
            const deprem = new Deprem(
                parts[0],      // Tarih
                parts[1],      // Saat
                parts[2],      // Enlem
                parts[3],      // Boylam
                parts[4],      // Derinlik
                parts[6],      // Büyüklük
                parts[8],      // Yer
                parts[9]       // Şehir
            );
            
            depremler.push(deprem);
        }

        // Cache'i güncelle
        cachedData = depremler;
        lastFetchTime = now;
        return depremler;
    } catch (error) {
        console.error('Veri çekme hatası:', error);
        
        // Hata durumunda cache'deki veriyi döndür
        if (cachedData) {
            return cachedData;
        }
        
        // Cache yoksa boş dizi döndür
        return [];
    }
}

// Home route
app.get("/", async (req, res) => {
    try {
        const depremler = await getirDepremler();
        res.render("index.ejs", { depremler });
    } catch (error) {
        res.status(500).send("Sunucu hatası");
    }
});

// API route
app.get('/api/v1/depremler', async (req, res) => {
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

        // Cache headers
        const cacheAge = Math.round((Date.now() - lastFetchTime) / 1000);
        res.set({
            'X-Cache-Age': cacheAge,
            'X-Cache-Max-Age': Math.round(CACHE_DURATION / 1000),
            'X-Data-Source': cacheAge < CACHE_DURATION / 1000 ? 'cache' : 'fresh'
        });
        
        res.json(filteredDepremler);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error' });
});

// For local development
const PORT = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

// Export for Vercel
module.exports = app;