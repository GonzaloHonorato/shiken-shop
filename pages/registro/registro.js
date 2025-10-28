// Actualizar contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initializeFormValidation();
    initializePasswordToggles();
    initializeDynamicStyles();
});

// ============= VALIDACIONES DEL FORMULARIO =============

function initializeFormValidation() {
    const form = document.getElementById('registration-form');
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    // Evento de envío del formulario
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            // Si todas las validaciones pasan
            showSuccessMessage();
            saveUserData();
            
            // Simular guardado y redirección
            setTimeout(() => {
                window.location.href = '../../index.html';
            }, 2000);
        }
    });
    
    // Evento del botón limpiar
    clearBtn.addEventListener('click', function() {
        clearForm();
    });
    
    // Validación en tiempo real para cada campo
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        if (input.id !== 'address') { // La dirección es opcional
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Eliminar error mientras escribe
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        }
    });
}

// Función principal de validación del formulario
function validateForm() {
    let isValid = true;
    
    // Validar Nombre Completo
    const fullname = document.getElementById('fullname');
    if (!validateRequired(fullname, 'El nombre completo es obligatorio')) {
        isValid = false;
    }
    
    // Validar Nombre de Usuario
    const username = document.getElementById('username');
    if (!validateRequired(username, 'El nombre de usuario es obligatorio')) {
        isValid = false;
    }
    
    // Validar Email
    const email = document.getElementById('email');
    if (!validateEmail(email)) {
        isValid = false;
    }
    
    // Validar Contraseña
    const password = document.getElementById('password');
    if (!validatePassword(password)) {
        isValid = false;
    }
    
    // Validar Confirmar Contraseña
    const confirmPassword = document.getElementById('confirm-password');
    if (!validateConfirmPassword(password, confirmPassword)) {
        isValid = false;
    }
    
    // Validar Fecha de Nacimiento
    const birthdate = document.getElementById('birthdate');
    if (!validateBirthdate(birthdate)) {
        isValid = false;
    }
    
    return isValid;
}

// Validar campo individual
function validateField(field) {
    const fieldId = field.id;
    
    switch(fieldId) {
        case 'fullname':
        case 'username':
            return validateRequired(field, `Este campo es obligatorio`);
        case 'email':
            return validateEmail(field);
        case 'password':
            return validatePassword(field);
        case 'confirm-password':
            const password = document.getElementById('password');
            return validateConfirmPassword(password, field);
        case 'birthdate':
            return validateBirthdate(field);
        default:
            return true;
    }
}

// Validación: Campo requerido no vacío
function validateRequired(field, message) {
    const value = field.value.trim();
    
    if (value === '') {
        showFieldError(field, message);
        return false;
    }
    
    showFieldSuccess(field);
    return true;
}

// Validación: Formato de Email
function validateEmail(field) {
    const value = field.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value === '') {
        showFieldError(field, 'El correo electrónico es obligatorio');
        return false;
    }
    
    if (!emailRegex.test(value)) {
        showFieldError(field, 'Por favor, ingresa un correo electrónico válido');
        return false;
    }
    
    showFieldSuccess(field);
    return true;
}

// Validación: Contraseña (6-18 caracteres, al menos 1 número y 1 mayúscula)
function validatePassword(field) {
    const value = field.value;
    
    if (value === '') {
        showFieldError(field, 'La contraseña es obligatoria');
        return false;
    }
    
    if (value.length < 6 || value.length > 18) {
        showFieldError(field, 'La contraseña debe tener entre 6 y 18 caracteres');
        return false;
    }
    
    // Validar que contenga al menos un número
    if (!/\d/.test(value)) {
        showFieldError(field, 'La contraseña debe contener al menos un número');
        return false;
    }
    
    // Validar que contenga al menos una letra mayúscula
    if (!/[A-Z]/.test(value)) {
        showFieldError(field, 'La contraseña debe contener al menos una letra mayúscula');
        return false;
    }
    
    showFieldSuccess(field);
    return true;
}

// Validación: Confirmar Contraseña (debe ser igual a la contraseña)
function validateConfirmPassword(passwordField, confirmField) {
    const password = passwordField.value;
    const confirmPassword = confirmField.value;
    
    if (confirmPassword === '') {
        showFieldError(confirmField, 'Debes confirmar tu contraseña');
        return false;
    }
    
    if (password !== confirmPassword) {
        showFieldError(confirmField, 'Las contraseñas no coinciden');
        return false;
    }
    
    showFieldSuccess(confirmField);
    return true;
}

// Validación: Fecha de Nacimiento (debe tener al menos 13 años)
function validateBirthdate(field) {
    const value = field.value;
    
    if (value === '') {
        showFieldError(field, 'La fecha de nacimiento es obligatoria');
        return false;
    }
    
    const birthDate = new Date(value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Ajustar edad si aún no ha cumplido años este año
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    if (age < 13) {
        showFieldError(field, 'Debes tener al menos 13 años para registrarte');
        return false;
    }
    
    if (age > 120) {
        showFieldError(field, 'Por favor, ingresa una fecha de nacimiento válida');
        return false;
    }
    
    showFieldSuccess(field);
    return true;
}

// ============= FUNCIONES DE UI =============

// Mostrar error en un campo
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    // Manipulación dinámica de CSS y HTML
    field.classList.add('input-error');
    field.classList.remove('input-success');
    field.style.borderColor = '#ec4899';
    field.style.borderWidth = '2px';
    
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
    errorMessage.classList.add('visible');
    errorMessage.style.display = 'block';
    errorMessage.style.color = '#ec4899';
    
    // Agregar animación de shake
    field.classList.add('error-shake');
    setTimeout(() => {
        field.classList.remove('error-shake');
    }, 500);
}

