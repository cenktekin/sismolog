# Sismolog — Sağlık Raporu

**Denetim tarihi:** 2026-11-10
**Proje:** Türkiye Deprem Takip Sistemi (Node.js/Express + EJS)
**Yöntem:** Kod okuma + gerçek çalıştırma (canlı Kandilli + AFAD verisi, headless Edge duman testi, 31 otomatik test)

---

## 🩺 Sağlık Puanı: 76/100

| Kategori | Puan | Önceki | Gerekçe |
|---|---|---|---|
| Yapısal kalite | 90 | 60 | En büyük JS dosyası 317 satır; sunucu `lib/` altında 3 sorumluluğa ayrıldı, `index.js` 16 satır |
| Test | 80 | 10 | 31 test / 3 dosya / 0 fail; ayrıştırma, yedekleme, önbellek ve API davranışı kapsanıyor. Negatif doğrulandı (bozuk ayrıştırmada 6 test kırmızı). Coverage ölçülmüyor |
| Güvenlik | 70 | 45 | helmet + CSP, rate limit (60/dk/IP), SRI'li CDN; CORS bilinçli olarak yok, `npm audit` 0 açık. Kimlik doğrulama yok (herkese açık okuma API'si) |
| Dokümantasyon | 85 | 80 | README + 4 doküman kodla hizalı; hâlâ ölçülmemiş metrik yok |
| DevOps | 65 | 65 | CI'da sözdizimi + test + derleme + gizlilik kapısı, Security workflow yeşil; **Vercel otomatik deploy kopuk** |

52 → 76. Artış N1–N6'nın kapanmasından. Düşük kalan iki alan: Vercel deploy onarımı (kod tarafı hazır, panel erişimi gerekiyor) ve coverage ölçümü.

---

## ✅ Doğrulananlar (2026-11-10)

- `GET /` → HTTP 200, 30.963 B HTML; `socket.io` referansı yok
- `GET /api/v1/depremler` → HTTP 200, **500 kayıt**, `X-Data-Source: kandilli`
- `?min=3` → 21 kayıt; `?min=3&sehir=ADANA` doğru alt küme
- Şehir ayrıştırma regresyonu: 500 kaydın **0**'ında `sehir` alanı `İlksel`/`KORFEZI` gibi çöp değer taşıyor (eski ayrıştırıcıda bozuktu)
- AFAD yedeği canlı: 239 kayıt (72 saat), tümünde `sehir` dolu
- Yedek devreye girme: Kandilli 503 simülasyonu → 200, `X-Data-Source: afad`, `X-Data-Warning` dolu
- Tüm kaynaklar düşerse → **503** + `details` (sessiz boş liste yok)
- Headless Edge duman testi: 500 kayıt, 500 harita işaretçisi, 57 şehir seçeneği, 20 sayfa, geri sayım çalışıyor, büyüklük filtresi 500→4, sayfa 2 geçişi doğru, localStorage tercihleri kalıcı, **0 konsol/sayfa hatası, 0 başarısız istek**
- `npm test` → 31/31; `npm run check` → 10/10; `npm run build` → 26.113 B; `npm audit --audit-level=high` → 0 açık
- `vercel.json` route simülasyonu → `/css/*`, `/js/*`, `/assets/*` statik; yalnız `/` ve API fonksiyon

## 🔴 Kalan Riskler

1. **Vercel otomatik deploy kopuk** — son production deployment 2026-04-26 / `5c24aef`. Canlı siteyi bayat tutuyor. Kod tarafı (vercel.json + statik ayrım) hazır; Vercel panelinden Git entegrasyonunun yeniden bağlanması gerekiyor. Bu proje için **en yüksek öncelikli açık kalem**.
2. **Kaynak birleştirme yok** — Kandilli ve AFAD birbirinin yerine geçiyor, birleşim yapılmıyor. Kandilli düşerse AFAD son 72 saati verir; 500 kayıtlık geçmiş kaybolur.
3. **Kandilli HTML kazıma** — sayfa yapısı değişirse ayrıştırma kırılır. Artık sessiz değil (`0 kayıt` → kaynak hatası → AFAD yedeği), ama tek başına yeterli değil.
4. **Harita performansı** — 500 Leaflet işaretçisi tek tek ekleniyor; düşük cihazlarda ağır olabilir. Kümeleme (markercluster) değerlendirilmedi.

## 🟡 Orta Riskler

- Ekran görüntüsü 795 KB — repodaki en büyük ikili.
- CDN bağımlılığı SRI ile sabitlendi ama çevrimdışı çalışmıyor.
- `stats.js` 317 satır — 400 sınırının altında, ancak büyüklük/derinlik/bölge/saatlik olarak bölünebilir.
- Rate limit bellek içi sayaç kullanıyor; Vercel çok örnekli ölçekte sayaçlar örnek başına olur.
- CSP `'unsafe-inline'` içeriyor (EJS içindeki inline style/script nedeniyle).

## 🗄️ Temizlik Geçmişi

**2026-10-27:** PHP kalıntıları, çağrılmayan `api/v1/depremler.js`, Heroku/Railway/Render yapılandırmaları, çalıştırılamayan Jest seti, gerçek dışı raporlar, `pnpm-lock.yaml` arşivlendi; `/socket.io/socket.io.js` referansı kaldırıldı; Tailwind build yolu düzeltildi.

**2026-11-10:** Bölme öncesi tek parça `app.js` (1.613 satır) `archive/pre-split/app.js.orig` olarak saklandı. Üretimde çalışan 222 satırlık ölü `testScenario*` bloğu ve çift `DOMContentLoaded` başlatması kaldırıldı.

## 🎯 Sıradaki Adımlar

1. **Vercel Git entegrasyonunu panelden yeniden bağla** → otomatik deploy'u doğrula (canlı `style.css` 26.113 B olmalı)
2. Kandilli + AFAD birleşimi (dedupe: tarih+saat+koordinat) → tek kaynak düşünce geçmiş korunur
3. Lighthouse/performans ölçümü; gerekirse haritada işaretçi kümeleme
4. Coverage ölçümü (`node --test --experimental-test-coverage`) ve eşik belirleme
5. `stats.js` bölme (büyüklük / derinlik / bölge / saatlik)
