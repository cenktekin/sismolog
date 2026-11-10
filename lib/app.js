'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { filterDepremler } = require('./parse');
const { createDepremService, CACHE_DURATION } = require('./sources');

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 60;

function buildRateLimiter() {
    return rateLimit({
        windowMs: RATE_LIMIT_WINDOW_MS,
        max: RATE_LIMIT_MAX,
        standardHeaders: true,
        legacyHeaders: false,
        message: { error: 'Too Many Requests', detail: 'Dakikada en fazla 60 istek gönderilebilir.' }
    });
}

function buildApp({ fetchImpl, sources, now } = {}) {
    const app = express();
    const service = createDepremService({ fetchImpl, sources, now });

    if (process.env.VERCEL) {
        app.set('trust proxy', 1);
    }

    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'", "'unsafe-inline'", 'https://cdn.jsdelivr.net', 'https://unpkg.com'],
                styleSrc: ["'self'", "'unsafe-inline'", 'https://unpkg.com'],
                imgSrc: ["'self'", 'data:', 'https://*.tile.openstreetmap.org', 'https://unpkg.com'],
                connectSrc: ["'self'", 'https://*.tile.openstreetmap.org'],
                fontSrc: ["'self'", 'data:'],
                objectSrc: ["'none'"],
                frameAncestors: ["'none'"]
            }
        },
        crossOriginEmbedderPolicy: false
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(express.static(path.join(__dirname, '..', 'public')));
    app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '..', 'views'));

    app.get('/', async (req, res) => {
        try {
            const result = await service.getirDepremler();
            res.render('index.ejs', { depremler: result.depremler || [] });
        } catch (error) {
            console.error('Render hatası:', error);
            res.status(500).send('Sunucu hatası');
        }
    });

    app.get('/api/v1/depremler', buildRateLimiter(), async (req, res) => {
        let result;
        try {
            result = await service.getirDepremler();
        } catch (error) {
            console.error('Veri hatası:', error);
            result = { depremler: null, source: null, fetchedAt: 0, errors: [{ message: error.message }] };
        }

        const cacheAge = Math.max(0, Math.round((Date.now() - result.fetchedAt) / 1000));
        res.set({
            'X-Cache-Age': String(cacheAge),
            'X-Cache-Max-Age': String(Math.round(CACHE_DURATION / 1000)),
            'X-Data-Source': result.source || 'unavailable'
        });

        if (result.errors && result.errors.length > 0) {
            res.set('X-Data-Warning', result.errors.map(e => `${e.source || 'kaynak'}: ${e.message}`).join(' | '));
        }

        if (!result.depremler) {
            return res.status(503).json({
                error: 'Veri kaynaklarına ulaşılamadı',
                details: result.errors.map(e => e.message)
            });
        }

        res.json(filterDepremler(result.depremler, {
            tarih: req.query.tarih,
            min: req.query.min,
            max: req.query.max,
            sehir: req.query.sehir
        }));
    });

    app.use((err, req, res, next) => {
        console.error('Error:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    });

    app.locals.depremService = service;
    return app;
}

module.exports = { buildApp };
