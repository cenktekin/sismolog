// Otomatik Güncelleme Testleri
// Bu dosya, tarayıcı konsolunda çalıştırılarak test senaryolarını çalıştırır

console.log('🧪 Türkiye Deprem Takip Sistemi - Otomatik Güncelleme Testleri');
console.log('================================================================');

// Test yardımcı fonksiyonları
function getElement(id) {
    return document.getElementById(id);
}

function testElementExists(id, description) {
    const element = getElement(id);
    const exists = element !== null;
    console.log(`${exists ? '✅' : '❌'} ${description}: ${exists ? 'Bulundu' : 'Bulunamadı'}`);
    return exists;
}

function testElementValue(id, expectedValue, description) {
    const element = getElement(id);
    if (!element) {
        console.log(`❌ ${description}: Element bulunamadı`);
        return false;
    }
    
    const actualValue = element.value || element.textContent || element.checked;
    const passed = actualValue == expectedValue;
    console.log(`${passed ? '✅' : '❌'} ${description}: Beklenen=${expectedValue}, Gerçekleşen=${actualValue}`);
    return passed;
}

function testLocalStorage(key, expectedValue, description) {
    const actualValue = localStorage.getItem(key);
    const passed = actualValue == expectedValue;
    console.log(`${passed ? '✅' : '❌'} ${description}: Beklenen=${expectedValue}, Gerçekleşen=${actualValue}`);
    return passed;
}

function testFunctionExists(functionName, description) {
    const exists = typeof window[functionName] === 'function';
    console.log(`${exists ? '✅' : '❌'} ${description}: ${exists ? 'Mevcut' : 'Mevcut değil'}`);
    return exists;
}

