
// =================================================================================
// Debugging and Initialization
// =================================================================================
console.log('app.js is loading...');

// Main initialization function
function initializeApp() {
    console.log('Initializing app...');
    console.log('Leaflet available:', typeof L !== 'undefined' ? 'Yes' : 'No');
    console.log('DOM fully loaded and parsed');

    // Initialize the application
    initializeMap();
    initializeEventListeners();
    loadUserPreferences();
    fetchEarthquakes();

    // Start the auto-update timer
    startUpdateTimer();

    // Update UI
    updateNearestEarthquake();

    console.log('App initialization complete');
}

// Check if DOM is already loaded
if (document.readyState === 'loading') {
    console.log('Waiting for DOM to load...');
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    console.log('DOM already loaded, initializing app...');
    setTimeout(initializeApp, 0);
}

// =================================================================================
// Global State and Configuration
// =================================================================================

let map;
let allQuakes = []; // Fetched from API
let filteredQuakes = []; // Filtered and displayed
let markers = [];
let updateInterval;
let userLocation = null; // Store user's location

let currentPage = 1;
const ITEMS_PER_PAGE = 25;
let updateIntervalValue = 120; // seconds - Dynamic update interval

// =================================================================================
// DOM Element References
// =================================================================================

// Using a getter function to ensure DOM is loaded
const getElement = (id) => document.getElementById(id);

// =================================================================================
// Initialization
// =================================================================================

document.addEventListener('DOMContentLoaded', function () {
    try {
        console.log('🚀 Sayfa yükleme başlatılıyor...');

        // Harita initialization
        initializeMap();

        // Event listener'ları başlat
        initializeEventListeners();

        // Kullanıcı tercihlerini yükle
        loadUserPreferences();

        // Deprem verilerini çek
        fetchEarthquakes();

        // Kullanıcı konumunu al
        getUserLocation();

        console.log('✅ Tüm initialization işlemleri tamamlandı');
    } catch (error) {
        console.error('❌ Sayfa yükleme sırasında hata oluştu:', error);
        showError('Sayfa yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
    }
});

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                console.log('Kullanıcı konumu alındı:', userLocation);
                // En yakın depremi hesapla ve göster
                updateNearestEarthquake();
            },
            (error) => {
                console.error('Konum alınamadı:', error.message);
                showError('Konum bilgisi alınamadı. En yakın deprem özelliği çalışmayacak.');
            }
        );
    } else {
        console.error('Tarayıcı konum bilgisini desteklemiyor');
        showError('Tarayıcınız konum bilgisini desteklemiyor.');
    }
}

