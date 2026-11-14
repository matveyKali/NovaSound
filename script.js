document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('audioPlayer');

    const LOCAL_TRACKS = [
        { id: 'local-1', title: 'Warriyo - Mortals [NCS Release]', artist: 'Warriyo', cover: 'covers/1.jpg', src: 'songs/1.mp3', durationLabel: '3:50', source: 'Локально' },
        { id: 'local-2', title: 'Dr. Dre, Snoop Dogg - Still D.R.E.', artist: 'Dr. Dre, Snoop Dogg', cover: 'covers/2.jpg', src: 'songs/2.mp3', durationLabel: '4:28', source: 'Локально' },
        { id: 'local-3', title: 'Hollywood Undead - Riot', artist: 'Hollywood Undead', cover: 'covers/3.jpg', src: 'songs/3.mp3', durationLabel: '3:47', source: 'Локально' },
        { id: 'local-4', title: 'This Is Madness (God of War)', artist: 'God of War', cover: 'covers/4.jpg', src: 'songs/4.mp3', durationLabel: '4:20', source: 'Локально' },
        { id: 'local-5', title: 'SOLO (YXNG BANE REMIX)', artist: 'Demi Lovato', cover: 'covers/5.jpg', src: 'songs/5.mp3', durationLabel: '3:41', source: 'Локально' },
        { id: 'local-6', title: 'After Dark', artist: 'Mr.Kitty', cover: 'covers/6.jpg', src: 'songs/6.mp3', durationLabel: '4:19', source: 'Локально' },
        { id: 'local-7', title: "Coolio - Gangsta's Paradise", artist: 'Coolio feat. L.V.', cover: 'covers/7.jpg', src: 'songs/7.mp3', durationLabel: '4:01', source: 'Локально' },
        { id: 'local-8', title: "Beethoven - Fur Elise (Remix)", artist: 'Beethoven', cover: 'covers/8.jpg', src: 'songs/8.mp3', durationLabel: '2:23', source: 'Локально' }
    ];

    const els = {
        navItems: document.querySelectorAll('.nav-item'),
        mobileNavItems: document.querySelectorAll('.mobile-nav-item'),
        pageTitle: document.getElementById('pageTitle'),
        homeSection: document.getElementById('homeSection'),
        searchSection: document.getElementById('searchSection'),
        favoritesSection: document.getElementById('favoritesSection'),
        localTracksList: document.getElementById('localTracksList'),
        trendingList: document.getElementById('trendingList'),
        searchResults: document.getElementById('searchResults'),
        favoritesList: document.getElementById('favoritesList'),
        searchInput: document.getElementById('searchInput'),
        searchBtn: document.getElementById('searchBtn'),
        heroSearchBtn: document.getElementById('heroSearchBtn'),
        refreshTrendingBtn: document.getElementById('refreshTrendingBtn'),
        searchStatus: document.getElementById('searchStatus'),
        searchChips: document.getElementById('searchChips'),
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
        expandedProgress: document.getElementById('expandedProgress'),
        expandedProgressBar: document.getElementById('expandedProgressBar'),
        expandedCurrentTime: document.getElementById('expandedCurrentTime'),
        expandedDuration: document.getElementById('expandedDuration'),
        sidebar: document.getElementById('sidebar'),
        sidebarOverlay: document.getElementById('sidebarOverlay'),
        sidebarClose: document.getElementById('sidebarClose'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileSearchBtn: document.getElementById('mobileSearchBtn')
    };

    let currentTrack = null;
    let currentQueue = [...LOCAL_TRACKS];
    let isPlaying = false;
    let favorites = loadFavorites();
    let audiusHosts = [];
    let audiusHostIndex = 0;
    let searchState = { query: '', offsetA: 0, offsetIA: 1, tracks: [], loading: false };

    audio.volume = 0.7;
    if (els.volumeSlider) els.volumeSlider.value = 70;

    function esc(text) {
        const d = document.createElement('div');
        d.textContent = text == null ? '' : String(text);
        return d.innerHTML;
    }

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return m + ':' + (s < 10 ? '0' : '') + s;
    }

    function showToast(msg) {
        if (!els.toast) return;
        els.toast.textContent = msg;
        els.toast.classList.add('show');
        clearTimeout(showToast._t);
        showToast._t = setTimeout(() => els.toast.classList.remove('show'), 2600);
    }

    function loadFavorites() {
        try {
            const raw = localStorage.getItem('nova_favorites');
            if (!raw) return new Map();
            const arr = JSON.parse(raw);
            return new Map(arr.map(t => [t.id, t]));
        } catch (_) { return new Map(); }
    }

    function saveFavorites() {
        try { localStorage.setItem('nova_favorites', JSON.stringify(Array.from(favorites.values()))); } catch (_) {}
    }

    function isFavorite(id) { return favorites.has(id); }

    function toggleFavorite(track) {
        if (!track) return;
        if (favorites.has(track.id)) {
            favorites.delete(track.id);
            showToast('Удалено из избранного');
        } else {
            favorites.set(track.id, track);
            showToast('Добавлено в избранное');
        }
        saveFavorites();
        updateLikeButtons();
        renderFavorites();
        rerenderVisibleLists();
    }

    function rerenderVisibleLists() {
        if (els.homeSection && els.homeSection.style.display !== 'none') {
            renderTracks(LOCAL_TRACKS, els.localTracksList);
            if (els.trendingList && els.trendingList._lastTracks) renderTracks(els.trendingList._lastTracks, els.trendingList);
        }
        if (els.searchSection && els.searchSection.style.display !== 'none' && els.searchResults && els.searchResults._lastTracks) {
            renderTracks(els.searchResults._lastTracks, els.searchResults);
        }
    }

    function trackCard(track) {
        const liked = isFavorite(track.id);
        const cover = track.cover || 'https://via.placeholder.com/300x300/1a1a1a/777777?text=%E2%99%AA';
        return '' +
            '<div class="track-card" data-id="' + esc(track.id) + '">' +
            '  <div class="track-cover-wrapper">' +
            '    <img src="' + esc(cover) + '" alt="" loading="lazy" decoding="async">' +
            '    <div class="play-overlay"><i class="fas fa-play"></i></div>' +
            '    <button class="like-badge ' + (liked ? 'liked' : '') + '" data-like-id="' + esc(track.id) + '" aria-label="В избранное">' +
            '      <i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i>' +
            '    </button>' +
            '  </div>' +
            '  <div class="track-info">' +
            '    <h3 title="' + esc(track.title) + '">' + esc(track.title) + '</h3>' +
            '    <p title="' + esc(track.artist) + '">' + esc(track.artist) + '</p>' +
            '  </div>' +
            '  <div class="track-meta"><span>' + esc(track.source || '') + '</span><span>' + esc(track.durationLabel || '') + '</span></div>' +
            '</div>';
    }

    function renderTracks(list, container, append) {
        if (!container) return;
        if (!append) container._lastTracks = list;
        else container._lastTracks = (container._lastTracks || []).concat(list);
        const full = container._lastTracks || [];
        if (!full.length) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-music"></i><h3>Ничего не найдено</h3><p>Попробуйте другой запрос.</p></div>';
            return;
        }
        container.innerHTML = full.map(trackCard).join('');
        container.querySelectorAll('.track-card').forEach(card => {
            const id = card.getAttribute('data-id');
            card.addEventListener('click', (e) => {
                if (e.target.closest('.like-badge')) return;
                const t = full.find(x => x.id === id);
                if (t) playTrack(t, full);
            });
        });
        container.querySelectorAll('.like-badge').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-like-id');
                const t = full.find(x => x.id === id) || favorites.get(id);
                if (t) toggleFavorite(t);
            });
        });
    }

    function renderFavorites() {
        if (!els.favoritesList) return;
        const list = Array.from(favorites.values());
        if (!list.length) {
            els.favoritesList.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><h3>В избранном пусто</h3><p>Нажмите на сердечко у трека, чтобы сохранить его.</p></div>';
            els.favoritesList._lastTracks = [];
            return;
        }
        els.favoritesList._lastTracks = null;
        renderTracks(list, els.favoritesList);
    }

    function updateLikeButtons() {
        if (!currentTrack) return;
        const liked = isFavorite(currentTrack.id);
        if (els.playerLikeBtn) {
            els.playerLikeBtn.classList.toggle('liked', liked);
            els.playerLikeBtn.innerHTML = '<i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i>';
        }
        if (els.expandedLikeBtn) {
            els.expandedLikeBtn.innerHTML = '<i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i>';
        }
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
    }

    function playTrack(track, queue) {
        if (!track || !track.src) { showToast('Нет аудио для этого трека'); return; }
        currentTrack = track;
        if (Array.isArray(queue) && queue.length) currentQueue = queue;
        setPlayerUI(track);
        audio.src = track.src;
        audio.play().then(() => { isPlaying = true; updatePlayButtons(); }).catch(() => {
            isPlaying = false; updatePlayButtons(); showToast('Не удалось воспроизвести трек');
        });
    }

    function updatePlayButtons() {
        const icon = isPlaying ? 'fa-pause' : 'fa-play';
        if (els.playPauseBtn) els.playPauseBtn.innerHTML = '<i class="fas ' + icon + '"></i>';
        if (els.expandedPlayPauseBtn) els.expandedPlayPauseBtn.innerHTML = '<i class="fas ' + icon + '"></i>';
    }

    function togglePlay() {
        if (!currentTrack) { playTrack(LOCAL_TRACKS[0], LOCAL_TRACKS); return; }
        if (isPlaying) { audio.pause(); isPlaying = false; }
        else { audio.play().catch(() => showToast('Ошибка воспроизведения')); isPlaying = true; }
        updatePlayButtons();
    }

    function playByOffset(offset) {
        if (!currentTrack || !currentQueue.length) return;
        const idx = currentQueue.findIndex(t => t.id === currentTrack.id);
        if (idx === -1) return;
        const next = currentQueue[(idx + offset + currentQueue.length) % currentQueue.length];
        if (next) playTrack(next, currentQueue);
    }

    function updateProgressUI(current, total) {
        const pct = total ? (current / total) * 100 : 0;
        if (els.progress) els.progress.style.width = pct + '%';
        if (els.expandedProgress) els.expandedProgress.style.width = pct + '%';
        const ct = formatTime(current), dt = formatTime(total);
        if (els.currentTime) els.currentTime.textContent = ct;
        if (els.duration) els.duration.textContent = dt;
        if (els.expandedCurrentTime) els.expandedCurrentTime.textContent = ct;
        if (els.expandedDuration) els.expandedDuration.textContent = dt;
    }

    function seekFromEvent(bar, e) {
        if (!bar || !audio.duration) return;
        const rect = bar.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX);
        const pos = Math.min(Math.max((x - rect.left) / rect.width, 0), 1);
        audio.currentTime = pos * audio.duration;
    }

    function updateVolumeIcon(v) {
        if (!els.volumeIcon) return;
        if (v === 0) els.volumeIcon.className = 'fas fa-volume-mute';
        else if (v < 0.5) els.volumeIcon.className = 'fas fa-volume-down';
        else els.volumeIcon.className = 'fas fa-volume-up';
    }

    function openSidebar(open) {
        if (!els.sidebar) return;
        els.sidebar.classList.toggle('open', open);
        if (els.sidebarOverlay) els.sidebarOverlay.classList.toggle('show', open);
    }

    function showPage(page) {
        if (els.homeSection) els.homeSection.style.display = page === 'home' ? 'block' : 'none';
        if (els.searchSection) els.searchSection.style.display = page === 'search' ? 'block' : 'none';
        if (els.favoritesSection) els.favoritesSection.style.display = page === 'favorites' ? 'block' : 'none';
        const titles = { home: 'Главная', search: 'Поиск', favorites: 'Избранное' };
        if (els.pageTitle) els.pageTitle.textContent = titles[page] || 'Главная';
        els.navItems.forEach(i => i.classList.toggle('active', i.dataset.page === page));
        els.mobileNavItems.forEach(i => i.classList.toggle('active', i.dataset.page === page));
        if (page === 'home') { renderTracks(LOCAL_TRACKS, els.localTracksList); ensureTrending(); }
        if (page === 'favorites') renderFavorites();
        if (page === 'search' && els.searchInput) setTimeout(() => els.searchInput.focus(), 50);
        openSidebar(false);
        const mc = document.getElementById('mainContent');
        if (mc) mc.scrollTop = 0;
    }

    async function fetchJson(url, timeoutMs) {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), timeoutMs || 12000);
        try {
            const res = await fetch(url, { signal: ctrl.signal });
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return await res.json();
        } finally { clearTimeout(t); }
    }

    async function getAudiusHosts() {
        if (audiusHosts.length) return audiusHosts;
        try {
            const data = await fetchJson('https://api.audius.co', 8000);
            if (data && Array.isArray(data.data) && data.data.length) {
                audiusHosts = data.data.map(h => h.replace(/\/$/, ''));
            }
        } catch (_) {}
        if (!audiusHosts.length) audiusHosts = ['https://discoveryprovider.audius.co', 'https://discoveryprovider2.audius.co', 'https://discoveryprovider3.audius.co'];
        return audiusHosts;
    }

    async function audiusRequest(path) {
        const hosts = await getAudiusHosts();
        for (let i = 0; i < Math.min(hosts.length, 4); i++) {
            const host = hosts[(audiusHostIndex + i) % hosts.length];
            try {
                const data = await fetchJson(host + path, 12000);
                audiusHostIndex = (audiusHostIndex + i) % hosts.length;
                return { host, data };
            } catch (_) {}
        }
        throw new Error('Audius unavailable');
    }

    function mapAudiusTracks(list, host) {
        return (list || []).map(item => {
            const art = item.artwork || {};
            const cover = art['480x480'] || art['1000x1000'] || art['150x150'] || (item.user && item.user.profile_picture && (item.user.profile_picture['480x480'] || item.user.profile_picture['150x150'])) || '';
            return {
                id: 'audius-' + item.id,
                title: item.title || 'Без названия',
                artist: (item.user && item.user.name) ? item.user.name : 'Неизвестный исполнитель',
                cover: cover,
                src: host + '/v1/tracks/' + encodeURIComponent(item.id) + '/stream?app_name=NovaSound',
                durationLabel: item.duration ? formatTime(item.duration) : '',
                source: 'Audius'
            };
        }).filter(t => t.src);
    }

    async function searchAudius(query, limit, offset) {
        const off = offset || 0;
        const lim = limit || 40;
        const q = query ? ('?query=' + encodeURIComponent(query) + '&app_name=NovaSound&limit=' + lim + '&offset=' + off)
                        : ('?app_name=NovaSound&limit=' + lim + '&offset=' + off);
        const path = query ? '/v1/tracks/search' + q : '/v1/tracks/trending' + q;
        const { host, data } = await audiusRequest(path);
        return mapAudiusTracks((data && data.data) ? data.data : [], host);
    }

    async function searchIA(query, page, rows) {
        const p = page || 1;
        const r = rows || 20;
        const q = encodeURIComponent('(' + query + ') AND mediatype:(audio) AND (format:(VBR MP3) OR format:(MP3) OR format:(128Kbps MP3) OR format:(64Kbps MP3))');
        const url = 'https://archive.org/advancedsearch.php?q=' + q + '&fl[]=identifier,title,creator&sort[]=downloads+desc&rows=' + r + '&page=' + p + '&output=json';
        const data = await fetchJson(url, 15000);
        const docs = (data && data.response && data.response.docs) ? data.response.docs : [];
        const top = docs.slice(0, 15);
        const metas = await Promise.allSettled(top.map(d => fetchJson('https://archive.org/metadata/' + encodeURIComponent(d.identifier), 10000)));
        const tracks = [];
        metas.forEach((res, i) => {
            if (res.status !== 'fulfilled') return;
            const meta = res.value;
            const files = (meta && meta.files) ? meta.files : [];
            const mp3 = files.find(f => /mp3/i.test(f.format || '') || /\.mp3$/i.test(f.name || ''));
            if (!mp3) return;
            const d = top[i];
            tracks.push({
                id: 'ia-' + d.identifier,
                title: d.title || (meta.metadata && meta.metadata.title) || 'Без названия',
                artist: d.creator || (meta.metadata && meta.metadata.creator) || 'Internet Archive',
                cover: 'https://archive.org/services/img/' + encodeURIComponent(d.identifier),
                src: 'https://archive.org/download/' + encodeURIComponent(d.identifier) + '/' + encodeURIComponent(mp3.name),
                durationLabel: mp3.length && !isNaN(Number(mp3.length)) ? formatTime(Number(mp3.length)) : '',
                source: 'Archive'
            });
        });
        return tracks;
    }

    function dedupeTracks(tracks) {
        const seen = new Set();
        const out = [];
        tracks.forEach(t => {
            const key = (t.id || '') + '|' + (t.title || '').toLowerCase() + '|' + (t.artist || '').toLowerCase();
            if (seen.has(key)) return;
            seen.add(key);
            out.push(t);
        });
        return out;
    }

    async function runSearch(reset) {
        const q = searchState.query;
        if (!q) return;
        if (searchState.loading) return;
        searchState.loading = true;
        if (reset) {
            searchState.offsetA = 0; searchState.offsetIA = 1; searchState.tracks = [];
            if (els.searchResults) { els.searchResults._lastTracks = []; els.searchResults.innerHTML = ''; }
        }
        if (els.searchStatus) els.searchStatus.textContent = reset ? 'Ищу треки в каталогах...' : 'Загружаю ещё треки...';
        if (els.loadMoreWrap) els.loadMoreWrap.style.display = 'none';

        const [aRes, iRes] = await Promise.allSettled([
            searchAudius(q, 40, searchState.offsetA),
            searchIA(q, searchState.offsetIA, 20)
        ]);
        const aTracks = aRes.status === 'fulfilled' ? aRes.value : [];
        const iTracks = iRes.status === 'fulfilled' ? iRes.value : [];
        const merged = dedupeTracks(searchState.tracks.concat(aTracks, iTracks));
        const added = merged.length - searchState.tracks.length;
        searchState.tracks = merged;
        searchState.offsetA += 40;
        searchState.offsetIA += 1;
        searchState.loading = false;

        if (!merged.length) {
            const local = LOCAL_TRACKS.filter(t => (t.title||'').toLowerCase().includes(q.toLowerCase()) || (t.artist||'').toLowerCase().includes(q.toLowerCase()));
            if (local.length) {
                if (els.searchStatus) els.searchStatus.textContent = 'Онлайн-каталоги недоступны, показаны совпадения из библиотеки.';
                if (els.searchResults) { els.searchResults._lastTracks = null; renderTracks(local, els.searchResults); }
            } else {
                if (els.searchStatus) els.searchStatus.textContent = 'Ничего не найдено. Попробуйте другой запрос.';
                if (els.searchResults) els.searchResults.innerHTML = '<div class="empty-state"><i class="fas fa-triangle-exclamation"></i><h3>Ничего не найдено</h3><p>Попробуйте изменить запрос или проверьте интернет.</p></div>';
            }
            return;
        }
        if (els.searchResults) { els.searchResults._lastTracks = null; renderTracks(merged, els.searchResults); }
        const parts = [];
        if (aTracks.length) parts.push('Audius: ' + aTracks.length);
        if (iTracks.length) parts.push('Archive: ' + iTracks.length);
        if (els.searchStatus) els.searchStatus.textContent = 'Найдено треков: ' + merged.length + (parts.length ? ' (' + parts.join(', ') + ')' : '') + '. Воспроизведение целиком.';
        if (els.loadMoreWrap) els.loadMoreWrap.style.display = added > 0 ? 'flex' : 'none';
    }

    async function searchOnline(query) {
        const q = (query || '').trim();
        if (!q) {
            if (els.searchStatus) els.searchStatus.textContent = 'Введите запрос для поиска.';
            if (els.searchResults) { els.searchResults._lastTracks = []; els.searchResults.innerHTML = ''; }
            if (els.loadMoreWrap) els.loadMoreWrap.style.display = 'none';
            return;
        }
        searchState.query = q;
        await runSearch(true);
    }

    let trendingLoaded = false;
    async function loadTrending(force) {
        if (trendingLoaded && !force) return;
        if (!els.trendingList) return;
        els.trendingList.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin"></i><h3>Загружаем тренды...</h3></div>';
        try {
            const tracks = await searchAudius('', 40, 0);
            trendingLoaded = true;
            if (tracks.length) {
                els.trendingList._lastTracks = null;
                renderTracks(tracks, els.trendingList);
            } else {
                els.trendingList.innerHTML = '<div class="empty-state"><i class="fas fa-music"></i><h3>Тренды недоступны</h3><p>Откройте поиск, чтобы найти треки.</p></div>';
            }
        } catch (_) {
            els.trendingList.innerHTML = '<div class="empty-state"><i class="fas fa-music"></i><h3>Тренды недоступны</h3><p>Откройте поиск, чтобы найти треки.</p></div>';
        }
    }
    function ensureTrending() { if (!trendingLoaded) loadTrending(false); }

    audio.addEventListener('timeupdate', () => updateProgressUI(audio.currentTime, audio.duration));
    audio.addEventListener('loadedmetadata', () => updateProgressUI(audio.currentTime, audio.duration));
    audio.addEventListener('ended', () => { isPlaying = false; updatePlayButtons(); playByOffset(1); });
    audio.addEventListener('error', () => { if (currentTrack) showToast('Ошибка воспроизведения трека'); });

    if (els.playPauseBtn) els.playPauseBtn.addEventListener('click', togglePlay);
    if (els.expandedPlayPauseBtn) els.expandedPlayPauseBtn.addEventListener('click', togglePlay);
    if (els.prevBtn) els.prevBtn.addEventListener('click', () => { if (currentTrack && audio.currentTime > 3) audio.currentTime = 0; else playByOffset(-1); });
    if (els.nextBtn) els.nextBtn.addEventListener('click', () => playByOffset(1));
    if (els.expandedPrevBtn) els.expandedPrevBtn.addEventListener('click', () => { if (currentTrack && audio.currentTime > 3) audio.currentTime = 0; else playByOffset(-1); });
    if (els.expandedNextBtn) els.expandedNextBtn.addEventListener('click', () => playByOffset(1));

    if (els.playerLikeBtn) els.playerLikeBtn.addEventListener('click', () => { if (currentTrack) toggleFavorite(currentTrack); });
    if (els.expandedLikeBtn) els.expandedLikeBtn.addEventListener('click', () => { if (currentTrack) toggleFavorite(currentTrack); });

    if (els.progressBar) els.progressBar.addEventListener('click', (e) => seekFromEvent(els.progressBar, e));
    if (els.expandedProgressBar) els.expandedProgressBar.addEventListener('click', (e) => seekFromEvent(els.expandedProgressBar, e));

    if (els.volumeSlider) els.volumeSlider.addEventListener('input', (e) => { const v = Number(e.target.value) / 100; audio.volume = v; updateVolumeIcon(v); });

    if (els.searchBtn) els.searchBtn.addEventListener('click', () => searchOnline(els.searchInput ? els.searchInput.value : ''));
    if (els.searchInput) els.searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchOnline(els.searchInput.value); });
    if (els.heroSearchBtn) els.heroSearchBtn.addEventListener('click', () => { showPage('search'); });
    if (els.refreshTrendingBtn) els.refreshTrendingBtn.addEventListener('click', () => loadTrending(true));
    if (els.loadMoreBtn) els.loadMoreBtn.addEventListener('click', () => runSearch(false));

    if (els.searchChips) {
        els.searchChips.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const q = chip.getAttribute('data-query') || chip.textContent;
                if (els.searchInput) els.searchInput.value = q;
                searchOnline(q);
            });
        });
    }

    els.navItems.forEach(item => item.addEventListener('click', () => showPage(item.dataset.page || 'home')));
    els.mobileNavItems.forEach(item => item.addEventListener('click', () => showPage(item.dataset.page || 'home')));

    if (els.mobileMenuBtn) els.mobileMenuBtn.addEventListener('click', () => openSidebar(true));
    if (els.sidebarClose) els.sidebarClose.addEventListener('click', () => openSidebar(false));
    if (els.sidebarOverlay) els.sidebarOverlay.addEventListener('click', () => openSidebar(false));
    if (els.mobileSearchBtn) els.mobileSearchBtn.addEventListener('click', () => showPage('search'));

    if (els.expandPlayerBtn) els.expandPlayerBtn.addEventListener('click', () => { if (els.expandedPlayer) els.expandedPlayer.style.display = 'flex'; });
    if (els.closeExpandedBtn) els.closeExpandedBtn.addEventListener('click', () => { if (els.expandedPlayer) els.expandedPlayer.style.display = 'none'; });

    renderTracks(LOCAL_TRACKS, els.localTracksList);
    renderFavorites();
    updatePlayButtons();
    updateVolumeIcon(audio.volume);
    showPage('home');
    loadTrending(false);
});
