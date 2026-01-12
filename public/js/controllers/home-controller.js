// home-controller.js - Conectado a PHP
// Variables globales del módulo
let allGames = [];
let currentUser = null;
const modalOverlay = document.getElementById('modalOverlay');
let gameToDeleteId = null;

// --- 1. RENDERIZADO ---

function updateSummaryPanel(summaryData) {
    // Usamos los datos calculados por PHP
    const totalEl = document.getElementById('totalGames');
    const avgEl = document.getElementById('avgRating');
    const maxEl = document.getElementById('maxRating');

    if(totalEl) totalEl.textContent = summaryData.total;
    if(avgEl) avgEl.textContent = summaryData.average;
    if(maxEl) maxEl.textContent = summaryData.max;
}

function renderGamesList(games) {
    const gameGrid = document.getElementById('gameGrid');
    if(!gameGrid) return;
    
    gameGrid.innerHTML = "";

    if (games.length === 0) {
        gameGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No hay juegos en tu biblioteca.</p>';
        return;
    }

    games.forEach(game => {
        const card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML = `
            <button class="delete-btn" data-id="${game.id}">&times;</button>
            <h3>${game.name}</h3>
            <div class="rating">${game.rating}/10</div>
            <p class="comment">${game.comment || 'Sin comentarios'}</p>
        `;

        // Evento borrar
        card.querySelector('.delete-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            openDeleteModal(game.id, game.name);
        });
        
        gameGrid.appendChild(card);
    });
}

// --- 2. MODAL (BOM) ---
function openDeleteModal(id, title) {
    gameToDeleteId = id;
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    if (modalTitle) modalTitle.textContent = 'Eliminar Juego';
    if (modalBody) modalBody.innerHTML = `<p>¿Borrar <strong>${title}</strong> de la base de datos?</p>`;
    if (modalOverlay) modalOverlay.classList.remove('hidden');
}

function closeModal() {
    if (modalOverlay) modalOverlay.classList.add('hidden');
    gameToDeleteId = null;
}

// --- 3. COMUNICACIÓN CON API PHP ---

async function loadGames() {
    if (!currentUser) return;
    try {
        const response = await fetch(`../../api/fetch_games.php?user_id=${currentUser.id}`);
        const result = await response.json();

        if (result.success) {
            allGames = result.data; // Guardar en memoria para buscador
            renderGamesList(allGames);
            updateSummaryPanel(result.summary); // Usar datos del servidor
        }
    } catch (error) {
        console.error("Error cargando juegos:", error);
    }
}

async function submitNewGame(gameData) {
    try {
        const response = await fetch('../../api/submit_game.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // IMPORTANTE: Tu PHP submit_game.php espera user_id en el body
            body: JSON.stringify({ ...gameData, user_id: currentUser.id })
        });
        const result = await response.json();
        
        if (result.success) {
            loadGames(); // Recargar lista desde BBDD
            return true;
        } else {
            // Manejo de errores de validación PHP (ej. array 'errors')
            if(result.errors) {
                alert("Errores: " + JSON.stringify(result.errors));
            } else {
                alert(result.message);
            }
            return false;
        }
    } catch (e) { console.error(e); return false; }
}

async function deleteGameFromDB() {
    if(!gameToDeleteId) return;
    try {
        const response = await fetch('../../api/delete_game.php', {
            method: 'POST',
            body: JSON.stringify({ id: gameToDeleteId })
        });
        const result = await response.json();
        if (result.success) {
            loadGames(); // Recargar
            closeModal();
        } else {
            alert("Error al borrar: " + result.message);
        }
    } catch (e) { console.error(e); }
}

// --- 4. INICIALIZACIÓN ---
export function initHome() {
    console.log("Iniciando Dashboard (PHP Full Stack)...");
    
    // Verificar sesión
    const stored = localStorage.getItem("currentUser");
    if (!stored) {
        window.location.href = "./login.html";
        return;
    }
    currentUser = JSON.parse(stored);
    
    // UI
    const welcome = document.getElementById("welcome");
    if(welcome) welcome.textContent = `Hola ${currentUser.name}`;

    // Cargar datos
    loadGames();

    // Eventos Formulario
    const form = document.getElementById("gameForm");
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validaciones Regex Frontend (para no molestar al servidor si está mal)
            const nameInput = document.getElementById('gameName');
            const ratingInput = document.getElementById('gameRating');
            const titleRegex = /^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚ:.-]{2,}$/;

            if(!titleRegex.test(nameInput.value)) {
                alert("Título inválido en frontend");
                return;
            }

            const success = await submitNewGame({
                name: nameInput.value,
                rating: ratingInput.value,
                comment: document.getElementById('gameComment').value
            });
            
            if(success) form.reset();
        });
    }

    // Buscador (History API)
    const searchInput = document.getElementById('searchGame');
    if(searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase();
            // Filtramos en cliente sobre lo que ya bajamos de BBDD
            const filtered = allGames.filter(g => g.name.toLowerCase().includes(term));
            renderGamesList(filtered);
            
            // Actualizar URL
            const url = new URL(window.location);
            if(term) url.searchParams.set('search', term);
            else url.searchParams.delete('search');
            window.history.pushState({}, '', url);
        });
    }

    // Modal
    const closeModalBtn = document.getElementById('closeModal');
    const confirmActionBtn = document.getElementById('confirmAction');
    
    if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if(confirmActionBtn) confirmActionBtn.addEventListener('click', deleteGameFromDB);
    
    // Logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "./login.html";
    });

    // Theme logic
    const themeBtn = document.getElementById("themeToggle");
    if (themeBtn) {
        if(localStorage.getItem('theme') === 'light') document.body.classList.add('light-theme');
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            localStorage.setItem('theme', document.body.classList.contains('light-theme') ? 'light' : 'dark');
        });
    }
}