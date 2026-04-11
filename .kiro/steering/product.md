# Product — Türkiye Deprem Takip Sistemi

## Öz
Türkiye Deprem Takip Sistemi, Kandilli Rasathanesi'nden gerçek zamanlı olarak deprem verilerini çeken, modern bir web arayüzü ile sunan ve API endpoint'leri üzerinden erişim sağlayan açık kaynaklı bir projedir. Sistem, depremlerin büyüklüğüne, derinliğine, konumuna ve zamanına göre filtreleme imkanı sunarak kullanıcıların deprem verilerini kolayca takip etmesini sağlar.

## Hedef Kullanıcılar
- **Genel Kullanıcılar**: Deprem haberlerini ve verilerini takip etmek isteyen vatandaşlar
- **Geliştiriciler**: Deprem verilerine erişim sağlamak isteyen diğer uygulamaların geliştiricileri
- **İşletme Kullanıcıları**: Deprem riski analizi ve raporlama yapan kurumlar
- **Acil Durum Yönetimi**: Deprem anında ve sonrasında koordinasyon sağlayan ekipler
- **Medya Kuruluşları**: Deprem haberlerini anında yayınlamak isteyen medya organları

## Değer Önerisi
- **Gerçek Zamanlı Veri**: Kandilli Rasathanesi'nden anlık deprem bilgileri
- **Modern Arayüz**: Responsive ve kullanıcı dostu web arayüzü
- **Harita Entegrasyonu**: Leaflet ile görsel konumlandırma
- **Güvenli API**: Rate limiting ve güvenlik önlemleri ile API erişimi
- **Filtreleme Özellikleri**: Büyüklük, şehir, tarih gibi kriterlerle filtreleme
- **Açık Kaynak**: Tamamen ücretsiz ve modüler yapısı
- **Mobil Uyum**: Tüm cihazlarda sorunsuz çalışma

## Temel Özellikler
- **Otomatik Veri Çekme**: Kandilli Rasathanesi'nden 60 saniyede bir güncelleme
- **Gerçek Zamanlı Bildirim**: Socket.IO ile anlık güncellemeler
- **Görselleştirme**: Büyüklüğe göre renklendirilmiş harita ve tablo
- **Filtreleme**: Büyüklük, şehir, tarih bazında filtreleme
- **API Erişimi**: RESTful API endpoint'leri
- **Güvenlik**: JWT authentication, rate limiting, XSS koruması
- **Loglama**: Winston ile detaylı loglama sistemi

## Teknik Avantajlar
- **Yüksek Performans**: Asenkron veri işleme ve optimize edilmiş API
- **Güvenilirlik**: Retry mekanizması ve hata yönetimi
- Ölçeklenebilir: Modüler mimari ile gelecekteki genişlemeye uygun
- **Bakım Kolaylığı**: Temiz kod yapısı ve dokümantasyon
- **Test Desteği**: Kapsamlı test altyapısı

## Kullanım Senaryoları
1. **Günlük Takip**: Kullanıcıların günlük deprem aktivitesini takip etmesi
2. **Risk Analizi**: Belirli bölgelerdeki deprem riskinin analizi
3. **Haber Üretimi**: Medya kuruluşlarının anlık haber üretimi
4. **Uygulama Entegrasyonu**: Diğer uygulamalara veri sağlama
5. **Eğitim Amaçlı**: Deprem verilerinin eğitim ve araştırma amaçlı kullanımı

## Sürüm Geçmişi
- **v1.0.0**: Temel deprem takip sistemi, harita entegrasyonu, API endpoint'leri