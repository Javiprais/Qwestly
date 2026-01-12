// register-controller.js - Conectado a PHP
export function initRegister() {
    console.log("Iniciando Register Controller (PHP)...");

    const form = document.getElementById("register-form");
    const backButton = document.getElementById('btn-back');
    const submitBtn = document.getElementById("submitBtn");

    // Navegación botón atrás
    if (backButton) {
        backButton.addEventListener('click', () => window.history.back());
    }

    if (!form) return;

    // Referencias DOM
    const nameInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");
    const passInput = form.querySelector("#password");
    const passConfirmInput = form.querySelector("#confirm-password");
    const togglePass = document.getElementById("toggle-register-pass");

    // --- REGEX PATTERNS (Requisito obligatorio) ---
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const passRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

    // Estados de validación
    const validationStatus = { name: false, email: false, password: false, confirm: false };

    // --- FUNCIONES VISUALES (Helpers) ---
    function showError(input, message) {
        input.classList.add("error");
        input.classList.remove("valid");
        let msg = input.parentElement.querySelector(".error-msg");
        if (!msg) msg = input.parentElement.parentElement.querySelector(".error-msg");
        if (msg) msg.textContent = message;
    }

    function showValid(input) {
        input.classList.remove("error");
        input.classList.add("valid");
        let msg = input.parentElement.querySelector(".error-msg");
        if (!msg) msg = input.parentElement.parentElement.querySelector(".error-msg");
        if (msg) msg.textContent = "";
    }

    function checkForm() {
        const allValid = Object.values(validationStatus).every(s => s === true);
        if (submitBtn) submitBtn.disabled = !allValid;
    }

    // --- EVENTOS DE VALIDACIÓN EN TIEMPO REAL ---
    
    // 1. Nombre
    nameInput.addEventListener("input", () => {
        if (nameInput.value.trim().length >= 3) {
            showValid(nameInput);
            validationStatus.name = true;
        } else {
            showError(nameInput, "Mínimo 3 caracteres.");
            validationStatus.name = false;
        }
        checkForm();
    });

    // 2. Email
    emailInput.addEventListener("input", () => {
        if (emailRegex.test(emailInput.value.trim())) {
            showValid(emailInput);
            validationStatus.email = true;
        } else {
            showError(emailInput, "Formato inválido.");
            validationStatus.email = false;
        }
        checkForm();
    });

    // 3. Password
    passInput.addEventListener("input", () => {
        const val = passInput.value;
        const reqLen = document.getElementById('req-len');
        const reqNum = document.getElementById('req-num');
        const reqCap = document.getElementById('req-cap');

        const setReq = (el, valid) => {
            el.classList.toggle('valid', valid);
            el.classList.toggle('invalid', !valid);
        };

        setReq(reqLen, val.length >= 8);
        setReq(reqNum, /\d/.test(val));
        setReq(reqCap, /[A-Z]/.test(val));

        if (passRegex.test(val)) {
            showValid(passInput);
            validationStatus.password = true;
        } else {
            passInput.classList.add('error');
            validationStatus.password = false;
        }
        
        if (passConfirmInput.value !== "") passConfirmInput.dispatchEvent(new Event('input'));
        checkForm();
    });

    // 4. Confirmar
    if (passConfirmInput) {
        passConfirmInput.addEventListener("input", () => {
            if (passConfirmInput.value === passInput.value && passConfirmInput.value !== "") {
                showValid(passConfirmInput);
                validationStatus.confirm = true;
            } else {
                showError(passConfirmInput, "Las contraseñas no coinciden.");
                validationStatus.confirm = false;
            }
            checkForm();
        });
    }

    // Toggle Pass
    if(togglePass) {
        togglePass.addEventListener("click", () => {
            const type = passInput.type === "password" ? "text" : "password";
            passInput.type = type;
            togglePass.textContent = type === "password" ? "👁️" : "🙈";
        });
    }

    // --- ENVÍO AL BACKEND (PHP) ---
    form.addEventListener("submit", async function (event) {
        event.preventDefault();
        if (submitBtn.disabled) return;

        const userData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            password: passInput.value.trim()
        };

        try {
            // Fetch a tu API
            const response = await fetch('../../api/register.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert("¡Registro exitoso! Iniciando sesión...");
                window.location.href = "./login.html";
            } else {
                // Si el PHP devuelve error (ej: email duplicado)
                if (data.message.includes("email")) {
                    showError(emailInput, data.message);
                } else {
                    alert("Error: " + data.message);
                }
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión con el servidor.");
        }
    });
}