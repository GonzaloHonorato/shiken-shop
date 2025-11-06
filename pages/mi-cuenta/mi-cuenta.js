// ===========================================
// MY ACCOUNT PAGE - JAVASCRIPT
// ===========================================

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
    // Require authentication (any authenticated user can access)
    if (!requireAuth()) {
        return;
    }

    // Initialize page
    initializePage();
    setupEventListeners();
});

// ===========================================
// INITIALIZATION
// ===========================================

/**
 * Initialize page with user data
 */
function initializePage() {
    loadUserData();
    setupTabs();
}

/**
 * Load current user data into form
 */
function loadUserData() {
    const session = getSession();
    if (!session) {
        redirectToLogin();
        return;
    }

    // Get full user data from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUser = users.find(u => u.email === session.email);

    if (!currentUser) {
        showNotification('Error al cargar datos del usuario', 'error');
        return;
    }

    // Store original data for cancel functionality
    window.originalUserData = { ...currentUser };

    // Populate avatar and display info
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.fullName)}&background=7c3aed&color=fff&size=200`;
    document.getElementById('user-avatar').src = avatarUrl;
    document.getElementById('display-name').textContent = currentUser.fullName;
    document.getElementById('display-role').textContent = currentUser.role === 'admin' ? 'Administrador' : 'Comprador';

    // Populate form fields
    document.getElementById('fullName').value = currentUser.fullName || '';
    document.getElementById('username').value = currentUser.username || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('phone').value = currentUser.phone || '';
    document.getElementById('birthdate').value = currentUser.birthdate || '';
    document.getElementById('address').value = currentUser.address || '';
}

/**
 * Setup tab switching
 */
function setupTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all tabs
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                btn.classList.add('text-gray-400');
                btn.classList.remove('border-purple-500');
                btn.classList.add('border-transparent');
            });

            // Add active class to clicked tab
            button.classList.add('active');
            button.classList.remove('text-gray-400');
            button.classList.add('border-purple-500');
            button.classList.remove('border-transparent');

            // Show corresponding content
            if (button.id === 'tab-profile') {
                document.getElementById('profile-section').classList.remove('hidden');
                document.getElementById('security-section').classList.add('hidden');
            } else if (button.id === 'tab-security') {
                document.getElementById('profile-section').classList.add('hidden');
                document.getElementById('security-section').classList.remove('hidden');
            }
        });
    });
}

// ===========================================
// EVENT LISTENERS
// ===========================================

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Profile form submission
    document.getElementById('profile-form').addEventListener('submit', handleProfileUpdate);

    // Cancel button
    document.getElementById('cancel-btn').addEventListener('click', handleCancel);

    // Password form submission
    document.getElementById('password-form').addEventListener('submit', handlePasswordChange);

    // Password toggle buttons
    document.querySelectorAll('.toggle-password').forEach(button => {
        button.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
            } else {
                input.type = 'password';
            }
        });
    });

    // Real-time validation
    document.getElementById('email').addEventListener('blur', validateEmailField);
    document.getElementById('username').addEventListener('blur', validateUsernameField);
    document.getElementById('fullName').addEventListener('blur', validateFullNameField);
    document.getElementById('new-password').addEventListener('input', validatePasswordField);
    document.getElementById('confirm-password').addEventListener('input', validateConfirmPasswordField);

    // Logout button
    document.getElementById('logout-btn').addEventListener('click', () => {
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            logout();
            window.location.href = '../../index.html';
        }
    });
}

// ===========================================
// PROFILE UPDATE
// ===========================================

/**
 * Handle profile form submission
 */
function handleProfileUpdate(e) {
    e.preventDefault();

    // Clear previous errors
    clearErrors();

    // Get form data
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        birthdate: document.getElementById('birthdate').value,
        address: document.getElementById('address').value.trim()
    };

    // Validate all fields
    if (!validateProfileForm(formData)) {
        showNotification('Por favor corrige los errores en el formulario', 'error');
        return;
    }

    // Get current session and users
    const session = getSession();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserIndex = users.findIndex(u => u.email === session.email);

    if (currentUserIndex === -1) {
        showNotification('Error: Usuario no encontrado', 'error');
        return;
    }

    // Check if email changed and is already in use
    if (formData.email !== session.email) {
        const emailExists = users.some((u, index) => 
            u.email === formData.email && index !== currentUserIndex
        );
        if (emailExists) {
            showFieldError('email', 'Este correo ya está en uso');
            showNotification('El correo electrónico ya está en uso', 'error');
            return;
        }
    }

    // Check if username changed and is already in use
    if (formData.username !== users[currentUserIndex].username) {
        const usernameExists = users.some((u, index) => 
            u.username === formData.username && index !== currentUserIndex
        );
        if (usernameExists) {
            showFieldError('username', 'Este nombre de usuario ya está en uso');
            showNotification('El nombre de usuario ya está en uso', 'error');
            return;
        }
    }

    // Update user data
    users[currentUserIndex] = {
        ...users[currentUserIndex],
        ...formData
    };

    // Save to localStorage
    localStorage.setItem('users', JSON.stringify(users));

    // Update session if email changed
    if (formData.email !== session.email) {
        session.email = formData.email;
        session.fullName = formData.fullName;
        session.username = formData.username;
        localStorage.setItem('session', JSON.stringify(session));
    }

    // Update original data
    window.originalUserData = { ...users[currentUserIndex] };

    // Update display
    document.getElementById('display-name').textContent = formData.fullName;
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=7c3aed&color=fff&size=200`;
    document.getElementById('user-avatar').src = avatarUrl;

    showNotification('Perfil actualizado exitosamente', 'success');
}

