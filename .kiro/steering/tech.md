# Tech — Türkiye Deprem Takip Sistemi

## Yığın
- **Backend**: Node.js 18+, Express.js 4.17+, Socket.IO 2.3+
- **Frontend**: HTML5, CSS3, JavaScript (ES6+), TailwindCSS 3.4+, Leaflet 1.9+
- **Veri İşleme**: Cheerio 1.0+, Request 2.88+
- **Güvenlik**: Helmet 8.1+, CORS 2.8+, Rate Limiting 7.5+, JWT 9.0+, XSS temizleme 0.1+, NoSQL enjeksiyon koruması 2.2+
- **Test**: Jest 29.7+, Supertest 6.3+, @types/jest 29.5+
- **Template Engine**: EJS 3.1+
- **Loglama**: Winston 3.17+
- **Araçlar**: Nodemon 3.0+, PM2 (production)

## Komutlar
- **Backend Geliştirme**: `npm run dev` (nodemon ile hot reload)
- **Backend Test**: `npm test` (Jest testleri)
- **Backend Test (Watch)**: `npm run test:watch` (canlı test)
- **Backend Test (Kapsam)**: `npm run test:coverage` (test kapsamı)
- **Backend Test (CI)**: `npm run test:ci` (CI için optimize edilmiş testler)
- **Production**: `npm start` (Node.js sunucusu)
- **Harici API Test**: Manuel test veya Postman ile `/api/v1/depremler` endpoint'i

## Bağımlılıklar Detaylı
### Core Dependencies
- **express**: Web framework'ü
- **socket.io**: Gerçek zamanlı iletişim
- **cheerio**: Sunucu tarafı HTML ayrıştırma
- **request**: HTTP istekleri (Kandilli Rasathanesi veri çekme)
- **ejs**: Template engine
- **winston**: Loglama sistemi

### Security Dependencies
- **helmet**: Güvenlik başlıkları
- **cors**: Cross-origin resource sharing
- **express-rate-limit**: API rate limiting
- **jsonwebtoken**: JWT token yönetimi
- **express-mongo-sanitize**: NoSQL enjeksiyon koruması
- **xss-clean**: XSS temizleme
- **hpp**: HTTP parameter pollution koruması

### Validation & Middleware
- **express-validator**: Request validation
- **express-session**: Session management
- **cookie-parser**: Cookie parsing

### Frontend Dependencies
- **tailwindcss**: Utility-first CSS framework
- **leaflet**: Harita kütüphanesi

### Development Dependencies
- **jest**: Test framework'ü
- **supertest**: HTTP assertion library
- **nodemon**: Geliştirme sunucusu
- **@types/jest**: Jest tip tanımları

## Ortam Değişkenleri (.env)
- **PORT**: Sunucu portu (varsayılan: 3000)
- **NODE_ENV**: Çalışma ortamı (development/production)
- **JWT_SECRET**: JWT secret anahtarı
- **SESSION_SECRET**: Session secret anahtarı
- **LOG_LEVEL**: Log seviyesi (info/error/debug)
- **ALLOWED_ORIGINS**: CORS için izin verilen origin'ler
- **KOERI_URL**: Kandilli Rasathanesi URL'si

## Yapılandırma Dosyaları
- **package.json**: Proje meta verileri ve bağımlılıklar
- **tailwind.config.js**: TailwindCSS yapılandırması
- **jest.config.js**: Jest test yapılandırması
- **Procfile**: Heroku deployment
- **.gitignore**: Git tarafından yoksayılacak dosyalar