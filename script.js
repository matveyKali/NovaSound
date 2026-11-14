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
        pageTitle: document.getElementById('pageTitle'),
        homeSection: document.getElementById('homeSection'),
        searchSection: document.getElementById('searchSection'),
        favoritesSection: document.getElementById('favoritesSection'),
        localTracksList: document.getElementById('localTracksList'),
        searchResults: document.getElementById('searchResults'),
        favoritesList: document.getElementById('favoritesList'),
        searchInput: document.getElementById('searchInput'),
        searchBtn: document.getElementById('searchBtn'),
        heroSearchBtn: document.getElementById('heroSearchBtn'),
        searchStatus: document.getElementById('searchStatus'),
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
        expandedDuration: document.getElementById('expandedDuration')
    };

    let currentTrack = null;
    let currentQueue = [...LOCAL_TRACKS];
    let isPlaying = false;
    let favorites = loadFavorites();

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
        } catch (_) {
            return new Map();
        }
    }

    function saveFavorites() {
        try {
            localStorage.setItem('nova_favorites', JSON.stringify(Array.from(favorites.values())));
        } catch (_) {}
    }

    function isFavorite(id) {
        return favorites.has(id);
    }

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
        if (els.homeSection && els.homeSection.style.display !== 'none') renderTracks(LOCAL_TRACKS, els.localTracksList);
        if (els.searchSection && els.searchSection.style.display !== 'none' && els.searchResults && els.searchResults._lastTracks) {
            renderTracks(els.searchResults._lastTracks, els.searchResults);
        }
    }

    function trackCard(track) {
        const liked = isFavorite(track.id);
        const cover = track.cover || 'https://via.placeholder.com/300x300/1a1a1a/777777?text=%E2%99%AA';
        const duration = track.durationLabel || '';
        const source = track.source || '';
        return '' +
            '<div class="track-card" data-id="' + esc(track.id) + '">' +
            '  <div class="track-cover-wrapper">' +
            '    <img src="' + esc(cover) + '" alt="' + esc(track.title) + '" loading="lazy">' +
            '    <div class="play-overlay"><i class="fas fa-play"></i></div>' +
            '    <button class="like-badge ' + (liked ? 'liked' : '') + '" data-like-id="' + esc(track.id) + '" aria-label="В избранное">' +
            '      <i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i>' +
            '    </button>' +
            '  </div>' +
            '  <div class="track-info">' +
            '    <h3 title="' + esc(track.title) + '">' + esc(track.title) + '</h3>' +
            '    <p title="' + esc(track.artist) + '">' + esc(track.artist) + '</p>' +
            '  </div>' +
            '  <div class="track-meta"><span>' + esc(source) + '</span><span>' + esc(duration) + '</span></div>' +
            '</div>';
    }

    function renderTracks(list, container) {
        if (!container) return;
        container._lastTracks = list;
        if (!list || list.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fas fa-music"></i><h3>Ничего не найдено</h3><p>Попробуйте другой запрос или откройте библиотеку.</p></div>';
            return;
        }
        container.innerHTML = list.map(trackCard).join('');

        container.querySelectorAll('.track-card').forEach(card => {
            const id = card.getAttribute('data-id');
            card.addEventListener('click', (e) => {
                if (e.target.closest('.like-badge')) return;
                const t = list.find(x => x.id === id);
                if (t) playTrack(t, list);
            });
        });
        container.querySelectorAll('.like-badge').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-like-id');
                const t = list.find(x => x.id === id) || favorites.get(id);
                if (t) toggleFavorite(t);
            });
        });
    }

    function renderFavorites() {
        if (!els.favoritesList) return;
        const list = Array.from(favorites.values());
        if (list.length === 0) {
            els.favoritesList.innerHTML = '<div class="empty-state"><i class="fas fa-heart"></i><h3>В избранном пусто</h3><p>Нажмите на сердечко у трека, чтобы сохранить его здесь.</p></div>';
            return;
        }
        renderTracks(list, els.favoritesList);
    }

    function updateLikeButtons() {
        if (currentTrack) {
            const liked = isFavorite(currentTrack.id);
            if (els.playerLikeBtn) {
                els.playerLikeBtn.classList.toggle('liked', liked);
                els.playerLikeBtn.innerHTML = '<i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i>';
            }
            if (els.expandedLikeBtn) {
                els.expandedLikeBtn.innerHTML = '<i class="' + (liked ? 'fas' : 'far') + ' fa-heart"></i>';
            }
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
        if (!track || !track.src) {
            showToast('Нет аудио для этого трека');
            return;
        }
        currentTrack = track;
        if (Array.isArray(queue) && queue.length) currentQueue = queue;
        setPlayerUI(track);
        audio.src = track.src;
        audio.play().then(() => {
            isPlaying = true;
            updatePlayButtons();
        }).catch(() => {
            isPlaying = false;
            updatePlayButtons();
            showToast('Не удалось воспроизвести трек');
        });
    }

    function updatePlayButtons() {
        const icon = isPlaying ? 'fa-pause' : 'fa-play';
        if (els.playPauseBtn) els.playPauseBtn.innerHTML = '<i class="fas ' + icon + '"></i>';
        if (els.expandedPlayPauseBtn) els.expandedPlayPauseBtn.innerHTML = '<i class="fas ' + icon + '"></i>';
    }

    function togglePlay() {
        if (!currentTrack) {
            playTrack(LOCAL_TRACKS[0], LOCAL_TRACKS);
            return;
        }
        if (isPlaying) {
            audio.pause();
            isPlaying = false;
        } else {
            audio.play().catch(() => showToast('Ошибка воспроизведения'));
            isPlaying = true;
        }
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
        const ct = formatTime(current);
        const dt = formatTime(total);
        if (els.currentTime) els.currentTime.textContent = ct;
        if (els.duration) els.duration.textContent = dt;
        if (els.expandedCurrentTime) els.expandedCurrentTime.textContent = ct;
        if (els.expandedDuration) els.expandedDuration.textContent = dt;
    }

    function seekFromEvent(bar, e) {
        if (!bar || !audio.duration) return;
        const rect = bar.getBoundingClientRect();
        const pos = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
        audio.currentTime = pos * audio.duration;
    }

    function updateVolumeIcon(v) {
        if (!els.volumeIcon) return;
        if (v === 0) els.volumeIcon.className = 'fas fa-volume-mute';
        else if (v < 0.5) els.volumeIcon.className = 'fas fa-volume-down';
        else els.volumeIcon.className = 'fas fa-volume-up';
    }

    function showPage(page) {
        if (els.homeSection) els.homeSection.style.display = page === 'home' ? 'block' : 'none';
        if (els.searchSection) els.searchSection.style.display = page === 'search' ? 'block' : 'none';
        if (els.favoritesSection) els.favoritesSection.style.display = page === 'favorites' ? 'block' : 'none';
        const titles = { home: 'Главная', search: 'Поиск в интернете', favorites: 'Избранное' };
        if (els.pageTitle) els.pageTitle.textContent = titles[page] || 'Главная';
        els.navItems.forEach(i => i.classList.toggle('active', i.dataset.page === page));
        if (page === 'home') renderTracks(LOCAL_TRACKS, els.localTracksList);
        if (page === 'favorites') renderFavorites();
        if (page === 'search' && els.searchInput) els.searchInput.focus();
    }

    let audiusHost = null;

    async function getAudiusHost() {
        if (audiusHost) return audiusHost;
        try {
            const res = await fetch('https://api.audius.co');
            if (res.ok) {
                const data = await res.json();
                if (data && Array.isArray(data.data) && data.data.length) {
                    audiusHost = data.data[0].replace(/\/$/, '');
                    return audiusHost;
                }
            }
        } catch (_) {}
        audiusHost = 'https://discoveryprovider.audius.co';
        return audiusHost;
    }

    async function searchAudius(query) {
        const host = await getAudiusHost();
        const url = host + '/v1/tracks/search?query=' + encodeURIComponent(query) + '&app_name=NovaSound&limit=30';
        const res = await fetch(url);
        if (!res.ok) throw new Error('Audius HTTP ' + res.status);
        const data = await res.json();
        const list = (data && data.data) ? data.data : [];
        return list.map(item => {
            const art = item.artwork || {};
            const cover = art['480x480'] || art['1000x1000'] || art['150x150'] || (item.user && item.user.profile_picture && (item.user.profile_picture['480x480'] || item.user.profile_picture['150x150'])) || '';
            const stream = host + '/v1/tracks/' + encodeURIComponent(item.id) + '/stream?app_name=NovaSound';
            return {
                id: 'audius-' + item.id,
                title: item.title || 'Без названия',
                artist: (item.user && item.user.name) ? item.user.name : 'Неизвестный исполнитель',
                cover: cover,
                src: stream,
                durationLabel: item.duration ? formatTime(item.duration) : '',
                source: 'Audius'
            };
        }).filter(t => t.src);
    }

    async function searchOnline(query) {
        const q = (query || '').trim();
        if (!q) {
            if (els.searchStatus) els.searchStatus.textContent = 'Введите запрос для поиска.';
            renderTracks([], els.searchResults);
            return;
        }
        if (els.searchStatus) els.searchStatus.textContent = 'Ищу треки в интернете...';
        if (els.searchResults) els.searchResults.innerHTML = '';
        try {
            const tracks = await searchAudius(q);
            if (tracks.length === 0) {
                const local = LOCAL_TRACKS.filter(t =>
                    (t.title || '').toLowerCase().includes(q.toLowerCase()) ||
                    (t.artist || '').toLowerCase().includes(q.toLowerCase())
                );
                if (local.length) {
                    if (els.searchStatus) els.searchStatus.textContent = 'В интернете ничего не найдено, показаны совпадения из библиотеки.';
                    renderTracks(local, els.searchResults);
                } else {
                    if (els.searchStatus) els.searchStatus.textContent = 'Ничего не найдено. Попробуйте другой запрос.';
                    renderTracks([], els.searchResults);
                }
            } else {
                if (els.searchStatus) els.searchStatus.textContent = 'Найдено треков: ' + tracks.length + '. Доступно воспроизведение целиком.';
                renderTracks(tracks, els.searchResults);
            }
        } catch (err) {
            const local = LOCAL_TRACKS.filter(t =>
                (t.title || '').toLowerCase().includes(q.toLowerCase()) ||
                (t.artist || '').toLowerCase().includes(q.toLowerCase())
            );
            if (local.length) {
                if (els.searchStatus) els.searchStatus.textContent = 'Онлайн-поиск недоступен, показаны совпадения из библиотеки.';
                renderTracks(local, els.searchResults);
            } else {
                if (els.searchStatus) els.searchStatus.textContent = 'Не удалось выполнить поиск. Сервис недоступен или заблокирован сетью.';
                if (els.searchResults) {
                    els.searchResults.innerHTML = '<div class="empty-state"><i class="fas fa-triangle-exclamation"></i><h3>Ошибка поиска</h3><p>Онлайн-каталог недоступен. Проверьте подключение к интернету.</p></div>';
                }
            }
        }
    }

    audio.addEventListener('timeupdate', () => updateProgressUI(audio.currentTime, audio.duration));
    audio.addEventListener('loadedmetadata', () => updateProgressUI(audio.currentTime, audio.duration));
    audio.addEventListener('ended', () => { isPlaying = false; updatePlayButtons(); playByOffset(1); });

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

    if (els.volumeSlider) {
        els.volumeSlider.addEventListener('input', (e) => {
            const v = Number(e.target.value) / 100;
            audio.volume = v;
            updateVolumeIcon(v);
        });
    }

    if (els.searchBtn) els.searchBtn.addEventListener('click', () => searchOnline(els.searchInput ? els.searchInput.value : ''));
    if (els.searchInput) els.searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') searchOnline(els.searchInput.value); });
    if (els.heroSearchBtn) els.heroSearchBtn.addEventListener('click', () => { showPage('search'); });

    els.navItems.forEach(item => {
        item.addEventListener('click', () => showPage(item.dataset.page || 'home'));
    });

    if (els.expandPlayerBtn) els.expandPlayerBtn.addEventListener('click', () => { if (els.expandedPlayer) els.expandedPlayer.style.display = 'flex'; });
    if (els.closeExpandedBtn) els.closeExpandedBtn.addEventListener('click', () => { if (els.expandedPlayer) els.expandedPlayer.style.display = 'none'; });

    renderTracks(LOCAL_TRACKS, els.localTracksList);
    renderFavorites();
    updatePlayButtons();
    updateVolumeIcon(audio.volume);
    showPage('home');
});