/**
 * Handle cancel button
 */
function handleCancel() {
    if (window.originalUserData) {
        // Restore original data
        document.getElementById('fullName').value = window.originalUserData.fullName || '';
        document.getElementById('username').value = window.originalUserData.username || '';
        document.getElementById('email').value = window.originalUserData.email || '';
        document.getElementById('phone').value = window.originalUserData.phone || '';
        document.getElementById('birthdate').value = window.originalUserData.birthdate || '';
        document.getElementById('address').value = window.originalUserData.address || '';

        clearErrors();
        showNotification('Cambios descartados', 'info');
    }
}

// ===========================================
// PASSWORD CHANGE
// ===========================================

/**
 * Handle password change form submission
 */
function handlePasswordChange(e) {
    e.preventDefault();

    // Clear previous errors
    clearPasswordErrors();

    // Get form data
    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate
    if (!validatePasswordForm(currentPassword, newPassword, confirmPassword)) {
        return;
    }

    // Get current user
    const session = getSession();
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const currentUserIndex = users.findIndex(u => u.email === session.email);

    if (currentUserIndex === -1) {
        showNotification('Error: Usuario no encontrado', 'error');
        return;
    }

    // Verify current password
    if (users[currentUserIndex].password !== currentPassword) {
        showPasswordFieldError('current-password', 'La contraseña actual es incorrecta');
        showNotification('La contraseña actual es incorrecta', 'error');
        return;
    }

    // Update password
    users[currentUserIndex].password = newPassword;
    localStorage.setItem('users', JSON.stringify(users));

    // Clear form
    document.getElementById('password-form').reset();

    showNotification('Contraseña actualizada exitosamente', 'success');
}

// ===========================================
// VALIDATION FUNCTIONS
// ===========================================

/**
 * Validate entire profile form
 */
function validateProfileForm(data) {
    let isValid = true;

    // Full name validation
    if (!data.fullName || data.fullName.length < 3) {
        showFieldError('fullName', 'El nombre debe tener al menos 3 caracteres');
        isValid = false;
    }

    // Username validation
    if (!data.username || data.username.length < 3) {
        showFieldError('username', 'El nombre de usuario debe tener al menos 3 caracteres');
        isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(data.username)) {
        showFieldError('username', 'Solo letras, números y guiones bajos');
        isValid = false;
    }

    // Email validation
    if (!validateEmail(data.email)) {
        showFieldError('email', 'Correo electrónico inválido');
        isValid = false;
    }

    // Birthdate validation
    if (!data.birthdate) {
        showFieldError('birthdate', 'La fecha de nacimiento es requerida');
        isValid = false;
    } else {
        const birthDate = new Date(data.birthdate);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        if (age < 13) {
            showFieldError('birthdate', 'Debes tener al menos 13 años');
            isValid = false;
        } else if (age > 120) {
            showFieldError('birthdate', 'Fecha de nacimiento inválida');
            isValid = false;
        }
    }

    // Phone validation (optional)
    if (data.phone && !/^[\d\s+()-]+$/.test(data.phone)) {
        showFieldError('phone', 'Formato de teléfono inválido');
        isValid = false;
    }

    return isValid;
}

/**
 * Validate password change form
 */
function validatePasswordForm(currentPassword, newPassword, confirmPassword) {
    let isValid = true;

    // Current password
    if (!currentPassword) {
        showPasswordFieldError('current-password', 'Ingresa tu contraseña actual');
        isValid = false;
    }

    // New password validation
    if (!newPassword) {
        showPasswordFieldError('new-password', 'Ingresa una nueva contraseña');
        isValid = false;
    } else if (newPassword.length < 6 || newPassword.length > 18) {
        showPasswordFieldError('new-password', 'La contraseña debe tener entre 6 y 18 caracteres');
        isValid = false;
    } else if (!/(?=.*[0-9])/.test(newPassword)) {
        showPasswordFieldError('new-password', 'Debe contener al menos un número');
        isValid = false;
    } else if (!/(?=.*[A-Z])/.test(newPassword)) {
        showPasswordFieldError('new-password', 'Debe contener al menos una mayúscula');
        isValid = false;
    } else if (newPassword === currentPassword) {
        showPasswordFieldError('new-password', 'La nueva contraseña debe ser diferente a la actual');
        isValid = false;
    }

    // Confirm password
    if (newPassword !== confirmPassword) {
        showPasswordFieldError('confirm-password', 'Las contraseñas no coinciden');
        isValid = false;
    }

    return isValid;
}

