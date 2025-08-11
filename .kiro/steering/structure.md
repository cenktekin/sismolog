# Structure — Türkiye Deprem Takip Sistemi

## Dosya Düzeni
```
turkiye-deprem-takip/
├── index.js                 # Ana uygulama dosyası (Express sunucusu, Socket.IO)
├── api/index.php            # PHP alternatif API endpoint'i
├── views/
│   └── index.ejs            # Ana sayfa template'i (harita + tablo arayüzü)
├── assets/
│   ├── css/
│   │   └── style.css        # Özel stiller
│   └── js/
│       └── app.js           # İstemci tarafı JavaScript
├── tests/
│   ├── fixtures/            # Test verileri
│   ├── integration/         # Entegrasyon testleri
│   │   ├── api.test.js      # API endpoint testleri
│   │   └── endpoints/
│   │       └── depremler.test.js
│   └── unit/                # Birim testleri
│       ├── api/
│       │   └── api.test.js
│       ├── services/
│       │   └── services.test.js
│       └── utils/
│           └── utils.test.js
├── logs/
│   ├── error.log            # Hata logları
│   └── combined.log         # Genel loglar
├── .env                     # Ortam değişkenleri
├── package.json             # Proje bağımlılıkları
├── tailwind.config.js       # TailwindCSS yapılandırması
├── jest.config.js           # Jest test yapılandırması
└── Procfile                 # Heroku deployment
```

## Çekirdek Bileşenler
- **Engine/Queue**: Deprem veri çekme motoru (getirDepremler fonksiyonu)
- **API**: Express.js API endpoint'leri (/api/v1/depremler)
- **UI**: EJS template + TailwindCSS + Leaflet harita arayüzü
- **Security**: Helmet, CORS, Rate Limiting, JWT, XSS temizleme, NoSQL enjeksiyon koruması
- **Monitoring**: Winston loglama sistemi
- **Real-time**: Socket.IO ile gerçek zamanlı güncellemeler
- **Testing**: Jest + Supertest test altyapısı