document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('audioPlayer');

    const LOCAL_TRACKS = [
        { id: 'local-1', title: 'Warriyo - Mortals [NCS Release]', artist: 'Warriyo', cover: 'covers/1.jpg', src: 'songs/1.mp3', durationLabel: '3:50', source: 'Локально', full: true },
        { id: 'local-2', title: 'Dr. Dre, Snoop Dogg - Still D.R.E.', artist: 'Dr. Dre, Snoop Dogg', cover: 'covers/2.jpg', src: 'songs/2.mp3', durationLabel: '4:28', source: 'Локально', full: true },
        { id: 'local-3', title: 'Hollywood Undead - Riot', artist: 'Hollywood Undead', cover: 'covers/3.jpg', src: 'songs/3.mp3', durationLabel: '3:47', source: 'Локально', full: true },
        { id: 'local-4', title: 'This Is Madness (God of War)', artist: 'God of War', cover: 'covers/4.jpg', src: 'songs/4.mp3', durationLabel: '4:20', source: 'Локально', full: true },
        { id: 'local-5', title: 'SOLO (YXNG BANE REMIX)', artist: 'Demi Lovato', cover: 'covers/5.jpg', src: 'songs/5.mp3', durationLabel: '3:41', source: 'Локально', full: true },
        { id: 'local-6', title: 'After Dark', artist: 'Mr.Kitty', cover: 'covers/6.jpg', src: 'songs/6.mp3', durationLabel: '4:19', source: 'Локально', full: true },
        { id: 'local-7', title: "Coolio - Gangsta's Paradise", artist: 'Coolio feat. L.V.', cover: 'covers/7.jpg', src: 'songs/7.mp3', durationLabel: '4:01', source: 'Локально', full: true },
        { id: 'local-8', title: "Beethoven - Fur Elise (Remix)", artist: 'Beethoven', cover: 'covers/8.jpg', src: 'songs/8.mp3', durationLabel: '2:23', source: 'Локально', full: true }
    ];

    const SEARCH_CHIPS = [
        'Kai Angel', '9mice', 'Платина', 'OG Buda', 'Friendly Thug 52 NGG', 'Heronwater',
        'Big Baby Tape', 'Kizaru', 'Morgenshtern', 'Скриптонит', 'Boulevard Depo',
        'Поп', 'Рэп', 'Хип-хоп', 'Фонк', 'Рок', 'Электроника', 'K-pop', 'Инди', 'Джаз', 'Lo-fi', 'Классика', 'Шансон', 'Танцевальное'
    ];

    const MIXES = [
        { title: 'Русский рэп', query: 'русский рэп kai angel platina 9mice', icon: 'fa-microphone', bg: 'linear-gradient(135deg,#ff6a00,#ff3355)' },
        { title: 'Фонк', query: 'phonk drift', icon: 'fa-car', bg: 'linear-gradient(135deg,#6a00ff,#00d4ff)' },
        { title: 'Поп-хиты', query: 'pop hits 2025', icon: 'fa-star', bg: 'linear-gradient(135deg,#ffcc00,#ff6a00)' },
        { title: 'Хип-хоп', query: 'hip hop rap trap', icon: 'fa-headphones', bg: 'linear-gradient(135deg,#333,#111)' },
        { title: 'Электроника', query: 'electronic edm house', icon: 'fa-bolt', bg: 'linear-gradient(135deg,#00c6ff,#0072ff)' },
        { title: 'Рок', query: 'rock alternative', icon: 'fa-guitar', bg: 'linear-gradient(135deg,#b31217,#2b0000)' },
        { title: 'K-pop', query: 'kpop korean pop', icon: 'fa-heart', bg: 'linear-gradient(135deg,#ff5f9e,#ff9966)' },
        { title: 'Спокойное', query: 'lofi chill ambient', icon: 'fa-moon', bg: 'linear-gradient(135deg,#2c3e50,#4ca1af)' },
        { title: 'В машину', query: 'driving bass music', icon: 'fa-road', bg: 'linear-gradient(135deg,#232526,#414345)' },
        { title: 'Для тренировки', query: 'workout gym motivation', icon: 'fa-dumbbell', bg: 'linear-gradient(135deg,#11998e,#38ef7d)' },
        { title: 'Инди', query: 'indie alternative', icon: 'fa-leaf', bg: 'linear-gradient(135deg,#56ab2f,#a8e063)' },
        { title: 'Классика', query: 'classical piano orchestra', icon: 'fa-music', bg: 'linear-gradient(135deg,#8e2de2,#4a00e0)' }
    ];

    const els = {
        navItems: document.querySelectorAll('.nav-item'),
        mobileNavItems: document.querySelectorAll('.mobile-nav-item'),
        pageTitle: document.getElementById('pageTitle'),
        homeSection: document.getElementById('homeSection'),
        searchSection: document.getElementById('searchSection'),
        waveSection: document.getElementById('waveSection'),
        collectionSection: document.getElementById('collectionSection'),
        localTracksList: document.getElementById('localTracksList'),
        localTracksList2: document.getElementById('localTracksList2'),
        chartList: document.getElementById('chartList'),
        mixGrid: document.getElementById('mixGrid'),
        searchResults: document.getElementById('searchResults'),
        favoritesList: document.getElementById('favoritesList'),
        historyList: document.getElementById('historyList'),
        waveQueue: document.getElementById('waveQueue'),
        searchInput: document.getElementById('searchInput'),
        searchBtn: document.getElementById('searchBtn'),
        heroSearchBtn: document.getElementById('heroSearchBtn'),
        refreshChartBtn: document.getElementById('refreshChartBtn'),
        searchStatus: document.getElementById('searchStatus'),
        searchHint: document.getElementById('searchHint'),
        searchMode: document.getElementById('searchMode'),
        searchChips: document.getElementById('searchChips'),
        waveSeeds: document.getElementById('waveSeeds'),
        loadMoreWrap: document.getElementById('loadMoreWrap'),
        loadMoreBtn: document.getElementById('loadMoreBtn'),
        playerCoverImg: document.getElementById('playerCoverImg'),
        playerTitle: document.getElementById('playerTitle'),
        playerArtist: document.getElementById('playerArtist'),
        playPauseBtn: document.getElementById('playPauseBtn'),
        prevBtn: document.getElementById('prevBtn'),
        nextBtn: document.getElementById('nextBtn'),
        playerLikeBtn: document.getElementById('playerLikeBtn'),
        progress: document.getElementById('progress'),
        progressBar: document.getElementById('progressBar'),
        currentTime: document.getElementById('currentTime'),
        duration: document.getElementById('duration'),
        volumeSlider: document.getElementById('volumeSlider'),
        volumeIcon: document.getElementById('volumeIcon'),
        toast: document.getElementById('toast'),
        expandedPlayer: document.getElementById('expandedPlayer'),
        expandPlayerBtn: document.getElementById('expandPlayerBtn'),
        closeExpandedBtn: document.getElementById('closeExpandedBtn'),
        expandedCover: document.getElementById('expandedCover'),
        expandedTitle: document.getElementById('expandedTitle'),
        expandedArtist: document.getElementById('expandedArtist'),
        expandedPlayPauseBtn: document.getElementById('expandedPlayPauseBtn'),
        expandedPrevBtn: document.getElementById('expandedPrevBtn'),
        expandedNextBtn: document.getElementById('expandedNextBtn'),
        expandedLikeBtn: document.getElementById('expandedLikeBtn'),
        expandedWaveBtn: document.getElementById('expandedWaveBtn'),
        expandedProgress: document.getElementById('expandedProgress'),
        expandedProgressBar: document.getElementById('expandedProgressBar'),
        expandedCurrentTime: document.getElementById('expandedCurrentTime'),
        expandedDuration: document.getElementById('expandedDuration'),
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebarOverlay'),
        sidebarClose: document.getElementById('sidebarClose'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileSearchBtn: document.getElementById('mobileSearchBtn'),
        startWaveBtn: document.getElementById('startWaveBtn'),
        waveByLikesBtn: document.getElementById('waveByLikesBtn'),
        wavePlayBtn: document.getElementById('wavePlayBtn'),
        waveNextBtn: document.getElementById('waveNextBtn'),
        waveLikeBtn: document.getElementById('waveLikeBtn'),
        waveCover: document.getElementById('waveCover'),
        waveTrackTitle: document.getElementById('waveTrackTitle'),
        waveTrackArtist: document.getElementById('waveTrackArtist')
    };

    let currentTrack = null;
    let currentQueue = [...LOCAL_TRACKS];
    let isPlaying = false;
    let favorites = loadJsonMap('nova_favorites');
    let history = loadJsonArray('nova_history');
    let audiusHosts = [];
    let audiusHostIndex = 0;
    let pipedHosts = ['https://pipedapi.kavin.rocks', 'https://pipedapi.adminforge.de', 'https://api.piped.private.coffee', 'https://pipedapi.in.projectsegfau.lt', 'https://pipedapi.leptons.xyz'];
    let pipedHostIndex = 0;
    let sourceMode = localStorage.getItem('nova_source_mode') || 'all';
    let searchState = { query: '', offsets: { audius: 0, ia: 1, hearthis: 0, deezer: 0, itunes: 0, piped: 0 }, tracks: [], loading: false };
    let chartLoaded = false;
    let wave = { active: false, seed: 'Поп-хиты', queue: [], index: 0, loading: false, failCount: 0 };

    function isYtMode() { return sourceMode === 'yt'; }
    function updateModeUI() {
        if (els.searchMode) {
            els.searchMode.querySelectorAll('.mode-btn').forEach(btn => btn.classList.toggle('active', btn.getAttribute('data-mode') === sourceMode));
        }
        if (els.searchHint) {
            els.searchHint.textContent = isYtMode()
                ? 'Режим: только YouTube Music. Поиск и воспроизведение идут через доступные Piped-инстансы (полные треки).'
                : 'Поиск по открытым каталогам (Audius, HearThis, Internet Archive, YT Music, Deezer, iTunes). Превью автоматически пытаются замениться на полный трек из доступных источников.';
        }
    }
    function setSourceMode(mode) {
        const next = mode === 'yt' ? 'yt' : 'all';
        if (next === sourceMode) return;
        sourceMode = next;
        try { localStorage.setItem('nova_source_mode', sourceMode); } catch (_) {}
        updateModeUI();
        chartLoaded = false;
        if (els.chartList) els.chartList._lastTracks = [];
        if (els.homeSection && els.homeSection.style.display !== 'none') loadChart(true);
        if (searchState.query && els.searchSection && els.searchSection.style.display !== 'none') searchOnline(searchState.query);
        showToast(isYtMode() ? 'Режим: только YouTube Music' : 'Режим: все источники');
    }

    audio.volume = 0.7;
    if (els.volumeSlider) els.volumeSlider.value = 70;

    function esc(text) { const d = document.createElement('div'); d.textContent = text == null ? '' : String(text); return d.innerHTML; }
    function formatTime(s) { if (!s || isNaN(s)) return '0:00'; s = Math.max(0, Math.floor(s)); const m = Math.floor(s / 60), sec = s % 60; return m + ':' + (sec < 10 ? '0' : '') + sec; }
    function showToast(msg) { if (!els.toast) return; els.toast.textContent = msg; els.toast.classList.add('show'); clearTimeout(showToast._t); showToast._t = setTimeout(() => els.toast.classList.remove('show'), 2600); }
    function loadJsonMap(k) { try { const r = localStorage.getItem(k); if (!r) return new Map(); return new Map(JSON.parse(r).map(t => [t.id, t])); } catch (_) { return new Map(); } }
    function saveJsonMap(k, m) { try { localStorage.setItem(k, JSON.stringify(Array.from(m.values()))); } catch (_) {} }
    function loadJsonArray(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : []; } catch (_) { return []; } }
    function saveJsonArray(k, a) { try { localStorage.setItem(k, JSON.stringify(a.slice(0, 80))); } catch (_) {} }

    function isFavorite(id) { return favorites.has(id); }
    function toggleFavorite(track) {
        if (!track) return;
        if (favorites.has(track.id)) { favorites.delete(track.id); showToast('Удалено из коллекции'); }
        else { favorites.set(track.id, track); showToast('Добавлено в коллекцию'); }
        saveJsonMap('nova_favorites', favorites);
        updateLikeButtons(); renderFavorites(); rerenderVisibleLists(); updateWaveLikeBtn();
    }
    function addToHistory(track) {
        if (!track) return;
        history = [track, ...history.filter(t => t.id !== track.id)].slice(0, 80);
        saveJsonArray('nova_history', history);
        if (els.collectionSection && els.collectionSection.style.display !== 'none') renderHistory();
    }

    function rerenderVisibleLists() {
        if (els.searchSection && els.searchSection.style.display !== 'none' && els.searchResults && els.searchResults._lastTracks) renderTracks(els.searchResults._lastTracks, els.searchResults);
        if (els.homeSection && els.homeSection.style.display !== 'none' && els.chartList && els.chartList._lastTracks) renderChart(els.chartList._lastTracks);
        if (els.waveSection && els.waveSection.style.display !== 'none' && els.waveQueue && els.waveQueue._lastTracks) renderTracks(els.waveQueue._lastTracks, els.waveQueue);
    }

    function trackCard(track) {
        const liked = isFavorite(track.id);
        const cover = track.cover || 'https://via.placeholder.com/300x300/1a1a1a/777777?text=%E2%99%AA';
        const badge = track.full ? '' : (track.needsResolve ? '<span class="badge-preview">найти целиком</span>' : '<span class="badge-preview">превью</span>');
        return '<div class="track-card" data-id="' + esc(track.id) + '">' +
            '<div class="track-cover-wrapper"><img src="' + esc(cover) + '" alt="" loading="lazy" decoding="async">' +
            '<div class="play-overlay"><i class="fas fa-play"></i></div>' +
            '<button class="like-badge ' + (liked ? 'liked' : '') + '" data-like-id="' + esc(track.id) + '"><i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i></button></div>' +
            '<div class="track-info"><h3 title="' + esc(track.title) + '">' + esc(track.title) + '</h3><p title="' + esc(track.artist) + '">' + esc(track.artist) + '</p></div>' +
            '<div class="track-meta"><span>' + esc(track.source || '') + '</span>' + (badge || '<span>' + esc(track.durationLabel || '') + '</span>') + '</div></div>';
    }

    function renderTracks(list, container) {
        if (!container) return;
        container._lastTracks = list || [];
        const full = container._lastTracks;
        if (!full.length) { container.innerHTML = '<div class="empty-state"><i class="fas fa-music"></i><h3>Ничего не найдено</h3><p>Попробуйте другой запрос.</p></div>'; return; }
        container.innerHTML = full.map(trackCard).join('');
        container.querySelectorAll('.track-card').forEach(card => {
            const id = card.getAttribute('data-id');
            card.addEventListener('click', e => { if (e.target.closest('.like-badge')) return; const t = full.find(x => x.id === id); if (t) playTrack(t, full); });
        });
        container.querySelectorAll('.like-badge').forEach(btn => {
            btn.addEventListener('click', e => { e.stopPropagation(); const id = btn.getAttribute('data-like-id'); const t = full.find(x => x.id === id) || favorites.get(id) || history.find(x => x.id === id); if (t) toggleFavorite(t); });
        });
    }

    function renderChart(list) {
        if (!els.chartList) return;
        els.chartList._lastTracks = list || [];
        const full = els.chartList._lastTracks;
        if (!full.length) { els.chartList.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><h3>Чарт недоступен</h3><p>Попробуйте обновить или открыть поиск.</p></div>'; return; }
        els.chartList.innerHTML = full.slice(0, 20).map((t, i) => {
            const cover = t.cover || 'https://via.placeholder.com/80x80/1a1a1a/777?text=%E2%99%AA';
            return '<div class="chart-item" data-id="' + esc(t.id) + '"><div class="chart-pos">' + (i + 1) + '</div>' +
                '<div class="chart-cover"><img src="' + esc(cover) + '" alt="" loading="lazy"></div>' +
                '<div class="chart-info"><h4>' + esc(t.title) + '</h4><p>' + esc(t.artist) + '</p></div>' +
                '<div class="chart-meta">' + esc(t.durationLabel || '') + '</div></div>';
        }).join('');
        els.chartList.querySelectorAll('.chart-item').forEach(el => {
            el.addEventListener('click', () => { const t = full.find(x => x.id === el.getAttribute('data-id')); if (t) playTrack(t, full); });
        });
    }

    function renderFavorites() {
        const list = Array.from(favorites.values());
        if (els.favoritesList) { if (!list.length) { els.favoritesList._lastTracks = []; els.favoritesList.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><h3>В коллекции пусто</h3><p>Нажмите на сердечко у трека.</p></div>'; } else renderTracks(list, els.favoritesList); }
    }
    function renderHistory() {
        if (!els.historyList) return;
        if (!history.length) { els.historyList._lastTracks = []; els.historyList.innerHTML = '<div class="empty-state"><i class="fas fa-clock-rotate-left"></i><h3>История пуста</h3><p>Слушайте треки, и они появятся здесь.</p></div>'; }
        else renderTracks(history, els.historyList);
    }
    function renderLocal() { if (els.localTracksList) renderTracks(LOCAL_TRACKS, els.localTracksList); if (els.localTracksList2) renderTracks(LOCAL_TRACKS, els.localTracksList2); }

    function updateLikeButtons() {
        if (!currentTrack) return;
        const liked = isFavorite(currentTrack.id);
        if (els.playerLikeBtn) { els.playerLikeBtn.classList.toggle('liked', liked); els.playerLikeBtn.innerHTML = '<i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i>'; }
        if (els.expandedLikeBtn) els.expandedLikeBtn.innerHTML = '<i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i>';
    }
    function updateWaveLikeBtn() {
        if (!els.waveLikeBtn) return;
        const t = (wave.queue[wave.index] || currentTrack);
        const liked = t && isFavorite(t.id);
        els.waveLikeBtn.innerHTML = '<i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i> ' + (liked ? 'В коллекции' : 'Нравится');
    }

    function setPlayerUI(track) {
        const cover = track.cover || 'https://via.placeholder.com/300x300/1a1a1a/777777?text=%E2%99%AA';
        if (els.playerCoverImg) els.playerCoverImg.src = cover;
        if (els.playerTitle) els.playerTitle.textContent = track.title || 'Без названия';
        if (els.playerArtist) els.playerArtist.textContent = track.artist || 'Неизвестный исполнитель';
        if (els.expandedCover) els.expandedCover.src = cover;
        if (els.expandedTitle) els.expandedTitle.textContent = track.title || 'Без названия';
        if (els.expandedArtist) els.expandedArtist.textContent = track.artist || 'Неизвестный исполнитель';
        updateLikeButtons();
        if (wave.active) updateWaveStage(track);
    }

    let playRequest = 0;
    let waveAdvanceTimer = null;
    function clearWaveAdvance() { if (waveAdvanceTimer) { clearTimeout(waveAdvanceTimer); waveAdvanceTimer = null; } }
    function scheduleWaveAdvance(req, trackId, delay) {
        if (!wave.active) return;
        clearWaveAdvance();
        waveAdvanceTimer = setTimeout(() => {
            waveAdvanceTimer = null;
            if (!wave.active) return;
            if (req !== playRequest) return;
            if (currentTrack && trackId && currentTrack.id !== trackId) return;
            waveNext();
        }, delay == null ? 450 : delay);
    }

    async function playTrack(track, queue, fromWave) {
        if (!track) return;
        const req = ++playRequest;
        clearWaveAdvance();
        const originalSrc = track.src;
        currentTrack = track;
        if (Array.isArray(queue) && queue.length) currentQueue = queue;
        wave.failCount = 0;

        if (track.needsResolve && !track.full) {
            setPlayerUI(track);
            showToast(track.resolveType === 'piped' || isYtMode() ? 'Загружаю трек...' : 'Ищу полный трек в других источниках...');
            const resolved = await resolveFullTrack(track);
            if (req !== playRequest) return;
            if (resolved && resolved.full && resolved.src) {
                rerenderVisibleLists();
            } else if (!isYtMode() && (track.previewSrc || originalSrc)) {
                track.src = track.previewSrc || originalSrc;
                track.needsResolve = false;
                track.full = false;
                showToast('Полная версия не найдена, играю превью');
                rerenderVisibleLists();
            } else {
                showToast(isYtMode() ? 'Не найдено в YouTube Music, пропускаю' : 'Полная версия не найдена, пропускаю');
                rerenderVisibleLists();
                if ((wave.active || fromWave) && req === playRequest) scheduleWaveAdvance(req, track.id, 350);
                return;
            }
        }

        if (!track.src) { showToast('Нет аудио для этого трека'); if ((wave.active || fromWave) && req === playRequest) scheduleWaveAdvance(req, track.id, 350); return; }

        setPlayerUI(track);
        try { audio.pause(); } catch (_) {}
        audio.src = track.src;
        addToHistory(track);
        audio.play().then(() => {
            if (req !== playRequest) return;
            isPlaying = true;
            wave.failCount = 0;
            updatePlayButtons();
        }).catch(() => {
            if (req !== playRequest) return;
            isPlaying = false;
            updatePlayButtons();
            if (!isYtMode() && track.previewSrc && track.src !== track.previewSrc && !track._previewTried) {
                track._previewTried = true;
                track.src = track.previewSrc;
                track.full = false;
                track.needsResolve = false;
                showToast('Не удалось воспроизвести, играю превью');
                setPlayerUI(track);
                audio.src = track.src;
                audio.play().then(() => { if (req !== playRequest) return; isPlaying = true; wave.failCount = 0; updatePlayButtons(); }).catch(() => {
                    if (req !== playRequest) return;
                    if (wave.active || fromWave) { wave.failCount = (wave.failCount || 0) + 1; showToast('Источник недоступен, пробую следующий...'); scheduleWaveAdvance(req, track.id, 350); }
                    else showToast('Не удалось воспроизвести трек');
                });
                return;
            }
            if (wave.active || fromWave) {
                wave.failCount = (wave.failCount || 0) + 1;
                showToast('Источник недоступен, пробую следующий...');
                scheduleWaveAdvance(req, track.id, 350);
            } else {
                showToast('Не удалось воспроизвести трек');
            }
        });

        if (wave.active) {
            const idx = wave.queue.findIndex(t => t.id === track.id);
            if (idx >= 0) wave.index = idx;
            renderTracks(wave.queue, els.waveQueue);
            ensureWaveAhead();
        }
    }

    function updatePlayButtons() {
        const icon = isPlaying ? 'fa-pause' : 'fa-play';
        if (els.playPauseBtn) els.playPauseBtn.innerHTML = '<i class="fas ' + icon + '"></i>';
        if (els.expandedPlayPauseBtn) els.expandedPlayPauseBtn.innerHTML = '<i class="fas ' + icon + '"></i>';
        if (els.wavePlayBtn) els.wavePlayBtn.innerHTML = '<i class="fas ' + icon + '"></i> ' + (wave.active ? (isPlaying ? 'Пауза' : 'Продолжить') : 'Запустить волну');
    }
    function togglePlay() {
        if (!currentTrack) { if (wave.active && wave.queue.length) playTrack(wave.queue[wave.index] || wave.queue[0], wave.queue, true); else playTrack(LOCAL_TRACKS[0], LOCAL_TRACKS); return; }
        if (isPlaying) { audio.pause(); isPlaying = false; } else { audio.play().catch(() => showToast('Ошибка воспроизведения')); isPlaying = true; }
        updatePlayButtons();
    }
    function playByOffset(offset) {
        if (wave.active && currentQueue === wave.queue) { if (offset > 0) waveNext(); else wavePrev(); return; }
        if (!currentTrack || !currentQueue.length) return;
        const idx = currentQueue.findIndex(t => t.id === currentTrack.id);
        if (idx === -1) return;
        playTrack(currentQueue[(idx + offset + currentQueue.length) % currentQueue.length], currentQueue);
    }

    function updateProgressUI(current, total) {
        const pct = total ? (current / total) * 100 : 0;
        if (els.progress) els.progress.style.width = pct + '%';
        if (els.expandedProgress) els.expandedProgress.style.width = pct + '%';
        const ct = formatTime(current), dt = formatTime(total);
        if (els.currentTime) els.currentTime.textContent = ct; if (els.duration) els.duration.textContent = dt;
        if (els.expandedCurrentTime) els.expandedCurrentTime.textContent = ct; if (els.expandedDuration) els.expandedDuration.textContent = dt;
    }
    function seekFromEvent(bar, e) { if (!bar || !audio.duration) return; const rect = bar.getBoundingClientRect(); const x = (e.touches ? e.touches[0].clientX : e.clientX); audio.currentTime = Math.min(Math.max((x - rect.left) / rect.width, 0), 1) * audio.duration; }
    function updateVolumeIcon(v) { if (!els.volumeIcon) return; els.volumeIcon.className = v === 0 ? 'fas fa-volume-mute' : (v < 0.5 ? 'fas fa-volume-down' : 'fas fa-volume-up'); }

    function openSidebar(open) { if (!els.sidebar) return; els.sidebar.classList.toggle('open', open); if (els.sidebarOverlay) els.sidebarOverlay.classList.toggle('show', open); }
    function showPage(page) {
        ['home', 'search', 'wave', 'collection'].forEach(p => { const el = els[p + 'Section']; if (el) el.style.display = p === page ? 'block' : 'none'; });
        const titles = { home: 'Главная', search: 'Поиск', wave: 'Моя волна', collection: 'Коллекция' };
        if (els.pageTitle) els.pageTitle.textContent = titles[page] || 'Главная';
        els.navItems.forEach(i => i.classList.toggle('active', i.dataset.page === page));
        els.mobileNavItems.forEach(i => i.classList.toggle('active', i.dataset.page === page));
        if (page === 'home') { renderLocal(); ensureChart(); renderMixes(); }
        if (page === 'collection') { renderFavorites(); renderHistory(); renderLocal(); }
        if (page === 'wave') { renderWaveSeeds(); renderTracks(wave.queue, els.waveQueue); updateWaveStage(wave.queue[wave.index] || currentTrack); }
        if (page === 'search' && els.searchInput) setTimeout(() => els.searchInput.focus(), 50);
        openSidebar(false);
        const mc = document.getElementById('mainContent'); if (mc) mc.scrollTop = 0;
    }

    async function fetchJson(url, timeoutMs) {
        const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), timeoutMs || 12000);
        try { const res = await fetch(url, { signal: ctrl.signal }); if (!res.ok) throw new Error('HTTP ' + res.status); return await res.json(); }
        finally { clearTimeout(t); }
    }
    function jsonp(url, timeoutMs) {
        return new Promise((resolve, reject) => {
            const cb = 'cb_' + Date.now() + '_' + Math.floor(Math.random() * 1e6);
            const s = document.createElement('script'); let done = false;
            const cleanup = () => { if (done) return; done = true; try { delete window[cb]; } catch (_) { window[cb] = undefined; } if (s.parentNode) s.parentNode.removeChild(s); };
            window[cb] = d => { cleanup(); resolve(d); };
            s.onerror = () => { cleanup(); reject(new Error('jsonp')); };
            s.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + cb;
            document.body.appendChild(s);
            setTimeout(() => { if (!done) { cleanup(); reject(new Error('timeout')); } }, timeoutMs || 12000);
        });
    }

    async function getAudiusHosts() {
        if (audiusHosts.length) return audiusHosts;
        try { const data = await fetchJson('https://api.audius.co', 8000); if (data && Array.isArray(data.data)) audiusHosts = data.data.map(h => h.replace(/\/$/, '')); } catch (_) {}
        if (!audiusHosts.length) audiusHosts = ['https://discoveryprovider.audius.co', 'https://discoveryprovider2.audius.co', 'https://discoveryprovider3.audius.co'];
        return audiusHosts;
    }
    async function audiusRequest(path) {
        const hosts = await getAudiusHosts();
        for (let i = 0; i < Math.min(hosts.length, 5); i++) {
            const host = hosts[(audiusHostIndex + i) % hosts.length];
            try { const data = await fetchJson(host + path, 12000); audiusHostIndex = (audiusHostIndex + i) % hosts.length; return { host, data }; } catch (_) {}
        }
        throw new Error('Audius unavailable');
    }
    function mapAudius(list, host) {
        return (list || []).map(item => {
            const art = item.artwork || {};
            const cover = art['480x480'] || art['1000x1000'] || art['150x150'] || (item.user && item.user.profile_picture && (item.user.profile_picture['480x480'] || item.user.profile_picture['150x150'])) || '';
            return { id: 'audius-' + item.id, title: item.title || 'Без названия', artist: (item.user && item.user.name) ? item.user.name : 'Неизвестный исполнитель', cover, src: host + '/v1/tracks/' + encodeURIComponent(item.id) + '/stream?app_name=NovaSound', durationLabel: item.duration ? formatTime(item.duration) : '', source: 'Audius', full: true };
        }).filter(t => t.src);
    }
    async function searchAudius(query, limit, offset) {
        const lim = limit || 40, off = offset || 0;
        const path = query ? '/v1/tracks/search?query=' + encodeURIComponent(query) + '&app_name=NovaSound&limit=' + lim + '&offset=' + off
            : '/v1/tracks/trending?app_name=NovaSound&limit=' + lim + '&offset=' + off + '&time=week';
        const { host, data } = await audiusRequest(path);
        return mapAudius((data && data.data) ? data.data : [], host);
    }

    async function searchIA(query, page, rows) {
        const q = encodeURIComponent('(' + query + ') AND mediatype:(audio) AND (format:(VBR MP3) OR format:(MP3) OR format:(128Kbps MP3))');
        const data = await fetchJson('https://archive.org/advancedsearch.php?q=' + q + '&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=' + (rows || 20) + '&page=' + (page || 1) + '&output=json', 15000);
        const docs = ((data && data.response && data.response.docs) || []).slice(0, 12);
        const metas = await Promise.allSettled(docs.map(d => fetchJson('https://archive.org/metadata/' + encodeURIComponent(d.identifier), 10000)));
        const tracks = [];
        metas.forEach((res, i) => {
            if (res.status !== 'fulfilled') return; const meta = res.value; const files = (meta && meta.files) || [];
            const mp3 = files.find(f => /mp3/i.test(f.format || '') || /\.mp3$/i.test(f.name || '')); if (!mp3) return;
            const d = docs[i];
            tracks.push({ id: 'ia-' + d.identifier, title: d.title || (meta.metadata && meta.metadata.title) || 'Без названия', artist: d.creator || (meta.metadata && meta.metadata.creator) || 'Internet Archive', cover: 'https://archive.org/services/img/' + encodeURIComponent(d.identifier), src: 'https://archive.org/download/' + encodeURIComponent(d.identifier) + '/' + encodeURIComponent(mp3.name), durationLabel: mp3.length && !isNaN(+mp3.length) ? formatTime(+mp3.length) : '', source: 'Archive', full: true });
        });
        return tracks;
    }

    async function searchHearThis(query, page) {
        const p = page || 1;
        const data = await fetchJson('https://api-v2.hearthis.at/search/?t=' + encodeURIComponent(query) + '&page=' + p + '&count=20', 12000);
        const list = Array.isArray(data) ? data : [];
        return list.map(t => {
            const src = t.stream_url || t.preview_url || '';
            return { id: 'ht-' + t.id, title: t.title || 'Без названия', artist: (t.user && t.user.username) ? t.user.username : 'HearThis', cover: t.artwork_url || t.thumb || '', src, durationLabel: t.duration ? formatTime(+t.duration) : '', source: 'HearThis', full: !!t.stream_url };
        }).filter(t => t.src);
    }

    async function pipedRequest(path) {
        for (let i = 0; i < pipedHosts.length; i++) {
            const host = pipedHosts[(pipedHostIndex + i) % pipedHosts.length];
            try {
                const data = await fetchJson(host + path, 12000);
                pipedHostIndex = (pipedHostIndex + i) % pipedHosts.length;
                return { host, data };
            } catch (_) {}
        }
        throw new Error('Piped unavailable');
    }

    async function resolvePipedStream(videoId) {
        for (let i = 0; i < pipedHosts.length; i++) {
            const host = pipedHosts[(pipedHostIndex + i) % pipedHosts.length];
            try {
                const data = await fetchJson(host + '/streams/' + encodeURIComponent(videoId), 12000);
                const streams = (data && (data.audioStreams || data.audio_streams)) || [];
                if (!streams.length) continue;
                const m4a = streams.filter(s => /mp4|m4a/i.test(s.mimeType || s.mime_type || s.format || ''));
                const pick = (m4a.length ? m4a : streams).slice().sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))[0];
                const url = pick && (pick.url || pick.uri);
                if (url) { pipedHostIndex = (pipedHostIndex + i) % pipedHosts.length; return { url, duration: data.duration || 0 }; }
            } catch (_) {}
        }
        return null;
    }

    async function searchPiped(query, offset) {
        try {
            const q = String(query || '').trim();
            if (!q) return [];
            const { data } = await pipedRequest('/search?q=' + encodeURIComponent(q) + '&filter=music_songs');
            const items = (data && (data.items || data)) || [];
            const list = Array.isArray(items) ? items : [];
            const start = Math.max(0, (offset || 0));
            return list.slice(start, start + 20).map(it => {
                const vid = (it.url || '').replace('/watch?v=', '').split('&')[0] || it.id || '';
                if (!vid) return null;
                const duration = it.duration && it.duration > 0 ? it.duration : 0;
                return {
                    id: 'piped-' + vid,
                    pipedId: vid,
                    title: it.title || 'Без названия',
                    artist: it.uploaderName || it.uploader || 'YouTube Music',
                    cover: it.thumbnail || '',
                    src: '',
                    previewSrc: '',
                    durationLabel: duration ? formatTime(duration) : '',
                    originalDuration: duration,
                    source: 'YT Music',
                    full: false,
                    needsResolve: true,
                    resolveType: 'piped'
                };
            }).filter(Boolean);
        } catch (_) { return []; }
    }

    async function searchDeezer(query, offset) {
        const off = offset || 0;
        const data = await jsonp('https://api.deezer.com/search?q=' + encodeURIComponent(query) + '&limit=25&index=' + off + '&output=jsonp', 12000);
        const list = (data && data.data) ? data.data : [];
        return list.map(t => ({
            id: 'dz-' + t.id, title: t.title || 'Без названия', artist: (t.artist && t.artist.name) ? t.artist.name : 'Deezer',
            cover: (t.album && (t.album.cover_big || t.album.cover_medium || t.album.cover)) || '',
            previewSrc: t.preview || '',
            src: t.preview || '',
            durationLabel: t.duration ? formatTime(t.duration) : '0:30',
            originalDuration: t.duration || 0,
            source: 'Deezer', full: false, needsResolve: true
        })).filter(t => t.src);
    }

    async function searchItunes(query, offset) {
        const off = offset || 0;
        const data = await fetchJson('https://itunes.apple.com/search?term=' + encodeURIComponent(query) + '&media=music&entity=song&limit=25&offset=' + off, 12000);
        const list = (data && data.results) ? data.results : [];
        return list.map(t => ({
            id: 'it-' + t.trackId, title: t.trackName || 'Без названия', artist: t.artistName || 'iTunes',
            cover: (t.artworkUrl100 || '').replace('100x100bb', '300x300bb'),
            previewSrc: t.previewUrl || '',
            src: t.previewUrl || '',
            durationLabel: t.trackTimeMillis ? formatTime(t.trackTimeMillis / 1000) : '0:30',
            originalDuration: t.trackTimeMillis ? Math.round(t.trackTimeMillis / 1000) : 0,
            source: 'iTunes', full: false, needsResolve: true
        })).filter(t => t.src);
    }

    function normalizeTitle(s) {
        return String(s || '').toLowerCase().replace(/\(.*?\)|\[.*?\]/g, ' ').replace(/feat\.?|ft\.?/g, ' ').replace(/[^a-zа-яё0-9\s]/gi, ' ').replace(/\s+/g, ' ').trim();
    }
    function titleMatches(a, b) {
        const na = normalizeTitle(a), nb = normalizeTitle(b);
        if (!na || !nb) return false;
        return na === nb || na.indexOf(nb) >= 0 || nb.indexOf(na) >= 0;
    }
    function dedupe(tracks) {
        const seen = new Set(), out = [];
        tracks.forEach(t => {
            const k = normalizeTitle(t.title) + '|' + normalizeTitle(t.artist);
            const k2 = t.id;
            if (!k.trim() || k === '|') { if (seen.has(k2)) return; seen.add(k2); out.push(t); return; }
            if (seen.has(k) || seen.has(k2)) return; seen.add(k); seen.add(k2); out.push(t);
        });
        return out;
    }

    async function resolveFullTrack(track) {
        if (!track || track.full || track.resolving) return track;
        track.resolving = true;
        const q = ((track.artist || '') + ' ' + (track.title || '')).trim();
        try {
            if (isYtMode()) {
                if (track.pipedId) {
                    const s = await resolvePipedStream(track.pipedId);
                    if (s && s.url) {
                        track.src = s.url;
                        track.full = true;
                        track.needsResolve = false;
                        track.source = 'YT Music';
                        if (s.duration) track.durationLabel = formatTime(s.duration);
                    }
                } else {
                    const piped = await searchPiped(q, 0).catch(() => []);
                    const p = piped.find(c => c && titleMatches(c.title, track.title));
                    if (p && p.pipedId) {
                        const s = await resolvePipedStream(p.pipedId);
                        if (s && s.url) {
                            track.originalSource = track.originalSource || track.source;
                            track.src = s.url;
                            track.full = true;
                            track.needsResolve = false;
                            if (!track.cover || /placeholder/.test(track.cover)) track.cover = p.cover || track.cover;
                            if (s.duration) track.durationLabel = formatTime(s.duration); else if (p.durationLabel) track.durationLabel = p.durationLabel;
                            track.source = (track.originalSource || '') + ' → YT Music';
                            track.resolvedFrom = 'YT Music';
                        }
                    }
                }
                track.resolving = false;
                return track;
            }

            if (track.resolveType === 'piped' && track.pipedId) {
                const s = await resolvePipedStream(track.pipedId);
                if (s && s.url) {
                    track.src = s.url;
                    track.full = true;
                    track.needsResolve = false;
                    track.source = 'YT Music';
                    if (s.duration) track.durationLabel = formatTime(s.duration);
                    track.resolving = false;
                    return track;
                }
            }

            const tasks = [
                searchAudius(q, 12, 0).catch(() => []),
                searchHearThis(q, 1).catch(() => []),
                searchIA(q, 1, 10).catch(() => [])
            ];
            const res = await Promise.all(tasks);
            let candidates = dedupe([].concat(res[0] || [], res[1] || [], res[2] || []));
            let match = candidates.find(c => c && c.src && c.full && titleMatches(c.title, track.title));

            if (!match) {
                const piped = await searchPiped(q, 0).catch(() => []);
                const p = piped.find(c => c && titleMatches(c.title, track.title));
                if (p && p.pipedId) {
                    const s = await resolvePipedStream(p.pipedId);
                    if (s && s.url) {
                        track.originalSource = track.originalSource || track.source;
                        track.src = s.url;
                        track.full = true;
                        track.needsResolve = false;
                        if (!track.cover || /placeholder/.test(track.cover)) track.cover = p.cover || track.cover;
                        if (s.duration) track.durationLabel = formatTime(s.duration); else if (p.durationLabel) track.durationLabel = p.durationLabel;
                        track.source = (track.originalSource || track.source) + ' → YT Music';
                        track.resolvedFrom = 'YT Music';
                        track.resolving = false;
                        return track;
                    }
                }
            }

            if (match) {
                track.originalSource = track.originalSource || track.source;
                track.src = match.src;
                track.full = true;
                track.needsResolve = false;
                if (!track.cover || /placeholder/.test(track.cover)) track.cover = match.cover || track.cover;
                if (match.durationLabel) track.durationLabel = match.durationLabel;
                track.source = (track.originalSource || '') + ' → ' + match.source;
                track.resolvedFrom = match.source;
            }
        } catch (_) {}
        track.resolving = false;
        return track;
    }

    async function aggregateSearch(query, offsets) {
        const q = query;
        if (isYtMode()) {
            const p = await searchPiped(q, offsets.piped || 0).catch(() => []);
            return { tracks: dedupe(p), counts: { piped: p.length } };
        }
        const tasks = [
            searchAudius(q, 50, offsets.audius || 0).catch(() => []),
            searchHearThis(q, (offsets.hearthis || 0) + 1).catch(() => []),
            searchIA(q, offsets.ia || 1, 20).catch(() => []),
            searchDeezer(q, offsets.deezer || 0).catch(() => []),
            searchItunes(q, offsets.itunes || 0).catch(() => []),
            searchPiped(q, offsets.piped || 0).catch(() => [])
        ];
        const res = await Promise.all(tasks);
        const [a, h, ia, d, it, p] = res.map(r => r || []);
        const full = dedupe([].concat(a, h, ia, p));
        const preview = dedupe([].concat(d, it)).filter(pr => !full.some(f => titleMatches(f.title, pr.title) && normalizeTitle(f.artist) === normalizeTitle(pr.artist)));
        return { tracks: dedupe([].concat(full, preview)), counts: { audius: a.length, hearthis: h.length, ia: ia.length, deezer: d.length, itunes: it.length, piped: p.length } };
    }

    async function runSearch(reset) {
        const q = searchState.query; if (!q || searchState.loading) return;
        searchState.loading = true;
        if (reset) { searchState.offsets = { audius: 0, ia: 1, hearthis: 0, deezer: 0, itunes: 0, piped: 0 }; searchState.tracks = []; if (els.searchResults) els.searchResults._lastTracks = []; }
        if (els.searchStatus) els.searchStatus.textContent = reset ? (isYtMode() ? 'Ищу в YouTube Music...' : 'Ищу по всем доступным каталогам...') : 'Загружаю ещё результаты...';
        if (els.loadMoreWrap) els.loadMoreWrap.style.display = 'none';
        try {
            const { tracks, counts } = await aggregateSearch(q, searchState.offsets);
            const merged = dedupe(searchState.tracks.concat(tracks));
            const added = merged.length - searchState.tracks.length;
            searchState.tracks = merged;
            if (isYtMode()) { searchState.offsets.piped += 20; }
            else { searchState.offsets.audius += 50; searchState.offsets.hearthis += 1; searchState.offsets.ia += 1; searchState.offsets.deezer += 25; searchState.offsets.itunes += 25; searchState.offsets.piped += 20; }
            if (!merged.length) {
                if (els.searchStatus) els.searchStatus.textContent = isYtMode() ? 'В YouTube Music ничего не найдено. Попробуйте другой запрос.' : 'Ничего не найдено. Попробуйте другой запрос (латиницей/кириллицей).';
                if (els.searchResults) els.searchResults.innerHTML = '<div class="empty-state"><i class="fas fa-circle-exclamation"></i><h3>Ничего не найдено</h3><p>' + esc(isYtMode() ? 'Попробуйте другой запрос или проверьте доступность YouTube Music.' : 'В открытых каталогах этого нет или источники недоступны. Попробуйте изменить запрос.') + '</p></div>';
            } else {
                if (els.searchResults) { els.searchResults._lastTracks = null; renderTracks(merged, els.searchResults); }
                const parts = [];
                if (isYtMode()) { if (counts.piped) parts.push('YT Music ' + counts.piped); }
                else { if (counts.audius) parts.push('Audius ' + counts.audius); if (counts.hearthis) parts.push('HearThis ' + counts.hearthis); if (counts.ia) parts.push('Archive ' + counts.ia); if (counts.piped) parts.push('YT Music ' + counts.piped); if (counts.deezer) parts.push('Deezer ' + counts.deezer); if (counts.itunes) parts.push('iTunes ' + counts.itunes); }
                const fullCount = merged.filter(t => t.full || t.needsResolve).length;
                const readyFull = merged.filter(t => t.full).length;
                if (els.searchStatus) els.searchStatus.textContent = 'Найдено: ' + merged.length + (isYtMode() ? '' : ' (полных/конвертируемых: ' + fullCount + ', готовы: ' + readyFull + ')') + (parts.length ? ' — ' + parts.join(', ') : '') + '.';
                if (els.loadMoreWrap) els.loadMoreWrap.style.display = added > 0 ? 'flex' : 'none';
            }
        } catch (_) {
            if (!searchState.tracks.length && els.searchStatus) els.searchStatus.textContent = 'Ошибка поиска. Проверьте интернет.';
        }
        searchState.loading = false;
    }

    async function searchOnline(query) {
        const q = (query || '').trim(); if (!q) { if (els.searchStatus) els.searchStatus.textContent = 'Введите запрос.'; if (els.searchResults) els.searchResults.innerHTML = ''; if (els.loadMoreWrap) els.loadMoreWrap.style.display = 'none'; return; }
        searchState.query = q; await runSearch(true);
    }

    async function loadChart(force) {
        if (chartLoaded && !force) return; if (!els.chartList) return;
        els.chartList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><h3>Загружаем чарт...</h3></div>';
        try {
            let tracks = [];
            if (isYtMode()) {
                tracks = await searchPiped('топ хиты 2025', 0).catch(() => []);
                if (tracks.length < 10) { const extra = await searchPiped('popular music hits', 0).catch(() => []); tracks = dedupe(tracks.concat(extra)); }
            } else {
                tracks = await searchAudius('', 30, 0).catch(() => []);
                if (tracks.length < 10) { const extra = await searchHearThis('top hits', 1).catch(() => []); tracks = dedupe(tracks.concat(extra)); }
                if (tracks.length < 10) { const extra = await searchPiped('топ хиты', 0).catch(() => []); tracks = dedupe(tracks.concat(extra)); }
            }
            chartLoaded = true;
            if (tracks.length) renderChart(tracks.slice(0, 20)); else els.chartList.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><h3>Чарт недоступен</h3><p>Откройте поиск или переключите режим.</p></div>';
        } catch (_) { els.chartList.innerHTML = '<div class="empty-state"><i class="fas fa-chart-line"></i><h3>Чарт недоступен</h3><p>Откройте поиск.</p></div>'; }
    }
    function ensureChart() { if (!chartLoaded) loadChart(false); }

    function renderMixes() {
        if (!els.mixGrid) return;
        els.mixGrid.innerHTML = MIXES.map(m => '<div class="mix-card" data-query="' + esc(m.query) + '" style="--mix-bg:' + m.bg + '"><h4>' + esc(m.title) + '</h4><p>Включить подборку</p><i class="fas ' + m.icon + ' mix-icon"></i></div>').join('');
        els.mixGrid.querySelectorAll('.mix-card').forEach(card => card.addEventListener('click', () => startWave(card.getAttribute('data-query') || card.querySelector('h4').textContent, true)));
    }
    function renderSearchChips() {
        if (!els.searchChips) return;
        els.searchChips.innerHTML = SEARCH_CHIPS.map(c => '<button class="chip" data-query="' + esc(c) + '">' + esc(c) + '</button>').join('');
        els.searchChips.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', () => { if (els.searchInput) els.searchInput.value = ch.getAttribute('data-query'); searchOnline(ch.getAttribute('data-query')); }));
    }
    function renderWaveSeeds() {
        if (!els.waveSeeds) return;
        const seeds = ['По моим вкусам', ...MIXES.map(m => m.title)];
        els.waveSeeds.innerHTML = seeds.map(s => '<button class="chip' + (s === wave.seed ? ' active' : '') + '" data-seed="' + esc(s) + '">' + esc(s) + '</button>').join('');
        els.waveSeeds.querySelectorAll('.chip').forEach(ch => ch.addEventListener('click', () => {
            const s = ch.getAttribute('data-seed'); if (s === 'По моим вкусам') startWaveFromLikes(); else startWave(s, true);
        }));
    }

    function updateWaveStage(track) {
        const t = track || {};
        if (els.waveCover) els.waveCover.src = t.cover || 'https://via.placeholder.com/240x240/1a1a1a/666?text=%E2%99%AA';
        if (els.waveTrackTitle) els.waveTrackTitle.textContent = t.title || (wave.active ? 'Загрузка...' : 'Волна не запущена');
        if (els.waveTrackArtist) els.waveTrackArtist.textContent = t.artist || (wave.active ? 'Подбираем треки' : 'Нажмите «Запустить волну»');
        updateWaveLikeBtn();
    }

    async function fetchWaveTracks(seed, offset) {
        const q = (MIXES.find(m => m.title === seed) || {}).query || seed || 'popular music';
        if (isYtMode()) {
            const tracks = await searchPiped(q, offset || 0).catch(() => []);
            return dedupe(tracks);
        }
        const { tracks } = await aggregateSearch(q, { audius: offset || 0, hearthis: Math.floor((offset || 0) / 40), ia: Math.floor((offset || 0) / 40) + 1, deezer: offset || 0, itunes: offset || 0, piped: offset || 0 });
        return dedupe(tracks);
    }

    async function startWave(seed, navigate) {
        clearWaveAdvance();
        wave.seed = seed || wave.seed || 'Поп-хиты';
        wave.active = true; wave.loading = true; wave.queue = []; wave.index = 0; wave.failCount = 0;
        updateWaveStage(null); updatePlayButtons(); if (navigate) showPage('wave');
        if (els.wavePlayBtn) els.wavePlayBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Загрузка...';
        const tracks = await fetchWaveTracks(wave.seed, 0).catch(() => []);
        wave.queue = tracks.length ? tracks : [...LOCAL_TRACKS];
        wave.loading = false;
        renderTracks(wave.queue, els.waveQueue); renderWaveSeeds();
        if (wave.queue.length) playTrack(wave.queue[0], wave.queue, true);
        showToast('Моя волна: ' + wave.seed);
    }
    function startWaveFromLikes() {
        const favs = Array.from(favorites.values());
        if (!favs.length) { showToast('Добавьте треки в коллекцию, чтобы настроить волну'); startWave('Поп-хиты', true); return; }
        const pick = favs[Math.floor(Math.random() * favs.length)];
        const seed = (pick.artist || pick.title || 'music').split(/[,(&]/)[0].trim();
        startWave(seed, true);
    }
    async function ensureWaveAhead(force) {
        if (!wave.active || wave.loading) return;
        if (!force && wave.queue.length - wave.index > 6) return;
        wave.loading = true;
        const before = wave.queue.length;
        const more = await fetchWaveTracks(wave.seed, wave.queue.length).catch(() => []);
        wave.queue = dedupe(wave.queue.concat(more));
        wave.loading = false;
        renderTracks(wave.queue, els.waveQueue);
        if (force && wave.queue.length === before) return false;
        return true;
    }
    async function waveNext() {
        if (!wave.active) return;
        clearWaveAdvance();
        if (!wave.queue.length) { await startWave(wave.seed, false); return; }
        let nextIndex = wave.index + 1;
        if (nextIndex >= wave.queue.length) {
            await ensureWaveAhead(true);
            if (nextIndex >= wave.queue.length) {
                if ((wave.failCount || 0) >= 5) { showToast('Не удалось продолжить волну, попробуйте другой микс'); return; }
                nextIndex = wave.queue.length ? 0 : 0;
                if (!wave.queue.length) return;
            }
        }
        if (nextIndex === wave.index && wave.queue.length > 1) nextIndex = (wave.index + 1) % wave.queue.length;
        wave.index = Math.max(0, Math.min(nextIndex, wave.queue.length - 1));
        playTrack(wave.queue[wave.index], wave.queue, true);
        ensureWaveAhead();
    }
    function wavePrev() {
        if (!wave.queue.length) return;
        clearWaveAdvance();
        wave.index = Math.max(wave.index - 1, 0);
        playTrack(wave.queue[wave.index], wave.queue, true);
    }

    audio.addEventListener('timeupdate', () => updateProgressUI(audio.currentTime, audio.duration));
    audio.addEventListener('loadedmetadata', () => updateProgressUI(audio.currentTime, audio.duration));
    audio.addEventListener('ended', () => {
        isPlaying = false; updatePlayButtons();
        if (wave.active) { wave.failCount = 0; scheduleWaveAdvance(playRequest, currentTrack ? currentTrack.id : null, 250); }
        else playByOffset(1);
    });
    audio.addEventListener('error', () => {
        if (!currentTrack) return;
        const req = playRequest;
        if (wave.active) {
            wave.failCount = (wave.failCount || 0) + 1;
            showToast('Источник недоступен, пробую следующий...');
            scheduleWaveAdvance(req, currentTrack.id, 350);
        } else {
            isPlaying = false; updatePlayButtons();
        }
    });

    if (els.playPauseBtn) els.playPauseBtn.addEventListener('click', togglePlay);
    if (els.expandedPlayPauseBtn) els.expandedPlayPauseBtn.addEventListener('click', togglePlay);
    if (els.prevBtn) els.prevBtn.addEventListener('click', () => { if (!wave.active && currentTrack && audio.currentTime > 3) audio.currentTime = 0; else playByOffset(-1); });
    if (els.nextBtn) els.nextBtn.addEventListener('click', () => playByOffset(1));
    if (els.expandedPrevBtn) els.expandedPrevBtn.addEventListener('click', () => { if (!wave.active && currentTrack && audio.currentTime > 3) audio.currentTime = 0; else playByOffset(-1); });
    if (els.expandedNextBtn) els.expandedNextBtn.addEventListener('click', () => playByOffset(1));

    if (els.playerLikeBtn) els.playerLikeBtn.addEventListener('click', () => { if (currentTrack) toggleFavorite(currentTrack); });
    if (els.expandedLikeBtn) els.expandedLikeBtn.addEventListener('click', () => { if (currentTrack) toggleFavorite(currentTrack); });
    if (els.expandedWaveBtn) els.expandedWaveBtn.addEventListener('click', () => { if (currentTrack) startWave((currentTrack.artist || currentTrack.title || 'музыка').split(/[,(&]/)[0].trim(), true); });

    if (els.progressBar) els.progressBar.addEventListener('click', e => seekFromEvent(els.progressBar, e));
    if (els.expandedProgressBar) els.expandedProgressBar.addEventListener('click', e => seekFromEvent(els.expandedProgressBar, e));
    if (els.volumeSlider) els.volumeSlider.addEventListener('input', e => { const v = +e.target.value / 100; audio.volume = v; updateVolumeIcon(v); });

    if (els.searchBtn) els.searchBtn.addEventListener('click', () => searchOnline(els.searchInput ? els.searchInput.value : ''));
    if (els.searchInput) els.searchInput.addEventListener('keydown', e => { if (e.key === 'Enter') searchOnline(els.searchInput.value); });
    if (els.heroSearchBtn) els.heroSearchBtn.addEventListener('click', () => showPage('search'));
    if (els.mobileSearchBtn) els.mobileSearchBtn.addEventListener('click', () => showPage('search'));
    if (els.refreshChartBtn) els.refreshChartBtn.addEventListener('click', () => loadChart(true));
    if (els.loadMoreBtn) els.loadMoreBtn.addEventListener('click', () => runSearch(false));

    if (els.startWaveBtn) els.startWaveBtn.addEventListener('click', () => startWave('Поп-хиты', true));
    if (els.waveByLikesBtn) els.waveByLikesBtn.addEventListener('click', () => startWaveFromLikes());
    if (els.wavePlayBtn) els.wavePlayBtn.addEventListener('click', () => { if (!wave.active) startWave(wave.seed, false); else togglePlay(); });
    if (els.waveNextBtn) els.waveNextBtn.addEventListener('click', () => { if (!wave.active) startWave(wave.seed, false); else waveNext(); });
    if (els.waveLikeBtn) els.waveLikeBtn.addEventListener('click', () => { const t = wave.queue[wave.index] || currentTrack; if (t) toggleFavorite(t); });

    els.navItems.forEach(item => item.addEventListener('click', () => showPage(item.dataset.page || 'home')));
    els.mobileNavItems.forEach(item => item.addEventListener('click', () => showPage(item.dataset.page || 'home')));
    if (els.mobileMenuBtn) els.mobileMenuBtn.addEventListener('click', () => openSidebar(true));
    if (els.sidebarClose) els.sidebarClose.addEventListener('click', () => openSidebar(false));
    if (els.sidebarOverlay) els.sidebarOverlay.addEventListener('click', () => openSidebar(false));

    if (els.expandPlayerBtn) els.expandPlayerBtn.addEventListener('click', () => { if (els.expandedPlayer) els.expandedPlayer.style.display = 'flex'; });
    if (els.closeExpandedBtn) els.closeExpandedBtn.addEventListener('click', () => { if (els.expandedPlayer) els.expandedPlayer.style.display = 'none'; });

    document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const name = tab.getAttribute('data-tab');
        ['fav', 'history', 'local'].forEach(n => { const p = document.getElementById('tab-' + n); if (p) p.style.display = n === name ? 'block' : 'none'; });
        if (name === 'history') renderHistory();
        if (name === 'local') renderLocal();
    }));

    if (els.searchMode) {
        els.searchMode.querySelectorAll('.mode-btn').forEach(btn => btn.addEventListener('click', () => setSourceMode(btn.getAttribute('data-mode') || 'all')));
    }
    updateModeUI();

    renderSearchChips();
    renderMixes();
    renderLocal();
    renderFavorites();
    renderHistory();
    updatePlayButtons();
    updateVolumeIcon(audio.volume);
    showPage('home');
    loadChart(false);
});
