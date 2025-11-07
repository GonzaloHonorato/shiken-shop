// Auth guard
requireAuth(['buyer']);

// DOM Elements
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const ordersContainer = document.getElementById('orders-container');
const emptyState = document.getElementById('empty-state');
const orderModal = document.getElementById('order-modal');
const closeModal = document.getElementById('close-modal');
const orderDetails = document.getElementById('order-details');
const logoutBtn = document.getElementById('logout-btn');
const cartCount = document.getElementById('cart-count');

let orders = [];
let currentUser = null;

// Initialize
function init() {
    currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = '../../public/auth/login.html';
        return;
    }

    loadOrders();
    updateCartCount();
}

// Load orders for current user
function loadOrders() {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders = allOrders.filter(order => order.userId === currentUser.email);
    
    updateStats();
    renderOrders();
}

// Update stats
function updateStats() {
    const totalOrders = orders.length;
    const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
    const totalGames = orders.reduce((sum, order) => 
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('total-spent').textContent = `$${totalSpent.toFixed(2)}`;
    document.getElementById('total-games').textContent = totalGames;
}

// Render orders
function renderOrders() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;

    let filtered = orders.filter(order => {
        const matchesSearch = order.items.some(item => 
            item.name.toLowerCase().includes(searchTerm)
        );
        const matchesStatus = !statusValue || order.status === statusValue;
        
        return matchesSearch && matchesStatus;
    });

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        ordersContainer.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    ordersContainer.classList.remove('hidden');
    emptyState.classList.add('hidden');

    ordersContainer.innerHTML = filtered.map(order => {
        const orderDate = new Date(order.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const statusBadge = getStatusBadge(order.status);
        const firstThreeItems = order.items.slice(0, 3);
        const remainingCount = order.items.length - 3;

        return `
            <div class="order-card bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-indigo-500/20 overflow-hidden hover:border-indigo-500/50 transition-all">
                <div class="p-6">
                    <!-- Header -->
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-white font-bold text-lg">Orden #${order.id.substring(0, 8)}</h3>
                            <p class="text-gray-400 text-sm">${orderDate}</p>
                        </div>
                        ${statusBadge}
                    </div>

                    <!-- Products Preview -->
                    <div class="space-y-2 mb-4">
                        ${firstThreeItems.map(item => `
                            <div class="flex items-center space-x-3">
                                <img src="${item.image || 'https://via.placeholder.com/60x60'}" 
                                     alt="${item.name}" 
                                     class="w-12 h-12 rounded-lg object-cover">
                                <div class="flex-1">
                                    <p class="text-white text-sm font-medium">${item.name}</p>
                                    <p class="text-gray-400 text-xs">Cantidad: ${item.quantity}</p>
                                </div>
                                <p class="text-white font-semibold">$${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                        `).join('')}
                        ${remainingCount > 0 ? `
                            <p class="text-gray-400 text-sm pl-15">+ ${remainingCount} producto${remainingCount > 1 ? 's' : ''} más</p>
                        ` : ''}
                    </div>

                    <!-- Footer -->
                    <div class="flex justify-between items-center pt-4 border-t border-gray-700">
                        <div>
                            <p class="text-gray-400 text-sm">Total</p>
                            <p class="text-white font-bold text-xl">$${order.total.toFixed(2)}</p>
                        </div>
                        <button onclick="viewOrderDetails('${order.id}')" 
                                class="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105">
                            Ver Detalles
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="badge badge-pending">⏳ Pendiente</span>',
        completed: '<span class="badge badge-completed">✓ Completado</span>',
        cancelled: '<span class="badge badge-cancelled">✕ Cancelado</span>'
    };
    return badges[status] || '<span class="badge">Desconocido</span>';
}

// View order details
function viewOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const orderDate = new Date(order.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const statusBadge = getStatusBadge(order.status);
    const statusText = {
        pending: 'Tu pedido está siendo procesado',
        completed: 'Tu pedido ha sido completado',
        cancelled: 'Tu pedido ha sido cancelado'
    };

    const productsHtml = order.items.map(item => `
        <div class="product-item">
            <img src="${item.image || 'https://via.placeholder.com/80x80'}" 
                 alt="${item.name}" 
                 class="w-20 h-20 rounded-lg object-cover mr-4">
            <div class="flex-1">
                <h4 class="text-white font-medium">${item.name}</h4>
                <p class="text-gray-400 text-sm">Cantidad: ${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
            <div class="text-white font-bold text-lg">
                $${(item.quantity * item.price).toFixed(2)}
            </div>
        </div>
    `).join('');

    orderDetails.innerHTML = `
        <div class="space-y-6">
            <!-- Order Info -->
            <div class="bg-gray-900/50 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                    <h3 class="text-white font-bold text-xl">Orden #${order.id}</h3>
                    ${statusBadge}
                </div>
                <p class="text-gray-400 text-sm">${orderDate}</p>
                <p class="text-gray-300 text-sm mt-2">${statusText[order.status]}</p>
            </div>

            <!-- Products -->
            <div>
                <h3 class="text-white font-bold text-lg mb-4">Productos</h3>
                <div class="space-y-3">
                    ${productsHtml}
                </div>
            </div>

            <!-- Summary -->
            <div class="bg-gray-900/50 rounded-lg p-4">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-300">Subtotal</span>
                    <span class="text-white">$${order.total.toFixed(2)}</span>
                </div>
                <div class="flex justify-between items-center mb-2">
                    <span class="text-gray-300">Envío</span>
                    <span class="text-green-400">Gratis</span>
                </div>
                <div class="border-t border-gray-700 pt-2 mt-2">
                    <div class="flex justify-between items-center">
                        <span class="text-white font-bold text-lg">Total</span>
                        <span class="text-white font-bold text-2xl">$${order.total.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    `;

    orderModal.classList.remove('hidden');
}

// Close modal
function closeOrderModal() {
    orderModal.classList.add('hidden');
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    if (count > 0) {
        cartCount.textContent = count;
        cartCount.classList.remove('hidden');
    } else {
        cartCount.classList.add('hidden');
    }
}

// Logout
function logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../../../index.html';
    }
}

// Event Listeners
searchInput.addEventListener('input', renderOrders);
statusFilter.addEventListener('change', renderOrders);
closeModal.addEventListener('click', closeOrderModal);
logoutBtn.addEventListener('click', logout);

// Close modal on outside click
orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        closeOrderModal();
    }
});

// Make functions global
window.viewOrderDetails = viewOrderDetails;

// Initialize
init();