function initializeMap() {
    console.log('🗺️ Harita başlatılıyor...');
    const mapElement = getElement('map');

    if (!mapElement) {
        console.error('❌ Harita elementi bulunamadı!');
        showError('Harita bileşeni yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        return;
    }

    // Check if Leaflet is loaded
    if (typeof L === 'undefined') {
        const errorMsg = 'Harita kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin ve sayfayı yenileyin.';
        console.error('❌', errorMsg);
        showError(errorMsg, 10000);
        return;
    }

    console.log('📍 Harita boyutları:', mapElement.offsetWidth, 'x', mapElement.offsetHeight);

    try {
        // Check if map is already initialized
        if (map && map._container) {
            console.log('✅ Harita zaten başlatılmış, tekrar başlatılmayacak');
            return;
        }

        // Check if map container has dimensions
        if (mapElement.offsetWidth === 0 || mapElement.offsetHeight === 0) {
            console.warn('Harita konteyner boyutları 0x0, CSS kontrol ediliyor...');
            // Force reflow to ensure CSS is applied
            mapElement.style.display = 'none';
            mapElement.offsetHeight; // Trigger reflow
            mapElement.style.display = 'block';
        }

        // Initialize the map with error handling for invalid container
        try {
            map = L.map('map', {
                scrollWheelZoom: true,
                center: [39.0, 35.0],
                zoom: 6,
                zoomControl: false, // We'll add it manually later
                attributionControl: false // We'll add it manually
            });

            // Add zoom control with a proper position
            L.control.zoom({
                position: 'topright'
            }).addTo(map);

            // Add tile layer with error handling
            const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                minZoom: 6,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Handle tile loading errors
            tileLayer.on('tileerror', function (error) {
                console.error('Harita karesi yüklenirken hata:', error);
                showError('Harita yüklenirken bir hata oluştu. Lütfen internet bağlantınızı kontrol edin.', 5000);
            });

            // Add scale control
            L.control.scale({
                imperial: false,
                metric: true,
                position: 'bottomright'
            }).addTo(map);

            // Set view with error handling
            try {
                map.setView([39.0, 35.0], 6, { animate: false });
                console.log('✅ Harita başarıyla oluşturuldu ve ayarlandı');
            } catch (viewError) {
                console.error('Harita görünümü ayarlanırken hata:', viewError);
                showError('Harita konumu ayarlanırken bir hata oluştu.', 5000);
            }

            // Add a small delay to ensure map tiles load
            setTimeout(() => {
                try {
                    map.invalidateSize();
                    console.log('Harita boyutları güncellendi');
                } catch (sizeError) {
                    console.error('Harita boyutları güncellenirken hata:', sizeError);
                }
            }, 500);

        } catch (mapError) {
            console.error('Harita oluşturulurken hata:', mapError);
            throw new Error(`Harita başlatılamadı: ${mapError.message}`);
        }

    } catch (error) {
        console.error('❌ Harita başlatılırken beklenmeyen hata:', error);
        showError(`Harita yüklenirken bir hata oluştu: ${error.message}`, 10000);

        // Show a retry button
        const errorHTML = `
            <div class="p-4 bg-red-50 rounded-lg border border-red-200">
                <h3 class="text-red-700 font-bold mb-2">Harita Yüklenemedi</h3>
                <p class="text-red-600 mb-3">${error.message || 'Bilinmeyen bir hata oluştu'}</p>
                <button onclick="initializeMap()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                    Tekrar Dene
                </button>
            </div>
        `;

        mapElement.innerHTML = errorHTML;
        return;
    }
}

function initializeEventListeners() {
    console.log('🎯 Event listener initialization başlatılıyor...');

    // Auto-update controls
    const autoUpdateElement = getElement('autoUpdate');
    const updateFrequencyElement = getElement('updateFrequency');

    if (autoUpdateElement) {
        autoUpdateElement.addEventListener('change', handleAutoUpdateToggle);
        console.log('✅ AutoUpdate event listener bağlandı');
    } else {
        console.error('❌ AutoUpdate element bulunamadı');
    }

    if (updateFrequencyElement) {
        updateFrequencyElement.addEventListener('change', handleUpdateFrequencyChange);
        console.log('✅ UpdateFrequency event listener bağlandı');
    } else {
        console.error('❌ UpdateFrequency element bulunamadı');
    }

    // Filters
    const dateFilterElement = getElement('dateFilter');
    const magnitudeFilterElement = getElement('magnitudeFilter');
    const depthFilterElement = getElement('depthFilter');
    const cityFilterElement = getElement('cityFilter');

    // Tarih filtresi elementi artık olmadığı için event listener eklenmiyor
    // Sadece debug amaçlı kontrol edelim
    console.log('Tarih Filtresi Elementi Mevcut mu:', !!dateFilterElement);
    console.log('Büyüklük Filtresi Elementi Mevcut mu:', !!magnitudeFilterElement);
    console.log('Derinlik Filtresi Elementi Mevcut mu:', !!depthFilterElement);
    console.log('Şehir Filtresi Elementi Mevcut mu:', !!cityFilterElement);

    if (magnitudeFilterElement) {
        magnitudeFilterElement.addEventListener('input', handleFilterChange);
        console.log('✅ MagnitudeFilter event listener bağlandı');
        // Anlık değer güncellemesi
        magnitudeFilterElement.addEventListener('input', () => {
            const magnitudeValueElement = getElement('magnitudeValue');
            if (magnitudeValueElement) {
                magnitudeValueElement.textContent = parseFloat(magnitudeFilterElement.value).toFixed(1);
            }
        });
    } else {
        console.error('❌ MagnitudeFilter element bulunamadı');
    }

    if (depthFilterElement) {
        depthFilterElement.addEventListener('input', handleFilterChange);
        console.log('✅ DepthFilter event listener bağlandı');
        // Anlık değer güncellemesi
        depthFilterElement.addEventListener('input', () => {
            const depthValueElement = getElement('depthValue');
            if (depthValueElement) {
                depthValueElement.textContent = depthFilterElement.value;
            }
        });
    } else {
        console.error('❌ DepthFilter element bulunamadı');
    }

    if (cityFilterElement) {
        cityFilterElement.addEventListener('change', handleFilterChange);
        console.log('✅ CityFilter event listener bağlandı');
    } else {
        console.error('❌ CityFilter element bulunamadı');
    }

    // Pagination
    const prevPageElement = getElement('prevPage');
    const nextPageElement = getElement('nextPage');

    if (prevPageElement) {
        prevPageElement.addEventListener('click', () => changePage(-1));
        console.log('✅ PrevPage event listener bağlandı');
    } else {
        console.error('❌ PrevPage element bulunamadı');
    }

    if (nextPageElement) {
        nextPageElement.addEventListener('click', () => changePage(1));
        console.log('✅ NextPage event listener bağlandı');
    } else {
        console.error('❌ NextPage element bulunamadı');
    }

    // Clear filters button
    const clearFiltersElement = getElement('clearFilters');
    if (clearFiltersElement) {
        clearFiltersElement.addEventListener('click', clearAllFilters);
        console.log('✅ ClearFilters event listener bağlandı');
    } else {
        console.error('❌ ClearFilters element bulunamadı');
    }

    // System
    document.addEventListener('visibilitychange', handleVisibilityChange);
    console.log('✅ Event listener initialization tamamlandı');
}

// =================================================================================
// Data Fetching and Processing
// =================================================================================

function fetchEarthquakes() {
    console.log('🌍 API çağrısı başlatılıyor...');
    const apiUrl = `${window.location.origin}/api/v1/depremler`;
    console.log('🔗 API URL:', apiUrl);

    // Loading state göster
    const quakeListBody = getElement('quakeList');
    const loadingHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500"><div class="animate-pulse">Deprem verileri yükleniyor, lütfen bekleyiniz...</div></tr>';

    if (quakeListBody) {
        quakeListBody.innerHTML = loadingHTML;
    }

    // Show loading indicator
    const loadingIndicator = document.createElement('div');
    loadingIndicator.id = 'loading-indicator';
    loadingIndicator.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
    loadingIndicator.textContent = 'Veriler yükleniyor...';
    document.body.appendChild(loadingIndicator);

    fetch(apiUrl, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Cache-Control': 'no-cache'
        },
        credentials: 'same-origin',
        cache: 'no-store'
    })
        .then(response => {
            console.log('📡 API response status:', response.status);

            // Remove loading indicator on response
            const indicator = document.getElementById('loading-indicator');
            if (indicator) indicator.remove();

            if (response.status === 429) {
                throw new Error('Çok fazla istek yapıldı. Lütfen bir süre sonra tekrar deneyin.');
            }
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('API error response:', text);
                    throw new Error(`Sunucu hatası (${response.status}): ${response.statusText}`);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('📊 API yanıtı alındı, işleniyor...');

            if (data.error) {
                throw new Error(data.error);
            }

            if (!Array.isArray(data)) {
                console.error('API yanıt formatı hatalı:', data);
                throw new Error('Sunucudan geçersiz veri formatı alındı. Lütfen daha sonra tekrar deneyin.');
            }

            if (data.length === 0) {
                console.warn('API boş veri döndürdü');
                showError('Şu anda deprem verisi bulunamadı. Lütfen daha sonra tekrar deneyin.');
                return;
            }

            allQuakes = data;
            console.log(`✅ ${allQuakes.length} adet deprem verisi başarıyla alındı`);
            console.log('DEBUG: allQuakes after fetch:', allQuakes);

            try {
                // Populate city filter once with all available cities
                populateCityFilter(allQuakes);

                // Perform initial filter and render
                applyFiltersAndRender();

                // Update nearest earthquake card
                updateNearestEarthquake();

                // Hide any previous error messages
                const errorElements = document.querySelectorAll('.error-message');
                errorElements.forEach(el => el.style.display = 'none');

            } catch (renderError) {
                console.error('Veri işlenirken hata oluştu:', renderError);
                throw new Error(`Veri işlenirken hata: ${renderError.message}`);
            }
        })
        .catch(error => {
            console.error('❌ API çağrısı başarısız:', error);

            // Remove loading indicator on error
            const indicator = document.getElementById('loading-indicator');
            if (indicator) indicator.remove();

            const errorMessage = error.message || 'Bilinmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin.';

            // Show error in the UI
            showError(`Veri yüklenirken hata oluştu: ${errorMessage}`, 10000);

            // Update the table with error message
            if (quakeListBody) {
                quakeListBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-12">
                        <div class="max-w-md mx-auto p-4 bg-red-50 rounded-lg">
                            <div class="text-red-600 font-bold mb-2">Hata!</div>
                            <p class="text-red-700 mb-4">${errorMessage}</p>
                            <button onclick="fetchEarthquakes()" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                Tekrar Dene
                            </button>
                        </div>
                    </td>
                </tr>`;
            }
        });
}

function applyFiltersAndRender() {
    try {
        const dateFilterElement = getElement('dateFilter');
        const dateFilter = dateFilterElement ? dateFilterElement.value : null;

        // Güvenli filtre değerleri alımı
        const magnitudeFilterElement = getElement('magnitudeFilter');
        const magnitudeFilter = magnitudeFilterElement ? parseFloat(magnitudeFilterElement.value) : 0;

        const depthFilterElement = getElement('depthFilter');
        const depthFilter = depthFilterElement ? parseFloat(depthFilterElement.value) : 200;

        const cityFilterElement = getElement('cityFilter');
        const cityFilter = cityFilterElement ? cityFilterElement.value : '';

        // DEBUG: Filtre durumunu logla
        console.log('🔍 Filtre Durumu:');
        console.log('- Tarih Filtresi:', dateFilter);
        console.log('- Büyüklük Filtresi:', magnitudeFilter);
        console.log('- Derinlik Filtresi:', depthFilter);
        console.log('- Şehir Filtresi:', cityFilter);

        if (!allQuakes || !Array.isArray(allQuakes)) {
            console.error('❌ allQuakes array değil veya tanımsız:', allQuakes);
            filteredQuakes = [];
        } else {
            filteredQuakes = allQuakes.filter(quake => {
                if (!quake || typeof quake !== 'object') {
                    console.warn('❌ Geçersiz deprem verisi:', quake);
                    return false;
                }

                const magnitude = parseFloat(quake.buyukluk);
                const depth = parseFloat(quake.derinlik);

                // Tarih filtresi artık olmadığı için her zaman true döndür
                const dateMatch = true;
                const magnitudeMatch = magnitude >= magnitudeFilter;
                const depthMatch = depth <= depthFilter;
                const cityMatch = !cityFilter || quake.sehir === cityFilter;

                return dateMatch && magnitudeMatch && depthMatch && cityMatch;
            });
        }

        currentPage = 1; // Reset to first page after filtering

        // Update all parts of the UI
        renderPaginatedList();
        updateMap(filteredQuakes);

        if (window.updateStatsUI) {
            window.updateStatsUI(filteredQuakes);
        }

        showFilterFeedback(filteredQuakes.length);
    } catch (error) {
        console.error('❌ Filtreleme sırasında hata oluştu:', error);
        showError('Filtreleme sırasında bir hata oluştu.');
    }
}

// =================================================================================
// UI Rendering
// =================================================================================

function renderPaginatedList() {
    try {
        const quakeListBody = getElement('quakeList');
        if (!quakeListBody) {
            console.error('❌ quakeList elementi bulunamadı');
            return;
        }

        quakeListBody.innerHTML = ''; // Clear existing list

        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const paginatedQuakes = filteredQuakes.slice(startIndex, endIndex);

        if (paginatedQuakes.length === 0) {
            quakeListBody.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-gray-500">Filtre kriterlerine uygun deprem bulunamadı.</td></tr>`;
        } else {
            paginatedQuakes.forEach(quake => {
                if (!quake || typeof quake !== 'object') {
                    console.warn('❌ Geçersiz deprem verisi için row oluşturulamadı:', quake);
                    return;
                }

                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors';
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        ${quake.tarih} ${quake.saat}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getBgColorClass(quake.buyukluk)}">
                            ${quake.buyukluk}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">${quake.derinlik} km</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">${quake.yer}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${quake.sehir || '-'}</td>
                `;
                row.addEventListener('click', () => zoomToQuake(quake));
                quakeListBody.appendChild(row);
            });
        }

        updatePaginationControls();
    } catch (error) {
        console.error('❌ Liste render sırasında hata oluştu:', error);
        showError('Deprem listesi yüklenirken bir hata oluştu.');
    }
}

function updateMap(quakesToDisplay) {
    try {
        if (!map) {
            console.error('❌ Harita henüz oluşturulmadı');
            return;
        }

        markers.forEach(marker => marker.remove());
        markers = [];

        // En son depremi bul (tarihe göre sıralanmış ilk deprem)
        const latestQuake = quakesToDisplay.length > 0 ? quakesToDisplay.reduce((latest, current) => {
            const latestDate = new Date(`${latest.tarih} ${latest.saat}`);
            const currentDate = new Date(`${current.tarih} ${current.saat}`);
            return currentDate > latestDate ? current : latest;
        }) : null;

        let latestQuakeMarker = null; // To store the marker of the latest quake

        quakesToDisplay.forEach(quake => {
            if (!quake || typeof quake !== 'object') {
                console.warn('❌ Geçersiz deprem verisi için marker oluşturulamadı:', quake);
                return;
            }

            const magnitude = parseFloat(quake.buyukluk);
            const enlem = parseFloat(quake.enlem);
            const boylam = parseFloat(quake.boylam);

            if (isNaN(enlem) || isNaN(boylam)) {
                console.warn('❌ Geçersiz koordinatlar için marker oluşturulamadı:', quake);
                return;
            }

            // Daha büyük ve daha dikkat çekici marker boyutları
            const baseSize = 10;
            const iconSize = Math.min(Math.max(magnitude * 4, baseSize), 30);

            // Daha canlı renkler ve efektler
            const color = getColorByMagnitude(magnitude);
            const borderColor = magnitude >= 4.0 ? '#ffffff' : color;
            const borderWidth = magnitude >= 4.0 ? 3 : 1;

            // En son deprem için özel class, diğerleri için normal
            const isLatestQuake = latestQuake && quake.tarih === latestQuake.tarih && quake.saat === latestQuake.saat;
            const markerClass = isLatestQuake ? 'earthquake-marker-container latest-earthquake' : 'earthquake-marker-container';

            const customIcon = L.divIcon({
                className: markerClass,
                html: `
                    <div class="earthquake-marker ${isLatestQuake ? 'latest-earthquake-marker' : ''}"
                         style="width: ${iconSize}px; height: ${iconSize}px;
                                background-color: ${color};
                                border: ${borderWidth}px solid ${borderColor};
                                border-radius: 50%;
                                box-shadow: ${isLatestQuake ? '0 0 15px rgba(255,215,0,0.8)' : '0 2px 4px rgba(0,0,0,0.2)'};
                                position: relative;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
                                    color: white; font-weight: bold; font-size: ${Math.max(iconSize * 0.4, 10)}px; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);">
                            ${magnitude >= 4.0 ? magnitude : ''}
                        </div>
                    </div>
                `,
                iconSize: [iconSize + borderWidth * 2, iconSize + borderWidth * 2],
                iconAnchor: [(iconSize + borderWidth * 2) / 2, (iconSize + borderWidth * 2) / 2]
            });

            const marker = L.marker([enlem, boylam], { icon: customIcon });

            // Daha zengin popup içeriği
            const popupContent = `
                <div class="p-3 min-w-[200px]">
                    <div class="text-center mb-2">
                        <div class="text-2xl font-bold mb-1" style="color: ${color};">
                            ${quake.buyukluk}
                        </div>
                        <div class="text-sm text-gray-600">Büyüklük</div>
                        ${isLatestQuake ? '<div class="text-xs text-yellow-600 font-semibold">🔥 EN SON DEPREM</div>' : ''}
                    </div>
                    <hr class="my-2 border-gray-300">
                    <div class="text-sm space-y-1">
                        <p><strong>📍 Yer:</strong> ${quake.yer}</p>
                        <p><strong>🏙️ Şehir:</strong> ${quake.sehir || 'Belirsiz'}</p>
                        <p><strong>📅 Tarih:</strong> ${quake.tarih}</p>
                        <p><strong>🕐 Saat:</strong> ${quake.saat}</p>
                        <p><strong>🔍 Derinlik:</strong> ${quake.derinlik} km</p>
                    </div>
                    <div class="mt-2 pt-2 border-t border-gray-300 text-xs text-gray-500 text-center">
                        Haritada tıklayarak detaylı bilgi
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.addTo(map);
            markers.push(marker);

            if (isLatestQuake) { // Check if this is the latest quake
                latestQuakeMarker = marker; // Store the marker
            }
        });

        // Open the popup of the latest earthquake marker after all markers are added
        if (latestQuakeMarker) {
            latestQuakeMarker.openPopup();
        }
    } catch (error) {
        console.error('❌ Harita güncelleme sırasında hata oluştu:', error);
        showError('Harita güncellenirken bir hata oluştu.');
    }
}

