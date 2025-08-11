// İstatistik kartları için JavaScript fonksiyonları

// Global değişkenler
let hourlyChart = null;
let depthChart = null;

// Eklentiyi kaydet
if (typeof ChartDataLabels !== 'undefined') {
    Chart.register(ChartDataLabels);
}

// Ana güncelleme fonksiyonu
window.updateStatsUI = function(earthquakes) {
    if (!earthquakes || earthquakes.length === 0) {
        resetStats();
        return;
    }

    updateLast24HoursStats(earthquakes);
    updateMagnitudeDistribution(earthquakes);
    updateDepthAnalysis(earthquakes);
    updateRegionalActivity(earthquakes);
};

// Son 24 saat istatistiklerini güncelle
function updateLast24HoursStats(earthquakes) {
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const last24Hours = earthquakes.filter(eq => {
        const eqDate = new Date(eq.tarih + ' ' + eq.saat);
        return eqDate >= yesterday;
    });

    // Toplam deprem sayısı
    document.getElementById('counter-24h').textContent = last24Hours.length;

    // Gündüz ve gece ayrımı (06:00-18:00 gündüz)
    let dayCount = 0;
    let nightCount = 0;

    last24Hours.forEach(eq => {
        const hour = parseInt(eq.saat.split(':')[0]);
        if (hour >= 6 && hour < 18) {
            dayCount++;
        } else {
            nightCount++;
        }
    });

    document.getElementById('counter-24h-day').textContent = dayCount;
    document.getElementById('counter-24h-night').textContent = nightCount;

    // Saatlik dağılımı güncelle (sadece sayı)
    updateHourlyCounts(last24Hours);
}

// Saatlik sayıları güncelle (sadece sayı ile)
function updateHourlyCounts(earthquakes) {
    // Saatlik veri hazırla (4 saatlik aralıklarla)
    const hourlyData = new Array(6).fill(0);
    
    // 4 saatlik aralıklar: 0-4, 4-8, 8-12, 12-16, 16-20, 20-24
    earthquakes.forEach(eq => {
        const hour = parseInt(eq.saat.split(':')[0]);
        if (hour >= 0 && hour < 4) hourlyData[0]++;
        else if (hour >= 4 && hour < 8) hourlyData[1]++;
        else if (hour >= 8 && hour < 12) hourlyData[2]++;
        else if (hour >= 12 && hour < 16) hourlyData[3]++;
        else if (hour >= 16 && hour < 20) hourlyData[4]++;
        else if (hour >= 20 && hour < 24) hourlyData[5]++;
    });

    // Her 4 saatlik aralık için sayıyı güncelle
    ['0', '4', '8', '12', '16', '20'].forEach((hourKey, index) => {
        const barElement = document.getElementById(`hourly-${hourKey}`);
        if (barElement) {
            barElement.textContent = hourlyData[index
                
            ];
        }
    });
}


// Büyüklük dağılımını güncelle
function updateMagnitudeDistribution(earthquakes) {
    const magnitudes = earthquakes.map(eq => parseFloat(eq.buyukluk));

    // Ortalama büyüklük
    const avgMagnitude = magnitudes.length > 0 ? magnitudes.reduce((sum, mag) => sum + mag, 0) / magnitudes.length : 0;
    document.getElementById('counter-magnitude').textContent = avgMagnitude.toFixed(1);

    // Maksimum büyüklük
    const maxMagnitude = magnitudes.length > 0 ? Math.max(...magnitudes) : 0;
    document.getElementById('max-magnitude').textContent = maxMagnitude.toFixed(1);

    // Büyüklük aralıklarına göre sayım
    const ranges = {
        '1-2': magnitudes.filter(m => m >= 1 && m < 2).length,
        '2-3': magnitudes.filter(m => m >= 2 && m < 3).length,
        '3-4': magnitudes.filter(m => m >= 3 && m < 4).length,
        '4-5': magnitudes.filter(m => m >= 4 && m < 5).length,
        '5-6': magnitudes.filter(m => m >= 5 && m < 6).length,
        '6plus': magnitudes.filter(m => m >= 6).length
    };

    // En yüksek değeri bul (yüzde hesabı için)
    const maxCount = Math.max(...Object.values(ranges));

    // Her aralık için bar ve sayı güncelle
    Object.entries(ranges).forEach(([range, count]) => {
        const barElement = document.getElementById(`magnitude-${range}`);
        const countElement = document.getElementById(`magnitude-${range}-count`);

        if (barElement && countElement) {
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            barElement.style.height = `${percentage}%`;
            countElement.textContent = count;
        }
    });
}

