// login-controller.js - Conectado a PHP
export function initLogin() {
    console.log("Iniciando Login Controller (PHP)...");

    const form = document.getElementById('login-form');
    if (!form) return;

    const emailInput = form.querySelector('#email');
    const passwordInput = form.querySelector('#password');
    const togglePass = document.getElementById("toggle-login-pass");

    // Helpers Visuales
    function showError(input, message) {
        input.classList.add("error");
        let msg = input.parentElement.querySelector(".error-msg");
        if (!msg) msg = input.parentElement.parentElement.querySelector(".error-msg");
        if (msg) msg.textContent = message;
    }

    function clearErrors() {
        [emailInput, passwordInput].forEach(input => {
            input.classList.remove("error");
            let msg = input.parentElement.querySelector(".error-msg");
            if (!msg) msg = input.parentElement.parentElement.querySelector(".error-msg");
            if (msg) msg.textContent = "";
        });
    }

    if (togglePass) {
        togglePass.addEventListener("click", () => {
            const type = passwordInput.type === "password" ? "text" : "password";
            passwordInput.type = type;
            togglePass.textContent = type === "password" ? "👁️" : "🙈";
        });
    }

    // --- ENVÍO AL BACKEND ---
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        clearErrors();

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (!email || !password) {
            if(!email) showError(emailInput, "Campo requerido");
            if(!password) showError(passwordInput, "Campo requerido");
            return;
        }

        try {
            const response = await fetch('../../api/login.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Login OK: PHP devuelve el objeto 'user' (sin pass)
                // Lo guardamos en localStorage para que el Home sepa quién somos
                localStorage.setItem("currentUser", JSON.stringify(data.user));
                
                window.location.href = "./home.html";
            } else {
                // Error de credenciales
                showError(passwordInput, data.message || "Credenciales incorrectas");
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión.');
        }
    });
}