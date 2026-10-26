# Mimari Genel Bakış — Sismolog

## Bileşenler

```
Tarayıcı
  └─ views/index.ejs + assets/js/app.js + assets/js/stats.js
        │  fetch /api/v1/depremler (120 sn'de bir)
        ▼
Express uygulaması (index.js)
  ├─ GET /                    → EJS render
  ├─ GET /api/v1/depremler    → filtre + JSON
  └─ getirDepremler()         → 2 dk bellek içi önbellek
        │  HTTP GET (kazıma)
        ▼
Kandilli Rasathanesi listesi (koeri.boun.edu.tr/scripts/lst0.asp)
```

## Akış

1. İstek geldiğinde `getirDepremler()` önbelleğe bakar; 120 saniyeden yeniyse doğrudan döner.
2. Değilse Kandilli sayfası `fetch` ile çekilir, HTML satırlara ayrılır, etiketler temizlenir.
3. `YYYY.AA.GG` ile başlayan ve en az 10 alan içeren satırlar `Deprem` nesnesine dönüştürülür.
4. Sonuç önbelleğe yazılır. Hata olursa son önbellek, o da yoksa boş dizi döner.
5. API rotası `tarih/min/max/sehir` filtrelerini uygular ve `X-Cache-*` başlıklarıyla yanıtlar.

## Dağıtım

- Vercel: `vercel.json` tüm trafiği `index.js`e yönlendirir; uygulama tek serverless fonksiyon olarak çalışır.
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
