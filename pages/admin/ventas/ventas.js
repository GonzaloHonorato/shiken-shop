// Auth guard
requireAuth(['admin']);

// DOM Elements
const searchInput = document.getElementById('search-input');
const statusFilter = document.getElementById('status-filter');
const sortFilter = document.getElementById('sort-filter');
const ordersTableBody = document.getElementById('orders-table-body');
const orderModal = document.getElementById('order-modal');
const closeModal = document.getElementById('close-modal');
const orderDetails = document.getElementById('order-details');
const orderStatusSelect = document.getElementById('order-status-select');
const saveStatusBtn = document.getElementById('save-status-btn');
const logoutBtn = document.getElementById('logout-btn');
const notification = document.getElementById('notification');

let orders = [];
let currentViewingOrder = null;

// Load orders
function loadOrders() {
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
    updateStats();
    renderOrders();
}

// Save orders
function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
    updateStats();
}

// Update stats
function updateStats() {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(o => o.status === 'pending').length;
    const completedOrders = orders.filter(o => o.status === 'completed').length;

    document.getElementById('total-sales').textContent = `$${totalSales.toFixed(2)}`;
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('completed-orders').textContent = completedOrders;
}

// Render orders
function renderOrders() {
    const searchTerm = searchInput.value.toLowerCase();
    const statusValue = statusFilter.value;
    const sortValue = sortFilter.value;

    let filtered = orders.filter(order => {
        const matchesSearch = order.id.toLowerCase().includes(searchTerm) ||
                            order.userId.toLowerCase().includes(searchTerm);
        const matchesStatus = !statusValue || order.status === statusValue;
        
        return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
        switch (sortValue) {
            case 'date-desc':
                return new Date(b.date) - new Date(a.date);
            case 'date-asc':
                return new Date(a.date) - new Date(b.date);
            case 'total-desc':
                return b.total - a.total;
            case 'total-asc':
                return a.total - b.total;
            default:
                return 0;
        }
    });

    ordersTableBody.innerHTML = filtered.map(order => {
        const statusBadge = getStatusBadge(order.status);
        const orderDate = new Date(order.date).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        const productCount = order.items.length;
        const totalItems = order.items.reduce((sum, item) => sum + item.quantity, 0);

        return `
            <tr class="hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                    <div class="text-white font-medium">#${order.id.substring(0, 8)}</div>
                </td>
                <td class="px-6 py-4">
                    <div class="text-gray-300">${order.userId}</div>
                </td>
                <td class="px-6 py-4 text-gray-300">
                    ${productCount} producto${productCount > 1 ? 's' : ''} (${totalItems} unidad${totalItems > 1 ? 'es' : ''})
                </td>
                <td class="px-6 py-4">
                    <div class="text-white font-bold">$${order.total.toFixed(2)}</div>
                </td>
                <td class="px-6 py-4">${statusBadge}</td>
                <td class="px-6 py-4 text-gray-300">${orderDate}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="viewOrder('${order.id}')" class="action-btn view-btn text-blue-400 hover:text-blue-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    if (filtered.length === 0) {
        ordersTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-gray-400">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    <p class="text-lg">No se encontraron órdenes</p>
                </td>
            </tr>
        `;
    }
}

// Get status badge
function getStatusBadge(status) {
    const badges = {
        pending: '<span class="badge badge-pending">Pendiente</span>',
        completed: '<span class="badge badge-completed">Completado</span>',
        cancelled: '<span class="badge badge-cancelled">Cancelado</span>'
    };
    return badges[status] || '<span class="badge">Desconocido</span>';
}

// View order details
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    currentViewingOrder = order;

    const orderDate = new Date(order.date).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    const productsHtml = order.items.map(item => `
        <div class="product-item">
            <img src="${item.image || 'https://via.placeholder.com/80x80'}" 
                 alt="${item.name}" 
                 class="w-16 h-16 rounded-lg object-cover mr-4">
            <div class="flex-1">
                <h4 class="text-white font-medium">${item.name}</h4>
                <p class="text-gray-400 text-sm">Cantidad: ${item.quantity} × $${item.price.toFixed(2)}</p>
            </div>
            <div class="text-white font-bold">
                $${(item.quantity * item.price).toFixed(2)}
            </div>
        </div>
    `).join('');

    orderDetails.innerHTML = `
        <div class="space-y-6">
            <!-- Order Info -->
            <div class="grid grid-cols-2 gap-4">
                <div class="bg-gray-900/50 rounded-lg p-4">
                    <p class="text-gray-400 text-sm">ID de Orden</p>
                    <p class="text-white font-semibold mt-1">#${order.id}</p>
                </div>
                <div class="bg-gray-900/50 rounded-lg p-4">
                    <p class="text-gray-400 text-sm">Fecha</p>
                    <p class="text-white font-semibold mt-1">${orderDate}</p>
                </div>
                <div class="bg-gray-900/50 rounded-lg p-4">
                    <p class="text-gray-400 text-sm">Cliente</p>
                    <p class="text-white font-semibold mt-1">${order.userId}</p>
                </div>
                <div class="bg-gray-900/50 rounded-lg p-4">
                    <p class="text-gray-400 text-sm">Estado</p>
                    <div class="mt-1">${getStatusBadge(order.status)}</div>
                </div>
            </div>

            <!-- Products -->
            <div>
                <h3 class="text-white font-bold text-lg mb-4">Productos</h3>
                <div class="space-y-2">
                    ${productsHtml}
                </div>
            </div>

            <!-- Total -->
            <div class="bg-gray-900/50 rounded-lg p-4 flex justify-between items-center">
                <span class="text-white font-bold text-lg">Total</span>
                <span class="text-white font-bold text-2xl">$${order.total.toFixed(2)}</span>
            </div>
        </div>
    `;

    orderStatusSelect.value = order.status;
    orderModal.classList.remove('hidden');
}

// Save status change
function saveStatusChange() {
    if (!currentViewingOrder) return;

    const newStatus = orderStatusSelect.value;
    const orderIndex = orders.findIndex(o => o.id === currentViewingOrder.id);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveOrders();
        renderOrders();
        closeOrderModal();
        showNotification('Estado actualizado correctamente', 'success');
    }
}

// Close modal
function closeOrderModal() {
    orderModal.classList.add('hidden');
    currentViewingOrder = null;
}

// Show notification
function showNotification(message, type = 'info') {
    notification.textContent = message;
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm notification-${type}`;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
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
sortFilter.addEventListener('change', renderOrders);
closeModal.addEventListener('click', closeOrderModal);
saveStatusBtn.addEventListener('click', saveStatusChange);
logoutBtn.addEventListener('click', logout);

// Close modal on outside click
orderModal.addEventListener('click', (e) => {
    if (e.target === orderModal) {
        closeOrderModal();
    }
});

// Make functions global
window.viewOrder = viewOrder;

// Initialize
loadOrders();
