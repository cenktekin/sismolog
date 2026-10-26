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
npm run check      # index.js + assets/js sözdizimi
npm start          # ardından http://localhost:3000 ve /api/v1/depremler
```

## Sorun Giderme

| Belirti | Neden / Çözüm |
|---|---|
| Sayfa stilsiz | `npm run build` çalıştırılmamış |
| Liste boş | Kandilli sitesine erişilemiyor; API 200 + boş dizi döner |
| `npm start` sonrası port dinlemiyor | `NODE_ENV=production`; yerelde kaldırın |
| Veri eski görünüyor | 2 dakikalık önbellek; `X-Cache-Age` başlığına bakın |

## Dağıtım

Vercel projesi GitHub'a bağlıdır; `main`e push otomatik deploy eder. `vercel.json` build komutu olarak `npm run build` kullanır.
