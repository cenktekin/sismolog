'use strict';

// Veri çekme, otomatik yenileme zamanlayıcısı ve kullanıcı tercihleri.

window.Sismolog = window.Sismolog || {};

window.Sismolog.fetchEarthquakes = function fetchEarthquakes() {
    const state = window.Sismolog.state;
    const apiUrl = `${window.location.origin}/api/v1/depremler`;
    const listBody = document.getElementById('quakeList');

    if (listBody) {
        listBody.innerHTML = '<tr><td colspan="5" class="text-center py-8 text-gray-500"><div class="animate-pulse">Deprem verileri yükleniyor, lütfen bekleyiniz...</div></td></tr>';
    }

    let indicator = document.getElementById('loading-indicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'loading-indicator';
        indicator.className = 'fixed top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        indicator.textContent = 'Veriler yükleniyor...';
        document.body.appendChild(indicator);
    }

    const removeIndicator = () => {
        const current = document.getElementById('loading-indicator');
        if (current) current.remove();
    };

    return fetch(apiUrl, {
        headers: { Accept: 'application/json' },
        credentials: 'same-origin',
        cache: 'no-store'
    })
        .then((response) => {
            removeIndicator();

            if (response.status === 429) {
                throw new Error('Çok fazla istek yapıldı. Lütfen bir süre sonra tekrar deneyin.');
            }
            if (!response.ok) {
                return response.text().then((body) => {
                    throw new Error(`Sunucu hatası (${response.status}): ${body.slice(0, 200)}`);
                });
            }
            return response.json();
        })
        .then((data) => {
            if (data && data.error) {
                throw new Error(data.error);
            }
            if (!Array.isArray(data)) {
                throw new Error('Sunucudan geçersiz veri formatı alındı.');
            }
            if (data.length === 0) {
                window.Sismolog.showError('Şu anda deprem verisi bulunamadı. Lütfen daha sonra tekrar deneyin.');
                return;
            }

            state.allQuakes = data;
            window.Sismolog.populateCityFilter(state.allQuakes);
            window.Sismolog.applyFiltersAndRender();
            window.Sismolog.updateNearestEarthquake();

            document.querySelectorAll('.error-message').forEach((element) => {
                element.style.display = 'none';
            });
        })
        .catch((error) => {
            removeIndicator();
            console.error('API çağrısı başarısız:', error);

            const message = error.message || 'Bilinmeyen bir hata oluştu.';
            window.Sismolog.showError(`Veri yüklenirken hata oluştu: ${message}`, 10000);

            if (listBody) {
                listBody.innerHTML = `
                <tr>
                    <td colspan="5" class="text-center py-12">
                        <div class="max-w-md mx-auto p-4 bg-red-50 rounded-lg">
                            <div class="text-red-600 font-bold mb-2">Hata!</div>
                            <p class="text-red-700 mb-4">${message}</p>
                            <button id="retry-fetch" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                                Tekrar Dene
                            </button>
                        </div>
                    </td>
                </tr>`;

                const retryButton = document.getElementById('retry-fetch');
                if (retryButton) {
                    retryButton.addEventListener('click', () => window.Sismolog.fetchEarthquakes());
                }
            }
        });
};

window.Sismolog.startUpdateTimer = function startUpdateTimer(immediate = false) {
    const state = window.Sismolog.state;

    if (state.updateInterval) {
        clearInterval(state.updateInterval);
        state.updateInterval = null;
    }

    state.countdown = immediate ? 1 : state.updateIntervalValue;
    window.Sismolog.setStatus('countdown', String(state.countdown));

    state.updateInterval = setInterval(window.Sismolog.updateCountdown, 1000);
};

window.Sismolog.updateCountdown = function updateCountdown() {
    const state = window.Sismolog.state;
    state.countdown -= 1;
    window.Sismolog.setStatus('countdown', String(state.countdown));

    if (state.countdown <= 0) {
        state.countdown = state.updateIntervalValue;
        window.Sismolog.fetchEarthquakes();
    }
};

window.Sismolog.handleAutoUpdateToggle = function handleAutoUpdateToggle() {
    const state = window.Sismolog.state;
    const autoUpdate = document.getElementById('autoUpdate');
    const updateFrequency = document.getElementById('updateFrequency');
    const countdownElement = document.getElementById('countdown');
    const countdownContainer = countdownElement ? countdownElement.parentElement.parentElement : null;
    const isEnabled = Boolean(autoUpdate && autoUpdate.checked);

    try {
        localStorage.setItem('autoUpdateEnabled', String(isEnabled));
    } catch (error) {
        console.warn('localStorage yazılamadı:', error.message);
    }

    if (isEnabled) {
        if (countdownContainer) countdownContainer.style.display = 'flex';
        if (updateFrequency) updateFrequency.disabled = false;
        window.Sismolog.startUpdateTimer();
    } else {
        if (countdownContainer) countdownContainer.style.display = 'none';
        if (updateFrequency) updateFrequency.disabled = true;
        if (state.updateInterval) {
            clearInterval(state.updateInterval);
            state.updateInterval = null;
        }
    }
};

window.Sismolog.handleUpdateFrequencyChange = function handleUpdateFrequencyChange() {
    const state = window.Sismolog.state;
    const updateFrequency = document.getElementById('updateFrequency');
    if (!updateFrequency) return;

    const parsed = Number.parseInt(updateFrequency.value, 10);
    if (!Number.isFinite(parsed)) return;

    state.updateIntervalValue = Math.max(parsed, 120);

    try {
        localStorage.setItem('updateInterval', String(state.updateIntervalValue));
    } catch (error) {
        console.warn('localStorage yazılamadı:', error.message);
    }

    const autoUpdate = document.getElementById('autoUpdate');
    if (autoUpdate && autoUpdate.checked) {
        window.Sismolog.startUpdateTimer();
    }
};

window.Sismolog.handleVisibilityChange = function handleVisibilityChange() {
    const state = window.Sismolog.state;
    const autoUpdate = document.getElementById('autoUpdate');

    if (document.hidden) {
        if (state.updateInterval) {
            clearInterval(state.updateInterval);
            state.updateInterval = null;
        }
        return;
    }

    if (autoUpdate && autoUpdate.checked) {
        window.Sismolog.startUpdateTimer(true);
    }
};

window.Sismolog.loadUserPreferences = function loadUserPreferences() {
    const state = window.Sismolog.state;
    const autoUpdate = document.getElementById('autoUpdate');
    const updateFrequency = document.getElementById('updateFrequency');

    let enabled = true;

    try {
        const savedPreference = localStorage.getItem('autoUpdateEnabled');
        if (savedPreference !== null) enabled = savedPreference === 'true';
    } catch (error) {
        console.warn('Tercih okunamadı:', error.message);
    }

    if (autoUpdate) autoUpdate.checked = enabled;

    try {
        const savedInterval = localStorage.getItem('updateInterval');
        if (savedInterval !== null) {
            const parsed = Number.parseInt(savedInterval, 10);
            if (Number.isFinite(parsed)) {
                state.updateIntervalValue = Math.max(parsed, 120);
            }
        }
    } catch (error) {
        console.warn('Tercih okunamadı:', error.message);
    }

    if (updateFrequency) updateFrequency.value = String(state.updateIntervalValue);

    window.Sismolog.handleAutoUpdateToggle();
};
