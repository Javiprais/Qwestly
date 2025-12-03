// home-controller.js
import { UserModel } from "../models/user-model.js";

function updateSummaryPanel(summary) {
    // Usamos 'N/A' como valor por defecto si no hay datos
    const total = summary.total || 0;
    const average = summary.average || 'N/A';
    const max = summary.max || 'N/A';

    // Si los elementos HTML no existen, la función simplemente termina
    const totalEl = document.getElementById('totalGames');
    const avgEl = document.getElementById('avgRating');
    const maxEl = document.getElementById('maxRating');

    if (totalEl) totalEl.textContent = total;
    if (avgEl) avgEl.textContent = average;
    if (maxEl) maxEl.textContent = max;
}

function fetchAndRenderGames() {

    const userData = JSON.parse(localStorage.getItem("currentUser"));
    if (!userData || !userData.id) {
        return;
    }

    const userId = userData.id;
    const apiEndpoint = `../../api/fetch_games.php?user_id=${userId}`;

    const gameGrid = document.getElementById('gameGrid');

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

            if (result.summary) {
                updateSummaryPanel(result.summary);
            } else {
                updateSummaryPanel({ total: 0, average: 'N/A', max: 'N/A' });
            }

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
                gameGrid.innerHTML = '<p>Aún no has subido ningún juego.</p>';
            }
        })
        .catch(error => {
            console.error('Hubo un problema al cargar los juegos:', error);
            gameGrid.innerHTML = '<p class="error">Error al cargar la lista de juegos.</p>';
            updateSummaryPanel({ total: 0, average: 'Error', max: 'Error' });
        });
}

// Función de Inicialización Principal
function initHome() {

    const userData = JSON.parse(localStorage.getItem("currentUser"));
    const welcome = document.getElementById("welcome");


    if (!userData) {
        window.location.href = "./login.html";
        return;
    }

    welcome.textContent = `Hola ${userData.name}, administra tus juegos favoritos`;

    const logoutBtn = document.getElementById("logoutBtn");
    const gameForm = document.getElementById("gameForm");


    function showError(input, message) {
        input.classList.add("error");
        let msg = input.parentElement.querySelector(".error-message");
        if (!msg) {
            msg = document.createElement("p");
            msg.classList.add("error-message");
            input.parentElement.appendChild(msg);
        }
        msg.textContent = message;
    }

    function clearError(input) {
        input.classList.remove("error");
        const msg = input.parentElement.querySelector(".error-message");
        if (msg) msg.remove();
    }

    function submitGameData(gameName, gameRating, gameComment, userId) {
        const apiEndpoint = '../../api/submit_game.php';
        const dataToSend = { name: gameName, rating: gameRating, comment: gameComment, user_id: userId };

        fetch(apiEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        })
            .then(async response => {
                // Siempre intentamos leer el JSON, incluso si es un error 400
                const data = await response.json();

                if (!response.ok) {
                    // Si es un error (400), lanzamos el objeto JSON completo (data)
                    throw data;
                }
                return data;
            })
            .then(data => {
                // Éxito (201)
                console.log("Éxito:", data.message);
                fetchAndRenderGames();
                gameForm.reset();
                // Limpia cualquier error visual persistente
                clearError(document.getElementById('gameName'));
                clearError(document.getElementById('gameRating'));
                clearError(document.getElementById('gameComment'));
            })
            .catch(errorData => {
                console.error('Detalles del error (400):', errorData);

                // Limpiar errores previos antes de mostrar los nuevos
                clearError(document.getElementById('gameName'));
                clearError(document.getElementById('gameRating'));
                clearError(document.getElementById('gameComment'));

                // Comprobar si el error es de validación (contiene la clave 'errors')
                if (errorData.errors) {

                    if (errorData.errors.name) {
                        showError(document.getElementById('gameName'), errorData.errors.name);
                    }
                    if (errorData.errors.rating) {
                        showError(document.getElementById('gameRating'), errorData.errors.rating);
                    }
                    if (errorData.errors.comment) {
                        showError(document.getElementById('gameComment'), errorData.errors.comment);
                    }

                } else {
                    // Error de conexión o 500
                    alert(`Fallo en el envío: ${errorData.message || 'Error de conexión.'}`);
                }
            });
    }

    if (gameForm) {
        gameForm.addEventListener('submit', function (event) {
            event.preventDefault();

            const nameInput = document.getElementById('gameName').value;
            const ratingInput = document.getElementById('gameRating').value;
            const commentInput = document.getElementById('gameComment').value;

            const userData = JSON.parse(localStorage.getItem("currentUser"));
            submitGameData(nameInput, ratingInput, commentInput, userData.id);
        });
    }

    // Logout
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("currentUser");
        window.location.href = "./login.html";
    });

    // Llamamos a la función directamente para cargar los juegos al iniciar la vista
    fetchAndRenderGames();
}

export { initHome };