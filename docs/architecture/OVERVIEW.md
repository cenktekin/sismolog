# Mimari Genel Bakış — Sismolog

## Bileşenler

```
Tarayıcı
  └─ views/index.ejs
       ├─ core.js     (durum + yardımcılar)
       ├─ map.js      (Leaflet + işaretçiler)
       ├─ list.js     (filtre + sayfalama + tablo)
       ├─ refresh.js  (fetch + otomatik yenileme + tercihler)
       ├─ stats.js    (Chart.js kartları)
       └─ app.js      (kabuk: olay bağlama)
        │  fetch /api/v1/depremler (120 sn'de bir)
        ▼
Express uygulaması (lib/app.js)
  ├─ helmet + rate limit (API: 60 istek/dk/IP)
  ├─ GET /                    → EJS render
  ├─ GET /api/v1/depremler    → filtre + JSON
  └─ createDepremService()    → 2 dk bellek içi önbellek + yedek kaynak
        │
        ├─ 1) Kandilli HTML (koeri.boun.edu.tr/scripts/lst0.asp)
        └─ 2) AFAD JSON     (deprem.afad.gov.tr/apiv2/event/filter)
```

## Akış

1. İstek geldiğinde `getirDepremler()` önbelleğe bakar; 2 dakikadan yeniyse `X-Data-Source: cache` ile döner.
2. Değilse kaynaklar sırayla denenir: önce Kandilli (HTML kazıma, windows-1254 çözümü), başarısızsa AFAD (JSON, son 72 saat).
3. `lib/parse.js` içindeki saf fonksiyonlar satırı/olayı uygulama şemasına çevirir (`tarih, saat, enlem, boylam, derinlik, buyukluk, yer, sehir`).
4. Sonuç önbelleğe yazılır. Tüm kaynaklar düşerse bayat önbellek `stale` olarak sunulur; önbellek de yoksa API **503** döner.
5. API rotası `tarih/min/max/sehir` filtrelerini uygular ve `X-Cache-*` / `X-Data-*` başlıklarıyla yanıtlar.

## Güvenlik

- `helmet`: CSP (CDN'ler ve OpenStreetMap karoları için beyaz liste), `nosniff`, `X-Frame-Options`.
- `express-rate-limit`: API rotasında IP başına 60 istek/dakika; Vercel'de `trust proxy` açık.
- CORS yapılandırması bilinçli olarak yok — istemci aynı origin'den konuşur.
- CDN varlıkları SRI (`integrity` + `crossorigin`) ile sabitlenmiştir.

## Dağıtım

- Vercel: `vercel.json` statik yolları (`/css/*`, `/js/*`, `/assets/*`) CDN'den servis eder; yalnız `/` ve API `lib/app.js` fonksiyonuna düşer.
- `NODE_ENV=production` iken `app.listen()` çağrılmaz; dinleme Vercel tarafından yapılır.
- CSS derlemesi (`public/css/style.css`) build sırasında üretilir, repoda tutulmaz.

## Bilinçli Olarak Yok

| Katman | Neden yok |
|---|---|
| Veritabanı | Veri kaynağı zaten 500 kayıtlık güncel liste; kalıcılık gereksinimi yok |
| Kullanıcı/JWT/session | Tek amaçlı, herkese açık okuma uygulaması |
| Socket.IO | 120 saniyelik periyodik çekme yeterli; sunucu tarafı itme gereksiz |
| Redis | Tek örnek, bellek içi önbellek yeterli |
| Docker | Vercel serverless hedefi var |

Bu katmanlar eklenecekse ayrı bir gereksinim ve karar gerekir; mevcut dokümanlarda "var" sayılmamalıdır.
