// login-controller.js

function initLogin() {
    const apiEndpoint = '../../api/login.php'; // Ruta a tu script PHP de login

    const form = document.getElementById('login-form');
    if (!form) return;

    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');

    // funciones para mostrar/limpiar error
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

    form.addEventListener("submit", async function (event) { // Añadir 'async'
        event.preventDefault();

        // limpiar errores previos
        clearError(emailInput);
        clearError(passwordInput);

        let hasErrors = false;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === "") {
            showError(emailInput, "El correo es obligatorio.");
            hasErrors = true;
        } else if (!email.includes("@")) {
            showError(emailInput, "Introduce un correo válido.");
            hasErrors = true;
        }

        if (password === "") {
            showError(passwordInput, "La contraseña es obligatoria.");
            hasErrors = true;
        }

        if (hasErrors) return;

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();

            if (data.success) {
                // Login OK: Guardamos los datos del usuario (id, name, email) devueltos por PHP
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                
                // Redirigir
                window.location.href = "./home.html";
            } else {
                // Error de credenciales (email o contraseña incorrectos)
                showError(emailInput, data.message); // Mostrar error genérico de credenciales
                clearError(passwordInput); 
            }
        } catch (error) {
            console.error('Error de red durante el login:', error);
            alert('Error de conexión con el servidor. Inténtalo más tarde.');
        }

    });
}

export { initLogin };