// Auth guard
requireAuth(['admin']);

// DOM Elements
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const stockFilter = document.getElementById('stock-filter');
const productsTableBody = document.getElementById('products-table-body');
const addProductBtn = document.getElementById('add-product-btn');
const productModal = document.getElementById('product-modal');
const closeModal = document.getElementById('close-modal');
const cancelBtn = document.getElementById('cancel-btn');
const productForm = document.getElementById('product-form');
const logoutBtn = document.getElementById('logout-btn');
const notification = document.getElementById('notification');

let products = [];
let editingProductId = null;

// Load products
function loadProducts() {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    } else {
        // Initialize with default products from init-data
        if (window.defaultProducts) {
            products = [...window.defaultProducts];
            saveProducts();
        }
    }
    renderProducts();
}

// Save products
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

// Render products
function renderProducts() {
    const searchTerm = searchInput.value.toLowerCase();
    const category = categoryFilter.value;
    const stockStatus = stockFilter.value;

    let filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        const matchesStock = !stockStatus || 
            (stockStatus === 'available' && product.stock > 0) ||
            (stockStatus === 'out-of-stock' && product.stock === 0);
        
        return matchesSearch && matchesCategory && matchesStock;
    });

    productsTableBody.innerHTML = filtered.map(product => {
        const finalPrice = product.discount > 0 
            ? product.price * (1 - product.discount / 100)
            : product.price;
        
        const stockBadge = product.stock > 0
            ? `<span class="badge badge-success">${product.stock} disponibles</span>`
            : `<span class="badge badge-danger">Sin stock</span>`;

        return `
            <tr class="hover:bg-gray-700/30 transition-colors">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <img src="${product.image}" alt="${product.name}" class="w-12 h-12 rounded-lg object-cover mr-3">
                        <div>
                            <div class="text-white font-medium">${product.name}</div>
                            <div class="text-gray-400 text-sm truncate max-w-xs">${product.description}</div>
                        </div>
                    </div>
                </td>
                <td class="px-6 py-4">
                    <span class="badge badge-info bg-indigo-500/20 text-indigo-400">${product.category.toUpperCase()}</span>
                </td>
                <td class="px-6 py-4 text-white">
                    ${product.discount > 0 
                        ? `<span class="line-through text-gray-500">$${product.price.toFixed(2)}</span> <span class="text-green-400 font-bold">$${finalPrice.toFixed(2)}</span>`
                        : `<span class="font-bold">$${product.price.toFixed(2)}</span>`
                    }
                </td>
                <td class="px-6 py-4">
                    ${product.discount > 0 
                        ? `<span class="text-green-400 font-semibold">${product.discount}% OFF</span>`
                        : `<span class="text-gray-500">-</span>`
                    }
                </td>
                <td class="px-6 py-4">
                    ${stockBadge}
                </td>
                <td class="px-6 py-4 text-right">
                    <button onclick="editProduct('${product.id}')" class="action-btn edit-btn text-blue-400 hover:text-blue-300 mr-2">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                    </button>
                    <button onclick="deleteProduct('${product.id}')" class="action-btn delete-btn text-red-400 hover:text-red-300">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                    </button>
                </td>
            </tr>
        `;
    }).join('');

    if (filtered.length === 0) {
        productsTableBody.innerHTML = `
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-400">
                    <svg class="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                    </svg>
                    <p class="text-lg">No se encontraron productos</p>
                </td>
            </tr>
        `;
    }
}

// Open modal for new product
function openNewProductModal() {
    editingProductId = null;
    document.getElementById('modal-title').textContent = 'Nuevo Producto';
    productForm.reset();
    productModal.classList.remove('hidden');
}

// Edit product
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    editingProductId = productId;
    document.getElementById('modal-title').textContent = 'Editar Producto';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-discount').value = product.discount || 0;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-image').value = product.image;

    productModal.classList.remove('hidden');
}

// Delete product
function deleteProduct(productId) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    products = products.filter(p => p.id !== productId);
    saveProducts();
    renderProducts();
    showNotification('Producto eliminado correctamente', 'success');
}

// Save product
function saveProduct(e) {
    e.preventDefault();

    const productData = {
        id: editingProductId || 'product_' + Date.now(),
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        discount: parseInt(document.getElementById('product-discount').value) || 0,
        stock: parseInt(document.getElementById('product-stock').value),
        image: document.getElementById('product-image').value || 'https://via.placeholder.com/300x400?text=Game'
    };

    if (editingProductId) {
        // Update existing product
        const index = products.findIndex(p => p.id === editingProductId);
        if (index !== -1) {
            products[index] = productData;
            showNotification('Producto actualizado correctamente', 'success');
        }
    } else {
        // Add new product
        products.push(productData);
        showNotification('Producto creado correctamente', 'success');
    }

    saveProducts();
    renderProducts();
    closeProductModal();
}

// Close modal
function closeProductModal() {
    productModal.classList.add('hidden');
    productForm.reset();
    editingProductId = null;
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
searchInput.addEventListener('input', renderProducts);
categoryFilter.addEventListener('change', renderProducts);
stockFilter.addEventListener('change', renderProducts);
addProductBtn.addEventListener('click', openNewProductModal);
closeModal.addEventListener('click', closeProductModal);
cancelBtn.addEventListener('click', closeProductModal);
productForm.addEventListener('submit', saveProduct);
logoutBtn.addEventListener('click', logout);

// Close modal on outside click
productModal.addEventListener('click', (e) => {
    if (e.target === productModal) {
        closeProductModal();
    }
});

// Make functions global
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;

// Initialize
loadProducts();
