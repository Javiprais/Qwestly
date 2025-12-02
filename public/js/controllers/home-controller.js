// home-controller.js
import { UserModel } from "../models/user-model.js";

// Función para obtener y renderizar juegos (usa API/MySQL)
function fetchAndRenderGames() {
    // Asegúrate de que este ID/variable coincide con tu HTML
    const gameGrid = document.getElementById('gameGrid');
    // Usa ruta relativa o base URL, no el localhost explícito si puedes
    const apiEndpoint = '../../api/fetch_games.php';

    if (!gameGrid) return console.error("Contenedor 'gameGrid' no encontrado.");
    gameGrid.innerHTML = '<p>Cargando juegos...</p>';

    fetch(apiEndpoint)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener datos: ' + response.statusText);
            }
            return response.json();
        })
        .then(result => {
            gameGrid.innerHTML = ""; // Limpia el mensaje de carga

            if (result.success && result.data.length > 0) {
                result.data.forEach(game => {
                    const card = document.createElement("div");
                    card.classList.add("game-card");

                    card.innerHTML = `
                        <h3>${game.name}</h3>
                        <p>Nota: ${game.rating}/10</p>
                        <p>Comentario: ${game.comment}</p>
                    `;
                    gameGrid.appendChild(card);
                });

            } else {
                gameGrid.innerHTML = '<p>Aún no hay juegos subidos a Qwestly.</p>';
            }
        })
        .catch(error => {
            console.error('Hubo un problema al cargar los juegos:', error);
            gameGrid.innerHTML = '<p class="error">❌ Error al cargar la lista de juegos.</p>';
        });
}

// Función para enviar datos al servidor (usa API/MySQL POST)
function submitGameData(gameName, gameRating, gameComment) {
    // Usa ruta relativa o base URL, no el localhost explícito si puedes
    const apiEndpoint = '../../api/submit_game.php';

    const dataToSend = {
        name: gameName,
        rating: gameRating,
        comment: gameComment
    };

    fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
    })
        .then(response => {
            if (!response.ok) throw new Error('Error de red o del servidor: ' + response.statusText);
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log("Éxito:", data.message);

                // Recarga la lista después del éxito
                fetchAndRenderGames();

                // Limpia el formulario
                document.getElementById('gameForm').reset();

            } else {
                console.error("Error del servidor:", data.message);
            }
        })
        .catch(error => {
            console.error('Hubo un problema con la solicitud fetch:', error);
        });
}

// Función de Inicialización Principal
function initHome() {
    const userData = JSON.parse(localStorage.getItem("currentUser"));
    const welcome = document.getElementById("welcome");
    const logoutBtn = document.getElementById("logoutBtn");
    const gameForm = document.getElementById("gameForm");

    // 1. **VERIFICACIÓN DE SESIÓN**
    if (!userData) {
        window.location.href = "./login.html";
        return;
    }

    welcome.textContent = `Hola ${userData.name}, administra tus juegos favoritos`;

    // 2. **EVENTOS Y LÓGICA**

    // Logout
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "./login.html";
    });

    // Listener del Formulario de añadir juego
    if (gameForm) {
        gameForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nameInput = document.getElementById('gameName').value;
            const ratingInput = document.getElementById('gameRating').value;
            const commentInput = document.getElementById('gameComment').value;

            submitGameData(nameInput, ratingInput, commentInput);
        });
    }

    // 3. **CARGA INICIAL DE DATOS**
    // Llamamos a la función directamente para cargar los juegos al iniciar la vista
    fetchAndRenderGames();
}

export { initHome };