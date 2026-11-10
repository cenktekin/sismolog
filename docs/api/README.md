# API Referansı — Sismolog

Tek endpoint vardır. Kimlik doğrulama ve API anahtarı yoktur. Rate limit: IP başına **60 istek/dakika**.

## GET /api/v1/depremler

Son deprem listesini JSON olarak döner. Birincil kaynak Kandilli Rasathanesi listesi, yedek kaynak AFAD JSON ucudur. Sonuç sunucuda 2 dakika önbelleklenir.

### Sorgu Parametreleri

| Parametre | Tip | Açıklama | Örnek |
|---|---|---|---|
| `tarih` | string | Tam gün eşleşmesi, `YYYY.AA.GG` veya `YYYY-AA-GG` | `?tarih=2026.11.10` |
| `min` | sayı | Bu büyüklükten küçük kayıtları eler | `?min=4.0` |
| `max` | sayı | Bu büyüklükten büyük kayıtları eler | `?max=2.5` |
| `sehir` | string | Şehir etiketi (parantezsiz), harf duyarsız tam eşleşme | `?sehir=YALOVA` |

Parametreler birlikte kullanılabilir. Geçersiz sayısal değer o kaydı eler (hata döndürmez).

### Yanıt

`200 OK` — deprem nesneleri dizisi:

```json
[
  {
    "tarih": "2026.11.10",
    "saat": "12:31:20",
    "enlem": "38.4627",
    "boylam": "39.0740",
    "derinlik": "19.2",
    "buyukluk": "1.9",
    "yer": "SARITOSUN",
    "sehir": "ELAZIG"
  }
]
```

Tüm alanlar string'dir; büyüklük ve derinlik sayıya çevrilerek kullanılmalıdır. `sehir` boş olabilir (deniz / il dışı kayıtlar).

### Yanıt Başlıkları

| Başlık | Anlamı |
|---|---|
| `X-Cache-Age` | Önbellekteki verinin yaşı (saniye) |
| `X-Cache-Max-Age` | Önbellek ömrü (120 saniye) |
| `X-Data-Source` | `kandilli`, `afad`, `cache`, `stale` veya `unavailable` |
| `X-Data-Warning` | Bir kaynak düştüyse hangi kaynak ve neden (opsiyonel) |

### Hata Durumları

| Kod | Durum |
|---|---|
| `200` | Kayıt dizisi (filtre sonrası boş olabilir) |
| `429` | Rate limit aşıldı — `{ "error": "Too Many Requests", "detail": "..." }` |
| `500` | Beklenmeyen sunucu hatası |
| `503` | Tüm veri kaynakları ulaşılamaz — `{ "error": "...", "details": ["..."] }` |

Kaynaklardan biri düşerse API yedek kaynakla **200** döner ve `X-Data-Warning` ile durumu bildirir. Hiçbir kaynak yoksa ve önbellek de boşsa **503** döner (sessiz boş liste yok).

### Örnekler

```bash
# 4.0 ve üzeri
curl "https://sismolog-fj13lgl4o-cenktekins-projects.vercel.app/api/v1/depremler?min=4.0"

# Belirli gün
curl "https://sismolog-fj13lgl4o-cenktekins-projects.vercel.app/api/v1/depremler?tarih=2026.11.10"

# Şehir
curl "https://sismolog-fj13lgl4o-cenktekins-projects.vercel.app/api/v1/depremler?sehir=YALOVA"
```

## GET /

Arayüzü döner (EJS). API değildir. `helmet` güvenlik başlıkları ve CSP bu rotada da uygulanır.

## Kapsam Dışı

Sürümleme (`/v2`), sayfalama, kimlik doğrulama, yazma işlemleri ve webhook yoktur. `tarih/min/max/sehir` dışındaki parametreler yok sayılır.
