// ===================================
// LOGIN SYSTEM - ShikenShop
// ===================================

// Constants
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutos
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos

// DOM Elements
const loginForm = document.getElementById('login-form');
const identifierInput = document.getElementById('identifier');
const passwordInput = document.getElementById('password');
const togglePasswordBtn = document.getElementById('toggle-password');
const rememberMeCheckbox = document.getElementById('remember-me');
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
    initializeData();
    checkExistingSession();
    setupEventListeners();
    checkLoginAttempts();
    displayRegistrationSuccess();
});

// ===================================
// INITIALIZE DEFAULT DATA
// ===================================
function initializeData() {
    // Check if users already exist
    const existingUsers = localStorage.getItem('users');
    
    if (!existingUsers) {
        const defaultUsers = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@shikenshop.com',
                password: 'Admin123',
                role: 'admin',
                fullName: 'Administrador Principal',
                birthdate: '1990-01-01',
                address: 'Av. Principal 123, Santiago',
                createdAt: new Date().toISOString(),
                active: true
            },
            {
                id: 2,
                username: 'comprador1',
                email: 'comprador@test.com',
                password: 'Comprador123',
                role: 'buyer',
                fullName: 'Juan Pérez',
                birthdate: '1995-05-15',
                address: 'Calle Secundaria 456, Valparaíso',
                createdAt: new Date().toISOString(),
                active: true
            }
        ];
        
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        console.log('✅ Usuarios por defecto creados');
    }
}

// ===================================
// CHECK EXISTING SESSION
// ===================================
function checkExistingSession() {
    const session = localStorage.getItem('session');
    
    if (session) {
        const sessionData = JSON.parse(session);
        
        // Check if session is still valid
        const now = new Date().getTime();
        const sessionAge = now - sessionData.loginTime;
        
        if (sessionAge < SESSION_TIMEOUT) {
            // Session is valid, redirect to appropriate dashboard
            redirectToDashboard(sessionData.role);
        } else {
            // Session expired
            localStorage.removeItem('session');
            showError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
    }
}

// ===================================
// SETUP EVENT LISTENERS
// ===================================
function setupEventListeners() {
    // Form submission
    loginForm.addEventListener('submit', handleLogin);
    
    // Toggle password visibility
    togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
    
    // Input validation on blur
    identifierInput.addEventListener('blur', () => validateField(identifierInput));
    passwordInput.addEventListener('blur', () => validateField(passwordInput));
    
    // Clear errors on input
    identifierInput.addEventListener('input', () => clearFieldError(identifierInput));
    passwordInput.addEventListener('input', () => clearFieldError(passwordInput));
    
    // Enter key on inputs
    identifierInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') passwordInput.focus();
    });
}

