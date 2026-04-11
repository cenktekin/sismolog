# Türkiye Deprem Takip Sistemi - Geliştirme Kılavuzu

Bu kılavuz, Türkiye Deprem Takip Sistemi projesinde geliştirme yaparken izlenmesi gereken süreçleri, standartları ve en iyi uygulamaları içermektedir.

## İçindekiler

- [Geliştirme Süreci](#geliştirme-süreci)
- [Branch Stratejisi](#branch-stratejisi)
- [Commit Mesajları](#commit-mesajları)
- [Code Review Süreci](#code-review-süreci)
- [Kod Standartları](#kod-standartları)
- [Test Yazımı](#test-yazımı)
- [Hata Ayıklama](#hata-ayıklama)
- [Deployment](#deployment)
- [Güvenlik](#güvenlik)
- [Performans](#performans)

## Geliştirme Süreci

### 1. Geliştirme Döngüsü

#### Adım 1: Issue Oluşturma
- GitHub Issues üzerinden yeni bir issue oluşturun
- Issue'ya açıklayıcı bir başlık ve detaylı açıklama ekleyin
- İlgili etiketleri ekleyin (`bug`, `feature`, `documentation`, vb.)

#### Adım 2: Branch Oluşturma
```bash
# Ana branch'ten yeni bir branch oluşturun
git checkout main
git pull origin main
git checkout -b feature/issue-aciklamasi
```

#### Adım 3: Geliştirme
- Kodunuzu geliştirin
- Testleri düzenli olarak çalıştırın
- Kendi kendinize code review yapın

#### Adım 4: Test Etme
```bash
# Tüm testleri çalıştırın
npm test

# Test kapsamını kontrol edin
npm run test:coverage

# API testlerini çalıştırın
npm run test:api
```

#### Adım 5: Commit Etme
- Değişikliklerinizi commit edin
- Açıklayıcı commit mesajları kullanın

#### Adım 6: Push Etme
```bash
# Değişikliklerinizi push edin
git push origin feature/issue-aciklamasi
```

#### Adım 7: Pull Request Oluşturma
- GitHub üzerinden Pull Request oluşturun
- İlgili issue'u bağlayın
- Code review sürecini başlatın

#### Adım 8: Review ve Merge
- Review'ları bekleyin
- Gerekli düzeltmeleri yapın
- Onay alındıktan sonra merge edin

### 2. Geliştirme Ortamı

#### Local Development
```bash
# Geliştirme modunda çalıştırma
npm run dev

# Debug modunda çalıştırma
DEBUG=* npm run dev

# Port değiştirme
PORT=3001 npm run dev
```

#### Staging Environment
- Test amaçlı staging ortamı
- Üretim verisi kopyası
- Özelliklerin son testleri

#### Production Environment
- Canlı kullanıcılar için
- Otomatik deployment
- Monitörleme ve loglama

## Branch Stratejisi

### Branch Yapısı

```
main                    # Ana branch (sadece stable kod)
├── develop            # Geliştirme branch'i
├── feature/*          # Yeni özellikler
├── bugfix/*           # Bug düzeltmeleri
├── hotfix/*           # Acil düzeltmeler
└── release/*          # Sürüm hazırlıkları
```

### Branch Kuralları

#### main Branch
- Sadece production-ready kod
- Version control için kullanılır
- Her merge sonrası tag oluşturulur

#### develop Branch
- Geliştirme branch'i
- Tüm özelliklerin birleştirildiği yer
- Testlerin çalıştığı yer

#### feature Branch
- Yeni özellikler için
- `feature/` ile başlar
- Geliştirme bittiğinde develop branch'ine merge edilir

#### bugfix Branch
- Bug düzeltmeleri için
- `bugfix/` ile başlar
- Acil düzeltmeler için kullanılır

#### hotfix Branch
- Production'da acil düzeltmeler için
- `hotfix/` ile başlar
- main branch'ine doğrudan merge edilir

### Branch Örnekleri

#### Yeni Özellik
```bash
# Yeni özellik branch'i oluşturma
git checkout -b feature/kullanici-authentication

# Geliştirme
git add .
git commit -m "feat: add user authentication system"

# Push etme
git push origin feature/kullanici-authentication

# Pull Request oluşturma
# GitHub üzerinden PR oluştur
```

#### Bug Düzeltme
```bash
# Bugfix branch'i oluşturma
git checkout -b bugfix/api-rate-limiting-error

# Düzeltme yapma
git add .
git commit -m "fix: resolve API rate limiting error"

# Push etme
git push origin bugfix/api-rate-limiting-error

# Pull Request oluşturma
```

#### Acil Düzeltme
```bash
# Hotfix branch'i oluşturma
git checkout -b hotfix/security-vulnerability

# Düzeltme yapma
git add .
git commit -m "hotfix: patch security vulnerability"

# Hem main hem de develop branch'ine merge et
git checkout main
git merge hotfix/security-vulnerability
git tag -a v1.0.1-hotfix -m "Hotfix for security vulnerability"
git push origin main --tags

git checkout develop
git merge hotfix/security-vulnerability
git push origin develop
```

## Commit Mesajları

### Formatı

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Commit Türleri

#### feat: Yeni özellik
```bash
git commit -m "feat: add user authentication system"
git commit -m "feat(api): implement earthquake filtering"
```

#### fix: Bug düzeltmesi
```bash
git commit -m "fix: resolve API rate limiting error"
git commit -m "fix(ui): fix map display issue"
```

#### docs: Dokümantasyon
```bash
git commit -m "docs: update API documentation"
git commit -m "docs: add installation guide"
```

#### style: Kod formatlama
```bash
git commit -m "style: format code with Prettier"
git commit -m "style: update CSS styling"
```

#### refactor: Kod yeniden yapılandırma
```bash
git commit -m "refactor: optimize data fetching"
git commit -m "refactor: improve error handling"
```

#### test: Test ekleme/güncelleme
```bash
git commit -m "test: add unit tests for earthquake service"
git commit -m "test: update API integration tests"
```

#### chore: Diğer değişiklikler
```bash
git commit -m "chore: update dependencies"
git commit -m "chore: clean up unused files"
```

### Örnek Commit Mesajları

#### Basit Özellik
```bash
git commit -m "feat: add earthquake magnitude filtering"
```

#### Detaylı Özellik
```bash
git commit -m "feat(api): add advanced earthquake filtering

- Add minimum and maximum magnitude filters
- Add city-based filtering
- Add date range filtering
- Update API documentation

Closes #123
```

#### Bug Düzeltmesi
```bash
git commit -m "fix: resolve CORS error in production

- Update CORS configuration for production
- Add proper origin validation
- Fix environment variable usage

Fixes #456
```

### Commit Mesajı İpuçları

- **Kısa ve açıklayıcı** olun
- **Gelecekteki geliştiriciler** için anlaşılır olun
- **Issue numarası** ekleyin
- **Birden fazla değişiklik** için ayrı commit'ler kullanın
- **Atomic commit'ler** yapın (bir commit'te bir değişiklik)

## Code Review Süreci

### Review Süreci

#### 1. Pull Request Oluşturma
- PR başlığı açıklayıcı olmalı
- Açıklama kısmında değişiklikleri detaylıca belirtin
- İlgili issue'ları bağlayın
- Test sonuçlarını ekleyin

#### 2. Review Checklist
- [ ] Kod projenin kod standartlarına uygun mu?
- [ ] Testler yazıldı ve geçiyor mu?
- [ ] Dokümantasyon güncellendi mi?
- [ ] Güvenlik kontrolleri yapıldı mı?
- [ ] Performans etkisi değerlendirildi mi?
- [ ] Hata durumları ele alındı mı?

#### 3. Review İpuçları
- **Olumlu ve yapıcı** geri bildirim verin
- **Spesifik** olun ("bu kodu değiştir" yerine "bu fonksiyonu şu şekilde optimize edebiliriz")
- **Test** eksikliklerini belirtin
- **Performans** ve **güvenlik** konularını vurgulayın

### Code Review Standartları

#### Kod Kalitesi
- **Okunabilirlik**: Kodun anlaşılır olması
- **Bakım**: Gelecekteki değişiklikler için uygun yapı
- **Performans**: Gereksiz yavaşlıklar olmaması
- **Güvenlik**: Potansiyel güvenlik açıkları

#### Test Kapsamı
- **Unit Testler**: Fonksiyonel testler
- **Integration Testler**: API ve servis testleri
- **E2E Testler**: Kullanıcı senaryoları
- **Coverage**: Minimum %80 test kapsamı

#### Dokümantasyon
- **Komentler**: Karmaşık kısımlar için yorumlar
- **README**: Proje genel bilgileri
- **API Docs**: Endpoint ve parametreler
- **Kod İçi Dokümantasyon**: Fonksiyon ve sınıflar için

### Review Süreçleri

#### Peer Review
- En az bir geliştirici tarafından review edilir
- 24 saat içinde tamamlanmalıdır
- Gerekli düzeltmeler yapılmalıdır

#### Tech Lead Review
- Önemli değişikliklerde tech lead tarafından review edilir
- Mimari ve teknik kararlar kontrol edilir
- Performans ve güvenlik değerlendirmesi yapılır

#### Final Review
- Tüm review'lar tamamlandıktan sonra merge edilir
- Son kontroller yapılır
- Deployment için hazırlanır

## Kod Standartları

### JavaScript Standartları

#### Genel Kurallar
- **ES6+** özelliklerini kullanın
- **Süslü parantez** her zaman kullanın
- **Boşluk** tutarlı kullanın
- **Noktalı virgül** her zaman kullanın

#### Değişkenler
```javascript
// ❌ Kötü örnek
var x = 1;
let y = 2;
const z = 3;

// ✅ İyi örnek
const MAX_RETRIES = 3;
let retryCount = 0;
const earthquakeData = [];
```

#### Fonksiyonlar
```javascript
// ❌ Kötü örnek
function getdata() {
    // kod
}

// ✅ İyi örnek
function getEarthquakeData() {
    // kod
}

// ✅ Arrow function
const fetchEarthquakeData = async () => {
    // kod
}
```

#### Hata Yönetimi
```javascript
// ❌ Kötü örnek
try {
    // kod
} catch (e) {
    console.log(e);
}

// ✅ İyi örnek
try {
    const data = await fetchEarthquakeData();
    return data;
} catch (error) {
    logger.error('Failed to fetch earthquake data:', error);
    throw new Error('Earthquake data fetch failed');
}
```

### CSS Standartları

#### Genel Kurallar
- **BEM** metodolojisini kullanın
- **Tailwind CSS** utility sınıflarını tercih edin
- **Responsive** tasarım yapın

#### BEM Örnekleri
```css
/* ❌ Kötü örnek */
.container .earthquake-list .item {
    /* stil */
}

/* ✅ İyi örnek */
.earthquake-list {
    /* stil */
}

.earthquake-list__item {
    /* stil */
}

.earthquake-list__item--highlighted {
    /* stil */
}
```

### Dosya Yapısı

#### JavaScript Dosyaları
- **camelCase** kullanın
- **Anlamlı isimler** verin
- **Tek sorumluluk** prensibine uyun

```javascript
// ❌ Kötü örnek
const eq = require('./earthquake');

// ✅ İyi örnek
const earthquakeService = require('./earthquake.service');
```

#### Dosya Adları
- **Küçük harf** ve **kebab-case** kullanın
- **Anlamlı** ve **tanımlayıcı** olun

```javascript
// ❌ Kötü örnek
const eq.js = require('./eq.js');

// ✅ İyi örnek
const earthquake.service.js = require('./earthquake.service.js');
```

## Test Yazımı

### Test Türleri

#### Unit Testler
- Tek fonksiyon veya sınıf testleri
- Hızlı ve izole çalışır
- Jest kullanılır

```javascript
// earthquake.service.test.js
const { getEarthquakeData } = require('./earthquake.service');

describe('Earthquake Service', () => {
    describe('getEarthquakeData', () => {
        it('should return earthquake data', async () => {
            const result = await getEarthquakeData();
            expect(result).toBeInstanceOf(Array);
        });
    });
});
```

#### Integration Testler
- API endpoint testleri
- Servisler arası etkileşim testleri
- Supertest kullanılır

```javascript
// api.test.js
const request = require('supertest');
const app = require('../index');

describe('Earthquake API', () => {
    describe('GET /api/v1/depremler', () => {
        it('should return earthquake data', async () => {
            const response = await request(app)
                .get('/api/v1/depremler')
                .expect(200);
            
            expect(response.body).toBeInstanceOf(Array);
        });
    });
});
```

#### E2E Testler
- Kullanıcı senaryoları testleri
- Tarayıcı otomasyonu
- Playwright veya Cypress kullanılır

### Test Kuralları

#### Test Adlandırma
- **Açıklayıcı** ve **anlaşılır** olun
- **Given-When-Then** formatını kullanın

```javascript
// ❌ Kötü örnek
it('test data', () => {
    // kod
});

// ✅ İyi örnek
it('should return earthquake data when API is called', () => {
    // kod
});
```

#### Test Verileri
- **Gerçekçi** veriler kullanın
- **Test ortamı** için özel veriler oluşturun
- **Temizleme** işlemleri yapın

```javascript
// ❌ Kötü örnek
const testData = { id: 1, name: 'test' };

// ✅ İyi örnek
const createTestEarthquake = () => ({
    id: 1,
    tarih: '2025-08-10',
    saat: '12:00:00',
    enlem: '39.0',
    boylam: '35.0',
    derinlik: '10.0',
    buyukluk: '4.0',
    yer: 'Test Location',
    sehir: 'Test City'
});
```

#### Test Coverage
- Minimum **%80** coverage hedefi
- Kritik kodlar için **%100** coverage
- Coverage raporlarını düzenli kontrol edin

```bash
# Test coverage raporu
npm run test:coverage

# Coverage raporunu açma
open coverage/lcov-report/index.html
```

## Hata Ayıklama

### Debug Araçları

#### Console Logları
```javascript
// ❌ Kötü örnek
console.log('data:', data);

// ✅ İyi örnek
logger.debug('Fetching earthquake data', { timestamp: new Date() });
```

#### Debugger
```javascript
// VS Code debugger kullanımı
debugger;

// Node.js inspector
node --inspect index.js
```

#### Winston Logları
```javascript
// Log seviyeleri
logger.error('Error message');
logger.warn('Warning message');
logger.info('Info message');
logger.debug('Debug message');
```

### Hata Yönetimi

#### Global Error Handler
```javascript
// ❌ Kötü örnek
try {
    // kod
} catch (error) {
    res.status(500).send('Error');
}

// ✅ İyi örnek
app.use((err, req, res, next) => {
    logger.error('Unhandled error:', err);
    
    if (process.env.NODE_ENV === 'development') {
        res.status(500).json({
            error: err.message,
            stack: err.stack
        });
    } else {
        res.status(500).json({
            error: 'Internal Server Error'
        });
    }
});
```

#### API Hata Yanıtları
```javascript
// ❌ Kötü örnek
res.status(400).send('Bad request');

// ✅ İyi örnek
res.status(400).json({
    error: 'Validation failed',
    details: errors.array(),
    timestamp: new Date().toISOString()
});
```

## Deployment

### Deployment Süreci

#### Hazırlık
- Tüm testlerin geçtiğinden emin olun
- Dokümantasyon güncellendi mi?
- Sürüm numarası belirlendi mi?

#### Build
```bash
# Production build
npm run build

# Environment değişkenleri
export NODE_ENV=production
export PORT=3000
```

#### Deployment
```bash
# Heroku deployment
git push heroku main

# Manual deployment
npm run deploy:prod
```

### Deployment Checklist

- [ ] Tüm testler geçti
- [ ] Dokümantasyon güncellendi
- [ ] Sürüm numarası belirlendi
- [ ] Environment değişkenleri ayarlandı
- [ ] Loglama yapılandırıldı
- [ ] Güvenlik kontrolleri yapıldı
- [ ] Performans testleri yapıldı

## Güvenlik

### Güvenlik Kontrolleri

#### Input Validation
```javascript
// ❌ Kötü örnek
app.get('/api', (req, res) => {
    const min = req.query.min;
    res.send(data);
});

// ✅ İyi örnek
app.get('/api', [
    query('min').optional().isFloat({ min: 0, max: 10 }),
    query('max').optional().isFloat({ min: 0, max: 10 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const min = req.query.min;
    res.send(data);
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

#### Rate Limiting
```javascript
// Rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100, // IP başına limit
    message: 'Çok fazla istek gönderdiniz'
});
app.use('/api', apiLimiter);
```

## Performans

### Performans Optimizasyonu

#### Veritabanı Optimizasyonu
- **Indexleme** yapın
- **Sorguları** optimize edin
- **Connection pooling** kullanın

#### API Optimizasyonu
- **Caching** kullanın
- **Compression** etkinleştirin
- **Lazy loading** yapın

#### Frontend Optimizasyonu
- **Asset optimizasyonu** yapın
- **Code splitting** kullanın
- **Lazy loading** yapın

### Performans Testleri

#### Load Testing
```bash
# Artillery ile load test
npm run test:load
```

#### Performance Monitoring
```javascript
// Performance monitoring
const startTime = Date.now();
// kod çalıştırma
const endTime = Date.now();
logger.info(`Performance: ${endTime - startTime}ms`);
```

## İletişim

### Geliştirme Ekibi
- **Tech Lead**: Proje Lideri
- **Developers**: Açık kaynak katkıda bulunanlar

### İletişim Kanalları
- **GitHub Issues**: [Proje Issues](https://github.com/turkiye-deprem-takip/turkiye-deprem-takip/issues)
- **GitHub Discussions**: [Discussions](https://github.com/turkiye-deprem-takip/turkiye-deprem-takip/discussions)
- **Email**: destek@turkiye-deprem-takip.com

### Toplantılar
- **Haftalık Sync**: Her Pazartesi 10:00
- **Sprint Planning**: Her Ayın ilk Pazartesi
- **Sprint Review**: Her Ayın son Cuma
- **Retrospective**: Her Ayın son Cuma 15:00

---

*Bu kılavuz düzenli olarak güncellenmektedir. Son güncelleme: 10 Ağustos 2025*