// home-controller.js
// Controlador de la página home. Muestra usuario actual, lista de usuarios y permite registrar nuevos.

import { UserModel } from "../models/user-model.js"; // Importa el modelo de usuario

function initHome() {
  const userData = JSON.parse(localStorage.getItem("currentUser"));
  const welcome = document.getElementById("welcome");
  const userList = document.getElementById("userList");
  const logoutBtn = document.getElementById("logoutBtn");
  const userForm = document.getElementById("userForm");
  const nameInput = document.getElementById("nameInput");
  const emailInput = document.getElementById("emailInput");

  // Mostrar usuario actual
  if (userData && welcome) {
    welcome.textContent = `Bienvenido/a, ${userData.name}`;
  } else {
    window.location.href = "./login.html";
    return;
  }

  // Renderizar lista inicial
  renderUsers();

  // Evento logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("currentUser");
      window.location.href = "./login.html";
    });
  }

  // Evento formulario
  if (userForm) {
    userForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();

      // VALIDACIÓN
      if (name === "" || email === "") {
        alert("Por favor, completa todos los campos.");
        return;
      }

      if (!email.includes("@") || !email.includes(".")) {
        alert("Introduce un correo electrónico válido.");
        return;
      }

      // CREAR OBJETO USUARIO Y GUARDARLO
      const newUser = { name, email };
      UserModel.addUser(newUser); // Método para añadir usuario al modelo

      // ACTUALIZAR LISTA
      renderUsers();
      userForm.reset();
    });
  }

  // Función para renderizar usuarios
  function renderUsers() {
    if (userList) {
      userList.innerHTML = "";
      const allUsers = UserModel.getAll();
      allUsers.forEach((u) => {
        const li = document.createElement("li");
        li.textContent = `${u.name} (${u.email})`;
        userList.appendChild(li);
      });
    }
  }
}

export { initHome };
