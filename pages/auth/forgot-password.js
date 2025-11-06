// ===================================
// FORGOT PASSWORD - ShikenShop
// ===================================

// DOM Elements
const forgotPasswordForm = document.getElementById('forgot-password-form');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnLoading = document.getElementById('btn-loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const successMessage = document.getElementById('success-message');
const successText = document.getElementById('success-text');

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

// ===================================
// SETUP EVENT LISTENERS
// ===================================
function setupEventListeners() {
    forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    
    emailInput.addEventListener('blur', () => validateEmail(emailInput));
    emailInput.addEventListener('input', () => clearFieldError(emailInput));
    
    emailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            forgotPasswordForm.dispatchEvent(new Event('submit'));
        }
    });
}

// ===================================
// HANDLE FORGOT PASSWORD
// ===================================
async function handleForgotPassword(e) {
    e.preventDefault();
    
    hideMessages();
    
    const email = emailInput.value.trim();
    
    if (!validateEmail(emailInput)) {
        return;
    }
    
    setLoadingState(true);
    
    // Simulate API delay
    await delay(1500);
    
    // Check if email exists in users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (user) {
        // En un sistema real, aquí se enviaría un email
        // Por ahora, generamos un token temporal
        const resetToken = generateResetToken();
        
        // Guardar token con timestamp (válido por 1 hora)
        const resetData = {
            email: user.email,
            token: resetToken,
            expires: Date.now() + (60 * 60 * 1000) // 1 hora
        };
        
        localStorage.setItem('passwordReset', JSON.stringify(resetData));
        
        showSuccess(`Se han enviado las instrucciones de recuperación a ${email}. Revisa tu correo electrónico.`);
        
        // En demo, mostrar el "enlace" en consola
        console.log('🔑 TOKEN DE RECUPERACIÓN (Demo):');
        console.log(`Token: ${resetToken}`);
        console.log(`Válido hasta: ${new Date(resetData.expires).toLocaleString()}`);
        console.log(`\nEn producción, esto se enviaría por email a: ${email}`);
        
        // Limpiar formulario
        emailInput.value = '';
        
        // Redirigir a login después de 3 segundos
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    } else {
        // Por seguridad, mostrar el mismo mensaje aunque el email no exista
        // Esto previene enumeración de usuarios
        showSuccess(`Si el correo ${email} está registrado, recibirás instrucciones para recuperar tu contraseña.`);
        
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 3000);
    }
    
    setLoadingState(false);
}

// ===================================
// VALIDATION
// ===================================
function validateEmail(field) {
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value === '') {
        showFieldError(field, 'Por favor, ingresa tu correo electrónico');
        return false;
    }
    
    if (!emailRegex.test(value)) {
        showFieldError(field, 'Por favor, ingresa un correo electrónico válido');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(input, message) {
    input.classList.add('error');
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) {
        errorSpan.textContent = message;
        errorSpan.classList.remove('hidden');
    }
}

function clearFieldError(input) {
    input.classList.remove('error');
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) {
        errorSpan.classList.add('hidden');
    }
}

// ===================================
// UI HELPERS
// ===================================
function setLoadingState(loading) {
    if (loading) {
        submitBtn.disabled = true;
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
    } else {
        submitBtn.disabled = false;
        btnText.classList.remove('hidden');
        btnLoading.classList.add('hidden');
    }
}

function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    successMessage.classList.add('hidden');
}

function showSuccess(message) {
    successText.textContent = message;
    successMessage.classList.remove('hidden');
    errorMessage.classList.add('hidden');
}

function hideMessages() {
    errorMessage.classList.add('hidden');
    successMessage.classList.add('hidden');
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
function generateResetToken() {
    return 'reset_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log('🔐 Forgot Password System Initialized');
