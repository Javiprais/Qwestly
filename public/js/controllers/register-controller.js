// register-controller.js
// Controlador de registro de usuario

import { UserModel } from "../models/user-model.js";

function initRegister() {
  const form = document.getElementById('register-form'); // Debe coincidir con el ID en HTML
  if (!form) return;

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password').value.trim();

    if (!name || !email || !password) {
      alert('Todos los campos son obligatorios.');
      return;
    }

    if (UserModel.findByEmail(email)) {
      alert('El email ya está registrado.');
      return;
    }

    // Guardar usuario en localStorage
    UserModel.addUser({ name, email, password });
    localStorage.setItem('currentUser', JSON.stringify({ name, email }));

    // Redirigir a home
    window.location.href = './home.html';
  });
}

// Exporta la función de inicialización
export { initRegister };
