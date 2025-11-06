// ===========================================
// ADMIN DASHBOARD - JAVASCRIPT
// ===========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('👑 Admin Dashboard - Cargando...');
    
    // Require admin authentication
    const session = requireAuth(['admin']);
    if (!session) {
        return;
    }

    console.log('✅ Usuario admin autenticado:', session);
    
    // Initialize dashboard
    initializeDashboard();
    setupEventListeners();
});

// ===========================================
// INITIALIZATION
// ===========================================

function initializeDashboard() {
    loadUserInfo();
    loadStatistics();
}

function loadUserInfo() {
    const session = getCurrentUser();
    if (session) {
        document.getElementById('user-name').textContent = session.fullName || session.username;
    }
}

function loadStatistics() {
    // Load products
    const products = JSON.parse(localStorage.getItem('products')) || [];
    document.getElementById('total-products').textContent = products.length;
    
    // Load users
    const users = JSON.parse(localStorage.getItem('users')) || [];
    document.getElementById('total-users').textContent = users.length;
    
    // Load orders
    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    document.getElementById('total-orders').textContent = orders.length;
    
    // Calculate revenue
    const totalRevenue = orders.reduce((sum, order) => {
        return sum + (order.total || 0);
    }, 0);
    document.getElementById('total-revenue').textContent = `$${totalRevenue.toLocaleString()}`;
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
