'use strict';

// Uygulama kabuğu: modülleri bağlar, olay dinleyicilerini kurar.

(function bootstrap() {
    const S = window.Sismolog;
    const get = S.getElement;

    function initializeEventListeners() {
        const bind = (id, event, handler) => {
            const element = get(id);
            if (element) element.addEventListener(event, handler);
        };

        bind('autoUpdate', 'change', S.handleAutoUpdateToggle);
        bind('updateFrequency', 'change', S.handleUpdateFrequencyChange);

        bind('magnitudeFilter', 'input', () => {
            S.setStatus('magnitudeValue', Number.parseFloat(get('magnitudeFilter').value).toFixed(1));
            S.applyFiltersAndRender();
        });

        bind('depthFilter', 'input', () => {
            S.setStatus('depthValue', get('depthFilter').value);
            S.applyFiltersAndRender();
        });

        bind('cityFilter', 'change', S.applyFiltersAndRender);
        bind('clearFilters', 'click', S.clearAllFilters);
        bind('prevPage', 'click', () => S.changePage(-1));
        bind('nextPage', 'click', () => S.changePage(1));

        document.addEventListener('visibilitychange', S.handleVisibilityChange);
    }

    function initializeApp() {
        S.initializeMap();
        initializeEventListeners();
        S.loadUserPreferences();
        S.fetchEarthquakes();
        S.getUserLocation();
        S.updateNearestEarthquake();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }
})();
