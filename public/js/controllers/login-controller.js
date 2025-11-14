// login-controller.js
// Controlador de login de usuario

import { UserModel } from "../models/user-model.js";

function initLogin() {

  const backButton = document.getElementById('btn-back');

  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
      // Redirigir a login.html
      //window.location.href = '/Qwestly/public/views/login.html';
    });
  }

  const form = document.getElementById('login-form'); // Debe coincidir con el ID en HTML
  if (!form) return;

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    const email = form.querySelector('#email').value.trim();
    const password = form.querySelector('#password')?.value.trim(); // Si hay password

    const user = UserModel.findByEmail(email);

    if (!user) {
      alert('Usuario no encontrado.');
      return;
    }

    // En este ejemplo básico, no comprobamos password, solo email
    localStorage.setItem('currentUser', JSON.stringify(user));
    window.location.href = './home.html';
  });
}

// Exporta la función de inicialización
export { initLogin };
