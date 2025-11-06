// ===================================
// AUTH GUARD - ShikenShop
// Middleware para proteger rutas y verificar roles
// ===================================

const AUTH_CONFIG = {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    LOGIN_URL: '/pages/public/auth/login.html',
    UNAUTHORIZED_URL: '/pages/public/auth/login.html'
};

// ===================================
// CHECK AUTHENTICATION
// ===================================
function checkAuth() {
    const session = localStorage.getItem('session');
    
    if (!session) {
        return null;
    }
    
    try {
        const sessionData = JSON.parse(session);
        
        // Verificar si la sesión es válida
        const now = new Date().getTime();
        const sessionAge = now - sessionData.loginTime;
        
        if (sessionAge > AUTH_CONFIG.SESSION_TIMEOUT) {
            // Sesión expirada
            clearSession();
            return null;
        }
        
        // Renovar timestamp de la sesión
        sessionData.loginTime = now;
        localStorage.setItem('session', JSON.stringify(sessionData));
        
        return sessionData;
    } catch (error) {
        console.error('Error al parsear sesión:', error);
        clearSession();
        return null;
    }
}

// ===================================
// REQUIRE AUTHENTICATION
// ===================================
function requireAuth(allowedRoles = []) {
    const session = checkAuth();
    
    if (!session) {
        // No hay sesión, redirigir a login
        redirectToLogin();
        return false;
    }
    
    // Si se especificaron roles permitidos, verificar
    if (allowedRoles.length > 0) {
        if (!allowedRoles.includes(session.role)) {
            // Usuario no tiene el rol necesario
            redirectToUnauthorized();
            return false;
        }
    }
    
    // Autenticación exitosa
    return session;
}

// ===================================
// REQUIRE GUEST (No autenticado)
// ===================================
function requireGuest() {
    const session = checkAuth();
    
    if (session) {
        // Usuario ya está autenticado, redirigir a dashboard
        redirectToDashboard(session.role);
        return false;
    }
    
    return true;
}

// ===================================
// GET CURRENT USER
// ===================================
function getCurrentUser() {
    return checkAuth();
}

// ===================================
// IS LOGGED IN
// ===================================
function isLoggedIn() {
    const session = checkAuth();
    return session !== null;
}

// ===================================
// HAS ROLE
// ===================================
function hasRole(role) {
    const session = checkAuth();
    return session && session.role === role;
}

// ===================================
// IS ADMIN
// ===================================
function isAdmin() {
    return hasRole('admin');
}

// ===================================
// IS BUYER
// ===================================
function isBuyer() {
    return hasRole('buyer');
}

// ===================================
// LOGOUT
// ===================================
function logout() {
    // Confirmar logout
    const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?');
    
    if (confirmLogout) {
        clearSession();
        
        // Mostrar mensaje de éxito
        showNotification('Sesión cerrada correctamente', 'success');
        
        // Redirigir a home después de un breve delay
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 1000);
    }
}

// ===================================
// CLEAR SESSION
// ===================================
function clearSession() {
    localStorage.removeItem('session');
    console.log('🚪 Sesión cerrada');
}

// ===================================
// REDIRECT FUNCTIONS
// ===================================
function redirectToLogin() {
    const currentPath = window.location.pathname;
    const returnUrl = encodeURIComponent(currentPath);
    window.location.href = `${AUTH_CONFIG.LOGIN_URL}?returnUrl=${returnUrl}`;
}

function redirectToUnauthorized() {
    alert('No tienes permiso para acceder a esta página');
    window.location.href = AUTH_CONFIG.UNAUTHORIZED_URL;
}

function redirectToDashboard(role) {
    if (role === 'admin') {
        window.location.href = '/pages/admin/dashboard/dashboard.html';
    } else if (role === 'buyer') {
        window.location.href = '/pages/buyer/dashboard/dashboard.html';
    } else {
        window.location.href = '/index.html';
    }
}

// ===================================
// UPDATE UI BASED ON AUTH STATE
// ===================================
function updateUIForAuth() {
    const session = checkAuth();
    
    // Buscar elementos de navegación comunes
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (session) {
        // Usuario autenticado
        if (loginBtn) loginBtn.classList.add('hidden');
        if (registerBtn) registerBtn.classList.add('hidden');
        if (userMenu) userMenu.classList.remove('hidden');
        if (userName) userName.textContent = session.fullName || session.username;
        
        // Agregar evento de logout
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            });
        }
    } else {
        // Usuario no autenticado
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (registerBtn) registerBtn.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}

// ===================================
// SHOW NOTIFICATION
// ===================================
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg animate-slideInRight ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white max-w-sm`;
    
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${
                type === 'success' ? '✓' : 
                type === 'error' ? '✗' : 
                'ℹ'
            }</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.add('animate-slideOutRight');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===================================
// INITIALIZE AUTH STATE
// ===================================
function initializeAuth() {
    // Actualizar UI basado en estado de autenticación
    updateUIForAuth();
    
    // Auto-logout después de inactividad
    setupInactivityTimer();
    
    console.log('🛡️ Auth Guard Initialized');
}

// ===================================
// INACTIVITY TIMER
// ===================================
let inactivityTimer;

function setupInactivityTimer() {
    const session = checkAuth();
    
    if (!session) return;
    
    // Reset timer on user activity
    const resetTimer = () => {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(() => {
            showNotification('Sesión cerrada por inactividad', 'info');
            clearSession();
            setTimeout(() => {
                redirectToLogin();
            }, 2000);
        }, AUTH_CONFIG.SESSION_TIMEOUT);
    };
    
    // Events that reset the timer
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
        document.addEventListener(event, resetTimer, true);
    });
    
    // Start timer
    resetTimer();
}

// ===================================
// GET USER DATA FROM LOCALSTORAGE
// ===================================
function getUserData(userId) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.find(u => u.id === userId);
}

// ===================================
// UPDATE SESSION DATA
// ===================================
function updateSessionData(updates) {
    const session = checkAuth();
    
    if (!session) return false;
    
    const updatedSession = { ...session, ...updates };
    localStorage.setItem('session', JSON.stringify(updatedSession));
    
    return true;
}

// ===================================
// AUTO-INITIALIZE ON LOAD
// ===================================
if (typeof window !== 'undefined') {
    // Si estamos en el browser, inicializar automáticamente
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeAuth);
    } else {
        initializeAuth();
    }
}

// ===================================
// EXPORT FUNCTIONS (para usar en otros scripts)
// ===================================
window.AuthGuard = {
    requireAuth,
    requireGuest,
    getCurrentUser,
    isLoggedIn,
    hasRole,
    isAdmin,
    isBuyer,
    logout,
    updateUIForAuth,
    redirectToDashboard,
    showNotification
};

console.log('🔐 Auth Guard Module Loaded');
