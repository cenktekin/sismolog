# Türkiye Deprem Takip Sistemi - Mimari Açıklaması

Bu doküman, Türkiye Deprem Takip Sistemi'nin mimari yapısını, bileşenler arası ilişkileri, veri akışını ve teknik kararları detaylı bir şekilde açıklamaktadır.

## İçindekiler

- [Mimari Genel Bakış](#mimari-genel-bakış)
- [Bileşenler](#bileşenler)
- [Veri Akışı](#veri-akışı)
- [Teknik Kararlar](#teknik-kararlar)
- [Güvenlik Mimarisi](#güvenlik-mimarisi)
- [Performans Optimizasyonu](#performans-optimizasyonu)
- [Ölçeklenebilirlik](#ölçeklenebilirlik)
- [Bakım Kolaylığı](#bakım-kolaylığı)
- [Gelecek Geliştirmeler](#gelecek-geliştirmeler)

## Mimari Genel Bakış

Türkiye Deprem Takip Sistemi, modern web uygulamaları için tasarlanmış bir **monolith mimari** üzerine kurulmuştur. Sistem, temel olarak üç katmandan oluşur:

1. **Frontend Katmanı**: Kullanıcı arayüzü ve etkileşim
2. **Backend Katmanı**: İş mantığı ve API servisleri
3. **Veri Katmanı**: Veri çekme, işleme ve saklama

### Mimari Şeması

```
┌─────────────────────────────────────────────────────────────┐
│                     KULLANICI TARAFI                        │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   Browser   │  │   Mobile    │  │   Third     │         │
│  │   (Web UI)  │  │   App       │  │   Party     │         │
│  └─────────────┘  └─────────────┘  │   Apps      │         │
│           │           │            └─────────────┘         │
│           │           │                  │                 │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 LOAD BALANCER                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                              │
└──────────────────────────────┼──────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────┐
│                              │                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                    API GATEWAY                          │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                     WEB SERVER                          │ │
│  │              (Node.js / Express.js)                     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │   ROUTING   │  │   MIDDLE-   │  │   CONT-     │         │
│  │   & AUTH    │  │   WARE      │  │   ROLLERS   │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│           │           │            │                 │      │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  BUSINESS LOGIC                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │   SERVICES  │  │   MODELS    │  │   UTILS     │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                  DATA LAYER                             │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │   EXTERNAL  │  │   CACHING   │  │   LOGGING   │     │ │
│  │  │   APIS      │  │   (Redis)   │  │  (Winston)  │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────┘ │
│                              │                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                 DATA SOURCES                            │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │ KANDILLI    │  │   DATABASE  │  │   FILES     │     │ │
│  │  │ RASATHANE   │  │  (MongoDB)  │  │   (Logs)    │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## Bileşenler

### 1. Frontend Bileşenleri

#### Web Arayüzü
- **Teknoloji**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **Template Engine**: EJS (Embedded JavaScript)
- **Harita Kütüphanesi**: Leaflet.js
- **Gerçek Zamanlı İletişim**: Socket.IO

#### Özellikler
- **Responsive Design**: Mobil ve masaüstü uyumlu
- **Dark Mode**: Koyu tema desteği
- **Real-time Updates**: Canlı veri güncellemeleri
- **Interactive Map**: Etkileşimli harita
- **Data Filtering**: Gelişmiş filtreleme seçenekleri

#### Dosya Yapısı
```
frontend/
├── views/
│   ├── index.ejs              # Ana sayfa
│   ├── partials/              # Parçalı template'ler
│   │   ├── header.ejs
│   │   ├── footer.ejs
│   │   └── navigation.ejs
│   └── layouts/               # Layout template'leri
│       └── main.ejs
├── assets/
│   ├── css/
│   │   ├── style.css          # Özel CSS
│   │   └── tailwind.config.js # Tailwind konfigürasyonu
│   ├── js/
│   │   ├── app.js             # Ana JavaScript
│   │   ├── map.js             # Harita işlemleri
│   │   └── api.js             # API işlemleri
│   └── images/                # Resimler
└── public/                    # Statik dosyalar
    ├── favicon.ico
    └── robots.txt
```

### 2. Backend Bileşenleri

#### Web Server
- **Runtime**: Node.js
- **Framework**: Express.js
- **Port**: 3000 (geliştirme), 8080 (üretim)

#### API Endpoint'leri
- **GET /**: Ana sayfa render etme
- **GET /api/v1/depremler**: Deprem verilerini getirme
- **WebSocket /socket.io**: Gerçek zamanlı veri akışı

#### Middleware'ler
- **Güvenlik**: Helmet, CORS, Rate Limiting
- **Doğrulama**: Express-validator
- **Temizleme**: XSS-Clean, Mongo Sanitize
- **Oturum**: Session management
- **Logging**: Winston

#### Servisler
- **Deprem Servisi**: Veri çekme ve işleme
- **API Servisi**: HTTP istekleri yönetimi
- **Auth Servisi**: Kimlik doğrulama
- **Cache Servisi**: Veri önbellekleme

### 3. Veri Bileşenleri

#### Veri Kaynakları
- **Kandilli Rasathanesi**: Ana veri kaynağı
- **Yedek Kaynaklar**: Alternatif veri kaynakları
- **İç Veritabanı**: MongoDB (gelecek için)

#### Veri İşleme
- **Web Scraping**: Cheerio ile HTML parsing
- **Veri Doğrulama**: Girdi doğrulama ve temizleme
- **Veri Dönüştürme**: JSON formatına dönüştürme
- **Veri Saklama**: Geçici veri saklama

#### Veri Akışı
```
Kandilli Rasathanesi → HTTP İstek → Cheerio Parsing → Veri Doğrulama → JSON Formatı → API Response
```

### 4. Güvenlik Bileşenleri

#### Kimlik Doğrulama
- **JWT**: JSON Web Token
- **Session Management**: Oturum yönetimi
- **Password Hashing**: Şifreleme

#### Güvenlik Önlemleri
- **CORS**: Çapraz domain koruması
- **Helmet**: HTTP güvenlik başlıkları
- **Rate Limiting**: İstek sınırlama
- **Input Validation**: Girdi doğrulama
- **XSS Protection**: XSS koruması
- **SQL Injection**: NoSQL injection koruması

## Veri Akışı

### 1. Normal Veri Akışı

#### Kullanıcı İsteği
1. Kullanıcı tarayıcıdan bir istek gönderir
2. Load balancer isteği yönlendirir
3. API gateway güvenlik kontrollerini yapar
4. Web server isteği alır

#### İşlem Akışı
1. **Routing**: İstek doğru route'a yönlendirilir
2. **Middleware**: Güvenlik ve doğrulama middleware'leri çalışır
3. **Controller**: İş mantığı uygulanır
4. **Service**: Veri işleme yapılır
5. **Response**: Yanıt formatlanır ve gönderilir

#### Yanıt Dönüşü
1. Controller yanıt oluşturur
2. Middleware'ler yanıtı işler
3. Web server yanıtı gönderir
4. Load balancer yanıtı kullanıcıya iletir

### 2. Gerçek Zamanlı Veri Akışı

#### WebSocket Bağlantısı
1. Kullanıcı Socket.IO ile bağlanır
2. Kimlik doğrulama yapılır
3. Bağlantı onaylanır

#### Veri Yayınlama
1. Deprem servisi yeni veri çeker
2. Veri doğrulanır ve işlenir
3. WebSocket üzerinden yayınlanır
4. Bağlı tüm istemciler güncellenir

### 3. Hata Yönetimi Akışı

#### Hata Tespiti
1. Hata oluşur
2. Error middleware'i tetiklenir
3. Hata loglanır
4. Kullanıcıya uygun hata mesajı gönderilir

#### Hata İyileştirme
1. Loglar incelenir
2. Hata kaydedilir
3. Gerekirse düzeltme yapılır
4. Testler çalıştırılır

## Teknik Kararlar

### 1. Teknoloji Seçimi

#### Node.js/Express.js Seçimi
**Avantajlar:**
- **JavaScript Tutarlılığı**: Frontend ve backend aynı dil
- **Performans**: Non-blocking I/O yapısı
- **Ekosistem**: Zengin paket ekosistemi
- **Hızlı Geliştirme**: Hızlı prototipleme
- **Scalability**: İyi ölçeklenebilirlik

**Dezavantajlar:**
- **Single Thread**: CPU yoğun işlemlerde sınırlı
- **Callback Hell**: Eski callback yapısı
- **Memory Management**: Dikkatli yönetim gerektirir

#### EJS Template Engine Seçimi
**Avantajlar:**
- **Basitlik**: Öğrenmesi kolay
- **Performans**: Hızlı render etme
- **JavaScript Entegrasyon**: Kolay JavaScript entegrasyonu
- **Debugging**: Kolay hata ayıklama

**Dezavantajlar:**
- **Sınırlı Özellikler**: Gelişmiş template özellikleri yok
- **Maintenance**: Karmaşık projelerde yönetimi zor

#### Leaflet.js Harita Kütüphanesi Seçimi
**Avantajlar:**
- **Açık Kaynak**: Ücretsiz ve açık kaynaklı
- **Hafif**: Küçük boyutlu
- **Özelleştirilebilir**: Kolay özelleştirme
- **Dokümantasyon**: İyi dokümantasyon

**Dezavantajs:**
- **Sınırlı Özellikler**: Premium özellikler yok
- **Performans**: Büyük veri setlerinde yavaşlık

### 2. Mimari Kararlar

#### Monolith Mimari Seçimi
**Avantajlar:**
- **Basitlik**: Anlaşılması ve yönetilmesi kolay
- **Performans**: İletişim maliyeti düşük
- **Deployment**: Tek deployment
- **Testing**: Kolay test etme

**Dezavantajlar:**
- **Ölçeklenebilirlik**: Bileşenler arasında ölçekleme zor
- **Bakım**: Büyük projelerde bakım zor
- **Teknoloji**: Tek teknoloji kısıtlaması

#### REST API Seçimi
**Avantajlar:**
- **Standart**: Geniş kabul görmüş standart
- **Basitlik**: Anlaşılması kolay
- **Cache**: Kolay cacheleme
- **Stateless**: Durumsuz mimari

**Dezavantajlar:**
- **Real-time**: Gerçek zamanlı iletişim için sınırlı
- **Complexity**: Karmaşık uygulamalarda yetersiz

### 3. Veri İşleme Kararları

#### Web Scraping Seçimi
**Avantajlar:**
- **Erişim**: Mevcut verilere erişim
- **Esneklik**: Farklı formatları işleme
- **Maliyet**: Düşük maliyetli çözüm

**Dezavantajlar:**
- **Güvenilirlik**: Veri kaynağına bağımlı
- **Bakım**: Kaynak değişikliklerinde bakım gerektirir
- **Performans**: Yavaş veri çekme

#### JSON Formatı Seçimi
**Avantajlar:**
- **Okunabilirlik**: İnsan tarafından okunabilir
- **Standart**: Geniş destek
- **Performans**: Hızlı parse etme
- **Compression**: Kolay sıkıştırma

**Dezavantajlar:**
- **Boyut**: Büyük veri setlerinde boyut artışı
- **Schema**: Sabit schema gerektirir

### 4. Güvenlik Kararları

#### JWT Token Seçimi
**Avantajlar:**
- **Stateless**: Sunucu tarafı durum yönetimi gerekmez
- **Scalability**: İyi ölçeklenebilirlik
- **Security**: Güvenli token yapısı
- **Flexibility**: Farklı platformlarda kullanılabilir

**Dezavantajlar:**
- **Size**: Büyük token boyutu
- **Storage**: Client tarafında saklama gerektirir
- **Revocation**: Token iptali zor

#### Rate Limiting Seçimi
**Avantajlar:**
- **Koruma**: API koruması
- **Stability**: Sistemin istikrarı
- **Fairness**: Adil kullanım
- **Security**: DDoS saldırılarına karşı koruma

**Dezavantajlar:**
- **User Experience**: Kullanıcı deneyimini etkileyebilir
- **Configuration**: Karmaşık yapılandırma

## Güvenlik Mimarisi

### 1. Katmanlı Güvenlik

#### Ağ Katmanı
- **Firewall**: Ağ düzeyinde güvenlik
- **DDoS Protection**: DDoS saldırılarına karşı koruma
- **VPN**: Şifreli ağ bağlantısı

#### Uygulama Katmanı
- **CORS**: Çapraz domain koruması
- **Helmet**: HTTP güvenlik başlıkları
- **Rate Limiting**: İstek sınırlama
- **Input Validation**: Girdi doğrulama

#### Veri Katmanı
- **Encryption**: Veri şifreleme
- **Masking**: Hassas veri maskeleme
- **Access Control**: Erişim kontrolü

### 2. Güvenlik Kontrolleri

#### Kimlik Doğrulama
```javascript
// JWT Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Yetkilendirme token\'ı gerekli' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Geçersiz token' });
        }
        req.user = user;
        next();
    });
};
```

#### Input Validation
```javascript
// Express-validator kullanımı
app.get('/api/v1/depremler', [
    query('min').optional().isFloat({ min: 0, max: 10 }),
    query('max').optional().isFloat({ min: 0, max: 10 }),
    query('sehir').optional().isString().trim().escape()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    // İşlem devam eder
});
```

#### XSS Koruması
```javascript
// XSS temizleme
app.use(xss());
```

#### SQL Injection Koruması
```javascript
// NoSQL injection koruması
app.use(mongoSanitize());
```

### 3. Güvenlik Testleri

#### Penetration Testing
- **Düzenli testler**: Aylık penetration testleri
- **Automated scanning**: Güvenlik taramaları
- **Manual testing**: Manuel güvenlik testleri

#### Vulnerability Assessment
- **Dependency scanning**: Bağımlılık taramaları
- **Code review**: Kod incelemeleri
- **Security audits**: Güvenlik denetimleri

## Performans Optimizasyonu

### 1. Sunucu Tarafı Optimizasyon

#### Caching
- **Memory caching**: Önbellekleme
- **Database caching**: Veritabanı önbellekleme
- **API caching**: API yanıtlarının önbellekleme

#### Compression
- **Gzip**: Yanıt sıkıştırma
- **Brotli**: Daha iyi sıkıştırma
- **Minification**: Dosya boyut küçültme

#### Connection Pooling
- **Database connections**: Veritabanı bağlantı havuzu
- **HTTP connections**: HTTP bağlantı havuzu

### 2. İstemci Tarafı Optimizasyon

#### Asset Optimization
- **Image optimization**: Resim optimizasyonu
- **Code splitting**: Kod bölme
- **Lazy loading**: Tembel yükleme

#### Browser Caching
- **Cache headers**: Cache başlıkları
- **Service workers**: Service workers
- **CDN**: İçerik dağıtım ağı

### 3. Veritabanı Optimizasyonu

#### Query Optimization
- **Indexing**: İndeksleme
- **Query tuning**: Sorgu optimizasyonu
- **Connection pooling**: Bağlantı havuzu

#### Schema Design
- **Normalization**: Normalizasyon
- **Denormalization**: Denormalizasyon
- **Partitioning**: Bölümlendirme

## Ölçeklenebilirlik

### 1. Dikey Ölçeklendirme

#### Resource Scaling
- **CPU**: CPU artırımı
- **Memory**: RAM artırımı
- **Storage**: Depolama artırımı

#### Load Balancing
- **Hardware load balancer**: Donanım load balancer
- **Software load balancer**: Yazılım load balancer
- **Cloud load balancer**: Bulut load balancer

### 2. Yatay Ölçeklendirme

#### Microservices
- **Service decomposition**: Servis ayrıştırma
- **Containerization**: Konteynerleştirme
- **Orchestration**: Orkestrasyon

#### Database Scaling
- **Read replicas**: Okuma replikaları
- **Sharding**: Parçalama
- **Partitioning**: Bölümlendirme

### 3. Auto Scaling

#### Cloud Auto Scaling
- **CPU-based scaling**: CPU tabanlı ölçekleme
- **Memory-based scaling**: RAM tabanlı ölçekleme
- **Request-based scaling**: İstek tabanlı ölçekleme

#### Scheduled Scaling
- **Peak hours**: Yoğun saatlerde ölçekleme
- **Seasonal scaling**: Mevsimsel ölçekleme
- **Predictive scaling**: Tahminsel ölçekleme

## Bakım Kolaylığı

### 1. Kod Bakımı

#### Code Quality
- **Linting**: Kod kalitesi kontrolü
- **Formatting**: Kod formatlama
- **Documentation**: Dokümantasyon

#### Testing
- **Unit tests**: Birim testleri
- **Integration tests**: Entegrasyon testleri
- **E2E tests**: Sonuçtan sonu testleri

### 2. Deployment Bakımı

#### CI/CD Pipeline
- **Automated testing**: Otomatik testler
- **Automated deployment**: Otomatik deployment
- **Rollback**: Geri alma

#### Monitoring
- **Health checks**: Sağlık kontrolleri
- **Performance monitoring**: Performans izleme
- **Error tracking**: Hata takibi

### 3. Log Bakımı

#### Log Management
- **Log rotation**: Log döndürme
- **Log aggregation**: Log birleştirme
- **Log analysis**: Log analizi

#### Alerting
- **Error alerts**: Hata uyarıları
- **Performance alerts**: Performans uyarıları
- **Security alerts**: Güvenlik uyarıları

## Gelecek Geliştirmeler

### 1. Teknoloji Yükseltmeleri

#### Framework Updates
- **Node.js v20+**: Yeni Node.js sürümleri
- **Express.js v5+**: Yeni Express.js sürümleri
- **Database upgrades**: Veritabanı yükseltmeleri

#### New Technologies
- **TypeScript**: TypeScript entegrasyonu
- **GraphQL**: GraphQL API
- **WebAssembly**: WebAssembly entegrasyonu

### 2. Mimari Geliştirmeler

#### Microservices Migration
- **Service decomposition**: Servis ayrıştırma
- **Containerization**: Konteynerleştirme
- **Orchestration**: Orkestrasyon

#### Event-Driven Architecture
- **Message queues**: Mesaj kuyrukları
- **Event sourcing**: Event sourcing
- **CQRS**: CQRS deseni

### 3. Özellik Geliştirmeleri

#### Advanced Features
- **Machine learning**: Makine öğrenmesi
- **AI integration**: Yapay zeka entegrasyonu
- **IoT integration**: IoT entegrasyonu

#### Mobile Support
- **React Native**: React Native uygulaması
- **PWA**: Progressive Web App
- **Mobile APIs**: Mobil API'ler

## İletişim

### Mimari Sorumlusu
- **Tech Lead**: Proje Lideri
- **Email**: mimari@turkiye-deprem-takip.com

### Geliştirme Ekibi
- **Developers**: Açık kaynak katkıda bulunanlar
- **Contributors**: Topluluk katkıda bulunanlar

### İletişim Kanalları
- **GitHub Issues**: [Proje Issues](https://github.com/turkiye-deprem-takip/turkiye-deprem-takip/issues)
- **GitHub Discussions**: [Discussions](https://github.com/turkiye-deprem-takip/turkiye-deprem-takip/discussions)
- **Email**: destek@turkiye-deprem-takip.com

---

*Bu doküman düzenli olarak güncellenmektedir. Son güncelleme: 10 Ağustos 2025*