'use strict';

const DATE_RE = /^\d{4}\.\d{2}\.\d{2}$/;
const TIME_RE = /^\d{2}:\d{2}:\d{2}$/;
const NUM_RE = /^-?\d+(?:\.\d+)?$/;
const STATUS_SUFFIX = /\s+(?:İlksel|Ilksel|REVIZE\d*|REVİZE\d*)(?:\s*\([^)]*\))?\s*$/iu;

function cleanLine(line) {
    return String(line)
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function splitLocation(raw) {
    let location = String(raw || '').replace(/-\s*\(/g, ' (').trim();
    let previous;
    do {
        previous = location;
        location = location.replace(STATUS_SUFFIX, '').trim();
    } while (location !== previous);

    const withCity = location.match(/\(([^()]*)\)\s*$/);
    if (!withCity) {
        return { yer: location, sehir: '' };
    }

    const yer = location.slice(0, withCity.index).trim().replace(/[-\s]+$/, '');
    return { yer, sehir: withCity[1].trim() };
}

function parseKandilliLine(rawLine) {
    const line = cleanLine(rawLine);
    if (!line) return null;

    const tokens = line.split(' ');
    if (tokens.length < 9) return null;

    const [tarih, saat, enlem, boylam, derinlik] = tokens;
    if (!DATE_RE.test(tarih) || !TIME_RE.test(saat)) return null;
    if (!NUM_RE.test(enlem) || !NUM_RE.test(boylam) || !NUM_RE.test(derinlik)) return null;

    const buyukluk = NUM_RE.test(tokens[6]) ? tokens[6] : null;
    if (!buyukluk) return null;

    const { yer, sehir } = splitLocation(tokens.slice(8).join(' '));

    return { tarih, saat, enlem, boylam, derinlik, buyukluk, yer, sehir };
}

function parseKandilliHtml(html) {
    if (!html) return [];
    const depremler = [];
    for (const line of String(html).split(/\r?\n/)) {
        const deprem = parseKandilliLine(line);
        if (deprem) depremler.push(deprem);
    }
    return depremler;
}

function normalizeAfadEvent(event) {
    if (!event || typeof event !== 'object') return null;

    const [tarih, saat] = String(event.date || '').split('T');
    if (!tarih || !saat) return null;

    const buyukluk = Number(event.magnitude);
    if (!Number.isFinite(buyukluk)) return null;

    const enlem = Number(event.latitude);
    const boylam = Number(event.longitude);
    if (!Number.isFinite(enlem) || !Number.isFinite(boylam)) return null;

    return {
        tarih: tarih.replace(/-/g, '.'),
        saat: saat.slice(0, 8),
        enlem: String(enlem),
        boylam: String(boylam),
        derinlik: String(event.depth ?? ''),
        buyukluk: String(buyukluk),
        yer: String(event.location || '').trim(),
        sehir: String(event.province || '').trim()
    };
}

function normalizeAfadEvents(payload) {
    if (!Array.isArray(payload)) return [];
    return payload.map(normalizeAfadEvent).filter(Boolean);
}

function normalizeDate(value) {
    return String(value).trim().replace(/[/-]/g, '.');
}

function filterDepremler(list, filters = {}) {
    if (!Array.isArray(list)) return [];

    const tarih = filters.tarih ? normalizeDate(filters.tarih) : null;
    const min = Number(filters.min);
    const max = Number(filters.max);
    const sehir = filters.sehir ? String(filters.sehir).trim().toUpperCase() : null;

    return list.filter((deprem) => {
        if (!deprem || typeof deprem !== 'object') return false;
        if (tarih && normalizeDate(deprem.tarih) !== tarih) return false;

        const buyukluk = Number.parseFloat(deprem.buyukluk);
        if (Number.isFinite(min) && !(buyukluk >= min)) return false;
        if (Number.isFinite(max) && !(buyukluk <= max)) return false;

        if (sehir) {
            const depremSehir = String(deprem.sehir || '').trim().toUpperCase();
            if (depremSehir !== sehir) return false;
        }

        return true;
    });
}

function decodeKandilliBodies(buffer) {
    try {
        return new TextDecoder('windows-1254').decode(buffer);
    } catch {
        return Buffer.from(buffer).toString('latin1');
    }
}

module.exports = {
    cleanLine,
    splitLocation,
    parseKandilliLine,
    parseKandilliHtml,
    normalizeAfadEvent,
    normalizeAfadEvents,
    filterDepremler,
    decodeKandilliBodies
};
