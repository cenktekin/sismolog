'use strict';

// Paylaşılan uygulama durumu ve DOM yardımcıları.
// Diğer modüller bu nesne üzerinden tek bir kaynak kullanır.

window.Sismolog = window.Sismolog || {};

window.Sismolog.state = {
    map: null,
    allQuakes: [],
    filteredQuakes: [],
    markers: [],
    updateInterval: null,
    userLocation: null,
    currentPage: 1,
    itemsPerPage: 25,
    updateIntervalValue: 120,
    countdown: 120
};

window.Sismolog.getElement = function getElement(id) {
    return document.getElementById(id);
};

window.Sismolog.setStatus = function setStatus(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = value;
};

window.Sismolog.showFilterFeedback = function showFilterFeedback(count) {
    const feedback = document.getElementById('filter-feedback') || createFeedbackElement();
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
};

window.Sismolog.showError = function showError(message, duration = 5000) {
    console.error('Hata:', message);

    const errorDiv = document.getElementById('error-message') || createErrorElement();
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
};

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

window.Sismolog.getBgColorClass = function getBgColorClass(magnitude) {
    if (magnitude >= 5.0) return 'bg-red-100 text-red-800';
    if (magnitude >= 4.0) return 'bg-orange-100 text-orange-800';
    if (magnitude >= 3.0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
};

window.Sismolog.getColorByMagnitude = function getColorByMagnitude(magnitude) {
    if (magnitude >= 5.0) return '#dc2626';
    if (magnitude >= 4.0) return '#ea580c';
    if (magnitude >= 3.0) return '#d97706';
    return '#16a34a';
};

window.Sismolog.calculateDistance = function calculateDistance(lat1, lon1, lat2, lon2) {
    if ([lat1, lon1, lat2, lon2].some((coord) => Number.isNaN(coord))) return 0;
    if ([lat1, lat2].some((lat) => lat < -90 || lat > 90)) return 0;
    if ([lon1, lon2].some((lon) => lon < -180 || lon > 180)) return 0;

    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

window.Sismolog.getNearestEarthquake = function getNearestEarthquake(quakes, userLat, userLng) {
    if (!Array.isArray(quakes) || quakes.length === 0) return null;
    if (Number.isNaN(userLat) || Number.isNaN(userLng)) return null;

    let nearestQuake = null;
    let minDistance = Infinity;

    quakes.forEach((quake) => {
        if (!quake || typeof quake !== 'object') return;

        const enlem = Number.parseFloat(quake.enlem);
        const boylam = Number.parseFloat(quake.boylam);
        if (!Number.isFinite(enlem) || !Number.isFinite(boylam)) return;

        const distance = window.Sismolog.calculateDistance(userLat, userLng, enlem, boylam);
        if (distance < minDistance) {
            minDistance = distance;
            nearestQuake = quake;
        }
    });

    if (!nearestQuake) return null;
    return { ...nearestQuake, distance: minDistance.toFixed(1) };
};

window.Sismolog.updateNearestEarthquake = function updateNearestEarthquake() {
    const state = window.Sismolog.state;
    const nearest = (state.userLocation && Array.isArray(state.allQuakes) && state.allQuakes.length > 0)
        ? window.Sismolog.getNearestEarthquake(state.allQuakes, state.userLocation.lat, state.userLocation.lng)
        : null;

    window.Sismolog.setStatus('nearest-magnitude', nearest ? nearest.buyukluk : '-');
    window.Sismolog.setStatus('nearest-distance', nearest ? nearest.distance : '-');
    window.Sismolog.setStatus('nearest-location', nearest ? (nearest.yer || '-') : '-');
    window.Sismolog.setStatus('nearest-city', nearest ? (nearest.sehir || '-') : '-');
    window.Sismolog.setStatus('nearest-datetime', nearest ? `${nearest.tarih} ${nearest.saat}` : '-');
};
