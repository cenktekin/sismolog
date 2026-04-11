# Design — Türkiye Deprem Takip Sistemi

## Mimari Tasarım

### Genel Mimari
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Kandilli API  │───▶│   Veri Çekme    │───▶│   Veri İşleme   │
│   (External)    │    │   Motoru       │    │   ve Depolama   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Arayüzü   │◀───│   Express API   │◀───│   Socket.IO     │
│   (Frontend)    │    │   Backend       │    │   Real-time     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Katmanlı Mimari
1. **Veri Katmanı (Data Layer)**
   - Deprem veri modeli (Deprem sınıfı)
   - Veri doğrulama ve formatlama
   - Bellek içi veri depolama

2. **Servis Katmanı (Service Layer)**
   - Veri çekme servisi (getirDepremler)
   - API servisleri
   - Socket.IO servisleri

3. **API Katmanı (API Layer)**
   - Express.js route'ları
   - Middleware'ler (güvenlik, validation, rate limiting)
   - Error handling

4. **Sunum Katmanı (Presentation Layer)**
   - EJS template'leri
   - TailwindCSS stilleri
   - JavaScript interaksiyonları

## Veri Akışı

### Deprem Veri Çekme Akışı
```
Kandilli API → RequestWithRetry → Cheerio Ayrıştırma → Deprem Sınıfı → Doğrulama → Bellek Depolama
```

### API İsteği Akışı
```
İstemci → Express Middleware → Route Handler → Veri Filtreleme → JSON Response
```

### Gerçek Zamanlı Güncelleme Akışı
```
Veri Çekme → Değişiklik Tespiti → Socket.IO Event → UI Güncelleme
```

## Sınıf Tasarımı

### Deprem Sınıfı
```javascript
class Deprem {
  constructor(tarih, saat, enlem, boylam, derinlik, buyukluk, yer, sehir) {
    this.tarih = tarih;
    this.saat = saat;
    this.enlem = enlem;
    this.boylam = boylam;
    this.derinlik = derinlik;
    this.buyukluk = buyukluk;
    this.yer = yer;
    this.sehir = sehir;
  }
}
```

### Veri Çekme Servisi
```javascript
class DepremCekmeServisi {
  async getirDepremler() {
    // Kandilli'den veri çekme
    // Veri ayrıştırma
    // Doğrulama
    // Deprem nesneleri oluşturma
  }
}
```

## Veritabanı Tasarımı (Gelecek İçin)

### Deprem Tablosu
```sql
CREATE TABLE depremler (
  id SERIAL PRIMARY KEY,
  tarih DATE NOT NULL,
  saat TIME NOT NULL,
  enlem DECIMAL(10,6) NOT NULL,
  boylam DECIMAL(10,6) NOT NULL,
  derinlik DECIMAL(8,2) NOT NULL,
  buyukluk DECIMAL(3,1) NOT NULL,
  yer VARCHAR(255) NOT NULL,
  sehir VARCHAR(100),
  olusturulma_zamani TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  guncelleme_zamani TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Tasarımı

### RESTful Endpoint'ler
- `GET /api/v1/depremler` - Tüm depremleri listele
- `GET /api/v1/depremler?tarih=2025-01-10` - Tarihe göre filtrele
- `GET /api/v1/depremler?min=4.0` - Büyüklüğe göre filtrele
- `GET /api/v1/depremler?sehir=İstanbul` - Şehre göre filtrele

### Response Format
```json
[
  {
    "tarih": "2025-01-10",
    "saat": "14:32:15",
    "enlem": "39.123456",
    "boylam": "35.654321",
    "derinlik": "10.5",
    "buyukluk": "4.2",
    "yer": "İstanbul merkezli",
    "sehir": "İstanbul"
  }
]
```

## Frontend Tasarımı

### Component Yapısı
```
App
├── Navbar
├── MainContent
│   ├── EarthquakeList
│   │   ├── FilterControls
│   │   └── EarthquakeTable
│   └── MapContainer
│       └── LeafletMap
└── Footer
```

### State Management
- **Global State**: Deprem verileri, filtreler
- **Local State**: Harita durumu, popup'lar
- **Real-time Updates**: Socket.IO ile state güncellemeleri

### UI/UX İlkeleri
- **Mobile-First**: Responsive tasarım
- **Accessibility**: WCAG 2.1 AA standartları
- **Performance**: Optimizasyon ve hız
- **User Experience**: Basit ve anlaşılır arayüz

## Güvenlik Tasarımı

### Authentication & Authorization
- JWT token tabanlı authentication
- Role-based access control (gelecek için)
- API rate limiting

### Data Security
- XSS temizleme
- SQL/NoSQL enjeksiyon koruması
- Input validation
- CORS yapılandırması

### Network Security
- HTTPS zorunluluğu
- Security headers (Helmet)
- Request sanitization

## Dağıtım Tasarımı

### Containerization
- Dockerfile ile container oluşturma
- Docker Compose ile servis yönetimi

### Cloud Deployment
- Heroku deployment
- Environment variables yönetimi
- Loglama ve monitoring

### CI/CD Pipeline
- GitHub Actions ile otomatik deployment
- Test otomasyonu
- Code quality checks

## Performans Tasarımı

### Caching Stratejileri
- API response caching
- Static asset caching
- Database query optimization

### Load Balancing
- Multiple server instances
- Horizontal scaling
- Database replication

### Monitoring & Logging
- Winston loglama
- Performance metrics
- Error tracking