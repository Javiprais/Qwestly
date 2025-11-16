import { UserModel } from "../models/user-model.js";

function initLogin() {

  const form = document.getElementById('login-form');
  if (!form) return;

  const emailInput = form.querySelector('#email');
  const passwordInput = form.querySelector('#password');

  // función para mostrar error
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

  // función para limpiar error
  function clearError(input) {
    input.classList.remove("error");
    const msg = input.parentElement.querySelector(".error-message");
    if (msg) msg.remove();
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // limpiar errores previos
    clearError(emailInput);
    clearError(passwordInput);

    let hasErrors = false;

    if (emailInput.value.trim() === "") {
      showError(emailInput, "El correo es obligatorio.");
      hasErrors = true;
    }

    if (!emailInput.value.includes("@")) {
      showError(emailInput, "Introduce un correo válido.");
      hasErrors = true;
    }

    if (passwordInput.value.trim() === "") {
      showError(passwordInput, "La contraseña es obligatoria.");
      hasErrors = true;
    }

    if (hasErrors) return;

    // comprobación de usuario existente
    const user = UserModel.findByEmail(emailInput.value.trim());
    if (!user) {
      showError(emailInput, "Este usuario no está registrado.");
      return;
    }

    // login ok
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.location.href = "./home.html";
  });
}

export { initLogin };
