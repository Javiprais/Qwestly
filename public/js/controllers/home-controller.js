// home-controller.js
// Controlador de la página home. Muestra usuario actual y lista de usuarios.

import { UserModel } from "../models/user-model.js"; // Importa el modelo de usuario

function initHome() {
  const userData = JSON.parse(localStorage.getItem("currentUser")); // Datos del usuario actual
  const welcome = document.getElementById("welcome");
  const userList = document.getElementById("userList");
  const logoutBtn = document.getElementById("logoutBtn");

  if (userData && welcome) {
    welcome.textContent = `Bienvenido/a, ${userData.name}`;
  } else {
    window.location.href = "./login.html";
    return;
  }

  // Renderizar lista de usuarios
  if (userList) {
    userList.innerHTML = ''; // Limpiar antes de añadir
    const allUsers = UserModel.getAll();
    allUsers.forEach(u => {
      const li = document.createElement('li');
      li.textContent = `${u.name} (${u.email})`;
      userList.appendChild(li);
    });
  }

  // Evento logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "./login.html";
    });
  }
}

// Exporta la función de inicialización
export { initHome };
