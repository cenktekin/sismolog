'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { buildApp } = require('../lib/app');

const SAMPLE = [
    { tarih: '2026.11.10', saat: '12:31:20', enlem: '38.4627', boylam: '39.0740', derinlik: '19.2', buyukluk: '1.9', yer: 'SARITOSUN', sehir: 'ELAZIG' },
    { tarih: '2026.11.10', saat: '11:49:46', enlem: '37.5328', boylam: '35.5695', derinlik: '8.4', buyukluk: '4.5', yer: 'KOZAN', sehir: 'ADANA' }
];

async function withServer(sources, run) {
    const app = buildApp({ sources });
    const server = await new Promise((resolve) => {
        const srv = app.listen(0, () => resolve(srv));
    });
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
        await run(base);
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
}

const okSources = () => [{ name: 'kandilli', load: async () => SAMPLE }];

test('GET /api/v1/depremler kayıtları ve kaynak başlığını döner', async () => {
    await withServer(okSources(), async (base) => {
        const res = await fetch(`${base}/api/v1/depremler`);
        assert.equal(res.status, 200);
        assert.equal(res.headers.get('x-data-source'), 'kandilli');
        const body = await res.json();
        assert.equal(body.length, 2);
        assert.equal(body[0].sehir, 'ELAZIG');
    });
});

test('GET /api/v1/depremler min filtresini uygular', async () => {
    await withServer(okSources(), async (base) => {
        const res = await fetch(`${base}/api/v1/depremler?min=4`);
        const body = await res.json();
        assert.equal(body.length, 1);
        assert.equal(body[0].buyukluk, '4.5');
    });
});

test('GET /api/v1/depremler şehir filtresini uygular', async () => {
    await withServer(okSources(), async (base) => {
        const res = await fetch(`${base}/api/v1/depremler?sehir=adana`);
        const body = await res.json();
        assert.equal(body.length, 1);
        assert.equal(body[0].yer, 'KOZAN');
    });
});

test('kaynak tamamen düşükken API 503 ve görünür hata döner', async () => {
    const sources = [{ name: 'kandilli', load: async () => { throw new Error('Kandilli HTTP 503'); } }];
    await withServer(sources, async (base) => {
        const res = await fetch(`${base}/api/v1/depremler`);
        assert.equal(res.status, 503);
        assert.equal(res.headers.get('x-data-source'), 'unavailable');
        assert.match(res.headers.get('x-data-warning'), /Kandilli HTTP 503/);
        const body = await res.json();
        assert.ok(body.error);
        assert.deepEqual(body.details, ['Kandilli HTTP 503']);
    });
});

test('güvenlik başlıkları yanıtta mevcut (helmet)', async () => {
    await withServer(okSources(), async (base) => {
        const res = await fetch(`${base}/api/v1/depremler`);
        assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
        assert.equal(res.headers.get('x-frame-options'), 'SAMEORIGIN');
        assert.ok(res.headers.get('content-security-policy'));
    });
});

test('GET / sayfayı render eder', async () => {
    await withServer(okSources(), async (base) => {
        const res = await fetch(`${base}/`);
        assert.equal(res.status, 200);
        const html = await res.text();
        assert.match(html, /<div id="map"/);
        assert.doesNotMatch(html, /socket\.io/);
    });
});
