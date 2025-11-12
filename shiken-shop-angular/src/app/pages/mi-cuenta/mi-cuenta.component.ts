import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';
import { NotificationService } from '../../services/notification.service';
import { User } from '../../models';

@Component({
  selector: 'app-mi-cuenta',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './mi-cuenta.component.html',
  styleUrls: ['./mi-cuenta.component.scss']
})
export class MiCuentaComponent implements OnInit {
  // ===================================
  // DEPENDENCY INJECTION
  // ===================================
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private dataService = inject(DataService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // ===================================
  // REACTIVE STATE
  // ===================================
  public activeTab = signal<'profile' | 'security'>('profile');
  public isLoadingProfile = signal(false);
  public isLoadingPassword = signal(false);
  public isLoading = computed(() => this.isLoadingProfile() || this.isLoadingPassword());
  public showCurrentPassword = signal(false);
  public showNewPassword = signal(false);
  public showConfirmPassword = signal(false);

  // User data
  public currentUser = this.authService.currentUser;
  public avatarUrl = signal('');

  // ===================================
  // FORM SETUP
  // ===================================
  public profileForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
    birthdate: ['', [Validators.required]],
    address: ['']
  });

  public passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [
      Validators.required,
      Validators.minLength(6),
      Validators.maxLength(18),
      this.passwordValidator
    ]],
    confirmPassword: ['', [Validators.required]]
  }, { validators: this.passwordMatchValidator });

  // Store original data for cancel functionality
  private originalUserData: User | null = null;

  // ===================================
  // LIFECYCLE METHODS
  // ===================================
  ngOnInit(): void {
    this.loadUserData();
  }

  // ===================================
  // DATA LOADING
  // ===================================

  /**
   * Carga los datos del usuario actual
   */
  private loadUserData(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.notificationService.error('Usuario no encontrado');
      this.router.navigate(['/login']);
      return;
    }

    // Buscar datos completos del usuario
    const users = this.dataService.users();
    const fullUserData = users.find(u => u.email === user.email);
    
    if (!fullUserData) {
      this.notificationService.error('Error al cargar datos del usuario');
      return;
    }

    // Almacenar datos originales para cancelar
    this.originalUserData = { ...fullUserData };

    console.log('👤 Datos originales del usuario:', fullUserData);
    console.log('👤 Propiedades disponibles:', Object.keys(fullUserData));

    // Usar name como fullName si fullName no existe
    const displayName = fullUserData.fullName || fullUserData.name || 'Usuario';
    const username = fullUserData.username || fullUserData.name || fullUserData.email?.split('@')[0] || '';

    // Generar avatar URL
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=7c3aed&color=fff&size=200`;
    this.avatarUrl.set(avatarUrl);

    // Poblar formulario de perfil con valores por defecto
    this.profileForm.patchValue({
      fullName: fullUserData.fullName || fullUserData.name || '',
      username: fullUserData.username || username,
      email: fullUserData.email || '',
      phone: fullUserData.phone || '',
      birthdate: fullUserData.birthdate || '',
      address: fullUserData.address || ''
    });

    console.log('� Formulario poblado con:', this.profileForm.value);
  }

  // ===================================
  // TAB MANAGEMENT
  // ===================================

  /**
   * Cambia entre las pestañas
   */
  switchTab(tab: 'profile' | 'security'): void {
    this.activeTab.set(tab);
    
    // Limpiar formulario de contraseña al cambiar de tab
    if (tab === 'profile') {
      this.passwordForm.reset();
    }
  }

  // ===================================
  // PROFILE MANAGEMENT
  // ===================================

  /**
   * Guarda los cambios del perfil
   */
  async onSaveProfile(): Promise<void> {
    if (this.profileForm.invalid) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoadingProfile.set(true);

    try {
      // Simular delay de API
      await this.delay(1000);

      const formData = this.profileForm.value;
      const user = this.currentUser();
      
      if (!user) return;

      // Actualizar datos del usuario
      const users = this.dataService.users();
      const userIndex = users.findIndex(u => u.email === user.email);
      
      if (userIndex === -1) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar si el email o username ya existe (excepto el usuario actual)
      const emailExists = users.some(u => u.email !== user.email && u.email === formData.email);
      const usernameExists = users.some(u => u.email !== user.email && u.username === formData.username);

      if (emailExists) {
        this.notificationService.error('El correo electrónico ya está en uso');
        return;
      }

      if (usernameExists) {
        this.notificationService.error('El nombre de usuario ya está en uso');
        return;
      }

      // Actualizar usuario
      const updatedUser = {
        ...users[userIndex],
        ...formData,
        updatedAt: new Date().toISOString()
      };

      users[userIndex] = updatedUser;
      this.dataService.saveUsers(users);

      // Actualizar sesión si cambió el email
      if (formData.email !== user.email) {
        // Actualizar sesión mediante logout/login si el email cambió
        if (formData.email !== user.email) {
          this.authService.logout();
          this.router.navigate(['/login']);
          return;
        }
      }

      // Actualizar datos originales
      this.originalUserData = { ...updatedUser };

      // Actualizar avatar si cambió el nombre
      if (formData.fullName !== user.fullName) {
        const newAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName)}&background=7c3aed&color=fff&size=200`;
        this.avatarUrl.set(newAvatarUrl);
      }

      this.notificationService.success('Perfil actualizado correctamente');

    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      this.notificationService.error('Error al actualizar el perfil');
    } finally {
      this.isLoadingProfile.set(false);
    }
  }

  /**
   * Cancela los cambios del perfil
   */
  cancelProfileChanges(): void {
    if (this.originalUserData) {
      this.profileForm.patchValue({
        fullName: this.originalUserData.fullName || '',
        username: this.originalUserData.username || '',
        email: this.originalUserData.email || '',
        phone: this.originalUserData.phone || '',
        birthdate: this.originalUserData.birthdate || '',
        address: this.originalUserData.address || ''
      });

      this.notificationService.info('Cambios cancelados');
    }
  }

  // ===================================
  // PASSWORD MANAGEMENT
  // ===================================

  /**
   * Cambia la contraseña del usuario
   */
  async onChangePassword(): Promise<void> {
    if (this.passwordForm.invalid) {
      this.markFormGroupTouched(this.passwordForm);
      return;
    }

    this.isLoadingPassword.set(true);

    try {
      // Simular delay de API
      await this.delay(1000);

      const { currentPassword, newPassword } = this.passwordForm.value;
      const user = this.currentUser();
      
      if (!user) return;

      // Verificar contraseña actual
      const users = this.dataService.users();
      const currentUser = users.find(u => u.email === user.email);
      
      if (!currentUser) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar contraseña actual (en un sistema real se usaría hashing)
      if (currentUser.password !== currentPassword) {
        this.passwordForm.get('currentPassword')?.setErrors({ incorrect: true });
        this.notificationService.error('La contraseña actual es incorrecta');
        return;
      }

      // Actualizar contraseña
      const userIndex = users.findIndex(u => u.email === user.email);
      users[userIndex] = {
        ...users[userIndex],
        password: newPassword,
        updatedAt: new Date().toISOString()
      };

      this.dataService.saveUsers(users);

      // Limpiar formulario
      this.passwordForm.reset();

      this.notificationService.success('Contraseña cambiada correctamente');

    } catch (error) {
      console.error('Error al cambiar contraseña:', error);
      this.notificationService.error('Error al cambiar la contraseña');
    } finally {
      this.isLoadingPassword.set(false);
    }
  }

  // ===================================
  // PASSWORD VISIBILITY TOGGLE
  // ===================================

  togglePasswordVisibility(field: 'current' | 'new' | 'confirm'): void {
    switch (field) {
      case 'current':
        this.showCurrentPassword.set(!this.showCurrentPassword());
        break;
      case 'new':
        this.showNewPassword.set(!this.showNewPassword());
        break;
      case 'confirm':
        this.showConfirmPassword.set(!this.showConfirmPassword());
        break;
    }
  }

  // ===================================
  // FORM VALIDATION HELPERS
  // ===================================

  /**
   * Verifica si un campo tiene errores y ha sido tocado
   */
  hasFieldError(formGroup: FormGroup, fieldName: string): boolean {
    const field = formGroup.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    
    if (!field || !field.errors) return '';

    const errors = field.errors;

    // Errores comunes
    if (errors['required']) return 'Este campo es obligatorio';
    if (errors['email']) return 'Ingresa un correo electrónico válido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['maxlength']) return `Máximo ${errors['maxlength'].requiredLength} caracteres`;
    if (errors['pattern']) return 'Formato inválido';

    // Errores específicos
    if (errors['passwordStrength']) return 'La contraseña debe tener al menos 1 número y 1 mayúscula';
    if (errors['incorrect']) return 'Contraseña incorrecta';
    if (errors['passwordMismatch']) return 'Las contraseñas no coinciden';

    return 'Campo inválido';
  }

  /**
   * Validador personalizado para contraseñas
   */
  private passwordValidator(control: AbstractControl): {[key: string]: any} | null {
    const value = control.value;
    if (!value) return null;

    const hasNumber = /[0-9]/.test(value);
    const hasUpper = /[A-Z]/.test(value);
    
    if (!hasNumber || !hasUpper) {
      return { passwordStrength: true };
    }
    
    return null;
  }

  /**
   * Validador para confirmar contraseña
   */
  private passwordMatchValidator(group: AbstractControl): {[key: string]: any} | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      group.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    return null;
  }

  /**
   * Marca todos los campos como tocados para mostrar errores
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  /**
   * Simula delay de API
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Obtiene el rol formateado para mostrar
   */
  getRoleDisplay(): string {
    const user = this.currentUser();
    if (!user) return '';
    
    return user.role === 'admin' ? 'Administrador' : 'Comprador';
  }

  /**
   * Navega al dashboard según el rol
   */
  goToDashboard(): void {
    const user = this.currentUser();
    if (!user) return;
    
    if (user.role === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/buyer']);
    }
  }

  // ===================================
  // MÉTODOS PÚBLICOS PARA EL TEMPLATE
  // ===================================

  setActiveTab(tab: 'profile' | 'security'): void {
    this.activeTab.set(tab);
  }

  getAvatarInitials(): string {
    const name = this.profileForm.get('fullName')?.value || 'Usuario';
    return name.split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  saveProfile(): void {
    this.onSaveProfile();
  }

  resetProfile(): void {
    this.profileForm.patchValue({
      fullName: this.originalUserData?.fullName || '',
      username: this.originalUserData?.username || '',
      email: this.originalUserData?.email || '',
      phone: this.originalUserData?.phone || '',
      birthdate: this.originalUserData?.birthdate || '',
      address: this.originalUserData?.address || ''
    });
  }

  changePassword(): void {
    this.onChangePassword();
  }

  resetPasswordForm(): void {
    this.passwordForm.reset();
    this.showCurrentPassword.set(false);
    this.showNewPassword.set(false);
    this.showConfirmPassword.set(false);
  }

  toggleCurrentPasswordVisibility(): void {
    this.showCurrentPassword.set(!this.showCurrentPassword());
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword.set(!this.showNewPassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.set(!this.showConfirmPassword());
  }

  getPasswordStrengthClass(index: number): string {
    const strength = this.calculatePasswordStrength(this.passwordForm.get('newPassword')?.value || '');
    const classes = ['bg-gray-600', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    return index <= strength ? classes[strength] || 'bg-gray-600' : 'bg-gray-600';
  }

  getPasswordStrengthText(): string {
    const strength = this.calculatePasswordStrength(this.passwordForm.get('newPassword')?.value || '');
    const texts = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte'];
    return texts[strength] || 'Muy débil';
  }

  getPasswordStrengthTextClass(): string {
    const strength = this.calculatePasswordStrength(this.passwordForm.get('newPassword')?.value || '');
    const classes = ['text-gray-400', 'text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400'];
    return classes[strength] || 'text-gray-400';
  }

  private calculatePasswordStrength(password: string): number {
    if (!password) return 0;
    
    let strength = 0;
    
    // Longitud
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    
    // Complejidad
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return Math.min(strength - 1, 4);
  }

  /**
   * Cierra sesión
   */
  logout(): void {
    this.authService.logout();
    this.notificationService.success('Sesión cerrada correctamente');
    this.router.navigate(['/']);
  }
}