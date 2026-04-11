# Requirements — Türkiye Deprem Takip Sistemi

## İşlevsel Gereksinimler
### Veri Çekme ve İşleme
- **Kandilli Rasathanesi Entegrasyonu**: `http://www.koeri.boun.edu.tr/scripts/lst0.asp` adresinden otomatik veri çekme
- **Veri Ayrıştırma**: HTML içeriğini Cheerio ile ayrıştırarak deprem verilerini çıkarma
- **Veri Doğrulama**: Gelen verilerin formatını ve bütünlüğünü kontrol etme
- **Retry Mekanizması**: Ağ hatalarında otomatik yeniden deneme (3 kez, artan gecikme ile)
- **Veri Depolama**: Çekilen verileri bellekte geçici olarak tutma

### API Endpoint'leri
- **GET /api/v1/depremler**: Tüm deprem verilerini getirme
- **Filtreleme Parametreleri**:
  - `tarih`: Belirli bir tarihteki depremleri filtreleme
  - `min`: Minimum büyüklük filtresi
  - `max`: Maksimum büyüklük filtresi
  - `sehir`: Şehir bazında filtreleme
- **Hata Yönetimi**: Geçersiz parametrelerde 400 hatası, sunucu hatalarında 500 hatası
- **Rate Limiting**: 15 dakikada 100 istek sınırı

### Web Arayüzü
- **Ana Sayfa**: Deprem listesi ve harita içeren responsive arayüz
- **Gerçek Zamanlı Güncelleme**: 60 saniyede bir otomatik yenileme
- **Filtreleme Kullanıcı Arayüzü**:
  - Büyüklük filtresi (dropdown: Tümü, 3.0+, 4.0+, 5.0+)
  - Şehir filtresi (otomatik şehir listesi)
- **Harita Entegrasyonu**: Leaflet ile Türkiye haritası ve deprem işaretçileri
- **Tablo Görünümü**: Deprem listesini tablo formatında gösterme
- **Detay Popup**: Harita üzerindeki depremlere tıklayarak detay bilgisi

### Gerçek Zamanlı İletişim
- **Socket.IO Entegrasyonu**: Gerçek zamanlı veri güncellemeleri
- **Oturum Yönetimi**: Kullanıcı oturumları ve authentication
- **Event Sistemi**: Deprem güncellemeleri için özel event'ler

## İşlevsel Olmayan Gereksinimler
### Performans
- **Yüksek Yanıt Süresi**: API endpoint'leri için < 500ms
- **Veri İşleme**: 1000+ deprem kaydını saniyede işleme
- **Harita Performansı**: 50+ işareci sorunsuz render etme
- **Memory Usage**: < 512MB RAM kullanımı

### Güvenlik
- **XSS Koruması**: Kullanıcı girdilerinde XSS temizleme
- **SQL/NoSQL Enjeksiyon**: Enjeksiyon saldırılarına karşı koruma
- **Rate Limiting**: API abuse önleme
- **CORS**: Cross-origin request güvenliği
- **Helmet**: Güvenlik başlıkları
- **JWT Authentication**: Kullanıcı doğrulama
- **Input Validation**: Tüm input'ların doğrulanması

### Uyumluluk
- **Tarayıcı Uyumluluğu**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Mobil Uyum**: Responsive tasarım, touch uyumlu
- **API Standartları**: RESTful API standartları
- **Encoding**: UTF-8 karakter desteği

### Erişilebilirlik
- **WCAG 2.1 AA**: Temel erişilebilirlik standartları
- **Klavye Navigasyonu**: Tam klavye erişimi
- **Ekran Okuyucu**: ARIA etiketleri desteği
- **Renk Kontrastı**: Yeterli renk kontrastı

### Ölçeklenebilirlik
- **Modüler Mimari**: Yeni özelliklerin kolay eklenmesi
- **Database**: Gelecekte veritabanı entegrasyonu için hazırlık
- **Load Balancing**: Birden fazla sunucu desteği
- **Caching**: Veri önbellekleme mekanizması

## Kabul Kriterleri ve Test
### API Testleri
- **Endpoint Testleri**: Tüm endpoint'lerin doğru çalışması
- **Filtreleme Testleri**: Filtre parametrelerinin doğru çalışması
- **Hata Testleri**: Geçersiz isteklerde doğru hata kodları
- **Performance Testleri**: API yanıt süreleri
- **Security Testleri**: Güvenlik açıklarının tespiti

### UI Testleri
- **Responsive Testleri**: Farklı ekran boyutlarında çalışma
- **Functionality Testleri**: Butonlar, filtreler, harita etkileşimleri
- **Accessibility Testleri**: Erişilebilirlik standartları
- **Cross-browser Testleri**: Farklı tarayıcılarda çalışma

### Integration Testleri
- **Veri Çekme Testleri**: Kandilli Rasathanesi entegrasyonu
- **Socket.IO Testleri**: Gerçek zamanlı iletişim
- **End-to-End Testleri**: Tüm sistem entegrasyonu

### Duman Testleri (Smoke Tests)
- **Sunucu Başlatma**: Uygulamanın başarıyla başlatılması
- **Temel API Çağrıları**: Basit API isteklerinin çalışması
- **Ana Sayfa Yükleme**: Web arayüzünün doğru yülenmesi
- **Veri Gösterimi**: Deprem verilerinin doğru gösterilmesi