/**
 * Validate email field
 */
function validateEmailField() {
    const email = document.getElementById('email').value.trim();
    const field = document.getElementById('email').closest('.form-group');
    
    if (!validateEmail(email)) {
        showFieldError('email', 'Correo electrónico inválido');
        return false;
    } else {
        field.classList.remove('error');
        field.classList.add('success');
        hideFieldError('email');
        return true;
    }
}

/**
 * Validate username field
 */
function validateUsernameField() {
    const username = document.getElementById('username').value.trim();
    const field = document.getElementById('username').closest('.form-group');
    
    if (username.length < 3) {
        showFieldError('username', 'Mínimo 3 caracteres');
        return false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        showFieldError('username', 'Solo letras, números y guiones bajos');
        return false;
    } else {
        field.classList.remove('error');
        field.classList.add('success');
        hideFieldError('username');
        return true;
    }
}

/**
 * Validate full name field
 */
function validateFullNameField() {
    const fullName = document.getElementById('fullName').value.trim();
    const field = document.getElementById('fullName').closest('.form-group');
    
    if (fullName.length < 3) {
        showFieldError('fullName', 'Mínimo 3 caracteres');
        return false;
    } else {
        field.classList.remove('error');
        field.classList.add('success');
        hideFieldError('fullName');
        return true;
    }
}

/**
 * Validate password field
 */
function validatePasswordField() {
    const password = document.getElementById('new-password').value;
    const field = document.getElementById('new-password').closest('.form-group');
    
    if (password.length < 6 || password.length > 18) {
        showPasswordFieldError('new-password', 'Entre 6 y 18 caracteres');
        return false;
    } else if (!/(?=.*[0-9])/.test(password)) {
        showPasswordFieldError('new-password', 'Al menos un número');
        return false;
    } else if (!/(?=.*[A-Z])/.test(password)) {
        showPasswordFieldError('new-password', 'Al menos una mayúscula');
        return false;
    } else {
        field.classList.remove('error');
        field.classList.add('success');
        hidePasswordFieldError('new-password');
        return true;
    }
}

/**
 * Validate confirm password field
 */
function validateConfirmPasswordField() {
    const password = document.getElementById('new-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const field = document.getElementById('confirm-password').closest('.form-group');
    
    if (confirmPassword !== password) {
        showPasswordFieldError('confirm-password', 'Las contraseñas no coinciden');
        return false;
    } else if (confirmPassword) {
        field.classList.remove('error');
        field.classList.add('success');
        hidePasswordFieldError('confirm-password');
        return true;
    }
}

/**
 * Validate email format
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===========================================
// ERROR HANDLING
// ===========================================

/**
 * Show field error
 */
function showFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const formGroup = input.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-msg');

    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    input.classList.add('error');
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

/**
 * Hide field error
 */
function hideFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const formGroup = input.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-msg');

    formGroup.classList.remove('error');
    input.classList.remove('error');
    errorMsg.classList.add('hidden');
}

/**
 * Show password field error
 */
function showPasswordFieldError(fieldId, message) {
    const input = document.getElementById(fieldId);
    const formGroup = input.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-msg');

    formGroup.classList.add('error');
    formGroup.classList.remove('success');
    input.classList.add('error');
    errorMsg.textContent = message;
    errorMsg.classList.remove('hidden');
}

/**
 * Hide password field error
 */
function hidePasswordFieldError(fieldId) {
    const input = document.getElementById(fieldId);
    const formGroup = input.closest('.form-group');
    const errorMsg = formGroup.querySelector('.error-msg');

    formGroup.classList.remove('error');
    input.classList.remove('error');
    errorMsg.classList.add('hidden');
}

/**
 * Clear all errors
 */
function clearErrors() {
    document.querySelectorAll('#profile-form .form-group').forEach(group => {
        group.classList.remove('error', 'success');
        const input = group.querySelector('.input-field');
        const errorMsg = group.querySelector('.error-msg');
        if (input) input.classList.remove('error');
        if (errorMsg) errorMsg.classList.add('hidden');
    });
}

/**
 * Clear password errors
 */
function clearPasswordErrors() {
    document.querySelectorAll('#password-form .form-group').forEach(group => {
        group.classList.remove('error', 'success');
        const input = group.querySelector('.input-field');
        const errorMsg = group.querySelector('.error-msg');
        if (input) input.classList.remove('error');
        if (errorMsg) errorMsg.classList.add('hidden');
    });
}

// ===========================================
// NOTIFICATIONS
// ===========================================

/**
 * Show notification message
 */
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    
    // Clear previous classes
    notification.className = 'fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm text-white';
    
    // Add type class
    notification.classList.add(type);
    
    // Set message
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${getNotificationIcon(type)}</span>
            <span>${message}</span>
        </div>
    `;
    
    // Show notification
    notification.classList.remove('hidden');
    
    // Hide after 4 seconds
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}

/**
 * Get notification icon based on type
 */
function getNotificationIcon(type) {
    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    return icons[type] || icons.info;
}
