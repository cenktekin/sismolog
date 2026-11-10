'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { createDepremService, buildAfadUrl } = require('../lib/sources');

const SAMPLE = [{ tarih: '2026.11.10', saat: '12:31:20', enlem: '38.46', boylam: '39.07', derinlik: '19.2', buyukluk: '1.9', yer: 'SARITOSUN', sehir: 'ELAZIG' }];

function okSource(name, records = SAMPLE) {
    return { name, load: async () => records };
}

function failingSource(name, message = 'boom') {
    return { name, load: async () => { throw new Error(message); } };
}

test('birincil kaynak çalışınca yedek hiç çağrılmaz', async () => {
    let fallbackCalled = false;
    const service = createDepremService({
        sources: [
            okSource('kandilli'),
            { name: 'afad', load: async () => { fallbackCalled = true; return SAMPLE; } }
        ]
    });

    const result = await service.getirDepremler();
    assert.equal(result.source, 'kandilli');
    assert.equal(result.depremler.length, 1);
    assert.equal(fallbackCalled, false);
});

test('birincil kaynak düşünce yedek kaynak devreye girer', async () => {
    const service = createDepremService({
        sources: [failingSource('kandilli', 'Kandilli HTTP 503'), okSource('afad')]
    });

    const result = await service.getirDepremler();
    assert.equal(result.source, 'afad');
    assert.equal(result.depremler.length, 1);
    assert.equal(result.errors.length, 1);
    assert.equal(result.errors[0].source, 'kandilli');
});

test('tüm kaynaklar düşünce hata görünür olur (sessiz boş liste değil)', async () => {
    const service = createDepremService({
        sources: [failingSource('kandilli'), failingSource('afad')]
    });

    const result = await service.getirDepremler();
    assert.equal(result.depremler, null);
    assert.equal(result.source, null);
    assert.equal(result.errors.length, 2);
});

test('önbellek tazeyken kaynak tekrar çağrılmaz', async () => {
    let calls = 0;
    const service = createDepremService({
        now: () => 1000,
        sources: [{ name: 'kandilli', load: async () => { calls += 1; return SAMPLE; } }]
    });

    await service.getirDepremler();
    const second = await service.getirDepremler();
    assert.equal(calls, 1);
    assert.equal(second.source, 'cache');
});

test('önbellek bayatlayınca yeniden çekilir', async () => {
    let calls = 0;
    let clock = 0;
    const service = createDepremService({
        now: () => clock,
        sources: [{ name: 'kandilli', load: async () => { calls += 1; return SAMPLE; } }]
    });

    await service.getirDepremler();
    clock = service.cacheDuration + 1;
    const second = await service.getirDepremler();
    assert.equal(calls, 2);
    assert.equal(second.source, 'kandilli');
});

test('kaynak düşünce bayat önbellek stale olarak sunulur', async () => {
    let clock = 0;
    let alive = true;
    const service = createDepremService({
        now: () => clock,
        sources: [{
            name: 'kandilli',
            load: async () => {
                if (!alive) throw new Error('kaynak kapalı');
                return SAMPLE;
            }
        }]
    });

    await service.getirDepremler();
    clock = service.cacheDuration + 1;
    alive = false;

    const result = await service.getirDepremler();
    assert.equal(result.source, 'stale');
    assert.equal(result.depremler.length, 1);
    assert.equal(result.errors.length, 1);
});

test('buildAfadUrl istenen saat aralığını ve limiti içerir', () => {
    const url = buildAfadUrl(72);
    assert.match(url, /^https:\/\/deprem\.afad\.gov\.tr\/apiv2\/event\/filter\?/);
    assert.match(url, /start=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    assert.match(url, /end=\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    assert.match(url, /limit=500/);
});
