# Sismolog — Sağlık Raporu

**Denetim Tarihi:** 2026-05-19
**Proje:** Türkiye Deprem Takip Sistemi (Node.js/Express)
**Dosya Sayısı:** 102 (node_modules hariç)

---

## 🩺 Sağlık Puanı: 68/100

| Kategori | Puan | Açıklama |
|----------|------|----------|
| Yapısal Kalite | 60 | `app.js` 1612 satır — makul ama refactor gerektirir |
| Test Coverage | 50 | 5 test dosyası var ama `npm test` çalışmıyor |
| Güvenlik | 80 | Helmet, rate limiting, .env.example mevcut |
| Dokümantasyon | 85 | Kapsamlı README, CI/CD yapılandırmaları mevcut |
| DevOps | 75 | Vercel, Railway, Render, GitHub Actions entegre |

---

## 💪 Güçlü Yanlar

- **Dökümantasyon zengini:** README hem Türkçe hem teknik detay içeriyor. docs/ klasöründe API, mimari, development rehberleri var.
- **CI/CD Olgun:** GitHub Actions (ci, code-quality, deploy, security), Vercel, Railway, Render — 4 farklı deploy hedefi.
- **Güvenlik farkındalığı:** Helmet, rate limiting, input validation, CORS, Winston logging. `.env.example` mevcut.
- **Test altyapısı:** 5 test dosyası (unit + integration), Jest yapılandırması mevcut.
- **Proje yapısı temiz:** `api/`, `assets/`, `views/`, `tests/`, `docs/` ayrıştırması başarılı.

---

## ⚠️ Riskler

### 🔴 Yüksek
- **Monolitik app.js (1612 satır):** Tüm frontend mantığı tek dosyada. 41 fonksiyon, Leaflet harita, DOM manipülasyonu, filtreleme, auto-update hepsi iç içe. Test edilebilirlik düşük.
- **Sahte test konfigürasyonu:** `package.json`'da `"test": "echo No tests configured"` — gerçek test koşucusu yok. 5 test dosyası mevcut ama `npm test` çalıştırılamıyor.
- **Web scraping bağımlılığı:** Kandilli sitesinden HTML scrape ile veri çekiliyor. Site yapısı değişirse uygulama kırılır.

### 🟡 Orta
- **.vercel/ dizini git'te:** `vercel.json` ve `.vercel/` git'e eklenmiş (`.gitignore`'da `.vercel` olmasına rağmen).
- **İki farklı API implementasyonu:** `index.js` (181 satır) ve `api/v1/depremler.js` (222 satır) — aynı işi yapan iki farklı endpoint, muhtemelen Express route vs serverless API çakışması.
- **PHP kalıntısı:** `index.php` dosyası mevcut — Node projesinde PHP dosyası ne işe yarıyor?

### 🟢 Düşük
- **`.kiro/` dizini git'te olmamalı:** Geliştirme araçları `.gitignore`'da ama kontrol edilmeli.
- **Log dosyaları git'te:** `server.log` git'te. `.gitignore`'da `*.log` var ama `server.log` hala takip ediliyor olabilir.

---

## 🎯 Öneriler

### 1. `app.js`'i modüllere böl (ACİL)
1612 satırlık dev dosyayı şu modüllere ayır:
- `assets/js/map.js` — Leaflet harita mantığı (~300 satır)
- `assets/js/quake-data.js` — API çağrıları ve filtreleme (~200 satır)
- `assets/js/ui.js` — DOM manipülasyonu ve event handler (~400 satır)
- `assets/js/app.js` — Ana orchestrator (~100 satır, geri kalanı import)

### 2. Test altyapısını çalışır hale getir
```json
"test": "jest --colors",
"test:coverage": "jest --coverage"
```
Mevcut 5 test dosyası `jest` ile çalışacak şekilde düzenlenmeli. `api.test.js`, `depremler.test.js` çalıştırılabilir olmalı.

### 3. PHP ve yinelenen API'leri temizle
- `index.php`'yi sil veya taşı
- Express API (`index.js`) ile serverless API (`api/v1/`) arasında karar ver, birini kaldır
- `.vercel/` dizinini `.gitignore`'a ekle (`/.vercel`)

---

## 📊 Detaylar

### Büyük Dosyalar
| Dosya | Satır | Fonksiyon | Risk |
|-------|-------|-----------|------|
| `assets/js/app.js` | 1612 | 41 | 🔴 Monolitik, tüm UI mantığı |
| `api/v1/depremler.js` | 222 | ~8 | 🟡 Serverless API |
| `index.js` | 181 | ~6 | 🟡 Express API |

### Test Durumu
| Test Dosyası | Durum |
|-------------|-------|
| `tests/unit/api/api.test.js` | ❓ Mevcut ama çalışmıyor |
| `tests/unit/services/services.test.js` | ❓ Mevcut ama çalışmıyor |
| `tests/integration/api.test.js` | ❓ Mevcut ama çalışmıyor |
| `tests/integration/endpoints/depremler.test.js` | ❓ Mevcut ama çalışmıyor |

**Komut:** `npm test` → ❌ "No tests configured"

### Güvenlik
- ✅ Helmet güvenlik başlıkları
- ✅ Rate limiting
- ✅ CORS konfigürasyonu
- ✅ `.env.example` mevcut
- ❌ `server.log` git'te (log sızıntısı)
- ❌ `logs/` dizini git'te

---

*Rapor otomatik oluşturulmuştur. Düzenli refactoring önerilir.*