function populateCityFilter(quakes) {
    try {
        const cityFilter = getElement('cityFilter');
        if (!cityFilter) {
            console.log('ℹ️ CityFilter elementi bulunamadı, şehir filtresi atlanıyor');
            return;
        }

        if (!quakes || !Array.isArray(quakes)) {
            console.error('❌ Geçersiz deprem verisi:', quakes);
            return;
        }

        const cities = [...new Set(quakes.map(q => q.sehir).filter(Boolean))].sort();

        // Keep the first "Tüm Şehirler" option, clear the rest
        cityFilter.innerHTML = '<option value="">Tüm Şehirler</option>';

        cities.forEach(city => {
            if (city && typeof city === 'string') {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                cityFilter.appendChild(option);
            } else {
                console.warn('❌ Geçersiz şehir adı atlandı:', city);
            }
        });

        console.log('✅ Şehir filtresi dolduruldu, toplam şehir sayısı:', cities.length);
    } catch (error) {
        console.error('❌ Şehir filtresi doldurma sırasında hata oluştu:', error);
    }
}

function updatePaginationControls() {
    try {
        const totalPages = Math.ceil(filteredQuakes.length / ITEMS_PER_PAGE);
        const paginationInfo = getElement('pagination-info');
        const prevPageElement = getElement('prevPage');
        const nextPageElement = getElement('nextPage');

        if (!paginationInfo) {
            console.error('❌ paginationInfo elementi bulunamadı');
            return;
        }

        if (!prevPageElement || !nextPageElement) {
            console.error('❌ Sayfalama elementleri bulunamadı');
            return;
        }

        if (totalPages > 0) {
            paginationInfo.textContent = `Sayfa ${currentPage} / ${totalPages} (${filteredQuakes.length} deprem)`;
        } else {
            paginationInfo.textContent = 'Sonuç yok';
        }

        prevPageElement.disabled = currentPage === 1;
        nextPageElement.disabled = currentPage === totalPages || totalPages === 0;
    } catch (error) {
        console.error('❌ Sayfalama kontrolleri güncelleme sırasında hata oluştu:', error);
    }
}

