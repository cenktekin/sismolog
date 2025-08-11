---
inclusion: always
scope: development, documentation, automation
portability: portable
---

# Türkiye Deprem Takip Sistemi - Geliştirme Kuralları

## Proje Genel Bakışı
Bu belge, Türkiye Deprem Takip Sistemi projesi için özel geliştirme kurallarını tanımlar. Odak: gerçek zamanlı deprem veri toplama, güvenli API sunumu, modern web arayüzü ve güvenli dağıtım.

## Teknoloji Yığını
- Backend: Node.js, Express.js, Socket.IO
- Frontend: HTML5, CSS3, JavaScript (ES6+), TailwindCSS, Leaflet
- Veri İşleme: Cheerio, Request
- Güvenlik: Helmet, CORS, Rate Limiting, JWT, XSS temizleme, NoSQL enjeksiyon koruması
- Test: Jest, Supertest
- Template Engine: EJS

## Örnek Dosya Yapısı (Proje Özel)
- index.js: Ana uygulama dosyası, Express sunucusu, Socket.IO entegrasyonu
- api/index.php: PHP alternatif API endpoint'i
- views/index.ejs: Ana sayfa template'i, harita ve tablo arayüzü
- assets/css/style.css: Özel stiller
- assets/js/app.js: İstemci tarafı JavaScript
- tests/: Birim ve entegrasyon testleri
- logs/: Winston log dosyaları

## Veri Akış Deseni (Deprem Takip Sistemi)
1) Kandilli Rasathanesi'nden veri çekilir (requestWithRetry ile güvenli istek)
2) Veri Cheerio ile ayrıştırılır ve Deprem sınıfı ile yapılandırılır
3) Veri doğrulanır (validateDepremData fonksiyonu)
4) API endpoint'leri üzerinden filtrelenmiş veri sunulur
5) Socket.IO ile gerçek zamanlı güncellemeler yapılır
6) Leaflet haritasında depremler görselleştirilir
7) Kullanıcı filtreleme ve arama yapabilir

## Geliştirme İş Akışı
- Lokal test: npm run dev (nodemon ile)
- API testleri: Jest + Supertest
- Frontend testleri: Browser konsolu ve manuel test
- Dağıtım: Node.js sunucusu, PM2 ile process management

### Güvenli Değişiklik Korumaları (Deprem Sistemi İçin)
- Minimal difflere öncelik verin. Deprem veri çekme mantığını bozmayın.
- Çalışan API endpoint'lerini değiştirmeden önce mevcut istemcileri kontrol edin.
- Veri formatı değişikliklerinde geriye uyumluluk sağlayın.
- Kritik değişiklikler için özellik bayrakları kullanın.
- Public fonksiyon imzalarını değiştirmeden önce dokümantasyonu güncelleyin.

### Token-Efficient Interaction Kuralları
- Cevapları kısa ve projeye odaklı tutun.
- Deprem verisi formatını ve API yapısını tekrarlamayın.
- Socket.IO event'lerini ve API endpoint'lerini net belirtin.
- Hata mesajlarını Türkçe ve anlaşılır verin.

### No-Regression Düzenleme Protokolü
1) Kapsamı belirle
   - Deprem veri çekme, API sunma veya UI güncelleme olarak sınıflandır
   - Dokunulacak dosyaları ve fonksiyonları net listele
2) Anlık görüntü
   - Yapı değişikliklerinden önce yedek al
3) Düzenleme
   - Minimal SEARCH/REPLACE uygula
   - Deprem veri formatını bozmayan değişiklikler yap
4) Doğrulama
   - API endpoint'lerini test et
   - Harita ve tablo görüntülemelerini kontrol et
   - Socket.IO bağlantılarını doğrula
5) Geri alma planı
   - Ters işlem adımını belgele

### API/Ağ Güvenliği
- Oran sınırlamalarına saygı: API endpoint'lerinde 15 dakikada 100 istek limiti
- Anlamlı User-Agent ayarlayın: "Türkiye-Deprem-Takip/1.0"
- Zaman aşımı durumlarını zarifçe ele alın: 5 saniye timeout
- Deprem veri çekme işlemlerinde retry mekanizması kullanın

### Hata Yönetimi Temeli
- Harici API çağrılarını try/catch ile sarmalayın
- Deprem veri formatı hatalarında güvenli varsayılanlarla devam edin
- DOM erişimini koruyun: Leaflet haritası elementlerini kontrol edin
- Ağ hatalarında kullanıcıya anlaşılır mesajlar gösterin

### Performans & UX
- Deprem verilerini verimli şekilde filtreleyin
- Harita işaretçilerini optimize edin (magnitude'a göre boyutlandırma)
- Mobile-first stilleri koruyun
- Gerçek zamanlı güncellemeler için Socket.IO kullanın

### Riskli Değişiklikler için Onaylar
Açık onay gerektiren değişiklikler:
- Deprem veri çekme URL'sini değiştirme
- API endpoint yapısını değiştirme
- Veri formatını değiştirme
- Socket.IO event isimlerini değiştirme
- Kritik CSS/JS dosyalarını yeniden adlandırma

## AI Asistanı Kılavuzları
- Hızlıca çalışır, minimal ve deprem takip sistemine odaklı kod üretin
- Deprem veri formatını ve API yapısını koruyun
- Güvenlik ve performansı gözetin
- Gerçek zamanlı güncellemeler için Socket.IO kullanın
- Harita entegrasyonunu bozmayın
- Deprem verisi doğrulama mantığını koruyun

### Asistan Operasyonel Politikası (Zorunlu)
- Tam dosya yeniden yazımı yerine, hassas SEARCH/REPLACE ile hedefli değişiklikleri tercih edin.
- Tek yanıtta tek araç/işlem; ilerlemeden önce onay/sonuç bekleyin.
- Deprem veri formatı ve API dokümantasyonunu tekrarlamayın.
- Çekirdek dosyaları düzenlemeden önce yedek varlığını kontrol edin; yoksa oluşturun.
- Deprem veri çekme veya harita güncelleme gibi kritik akışları etkileyebilecek değişikliklerde özellik bayrağı ekleyin ve varsayılanı devre dışı tutun.