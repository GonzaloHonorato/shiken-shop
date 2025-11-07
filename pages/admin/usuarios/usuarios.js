// Auth guard
requireAuth(['admin']);

// DOM Elements
const searchInput = document.getElementById('search-input');
const roleFilter = document.getElementById('role-filter');
const usersTableBody = document.getElementById('users-table-body');
const userModal = document.getElementById('user-modal');
const closeModal = document.getElementById('close-modal');
const userDetails = document.getElementById('user-details');
const userRoleSelect = document.getElementById('user-role-select');
const saveRoleBtn = document.getElementById('save-role-btn');
const logoutBtn = document.getElementById('logout-btn');
const notification = document.getElementById('notification');

let users = [];
let currentViewingUser = null;

// Load users
function loadUsers() {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    }
    updateStats();
    renderUsers();
}

// Save users
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
    updateStats();
}

// Update stats
function updateStats() {
    const totalUsers = users.length;
    const totalBuyers = users.filter(u => u.role === 'buyer').length;
    const totalAdmins = users.filter(u => u.role === 'admin').length;

    document.getElementById('total-users').textContent = totalUsers;
    document.getElementById('total-buyers').textContent = totalBuyers;
    document.getElementById('total-admins').textContent = totalAdmins;
}

// Render users
function renderUsers() {
    const searchTerm = searchInput.value.toLowerCase();
    const roleValue = roleFilter.value;

    let filtered = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm) ||
                            user.email.toLowerCase().includes(searchTerm);
        const matchesRole = !roleValue || user.role === roleValue;
        
        return matchesSearch && matchesRole;
    });

    usersTableBody.innerHTML = filtered.map(user => {
        const roleBadge = user.role === 'admin'
            ? `<span class="badge badge-admin">Administrador</span>`
            : `<span class="badge badge-buyer">Comprador</span>`;

        const registerDate = user.registeredAt 
            ? new Date(user.registeredAt).toLocaleDateString('es-ES')
            : 'N/A';

        return `
            <tr class="hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                            ${user.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="text-white font-medium">${user.name}</div>
                    </div>
                </td>
                <td class="px-6 py-4 text-gray-300">${user.email}</td>
                <td class="px-6 py-4">${roleBadge}</td>
                <td class="px-6 py-4 text-gray-300">${registerDate}</td>
                <td class="px-6 py-4 text-right">
                    <button onclick="viewUser('${user.email}')" class="action-btn view-btn text-blue-400 hover:text-blue-300">
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
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/>
                    </svg>
                    <p class="text-lg">No se encontraron usuarios</p>
                </td>
            </tr>
        `;
    }
}

// View user details
function viewUser(email) {
    const user = users.find(u => u.email === email);
    if (!user) return;

    currentViewingUser = user;

    // Get user's purchase history
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(order => order.userId === user.email);
    const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);

    const registerDate = user.registeredAt 
        ? new Date(user.registeredAt).toLocaleDateString('es-ES', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        : 'No disponible';

    userDetails.innerHTML = `
        <div class="grid grid-cols-2 gap-4">
            <div class="col-span-2">
                <div class="flex items-center space-x-4 mb-4">
                    <div class="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                        ${user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 class="text-2xl font-bold text-white">${user.name}</h3>
                        <p class="text-gray-400">${user.email}</p>
                    </div>
                </div>
            </div>

            <div class="bg-gray-900/50 rounded-lg p-4">
                <p class="text-gray-400 text-sm">Rol</p>
                <p class="text-white font-semibold mt-1">
                    ${user.role === 'admin' ? 'Administrador' : 'Comprador'}
                </p>
            </div>

            <div class="bg-gray-900/50 rounded-lg p-4">
                <p class="text-gray-400 text-sm">Fecha de Registro</p>
                <p class="text-white font-semibold mt-1">${registerDate}</p>
            </div>

            <div class="bg-gray-900/50 rounded-lg p-4">
                <p class="text-gray-400 text-sm">Total Compras</p>
                <p class="text-white font-semibold mt-1">${userOrders.length}</p>
            </div>

            <div class="bg-gray-900/50 rounded-lg p-4">
                <p class="text-gray-400 text-sm">Total Gastado</p>
                <p class="text-white font-semibold mt-1">$${totalSpent.toFixed(2)}</p>
            </div>
        </div>
    `;

    userRoleSelect.value = user.role;
    userModal.classList.remove('hidden');
}

// Save role change
function saveRoleChange() {
    if (!currentViewingUser) return;

    const newRole = userRoleSelect.value;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    // Prevent user from changing their own role
    if (currentUser && currentUser.email === currentViewingUser.email) {
        showNotification('No puedes cambiar tu propio rol', 'error');
        return;
    }

    const userIndex = users.findIndex(u => u.email === currentViewingUser.email);
    if (userIndex !== -1) {
        users[userIndex].role = newRole;
        saveUsers();
        renderUsers();
        closeUserModal();
        showNotification('Rol actualizado correctamente', 'success');
    }
}

// Close modal
function closeUserModal() {
    userModal.classList.add('hidden');
    currentViewingUser = null;
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
searchInput.addEventListener('input', renderUsers);
roleFilter.addEventListener('change', renderUsers);
closeModal.addEventListener('click', closeUserModal);
saveRoleBtn.addEventListener('click', saveRoleChange);
logoutBtn.addEventListener('click', logout);

// Close modal on outside click
userModal.addEventListener('click', (e) => {
    if (e.target === userModal) {
        closeUserModal();
    }
});

// Make functions global
window.viewUser = viewUser;

// Initialize
loadUsers();