// =================================================================================
// Event Handlers
// =================================================================================

function handleFilterChange() {
    console.log('🔄 Filtre değişikliği tetiklendi');
    applyFiltersAndRender();
}

function clearAllFilters() {
    console.log('🧹 Tüm filtreler temizleniyor');

    // Filtre elementlerini temizle
    const cityFilter = getElement('cityFilter');
    const magnitudeFilter = getElement('magnitudeFilter');
    const depthFilter = getElement('depthFilter');

    if (cityFilter) {
        cityFilter.value = '';
    }
    if (magnitudeFilter) {
        magnitudeFilter.value = '0';
        // Anlık değeri güncelle
        const magnitudeValueElement = getElement('magnitudeValue');
        if (magnitudeValueElement) {
            magnitudeValueElement.textContent = '0.0';
        }
    }
    if (depthFilter) {
        depthFilter.value = '100';
        // Anlık değeri güncelle
        const depthValueElement = getElement('depthValue');
        if (depthValueElement) {
            depthValueElement.textContent = '100';
        }
    }

    // Filtreleri uygula ve yeniden render et
    applyFiltersAndRender();

    // Başarı mesajı göster
    showFilterFeedback(filteredQuakes.length);
}

function handleAutoUpdateToggle() {
    console.log('🔄 Otomatik güncelleme toggle tetiklendi');
    const isEnabled = getElement('autoUpdate').checked;
    console.log('🔌 Yeni durum:', isEnabled);

    // localStorage'a kaydet
    try {
        localStorage.setItem('autoUpdateEnabled', isEnabled);
        console.log('💾 localStorage kaydedildi:', isEnabled);
    } catch (error) {
        console.error('❌ localStorage kaydedilemedi:', error.message);
    }

    const countdownContainer = getElement('countdown').parentElement.parentElement;
    const updateFrequencyElement = getElement('updateFrequency');

    if (isEnabled) {
        console.log('⏰ Otomatik güncelleme aktif ediliyor');
        if (countdownContainer) {
            countdownContainer.style.display = 'flex';
        } else {
            console.error('❌ Countdown container bulunamadı');
        }
        if (updateFrequencyElement) {
            updateFrequencyElement.disabled = false;
        } else {
            console.error('❌ UpdateFrequency elementi bulunamadı');
        }
        startUpdateTimer();
    } else {
        console.log('⏸️ Otomatik güncelleme pasif ediliyor');
        if (countdownContainer) {
            countdownContainer.style.display = 'none';
        }
        if (updateFrequencyElement) {
            updateFrequencyElement.disabled = true;
        }
        clearInterval(updateInterval);
        console.log('⏰ Zamanlayıcı durduruldu');
    }
}

