// ========== USUARIOS ==========
const USERS = {
    'hacker056': '@hacker056',
    'demo': 'demo',
	'demo1': 'demo1',
	'demo2': 'demo2',
	'demo3': 'demo3',
	'demo4': 'demo4'
};

let currentUser = null;
let allChannels = [];
let categoriesSet = new Set();
let currentCategory = 'TODOS';
let currentSearchQuery = '';
let currentHls = null;

// ========== CANALES DESDE IPTV-ORG ==========
const channelsList = [
    { title: "Canal 5", category: "Entretenimiento", logo: "https://i.imgur.com/ohRLICK.jpeg", url: "http://dplatino.net:80/live/ClienteCarlos6m30e/uhaAw4ncqb/362477.m3u8" },
    { title: "", category: "", logo: "", url: "" },
	
	{ title: "BeinSports", category: "Deportes", logo: "https://yt3.googleusercontent.com/ytc/AIdro_newAeNdIQKXPR9m4CFkm-QsEouUiGqm61QcIDVArCpjb0=s900-c-k-c0x00ffffff-no-rj", url: "https://bein-esp-xumo.amagi.tv/playlistR1080p.m3u8" },
    { title: "Claro Sports", category: "Deportes", logo: "https://i.imgur.com/jT3Zla0.png", url: "http://45.5.119.43:4000/play/a024/index.m3u8" },
	{ title: "DSports", category: "Deportes", logo: "https://yt3.googleusercontent.com/TMzi1CE7Cg1HUYJbbYfGSgAVKzYrEPztlDflq6x170GGq53c1Yxv_JAs10QjdHeQ6fiW99hSHg=s900-c-k-c0x00ffffff-no-rj", url: "http://totalplay.site:80/almacosta1/nmAMNbMftq/417199.m3u8" },
	{ title: "ESPN 2", category: "Deportes", logo: "https://i.imgur.com/0aP1oW1.jpeg", url: "http://38.49.128.38:8000/play/a091/index.m3u8" },
	{ title: "", category: "", logo: "", url: "" },
	
	{ title: "Disney Jr", category: "Infantil", logo: "https://i.ytimg.com/vi/XlN37Kmiplc/maxresdefault.jpg", url: "http://38.49.128.38:8000/play/a0bz/index.m3u8" },
    { title: "", category: "", logo: "", url: "" },
	
	{ title: "DPelicula", category: "Cine", logo: "https://cdn.mitvstatic.com/channels/mx_de-pelicula_m.png", url: "https://cloudvideo.servers10.com:8081/8108/index.m3u8" },
    { title: "", category: "", logo: "", url: "" },
	
	{ title: "70s-80s", category: "Música", logo: "https://i.ytimg.com/vi/WnCfvAMM9eY/maxresdefault.jpg", url: "https://585b674743bbb.streamlock.net/9050/9050/playlist.m3u8" },
    { title: "ConectaTV", category: "Música", logo: "https://play-lh.googleusercontent.com/7Rvs0rCdmfWjm-srLmJ5a2UM8hnvGzLC7QCDrUtBxuclIGymGLjVsVHHrv2kdIDZiQ=w240-h480-rw", url: "https://stream8.mexiserver.com:19360/conectatvx/conectatvx.m3u8?PlaylistM3UCL" },
	{ title: "", category: "", logo: "", url: "" },
	
	{ title: "CBCNEW NETWORK", category: "Noticias", logo: "https://i.imgur.com/SjTdhvJ.png", url: "https://aegis-cloudfront-1.tubi.video/c71ce9b6-cddb-4cec-b0db-2f09289f8782/master.m3u8" },
    { title: "", category: "", logo: "", url: "" },
	
	{ title: "La Familia P.Luche", category: "24/7", logo: "https://m.media-amazon.com/images/M/MV5BMjFjZDZkZTctNDBiMy00YzJlLWFkYTAtYzRiYmZjNzgwYTgxXkEyXkFqcGc@._V1_.jpg", url: "http://totalplay.site:80/almacosta1/nmAMNbMftq/149235.m3u8" },
    { title: "", category: "", logo: "", url: "" },
	
	{ title: "History 2", category: "DOCUMENTALES", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a3/History2Logo2019.png", url: "http://38.49.128.38:8000/play/a0dj/index.m3u8" }
	
	
];

// ========== LOGIN ==========
function handleLogin() {
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;
    const errorDiv = document.getElementById('login-error-msg');
    
    if (!username || !password) {
        errorDiv.textContent = 'Ingresa usuario y contraseña';
        return;
    }
    
    if (USERS[username] && USERS[username] === password) {
        currentUser = username;
        document.getElementById('login-screen').style.display = 'none';
        document.getElementById('main-app').style.display = 'block';
        document.getElementById('user-avatar').textContent = username.charAt(0).toUpperCase();
        initApp();
    } else {
        errorDiv.textContent = 'Usuario o contraseña incorrectos';
    }
}

// ========== INICIALIZAR ==========
function initApp() {
    allChannels = channelsList.map((ch, idx) => ({ ...ch, id: idx }));
    
    categoriesSet.clear();
    categoriesSet.add('TODOS');
    allChannels.forEach(ch => categoriesSet.add(ch.category));
    
    renderCategories();
    renderRows();
    updateHero();
    
    // Scroll effect for navbar
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
}

function renderCategories() {
    const navLinks = document.getElementById('nav-links');
    const categories = ['TODOS', ...Array.from(categoriesSet).filter(c => c !== 'TODOS')];
    
    navLinks.innerHTML = categories.map(cat => `
        <a onclick="filterCategory('${cat}')" class="${cat === 'TODOS' ? 'active' : ''}">
            ${cat}
        </a>
    `).join('');
}

function filterCategory(category) {
    currentCategory = category;
    currentSearchQuery = '';
    document.getElementById('search-input').value = '';
    
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');
    
    renderRows();
    updateHero();
    closeSuggestions();
}

function renderRows() {
    let filtered = [...allChannels];
    if (currentCategory !== 'TODOS') {
        filtered = filtered.filter(ch => ch.category === currentCategory);
    }
    if (currentSearchQuery) {
        filtered = filtered.filter(ch => ch.title.toLowerCase().includes(currentSearchQuery.toLowerCase()));
    }
    
    const container = document.getElementById('rows-container');
    if (filtered.length === 0) {
        container.innerHTML = '<div class="no-results"><i class="fas fa-tv"></i><p>No se encontraron canales</p></div>';
        return;
    }
    
    const channelsByCat = {};
    filtered.forEach(ch => {
        if (!channelsByCat[ch.category]) channelsByCat[ch.category] = [];
        channelsByCat[ch.category].push(ch);
    });
    
    let html = '';
    for (const [cat, channels] of Object.entries(channelsByCat)) {
        html += `
            <div class="row">
                <div class="row-header"><h2>${cat}</h2></div>
                <div class="row-items">
        `;
        channels.forEach(channel => {
            html += `
                <div class="channel-card" onclick="playChannel(${channel.id})">
                    <div class="card-image">
                        <img src="${channel.logo}" onerror="this.src='https://via.placeholder.com/320x180/e50914/ffffff?text=TV'">
                        <div class="card-badge">EN VIVO</div>
                    </div>
                    <div class="card-title">${channel.title}</div>
                </div>
            `;
        });
        html += `</div></div>`;
    }
    container.innerHTML = html;
}

function updateHero() {
    let filtered = [...allChannels];
    if (currentCategory !== 'TODOS') {
        filtered = filtered.filter(ch => ch.category === currentCategory);
    }
    if (filtered.length > 0) {
        const random = filtered[Math.floor(Math.random() * filtered.length)];
        document.getElementById('hero-title').textContent = random.title;
        document.getElementById('hero-desc').textContent = `Ver ${random.title} en vivo`;
        document.getElementById('hero-play-btn').onclick = () => playChannel(random.id);
        document.getElementById('hero-section').style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%), url(${random.logo})`;
    }
}

function resetToHome() {
    currentCategory = 'TODOS';
    currentSearchQuery = '';
    document.getElementById('search-input').value = '';
    document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
    if (document.querySelector('.nav-links a')) {
        document.querySelector('.nav-links a').classList.add('active');
    }
    renderRows();
    updateHero();
}

// ========== REPRODUCTOR CON HLS.JS ==========
function playChannel(channelId) {
    const channel = allChannels.find(c => c.id === channelId);
    if (!channel || !channel.url) {
        alert('Canal no disponible');
        return;
    }
    
    console.log('Reproduciendo:', channel.title);
    
    // Destruir HLS anterior si existe
    if (currentHls) {
        currentHls.destroy();
        currentHls = null;
    }
    
    const modal = document.getElementById('player-modal');
    const video = document.getElementById('video-player');
    const playerTitle = document.getElementById('player-title');
    
    playerTitle.textContent = channel.title;
    
    // Detener video actual y limpiar
    video.pause();
    video.removeAttribute('src');
    video.load();
    
    // Configurar reproducción con HLS.js
    if (Hls.isSupported()) {
        currentHls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90
        });
        
        currentHls.loadSource(channel.url);
        currentHls.attachMedia(video);
        
        currentHls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play().catch(e => console.log('Error al reproducir:', e));
        });
        
        currentHls.on(Hls.Events.ERROR, function(event, data) {
            if (data.fatal) {
                console.error('Error fatal HLS:', data);
                alert(`Error al reproducir "${channel.title}". El stream puede no estar disponible.`);
                closePlayer();
            }
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Para Safari que soporta HLS nativo
        video.src = channel.url;
        video.addEventListener('loadedmetadata', function() {
            video.play().catch(e => console.log('Error:', e));
        });
    } else {
        alert('Tu navegador no soporta reproducción de video en vivo');
        return;
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closePlayer() {
    const modal = document.getElementById('player-modal');
    const video = document.getElementById('video-player');
    
    // Destruir HLS
    if (currentHls) {
        currentHls.destroy();
        currentHls = null;
    }
    
    // Limpiar video
    video.pause();
    video.removeAttribute('src');
    video.load();
    
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ========== BÚSQUEDA ==========
function handleSearch() {
    const query = document.getElementById('search-input').value.trim();
    currentSearchQuery = query;
    
    if (query.length < 2) {
        closeSuggestions();
        renderRows();
        updateHero();
        return;
    }
    
    const results = allChannels.filter(ch => ch.title.toLowerCase().includes(query.toLowerCase()));
    showSuggestions(results.slice(0, 5));
    renderRows();
    updateHero();
}

function showSuggestions(results) {
    const suggestionsDiv = document.getElementById('search-suggestions');
    suggestionsDiv.innerHTML = '';
    
    if (results.length === 0) {
        suggestionsDiv.innerHTML = '<div class="suggestion-item">No se encontraron canales</div>';
        suggestionsDiv.classList.add('active');
        return;
    }
    
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
            <img class="suggestion-thumb" src="${result.logo}" onerror="this.src='https://via.placeholder.com/60x34/e50914/ffffff?text=TV'">
            <div class="suggestion-info">
                <div class="suggestion-title">${result.title}</div>
                <div class="suggestion-category">${result.category}</div>
            </div>
        `;
        item.onclick = () => {
            document.getElementById('search-input').value = result.title;
            closeSuggestions();
            playChannel(result.id);
        };
        suggestionsDiv.appendChild(item);
    });
    
    suggestionsDiv.classList.add('active');
}

function closeSuggestions() {
    document.getElementById('search-suggestions').classList.remove('active');
}

// Cerrar sugerencias al hacer clic fuera
document.addEventListener('click', function(e) {
    const searchBox = document.querySelector('.search-box');
    if (searchBox && !searchBox.contains(e.target)) {
        closeSuggestions();
    }
});

// Cerrar reproductor con tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePlayer();
    }
});