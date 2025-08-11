# Hooks — Türkiye Deprem Takip Sistemi

## Git Hooks

### Pre-commit Hook
```bash
#!/bin/bash
# Pre-commit hook - Türkiye Deprem Takip Sistemi için

echo "🔍 Pre-commit kontrolleri başlatılıyor..."

# 1. Lint kontrolü
echo "📝 ESLint kontrolü çalıştırılıyor..."
npm run lint || {
    echo "❌ ESLint hataları bulundu. Düzeltip tekrar deneyin."
    exit 1
}

# 2. Test çalıştırma
echo "🧪 Testler çalıştırılıyor..."
npm test || {
    echo "❌ Testler başarısız oldu. Testleri düzeltip tekrar deneyin."
    exit 1
}

# 3. Security audit
echo "🔒 Güvenlik denetimi yapılıyor..."
npm audit || {
    echo "⚠️  Güvenlik uyarıları bulundu. Kontrol edin."
}

# 4. Build kontrolü
echo "🏗️  Build kontrolü yapılıyor..."
npm run build || {
    echo "❌ Build başarısız oldu."
    exit 1
}

echo "✅ Pre-commit kontrolleri tamamlandı."
```

### Pre-push Hook
```bash
#!/bin/bash
# Pre-push hook - Türkiye Deprem Takip Sistemi için

echo "🚀 Pre-push kontrolleri başlatılıyor..."

# 1. CI/CD testleri
echo "🔄 CI/CD testleri çalıştırılıyor..."
npm run test:ci || {
    echo "❌ CI/CD testleri başarısız oldu. Dağıtım durduruldu."
    exit 1
}

# 2. Performance testleri
echo "⚡ Performance testleri çalıştırılıyor..."
npm run test:performance || {
    echo "⚠️  Performance testlerinde uyarılar var."
}

# 3. Security scan
echo "🛡️  Güvenlik taraması yapılıyor..."
npm audit --audit-level moderate || {
    echo "❌ Kritik güvenlik açıkları bulundu. Dağıtım durduruldu."
    exit 1
}

echo "✅ Pre-push kontrolleri tamamlandı. Dağıtım için hazır."
```

## CI/CD Hooks

### GitHub Actions Workflow
```yaml
name: Türkiye Deprem Takip Sistemi CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Node.js ${{ matrix.node-version }} kurulumu
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Bağımlılıkların kurulumu
      run: npm ci
    
    - name: Testlerin çalıştırılması
      run: npm run test:ci
    
    - name: Security audit
      run: npm audit --audit-level moderate
    
    - name: Build kontrolü
      run: npm run build

  security:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    
    - name: Node.js kurulumu
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Bağımlılıkların kurulumu
      run: npm ci
    
    - name: OWASP Dependency Check
      uses: dependency-check/dependency-check-action@v2
      with:
        project: 'turkiye-deprem-takip'
        scan-path: './'
        format: 'ALL'

  deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Node.js kurulumu
      uses: actions/setup-node@v3
      with:
        node-version: '20.x'
        cache: 'npm'
    
    - name: Bağımlılıkların kurulumu
      run: npm ci --only=production
    
    - name: Heroku'ya dağıtım
      uses: akhileshns/heroku-deploy@v3.12.12
      with:
        heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
        heroku_app_name: ${{ secrets.HEROKU_APP_NAME }}
        heroku_email: ${{ secrets.HEROKU_EMAIL }}
        buildpack: heroku/nodejs
```

## Deployment Hooks

### Heroku Pre-receive Hook
```bash
#!/bin/bash
# Heroku pre-receive hook - Türkiye Deprem Takip Sistemi için

echo "🚀 Heroku dağıtımı öncesi kontroller..."

# 1. Package.json kontrolü
if ! grep -q "turkiye-deprem-takip" package.json; then
    echo "❌ package.json'da proje adı bulunamadı."
    exit 1
fi

# 2. Procfile kontrolü
if [ ! -f "Procfile" ]; then
    echo "❌ Procfile bulunamadı."
    exit 1
fi

# 3. Environment variables kontrolü
if [ ! -f ".env.example" ]; then
    echo "❌ .env.example bulunamadı."
    exit 1
fi

# 4. Build kontrolü
echo "🏗️  Build testi yapılıyor..."
npm run build || {
    echo "❌ Build başarısız oldu."
    exit 1
}

echo "✅ Heroku dağıtımı kontrolleri tamamlandı."
```

## Database Hooks

### Migration Hook
```bash
#!/bin/bash
# Database migration hook - Türkiye Deprem Takip Sistemi için

echo "🗄️  Veritabanı migration'ı başlatılıyor..."

# 1. Bağlantı kontrolü
if ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER; then
    echo "❌ Veritabanı bağlantısı başarısız."
    exit 1
fi

# 2. Migration dosyalarının kontrolü
if [ ! -d "migrations" ]; then
    echo "❌ Migration dizini bulunamadı."
    exit 1
fi

# 3. Migration çalıştırma
echo "🔄 Migration'lar çalıştırılıyor..."
npm run migrate || {
    echo "❌ Migration'lar başarısız oldu."
    exit 1
}

# 4. Seed data
echo "🌱 Seed data ekleniyor..."
npm run seed || {
    echo "⚠️  Seed data eklenirken hata oluştu."
}

echo "✅ Veritabanı migration'ı tamamlandı."
```

