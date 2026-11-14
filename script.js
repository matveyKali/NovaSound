const API_BASE = 'https://api.deezer.com';
const audio = document.getElementById('audioPlayer');
let currentTrack = null;
let isPlaying = false;
let favorites = new Set();
let volume = 0.7;

// DOM elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const trackGrid = document.getElementById('trackGrid');
const chartsGrid = document.getElementById('chartsGrid');
const favoritesGrid = document.getElementById('favoritesGrid');
const playerCover = document.getElementById('playerCover');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const playPauseBtn = document.getElementById('playPauseBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const likeBtn = document.getElementById('likeBtn');
const progress = document.getElementById('progress');
const progressTrack = document.getElementById('progressTrack');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const volumeInput = document.getElementById('volume');
const volumeIcon = document.getElementById('volumeIcon');
const toast = document.getElementById('toast');

// Nav items
const navItems = document.querySelectorAll('.nav-item');

// Init
audio.volume = volume;
volumeInput.value = volume * 100;

// Format time
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// Show toast
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// Render track card
function createTrackCard(track, containerId = 'trackGrid') {
    const container = document.getElementById(containerId);
    const card = document.createElement('div');
    card.className = 'track-card';
    card.dataset.trackId = track.id;
    card.dataset.preview = track.preview || '';
    card.dataset.title = track.title || '';
    card.dataset.artist = track.artist ? track.artist.name : '';
    card.dataset.cover = track.album ? track.album.cover_medium : '';

    const isLiked = favorites.has(track.id);
    card.innerHTML = `
        <div class="track-cover">
            <img src="${track.album ? track.album.cover_medium : ''}" alt="${track.title}">
            <div class="play-badge"><i class="fas fa-play"></i></div>
            <div class="like-overlay ${isLiked ? 'liked' : ''}">
                <i class="fas fa-heart ${isLiked ? 'fas' : 'far'}"></i>
            </div>
        </div>
        <div class="track-info">
            <h3>${escapeHtml(track.title)}</h3>
            <p>${escapeHtml(track.artist ? track.artist.name : 'Неизвестный исполнитель')}</p>
        </div>
    `;

    card.addEventListener('click', (e) => {
        if (e.target.closest('.like-overlay')) return;
        loadTrack(track);
    });

    card.querySelector('.like-overlay').addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(track.id, card.querySelector('.like-overlay i'));
    });

    container.appendChild(card);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Load track into player