function handleUpdateFrequencyChange() {
    console.log('🔄 Güncelleme sıklığı değişikliği tetiklendi');
    const updateFrequencyElement = getElement('updateFrequency');
    if (!updateFrequencyElement) {
        console.error('❌ UpdateFrequency elementi bulunamadı');
        return;
    }

    const selectedValue = updateFrequencyElement.value;
    console.log('📊 Seçilen değer:', selectedValue);

    // Değeri sayıya çevir ve minimum 120 saniye kuralını uygula
    const parsedValue = parseInt(selectedValue);
    if (isNaN(parsedValue)) {
        console.error('❌ Geçersiz güncelleme sıklığı değeri:', selectedValue);
        return;
    }

    const newInterval = Math.max(parsedValue, 120);
    updateIntervalValue = newInterval;
    console.log('🔧 Uygulanan yeni aralık:', newInterval + ' saniye');

    // localStorage'a kaydet
    try {
        localStorage.setItem('updateInterval', newInterval.toString());
        console.log('💾 localStorage\'a kaydedildi:', newInterval + ' saniye');
    } catch (error) {
        console.error('❌ localStorage kaydedilemedi:', error.message);
    }

    // Otomatik güncelleme aktifse timer'ı yeniden başlat
    const autoUpdateElement = getElement('autoUpdate');
    if (autoUpdateElement && autoUpdateElement.checked) {
        console.log('⏰ Otomatik güncelleme aktif, timer yeniden başlatılıyor');
        startUpdateTimer();
    } else {
        console.log('⏸️ Otomatik güncelleme pasif, timer başlatılmadı');
    }

    console.log('✅ Güncelleme sıklığı başarıyla değiştirildi:', newInterval + ' saniye');
}

function handleVisibilityChange() {
    console.log('👁️ Sayfa görünürlük durumu değişti:', document.hidden ? 'gizlendi' : 'göründü');
    if (document.hidden) {
        console.log('⏸️ Sayfa gizlendi, zamanlayıcı durduruluyor');
        clearInterval(updateInterval);
    } else {
        if (getElement('autoUpdate').checked) {
            console.log('👁️ Sayfa göründü, anlık güncelleme yapılıyor');
            startUpdateTimer(true); // Immediate fetch
        } else {
            console.log('👁️ Sayfa göründü, ancak otomatik güncelleme pasif');
        }
    }
}

function handleFetchError(error) {
    console.error('Veri güncellenirken hata oluştu:', error);

    let message = 'Veriler yüklenirken bir hata oluştu.';

    if (error.message.includes('Rate Limited')) {
        message = 'Çok fazla istek gönderildi. Otomatik güncelleme durduruldu.';
        getElement('autoUpdate').checked = false;
        handleAutoUpdateToggle();
    } else if (error.message.includes('HTTP 404')) {
        message = 'API endpoint bulunamadı. Lütfen sayfayı yenileyin.';
    } else if (error.message.includes('HTTP 500')) {
        message = 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
    } else if (error.message.includes('Network Error')) {
        message = 'Ağ bağlantısı hatası. Lütfen internet bağlantınızı kontrol edin.';
    } else if (error.message.includes('Failed to fetch')) {
        message = 'Veri çekme işlemi başarısız oldu. Lütfen sayfayı yenileyin.';
    }

    showError(message, 8000);

    // Hata durumunda boş liste göster
    const quakeListBody = getElement('quakeList');
    if (quakeListBody) {
        quakeListBody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Veri yüklenemedi. Lütfen sayfayı yenileyin.</td></tr>';
    }

    // Haritadaki marker'ları temizle
    markers.forEach(marker => marker.remove());
    markers = [];
}

// =================================================================================
// User Actions and Timers
// =================================================================================

function changePage(direction) {
    try {
        const totalPages = Math.ceil(filteredQuakes.length / ITEMS_PER_PAGE);
        const newPage = currentPage + direction;

        if (newPage >= 1 && newPage <= totalPages) {
            currentPage = newPage;
            renderPaginatedList();
        } else {
            console.warn('❌ Geçersiz sayfa numarası:', newPage, 'Toplam sayfa:', totalPages);
        }
    } catch (error) {
        console.error('❌ Sayfa değiştirme sırasında hata oluştu:', error);
    }
}

function zoomToQuake(quake) {
    try {
        if (!map) {
            console.error('❌ Harita henüz oluşturulmadı');
            showError('Harita henüz yüklenmedi.');
            return;
        }

        if (!quake || typeof quake !== 'object') {
            console.error('❌ Geçersiz deprem verisi:', quake);
            showError('Geçersiz deprem verisi.');
            return;
        }

        const enlem = parseFloat(quake.enlem);
        const boylam = parseFloat(quake.boylam);

        if (isNaN(enlem) || isNaN(boylam)) {
            console.error('❌ Geçersiz koordinatlar:', quake);
            showError('Geçersiz koordinat bilgisi.');
            return;
        }

        map.setView([enlem, boylam], 10, { animate: true, duration: 1 });

        // İlgili marker'ı bul ve popup'ı aç
        let foundMarker = false;
        markers.forEach(marker => {
            const markerLat = marker.getLatLng().lat;
            const markerLng = marker.getLatLng().lng;

            // Yakınlık kontrolü (küçük bir toleransla)
            const latDiff = Math.abs(markerLat - enlem);
            const lngDiff = Math.abs(markerLng - boylam);

            if (latDiff < 0.0001 && lngDiff < 0.0001) {
                marker.openPopup();
                foundMarker = true;
            }
        });

        if (!foundMarker) {
            console.warn('⚠️ İlgili marker bulunamadı, harita sadece odaklanacak');
        }
    } catch (error) {
        console.error('❌ Depreme odaklanma sırasında hata oluştu:', error);
        showError('Haritada odaklanırken bir hata oluştu.');
    }
}

let countdown = updateIntervalValue;
function startUpdateTimer(immediate = false) {
    console.log('⏰ Zamanlayıcı başlatılıyor, immediate:', immediate);

    // Önceki zamanlayıcıyı temizle
    if (updateInterval) {
        clearInterval(updateInterval);
        console.log('🧹 Önceki zamanlayıcı temizlendi');
    }

    if (immediate) {
        countdown = 1; // Trigger update on next tick
        console.log('🔄 Anlık güncelleme tetiklenecek');
    } else {
        countdown = updateIntervalValue;
        console.log('🔄 Normal zamanlayıcı başlatıldı, süre:', updateIntervalValue + ' saniye');
    }

    try {
        updateInterval = setInterval(updateCountdown, 1000);
        console.log('✅ Yeni zamanlayıcı başarıyla başlatıldı');
    } catch (error) {
        console.error('❌ Zamanlayıcı başlatılamadı:', error.message);
    }
}

function updateCountdown() {
    countdown--;

    // Countdown elementini güncelle
    const countdownElement = getElement('countdown');
    if (countdownElement) {
        countdownElement.textContent = countdown;
    } else {
        console.error('❌ Countdown elementi bulunamadı');
    }

    if (countdown <= 0) {
        console.log('⏰ Süre doldu, veriler güncelleniyor...');
        countdown = updateIntervalValue;
        console.log('🔄 Countdown sıfırlandı, yeni süre:', updateIntervalValue + ' saniye');
        fetchEarthquakes();
    }
}

// =================================================================================
// User Preferences
// =================================================================================

