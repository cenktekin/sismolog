# GitHub Secrets Kurulum Talimatları

Bu dosya, Türkiye Deprem Takip projesi için GitHub Actions workflow'lerinin çalışması gereken secret'ları içerir.

## Gerekli Secret'lar

### 1. Heroku İçin Gerekli Secret'lar

#### `HEROKU_API_KEY`
- **Açıklama**: Heroku API anahtarı
- **Nasıl Alınır**: 
  1. Heroku hesabınıza giriş yapın
  2. Account Settings > API Keys bölümüne gidin
  3. "Create new API key" butonuna tıklayın
  4. Oluşturulan API key'i kopyalayın
- **Kullanım**: Heroku dağıtımları için

#### `HEROKU_APP_NAME_STAGING`
- **Açıklama**: Staging ortamının Heroku uygulama adı
- **Örnek**: `turkiye-deprem-staging`
- **Kullanım**: Staging ortamına dağıtım için

#### `HEROKU_APP_NAME_PRODUCTION`
- **Açıklama**: Production ortamının Heroku uygulama adı
- **Örnek**: `turkiye-deprem-production`
- **Kullanım**: Production ortamına dağıtım için

#### `HEROKU_APP_URL_STAGING`
- **Açıklama**: Staging ortamının URL'si
- **Örnek**: `https://turkiye-deprem-staging.herokuapp.com`
- **Kullanım**: Staging ortamı smoke testleri için

#### `HEROKU_APP_URL_PRODUCTION`
- **Açıklama**: Production ortamının URL'si
- **Örnek**: `https://turkiye-deprem-production.herokuapp.com`
- **Kullanım**: Production ortamı smoke testleri için

#### `HEROKU_EMAIL`
- **Açıklama**: Heroku hesabınızın e-posta adresi
- **Kullanım**: Heroku dağıtımları için

### 2. Bildirim İçin Gerekli Secret'lar

#### `SLACK_WEBHOOK_URL`
- **Açıklama**: Slack webhook URL'si
- **Nasıl Alınır**:
  1. Slack kanalınızda Incoming Webhooks uygulamasını etkinleştirin
  2. Webhook URL'sini kopyalayın
- **Kullanım**: Dağıtım bildirimleri için

#### `SNYK_TOKEN`
- **Açıklama**: Snyk güvenlik tarama token'ı
- **Nasıl Alınır**: 
  1. Snyk hesabınıza giriş yapın
  2. Account > Settings > API bölümünden token oluşturun
- **Kullanım**: Snyk güvenlik taramaları için

### 3. Onay İçin Gerekli Secret'lar

#### `PRODUCTION_APPROVAL_TOKEN`
- **Açıklama**: Production dağıtım onay token'ı
- **Nasıl Oluşturulur**: Rastgele bir güvenli string oluşturun
- **Kullanım**: Production ortamına dağıtım için manuel onay

#### `APPROVERS`
- **Açıklama**: Production dağıtım onaylayan kullanıcıların GitHub kullanıcı adları
- **Örnek**: `user1,user2,user3`
- **Kullanım**: Production ortamı dağıtım onayı için

### 4. Ortam Değişkenleri

#### `NODE_ENV`
- **Açıklama**: Node.js ortam değişkeni
- **Olası Değerler**: `development`, `staging`, `production`
- **Kullanım**: Uygulama yapılandırması için

#### `DATABASE_URL`
- **Açıklama**: Veritabanı bağlantı URL'si (varsa)
- **Örnek**: `mongodb://localhost:27017/turkiye-deprem`
- **Kullanım**: Veritabanı bağlantıları için

#### `JWT_SECRET`
- **Açıklama**: JWT token oluşturma için kullanılan secret
- **Örnek**: `your-super-secret-jwt-key`
- **Kullanım**: Kimlik doğrulama için

#### `SESSION_SECRET`
- **Açıklama**: Session için kullanılan secret
- **Örnek**: `your-super-secret-session-key`
- **Kullanım**: Session yönetimi için

#### `PORT`
- **Açıklama**: Uygulama portu
- **Örnek**: `3000`
- **Kullanım**: Sunucu portu için

#### `LOG_LEVEL`
- **Açıklama**: Log seviyesi
- **Olası Değerler**: `error`, `warn`, `info`, `debug`
- **Kullanım**: Loglama seviyesi için

## Secret'ları GitHub'a Ekleme

### Web Arayüzü ile Ekleme

1. GitHub reposuna gidin
2. Settings > Secrets and variables > Actions menüsüne tıklayın
3. "New repository secret" butonuna tıklayın
4. Secret adını ve değerini girin
5. "Add secret" butonuna tıklayın

### GitHub CLI ile Ekleme

```bash
# Örnek komutlar
gh secret set HEROKU_API_KEY --body "your-heroku-api-key"
gh secret set HEROKU_APP_NAME_STAGING --body "turkiye-deprem-staging"
gh secret set HEROKU_APP_NAME_PRODUCTION --body "turkiye-deprem-production"
gh secret set SLACK_WEBHOOK_URL --body "your-slack-webhook-url"
```

## Environment Variables Ayarlama

### Web Arayüzü ile Ayarlama

1. GitHub reposuna gidin
2. Settings > Environments menüsüne tıklayın
3. Ortam adına (staging, production) tıklayın
4. "Add variable" butonuna tıklayın
5. Variable adını ve değerini girin

### GitHub CLI ile Ayarlama

```bash
# Staging ortamı için
gh variable set NODE_ENV --body "staging" --env staging
gh variable set PORT --body "3000" --env staging

# Production ortamı için
gh variable set NODE_ENV --body "production" --env production
gh variable set PORT --body "3000" --env production
```

## Test Etme

Secret'ları ekledikten sonra workflow'ları test etmek için:

1. Herhangi bir branch'e push yapın
2. GitHub Actions sekmesinde workflow'ların çalıştığını kontrol edin
3. Gerekli secret'ların doğru yapılandırıldığını doğrulayın

## Güvenlik İpuçları

1. **Strong Passwords**: Tüm secret'lar için güçlü ve rastgele şifreler kullanın
2. **Regular Rotation**: Secret'ları düzenli olarak güncelleyin
3. **Least Privilege**: Her secret'ın sadece gerekli izinlere sahip olduğundan emin olun
4. **Audit Logs**: GitHub'ın audit log'larını düzenli olarak kontrol edin
5. **Environment Separation**: Farklı ortamlar için farklı secret'lar kullanın

## Troubleshooting

### Yaygın Sorunlar ve Çözümleri

1. **Heroku dağıtım hatası**: `HEROKU_API_KEY` ve `HEROKU_EMAIL` secret'larının doğru olduğundan emin olun
2. **Slack bildirim hatası**: `SLACK_WEBHOOK_URL`'nin geçerli olduğundan emin olun
3. **Production onay hatası**: `PRODUCTION_APPROVAL_TOKEN` ve `APPROVERS` secret'larının doğru yapılandırıldığından emin olun
4. **Güvenlik tarama hatası**: `SNYK_TOKEN`'ın geçerli olduğundan emin olun

### Debug Etme

Workflow'ları debug etmek için:

1. GitHub Actions sekmesinde ilgili workflow'a tıklayın
2. "Re-run failed jobs" butonuna tıklayarak tekrar çalıştırın
3. "Enable debug logging" seçeneğini aktif edin
4. Detaylı logları inceleyerek sorunu teşhis edin