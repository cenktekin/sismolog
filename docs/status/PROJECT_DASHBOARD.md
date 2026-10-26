# Proje Panosu — Sismolog

**Ölçüm tarihi:** 2026-10-27 · **Sürüm:** 1.0.0

## Genel

| Bilgi | Değer |
|---|---|
| Proje | Sismolog — Türkiye Deprem Takip Sistemi |
| Tür | Tek sayfa web uygulaması (Express + EJS + Leaflet) |
| Durum | Yayında (Vercel), bakımda |
| Lisans | MIT |
| Repo | github.com/cenktekin/sismolog |

## Doğrulanmış Ölçümler (2026-10-27)

| Metrik | Değer | Nasıl ölçüldü |
|---|---|---|
| Ana sayfa | HTTP 200, ~30 KB HTML | `npm start` + yerel istek |
| API yanıtı | HTTP 200, 500 kayıt, ~77 KB JSON | `/api/v1/depremler` |
| Veri kaynağı | Kandilli (canlı) | Ayrıştırma gerçek veriyle çalıştı |
| CSS derlemesi | 26,7 KB | `npm run build` |
| Sözdizimi kapısı | 3/3 dosya | `npm run check` |
| Çalışma zamanı bağımlılığı | 3 (dotenv, ejs, express) | package.json |
| Geliştirme bağımlılığı | 3 (autoprefixer, nodemon, tailwindcss) | package.json |
| Otomatik test | Yok | — |
| Ekran görüntüsü | 795 KB (eski 3,4 MB) | 1280 px genişliğe indirildi |

> Ölçülmemiş hiçbir metrik (uptime, kullanıcı sayısı, Lighthouse skoru, coverage) buraya yazılmaz.

## Kod Dağılımı

| Dosya | Satır | Not |
|---|---|---|
| `assets/js/app.js` | 1361 | Harita + liste + filtre + yenileme tek dosyada (400 satır kuralı ihlali) |
| `assets/js/stats.js` | 273 | Grafikler |
| `index.js` | 181 | Sunucu |
| `views/index.ejs` | ~415 | Arayüz şablonu |
| `assets/css/stats.css` | 17,8 KB | El yazımı stiller |

## Sağlık

| Alan | Durum |
|---|---|
| Çalışırlık | 🟢 Canlı veriyle doğrulandı |
| Test | 🔴 Yok |
| CI | 🟡 Derleme + secret taraması var, test adımı yok |
| Güvenlik başlıkları | 🔴 Yok (Helmet/CORS/rate limit yok) |
| Veri dayanıklılığı | 🟡 Tek kaynak, kazımaya bağımlı |
| Doküman doğruluğu | 🟢 2026-10-27'de gerçekle hizalandı |

## Açık İşler

`docs/status/DEVELOPMENT_STATUS.md` → Sıradaki İşler bölümü.
