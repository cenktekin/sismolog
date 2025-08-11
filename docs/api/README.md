# Türkiye Deprem Takip Sistemi - API Dokümantasyonu

Bu doküman, Türkiye Deprem Takip Sistemi'nin API endpoint'lerini, request/response formatlarını, hata kodlarını ve kullanım örneklerini içermektedir.

## İçindekiler

- [Genel Bakış](#genel-bakış)
- [Authentication](#authentication)
- [Endpoint'ler](#endpointler)
- [Request Formatları](#request-formatları)
- [Response Formatları](#response-formatları)
- [Hata Kodları](#hata-kodları)
- [Örnekler](#örnekler)
- [Rate Limiting](#rate-limiting)
- [Güvenlik](#güvenlik)
- [Sürüm Yönetimi](#sürüm-yönetimi)

## Genel Bakış

Türkiye Deprem Takip Sistemi API, Kandilli Rasathanesi'nden alınan deprem verilerini programatik olarak erişime sunan bir REST API'dir. API, JSON formatında veri döner ve gerçek zamanlı olarak güncellenir.

### API Bilgileri

| Bilgi | Değer |
|-------|-------|
| **Base URL** | `https://api.turkiye-deprem-takip.com` |
| **API Version** | `v1` |
| **Format** | JSON |
| **Authentication** | JWT Token |

### Özellikler

- **Gerçek Zamanlı Veri**: Kandilli Rasathanesi'nden canlı veri
- **Filtreleme**: Büyüklük, tarih, şehir bazlı filtreleme
- **Pagination**: Büyük veri setleri için sayfalama
- **Rate Limiting**: API koruması
- **CORS**: Çapraz domain desteği

## Authentication

### JWT Token Kullanımı

API'ye erişim için JWT token gereklidir. Token, `Authorization` header'ında gönderilir.

#### Token Alımı

```bash
# Login endpoint'ine istek atarak token alın
curl -X POST https://api.turkiye-deprem-takip.com/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "user", "password": "password"}'
```

#### Token Kullanımı

```bash
# Token'ı Authorization header'ında kullanın
curl -X GET https://api.turkiye-deprem-takip.com/api/v1/depremler \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Token Formatı

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600
}
```

## Endpoint'ler

### 1. Deprem Verileri

#### GET /api/v1/depremler

Tüm deprem verilerini getirir.

**Parametreler:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| `tarih` | string | Hayır | Belirli bir tarihteki depremleri filtrele (YYYY-MM-DD) |
| `min` | number | Hayır | Minimum büyüklük |
| `max` | number | Hayır | Maksimum büyüklük |
| `sehir` | string | Hayır | Şehir bazlı filtreleme |
| `page` | number | Hayır | Sayfa numarası (varsayılan: 1) |
| `limit` | number | Hayır | Sayfa başına kayıt sayısı (varsayılan: 50, maks: 100) |

**Örnek İstek:**

```bash
curl -X GET "https://api.turkiye-deprem-takip.com/api/v1/depremler?min=4.0&max=6.0&sehir=İstanbul" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Başarılı Yanıt (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "tarih": "2025-08-10",
      "saat": "12:34:56",
      "enlem": "41.0123",
      "boylam": "28.9765",
      "derinlik": "10.5",
      "buyukluk": "5.2",
      "yer": "İstanbul merkezli",
      "sehir": "İstanbul",
      "created_at": "2025-08-10T12:34:56Z",
      "updated_at": "2025-08-10T12:34:56Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 15,
    "total_pages": 1
  },
  "metadata": {
    "source": "Kandilli Rasathanesi",
    "last_updated": "2025-08-10T12:34:56Z",
    "version": "1.0.0"
  }
}
```

**Hata Yanıtları:**

```json
// 400 Bad Request
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Geçersiz parametreler",
    "details": [
      {
        "field": "min",
        "message": "Minimum büyüklük 0-10 arasında olmalı"
      }
    ]
  }
}

// 401 Unauthorized
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Geçersiz veya süresi dolmuş token"
  }
}

// 403 Forbidden
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Bu işlemi yapmaya yetkiniz yok"
  }
}

// 500 Internal Server Error
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "Sunucu hatası",
    "details": "Veri çekme sırasında hata oluştu"
  }
}
```

### 2. Deprem Detayları

#### GET /api/v1/depremler/:id

Belirli bir depremin detaylı bilgilerini getirir.

**Parametreler:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| `id` | string | Evet | Deprem ID'si |

**Örnek İstek:**

```bash
curl -X GET "https://api.turkiye-deprem-takip.com/api/v1/depremler/1" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Başarılı Yanıt (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "1",
    "tarih": "2025-08-10",
    "saat": "12:34:56",
    "enlem": "41.0123",
    "boylam": "28.9765",
    "derinlik": "10.5",
    "buyukluk": "5.2",
    "yer": "İstanbul merkezli",
    "sehir": "İstanbul",
    "epicenter": {
      "type": "Point",
      "coordinates": [28.9765, 41.0123]
    },
    "magnitude_type": "ML",
    "status": "confirmed",
    "created_at": "2025-08-10T12:34:56Z",
    "updated_at": "2025-08-10T12:34:56Z"
  }
}
```

### 3. İstatistikler

#### GET /api/v1/statistics

Deprem istatistiklerini getirir.

**Parametreler:**

| Parametre | Tip | Zorunlu | Açıklama |
|-----------|-----|---------|----------|
| `tarih` | string | Hayır | Belirli bir tarih aralığı (başlangıç-bitiş) |
| `sehir` | string | Hayır | Şehir bazlı istatistikler |

**Örnek İstek:**

```bash
curl -X GET "https://api.turkiye-deprem-takip.com/api/v1/statistics?sehir=İstanbul" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Başarılı Yanıt (200 OK):**

```json
{
  "success": true,
  "data": {
    "total_earthquakes": 150,
    "magnitude_distribution": {
      "0-2": 50,
      "2-4": 80,
      "4-6": 15,
      "6+": 5
    },
    "daily_average": 5.2,
    "largest_earthquake": {
      "magnitude": 6.5,
      "date": "2025-08-05",
      "location": "İzmir"
    },
    "last_7_days": {
      "total": 36,
      "average_magnitude": 3.8
    }
  }
}
```

### 4. Şehir Listesi

#### GET /api/v1/cities

Tüm şehirleri listeler.

**Örnek İstek:**

```bash
curl -X GET "https://api.turkiye-deprem-takip.com/api/v1/cities" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Başarılı Yanıt (200 OK):**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "İstanbul",
      "latitude": 41.0082,
      "longitude": 28.9784,
      "country": "Türkiye"
    },
    {
      "id": "2",
      "name": "Ankara",
      "latitude": 39.9334,
      "longitude": 32.8597,
      "country": "Türkiye"
    }
  ]
}
```

### 5. Canlı Veri (WebSocket)

#### WebSocket Connection

Gerçek zamanlı veri akışı için WebSocket bağlantısı kullanılır.

**Bağlantı:**

```javascript
const socket = io('https://api.turkiye-deprem-takip.com', {
  auth: {
    token: 'YOUR_JWT_TOKEN'
  }
});

socket.on('connect', () => {
  console.log('Connected to earthquake data stream');
});

socket.on('earthquake', (data) => {
  console.log('New earthquake:', data);
});
```

**Mesaj Formatı:**

```json
{
  "type": "earthquake",
  "data": {
    "id": "123",
    "tarih": "2025-08-10",
    "saat": "12:34:56",
    "enlem": "41.0123",
    "boylam": "28.9765",
    "derinlik": "10.5",
    "buyukluk": "5.2",
    "yer": "İstanbul merkezli",
    "sehir": "İstanbul"
  },
  "timestamp": "2025-08-10T12:34:56Z"
}
```

## Request Formatları

### Content-Type

Tüm POST ve PUT istekleri için `Content-Type: application/json` header'ı gereklidir.

### Request Body Format

```json
{
  "username": "string",
  "password": "string"
}
```

### Query Parameters

- Tüm parametreler opsiyoneldir
- Sayısal parametreler ondalıklı sayı olabilir
- Tarih parametreleri `YYYY-MM-DD` formatında olmalıdır

## Response Formatları

### Başarılı Yanıt

```json
{
  "success": true,
  "data": {},
  "pagination": {},
  "metadata": {}
}
```

### Hata Yanıtı

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Hata mesajı",
    "details": "Detaylı bilgi"
  }
}
```

### Pagination Formatı

```json
{
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 150,
    "total_pages": 3,
    "has_next": true,
    "has_prev": false
  }
}
```

## Hata Kodları

### HTTP Durum Kodları

| Kod | Anlamı | Açıklama |
|-----|--------|----------|
| 200 | OK | İstek başarılı |
| 201 | Created | Kayıt oluşturuldu |
| 400 | Bad Request | Geçersiz istek |
| 401 | Unauthorized | Yetkisiz erişim |
| 403 | Forbidden | Yasaklı erişim |
| 404 | Not Found | Kayıt bulunamadı |
| 422 | Unprocessable Entity | Doğrulama hatası |
| 429 | Too Many Requests | Rate limit aşıldı |
| 500 | Internal Server Error | Sunucu hatası |
| 503 | Service Unavailable | Servis kullanılamıyor |

### Hata Kodları

| Kod | Mesaj | Açıklama |
|-----|-------|----------|
| `VALIDATION_ERROR` | Doğrulama hatası | Girdi doğrulaması başarısız |
| `UNAUTHORIZED` | Yetkisiz erişim | Geçersiz token |
| `FORBIDDEN` | Yasaklı erişim | İzin yok |
| `NOT_FOUND` | Kayıt bulunamadı | İstenen kaynak mevcut değil |
| `RATE_LIMIT_EXCEEDED` | Rate limit aşıldı | Çok fazla istek |
| `INTERNAL_ERROR` | İç sunucu hatası | Sunucu tarafı hata |
| `SERVICE_UNAVAILABLE` | Servis kullanılamıyor | Servis bakımda |
| `DATA_SOURCE_ERROR` | Veri kaynağı hatası | Kandilli Rasathanesi erişilemiyor |

## Örnekler

### 1. Temel Deprem Verisi Çekme

```bash
#!/bin/bash

# API endpoint
API_URL="https://api.turkiye-deprem-takip.com/api/v1/depremler"

# Token
TOKEN="YOUR_JWT_TOKEN"

# İstek yapma
curl -X GET "${API_URL}?min=4.0&limit=10" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/json" \
  | jq '.data[] | {tarih, saat, buyukluk, yer, sehir}'
```

### 2. Python Örneği

```python
import requests
import json

class EarthquakeAPI:
    def __init__(self, base_url, token):
        self.base_url = base_url
        self.token = token
        self.headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
    
    def get_earthquakes(self, min_magnitude=None, max_magnitude=None, city=None, limit=50):
        params = {'limit': limit}
        
        if min_magnitude:
            params['min'] = min_magnitude
        if max_magnitude:
            params['max'] = max_magnitude
        if city:
            params['sehir'] = city
        
        response = requests.get(
            f'{self.base_url}/api/v1/depremler',
            headers=self.headers,
            params=params
        )
        
        response.raise_for_status()
        return response.json()
    
    def get_earthquake_details(self, earthquake_id):
        response = requests.get(
            f'{self.base_url}/api/v1/depremler/{earthquake_id}',
            headers=self.headers
        )
        
        response.raise_for_status()
        return response.json()

# Kullanım
api = EarthquakeAPI(
    base_url='https://api.turkiye-deprem-takip.com',
    token='YOUR_JWT_TOKEN'
)

# 4.0 ve üzeri depremleri çek
earthquakes = api.get_earthquakes(min_magnitude=4.0, limit=10)
print(json.dumps(earthquakes, indent=2, ensure_ascii=False))
```

### 3. JavaScript (Node.js) Örneği

```javascript
const axios = require('axios');

class EarthquakeAPI {
  constructor(baseURL, token) {
    this.baseURL = baseURL;
    this.token = token;
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getEarthquakes(params = {}) {
    const response = await this.client.get('/api/v1/depremler', {
      params: {
        limit: 50,
        ...params
      }
    });
    return response.data;
  }

  async getEarthquakeDetails(id) {
    const response = await this.client.get(`/api/v1/depremler/${id}`);
    return response.data;
  }

  async getStatistics(city = null) {
    const response = await this.client.get('/api/v1/statistics', {
      params: { city }
    });
    return response.data;
  }
}

// Kullanım
const api = new EarthquakeAPI(
  'https://api.turkiye-deprem-takip.com',
  'YOUR_JWT_TOKEN'
);

// 5.0 ve üzeri depremleri çek
api.getEarthquakes({ min: 5.0, limit: 10 })
  .then(data => {
    console.log('Earthquakes:', data);
  })
  .catch(error => {
    console.error('Error:', error.response?.data || error.message);
  });
```

### 4. WebSocket Örneği

```javascript
const io = require('socket.io-client');

class EarthquakeStream {
  constructor(url, token) {
    this.url = url;
    this.token = token;
    this.socket = null;
  }

  connect() {
    this.socket = io(this.url, {
      auth: {
        token: this.token
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to earthquake stream');
    });

    this.socket.on('earthquake', (data) => {
      console.log('New earthquake detected:', data);
      this.handleEarthquake(data);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from earthquake stream');
    });
  }

  handleEarthquake(data) {
    // Deprem verilerini işle
    if (data.data.buyukluk >= 4.0) {
      console.log(`🚨 ${data.data.buyukluk} büyüklüğünde deprem!`);
      console.log(`📍 ${data.data.yer} - ${data.data.sehir}`);
      console.log(`🕐 ${data.data.tarih} ${data.data.saat}`);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

// Kullanım
const stream = new EarthquakeStream(
  'https://api.turkiye-deprem-takip.com',
  'YOUR_JWT_TOKEN'
);

stream.connect();

// 30 saniye sonra bağlantıyı kes
setTimeout(() => {
  stream.disconnect();
}, 30000);
```

## Rate Limiting

### Sınırlamalar

- **API Rate Limit**: 15 dakikada 100 istek
- **WebSocket Rate Limit**: Dakikada 60 bağlantı
- **Request Size**: 10MB
- **Response Size**: 50MB

### Rate Limit Header'ları

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1629456000
X-RateLimit-Reset-Time: "2025-08-10T12:00:00Z"
```

### Rate Limit Aşımı

Rate limit aşıldığında `429 Too Many Requests` hatası döner:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit aşıldı",
    "details": {
      "limit": 100,
      "remaining": 0,
      "reset_time": "2025-08-10T12:00:00Z"
    }
  }
}
```

## Güvenlik

### CORS Politikası

```http
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
```

### Güvenlik Başlıkları

```http
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

### Veri Şifreleme

- **HTTPS**: Tüm iletişimler SSL/TLS ile şifrelenir
- **Token**: JWT token'lar 256-bit RSA ile imzalanır
- **Data**: Hassas veriler AES-256 ile şifrelenir

## Sürüm Yönetimi

### Sürüm Formatı

Sürüm numaraları `MAJOR.MINOR.PATCH` formatındadır:

- **MAJOR**: Breaking changes
- **MINOR**: Yeni özellikler
- **PATCH**: Bug düzeltmeleri

### Desteklenen Sürümler

- **v1**: Güncel sürüm (tüm özellikler)
- **v0**: Eski sürüm (sadece temel özellikler)

### API Değişiklikleri

- Breaking changes için en az 1 hafta önceden bildirim
- Yeni özellikler geriye dönük uyumlu
- Eski sürümler en az 3 ay desteklenir

### Deprecation Politikası

```json
{
  "success": false,
  "error": {
    "code": "DEPRECATED",
    "message": "Bu endpoint kullanımdan kaldırıldı",
    "details": {
      "deprecated_version": "1.0.0",
      "removed_version": "2.0.0",
      "alternative": "Yeni endpoint kullanın"
    }
  }
}
```

## İletişim

### Destek

- **Email**: api-support@turkiye-deprem-takip.com
- **Slack**: [API Destek Kanalı](https://turkiye-deprem-takip.slack.com)
- **Discord**: [API Destek Sunucusu](https://discord.gg/turkiye-deprem-takip)

### Hata Raporlama

API hatalarını raporlamak için:

```bash
# GitHub Issues
https://github.com/turkiye-deprem-takip/turkiye-deprem-takip/issues

# Email
api-bugs@turkiye-deprem-takip.com
```

### Özellik İsteği

Yeni özellikler için:

```bash
# GitHub Discussions
https://github.com/turkiye-deprem-takip/turkiye-deprem-takip/discussions

# Email
api-features@turkiye-deprem-takip.com
```

## Lisans

Bu API dokümantasyonu MIT lisansı ile dağıtılmaktadır. Daha fazla bilgi için [LICENSE](../../LICENSE) dosyasına bakın.

---

*Bu doküman düzenli olarak güncellenmektedir. Son güncelleme: 10 Ağustos 2025*