// Mostrar éxito en un campo
function showFieldSuccess(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    // Manipulación dinámica de CSS
    field.classList.remove('input-error');
    field.classList.add('input-success');
    field.style.borderColor = '#10b981';
    field.style.borderWidth = '2px';
    
    errorMessage.classList.add('hidden');
    errorMessage.classList.remove('visible');
    errorMessage.style.display = 'none';
}

// Limpiar error de un campo
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorMessage = formGroup.querySelector('.error-message');
    
    // Manipulación dinámica de CSS
    field.classList.remove('input-error');
    field.style.borderColor = '';
    field.style.borderWidth = '';
    
    errorMessage.classList.add('hidden');
    errorMessage.classList.remove('visible');
}

// Mostrar mensaje de éxito
function showSuccessMessage() {
    const successMessage = document.getElementById('success-message');
    successMessage.classList.remove('hidden');
    successMessage.classList.add('fade-in-down');
    
    // Manipulación dinámica de estilos
    successMessage.style.animation = 'fadeInDown 0.5s ease-out';
    
    // Scroll al mensaje
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Limpiar formulario
function clearForm() {
    const form = document.getElementById('registration-form');
    form.reset();
    
    // Limpiar todos los estados de error/éxito
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.classList.remove('input-error', 'input-success');
        input.style.borderColor = '';
        input.style.borderWidth = '';
        
        const formGroup = input.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        errorMessage.classList.add('hidden');
        errorMessage.classList.remove('visible');
    });
    
    // Ocultar mensaje de éxito si está visible
    const successMessage = document.getElementById('success-message');
    successMessage.classList.add('hidden');
    
    // Animación de limpieza
    const submitBtn = document.getElementById('submit-btn');
    submitBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        submitBtn.style.transform = 'scale(1)';
    }, 200);
}

// Guardar datos del usuario en localStorage
function saveUserData() {
    const userData = {
        fullname: document.getElementById('fullname').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        birthdate: document.getElementById('birthdate').value,
        address: document.getElementById('address').value,
        registrationDate: new Date().toISOString()
    };
    
    // Guardar en localStorage
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
}

// ============= TOGGLE PASSWORD =============

function initializePasswordToggles() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const type = input.getAttribute('type');
            
            // Cambiar tipo de input
            if (type === 'password') {
                input.setAttribute('type', 'text');
                this.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                    </svg>
                `;
            } else {
                input.setAttribute('type', 'password');
                this.innerHTML = `
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                `;
            }
            
            // Animación de toggle
            this.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                this.style.transform = 'rotate(0deg)';
            }, 300);
        });
    });
}

// ============= MANIPULACIÓN DINÁMICA DE ESTILOS =============

function initializeDynamicStyles() {
    const form = document.getElementById('registration-form');
    const inputs = form.querySelectorAll('input, textarea');
    
    // Agregar efectos hover dinámicos
    inputs.forEach(input => {
        input.addEventListener('mouseenter', function() {
            if (!this.classList.contains('input-error')) {
                this.style.transform = 'scale(1.01)';
                this.style.boxShadow = '0 0 20px rgba(147, 51, 234, 0.3)';
            }
        });
        
        input.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '';
        });
        
        // Efecto de foco
        input.addEventListener('focus', function() {
            const label = this.closest('.form-group').querySelector('label');
            label.style.color = '#9333ea';
            label.style.transform = 'scale(1.05)';
            label.style.transition = 'all 0.3s ease';
        });
        
        input.addEventListener('blur', function() {
            const label = this.closest('.form-group').querySelector('label');
            label.style.color = '';
            label.style.transform = 'scale(1)';
        });
    });
    
    // Efectos dinámicos en los botones
    const submitBtn = document.getElementById('submit-btn');
    const clearBtn = document.getElementById('clear-btn');
    
    submitBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.05) translateY(-2px)';
    });
    
    submitBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
    });
    
    clearBtn.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
}

// ============= CARRITO DE COMPRAS =============

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCount = document.getElementById('cart-count');
    
    if (cartCount) {
        cartCount.textContent = totalItems;
        
        // Animación cuando cambia el contador
        if (totalItems > 0) {
            cartCount.style.transform = 'scale(1.3)';
            setTimeout(() => {
                cartCount.style.transform = 'scale(1)';
            }, 300);
        }
    }
}

// ============= MENÚ MÓVIL =============

const menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
    menuToggle.addEventListener('click', function() {
        // Aquí puedes agregar funcionalidad para el menú móvil si lo necesitas
        alert('Menú móvil - Funcionalidad pendiente');
    });
}
