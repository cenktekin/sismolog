'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
    cleanLine,
    splitLocation,
    parseKandilliLine,
    parseKandilliHtml,
    normalizeAfadEvent,
    normalizeAfadEvents,
    filterDepremler
} = require('../lib/parse');

const fixture = () => fs.readFileSync(path.join(__dirname, 'fixtures', 'kandilli.html'), 'utf8');

test('cleanLine HTML etiketlerini ve fazla boşlukları temizler', () => {
    const raw = '<tr><td>2026.11.10</td>&nbsp;&nbsp;  12:31:20  </tr>';
    assert.equal(cleanLine(raw), '2026.11.10 12:31:20');
});

test('splitLocation parantezli şehri ayırır ve durum ekini atar', () => {
    assert.deepEqual(splitLocation('UCKUYU-SULTANDAGI (AFYONKARAHISAR) İlksel'), {
        yer: 'UCKUYU-SULTANDAGI',
        sehir: 'AFYONKARAHISAR'
    });
});

test('splitLocation tire-parantez aralığını normalize eder', () => {
    assert.deepEqual(splitLocation('SARITOSUN-(ELAZIG) İlksel'), {
        yer: 'SARITOSUN',
        sehir: 'ELAZIG'
    });
});

test('splitLocation şehirsiz satırda sehir alanını boş bırakır', () => {
    assert.deepEqual(splitLocation('YUNANISTAN İlksel'), { yer: 'YUNANISTAN', sehir: '' });
});

test('splitLocation REVIZE ekini ve parantezli zaman damgasını atar', () => {
    assert.deepEqual(splitLocation('SAROS KORFEZI (EGE DENIZI) REVIZE01 (2026.11.10 12:06:09)'), {
        yer: 'SAROS KORFEZI',
        sehir: 'EGE DENIZI'
    });
});

test('parseKandilliLine geçerli satırı ayrıştırır', () => {
    const line = '2026.11.10 12:31:20  38.4627   39.0740       19.2      -.-  1.9  -.-   SARITOSUN-(ELAZIG)   İlksel';
    assert.deepEqual(parseKandilliLine(line), {
        tarih: '2026.11.10',
        saat: '12:31:20',
        enlem: '38.4627',
        boylam: '39.0740',
        derinlik: '19.2',
        buyukluk: '1.9',
        yer: 'SARITOSUN',
        sehir: 'ELAZIG'
    });
});

test('parseKandilliLine şehir alanına durum ekini yazmaz (regresyon)', () => {
    const parsed = parseKandilliHtml(fixture());
    const sehirler = parsed.map(d => d.sehir);
    assert.ok(!sehirler.includes('İlksel'), 'İlksel şehir olarak ayrıştırılmamalı');
    assert.ok(!sehirler.includes('Ilksel'), 'Ilksel şehir olarak ayrıştırılmamalı');
    assert.ok(sehirler.includes('ELAZIG'));
});

test('parseKandilliLine başlık ve boş satırları yok sayar', () => {
    assert.equal(parseKandilliLine('<HTML>'), null);
    assert.equal(parseKandilliLine(''), null);
    assert.equal(parseKandilliLine('2026.11.10 12:31:20 38.46'), null);
});

test('parseKandilliLine büyüklüğü -.- olan satırı reddeder', () => {
    const line = '2026.11.10 12:31:20  38.4627   39.0740       19.2      -.-  -.-  -.-   X (Y)   İlksel';
    assert.equal(parseKandilliLine(line), null);
});

test('parseKandilliHtml fixture içindeki tüm veri satırlarını okur', () => {
    const parsed = parseKandilliHtml(fixture());
    assert.equal(parsed.length, 8);
    assert.equal(parsed[0].tarih, '2026.11.10');
    assert.equal(parsed[0].buyukluk, '1.9');
});

test('parseKandilliHtml boş girdi için boş dizi döner', () => {
    assert.deepEqual(parseKandilliHtml(''), []);
    assert.deepEqual(parseKandilliHtml(null), []);
});

test('normalizeAfadEvent AFAD şemasını uygulama şemasına çevirir', () => {
    const normalized = normalizeAfadEvent({
        eventID: '598747',
        location: 'Ege Denizi - [56.11 km] Karaburun (İzmir)',
        latitude: '38.82483',
        longitude: '25.79567',
        depth: '7',
        magnitude: '3.3',
        province: 'İzmir',
        date: '2026-11-10T08:15:14'
    });
    assert.deepEqual(normalized, {
        tarih: '2026.11.10',
        saat: '08:15:14',
        enlem: '38.82483',
        boylam: '25.79567',
        derinlik: '7',
        buyukluk: '3.3',
        yer: 'Ege Denizi - [56.11 km] Karaburun (İzmir)',
        sehir: 'İzmir'
    });
});

test('normalizeAfadEvent geçersiz kayıtları eler', () => {
    assert.equal(normalizeAfadEvent(null), null);
    assert.equal(normalizeAfadEvent({ magnitude: 'abc', date: '2026-11-10T08:15:14' }), null);
    assert.equal(normalizeAfadEvent({ magnitude: '2.1', date: 'bozuk' }), null);
});

test('normalizeAfadEvents dizi olmayan yükte boş dizi döner', () => {
    assert.deepEqual(normalizeAfadEvents({ hata: true }), []);
    assert.equal(normalizeAfadEvents([{ magnitude: '1.1', date: '2026-11-10T01:02:03', latitude: '1', longitude: '2' }]).length, 1);
});

test('filterDepremler büyüklük alt ve üst sınırını uygular', () => {
    const list = parseKandilliHtml(fixture());
    const result = filterDepremler(list, { min: 2 });
    assert.ok(result.length > 0);
    assert.ok(result.every(d => Number.parseFloat(d.buyukluk) >= 2));

    const capped = filterDepremler(list, { max: 2 });
    assert.ok(capped.every(d => Number.parseFloat(d.buyukluk) <= 2));
});

test('filterDepremler tarih filtresini ayraç duyarsız uygular', () => {
    const list = parseKandilliHtml(fixture());
    assert.equal(filterDepremler(list, { tarih: '2026.11.09' }).length, 2);
    assert.equal(filterDepremler(list, { tarih: '2026-11-09' }).length, 2);
    assert.equal(filterDepremler(list, { tarih: '2026.11.01' }).length, 0);
});

test('filterDepremler şehir filtresini büyük/küçük harf duyarsız uygular', () => {
    const list = parseKandilliHtml(fixture());
    assert.equal(filterDepremler(list, { sehir: 'adana' }).length, 2);
    assert.equal(filterDepremler(list, { sehir: 'ADANA' }).length, 2);
    assert.equal(filterDepremler(list, { sehir: 'İzmir' }).length, 0);
});

test('filterDepremler filtre yokken listeyi aynen döner ve bozuk girdiyi tolere eder', () => {
    const list = parseKandilliHtml(fixture());
    assert.equal(filterDepremler(list, {}).length, list.length);
    assert.deepEqual(filterDepremler(null, {}), []);
    assert.equal(filterDepremler([null, { tarih: '2026.11.10', buyukluk: '5.0' }], {}).length, 1);
});