function loadUserPreferences() {
    console.log('🔧 Kullanıcı tercihleri yükleniyor...');

    let isEnabled = true; // Varsayılan değer

    // Otomatik güncelleme ayarını yükle
    try {
        const savedPreference = localStorage.getItem('autoUpdateEnabled');
        if (savedPreference !== null) {
            isEnabled = savedPreference === 'true';
            const autoUpdateElement = getElement('autoUpdate');
            if (autoUpdateElement) {
                autoUpdateElement.checked = isEnabled;
            }
            console.log('💾 Kayıtlı otomatik güncelleme ayarı:', isEnabled);
        } else {
            console.log('ℹ️ Varsayılan otomatik güncelleme ayarı: true');
        }
    } catch (error) {
        console.error('❌ Otomatik güncelleme ayarı yüklenemedi:', error.message);
    }

    // Güncelleme sıklığını yükle
    try {
        const savedInterval = localStorage.getItem('updateInterval');
        if (savedInterval !== null) {
            const parsedInterval = parseInt(savedInterval);
            if (!isNaN(parsedInterval)) {
                updateIntervalValue = Math.max(parsedInterval, 120);
                // Dropdown menüsünü güncelle
                const updateFrequencyElement = getElement('updateFrequency');
                if (updateFrequencyElement) {
                    updateFrequencyElement.value = updateIntervalValue.toString();
                }
                console.log('💾 Kayıtlı güncelleme sıklığı:', updateIntervalValue + ' saniye');
            } else {
                console.error('❌ Geçersiz güncelleme sıklığı değeri:', savedInterval);
            }
        } else {
            console.log('ℹ️ Varsayılan güncelleme sıklığı:', updateIntervalValue + ' saniye');
        }
    } catch (error) {
        console.error('❌ Güncelleme sıklığı yüklenemedi:', error.message);
    }

    // Başlangıç durumunu ayarla
    try {
        handleAutoUpdateToggle();
    } catch (error) {
        console.error('❌ Başlangıç durumu ayarlanamadı:', error.message);
    }

    // Dropdown menünün başlangıçta devre dışı olup olmadığını kontrol et
    const updateFrequencyElement = getElement('updateFrequency');
    if (updateFrequencyElement) {
        updateFrequencyElement.disabled = !isEnabled;
        console.log('🔧 Dropdown menü başlangıç durumu:', isEnabled ? 'Aktif' : 'Devre dışı');
    } else {
        console.error('❌ UpdateFrequency elementi bulunamadı');
    }

    console.log('✅ Kullanıcı tercihleri yükleme tamamlandı');
}

// =================================================================================
// UI Feedback and Helpers
// =================================================================================

function showFilterFeedback(count) {
    const feedback = getElement('filter-feedback') || createFeedbackElement();
    feedback.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
            <span>${count} deprem gösteriliyor</span>
        </div>`;

    document.body.appendChild(feedback);

    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.style.opacity = '0';
            setTimeout(() => feedback.remove(), 300);
        }
    }, 3000);
}

function showError(message, duration = 5000) {
    console.error('Hata:', message);

    const errorDiv = getElement('error-message') || createErrorElement();
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
            <span>${message}</span>
        </div>`;

    document.body.appendChild(errorDiv);

    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.style.opacity = '0';
            setTimeout(() => errorDiv.remove(), 300);
        }
    }, duration);

    // Fallback: Browser notification
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Türkiye Deprem Takip Sistemi', {
            body: message,
            icon: '/assets/images/logo.png'
        });
    }

    // Fallback: Console alert
    console.warn('⚠️ Hata mesajı gösterildi:', message);
}

function createFeedbackElement() {
    const feedback = document.createElement('div');
    feedback.id = 'filter-feedback';
    feedback.className = 'fixed top-20 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    return feedback;
}

function createErrorElement() {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.className = 'fixed top-20 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-all duration-300';
    return errorDiv;
}

