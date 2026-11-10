'use strict';

// Liste: filtreleme, sayfalama ve tablo render.

window.Sismolog = window.Sismolog || {};

window.Sismolog.readFilters = function readFilters() {
    const get = window.Sismolog.getElement;

    const magnitudeElement = get('magnitudeFilter');
    const depthElement = get('depthFilter');
    const cityElement = get('cityFilter');

    return {
        magnitude: magnitudeElement ? Number.parseFloat(magnitudeElement.value) : 0,
        depth: depthElement ? Number.parseFloat(depthElement.value) : 200,
        city: cityElement ? cityElement.value : ''
    };
};

window.Sismolog.filterQuakes = function filterQuakes(list, filters) {
    if (!Array.isArray(list)) return [];

    const minMagnitude = Number.isFinite(filters.magnitude) ? filters.magnitude : 0;
    const maxDepth = Number.isFinite(filters.depth) ? filters.depth : 200;
    const city = filters.city || '';

    return list.filter((quake) => {
        if (!quake || typeof quake !== 'object') return false;

        const magnitude = Number.parseFloat(quake.buyukluk);
        const depth = Number.parseFloat(quake.derinlik);

        const magnitudeMatch = !Number.isFinite(magnitude) || magnitude >= minMagnitude;
        const depthMatch = !Number.isFinite(depth) || depth <= maxDepth;
        const cityMatch = !city || quake.sehir === city;

        return magnitudeMatch && depthMatch && cityMatch;
    });
};

window.Sismolog.applyFiltersAndRender = function applyFiltersAndRender() {
    const state = window.Sismolog.state;

    try {
        const filters = window.Sismolog.readFilters();
        state.filteredQuakes = window.Sismolog.filterQuakes(state.allQuakes, filters);
        state.currentPage = 1;

        window.Sismolog.renderPaginatedList();
        window.Sismolog.updateMap(state.filteredQuakes);

        if (typeof window.updateStatsUI === 'function') {
            window.updateStatsUI(state.filteredQuakes);
        }

        window.Sismolog.showFilterFeedback(state.filteredQuakes.length);
    } catch (error) {
        console.error('Filtreleme hatası:', error);
        window.Sismolog.showError('Filtreleme sırasında bir hata oluştu.');
    }
};

window.Sismolog.renderPaginatedList = function renderPaginatedList() {
    const state = window.Sismolog.state;
    const listBody = document.getElementById('quakeList');

    if (!listBody) {
        console.error('quakeList elementi bulunamadı');
        return;
    }

    listBody.innerHTML = '';

    const startIndex = (state.currentPage - 1) * state.itemsPerPage;
    const pageItems = state.filteredQuakes.slice(startIndex, startIndex + state.itemsPerPage);

    if (pageItems.length === 0) {
        listBody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500">Filtre kriterlerine uygun deprem bulunamadı.</td></tr>';
        window.Sismolog.updatePaginationControls();
        return;
    }

    pageItems.forEach((quake) => {
        if (!quake || typeof quake !== 'object') return;

        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors';
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                ${quake.tarih} ${quake.saat}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${window.Sismolog.getBgColorClass(Number.parseFloat(quake.buyukluk))}">
                    ${quake.buyukluk}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">${quake.derinlik} km</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">${quake.yer}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">${quake.sehir || '-'}</td>
        `;
        row.addEventListener('click', () => window.Sismolog.zoomToQuake(quake));
        listBody.appendChild(row);
    });

    window.Sismolog.updatePaginationControls();
};

window.Sismolog.updatePaginationControls = function updatePaginationControls() {
    const state = window.Sismolog.state;
    const totalPages = Math.ceil(state.filteredQuakes.length / state.itemsPerPage);
    const paginationInfo = document.getElementById('pagination-info');
    const prevPage = document.getElementById('prevPage');
    const nextPage = document.getElementById('nextPage');

    if (paginationInfo) {
        paginationInfo.textContent = totalPages > 0
            ? `Sayfa ${state.currentPage} / ${totalPages} (${state.filteredQuakes.length} deprem)`
            : 'Sonuç yok';
    }

    if (prevPage) prevPage.disabled = state.currentPage === 1;
    if (nextPage) nextPage.disabled = state.currentPage === totalPages || totalPages === 0;
};

window.Sismolog.changePage = function changePage(direction) {
    const state = window.Sismolog.state;
    const totalPages = Math.ceil(state.filteredQuakes.length / state.itemsPerPage);
    const newPage = state.currentPage + direction;

    if (newPage >= 1 && newPage <= totalPages) {
        state.currentPage = newPage;
        window.Sismolog.renderPaginatedList();
    }
};

window.Sismolog.populateCityFilter = function populateCityFilter(quakes) {
    const cityFilter = document.getElementById('cityFilter');
    if (!cityFilter || !Array.isArray(quakes)) return;

    const cities = [...new Set(quakes.map((q) => q.sehir).filter(Boolean))].sort();

    cityFilter.innerHTML = '<option value="">Tüm Şehirler</option>';
    cities.forEach((city) => {
        const option = document.createElement('option');
        option.value = city;
        option.textContent = city;
        cityFilter.appendChild(option);
    });
};

window.Sismolog.clearAllFilters = function clearAllFilters() {
    const get = window.Sismolog.getElement;

    const cityFilter = get('cityFilter');
    const magnitudeFilter = get('magnitudeFilter');
    const depthFilter = get('depthFilter');

    if (cityFilter) cityFilter.value = '';
    if (magnitudeFilter) {
        magnitudeFilter.value = '0';
        window.Sismolog.setStatus('magnitudeValue', '0.0');
    }
    if (depthFilter) {
        depthFilter.value = '100';
        window.Sismolog.setStatus('depthValue', '100');
    }

    window.Sismolog.applyFiltersAndRender();
};
