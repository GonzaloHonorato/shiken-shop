// Cargar carrito al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    initializeCartButtons();
    updateCartCount();
});

// ============= FUNCIONES DEL CARRITO =============

function loadCart() {
    const cart = getCart();
    const emptyCart = document.getElementById('empty-cart');
    const cartContent = document.getElementById('cart-content');
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        emptyCart.classList.remove('hidden');
        cartContent.classList.add('hidden');
    } else {
        emptyCart.classList.add('hidden');
        cartContent.classList.remove('hidden');
        renderCartItems(cart);
        updateCartSummary(cart);
    }
}

function renderCartItems(cart) {
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = createCartItemElement(item, index);
        cartItemsContainer.appendChild(cartItem);
    });
}

function createCartItemElement(item, index) {
    const div = document.createElement('div');
    div.className = 'cart-item bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-purple-500/30 flex flex-col md:flex-row gap-4 items-center';
    div.style.animationDelay = `${index * 0.1}s`;
    
    const discountBadge = item.discount ? `
        <span class="discount-badge absolute top-2 right-2 bg-pink-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -${item.discount}%
        </span>
    ` : '';
    
    const originalPrice = item.discount ? 
        `<span class="text-gray-500 line-through text-sm">$${item.originalPrice.toLocaleString()}</span>` : '';
    
    div.innerHTML = `
        <div class="relative">
            <img src="${item.image}" alt="${item.name}" class="w-full md:w-32 h-32 object-cover rounded-lg">
            ${discountBadge}
        </div>
        
        <div class="flex-1 text-center md:text-left">
            <h4 class="text-xl font-bold text-white mb-1">${item.name}</h4>
            <p class="text-gray-400 text-sm mb-2">${item.category}</p>
            <div class="flex items-center gap-2 justify-center md:justify-start">
                ${originalPrice}
                <span class="text-purple-400 font-bold text-lg">$${item.price.toLocaleString()}</span>
            </div>
        </div>
        
        <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 bg-gray-900 rounded-lg p-1">
                <button onclick="decreaseQuantity(${index})" class="quantity-btn w-8 h-8 flex items-center justify-center text-white hover:bg-purple-600 rounded transition-all duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"></path>
                    </svg>
                </button>
                <span class="quantity-display text-white font-bold w-8 text-center">${item.quantity}</span>
                <button onclick="increaseQuantity(${index})" class="quantity-btn w-8 h-8 flex items-center justify-center text-white hover:bg-purple-600 rounded transition-all duration-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                </button>
            </div>
            
            <button onclick="removeFromCart(${index})" class="delete-btn text-pink-500 hover:text-pink-400 transition-colors duration-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
            </button>
        </div>
    `;
    
    return div;
}

function updateCartSummary(cart) {
    let subtotal = 0;
    let totalDiscount = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        if (item.discount) {
            const discountAmount = (item.originalPrice - item.price) * item.quantity;
            totalDiscount += discountAmount;
        }
    });
    
    const total = subtotal;
    
    // Actualizar DOM con animación
    updatePriceElement('subtotal', subtotal);
    updatePriceElement('discount', totalDiscount);
    updatePriceElement('total', total);
}

function updatePriceElement(elementId, value) {
    const element = document.getElementById(elementId);
    const formattedValue = elementId === 'discount' ? 
        `-$${value.toLocaleString()}` : 
        `$${value.toLocaleString()}`;
    
    // Animación de cambio de precio
    element.classList.add('price-update');
    element.textContent = formattedValue;
    
    setTimeout(() => {
        element.classList.remove('price-update');
    }, 300);
}

// ============= MANIPULACIÓN DEL CARRITO =============

function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function increaseQuantity(index) {
    const cart = getCart();
    cart[index].quantity++;
    saveCart(cart);
    
    // Animación en el contador
    animateQuantityChange(index);
    
    loadCart();
    updateCartCount();
}

function decreaseQuantity(index) {
    const cart = getCart();
    
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        saveCart(cart);
        
        // Animación en el contador
        animateQuantityChange(index);
        
        loadCart();
        updateCartCount();
    } else {
        removeFromCart(index);
    }
}

function removeFromCart(index) {
    const cart = getCart();
    
    // Animación de salida
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems[index]) {
        cartItems[index].classList.add('removing');
        
        setTimeout(() => {
            cart.splice(index, 1);
            saveCart(cart);
            loadCart();
            updateCartCount();
            
            // Mostrar notificación
            showNotification('Producto eliminado del carrito');
        }, 300);
    }
}

function clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        localStorage.removeItem('cart');
        loadCart();
        updateCartCount();
        showNotification('Carrito vaciado');
    }
}

// ============= ACTUALIZAR CONTADOR =============

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        cartCount.classList.add('updated');
        
        setTimeout(() => {
            cartCount.classList.remove('updated');
        }, 500);
    }
}

// ============= ANIMACIONES =============

function animateQuantityChange(index) {
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems[index]) {
        const quantityDisplay = cartItems[index].querySelector('.quantity-display');
        quantityDisplay.classList.add('quantity-change');
        
        setTimeout(() => {
            quantityDisplay.classList.remove('quantity-change');
        }, 300);
    }
}

// ============= CHECKOUT =============

function initializeCartButtons() {
    const checkoutBtn = document.getElementById('checkout-btn');
    const clearCartBtn = document.getElementById('clear-cart-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', processCheckout);
    }
    
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', clearCart);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeCheckoutModal);
    }
}

function processCheckout() {
    const cart = getCart();
    
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío');
        return;
    }
    
    // Verificar si el usuario está logueado usando auth-guard
    const session = getCurrentUser();
    
    if (!session) {
        if (confirm('Debes iniciar sesión para completar la compra. ¿Deseas ir a la página de login?')) {
            window.location.href = '../auth/login.html';
        }
        return;
    }
    
    // Simular procesamiento de pago
    const checkoutBtn = document.getElementById('checkout-btn');
    const originalText = checkoutBtn.innerHTML;
    
    // Manipulación dinámica de HTML y CSS
    checkoutBtn.disabled = true;
    checkoutBtn.innerHTML = '<span class="loading-spinner"></span> Procesando...';
    checkoutBtn.style.opacity = '0.7';
    checkoutBtn.style.cursor = 'not-allowed';
    
    setTimeout(() => {
        // Guardar orden en localStorage
        const order = {
            items: cart,
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
            date: new Date().toISOString(),
            orderNumber: generateOrderNumber()
        };
        
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Limpiar carrito
        localStorage.removeItem('cart');
        
        // Mostrar modal de éxito
        showCheckoutModal();
        
        // Restaurar botón
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML = originalText;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
        
        // Recargar carrito
        loadCart();
        updateCartCount();
    }, 2000);
}

function generateOrderNumber() {
    return 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function showCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.remove('hidden');
    
    // Manipulación dinámica de estilos
    document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    modal.classList.add('hidden');
    
    // Restaurar scroll
    document.body.style.overflow = 'auto';
    
    // Redirigir al inicio
    window.location.href = '../../index.html';
}

// ============= NOTIFICACIONES =============

function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
    notification.style.animation = 'slideInLeft 0.3s ease-out';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ============= MANIPULACIÓN DINÁMICA DE ESTILOS =============

// Agregar efectos hover dinámicos a los botones
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('button');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'all 0.2s ease';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});
