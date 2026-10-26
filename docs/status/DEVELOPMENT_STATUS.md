# Geliştirme Durumu — Sismolog

**Son doğrulama:** 2026-10-27
**Sürüm:** 1.0.0

Bu dosya yalnızca kodda gerçekten var olan şeyleri listeler. Doğrulanmamış iddia yazılmaz.

## ✅ Çalışan Özellikler

### Backend
- Express 4 uygulaması (`index.js`, 181 satır)
- Kandilli listesinden HTML kazıma + ayrıştırma (`fetch`, Node 18+ global)
- 2 dakikalık bellek içi önbellek; hata durumunda son önbellek, o da yoksa boş liste
- `GET /` — EJS ile tek sayfa
- `GET /api/v1/depremler` — `tarih`, `min`, `max`, `sehir` filtreleri + `X-Cache-*` başlıkları
- Vercel'e tek serverless fonksiyon olarak dağıtım (`module.exports = app`)

### Frontend
- `views/index.ejs` — harita + liste + filtre + istatistik düzeni
- `assets/js/app.js` — Leaflet haritası, liste, filtreler, otomatik yenileme, geri sayım, localStorage ayarları
- `assets/js/stats.js` — Chart.js ile 4 istatistik kartı (24 saat, büyüklük, derinlik, bölge)
- Koyu tema, mobil/tablet düzeni

### Altyapı
- Tailwind CSS 3 build-time derleme (`npm run build` → `public/css/style.css`)
- `npm run check` — sözdizimi kapısı (3 dosya)
- GitHub Actions: derleme + gizli anahtar taraması
- Vercel otomatik dağıtım (GitHub push → deploy)

## ❌ Kodda Olmayanlar (dokümanlarda geçmişte yanlışlıkla "var" denmişti)

| İddia | Gerçek |
|---|---|
| JWT / session / kullanıcı sistemi | Yok |
| Veritabanı (MongoDB/PostgreSQL) | Yok — veri yalnız bellekte |
| Socket.IO / gerçek zamanlı itme | Yok — istemci 120 sn'de bir kendisi çeker |
| Helmet / CORS / rate limiting | Yok |
| Winston / dosya loglama | Yok (`console.error` kullanılıyor) |
| Cheerio / Moment.js / Supertest / ESLint | Bağımlılık değil |
| Jest ile otomatik test, %85 coverage | Yok |
| Docker | Yok |

## 🗄️ Arşivlenenler (2026-10-27)

`archive/2026-10-27-legacy/` altına taşındı, repo geçmişinde duruyor:

- `api-v1-depremler.js` — `request`/`cheerio`/`winston` istiyor, bağımlılıkları yok, hiç çağrılmıyordu
- `api-index.php`, `index.php` — Node projesinde PHP kalıntısı
- `railway.json`, `render.yaml`, `Procfile` — kullanılmayan dağıtım hedefleri
- `secrets-setup.md` — Heroku/Slack/Snyk secret talimatları (bu altyapı yok)
- `jest.config.js` + `tests/` — gerçek kodu import etmeyen, çalıştırılamayan testler
- `master-tasks.md`, `OTOMATIK_GUNCELLEME_TEST_RAPORU.md`, `DEVELOPMENT.md` — gerçekle uyuşmayan rapor/rehberler
- `pnpm-lock.yaml` — README `npm` diyor, `package-lock.json` kanonik

## 🔜 Sıradaki İşler

1. Gerçek testler (saf ayrıştırma fonksiyonunu `lib/parse.js`e çıkar + `node:test`)
2. `assets/js/app.js` (1361 satır) modüllere bölme — harita / liste / filtreler / otomatik yenileme
3. Sunucu tarafı sertleştirme: Helmet + rate limiting (davranış değişikliği, ayrı karar)
4. İkinci veri kaynağı (AFAD/EMSC) + kaynak düşünce yedekleme
