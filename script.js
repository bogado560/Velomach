// --- CONFIGURACIÓN DE IDIOMAS ---
const translations = {
    es: {
        loginTitle: "Bienvenido Ciclista",
        loginSub: "Conecta con otros apasionados",
        loginBtn: "Entrar",
        dist: "Distancia",
        startBtn: "Grabar Ruta",
        stopBtn: "Detener",
        market: "Marketplace",
        datingDesc: "Rutas de 100km cada domingo. Busco pareja de ruta."
    },
    en: {
        loginTitle: "Welcome Cyclist",
        loginSub: "Connect with other riders",
        loginBtn: "Login",
        dist: "Distance",
        startBtn: "Record Ride",
        stopBtn: "Stop",
        market: "Marketplace",
        datingDesc: "100km rides every Sunday. Looking for a partner."
    }
};

// --- LÓGICA DE VISTAS ---
function showView(viewId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    if(viewId === 'route') setTimeout(() => map.invalidateSize(), 200);
}

// --- MODO OSCURO / CLARO ---
const themeToggle = document.getElementById('theme-toggle');
themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeToggle.innerHTML = isLight ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
    localStorage.setItem('theme', isLight ? 'dark' : 'light');
});

// --- CAMBIO DE IDIOMA ---
const langSelector = document.getElementById('lang-selector');
langSelector.addEventListener('change', (e) => setLanguage(e.target.value));

function setLanguage(lang) {
    const t = translations[lang];
    document.getElementById('txt-login-title').innerText = t.loginTitle;
    document.getElementById('txt-login-sub').innerText = t.loginSub;
    document.getElementById('txt-login-btn').innerText = t.loginBtn;
    document.getElementById('txt-dist').innerText = t.dist;
    document.getElementById('start-btn').innerText = t.startBtn;
    document.getElementById('txt-market-title').innerText = t.market;
    document.getElementById('txt-dating-desc').innerText = t.datingDesc;
    localStorage.setItem('lang', lang);
}

// --- LOGIN ---
function closeLogin() {
    const email = document.getElementById('email').value;
    if(email.includes('@')) {
        document.getElementById('login-modal').style.fadeOut = "0.5s";
        setTimeout(() => document.getElementById('login-modal').style.display = 'none', 500);
    } else {
        alert("Por favor, ingresa un email válido.");
    }
}

// --- MAPA Y GPS ---
let map = L.map('map').setView([40.4167, -3.7037], 13); // Default Madrid
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let watchId = null;
let path = [];
let polyline = L.polyline([], {color: '#adff2f', weight: 5}).addTo(map);

document.getElementById('start-btn').addEventListener('click', function() {
    const lang = langSelector.value;
    if (!watchId) {
        // Iniciar Grabación
        this.innerText = translations[lang].stopBtn;
        this.style.background = "#ff4757";
        path = [];
        
        watchId = navigator.geolocation.watchPosition(position => {
            const { latitude, longitude } = position.coords;
            const newPos = [latitude, longitude];
            path.push(newPos);
            polyline.setLatLngs(path);
            map.setView(newPos, 15);
            
            // Cálculo rudimentario de distancia
            let d = (path.length * 0.005).toFixed(2); 
            document.getElementById('dist-val').innerText = d;
        }, null, { enableHighAccuracy: true });
    } else {
        // Detener Grabación
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
        this.innerText = translations[lang].startBtn;
        this.style.background = "var(--primary-color)";
        alert("Ruta guardada con éxito.");
    }
});

// --- INICIALIZACIÓN ---
window.onload = () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    const savedLang = localStorage.getItem('lang') || 'es';
    document.documentElement.setAttribute('data-theme', savedTheme);
    langSelector.value = savedLang;
    setLanguage(savedLang);
};
