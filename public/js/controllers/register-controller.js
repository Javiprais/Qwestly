// register-controller.js
import { UserModel } from "../models/user-model.js";

function initRegister() {

  const backButton = document.getElementById('btn-back');

  if (backButton) {
    backButton.addEventListener('click', () => {
      window.history.back();
    });
  }

  const form = document.getElementById("register-form");
  if (!form) return;

  const nameInput = form.querySelector("#name");
  const emailInput = form.querySelector("#email");
  const passInput = form.querySelector("#password");
  const togglePass = document.getElementById("toggle-register-pass");

  // Mostrar / ocultar contraseña
  togglePass.addEventListener("click", () => {
    const type = passInput.type === "password" ? "text" : "password";
    passInput.type = type;

    // Cambiar icono
    togglePass.textContent = type === "password" ? "👁️" : "🙈";
  });


  // Crear funciones de validación visual
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

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    // Limpiar errores previos
    clearError(nameInput);
    clearError(emailInput);
    clearError(passInput);

    let hasErrors = false;

    // Validación nombre
    if (nameInput.value.trim() === "") {
      showError(nameInput, "El nombre es obligatorio.");
      hasErrors = true;
    }

    // Validación email
    const email = emailInput.value.trim();
    if (email === "") {
      showError(emailInput, "El correo es obligatorio.");
      hasErrors = true;
    } else if (!email.includes("@")) {
      showError(emailInput, "Introduce un correo válido.");
      hasErrors = true;
    }

    // Comprobar si ya existe
    if (!hasErrors && UserModel.findByEmail(email)) {
      showError(emailInput, "El email ya está registrado.");
      hasErrors = true;
    }

    // Validación contraseña
    if (passInput.value.trim() === "") {
      showError(passInput, "La contraseña es obligatoria.");
      hasErrors = true;
    }

    if (hasErrors) return;

    // Guardar usuario
    UserModel.addUser({
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      password: passInput.value.trim()
    });

    localStorage.setItem("currentUser", JSON.stringify({
      name: nameInput.value.trim(),
      email: emailInput.value.trim()
    }));

    // Redirigir
    window.location.href = "./home.html";
  });
}

export { initRegister };