function getBgColorClass(magnitude) {
    if (magnitude >= 5.0) return 'bg-red-100 text-red-800';
    if (magnitude >= 4.0) return 'bg-orange-100 text-orange-800';
    if (magnitude >= 3.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
}

function getColorByMagnitude(magnitude) {
    if (magnitude >= 5.0) return '#dc2626'; // Daha canlı kırmızı
    if (magnitude >= 4.0) return '#ea580c'; // Daha canlı turuncu
    if (magnitude >= 3.0) return '#d97706'; // Daha canlı amber
    return '#16a34a'; // Daha canlı yeşil
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    try {
        // Girdi doğrulama
        if ([lat1, lon1, lat2, lon2].some(coord => isNaN(coord))) {
            console.error('❌ Geçersiz koordinatlar:', { lat1, lon1, lat2, lon2 });
            return 0;
        }

        // Koordinat aralığını kontrol et
        if ([lat1, lat2].some(lat => lat < -90 || lat > 90)) {
            console.error('❌ Geçersiz enlem aralığı:', { lat1, lat2 });
            return 0;
        }

        if ([lon1, lon2].some(lon => lon < -180 || lon > 180)) {
            console.error('❌ Geçersiz boylam aralığı:', { lon1, lon2 });
            return 0;
        }

        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    } catch (error) {
        console.error('❌ Mesafe hesaplama sırasında hata oluştu:', error);
        return 0;
    }
}

function getNearestEarthquake(quakes, userLat, userLng) {
    try {
        if (!quakes || quakes.length === 0) return null;

        if (isNaN(userLat) || isNaN(userLng)) {
            console.error('❌ Geçersiz kullanıcı konumu:', { userLat, userLng });
            return null;
        }

        let nearestQuake = quakes[0];
        let minDistance = calculateDistance(
            userLat, userLng,
            parseFloat(nearestQuake.enlem),
            parseFloat(nearestQuake.boylam)
        );

        quakes.forEach(quake => {
            if (!quake || typeof quake !== 'object') {
                console.warn('❌ Geçersiz deprem verisi atlandı:', quake);
                return;
            }

            const enlem = parseFloat(quake.enlem);
            const boylam = parseFloat(quake.boylam);

            if (isNaN(enlem) || isNaN(boylam)) {
                console.warn('❌ Geçersiz koordinatlar için deprem atlandı:', quake);
                return;
            }

            const distance = calculateDistance(
                userLat, userLng,
                enlem,
                boylam
            );
            if (distance < minDistance) {
                minDistance = distance;
                nearestQuake = quake;
            }
        });

        return {
            ...nearestQuake,
            distance: minDistance.toFixed(1)
        };
    } catch (error) {
        console.error('❌ En yakın deprem hesaplama sırasında hata oluştu:', error);
        return null;
    }
}

function updateNearestEarthquake() {
    try {
        if (!userLocation || !allQuakes || allQuakes.length === 0) {
            // Kullanıcı konumu yoksa veya deprem verisi yoksa kartı temizle
            getElement('nearest-magnitude').textContent = '-';
            getElement('nearest-distance').textContent = '-';
            getElement('nearest-location').textContent = '-';
            getElement('nearest-city').textContent = '-';
            getElement('nearest-datetime').textContent = '-';
            return;
        }

        // En yakın depremi bul
        const nearestQuake = getNearestEarthquake(allQuakes, userLocation.lat, userLocation.lng);

        if (nearestQuake) {
            // Kartı güncelle
            getElement('nearest-magnitude').textContent = nearestQuake.buyukluk;
            getElement('nearest-distance').textContent = nearestQuake.distance;
            getElement('nearest-location').textContent = nearestQuake.yer || '-';
            getElement('nearest-city').textContent = nearestQuake.sehir || '-';

            // Tarih ve saat formatı
            const dateTime = `${nearestQuake.tarih} ${nearestQuake.saat}`;
            getElement('nearest-datetime').textContent = dateTime;
        } else {
            // Hiç deprem bulunamadıysa kartı temizle
            getElement('nearest-magnitude').textContent = '-';
            getElement('nearest-distance').textContent = '-';
            getElement('nearest-location').textContent = '-';
            getElement('nearest-city').textContent = '-';
            getElement('nearest-datetime').textContent = '-';
        }
    } catch (error) {
        console.error('❌ En yakın deprem güncelleme sırasında hata oluştu:', error);
        // Hata durumunda kartı temizle
        getElement('nearest-magnitude').textContent = '-';
        getElement('nearest-distance').textContent = '-';
        getElement('nearest-location').textContent = '-';
        getElement('nearest-city').textContent = '-';
        getElement('nearest-datetime').textContent = '-';
    }
}


// =================================================================================
// Test ve Hata Ayıklama Fonksiyonları
// =================================================================================

/*
function testAutoUpdateFunctionality() {
    console.log('🧪 Otomatik güncelleme fonksiyonları test ediliyor...');
    
    // Test 1: Elementlerin varlığını kontrol et
    const autoUpdateElement = getElement('autoUpdate');
    const updateFrequencyElement = getElement('updateFrequency');
    const countdownElement = getElement('countdown');
    
    if (!autoUpdateElement) {
        console.error('❌ AutoUpdate elementi bulunamadı');
        return false;
    }
    if (!updateFrequencyElement) {
        console.error('❌ UpdateFrequency elementi bulunamadı');
        return false;
    }
    if (!countdownElement) {
        console.error('❌ Countdown elementi bulunamadı');
        return false;
    }
    
    console.log('✅ Tüm elementler bulundu');
    
    // Test 2: Event listener'ın doğru bağlandığını kontrol et
    
    
    
    // Test 3: localStorage ayarlarını kontrol et
    const savedPreference = localStorage.getItem('autoUpdateEnabled');
    const savedInterval = localStorage.getItem('updateInterval');
    console.log('💾 localStorage ayarları:');
    console.log('  - autoUpdateEnabled:', savedPreference);
    console.log('  - updateInterval:', savedInterval);
    
    // Test 4: Checkbox'ın mevcut durumunu kontrol et
    const currentCheckedState = autoUpdateElement.checked;
    console.log('🔌 Checkbox mevcut durum:', currentCheckedState);
    
    // Test 5: Zamanlayıcı durumunu kontrol et
    const timerExists = updateInterval !== null;
    console.log('⏰ Zamanlayıcı durumu:', timerExists ? 'aktif' : 'pasif');
    
    // Test 6: CSS sınıflarını kontrol et
    const blockElement = autoUpdateElement.nextElementSibling;
    const dotElement = blockElement?.nextElementSibling;
    if (blockElement && dotElement) {
        console.log('🎨 CSS elementleri bulundu');
        console.log('  - Block element:', blockElement.className);
        console.log('  - Dot element:', dotElement.className);
    } else {
        console.error('❌ CSS elementleri bulunamadı');
    }
    
    console.log('🧪 Test tamamlandı');
    return true;
}
*/

// Sayfa yüklendiğinde test fonksiyonunu çalıştır
document.addEventListener('DOMContentLoaded', function () {
    // Kısa bir gecikme ile test fonksiyonunu çalıştır
    /*
    setTimeout(() => {
        testAutoUpdateFunctionality();
        runComprehensiveTests();
    }, 1000);
    */
});

// =================================================================================
// Kapsamlı Test Fonksiyonları
// =================================================================================

function runComprehensiveTests() {
    console.log('🧪 Kapsamlı otomatik güncelleme testleri başlatılıyor...');

    // Test senaryolarını çalıştır
    setTimeout(() => testScenario1(), 2000);
    setTimeout(() => testScenario2(), 5000);
    setTimeout(() => testScenario3(), 8000);
    setTimeout(() => testScenario4(), 11000);
    setTimeout(() => testScenario5(), 14000);

    console.log('📋 Test senaryoları planlandı');
}

// Senaryo 1: Varsayılan Ayarlar Testi
function testScenario1() {
    console.log('🔬 Senaryo 1: Varsayılan Ayarlar Testi');

    const autoUpdateElement = getElement('autoUpdate');
    const updateFrequencyElement = getElement('updateFrequency');
    const countdownElement = getElement('countdown');

    // Test 1.1: Varsayılan 120 saniye ayarının aktif olduğunu kontrol et
    const defaultInterval = updateFrequencyElement.value;
    console.log('✅ Varsayılan güncelleme sıklığı:', defaultInterval + ' saniye');
    if (parseInt(defaultInterval) !== 120) {
        console.error('❌ Varsayılan ayar 120 saniye olmalı');
    }

    // Test 1.2: Otomatik güncellemenin açık olduğunu doğrula
    const isAutoUpdateEnabled = autoUpdateElement.checked;
    console.log('✅ Otomatik güncelleme durumu:', isAutoUpdateEnabled ? 'Açık' : 'Kapalı');
    if (!isAutoUpdateEnabled) {
        console.error('❌ Otomatik güncelleme varsayılan olarak açık olmalı');
    }

    // Test 1.3: Geri sayımın doğru çalıştığını kontrol et
    const countdownValue = countdownElement.textContent;
    console.log('✅ Geri sayım değeri:', countdownValue);
    if (countdownValue === '0' || isNaN(countdownValue)) {
        console.error('❌ Geri sayım doğru çalışmıyor');
    }

    // Test 1.4: Zamanlayıcının aktif olduğunu doğrula
    const timerExists = updateInterval !== null;
    console.log('✅ Zamanlayıcı durumu:', timerExists ? 'Aktif' : 'Pasif');
    if (!timerExists) {
        console.error('❌ Zamanlayıcı aktif değil');
    }

    console.log('✅ Senaryo 1 tamamlandı');
}

// Senaryo 2: Güncelleme Sıklığı Değişikliği Testi
function testScenario2() {
    console.log('🔬 Senaryo 2: Güncelleme Sıklığı Değişikliği Testi');

    const updateFrequencyElement = getElement('updateFrequency');
    const autoUpdateElement = getElement('autoUpdate');

    // Test 2.1: Dropdown menüden 300 saniye seçeneğini seç
    updateFrequencyElement.value = '300';
    console.log('✅ Yeni güncelleme sıklığı seçildi: 300 saniye');

    // Test 2.2: Değişikliği tetikle
    updateFrequencyElement.dispatchEvent(new Event('change'));
    console.log('✅ Değişiklik event\'i tetiklendi');

    // Test 2.3: Ayarların localStorage'a kaydedildiğini doğrula
    const savedInterval = localStorage.getItem('updateInterval');
    console.log('✅ localStorage\'a kaydedilen sıklık:', savedInterval);
    if (savedInterval !== '300') {
        console.error('❌ localStorage\'a doğru değer kaydedilmedi');
    }

    // Test 2.4: Yeni sıklığın uygulandığını doğrula
    const currentInterval = updateIntervalValue;
    console.log('✅ Uygulanan güncelleme sıklığı:', currentInterval + ' saniye');
    if (currentInterval !== 300) {
        console.error('❌ Yeni sıklık uygulanmadı');
    }

    // Test 2.5: Geri sayımın yeni sıklığa göre güncellendiğini kontrol et
    const countdownElement = getElement('countdown');
    const countdownValue = countdownElement.textContent;
    console.log('✅ Geri sayım değeri:', countdownValue);

    console.log('✅ Senaryo 2 tamamlandı');
}

// Senaryo 3: Otomatik Güncellemeyi Kapatma Testi
function testScenario3() {
    console.log('🔬 Senaryo 3: Otomatik Güncellemeyi Kapatma Testi');

    const autoUpdateElement = getElement('autoUpdate');
    const updateFrequencyElement = getElement('updateFrequency');
    const countdownElement = getElement('countdown');

    // Test 3.1: Toggle switch ile otomatik güncellemeyi kapat
    autoUpdateElement.checked = false;
    autoUpdateElement.dispatchEvent(new Event('change'));
    console.log('✅ Otomatik güncelleme kapatıldı');

    // Test 3.2: Zamanlayıcının durduğunu doğrula
    const timerExists = updateInterval !== null;
    console.log('✅ Zamanlayıcı durumu:', timerExists ? 'Aktif (hata!)' : 'Pasif');
    if (timerExists) {
        console.error('❌ Zamanlayıcı durdurulmadı');
    }

    // Test 3.3: Geri sayımın durduğunu test et
    const countdownValue1 = countdownElement.textContent;
    setTimeout(() => {
        const countdownValue2 = countdownElement.textContent;
        console.log('✅ Geri sayım kontrolü - Önce:', countdownValue1, 'Sonra:', countdownValue2);
        if (countdownValue1 !== countdownValue2) {
            console.error('❌ Geri sayım durmadı');
        }
    }, 2000);

    // Test 3.4: Dropdown menünün devre dışı olduğunu kontrol et
    const isDisabled = updateFrequencyElement.disabled;
    console.log('✅ Dropdown menü durumu:', isDisabled ? 'Devre dışı' : 'Aktif (hata!)');
    if (!isDisabled) {
        console.error('❌ Dropdown menü devre dışı değil');
    }

    console.log('✅ Senaryo 3 tamamlandı');
}

// Senaryo 4: Tekrar Açma Testi
function testScenario4() {
    console.log('🔬 Senaryo 4: Tekrar Açma Testi');

    const autoUpdateElement = getElement('autoUpdate');
    const updateFrequencyElement = getElement('updateFrequency');
    const countdownElement = getElement('countdown');

    // Test 4.1: Toggle switch ile otomatik güncellemeyi tekrar aç
    autoUpdateElement.checked = true;
    autoUpdateElement.dispatchEvent(new Event('change'));
    console.log('✅ Otomatik güncelleme tekrar açıldı');

    // Test 4.2: Zamanlayıcının başladığını doğrula
    setTimeout(() => {
        const timerExists = updateInterval !== null;
        console.log('✅ Zamanlayıcı durumu:', timerExists ? 'Aktif' : 'Pasif (hata!)');
        if (!timerExists) {
            console.error('❌ Zamanlayıcı başlatılmadı');
        }

        // Test 4.3: Son seçilen sıklığın uygulandığını test et
        const currentInterval = updateIntervalValue;
        console.log('✅ Uygulanan güncelleme sıklığı:', currentInterval + ' saniye');
        if (currentInterval !== 300) {
            console.error('❌ Önceki sıklık korunmadı');
        }

        // Test 4.4: Dropdown menünün aktif olduğunu kontrol et
        const isDisabled = updateFrequencyElement.disabled;
        console.log('✅ Dropdown menü durumu:', isDisabled ? 'Devre dışı (hata!)' : 'Aktif');
        if (isDisabled) {
            console.error('❌ Dropdown menü hala devre dışı');
        }

        console.log('✅ Senaryo 4 tamamlandı');
    }, 1000);
}

// Senaryo 5: Edge Cases Testi
function testScenario5() {
    console.log('🔬 Senaryo 5: Edge Cases Testi');

    const updateFrequencyElement = getElement('updateFrequency');

    // Test 5.1: Minimum 120 saniye kuralının çalıştığını doğrula
    updateFrequencyElement.value = '60'; // 60 saniye (alt limit)
    updateFrequencyElement.dispatchEvent(new Event('change'));

    setTimeout(() => {
        const appliedInterval = updateIntervalValue;
        console.log('✅ Alt sınır testi - Seçilen: 60, Uygulanan:', appliedInterval);
        if (appliedInterval < 120) {
            console.error('❌ Minimum 120 saniye kuralı çalışmıyor');
        }

        // Test 5.2: Hızlı ardışık ayar değişikliklerinde doğru çalışma
        updateFrequencyElement.value = '180';
        updateFrequencyElement.dispatchEvent(new Event('change'));

        setTimeout(() => {
            updateFrequencyElement.value = '240';
            updateFrequencyElement.dispatchEvent(new Event('change'));

            setTimeout(() => {
                const finalInterval = updateIntervalValue;
                console.log('✅ Hızlı değişiklik testi - Sonuç:', finalInterval + ' saniye');
                if (finalInterval !== 240) {
                    console.error('❌ Hızlı değişikliklerde hata oluştu');
                }

                // Test 5.3: localStorage desteği yoksa fallback testi
                const originalLocalStorage = localStorage;
                delete window.localStorage;

                try {
                    const autoUpdateElement = getElement('autoUpdate');
                    autoUpdateElement.checked = false;
                    autoUpdateElement.dispatchEvent(new Event('change'));

                    console.log('✅ localStorage yokluğunda test tamamlandı');
                } catch (error) {
                    console.error('❌ localStorage fallback testi başarısız:', error.message);
                }

                // localStorage'ı geri yükle
                window.localStorage = originalLocalStorage;

                console.log('✅ Senaryo 5 tamamlandı');
                console.log('🎉 Tüm test senaryoları tamamlandı!');
            }, 500);
        }, 500);
    }, 500);
}
