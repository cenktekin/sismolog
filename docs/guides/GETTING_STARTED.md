# Türkiye Deprem Takip Sistemi - Başlangıç Kılavuzu

Bu kılavuz, Türkiye Deprem Takip Sistemi projesini kurmak, çalıştırmak ve geliştirmek için gereken adımları içermektedir.

## İçindekiler

- [Ön Koşullar](#ön-koşullar)
- [Kurulum](#kurulum)
- [Geliştirme Ortamı Ayarı](#geliştirme-ortamı-ayarı)
- [Proje Çalıştırma](#proje-çalıştırma)
- [Hata Ayıklama](#hata-ayıklama)
- [Sıkça Sorulan Sorular](#sıkça-sorulan-sorular)

## Ön Koşullar

### Sistem Gereksinimleri

| Bileşen | Minimum Gereksinim | Önerilen Gereksinim |
|---------|-------------------|-------------------|
| **Node.js** | v16.0+ | v18.0+ |
| **npm** | v8.0+ | v9.0+ |
| **RAM** | 512MB | 1GB+ |
| **Disk Alanı** | 100MB | 500MB+ |
| **İnternet Bağlantısı** | Gerekli | Gerekli |

### Geliştirme Araçları

- **Code Editor**: Visual Studio Code, Sublime Text, veya JetBrains WebStorm
- **Terminal**: Windows PowerShell, macOS Terminal, veya Linux Terminal
- **Version Control**: Git
- **Browser**: Chrome, Firefox, Safari, veya Edge (en son sürüm)

### Node.js Kurulumu

#### Windows
1. [Node.js resmi sitesinden](https://nodejs.org/) LTS sürümünü indirin
2. Kurulum sihirbazını çalıştırın
3. Terminalde `node --version` ve `npm --version` komutlarıyla kurulumu kontrol edin

#### macOS
```bash
# Homebrew ile kurulum
brew install node

# veya Node.js resmi sitesinden indirip kurun
```

#### Linux (Ubuntu/Debian)
```bash
# NodeSource deposunu ekleyin
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Node.js ve npm'i kurun
sudo apt-get install -y nodejs
```

### Git Kurulumu

#### Windows
1. [Git for Windows](https://git-scm.com/download/win) indirin
2. Kurulum sihirbazını çalıştırın

#### macOS
```bash
# Homebrew ile kurulum
brew install git
```

#### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install git
```

## Kurulum

### 1. Proje Klonlama

Projeyi GitHub'dan klonlayın:

```bash
# HTTPS ile klonlama
git clone https://github.com/turkiye-deprem-takip/turkiye-deprem-takip.git

# SSH ile klonlama
git clone git@github.com:turkiye-deprem-takip/turkiye-deprem-takip.git

# Proje dizinine girin
cd turkiye-deprem-takip
```

### 2. Bağımlılıkları Yükleme

Projeyi kurmak için gerekli bağımlılıkları yükleyin:

```bash
# npm ile bağımlılıkları yükleyin
npm install

# veya yarn kullanıyorsanız
yarn install
```

Bu komut, `package.json` dosyasında belirtilen tüm bağımlılıkları yükleyecektir.

### 3. Ortam Değişkenleri Ayarlama

Proje için gerekli ortam değişkenlerini yapılandırın:

#### .env Dosyası Oluşturma

```bash
# .env.example dosyasını kopyalayın
cp .env.example .env

# veya .env dosyasını manuel oluşturun
touch .env
```

#### .env Dosyasını Düzenleme

`.env` dosyasını açın ve aşağıdaki değişkenleri ayarlayın:

```env
# Sunucu Ayarları
PORT=3000
NODE_ENV=development

# Güvenlik Ayarları
JWT_SECRET=your-super-secret-jwt-key-here
SESSION_SECRET=your-super-secret-session-key-here

# CORS Ayarları
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Log Seviyesi
LOG_LEVEL=info

# Veri Kaynağı URL'i
DATA_SOURCE_URL=http://www.koeri.boun.edu.tr/scripts/lst0.asp

# API Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Önemli Notlar:**
- `JWT_SECRET` ve `SESSION_SECRET` değerlerini mutlaka değiştirin
- Üretim ortamında `NODE_ENV=production` olarak ayarlayın
- Güvenlik için güçlü ve rastgele anahtarlar kullanın

### 4. Gerekli Dizinlerin Oluşturulması

```bash
# Log dizinini oluşturun
mkdir -p logs

# Uploads dizinini oluşturun (varsa)
mkdir -p uploads

# Cache dizinini oluşturun (varsa)
mkdir -p cache
```

## Geliştirme Ortamı Ayarı

### 1. Kod Editörü Ayarları

#### Visual Studio Code
Önerilen eklentiler:
- **ESLint**: JavaScript/TypeScript için linting
- **Prettier**: Kod formatlama
- **Live Server**: Yerel sunucu
- **GitLens**: Git entegrasyonu
- **Path Intellisense**: Dosya yolu otomatik tamamlama

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact"
  ],
  "prettier.requireConfig": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

#### ESLint ve Prettier Kurulumu

```bash
# Geliştirme bağımlılıkları olarak kurun
npm install --save-dev eslint prettier eslint-config-prettier eslint-plugin-prettier

# veya
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin typescript
```

### 2. Git Ayarları

Proje için gerekli Git ayarlarını yapın:

```bash
# Kullanıcı adı ve e-posta ayarlama
git config --global user.name "Adınız Soyadınız"
git config --global user.email "email@example.com"

# Branch adı ayarlama
git config --global init.defaultBranch main

# Diff ve merge araçları
git config --global merge.tool vscode
git config --global mergetool.vscode.cmd 'code --wait $MERGED'
```

### 3. Test Ortamı Ayarı

Test ortamını kurmak için:

```bash
# Test bağımlılıklarını kurun
npm install --save-dev jest supertest @types/jest jest-environment-node

# Test konfigürasyonu
npm test
```

### 4. Veritabanı (Opsiyonel)

Eğer veritabanı kullanmayı planlıyorsanız:

```bash
# MongoDB için
npm install mongodb mongoose

# veya PostgreSQL için
npm install pg sequelize
```

## Proje Çalıştırma

### 1. Geliştirme Modunda Çalıştırma

```bash
# Geliştirme sunucusunu başlatın
npm run dev

# veya
npm run start:dev
```

Bu komut, `nodemon` ile sunucuyu başlatacak ve kod değişikliklerinde otomatik yeniden başlatacaktır.

**Çıktı:**
```
Server running on port 3000
Deprem verisi başarıyla alındı. Toplam: 15
```

### 2. Üretim Modunda Çalıştırma

```bash
# Üretim modunda çalıştırın
npm start

# veya
npm run start:prod
```

### 3. Test Modunda Çalıştırma

```bash
# Testleri çalıştırın
npm test

# Testleri izleyerek çalıştırın
npm run test:watch

# Test kapsamını raporlayın
npm run test:coverage
```

### 4. API Testleri

API endpoint'lerini test etmek için:

```bash
# API endpoint'lerini test edin
npm run test:api

# veya curl ile test edin
curl http://localhost:3000/api/v1/depremler
```

### 5. Proje Yapısı

Projenin temel dosya yapısı:

```
turkiye-deprem-takip/
├── node_modules/          # Bağımlılıklar
├── src/                  # Kaynak kodlar
│   ├── api/              # API route'ları
│   ├── controllers/      # Controller'lar
│   ├── models/           # Veri modelleri
│   ├── services/         # Servisler
│   ├── utils/            # Yardımcı fonksiyonlar
│   └── middleware/       # Middleware'ler
├── tests/                # Test dosyaları
├── logs/                 # Log dosyaları
├── public/               # Statik dosyalar
├── views/                # EJS template'ler
├── assets/               # CSS, JS, resimler
├── .env                  # Ortam değişkenleri
├── .gitignore            # Git ignore dosyası
├── package.json          # Proje bağımlılıkları
├── tailwind.config.js    # Tailwind CSS konfigürasyonu
└── index.js              # Ana uygulama dosyası
```

## Hata Ayıklama

### 1. Yaygın Hatalar ve Çözümleri

#### Port Zaten Kullanılıyor Hatası
```bash
# Farklı bir port ile çalıştırın
PORT=3001 npm run dev
```

#### Bağımlılık Kurulum Hatası
```bash
# node_modules'i silip yeniden kurun
rm -rf node_modules
npm install
```

#### .env Dosyası Hatası
```bash
# .env dosyasının doğru oluşturulduğundan emin olun
ls -la | grep .env
```

#### Veri Çekme Hatası
```bash
# İnternet bağlantınızı kontrol edin
# Kandilli Rasathanesi sitesine erişilebilirliğini kontrol edin
curl http://www.koeri.boun.edu.tr/scripts/lst0.asp
```

### 2. Debug Modu

Geliştirme modunda detaylı loglar için:

```bash
# .env dosyasına ekleyin
LOG_LEVEL=debug
NODE_ENV=development
```

### 3. Browser Developer Tools

- **Console**: JavaScript hatalarını görüntülemek için
- **Network**: API isteklerini incelemek için
- **Application**: Local storage ve session storage verilerini görüntülemek için

### 4. Winston Logları

Log dosyalarını inceleyin:

```bash
# Error logları
tail -f logs/error.log

# Tüm loglar
tail -f logs/combined.log
```

### 5. Hata Ayıklama İpuçları

#### JavaScript Hataları
- Browser konsolunda hataları kontrol edin
- `console.log()` ile değişken değerlerini kontrol edin
- Debugger kullanarak kod adım adım çalıştırın

#### API Hataları
- HTTP durum kodlarını kontrol edin
- Response body'yi inceleyin
- Network sekmesinde istek ve yanıtları kontrol edin

#### Veri Çekme Hataları
- Kandilli Rasathanesi sitesinin erişilebilirliğini kontrol edin
- Veri formatının değişip değişmediğini kontrol edin
- Rate limiting nedeniyle engellenmediğinden emin olun

## Sıkça Sorulan Sorular

### Q: Proje neden çalışmıyor?
A: Aşağıdaki adımları kontrol edin:
1. Node.js ve npm'in doğru kurulu olduğunu kontrol edin
2. Bağımlılıkların yüklendiğinden emin olun (`npm install`)
3. `.env` dosyasının doğru yapılandırıldığını kontrol edin
4. Port'un kullanılmadığından emin olun

### Q: API verilerini göremiyorum?
A: Aşağıdaki nedenleri kontrol edin:
1. İnternet bağlantınızı kontrol edin
2. Kandilli Rasathanesi sitesine erişilebilirliğini kontrol edin
3. API endpoint'ine doğru istek yaptığınızdan emin olun
4. Browser konsolunda hataları kontrol edin

### Q: Harita çalışmıyor?
A: Aşağıdaki adımları kontrol edin:
1. Leaflet.js kütüphanesinin doğru yüklendiğini kontrol edin
2. API'den gelen verilerde enlem/boylam bilgisi olup olmadığını kontrol edin
3. Browser'da JavaScript'in etkin olduğundan emin olun

### Q: Nasıl yeni özellik eklerim?
A: Yeni özellik eklemek için:
1. Yeni bir branch oluşturun (`git checkout -b feature/yeni-ozellik`)
2. Kodunuzu geliştirin
3. Testleri çalıştırın (`npm test`)
4. Değişikliklerinizi commit edin
5. Pull Request oluşturun

### Q: Proje performansı nasıl artırılır?
A: Performans artırmak için:
1. Geliştirme modunda çalıştığınızdan emin olun
2. Browser cache'ini temizleyin
3. Network sekmesinde istek sürelerini kontrol edin
4. Winston loglarında yavaş istekleri kontrol edin

### Q: Nasıl katkıda bulunabilirim?
A: Katkıda bulunmak için:
1. Proje'yi forklayın
2. Yeni bir branch oluşturun
3. Değişikliklerinizi yapın
4. Testleri çalıştırın
5. Pull Request oluşturun
6. İletişim için GitHub Issues kullanın

## İletişim

Proje ile ilgili sorularınız ve önerileriniz için:

- **GitHub Issues**: [Proje Issues](https://github.com/turkiye-deprem-takip/turkiye-deprem-takip/issues)
- **Email**: destek@turkiye-deprem-takip.com
- **Twitter**: [@turkiye-deprem-takip](https://x.com/turkiye-deprem-takip)

---

*Bu kılavuz düzenli olarak güncellenmektedir. Son güncelleme: 10 Ağustos 2025*