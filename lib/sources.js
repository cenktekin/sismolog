'use strict';

const { parseKandilliHtml, normalizeAfadEvents, decodeKandilliBodies } = require('./parse');

const KANDILLI_URL = 'http://www.koeri.boun.edu.tr/scripts/lst0.asp';
const AFAD_URL = 'https://deprem.afad.gov.tr/apiv2/event/filter';
const CACHE_DURATION = 2 * 60 * 1000;
const REQUEST_TIMEOUT = 12000;
const USER_AGENT = 'sismolog/1.0 (+https://github.com/cenktekin/sismolog)';

async function fetchWithTimeout(fetchImpl, url, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
        return await fetchImpl(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
    }
}

async function fetchKandilli(fetchImpl) {
    const response = await fetchWithTimeout(fetchImpl, KANDILLI_URL, {
        headers: { 'User-Agent': USER_AGENT }
    });
    if (!response.ok) {
        throw new Error(`Kandilli HTTP ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const depremler = parseKandilliHtml(decodeKandilliBodies(buffer));
    if (depremler.length === 0) {
        throw new Error('Kandilli yanıtı ayrıştırılamadı (0 kayıt)');
    }
    return depremler;
}

function buildAfadUrl(hours) {
    const pad = (value) => String(value).padStart(2, '0');
    const format = (date) => {
        const base = `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
        return `${base}T${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`;
    };
    const end = new Date();
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
    return `${AFAD_URL}?start=${format(start)}&end=${format(end)}&limit=500`;
}

async function fetchAfad(fetchImpl) {
    const response = await fetchWithTimeout(fetchImpl, buildAfadUrl(72), {
        headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' }
    });
    if (!response.ok) {
        throw new Error(`AFAD HTTP ${response.status}`);
    }
    const depremler = normalizeAfadEvents(await response.json());
    if (depremler.length === 0) {
        throw new Error('AFAD yanıtı boş');
    }
    return depremler;
}

const DEFAULT_SOURCES = [
    { name: 'kandilli', load: fetchKandilli },
    { name: 'afad', load: fetchAfad }
];

function createDepremService({ fetchImpl = globalThis.fetch, sources = DEFAULT_SOURCES, now = Date.now } = {}) {
    let cached = null;
    let lastFetchTime = 0;
    let lastSource = null;

    async function refresh() {
        const errors = [];
        for (const source of sources) {
            try {
                const depremler = await source.load(fetchImpl);
                cached = depremler;
                lastFetchTime = now();
                lastSource = source.name;
                return { depremler, source: source.name, fetchedAt: lastFetchTime, errors };
            } catch (error) {
                errors.push({ source: source.name, message: error.message });
                console.error(`[sismolog] ${source.name} kaynağı başarısız: ${error.message}`);
            }
        }
        return { depremler: null, source: null, fetchedAt: lastFetchTime, errors };
    }

    async function getirDepremler() {
        const fresh = cached && (now() - lastFetchTime) < CACHE_DURATION;
        if (fresh) {
            return { depremler: cached, source: 'cache', origin: lastSource, fetchedAt: lastFetchTime, errors: [] };
        }

        const result = await refresh();
        if (result.depremler) return result;

        if (cached) {
            return {
                depremler: cached,
                source: 'stale',
                origin: lastSource,
                fetchedAt: lastFetchTime,
                errors: result.errors
            };
        }

        return { depremler: null, source: null, fetchedAt: 0, errors: result.errors };
    }

    return { getirDepremler, cacheDuration: CACHE_DURATION };
}

module.exports = {
    KANDILLI_URL,
    AFAD_URL,
    CACHE_DURATION,
    buildAfadUrl,
    fetchKandilli,
    fetchAfad,
    createDepremService
};
