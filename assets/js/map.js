'use strict';

// Harita: Leaflet kurulumu, işaretçiler ve odaklanma.

window.Sismolog = window.Sismolog || {};

window.Sismolog.initializeMap = function initializeMap() {
    const state = window.Sismolog.state;
    const mapElement = document.getElementById('map');

    if (!mapElement) {
        window.Sismolog.showError('Harita bileşeni yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
        return;
    }

    if (typeof L === 'undefined') {
        window.Sismolog.showError('Harita kütüphanesi yüklenemedi. Lütfen internet bağlantınızı kontrol edin.', 10000);
        return;
    }

    if (state.map && state.map._container) return;

    try {
        state.map = L.map('map', {
            scrollWheelZoom: true,
            center: [39.0, 35.0],
            zoom: 6,
            zoomControl: false,
            attributionControl: false
        });

        L.control.zoom({ position: 'topright' }).addTo(state.map);

        const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 6,
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(state.map);

        tileLayer.on('tileerror', function onTileError() {
            window.Sismolog.showError('Harita yüklenirken bir hata oluştu. İnternet bağlantınızı kontrol edin.', 5000);
        });

        L.control.scale({ imperial: false, metric: true, position: 'bottomright' }).addTo(state.map);

        state.map.setView([39.0, 35.0], 6, { animate: false });

        setTimeout(() => {
            try {
                state.map.invalidateSize();
            } catch (error) {
                console.error('Harita boyutları güncellenemedi:', error);
            }
        }, 500);
    } catch (error) {
        console.error('Harita başlatılamadı:', error);
        window.Sismolog.showError(`Harita yüklenirken bir hata oluştu: ${error.message}`, 10000);
    }
};

window.Sismolog.updateMap = function updateMap(quakesToDisplay) {
    const state = window.Sismolog.state;

    if (!state.map) {
        console.error('Harita henüz oluşturulmadı');
        return;
    }

    try {
        state.markers.forEach((marker) => marker.remove());
        state.markers = [];

        const list = Array.isArray(quakesToDisplay) ? quakesToDisplay : [];
        const latestQuake = list.length > 0
            ? list.reduce((latest, current) => {
                const latestDate = new Date(`${latest.tarih} ${latest.saat}`);
                const currentDate = new Date(`${current.tarih} ${current.saat}`);
                return currentDate > latestDate ? current : latest;
            })
            : null;

        let latestQuakeMarker = null;

        list.forEach((quake) => {
            if (!quake || typeof quake !== 'object') return;

            const magnitude = Number.parseFloat(quake.buyukluk);
            const enlem = Number.parseFloat(quake.enlem);
            const boylam = Number.parseFloat(quake.boylam);
            if (!Number.isFinite(enlem) || !Number.isFinite(boylam)) return;

            const baseSize = 10;
            const iconSize = Math.min(Math.max(magnitude * 4, baseSize), 30);
            const color = window.Sismolog.getColorByMagnitude(magnitude);
            const borderColor = magnitude >= 4.0 ? '#ffffff' : color;
            const borderWidth = magnitude >= 4.0 ? 3 : 1;

            const isLatestQuake = Boolean(latestQuake) &&
                quake.tarih === latestQuake.tarih &&
                quake.saat === latestQuake.saat;

            const customIcon = L.divIcon({
                className: isLatestQuake ? 'earthquake-marker-container latest-earthquake' : 'earthquake-marker-container',
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

            const popupContent = `
                <div class="p-3 min-w-[200px]">
                    <div class="text-center mb-2">
                        <div class="text-2xl font-bold mb-1" style="color: ${color};">${quake.buyukluk}</div>
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
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.addTo(state.map);
            state.markers.push(marker);

            if (isLatestQuake) latestQuakeMarker = marker;
        });

        if (latestQuakeMarker) latestQuakeMarker.openPopup();
    } catch (error) {
        console.error('Harita güncellenemedi:', error);
        window.Sismolog.showError('Harita güncellenirken bir hata oluştu.');
    }
};

window.Sismolog.zoomToQuake = function zoomToQuake(quake) {
    const state = window.Sismolog.state;

    if (!state.map) {
        window.Sismolog.showError('Harita henüz yüklenmedi.');
        return;
    }

    if (!quake || typeof quake !== 'object') {
        window.Sismolog.showError('Geçersiz deprem verisi.');
        return;
    }

    const enlem = Number.parseFloat(quake.enlem);
    const boylam = Number.parseFloat(quake.boylam);
    if (!Number.isFinite(enlem) || !Number.isFinite(boylam)) {
        window.Sismolog.showError('Geçersiz koordinat bilgisi.');
        return;
    }

    state.map.setView([enlem, boylam], 10, { animate: true, duration: 1 });

    state.markers.forEach((marker) => {
        const latLng = marker.getLatLng();
        if (Math.abs(latLng.lat - enlem) < 0.0001 && Math.abs(latLng.lng - boylam) < 0.0001) {
            marker.openPopup();
        }
    });
};

window.Sismolog.getUserLocation = function getUserLocation() {
    if (!navigator.geolocation) {
        console.warn('Tarayıcı konum bilgisini desteklemiyor');
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            window.Sismolog.state.userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            window.Sismolog.updateNearestEarthquake();
        },
        (error) => {
            console.warn('Konum alınamadı:', error.message);
        }
    );
};
