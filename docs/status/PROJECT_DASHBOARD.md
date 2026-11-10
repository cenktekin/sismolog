# Proje Panosu — Sismolog

**Ölçüm tarihi:** 2026-11-10 · **Sürüm:** 1.1.0

## Genel

| Bilgi | Değer |
|---|---|
| Proje | Sismolog — Türkiye Deprem Takip Sistemi |
| Tür | Tek sayfa web uygulaması (Express + EJS + Leaflet) |
| Durum | Yayında (Vercel, **deploy kopuk** — panel onarımı bekliyor), bakımda |
| Lisans | MIT |
| Repo | github.com/cenktekin/sismolog (PUBLIC) |

## Doğrulanmış Ölçümler (2026-11-10)

| Metrik | Değer | Nasıl ölçüldü |
|---|---|---|
| Ana sayfa | HTTP 200, 30.963 B HTML | yerel sunucu + istek |
| API yanıtı | HTTP 200, 500 kayıt, 76.703 B JSON | `/api/v1/depremler`, kaynak `kandilli` |
| AFAD yedeği | 239 kayıt (72 saat), tümünde `sehir` dolu | `fetchAfad()` canlı |
| Yedek devreye girme | Kandilli 503 simülasyonu → 200, `X-Data-Source: afad` | entegrasyon testi |
| CSS derlemesi | 26.113 B | `npm run build` |
| Sözdizimi kapısı | 10/10 dosya | `npm run check` |
| Otomatik test | **31/31 geçti** (3 dosya) | `npm test` |
| Negatif doğrulama | Bozuk ayrıştırmada 6 test kırmızı | bilinçli mutasyon |
| Tarayıcı duman testi | 500 kayıt, 500 işaretçi, 57 şehir, 20 sayfa, 0 konsol hatası | headless Edge + CDP |
| npm audit | 0 açık (high+) | `npm audit --audit-level=high` |
| Çalışma zamanı bağımlılığı | 5 (dotenv, ejs, express, express-rate-limit, helmet) | package.json |
| Geliştirme bağımlılığı | 3 (autoprefixer, nodemon, tailwindcss) | package.json |
| Ekran görüntüsü | 795 KB (eski 3,4 MB) | 1280 px genişliğe indirildi |

> Ölçülmemiş hiçbir metrik (uptime, kullanıcı sayısı, Lighthouse skoru, coverage) buraya yazılmaz.

## Kod Dağılımı

| Dosya | Satır | Not |
|---|---|---|
| `assets/js/refresh.js` | 222 | Veri çekme + otomatik yenileme + tercihler |
| `assets/js/map.js` | 205 | Leaflet + işaretçiler |
| `assets/js/list.js` | 171 | Filtre + sayfalama + tablo |
| `assets/js/core.js` | 149 | Paylaşılan durum + yardımcılar |
| `assets/js/stats.js` | 317 | Grafikler (400 sınırı altında, bölünebilir) |
| `assets/js/app.js` | 51 | Kabuk (eski 1.613) |
| `lib/sources.js` | 122 | Kaynak seçimi + önbellek |
| `lib/app.js` | 111 | Express + helmet + rate limit |
| `lib/parse.js` | 139 | Saf ayrıştırma |
| `index.js` | 16 | Giriş noktası (eski 181) |
| `views/index.ejs` | ~432 | Arayüz şablonu |
| `assets/css/stats.css` | 17,8 KB | El yazımı stiller |

Tüm JS dosyaları 400 satır sınırının altında.

## Sağlık

| Alan | Durum |
|---|---|
| Çalışırlık | 🟢 Canlı veriyle + headless tarayıcıyla doğrulandı |
| Test | 🟢 31 test, CI'da çalışıyor, negatif doğrulanmış |
| CI | 🟢 Sözdizimi + test + derleme + gizlilik kapısı |
| Güvenlik başlıkları | 🟢 helmet + CSP + rate limit |
| Veri dayanıklılığı | 🟢 Kandilli + AFAD yedeği, görünür hata |
| CDN bağımlılığı | 🟡 SRI var, çevrimdışı yok |
| Deploy | 🔴 Vercel Git entegrasyonu kopuk (son deploy 2026-04-26) |
| Doküman doğruluğu | 🟢 2026-11-10'da gerçekle hizalandı |

## Açık İşler

`docs/status/DEVELOPMENT_STATUS.md` → Sıradaki İşler bölümü.