## Monitoring Hooks

### Health Check Hook
```bash
#!/bin/bash
# Health check hook - Türkiye Deprem Takip Sistemi için

echo "🏥 S sağlık kontrolü yapılıyor..."

# 1. API endpoint kontrolü
API_HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/v1/health)
if [ "$API_HEALTH" -ne 200 ]; then
    echo "❌ API sağlık kontrolü başarısız: $API_HEALTH"
    exit 1
fi

# 2. Database bağlantı kontrolü
if ! pg_isready -h localhost -p 5432 -U postgres; then
    echo "❌ Veritabanı bağlantısı başarısız."
    exit 1
fi

# 3. Memory usage kontrolü
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
if (( $(echo "$MEMORY_USAGE > 90" | bc -l) )); then
    echo "⚠️  Yüksek memory kullanımı: $MEMORY_USAGE%"
fi

# 4. Disk space kontrolü
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 90 ]; then
    echo "⚠️  Yüksek disk kullanımı: $DISK_USAGE%"
fi

echo "✅ S sağlık kontrolü tamamlandı."
```

## Logging Hooks

### Error Alert Hook
```bash
#!/bin/bash
# Error alert hook - Türkiye Deprem Takip Sistemi için

echo "🚨 Error alert kontrolü yapılıyor..."

# 1. Error log kontrolü
ERROR_COUNT=$(grep -c "ERROR" logs/error.log 2>/dev/null || echo "0")
if [ "$ERROR_COUNT" -gt 10 ]; then
    echo "⚠️  Yüksek error sayısı: $ERROR_COUNT"
    # Burada email veya Slack bildirimi gönderilebilir
    # curl -X POST -H 'Content-type: application/json' --data '{"text":"Yüksek error sayısı tespit edildi!"}' $SLACK_WEBHOOK
fi

# 2. Critical error kontrolü
CRITICAL_ERRORS=$(grep -c "CRITICAL" logs/error.log 2>/dev/null || echo "0")
if [ "$CRITICAL_ERRORS" -gt 0 ]; then
    echo "❌ Kritik error'lar tespit edildi: $CRITICAL_ERRORS"
    # Acil bildirim
    # curl -X POST -H 'Content-type: application/json' --data '{"text":"Kritik error tespit edildi! Acil müdahale gerekiyor."}' $SLACK_WEBHOOK
fi

echo "✅ Error alert kontrolü tamamlandı."
```

## Performance Hooks

### Performance Monitoring Hook
```bash
#!/bin/bash
# Performance monitoring hook - Türkiye Deprem Takip Sistemi için

echo "⚡ Performance monitoring başlatılıyor..."

# 1. Response time kontrolü
RESPONSE_TIME=$(curl -o /dev/null -s -w '%{time_total}' http://localhost:3000/api/v1/depremler)
if (( $(echo "$RESPONSE_TIME > 2.0" | bc -l) )); then
    echo "⚠️  Yüksek response time: $RESPONSE_TIME s"
fi

# 2. Database query time kontrolü
DB_QUERY_TIME=$(psql -h localhost -U postgres -d deprem_takip -c "EXPLAIN ANALYZE SELECT COUNT(*) FROM depremler;" | grep "Execution time" | awk '{print $3}' | sed 's/)//')
if (( $(echo "$DB_QUERY_TIME > 1.0" | bc -l) )); then
    echo "⚠️  Yüksek database query time: $DB_QUERY_TIME s"
fi

# 3. Memory usage monitoring
MEMORY_USAGE=$(free | grep Mem | awk '{printf "%.2f", $3/$2 * 100.0}')
echo "Memory usage: $MEMORY_USAGE%"

# 4. CPU usage monitoring
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | sed "s/.*, *\([0-9.]*\)%* id.*/\1/" | awk '{print 100 - $1}')
echo "CPU usage: $CPU_USAGE%"

echo "✅ Performance monitoring tamamlandı."
```

## Backup Hooks

### Database Backup Hook
```bash
#!/bin/bash
# Database backup hook - Türkiye Deprem Takip Sistemi için

echo "💾 Database backup başlatılıyor..."

# 1. Backup dizini kontrolü
BACKUP_DIR="backups/$(date +%Y-%m-%d)"
mkdir -p "$BACKUP_DIR"

# 2. Database backup
BACKUP_FILE="$BACKUP_DIR/deprem_takip_$(date +%H-%M-%S).sql"
pg_dump -h localhost -U postgres -d deprem_takip > "$BACKUP_FILE"

# 3. Backup boyutu kontrolü
BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "Backup boyutu: $BACKUP_SIZE"

# 4. Eski backup'ların silinmesi
find backups/ -name "*.sql" -mtime +7 -delete

# 5. Backup'ın uzak sunucuya yedeklenmesi
# scp "$BACKUP_FILE" user@remote:/backup/deprem_takip/

echo "✅ Database backup tamamlandı."