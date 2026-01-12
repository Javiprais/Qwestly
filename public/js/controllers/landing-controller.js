// landing-controller.js

export function initLanding() {
    console.log("Iniciando Landing Controller...");

    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const heroCta = document.getElementById('hero-cta');
    const authContainer = document.getElementById('landing-auth-buttons');

    // 1. Comprobamos si el usuario ya tiene sesión iniciada
    const storedUser = localStorage.getItem('currentUser');

    if (storedUser) {
        const user = JSON.parse(storedUser);
        
        // MODIFICACIÓN DINÁMICA DEL DOM
        // Si ya está logueado, cambiamos los botones del header
        if (authContainer) {
            authContainer.innerHTML = `
                <span style="margin-right: 10px; color: #ddd;">Hola, <strong>${user.name}</strong></span>
                <button id="btn-dashboard" class="btn">Ir a mi Dashboard 🚀</button>
            `;
            
            // Listener para el nuevo botón
            document.getElementById('btn-dashboard').addEventListener('click', () => {
                window.location.href = '../views/home.html';
            });
        }

        // El botón grande del Hero también lleva al dashboard
        if (heroCta) {
            heroCta.textContent = "Ir a mi Dashboard";
            heroCta.addEventListener('click', () => {
                window.location.href = '../views/home.html';
            });
        }

    } else {
        // 2. Si NO está logueado, comportamiento estándar
        
        if (btnRegister) {
            btnRegister.addEventListener('click', () => {
                window.location.href = '../views/register.html';
            });
        }

        if (btnLogin) {
            btnLogin.addEventListener('click', () => {
                window.location.href = '../views/login.html';
            });
        }

        if (heroCta) {
            heroCta.addEventListener('click', () => {
                window.location.href = '../views/register.html';
            });
        }
    }
}