// ===================================
// HANDLE LOGIN
// ===================================
async function handleLogin(e) {
    e.preventDefault();
    
    // Clear previous messages
    hideMessages();
    
    // Get form values
    const identifier = identifierInput.value.trim();
    const password = passwordInput.value;
    const rememberMe = rememberMeCheckbox.checked;
    
    // Validate fields
    if (!validateForm(identifier, password)) {
        return;
    }
    
    // Check login attempts
    if (isAccountLocked()) {
        showError('Demasiados intentos fallidos. Por favor, espera 15 minutos.');
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    // Simulate API delay (for realism)
    await delay(1000);
    
    // Authenticate user
    const user = authenticateUser(identifier, password);
    
    if (user) {
        // Success
        handleSuccessfulLogin(user, rememberMe);
    } else {
        // Failed
        handleFailedLogin();
    }
    
    setLoadingState(false);
}

// ===================================
// AUTHENTICATE USER
// ===================================
function authenticateUser(identifier, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user by email or username (with null checks)
    const user = users.find(u => {
        // Verificar que u.email existe
        if (!u.email) return false;
        
        // Verificar por email
        if (u.email.toLowerCase() === identifier.toLowerCase()) {
            return u.password === password && (u.active !== false); // active por defecto es true
        }
        
        // Verificar por username solo si existe
        if (u.username && u.username.toLowerCase() === identifier.toLowerCase()) {
            return u.password === password && (u.active !== false);
        }
        
        return false;
    });
    
    return user || null;
}

// ===================================
// HANDLE SUCCESSFUL LOGIN
// ===================================
function handleSuccessfulLogin(user, rememberMe) {
    // Reset login attempts
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');
    
    // Generate session token (simple for demo)
    const token = generateToken();
    
    // Create session data
    const sessionData = {
        isLoggedIn: true,
        userId: user.id,
        username: user.username,
        email: user.email,
        name: user.name || user.fullName,
        fullName: user.fullName || user.name,
        role: user.role,
        token: token,
        loginTime: new Date().getTime(),
        rememberMe: rememberMe
    };
    
    // Save session
    localStorage.setItem('session', JSON.stringify(sessionData));
    
    // Show success message
    showSuccess(`¡Bienvenido, ${user.name || user.fullName}!`);
    
    // Redirect after a short delay
    setTimeout(() => {
        redirectToDashboard(user.role);
    }, 1500);
}

// ===================================
// HANDLE FAILED LOGIN
// ===================================
function handleFailedLogin() {
    // Increment login attempts
    let attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    attempts++;
    localStorage.setItem('loginAttempts', attempts.toString());
    
    const remainingAttempts = MAX_LOGIN_ATTEMPTS - attempts;
    
    if (remainingAttempts <= 0) {
        // Lock account
        const lockoutTime = new Date().getTime();
        localStorage.setItem('lockoutTime', lockoutTime.toString());
        showError('Cuenta bloqueada por 15 minutos debido a múltiples intentos fallidos.');
    } else {
        showError(`Credenciales incorrectas. Te quedan ${remainingAttempts} intentos.`);
    }
    
    // Shake animation
    identifierInput.classList.add('error');
    passwordInput.classList.add('error');
    
    setTimeout(() => {
        identifierInput.classList.remove('error');
        passwordInput.classList.remove('error');
    }, 400);
}

// ===================================
// REDIRECT TO DASHBOARD
// ===================================
function redirectToDashboard(role) {
    if (role === 'admin') {
        window.location.href = '../../admin/dashboard/dashboard.html';
    } else {
        window.location.href = '../../buyer/dashboard/dashboard.html';
    }
}

// ===================================
// VALIDATION
// ===================================
function validateForm(identifier, password) {
    let isValid = true;
    
    if (!identifier) {
        showFieldError(identifierInput, 'Por favor, ingresa tu email o usuario');
        isValid = false;
    }
    
    if (!password) {
        showFieldError(passwordInput, 'Por favor, ingresa tu contraseña');
        isValid = false;
    }
    
    return isValid;
}

function validateField(input) {
    if (!input.value.trim()) {
        showFieldError(input, 'Este campo es requerido');
        return false;
    }
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
    input.classList.remove('success');
    const errorSpan = document.getElementById(`${input.id}-error`);
    if (errorSpan) {
        errorSpan.classList.add('hidden');
    }
}

// ===================================
// CHECK LOGIN ATTEMPTS
// ===================================
function checkLoginAttempts() {
    const lockoutTime = localStorage.getItem('lockoutTime');
    
    if (lockoutTime) {
        const now = new Date().getTime();
        const timeSinceLockout = now - parseInt(lockoutTime);
        
        if (timeSinceLockout < LOCKOUT_TIME) {
            const remainingTime = Math.ceil((LOCKOUT_TIME - timeSinceLockout) / 60000);
            showError(`Cuenta bloqueada. Intenta nuevamente en ${remainingTime} minutos.`);
            submitBtn.disabled = true;
        } else {
            // Unlock account
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lockoutTime');
        }
    }
}

function isAccountLocked() {
    const lockoutTime = localStorage.getItem('lockoutTime');
    
    if (lockoutTime) {
        const now = new Date().getTime();
        const timeSinceLockout = now - parseInt(lockoutTime);
        return timeSinceLockout < LOCKOUT_TIME;
    }
    
    return false;
}

// ===================================
// DISPLAY REGISTRATION SUCCESS
// ===================================
function displayRegistrationSuccess() {
    const urlParams = new URLSearchParams(window.location.search);
    const registered = urlParams.get('registered');
    
    if (registered === 'true') {
        showSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
        // Remove query parameter
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// ===================================
// UI HELPERS
// ===================================
function togglePasswordVisibility() {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
    
    // Change icon
    const eyeIcon = document.getElementById('eye-icon');
    if (type === 'text') {
        eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
        `;
    } else {
        eyeIcon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        `;
    }
}

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
function generateToken() {
    return 'token_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ===================================
// CONSOLE INFO
// ===================================
console.log('🔐 ShikenShop Login System Initialized');
console.log('📝 Default Users:');
console.log('   Admin: admin@shikenshop.com / Admin123');
console.log('   Buyer: comprador@test.com / Comprador123');
