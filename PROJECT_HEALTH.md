# Sismolog — Sağlık Raporu

**Denetim tarihi:** 2026-10-27
**Proje:** Türkiye Deprem Takip Sistemi (Node.js/Express + EJS)
**Yöntem:** Kod okuma + gerçek çalıştırma (sunucu açıldı, canlı Kandilli verisi çekildi)

---

## 🩺 Sağlık Puanı: 52/100

| Kategori | Puan | Gerekçe |
|---|---|---|
| Yapısal kalite | 60 | Sunucu 181 satır ve okunur; `assets/js/app.js` 1361 satır (400 kuralı ihlali) |
| Test | 10 | Otomatik test yok; eski testler gerçek kodu import etmiyordu → arşivlendi |
| Güvenlik | 45 | Sır/yol sızıntısı yok, `npm audit` 0 açık; ancak Helmet/CORS/rate limit yok |
| Dokümantasyon | 80 | 2026-10-27'de kodla hizalandı; yanıltıcı iddialar temizlendi |
| DevOps | 65 | CI (build + gizlilik taraması) ve Security (audit + secret scan) var; Vercel otomatik deploy |

Önceki inceleme puanı 45/100 (2026-10-17). Artış, doküman-kod çelişkisinin ve ölü altyapının temizlenmesinden; düşük kalan alanlar test ve güvenlik sertleştirmesi.

---

## ✅ Doğrulananlar (2026-10-27)

- `npm start` + `GET /` → HTTP 200, ~30 KB HTML, harita kabı mevcut
- `GET /api/v1/depremler` → HTTP 200, **500 kayıt** (canlı veri), `?min=3` → 13 kayıt
- `npm run build` → exit 0, `public/css/style.css` 26,7 KB
- `npm run check` → exit 0 (index.js + app.js + stats.js)
- `npm audit` → **0 açık** (express 4.22.3; 5 açık kapatıldı)
- Özel anahtar/Yol taraması (gitleaks + `git grep`) → gerçek sır yok

## 🔴 Kalan Riskler

1. **Tek veri kaynağı + kazıma**: Kandilli HTML yapısı değişirse ayrıştırma sessizce boş liste döndürür (hata yükseltmez).
2. **`assets/js/app.js` 1361 satır**: harita, liste, filtre ve yenileme tek dosyada; regresyon riski yüksek.
3. **Test yok**: ayrıştırma mantığı (`getirDepremler`) ve filtreler korumasız.
4. **HTTP güvenlik başlıkları yok**: Helmet, CORS ve rate limiting eklenmemiş.
5. **`index.js` içinde ayrıştırma**: saf fonksiyon olarak ayrılmadığı için test edilemiyor.

## 🟡 Orta Riskler

- Ekran görüntüsü 795 KB (3,4 MB'tan indirildi); hâlâ en büyük ikili dosya.
- `views/index.ejs` içinde Leaflet/Chart.js CDN'e bağımlı (çevrimdışı çalışmaz, SRI yok).
- `vercel.json` tüm trafiği tek fonksiyona yönlendiriyor; statik dosyalar da fonksiyondan geçiyor.

## 🗄️ 2026-10-27 Temizliği

Arşivlenen (public ağaçtan çıkarıldı): PHP kalıntıları (`index.php`, `api/index.php`), çağrılmayan `api/v1/depremler.js`, Heroku/Railway/Render yapılandırmaları, çalıştırılamayan Jest test seti, gerçek dışı `master-tasks`/test raporu/API-mimari rehberleri, `pnpm-lock.yaml`, `ALIAS_MAP.json`.
Ayrıca: var olmayan `/socket.io/socket.io.js` referansı kaldırıldı; Tailwind build yolu düzeltildi (CDN değil, derlenmiş CSS).

## 🎯 Sıradaki Adımlar

1. Ayrıştırma + filtreleri `lib/` altına saf fonksiyon olarak çıkar, `node:test` ile kapsa
2. `app.js`'i harita/liste/filtre/yenileme modüllerine böl
3. Helmet + rate limiting ekle (davranış değişikliği — ayrı karar)
4. İkinci veri kaynağı (AFAD/EMSC) + kaynak düşünce uyarı
5. CDN varlıkları için SRI veya yerel kopya