// Ana test fonksiyonu
function runAllTests() {
    console.log('\n🔬 Temel Element Testleri');
    console.log('------------------------');
    
    // Elementlerin varlığını test et
    const tests = [
        testElementExists('autoUpdate', 'Otomatik Güncelleme Toggle'),
        testElementExists('updateFrequency', 'Güncelleme Sıklığı Dropdown'),
        testElementExists('countdown', 'Geri Sayım Göstergesi')
    ];
    
    const allElementsExist = tests.every(test => test);
    console.log(`\n📊 Element Test Sonucu: ${allElementsExist ? 'Başarılı' : 'Başarısız'}`);
    
    console.log('\n🔬 Varsayılan Ayar Testleri');
    console.log('---------------------------');
    
    // Varsayılan ayarları test et
    const defaultTests = [
        testElementValue('autoUpdate', true, 'Otomatik Güncelleme Varsayılan Durumu'),
        testElementValue('updateFrequency', '120', 'Güncelleme Sıklığı Varsayılan Değeri'),
        testElementValue('countdown', '120', 'Geri Sayım Varsayılan Değeri')
    ];
    
    const allDefaultsCorrect = defaultTests.every(test => test);
    console.log(`\n📊 Varsayılan Ayar Test Sonucu: ${allDefaultsCorrect ? 'Başarılı' : 'Başarısız'}`);
    
    console.log('\n🔬 Fonksiyon Testleri');
    console.log('---------------------');
    
    // Fonksiyonların varlığını test et
    const functionTests = [
        testFunctionExists('handleAutoUpdateToggle', 'Otomatik Güncelleme Toggle Fonksiyonu'),
        testFunctionExists('handleUpdateFrequencyChange', 'Güncelleme Sıklığı Değişiklik Fonksiyonu'),
        testFunctionExists('startUpdateTimer', 'Zamanlayıcı Başlatma Fonksiyonu'),
        testFunctionExists('updateCountdown', 'Geri Sayım Güncelleme Fonksiyonu'),
        testFunctionExists('loadUserPreferences', 'Kullanıcı Tercihleri Yükleme Fonksiyonu')
    ];
    
    const allFunctionsExist = functionTests.every(test => test);
    console.log(`\n📊 Fonksiyon Test Sonucu: ${allFunctionsExist ? 'Başarılı' : 'Başarısız'}`);
    
    console.log('\n🔬 localStorage Testleri');
    console.log('------------------------');
    
    // localStorage ayarlarını test et
    const localStorageTests = [
        testLocalStorage('autoUpdateEnabled', 'true', 'Otomatik Güncelleme Ayarı'),
        testLocalStorage('updateInterval', '120', 'Güncelleme Sıklığı Ayarı')
    ];
    
    const allLocalStorageCorrect = localStorageTests.every(test => test);
    console.log(`\n📊 localStorage Test Sonucu: ${allLocalStorageCorrect ? 'Başarılı' : 'Başarısız'}`);
    
    console.log('\n🔬 CSS Sınıf Testleri');
    console.log('---------------------');
    
    // CSS stillerini test et
    const autoUpdateElement = getElement('autoUpdate');
    const updateFrequencyElement = getElement('updateFrequency');
    
    if (autoUpdateElement) {
        const computedStyle = window.getComputedStyle(autoUpdateElement);
        const hasToggleStyles = computedStyle.getPropertyValue('--toggle-color') !== '';
        console.log(`${hasToggleStyles ? '✅' : '❌'} Toggle Switch CSS Stilleri: ${hasToggleStyles ? 'Uygulandı' : 'Uygulanmadı'}`);
    }
    
    if (updateFrequencyElement) {
        const computedStyle = window.getComputedStyle(updateFrequencyElement);
        const hasDropdownStyles = computedStyle.getPropertyValue('--dropdown-color') !== '';
        console.log(`${hasDropdownStyles ? '✅' : '❌'} Dropdown CSS Stilleri: ${hasDropdownStyles ? 'Uygulandı' : 'Uygulanmadı'}`);
    }
    
    console.log('\n🔬 Entegrasyon Testleri');
    console.log('----------------------');
    
    // Entegrasyon testleri
    const integrationTests = [];
    
    // Test 1: Toggle switch değiştiğinde zamanlayıcı başlıyor mu?
    if (autoUpdateElement) {
        const originalChecked = autoUpdateElement.checked;
        autoUpdateElement.checked = !originalChecked;
        autoUpdateElement.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            const timerExists = window.updateInterval !== null;
            console.log(`${timerExists ? '✅' : '❌'} Zamanlayıcı Kontrolü: ${timerExists ? 'Aktif' : 'Pasif'}`);
            
            // Değişikliği geri al
            autoUpdateElement.checked = originalChecked;
            autoUpdateElement.dispatchEvent(new Event('change'));
        }, 100);
    }
    
    // Test 2: Dropdown değiştiğinde localStorage güncelleniyor mu?
    if (updateFrequencyElement) {
        const originalValue = updateFrequencyElement.value;
        updateFrequencyElement.value = '300';
        updateFrequencyElement.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            const savedValue = localStorage.getItem('updateInterval');
            console.log(`${savedValue === '300' ? '✅' : '❌'} localStorage Güncelleme: ${savedValue}`);
            
            // Değişikliği geri al
            updateFrequencyElement.value = originalValue;
            updateFrequencyElement.dispatchEvent(new Event('change'));
        }, 100);
    }
    
    console.log('\n🎯 Test Özeti');
    console.log('-------------');
    console.log(`Element Testleri: ${allElementsExist ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
    console.log(`Varsayılan Ayarlar: ${allDefaultsCorrect ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
    console.log(`Fonksiyonlar: ${allFunctionsExist ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
    console.log(`localStorage: ${allLocalStorageCorrect ? '✅ BAŞARILI' : '❌ BAŞARISIZ'}`);
    
    const overallSuccess = allElementsExist && allDefaultsCorrect && allFunctionsExist && allLocalStorageCorrect;
    console.log(`\n🏆 Genel Durum: ${overallSuccess ? '✅ TÜM TESTLER BAŞARILI' : '❌ BAZI TESTLER BAŞARISIZ'}`);
    
    if (!overallSuccess) {
        console.log('\n🔧 Düzeltilebilecek Potansiyel Sorunlar:');
        console.log('- Elementlerin doğru ID\'lere sahip olup olmadığını kontrol edin');
        console.log('- JavaScript dosyasının doğru yüklendiğinden emin olun');
        console.log('- localStorage erişiminin engellenmediğinden emin olun');
        console.log('- CSS dosyasının doğru yüklendiğinden emin olun');
    }
    
    return overallSuccess;
}

// Manuel test fonksiyonları
function testToggleFunctionality() {
    console.log('\n🔧 Manuel Toggle Switch Testi');
    console.log('---------------------------');
    
    const autoUpdateElement = getElement('autoUpdate');
    if (!autoUpdateElement) {
        console.log('❌ Toggle switch elementi bulunamadı');
        return;
    }
    
    console.log('📋 Mevcut durum:', autoUpdateElement.checked ? 'Açık' : 'Kapalı');
    
    // Kapatma testi
    console.log('🔌 Toggle switch kapatılıyor...');
    autoUpdateElement.checked = false;
    autoUpdateElement.dispatchEvent(new Event('change'));
    
    setTimeout(() => {
        console.log('📊 Kapatma sonrası durum:');
        console.log('- Zamanlayıcı aktif mi?', window.updateInterval !== null ? 'Evet (hata!)' : 'Hayır (doğru)');
        console.log('- Dropdown devre dışı mı?', getElement('updateFrequency').disabled ? 'Evet (doğru)' : 'Hayır (hata!)');
        console.log('- Geri sayım durdu mu?', getElement('countdown').textContent === '120' ? 'Evet (doğru)' : 'Hayır (hata!)');
        
        // Açma testi
        console.log('\n🔌 Toggle switch açılıyor...');
        autoUpdateElement.checked = true;
        autoUpdateElement.dispatchEvent(new Event('change'));
        
        setTimeout(() => {
            console.log('📊 Açma sonrası durum:');
            console.log('- Zamanlayıcı aktif mi?', window.updateInterval !== null ? 'Evet (doğru)' : 'Hayır (hata!)');
            console.log('- Dropdown aktif mi?', !getElement('updateFrequency').disabled ? 'Evet (doğru)' : 'Hayır (hata!)');
            console.log('- Geri sayım başladı mı?', getElement('countdown').textContent !== '120' ? 'Evet (doğru)' : 'Hayır (hata!)');
        }, 1000);
    }, 1000);
}

function testDropdownFunctionality() {
    console.log('\n🔧 Manuel Dropdown Testi');
    console.log('----------------------');
    
    const updateFrequencyElement = getElement('updateFrequency');
    if (!updateFrequencyElement) {
        console.log('❌ Dropdown elementi bulunamadı');
        return;
    }
    
    console.log('📋 Mevcut değer:', updateFrequencyElement.value);
    
    // Farklı değerler test et
    const testValues = ['120', '300', '600', '900'];
    
    testValues.forEach((value, index) => {
        setTimeout(() => {
            console.log(`🔄 ${value} saniye seçiliyor...`);
            updateFrequencyElement.value = value;
            updateFrequencyElement.dispatchEvent(new Event('change'));
            
            setTimeout(() => {
                const savedValue = localStorage.getItem('updateInterval');
                console.log(`📊 ${value} saniye testi: Kaydedilen değer=${savedValue}`);
                
                if (index === testValues.length - 1) {
                    // Son değere geri dön
                    updateFrequencyElement.value = '120';
                    updateFrequencyElement.dispatchEvent(new Event('change'));
                }
            }, 200);
        }, index * 500);
    });
}

// Testleri çalıştır
console.log('\n🚀 Testleri çalıştırmak için:');
console.log('1. runAllTests() - Tüm testleri çalıştırır');
console.log('2. testToggleFunctionality() - Toggle switch testi');
console.log('3. testDropdownFunctionality() - Dropdown testi');

// Konsolda kullanılabilir hale getir
window.runAllTests = runAllTests;
window.testToggleFunctionality = testToggleFunctionality;
window.testDropdownFunctionality = testDropdownFunctionality;

console.log('\n✅ Test fonksiyonları hazır! Konsolda çalıştırmak için:');
console.log('runAllTests()');
console.log('testToggleFunctionality()');
console.log('testDropdownFunctionality()');