// home-controller.js
import { UserModel } from "../models/user-model.js";

function initHome() {
  const userData = JSON.parse(localStorage.getItem("currentUser"));
  const welcome = document.getElementById("welcome");
  const logoutBtn = document.getElementById("logoutBtn");

  if (!userData) {
    window.location.href = "./login.html";
    return;
  }

  // Mensaje de bienvenida actualizado
  welcome.textContent = `Hola ${userData.name}, administra tus juegos favoritos`;

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    window.location.href = "./login.html";
  });

  // Formulario de añadir juego
  const gameForm = document.getElementById("gameForm");
  const gameGrid = document.getElementById("gameGrid");

  function renderGameCards() {
    gameGrid.innerHTML = "";
    const games = UserModel.getUserGames(userData.email);
    games.forEach((g) => {
      const card = document.createElement("div");
      card.classList.add("game-card");
      card.innerHTML = `
        <h3>${g.title}</h3>
        <p>Nota: ${g.score}/10</p>
        <p>${g.message}</p>
      `;
      gameGrid.appendChild(card);
    });
  }

  renderGameCards();

  // Añadir juego
  gameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("gameName").value.trim();
    const score = parseInt(document.getElementById("gameRating").value);
    const message = document.getElementById("gameComment").value.trim();

    if (!title || isNaN(score) || score < 1 || score > 10) {
      alert("Introduce un título y nota válida (1-10).");
      return;
    }

    UserModel.addGameToUser(userData.email, { title, score, message });
    renderGameCards();
    gameForm.reset();
  });
}

export { initHome };
