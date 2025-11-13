// landing-controller.js
// Controlador de la landing page. Gestiona enlaces y muestra mensajes de ejemplo.

const welcomeMessages = [ // mensajes de prueba en landing page para ver lo que tengo hecho
  "Gestión de usuarios con localStorage.",
  "Registro e inicio de sesión simples.",
  "Falta: validación avanzada y seguridad.",
  "Falta: Cambiar alerts por mensajes en el DOM.",
  "..."
];

function renderWelcomeMessages() { // Carga los mensajes de la constante welcomeMessages en el contenedor del DOM
  const container = document.getElementById('welcome-messages'); // contenedor en el DOM
  if (!container) return; // si no existe el contenedor, sale de la función
  container.innerHTML = ''; // limpia contenido previo para evitar duplicados
  const ul = document.createElement('ul'); // crea elemento ul
  welcomeMessages.forEach(msg => { // recorre cada mensaje y lo añade como <ul><li></li></ul>
    const li = document.createElement('li'); // crea elemento li
    li.textContent = msg; // añade el texto del mensaje al li
    ul.appendChild(li); // añade el li al ul
  });
  container.appendChild(ul); // añade el ul al contenedor del DOM
}

// Inicializa los eventos de los botones
function initEvents() {
  const btnRegister = document.getElementById('btn-register'); // botón de registro
  const btnLogin = document.getElementById('btn-login'); // botón de login

  if (btnRegister) { // si el botón de registro existe, añade un evento click
    btnRegister.addEventListener('click', function () {
      window.location.href = '../views/register.html';
    });
  }

  if (btnLogin) { // si el botón de login existe, añade un evento click
    btnLogin.addEventListener('click', function () {
      window.location.href = '../views/login.html';
    });
  }
}

// Exporta la función de inicialización para main.js
export function initLanding() {
  renderWelcomeMessages();
  initEvents();
}
