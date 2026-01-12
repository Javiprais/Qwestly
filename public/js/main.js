// main.js
// Punto de entrada principal de la aplicación
// Carga dinámicamente el controlador correspondiente según la página

// Detecta la página actual
const currentPath = window.location.pathname;

// Función para cargar un controlador dinámicamente
// Esta función nos sirve para no cargar todos los controladores en todas las páginas, sino solo el necesario
async function loadController(controllerPath, initFunctionName) {
    try {
        const module = await import(controllerPath);
        if (module[initFunctionName]) {
            module[initFunctionName](); // Llama a la función de inicialización
            console.log(`Controlador cargado: ${controllerPath}`);
        } else {
            console.log(`Función ${initFunctionName} no encontrada en ${controllerPath}`);
        }
    } catch (error) {
        console.log(`Error al cargar el controlador ${controllerPath}:`, error);
    }
}

// Inicializaciones globales (opcional)
document.addEventListener('DOMContentLoaded', () => {
    console.log('Aplicación inicializada');

    // REVISAR
    // Detectar si es la primera visita a la web, para redirigir a landing.html
    if (!localStorage.getItem('firstVisit')) {
        localStorage.setItem('firstVisit', 'true');
        // Evitar bucle si ya estamos en landing
        if (!currentPath.includes('landing.html')) {
            window.location.href = '../views/landing.html';
        }
    }

    // Carga el controlador según la página
    if (currentPath.endsWith('landing.html')) {
        loadController('./controllers/landing-controller.js', 'initLanding');
    } else if (currentPath.endsWith('login.html')) {
        loadController('./controllers/login-controller.js', 'initLogin');
    } else if (currentPath.endsWith('register.html')) {
        loadController('./controllers/register-controller.js', 'initRegister');
    } else if (currentPath.endsWith('home.html')) {
        loadController('./controllers/home-controller.js', 'initHome');
    } else {
        console.log('No hay controlador asignado para esta página:', currentPath);
    }
});