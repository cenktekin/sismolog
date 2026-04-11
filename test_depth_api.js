// API üzerinden veri çekip derinlik analizi fonksiyonumuzu test edelim
const fetch = require('node-fetch');

async function testDepthAnalysis() {
    try {
        console.log('🔍 API testi başlatılıyor...');
        
        // API'den veri çek
        const response = await fetch('http://localhost:3000/api/v1/depremler');
        const earthquakes = await response.json();
        
        console.log(`✅ API'den ${earthquakes.length} deprem verisi alındı`);
        
        // İlk 10 depremi göster
        console.log('📊 İlk 10 deprem verisi:');
        earthquakes.slice(0, 10).forEach((eq, index) => {
            console.log(`${index + 1}. ${eq.tarih} ${eq.saat} - Büyüklük: ${eq.buyukluk}, Derinlik: ${eq.derinlik}, Yer: ${eq.yer}`);
        });
        
        // Derinlik verilerini analiz et
        const depths = earthquakes.map(eq => parseFloat(eq.derinlik));
        console.log('\n🔬 Derinlik analizi:');
        console.log('- Toplam derinlik sayısı:', depths.length);
        console.log('- Derinlik aralıkları:');
        console.log('  0-10km:', depths.filter(d => d >= 0 && d < 10).length);
        console.log('  10-30km:', depths.filter(d => d >= 10 && d < 30).length);
        console.log('  30-70km:', depths.filter(d => d >= 30 && d < 70).length);
        console.log('  70km+:', depths.filter(d => d >= 70).length);
        
        // En yüksek derinlik değerleri
        const maxDepth = Math.max(...depths);
        const minDepth = Math.min(...depths);
        const avgDepth = depths.reduce((sum, depth) => sum + depth, 0) / depths.length;
        
        console.log('\n📈 Derinlik istatistikleri:');
        console.log('- Maksimum derinlik:', maxDepth);
        console.log('- Minimum derinlik:', minDepth);
        console.log('- Ortalama derinlik:', avgDepth.toFixed(2));
        
        // JavaScript fonksiyonumuzu simüle et
        console.log('\n🔧 JavaScript fonksiyonu simülasyonu:');
        
        // Derinlik aralıklarına göre sayım (JavaScript'teki gibi)
        const depthRanges = {
            '0-10': depths.filter(d => d >= 0 && d < 10).length,
            '10-30': depths.filter(d => d >= 10 && d < 30).length,
            '30-70': depths.filter(d => d >= 30 && d < 70).length,
            '70plus': depths.filter(d => d >= 70).length
        };
        
        const maxCount = Math.max(...Object.values(depthRanges));
        
        console.log('📊 Bar chart verileri:');
        Object.entries(depthRanges).forEach(([range, count]) => {
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const minHeight = count > 0 ? Math.max(percentage, 10) : 0;
            
            let bgColor;
            switch(range) {
                case '0-10': bgColor = '#10B981'; break;    // Yeşil
                case '10-30': bgColor = '#F59E0B'; break;   // Sarı
                case '30-70': bgColor = '#F97316'; break;   // Turuncu
                case '70plus': bgColor = '#EF4444'; break; // Kırmızı
                default: bgColor = '#6B7280'; break;       // Gri
            }
            
            console.log(`  ${range}: ${count} deprem (${minHeight.toFixed(1)}% - ${bgColor})`);
        });
        
        console.log('\n✅ Test tamamlandı. Eğer bar chart'lar görünmüyorsa, CSS öncelik sorunu olabilir.');
        
    } catch (error) {
        console.error('❌ Test sırasında hata oluştu:', error);
    }
}

testDepthAnalysis();