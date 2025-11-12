// ===========================================
// BUYER DASHBOARD - JAVASCRIPT
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Buyer Dashboard - Cargando...');
    
    // Require buyer authentication
    const session = requireAuth(['buyer']);
    if (!session) {
        return;
    }

    console.log('✅ Usuario buyer autenticado:', session);
    
    // Initialize dashboard
    initializeDashboard();
    setupEventListeners();
});

// ===========================================
// INITIALIZATION
// ===========================================

function initializeDashboard() {
    loadUserInfo();
    updateCartCount();
}

function loadUserInfo() {
    const session = getCurrentUser();
    if (session) {
        const displayName = session.name || session.fullName || session.username || session.email;
        document.getElementById('user-name').textContent = displayName;
    }
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

// ===========================================
// EVENT LISTENERS
// ===========================================

function setupEventListeners() {
    const logoutBtn = document.getElementById('logout-btn');
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                logout();
                window.location.href = '../../../index.html';
            }
        });
    }
}
