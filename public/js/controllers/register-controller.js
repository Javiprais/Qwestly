// register-controller.js
// Se elimina: import { UserModel } from "../models/user-model.js"; // ¡Ya no se usa!

function initRegister() {
    const apiEndpoint = '../../api/register.php'; // Ruta a tu script PHP de registro

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

    // Crear funciones de validación visual (SE MANTIENEN)
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

        // Limpiar errores previos
        clearError(nameInput);
        clearError(emailInput);
        clearError(passInput);

        let hasErrors = false;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passInput.value.trim();

        // Validación nombre
        if (name === "") {
            showError(nameInput, "El nombre es obligatorio.");
            hasErrors = true;
        }

        // Validación email
        if (email === "") {
            showError(emailInput, "El correo es obligatorio.");
            hasErrors = true;
        } else if (!email.includes("@")) {
            showError(emailInput, "Introduce un correo válido.");
            hasErrors = true;
        }

        // Validación contraseña
        if (password === "") {
            showError(passInput, "La contraseña es obligatoria.");
            hasErrors = true;
        }

        if (hasErrors) return;

        try {
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            
            const data = await response.json();

            if (data.success) {
                // Registro OK: Redirigir al login
                alert("Registro exitoso. Serás redirigido al login.");
                window.location.href = "./login.html";

            } else {
                // Error de servidor (email ya existe, etc.)
                if (data.message.includes("email ya está registrado")) {
                    showError(emailInput, data.message);
                } else {
                    alert("Error en el registro: " + data.message);
                }
            }
        } catch (error) {
            console.error('Error de red durante el registro:', error);
            alert('Error de conexión con el servidor. Inténtalo más tarde.');
        }
        
    });
}

export { initRegister };