function loadTrack(track) {
    currentTrack = track;
    playerCover.src = track.album ? track.album.cover_medium : '';
    playerTitle.textContent = track.title;
    playerArtist.textContent = track.artist ? track.artist.name : 'Неизвестный исполнитель';

    const preview = track.preview;
    if (preview) {
        audio.src = preview;
        audio.play().then(() => {
            isPlaying = true;
            updatePlayButton();
        }).catch(err => {
            console.error('Playback error:', err);
            showToast('Не удалось воспроизвести трек');
        });
    } else {
        audio.src = '';
        showToast('Предпросмотр недоступен для этого трека');
    }

    if (favorites.has(track.id)) {
        likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
        likeBtn.classList.add('liked');
    } else {
        likeBtn.innerHTML = '<i class="far fa-heart"></i>';
        likeBtn.classList.remove('liked');
    }

    document.getElementById('playerBar').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Toggle favorite
function toggleFavorite(trackId, iconEl) {
    if (favorites.has(trackId)) {
        favorites.delete(trackId);
        iconEl.classList.remove('fas');
        iconEl.classList.add('far');
        showToast('Удалено из избранного');
    } else {
        favorites.add(trackId);
        iconEl.classList.remove('far');
        iconEl.classList.add('fas');
        showToast('Добавлено в избранное');
    }

    updateLikeButton();
    renderFavorites();
}

function updateLikeButton() {
    if (!currentTrack) return;
    if (favorites.has(currentTrack.id)) {
        likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
        likeBtn.classList.add('liked');
    } else {
        likeBtn.innerHTML = '<i class="far fa-heart"></i>';
        likeBtn.classList.remove('liked');
    }
}

// Search Deezer
async function searchTracks(query) {
    try {
        const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}&limit=20`);
        const data = await res.json();
        return data.data || [];
    } catch (err) {
        console.error('Search error:', err);
        showToast('Ошибка поиска');
        return [];
    }
}

// Fetch popular charts
async function fetchCharts() {
    try {
        const res = await fetch(`${API_BASE}/chart/0/tracks?limit=20`);
        const data = await res.json();
        return data.data || [];
    } catch (err) {
        console.error('Charts error:', err);
        return [];
    }
}

// Render grid
function renderTracks(tracks, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    tracks.forEach(track => createTrackCard(track, containerId));
}

// Search handler
async function handleSearch() {
    const query = searchInput.value.trim();
    if (!query) {
        trackGrid.innerHTML = '';
        return;
    }
    const tracks = await searchTracks(query);
    renderTracks(tracks, 'trackGrid');
    document.getElementById('searchSection').style.display = 'block';
}

// Player controls
playPauseBtn.addEventListener('click', () => {
    if (!currentTrack) return;
    if (isPlaying) {
        audio.pause();
        isPlaying = false;
    } else {
        audio.play().catch(() => showToast('Не удалось воспроизвести'));
        isPlaying = true;
    }
    updatePlayButton();
});

function updatePlayButton() {
    const icon = playPauseBtn.querySelector('i');
    if (isPlaying) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
    } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    }
}

prevBtn.addEventListener('click', () => {
    if (!currentTrack) return;
    audio.currentTime = 0;
});

nextBtn.addEventListener('click', () => {
    showToast('Включите повтор в настройках (скоро)');
});

likeBtn.addEventListener('click', () => {
    if (!currentTrack) return;
    toggleFavorite(currentTrack.id, likeBtn.querySelector('i'));
});

// Progress
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progress.style.width = pct + '%';
        currentTimeEl.textContent = formatTime(audio.currentTime);
        durationEl.textContent = formatTime(audio.duration);
    }
});

audio.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audio.duration);
});

audio.addEventListener('ended', () => {
    isPlaying = false;
    updatePlayButton();
});

progressTrack.addEventListener('click', (e) => {
    if (!audio.duration) return;
    const rect = progressTrack.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
});

// Volume
volumeInput.addEventListener('input', (e) => {
    volume = e.target.value / 100;
    audio.volume = volume;
    updateVolumeIcon();
});

function updateVolumeIcon() {
    if (volume === 0) {
        volumeIcon.className = 'fas fa-volume-mute';
    } else if (volume < 0.5) {
        volumeIcon.className = 'fas fa-volume-down';
    } else {
        volumeIcon.className = 'fas fa-volume-up';
    }
}

// Navigation
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const page = item.dataset.page;
        document.getElementById('searchSection').style.display = 'none';
        document.getElementById('chartsSection').style.display = 'none';
        document.getElementById('librarySection').style.display = 'none';
        document.getElementById('favoritesSection').style.display = 'none';

        if (page === 'search') {
            document.getElementById('searchSection').style.display = 'block';
            document.getElementById('pageTitle').textContent = 'Поиск музыки';
        } else if (page === 'charts') {
            document.getElementById('chartsSection').style.display = 'block';
            document.getElementById('pageTitle').textContent = 'Чарты';
        } else if (page === 'library') {
            document.getElementById('librarySection').style.display = 'block';
            document.getElementById('pageTitle').textContent = 'Библиотека';
        } else if (page === 'favorites') {
            document.getElementById('favoritesSection').style.display = 'block';
            document.getElementById('pageTitle').textContent = 'Избранное';
            renderFavorites();
        }
    });
});

function renderFavorites() {
    favoritesGrid.innerHTML = '';
    if (favorites.size === 0) {
        favoritesGrid.innerHTML = '<p class="empty-state">Избранное пусто</p>';
        return;
    }
    favorites.forEach(id => {
        // Re-fetch is not ideal, but we store minimal info. For simplicity, skip if not cached.
    });
}

// Search events
searchBtn.addEventListener('click', handleSearch);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch();
});

// Init charts
fetchCharts().then(tracks => renderTracks(tracks, 'chartsGrid'));
