# API Referansı — Sismolog

Tek endpoint vardır. Kimlik doğrulama, API anahtarı ve rate limiting yoktur.

## GET /api/v1/depremler

Son deprem listesini JSON olarak döner. Veri kaynağı Kandilli Rasathanesi listesidir ve sunucuda 2 dakika önbelleklenir.

### Sorgu Parametreleri

| Parametre | Tip | Açıklama | Örnek |
|---|---|---|---|
| `tarih` | string | Tam gün eşleşmesi, `YYYY.AA.GG` biçiminde | `?tarih=2026.10.27` |
| `min` | sayı | Bu büyüklükten küçük kayıtları eler | `?min=4.0` |
| `max` | sayı | Bu büyüklükten büyük kayıtları eler | `?max=2.5` |
| `sehir` | string | Şehir etiketi, parantez dahil, tam eşleşme | `?sehir=(YALOVA)` |

Parametreler birlikte kullanılabilir. Geçersiz sayısal değer o kaydı eler (hata döndürmez).

### Yanıt

`200 OK` — deprem nesneleri dizisi:

```json
[
  {
    "tarih": "2026.10.27",
    "saat": "01:31:01",
    "enlem": "40.5992",
    "boylam": "29.1672",
    "derinlik": "1.4",
    "buyukluk": "1.7",
    "yer": "TERMAL",
    "sehir": "(YALOVA)"
  }
]
```

Tüm alanlar string'dir; büyüklük ve derinlik sayıya çevrilerek kullanılmalıdır.

### Yanıt Başlıkları

| Başlık | Anlamı |
|---|---|
| `X-Cache-Age` | Önbellekteki verinin yaşı (saniye) |
| `X-Cache-Max-Age` | Önbellek ömrü (120 saniye) |
| `X-Data-Source` | `cache` veya `fresh` |

### Hata Durumları

| Kod | Durum |
|---|---|
| `200` | Gövde boş dizi olabilir (veri kaynağına ulaşılamadı ve önbellek yok) |
| `500` | Beklenmeyen sunucu hatası (`{ "error": "Internal Server Error" }`) |

Kaynak sitesi erişilemezse uygulama 200 + boş dizi ya da son önbelleği döner; ayrı bir hata kodu üretmez.

### Örnekler

```bash
# 4.0 ve üzeri
curl "https://sismolog-fj13lgl4o-cenktekins-projects.vercel.app/api/v1/depremler?min=4.0"

# Belirli gün
curl "https://sismolog-fj13lgl4o-cenktekins-projects.vercel.app/api/v1/depremler?tarih=2026.10.27"

# Şehir
curl "https://sismolog-fj13lgl4o-cenktekins-projects.vercel.app/api/v1/depremler?sehir=(YALOVA)"
```

## GET /

Arayüzü döner (EJS). API değildir.

## Kapsam Dışı

Sürümleme (`/v2`), sayfalama, kimlik doğrulama, yazma işlemleri ve webhook yoktur. `tarih/min/max/sehir` dışındaki parametreler yok sayılır.
