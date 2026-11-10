# Başlangıç — Sismolog

## Gereksinimler

- Node.js 18 veya üzeri
- npm

## Kurulum

```bash
git clone https://github.com/cenktekin/sismolog.git
cd sismolog
npm install
npm run build
npm start
```

`http://localhost:3000` adresini açın.

`npm run build` zorunludur: Tailwind CSS derlemesi `public/css/style.css` dosyasını üretir ve `public/` repoda tutulmaz. Bu adım atlanırsa arayüz stilsiz görünür.

## Ortam Değişkenleri

`.env.example` dosyasını `.env` olarak kopyalayın. Zorunlu değişken yoktur.

| Değişken | Varsayılan | Açıklama |
|---|---|---|
| `PORT` | `3000` | Yerel dinleme portu |
| `NODE_ENV` | — | `production` ise `app.listen()` çalışmaz (Vercel için) |

## Doğrulama

```bash
npm run build      # CSS derlemesi
npm run check      # tüm sunucu + tarayıcı script'lerinde sözdizimi
npm test           # 31 birim/entegrasyon testi (node:test)
npm start          # ardından http://localhost:3000 ve /api/v1/depremler
```

## Sorun Giderme

| Belirti | Neden / Çözüm |
|---|---|
| Sayfa stilsiz | `npm run build` çalıştırılmamış |
| Liste boş | Önce Kandilli, sonra AFAD denenir; hiçbiri yoksa API 503 + `details` döner |
| `npm start` sonrası port dinlemiyor | `NODE_ENV=production`; yerelde `npm start` yerine `NODE_ENV=development npm start` |
| Veri eski görünüyor | 2 dakikalık önbellek; `X-Data-Source` ve `X-Cache-Age` başlıklarına bakın |
| 429 hatası | Rate limit (60 istek/dk/IP) — bir dakika bekleyin |

## Dağıtım

Vercel projesi GitHub deposuna bağlıdır. ⚠️ **Otomatik deploy 2026-04-26'dan beri kopuk**: son production deployment `5c24aef`. Git entegrasyonunun Vercel panelinden yeniden bağlanması gerekir. `vercel.json` statik yolları (`/css/*`, `/js/*`, `/assets/*`) CDN'den servis eder; yalnız `/` ve API fonksiyona düşer.
