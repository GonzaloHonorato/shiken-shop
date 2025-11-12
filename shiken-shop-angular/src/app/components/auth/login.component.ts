import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { DataService } from '../../services/data.service';
import { LoginCredentials } from '../../models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 min-h-screen flex items-center justify-center px-4">
      
      <!-- Particles Background Effect -->
      <div class="particles-bg"></div>
      
      <!-- Login Container -->
      <div class="login-container w-full max-w-md relative z-10">
        
        <!-- Logo Section -->
        <div class="text-center mb-8">
          <a [routerLink]="['/']" class="inline-block">
            <h1 class="logo-text text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              ShikenShop
            </h1>
          </a>
          <p class="text-gray-400 mt-2">Inicia sesión para continuar</p>
        </div>

        <!-- Login Card -->
        <div class="login-card bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-500/20">
          
          <!-- Login Form -->
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" novalidate>
            
            <!-- Email/Username Field -->
            <div class="form-group mb-6">
              <label for="identifier" class="block text-gray-300 font-medium mb-2">
                Email o Usuario
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                  </svg>
                </div>
                <input 
                  type="text" 
                  id="identifier" 
                  formControlName="identifier"
                  class="input-field w-full pl-10 pr-4 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  [class.border-gray-700]="!loginForm.get('identifier')?.invalid || !loginForm.get('identifier')?.touched"
                  [class.border-red-500]="loginForm.get('identifier')?.invalid && loginForm.get('identifier')?.touched"
                  placeholder="correo@ejemplo.com o usuario"
                  autocomplete="username"
                >
              </div>
              <span 
                class="error-msg text-red-400 text-sm mt-1"
                [class.hidden]="!loginForm.get('identifier')?.invalid || !loginForm.get('identifier')?.touched"
              >
                @if (loginForm.get('identifier')?.hasError('required')) {
                  El email o usuario es requerido
                }
                @if (loginForm.get('identifier')?.hasError('email')) {
                  Formato de email inválido
                }
              </span>
            </div>

            <!-- Password Field -->
            <div class="form-group mb-6">
              <label for="password" class="block text-gray-300 font-medium mb-2">
                Contraseña
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input 
                  [type]="showPassword ? 'text' : 'password'" 
                  id="password" 
                  formControlName="password"
                  class="input-field w-full pl-10 pr-12 py-3 bg-gray-900/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                  [class.border-gray-700]="!loginForm.get('password')?.invalid || !loginForm.get('password')?.touched"
                  [class.border-red-500]="loginForm.get('password')?.invalid && loginForm.get('password')?.touched"
                  placeholder="••••••••"
                  autocomplete="current-password"
                >
                <button 
                  type="button" 
                  (click)="togglePassword()"
                  class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-purple-400 transition-colors"
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
                class="error-msg text-red-400 text-sm mt-1"
                [class.hidden]="!loginForm.get('password')?.invalid || !loginForm.get('password')?.touched"
              >
                @if (loginForm.get('password')?.hasError('required')) {
                  La contraseña es requerida
                }
                @if (loginForm.get('password')?.hasError('minlength')) {
                  La contraseña debe tener al menos 6 caracteres
                }
              </span>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between mb-6">
              <label class="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  formControlName="rememberMe"
                  class="w-4 h-4 text-purple-600 bg-gray-900/50 border-gray-700 rounded focus:ring-purple-500 focus:ring-2"
                >
                <span class="ml-2 text-sm text-gray-400">Recordarme</span>
              </label>
              <a [routerLink]="['/forgot-password']" class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              [disabled]="loginForm.invalid || isLoading"
              class="submit-btn w-full py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isLoading) {
                <svg class="animate-spin h-5 w-5 mx-auto" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else {
                <span>Iniciar Sesión</span>
              }
            </button>

          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-800/50 text-gray-400">o</span>
            </div>
          </div>

          <!-- Register Link -->
          <div class="text-center">
            <p class="text-gray-400 text-sm">
              ¿No tienes una cuenta? 
              <a [routerLink]="['/register']" class="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
                Regístrate aquí
              </a>
            </p>
          </div>

          <!-- Demo Credentials -->
          <div class="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <p class="text-blue-400 text-xs font-semibold mb-2">🔑 Credenciales de prueba:</p>
            <div class="text-xs text-gray-400 space-y-1">
              <p><strong class="text-blue-300">Admin:</strong> admin&#64;shikenshop.com / Admin123</p>
              <p><strong class="text-pink-300">Comprador:</strong> comprador&#64;test.com / Comprador123</p>
            </div>
            <!-- Debug Button para desarrollo -->
            <button 
              type="button"
              (click)="resetLockout()"
              class="mt-2 px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs hover:bg-red-500/30 transition-colors"
            >
              🔓 Resetear bloqueos (Debug)
            </button>
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

    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private formBuilder = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  private dataService = inject(DataService); // Para asegurar inicialización de datos

  loginForm: FormGroup;
  isLoading = false;
  showPassword = false;
  returnUrl = '/';

  constructor() {
    this.loginForm = this.formBuilder.group({
      identifier: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Asegurar que el DataService esté inicializado
    this.dataService.users(); // Trigger initialization
    
    // Obtener returnUrl de query params
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    // Verificar si ya hay una sesión activa
    if (this.authService.isAuthenticated()) {
      this.redirectBasedOnRole();
    }

    // Mostrar mensaje de éxito si viene del registro
    const registrationSuccess = this.route.snapshot.queryParams['registered'];
    if (registrationSuccess) {
      this.notificationService.success(
        '¡Registro exitoso! Ahora puedes iniciar sesión con tu nueva cuenta.'
      );
    }
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.isLoading = true;

    try {
      const { identifier, password, rememberMe } = this.loginForm.value;
      
      // Preparar credenciales
      const credentials: LoginCredentials = {
        email: identifier,
        password: password
      };
      
      const result = await this.authService.login(credentials, rememberMe);
      
      if (result.success) {
        // Login exitoso - obtener usuario actual
        const currentUser = this.authService.currentUser();
        this.notificationService.success(`¡Bienvenido, ${currentUser?.name || 'Usuario'}!`);
        
        // Redirigir según el returnUrl o rol
        if (this.returnUrl !== '/') {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.redirectBasedOnRole();
        }
      } else {
        // Error de login
        this.notificationService.error(result.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      this.notificationService.error('Error inesperado al iniciar sesión');
    } finally {
      this.isLoading = false;
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
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  /**
   * Método de debugging para resetear bloqueos durante desarrollo
   */
  resetLockout(): void {
    this.authService.clearLockout();
    this.notificationService.success('Bloqueos de cuenta reseteados');
  }
}