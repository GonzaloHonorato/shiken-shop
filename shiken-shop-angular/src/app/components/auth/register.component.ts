import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { DataService } from '../../services/data.service';

// Interfaz extendida para registro
interface RegisterFormData {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  birthdate: string;
  address?: string;
}

// Validador personalizado para confirmar contraseña
function passwordMatchValidator(control: AbstractControl): {[key: string]: any} | null {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');
  
  if (!password || !confirmPassword) {
    return null;
  }
  
  return password.value === confirmPassword.value ? null : { passwordMismatch: true };
}

// Validador personalizado para edad mínima
function minAgeValidator(minAge: number) {
  return (control: AbstractControl): {[key: string]: any} | null => {
    if (!control.value) return null;
    
    const birthDate = new Date(control.value);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= minAge ? null : { minAge: { requiredAge: minAge, actualAge: age } };
  };
}

// Validador personalizado para contraseña fuerte
function strongPasswordValidator(control: AbstractControl): {[key: string]: any} | null {
  if (!control.value) return null;
  
  const password = control.value;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const minLength = password.length >= 6;
  const maxLength = password.length <= 18;
  
  const valid = hasUpperCase && hasLowerCase && hasNumber && minLength && maxLength;
  
  if (!valid) {
    return {
      strongPassword: {
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        minLength,
        maxLength
      }
    };
  }
  
  return null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen py-20 px-4">
      
      <!-- Registration Form Section -->
      <div class="container mx-auto max-w-2xl">
        <div class="bg-gray-800 bg-opacity-50 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-500/30 p-6 md:p-10">
          
          <!-- Header -->
          <div class="text-center mb-8">
            <h2 class="text-3xl md:text-4xl font-bold text-white mb-2">
              Únete a <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">ShikenShop</span>
            </h2>
            <p class="text-gray-300">Crea tu cuenta y comienza a disfrutar de beneficios exclusivos</p>
          </div>

          <!-- Registration Form -->
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" novalidate class="space-y-6">
            
            <!-- Nombre Completo -->
            <div class="form-group">
              <label for="fullName" class="block text-white font-semibold mb-2">
                Nombre Completo <span class="text-pink-500">*</span>
              </label>
              <input 
                type="text" 
                id="fullName" 
                formControlName="fullName"
                class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                [class.border-purple-500/30]="!registerForm.get('fullName')?.invalid || !registerForm.get('fullName')?.touched"
                [class.border-pink-500]="registerForm.get('fullName')?.invalid && registerForm.get('fullName')?.touched"
                placeholder="Ingresa tu nombre completo"
              >
              <span 
                class="error-message text-pink-500 text-sm mt-1"
                [class.hidden]="!registerForm.get('fullName')?.invalid || !registerForm.get('fullName')?.touched"
              >
                @if (registerForm.get('fullName')?.hasError('required')) {
                  El nombre completo es requerido
                }
                @if (registerForm.get('fullName')?.hasError('minlength')) {
                  El nombre debe tener al menos 2 caracteres
                }
              </span>
            </div>

            <!-- Nombre de Usuario -->
            <div class="form-group">
              <label for="username" class="block text-white font-semibold mb-2">
                Nombre de Usuario <span class="text-pink-500">*</span>
              </label>
              <input 
                type="text" 
                id="username" 
                formControlName="username"
                class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                [class.border-purple-500/30]="!registerForm.get('username')?.invalid || !registerForm.get('username')?.touched"
                [class.border-pink-500]="registerForm.get('username')?.invalid && registerForm.get('username')?.touched"
                placeholder="Elige un nombre de usuario"
              >
              <span 
                class="error-message text-pink-500 text-sm mt-1"
                [class.hidden]="!registerForm.get('username')?.invalid || !registerForm.get('username')?.touched"
              >
                @if (registerForm.get('username')?.hasError('required')) {
                  El nombre de usuario es requerido
                }
                @if (registerForm.get('username')?.hasError('minlength')) {
                  El nombre de usuario debe tener al menos 3 caracteres
                }
                @if (registerForm.get('username')?.hasError('pattern')) {
                  Solo se permiten letras, números y guiones bajos
                }
              </span>
            </div>

            <!-- Correo Electrónico -->
            <div class="form-group">
              <label for="email" class="block text-white font-semibold mb-2">
                Correo Electrónico <span class="text-pink-500">*</span>
              </label>
              <input 
                type="email" 
                id="email" 
                formControlName="email"
                class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                [class.border-purple-500/30]="!registerForm.get('email')?.invalid || !registerForm.get('email')?.touched"
                [class.border-pink-500]="registerForm.get('email')?.invalid && registerForm.get('email')?.touched"
                placeholder="tu@email.com"
              >
              <span 
                class="error-message text-pink-500 text-sm mt-1"
                [class.hidden]="!registerForm.get('email')?.invalid || !registerForm.get('email')?.touched"
              >
                @if (registerForm.get('email')?.hasError('required')) {
                  El correo electrónico es requerido
                }
                @if (registerForm.get('email')?.hasError('email')) {
                  Ingresa un correo electrónico válido
                }
              </span>
            </div>

            <!-- Contraseña -->
            <div class="form-group">
              <label for="password" class="block text-white font-semibold mb-2">
                Contraseña <span class="text-pink-500">*</span>
              </label>
              <div class="relative">
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  id="password" 
                  formControlName="password"
                  class="w-full px-4 py-3 pr-14 bg-gray-900 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                  [class.border-purple-500/30]="!registerForm.get('password')?.invalid || !registerForm.get('password')?.touched"
                  [class.border-pink-500]="registerForm.get('password')?.invalid && registerForm.get('password')?.touched"
                  placeholder="Mínimo 6 caracteres"
                >
                <button 
                  type="button" 
                  (click)="togglePassword()"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center w-6 h-6"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (showPassword) {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12l2.122-2.122m-2.122 2.122L9.878 14.12M12 12v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    }
                  </svg>
                </button>
              </div>
              <span 
                class="error-message text-pink-500 text-sm mt-1"
                [class.hidden]="!registerForm.get('password')?.invalid || !registerForm.get('password')?.touched"
              >
                @if (registerForm.get('password')?.hasError('required')) {
                  La contraseña es requerida
                }
                @if (registerForm.get('password')?.hasError('strongPassword')) {
                  La contraseña debe contener mayúsculas, minúsculas, números (6-18 caracteres)
                }
              </span>
              <p class="text-gray-400 text-xs mt-1">Debe contener 6-18 caracteres, al menos un número y una letra mayúscula</p>
            </div>

            <!-- Confirmar Contraseña -->
            <div class="form-group">
              <label for="confirmPassword" class="block text-white font-semibold mb-2">
                Confirmar Contraseña <span class="text-pink-500">*</span>
              </label>
              <div class="relative">
                <input 
                  [type]="showConfirmPassword ? 'text' : 'password'" 
                  id="confirmPassword" 
                  formControlName="confirmPassword"
                  class="w-full px-4 py-3 pr-14 bg-gray-900 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                  [class.border-purple-500/30]="!registerForm.get('confirmPassword')?.invalid || !registerForm.get('confirmPassword')?.touched"
                  [class.border-pink-500]="registerForm.get('confirmPassword')?.invalid && registerForm.get('confirmPassword')?.touched"
                  placeholder="Repite tu contraseña"
                >
                <button 
                  type="button" 
                  (click)="toggleConfirmPassword()"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors flex items-center justify-center w-6 h-6"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    @if (showConfirmPassword) {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L12 12l2.122-2.122m-2.122 2.122L9.878 14.12M12 12v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    } @else {
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    }
                  </svg>
                </button>
              </div>
              <span 
                class="error-message text-pink-500 text-sm mt-1"
                [class.hidden]="!registerForm.get('confirmPassword')?.invalid || !registerForm.get('confirmPassword')?.touched"
              >
                @if (registerForm.get('confirmPassword')?.hasError('required')) {
                  Confirma tu contraseña
                }
              </span>
              <span 
                class="error-message text-pink-500 text-sm mt-1"
                [class.hidden]="!registerForm.hasError('passwordMismatch') || !registerForm.get('confirmPassword')?.touched"
              >
                Las contraseñas no coinciden
              </span>
            </div>

            <!-- Fecha de Nacimiento -->
            <div class="form-group">
              <label for="birthdate" class="block text-white font-semibold mb-2">
                Fecha de Nacimiento <span class="text-pink-500">*</span>
              </label>
              <input 
                type="date" 
                id="birthdate" 
                formControlName="birthdate"
                class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                [class.border-purple-500/30]="!registerForm.get('birthdate')?.invalid || !registerForm.get('birthdate')?.touched"
                [class.border-pink-500]="registerForm.get('birthdate')?.invalid && registerForm.get('birthdate')?.touched"
              >
              <span 
                class="error-message text-pink-500 text-sm mt-1"
                [class.hidden]="!registerForm.get('birthdate')?.invalid || !registerForm.get('birthdate')?.touched"
              >
                @if (registerForm.get('birthdate')?.hasError('required')) {
                  La fecha de nacimiento es requerida
                }
                @if (registerForm.get('birthdate')?.hasError('minAge')) {
                  Debes tener al menos 13 años para registrarte
                }
              </span>
              <p class="text-gray-400 text-xs mt-1">Debes tener al menos 13 años para registrarte</p>
            </div>

            <!-- Dirección de Despacho -->
            <div class="form-group">
              <label for="address" class="block text-white font-semibold mb-2">
                Dirección de Despacho <span class="text-gray-400 text-sm">(Opcional)</span>
              </label>
              <textarea 
                id="address" 
                formControlName="address"
                rows="3"
                class="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all duration-300 resize-none"
                placeholder="Calle, número, comuna, ciudad (opcional)"
              ></textarea>
            </div>

            <!-- Botones -->
            <div class="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                type="submit" 
                [disabled]="registerForm.invalid || isLoading"
                class="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:scale-105 transform transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                @if (isLoading) {
                  <div class="flex items-center justify-center">
                    <svg class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creando cuenta...
                  </div>
                } @else {
                  Crear Cuenta
                }
              </button>
              <button 
                type="button" 
                (click)="clearForm()"
                class="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Limpiar Formulario
              </button>
            </div>
          </form>

          <!-- Login Link -->
          <p class="text-gray-400 text-center mt-6">
            ¿Ya tienes cuenta? 
            <a [routerLink]="['/login']" class="text-purple-400 hover:text-pink-400 transition-colors duration-300 font-semibold">Inicia Sesión</a>
          </p>
        </div>
      </div>

      <!-- Back to Home -->
      <div class="text-center mt-6">
        <a [routerLink]="['/']" class="text-gray-400 hover:text-purple-400 text-sm transition-colors inline-flex items-center">
          <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
          </svg>
          Volver al inicio
        </a>
      </div>
    </div>
  `,
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private dataService = inject(DataService);

  registerForm: FormGroup;
  isLoading = false;
  showPassword = false;
  showConfirmPassword = false;

  constructor() {
    this.registerForm = this.formBuilder.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9_]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, strongPasswordValidator]],
      confirmPassword: ['', [Validators.required]],
      birthdate: ['', [Validators.required, minAgeValidator(13)]],
      address: [''] // Optional field
    }, { validators: passwordMatchValidator });
  }

  ngOnInit(): void {
    // Asegurar que el DataService esté inicializado
    this.dataService.users(); // Trigger initialization
    
    // Verificar si ya hay una sesión activa
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  clearForm(): void {
    this.registerForm.reset();
    this.notificationService.info('Formulario limpiado');
  }

  async onSubmit(): Promise<void> {
    console.log('🚀 [REGISTER] Iniciando proceso de registro...');
    
    if (this.registerForm.invalid) {
      console.log('❌ [REGISTER] Formulario inválido:', this.registerForm.errors);
      this.markFormGroupTouched();
      this.notificationService.error('Por favor, completa todos los campos correctamente');
      return;
    }

    this.isLoading = true;
    console.log('⏳ [REGISTER] Formulario válido, procesando...');

    try {
      const formValue = this.registerForm.value as RegisterFormData;
      console.log('📝 [REGISTER] Datos del formulario:', {
        fullName: formValue.fullName,
        username: formValue.username,
        email: formValue.email,
        hasPassword: !!formValue.password,
        hasConfirmPassword: !!formValue.confirmPassword,
        passwordsMatch: formValue.password === formValue.confirmPassword,
        birthdate: formValue.birthdate,
        hasAddress: !!formValue.address
      });
      
      // Preparar datos para el registro
      const registerData = {
        name: formValue.fullName,
        email: formValue.email,
        password: formValue.password,
        confirmPassword: formValue.confirmPassword
      };
      
      console.log('📤 [REGISTER] Enviando datos al AuthService...');
      const result = await this.authService.register(registerData);
      console.log('📥 [REGISTER] Respuesta del AuthService:', result);
      
      if (result.success) {
        console.log('✅ [REGISTER] Registro exitoso!');
        this.notificationService.success('¡Cuenta creada exitosamente!');
        
        // Verificar si el usuario quedó autenticado
        const isAuthenticated = this.authService.isAuthenticated();
        const currentUser = this.authService.currentUser();
        console.log('🔐 [REGISTER] Estado de autenticación después del registro:', {
          isAuthenticated,
          currentUser: currentUser ? {
            name: currentUser.name,
            email: currentUser.email,
            role: currentUser.role
          } : null
        });
        
        if (isAuthenticated) {
          console.log('🎯 [REGISTER] Usuario autenticado automáticamente, redirigiendo al dashboard...');
          
          // Pequeño delay para asegurar que la UI se actualice
          setTimeout(() => {
            this.redirectBasedOnRole();
          }, 100);
        } else {
          console.log('🔄 [REGISTER] Usuario no autenticado, redirigiendo al login...');
          // Redirigir al login con parámetro de éxito
          this.router.navigate(['/login'], { 
            queryParams: { registered: 'true' } 
          });
        }
      } else {
        console.log('❌ [REGISTER] Error en registro:', result.message);
        this.notificationService.error(result.message || 'Error al crear la cuenta');
      }
    } catch (error) {
      console.error('💥 [REGISTER] Error inesperado en registro:', error);
      this.notificationService.error('Error inesperado al crear la cuenta');
    } finally {
      this.isLoading = false;
      console.log('🏁 [REGISTER] Proceso de registro finalizado');
    }
  }

  private redirectBasedOnRole(): void {
    const currentUser = this.authService.currentUser();
    
    if (currentUser?.role === 'admin') {
      this.router.navigate(['/admin/dashboard']);
    } else if (currentUser?.role === 'buyer') {
      this.router.navigate(['/buyer/dashboard']);
    } else {
      this.router.navigate(['/']);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }
}