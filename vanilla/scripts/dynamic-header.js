// ===================================
// DYNAMIC HEADER - ShikenShop
// Maneja la navegación y sesión del usuario
// ===================================

(function() {
    'use strict';

    // Verificar si el usuario está logueado
    function checkSession() {
        const session = localStorage.getItem('session');
        if (!session) return null;

        try {
            const sessionData = JSON.parse(session);
            const now = new Date().getTime();
            const sessionAge = now - sessionData.loginTime;
            const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutos

            if (sessionAge > SESSION_TIMEOUT) {
                localStorage.removeItem('session');
                return null;
            }

            return sessionData;
        } catch (error) {
            return null;
        }
    }

    // Obtener rutas relativas según la ubicación actual
    function getRelativePaths() {
        const currentPath = window.location.pathname;
        
        // Detectar en qué carpeta estamos
        if (currentPath.includes('/pages/public/')) {
            return {
                adminDashboard: '../../admin/dashboard/dashboard.html',
                buyerDashboard: '../../buyer/dashboard/dashboard.html',
                miCuenta: '../../mi-cuenta/mi-cuenta.html',
                login: '../auth/login.html',
                index: '../../../index.html'
            };
        } else if (currentPath.includes('/pages/admin/')) {
            return {
                adminDashboard: '../dashboard/dashboard.html',
                buyerDashboard: '../../buyer/dashboard/dashboard.html',
                miCuenta: '../../mi-cuenta/mi-cuenta.html',
                login: '../../public/auth/login.html',
                index: '../../../index.html'
            };
        } else if (currentPath.includes('/pages/buyer/')) {
            return {
                adminDashboard: '../../admin/dashboard/dashboard.html',
                buyerDashboard: '../dashboard/dashboard.html',
                miCuenta: '../../mi-cuenta/mi-cuenta.html',
                login: '../../public/auth/login.html',
                index: '../../../index.html'
            };
        } else {
            // Por defecto (desde index.html o carpeta raíz)
            return {
                adminDashboard: './pages/admin/dashboard/dashboard.html',
                buyerDashboard: './pages/buyer/dashboard/dashboard.html',
                miCuenta: './pages/mi-cuenta/mi-cuenta.html',
                login: './pages/public/auth/login.html',
                index: './index.html'
            };
        }
    }

    // Actualizar navegación con sesión
    function updateNavigation() {
        const session = checkSession();
        const navContainer = document.querySelector('header nav > div');
        
        if (!navContainer) return;

        // Buscar el contenedor de links
        const linksContainer = navContainer.querySelector('.md\\:flex');
        if (!linksContainer) return;

        // Obtener rutas relativas
        const paths = getRelativePaths();

        // Si hay sesión, agregar opciones de usuario
        if (session) {
            const displayName = session.name || session.fullName || session.email.split('@')[0];
            
            // Eliminar link de registro si existe
            const registroLink = linksContainer.querySelector('a[href*="registro"]');
            if (registroLink) {
                registroLink.remove();
            }

            // Verificar si ya existe el menú de usuario
            const existingUserMenu = linksContainer.querySelector('.user-menu');
            if (existingUserMenu) return;

            // Crear menú de usuario
            const userMenu = document.createElement('div');
            userMenu.className = 'user-menu relative flex items-center space-x-4';
            
            // Determinar dashboard según rol
            const dashboardUrl = session.role === 'admin' 
                ? paths.adminDashboard
                : paths.buyerDashboard;

            userMenu.innerHTML = `
                <a href="${dashboardUrl}" class="text-white hover:text-indigo-400 transition-colors duration-300">
                    Dashboard
                </a>
                <a href="${paths.miCuenta}" class="text-white hover:text-indigo-400 transition-colors duration-300">
                    Mi Cuenta
                </a>
                <div class="flex items-center space-x-2">
                    <div class="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        ${displayName.charAt(0).toUpperCase()}
                    </div>
                    <span class="text-white text-sm hidden lg:inline">${displayName}</span>
                </div>
                <button id="logout-btn-header" class="text-red-400 hover:text-red-300 transition-colors duration-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                </button>
            `;

            // Insertar antes del carrito
            const carritoLink = linksContainer.querySelector('a[href*="carrito"]');
            if (carritoLink) {
                linksContainer.insertBefore(userMenu, carritoLink);
            } else {
                linksContainer.appendChild(userMenu);
            }

            // Event listener para logout (prevenir duplicados)
            const logoutBtn = document.getElementById('logout-btn-header');
            if (logoutBtn && !logoutBtn.hasAttribute('data-listener-added')) {
                logoutBtn.setAttribute('data-listener-added', 'true');
                logoutBtn.addEventListener('click', handleLogout);
            }
        } else {
            // Si no hay sesión, asegurar que existe el link de login/registro
            const loginLink = linksContainer.querySelector('a[href*="login"]');
            if (!loginLink) {
                const registroLink = linksContainer.querySelector('a[href*="registro"]');
                if (!registroLink) {
                    const newLoginLink = document.createElement('a');
                    newLoginLink.href = paths.login;
                    newLoginLink.className = 'text-white hover:text-indigo-400 transition-colors duration-300';
                    newLoginLink.textContent = 'Iniciar Sesión';
                    
                    const carritoLink = linksContainer.querySelector('a[href*="carrito"]');
                    if (carritoLink) {
                        linksContainer.insertBefore(newLoginLink, carritoLink);
                    } else {
                        linksContainer.appendChild(newLoginLink);
                    }
                }
            }
        }
    }

    // Manejar logout
    function handleLogout(e) {
        // Prevenir ejecuciones múltiples
        if (e) {
            e.preventDefault();
            e.stopImmediatePropagation();
        }
        
        // Verificar si ya se está procesando un logout
        if (window.logoutInProgress) {
            return;
        }
        
        window.logoutInProgress = true;
        
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            localStorage.removeItem('session');
            localStorage.removeItem('currentUser');
            
            const paths = getRelativePaths();
            console.log('Logout - Current path:', window.location.pathname);
            console.log('Logout - Index path:', paths.index);
            window.location.href = paths.index;
        } else {
            // Si el usuario cancela, resetear el flag
            window.logoutInProgress = false;
        }
    }

    // Actualizar contador del carrito
    function updateCartCount() {
        const cartCountElement = document.getElementById('cart-count');
        if (!cartCountElement) return;

        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

        if (totalItems > 0) {
            cartCountElement.textContent = totalItems;
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.textContent = '0';
        }
    }

    // Interceptar clicks en "Proceder a pagar"
    function interceptCheckout() {
        const paths = getRelativePaths();
        
        // Buscar todos los botones de checkout
        const checkoutButtons = document.querySelectorAll('[onclick*="checkout"], [href*="checkout"], button:contains("Proceder"), a:contains("Proceder")');
        
        checkoutButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                const session = checkSession();
                if (!session) {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    if (confirm('Debes iniciar sesión para continuar con la compra. ¿Deseas ir al login?')) {
                        window.location.href = paths.login;
                    }
                    return false;
                }
            });
        });
    }

    // Inicializar cuando el DOM esté listo
    function init() {
        updateNavigation();
        updateCartCount();
        
        // Actualizar contador cada vez que cambie el carrito
        window.addEventListener('storage', function(e) {
            if (e.key === 'cart') {
                updateCartCount();
            }
        });

        // Interceptar checkout después de un pequeño delay para asegurar que el DOM esté completo
        setTimeout(interceptCheckout, 100);
    }

    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Exponer funciones globalmente si es necesario
    window.updateCartCount = updateCartCount;
    window.checkUserSession = checkSession;

})();
