# Geliştirme Durumu — Sismolog

**Son doğrulama:** 2026-11-10
**Sürüm:** 1.1.0

Bu dosya yalnızca kodda gerçekten var olan şeyleri listeler. Doğrulanmamış iddia yazılmaz.

## ✅ Çalışan Özellikler

### Backend
- Express 4 uygulaması — `index.js` (16 satır, giriş noktası) + `lib/app.js` (uygulama kabuğu)
- `lib/parse.js` — saf ayrıştırma/filtre fonksiyonları (test edilebilir, DOM/ağ bağımsız)
- `lib/sources.js` — Kandilli (HTML, windows-1254) + AFAD (JSON, son 72 saat) kaynakları ve otomatik yedekleme
- 2 dakikalık bellek içi önbellek; kaynak düşünce `stale`, hiç kaynak yoksa **503 + görünür hata**
- `GET /` — EJS ile tek sayfa
- `GET /api/v1/depremler` — `tarih`, `min`, `max`, `sehir` filtreleri + `X-Cache-*` ve `X-Data-Source/Warning` başlıkları
- `helmet` güvenlik başlıkları + CSP, `express-rate-limit` (60 istek/dk/IP)
- Vercel'e tek serverless fonksiyon olarak dağıtım (`module.exports = app`)

### Frontend
- `views/index.ejs` — harita + liste + filtre + istatistik düzeni
- `assets/js/core.js` (149) — paylaşılan durum, DOM yardımcıları, mesafe/en yakın deprem
- `assets/js/map.js` (205) — Leaflet haritası, işaretçiler, popup, odaklanma
- `assets/js/list.js` (171) — filtre, sayfalama, tablo render
- `assets/js/refresh.js` (222) — veri çekme, otomatik yenileme, geri sayım, localStorage
- `assets/js/app.js` (51) — kabuk: olay bağlama ve başlatma
- `assets/js/stats.js` (317) — Chart.js ile 4 istatistik kartı (24 saat, büyüklük, derinlik, bölge)
- Leaflet + Chart.js CDN'den **SRI ile sabitlenmiş**
- Koyu tema, mobil/tablet düzeni

### Altyapı
- Tailwind CSS 3 build-time derleme (`npm run build` → `public/css/style.css`, 26.113 B)
- `npm run check` — sözdizimi kapısı (10 dosya)
- `npm test` — `node:test`, 31 test / 3 dosya / 0 fail (ek bağımlılık yok)
- GitHub Actions CI: sözdizimi + **test** + derleme + gizlilik kapısı
- GitHub Actions Security: `npm audit --audit-level=high` + TruffleHog (haftalık zamanlanmış)

## ❌ Kodda Olmayanlar (dokümanlarda geçmişte yanlışlıkla "var" denmişti)

| İddia | Gerçek |
|---|---|
| JWT / session / kullanıcı sistemi | Yok |
| Veritabanı (MongoDB/PostgreSQL) | Yok — veri yalnız bellekte |
| Socket.IO / gerçek zamanlı itme | Yok — istemci 120 sn'de bir kendisi çeker |
| CORS yapılandırması | Yok (bilinçli; aynı origin) |
| Winston / dosya loglama | Yok (`console.error` kullanılıyor) |
| Cheerio / Moment.js / Supertest / ESLint | Bağımlılık değil |
| Jest / coverage | Yok — `node:test` kullanılıyor, coverage ölçülmüyor |
| Docker | Yok |

## 🗄️ Arşivlenenler

`archive/2026-10-27-legacy/` altına taşındı, repo geçmişinde duruyor:

- `api-v1-depremler.js` — `request`/`cheerio`/`winston` istiyor, bağımlılıkları yok, hiç çağrılmıyordu
- `api-index.php`, `index.php` — Node projesinde PHP kalıntısı
- `railway.json`, `render.yaml`, `Procfile` — kullanılmayan dağıtım hedefleri
- `secrets-setup.md` — Heroku/Slack/Snyk secret talimatları (bu altyapı yok)
- `jest.config.js` + `tests/` — gerçek kodu import etmeyen, çalıştırılamayan testler
- `master-tasks.md`, `OTOMATIK_GUNCELLEME_TEST_RAPORU.md`, `DEVELOPMENT.md` — gerçekle uyuşmayan rapor/rehberler
- `pnpm-lock.yaml` — README `npm` diyor, `package-lock.json` kanonik

`archive/pre-split/app.js.orig` — 2026-11-10 bölme öncesi tek parça `app.js` (1.613 satır) referans olarak duruyor.

## ✅ 2026-11-10 Turunda Kapananlar

| # | Kalem | Sonuç |
|---|---|---|
| N1 | Test altyapısı | `lib/parse.js` + `lib/sources.js` + `lib/app.js`; 31 test; bozuk ayrıştırmada 6 test kırmızı (negatif doğrulandı) |
| N2 | `app.js` bölme | 1.613 → 51 satır; modüller 149/205/171/222; tarayıcıda doğrulandı |
| N3 | Güvenlik | Karar: **A** — helmet + rate limit eklendi, README güncellendi |
| N4 | İkinci veri kaynağı | AFAD yedeği devrede; Kandilli simüle düşüşünde 200 + `X-Data-Source: afad` |
| N5 | CDN | Karar: **A** — SRI + crossorigin eklendi (Leaflet, Chart.js, datalabels) |
| N6 | Vercel statik yönlendirme | `vercel.json` statik/fonksiyon ayrımı; yerel simülasyonda 3 statik / 2 fonksiyon |

## 🔜 Sıradaki İşler

1. **Vercel Git entegrasyonu** — son production deploy 2026-04-26 (`5c24aef`); panelden yeniden bağlanmalı (kod tarafı hazır).
2. Lighthouse / performans ölçümü (haritada 500 işaretçi ağır olabilir; kümeleme değerlendirilmeli).
3. Kandilli + AFAD kayıtlarını birleştirme (şu an biri diğerinin yerine geçiyor, birleşim değil).
4. `stats.js` (317 satır) da bölünebilir: büyüklük / derinlik / bölge / saatlik.