// Derinlik analizini ve grafiğini güncelle
function updateDepthAnalysis(earthquakes) {
    const depths = earthquakes.map(eq => parseFloat(eq.derinlik));

    if (depths.length === 0) {
        // Veri yoksa ilgili alanları ve grafiği sıfırla
        document.getElementById('counter-depth-max').textContent = '- km';
        document.getElementById('counter-depth-avg').textContent = '- km';
        document.getElementById('counter-depth-total').textContent = '0';
        document.getElementById('depth-location').textContent = 'En derin: -';
        if (depthChart) {
            depthChart.destroy();
            depthChart = null;
        }
        return;
    }

    const maxDepth = Math.max(...depths);
    const avgDepth = depths.reduce((sum, depth) => sum + depth, 0) / depths.length;
    const totalCount = earthquakes.length;

    // Sayısal değerleri güncelle
    document.getElementById('counter-depth-max').textContent = `${maxDepth.toFixed(1)} km`;
    document.getElementById('counter-depth-avg').textContent = `${avgDepth.toFixed(1)} km`;
    document.getElementById('counter-depth-total').textContent = totalCount;

    // En derin depremin konumu
    const deepestEq = earthquakes.find(eq => parseFloat(eq.derinlik) === maxDepth);
    if (deepestEq) {
        document.getElementById('depth-location').textContent = `En derin: ${deepestEq.yer}`;
    }

    // Derinlik aralıklarına göre sayım
    const depthRanges = {
        '0-10 km': depths.filter(d => d >= 0 && d < 10).length,
        '10-30 km': depths.filter(d => d >= 10 && d < 30).length,
        '30-70 km': depths.filter(d => d >= 30 && d < 70).length,
        '70+ km': depths.filter(d => d >= 70).length
    };

    // Grafik oluşturma
    const ctx = document.getElementById('depthChart');
    if (!ctx) return;

    if (depthChart) {
        depthChart.destroy();
    }

    depthChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(depthRanges),
            datasets: [{
                data: Object.values(depthRanges),
                backgroundColor: [
                    'rgba(22, 163, 74, 0.6)',  // Green
                    'rgba(245, 158, 11, 0.6)', // Amber
                    'rgba(249, 115, 22, 0.6)', // Orange
                    'rgba(239, 68, 68, 0.6)'   // Red
                ],
                borderColor: [
                    'rgba(22, 163, 74, 1)',
                    'rgba(245, 158, 11, 1)',
                    'rgba(249, 115, 22, 1)',
                    'rgba(239, 68, 68, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.raw} deprem`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 10
                        }
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0 // Tam sayıları göster
                    }
                }
            }
        }
    });
}

// Bölgesel aktiviteyi güncelle
function updateRegionalActivity(earthquakes) {
    // Şehir bazında gruplama
    const cityGroups = {};
    earthquakes.forEach(eq => {
        const city = eq.sehir || 'Bilinmeyen';
        if (!cityGroups[city]) {
            cityGroups[city] = [];
        }
        cityGroups[city].push(eq);
    });

    // Aktif il sayısı
    const activeRegions = Object.keys(cityGroups).length;
    document.getElementById('counter-regions').textContent = activeRegions;

    // En aktif bölgeyi bul
    let mostActiveRegion = '';
    let mostActiveCount = 0;

    Object.entries(cityGroups).forEach(([city, quakes]) => {
        if (quakes.length > mostActiveCount) {
            mostActiveCount = quakes.length;
            mostActiveRegion = city;
        }
    });

    document.getElementById('most-active-region').textContent = mostActiveRegion;
    document.getElementById('most-active-count').textContent = `${mostActiveCount} deprem`;

    // En aktif 5 bölgeyi listele
    const topRegions = Object.entries(cityGroups)
        .sort(([,a], [,b]) => b.length - a.length)
        .slice(0, 5);

    const topRegionsContainer = document.getElementById('top-regions');
    if (topRegionsContainer) {
        topRegionsContainer.innerHTML = topRegions.map(([city, quakes]) => `
            <div class="flex justify-between items-center py-1">
                <span class="text-sm text-gray-700 dark:text-gray-300">${city}</span>
                <span class="text-xs bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">${quakes.length}</span>
            </div>
        `).join('');
    }
}

// İstatistikleri sıfırla
function resetStats() {
    document.getElementById('counter-24h').textContent = '0';
    document.getElementById('counter-24h-day').textContent = '0';
    document.getElementById('counter-24h-night').textContent = '0';
    document.getElementById('counter-magnitude').textContent = '0.0';
    document.getElementById('max-magnitude').textContent = '0.0';
    document.getElementById('counter-depth-avg').textContent = '- km';
    document.getElementById('counter-depth-max').textContent = '- km';
    document.getElementById('counter-depth-total').textContent = '0';
    document.getElementById('counter-regions').textContent = '0';
    document.getElementById('most-active-region').textContent = '-';
    document.getElementById('most-active-count').textContent = '0 deprem';
    document.getElementById('depth-location').textContent = '-';

    // Büyüklük barlarını sıfırla
    ['1-2', '2-3', '3-4', '4-5', '5-6', '6plus'].forEach(range => {
        const barElement = document.getElementById(`magnitude-${range}`);
        const countElement = document.getElementById(`magnitude-${range}-count`);

        if (barElement) barElement.style.height = '0%';
        if (countElement) countElement.textContent = '0';
    });

    // Derinlik barlarını sıfırla
    if (depthChart) {
        depthChart.destroy();
        depthChart = null;
    }

    // Top regions listesini temizle
    const topRegionsContainer = document.getElementById('top-regions');
    if (topRegionsContainer) {
        topRegionsContainer.innerHTML = '<div class="text-sm text-gray-500">Veri yok</div>';
    }

}

    // Saatlik sayıları sıfırla
    ['0', '4', '8', '12', '16', '20'].forEach(hourKey => {
        const barElement = document.getElementById(`hourly-${hourKey}`);
        if (barElement) {
            barElement.textContent = '0';
        }
    });