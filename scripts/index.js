// ===================================
// INDEX.JS - ShikenShop
// Script principal para la página de inicio
// ===================================

// ============= INICIALIZACIÓN =============

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    updateUIBasedOnAuth();
    setupDashboardLinks();
    setupMobileMenu();
    setupSmoothScroll();
    setupScrollAnimations();
    setupAdditionalEffects();
    console.log('🎮 ShikenShop inicializado correctamente!');
});

// ============= AUTENTICACIÓN =============

function updateUIBasedOnAuth() {
    const session = localStorage.getItem('session');
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    const userName = document.getElementById('user-name');
    const logoutBtn = document.getElementById('logout-btn');
    
    if (session) {
        try {
            const sessionData = JSON.parse(session);
            if (guestMenu) guestMenu.classList.add('hidden');
            if (userMenu) userMenu.classList.remove('hidden');
            if (userName) userName.textContent = sessionData.fullName || sessionData.username;
            updateCartCount();
            if (logoutBtn) {
                logoutBtn.addEventListener('click', handleLogout);
            }
        } catch (error) {
            console.error('Error al parsear sesión:', error);
            showGuestMenu();
        }
    } else {
        showGuestMenu();
    }
}

function showGuestMenu() {
    const guestMenu = document.getElementById('guest-menu');
    const userMenu = document.getElementById('user-menu');
    if (guestMenu) guestMenu.classList.remove('hidden');
    if (userMenu) userMenu.classList.add('hidden');
}

function handleLogout(e) {
    e.preventDefault();
    const confirmLogout = confirm('¿Estás seguro de que quieres cerrar sesión?');
    if (confirmLogout) {
        localStorage.removeItem('session');
        showNotification('Sesión cerrada correctamente', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

function setupDashboardLinks() {
    const session = localStorage.getItem('session');
    if (!session) return;
    
    try {
        const sessionData = JSON.parse(session);
        const dashboardLink = document.getElementById('dashboard-link');
        const accountLink = document.getElementById('account-link');
        
        if (dashboardLink) {
            if (sessionData.role === 'admin') {
                dashboardLink.href = './pages/admin/dashboard/dashboard.html';
            } else {
                dashboardLink.href = './pages/buyer/dashboard/dashboard.html';
            }
        }
        
        if (accountLink) {
            if (sessionData.role === 'admin') {
                accountLink.href = './pages/admin/perfil/perfil.html';
            } else {
                accountLink.href = './pages/buyer/mi-cuenta/mi-cuenta.html';
            }
        }
    } catch (error) {
        console.error('Error al configurar enlaces:', error);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg ${
        type === 'success' ? 'bg-green-500' : 
        type === 'error' ? 'bg-red-500' : 
        'bg-blue-500'
    } text-white max-w-sm`;
    
    notification.style.animation = 'slideInRight 0.3s ease-out';
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ============= MENÚ MÓVIL =============

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const navLinks = nav.querySelector('.md\\:flex');
            if (navLinks) {
                navLinks.classList.toggle('hidden');
                navLinks.classList.toggle('flex');
                navLinks.classList.toggle('flex-col');
                navLinks.classList.toggle('absolute');
                navLinks.classList.toggle('top-full');
                navLinks.classList.toggle('left-0');
                navLinks.classList.toggle('w-full');
                navLinks.classList.toggle('bg-gray-900');
                navLinks.classList.toggle('py-4');
            }
        });
    }
}

// ============= SMOOTH SCROLL =============

function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============= ANIMACIONES DE SCROLL =============

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.game-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });

    document.querySelectorAll('.feature-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ============= EFECTOS ADICIONALES =============

function setupAdditionalEffects() {
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('#inicio');
        if (hero && scrolled < 800) {
            hero.style.transform = `translateY(${scrolled * 0.3}px)`;
            hero.style.opacity = 1 - (scrolled / 800);
        }
    });

    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            card.style.transform = `translateY(-10px) perspective(1000px) rotateX(${-deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
        });
        
        card.addEventListener('mouseleave', function() {
            card.style.transform = 'translateY(0) perspective(1000px) rotateX(0) rotateY(0)';
        });
    });

    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'fixed bottom-8 right-8 z-50 opacity-0 transition-opacity duration-300';
    scrollIndicator.innerHTML = `
        <button class="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors duration-300">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
        </button>
    `;
    document.body.appendChild(scrollIndicator);

    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollIndicator.style.opacity = '1';
        } else {
            scrollIndicator.style.opacity = '0';
        }
    });

    scrollIndicator.querySelector('button').addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============= CARRITO =============

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        if (totalItems > 0) {
            cartCount.classList.add('animate-bounce');
            setTimeout(() => {
                cartCount.classList.remove('animate-bounce');
            }, 1000);
        }
    }
}
