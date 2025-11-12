import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, fromEvent, merge } from 'rxjs';
import { User, LoginCredentials, AuthState, UserRole, RegisterData, StorageKeys } from '../models';
import { NotificationService } from './notification.service';

// ===================================
// AUTH CONFIGURATION
// ===================================
export interface AuthConfig {
  sessionTimeout: number;
  maxLoginAttempts: number;
  lockoutTime: number;
  loginUrl: string;
  unauthorizedUrl: string;
}

const DEFAULT_AUTH_CONFIG: AuthConfig = {
  sessionTimeout: 30 * 60 * 1000, // 30 minutos
  maxLoginAttempts: 5,
  lockoutTime: 15 * 60 * 1000, // 15 minutos  
  loginUrl: '/login',
  unauthorizedUrl: '/login'
};

// ===================================
// SESSION DATA INTERFACE
// ===================================
export interface SessionData {
  isLoggedIn: boolean;
  userId: number;
  username: string;
  email: string;
  name: string;
  fullName: string;
  role: UserRole;
  token: string;
  loginTime: number;
  rememberMe: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  private config: AuthConfig = DEFAULT_AUTH_CONFIG;
  
  // ===================================
  // REACTIVE STATE MANAGEMENT
  // ===================================
  
  // Señales para estado reactivo
  private authStateSignal = signal<AuthState>({
    isAuthenticated: false,
    user: null,
    role: null
  });
  
  // Computed signals
  public readonly authState = this.authStateSignal.asReadonly();
  public readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  public readonly currentUser = computed(() => this.authState().user);
  public readonly userRole = computed(() => this.authState().role);
  public readonly isAdmin = computed(() => this.userRole() === UserRole.ADMIN);
  public readonly isBuyer = computed(() => this.userRole() === UserRole.BUYER);
  
  // BehaviorSubject para compatibilidad con observables
  private authStateSubject = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    role: null
  });
  
  public readonly authState$ = this.authStateSubject.asObservable();
  
  // Timer para inactividad
  private inactivityTimer?: ReturnType<typeof setTimeout>;
  
  constructor() {
    this.initializeAuth();
    this.setupInactivityTimer();
  }
  
  // ===================================
  // INITIALIZATION
  // ===================================
  
  private initializeAuth(): void {
    const session = this.checkSession();
    if (session) {
      this.updateAuthState(session);
    }
  }
  
  // ===================================
  // AUTHENTICATION METHODS
  // ===================================
  
  async login(credentials: LoginCredentials, rememberMe = false): Promise<{ success: boolean; message: string }> {
    console.log('🔑 AuthService: Iniciando login', { credentials: credentials.email, rememberMe });
    
    try {
      // Verificar si la cuenta está bloqueada
      if (this.isAccountLocked()) {
        console.log('🔒 AuthService: Cuenta bloqueada');
        return {
          success: false,
          message: 'Cuenta bloqueada por múltiples intentos fallidos. Intenta nuevamente más tarde.'
        };
      }
      
      // Obtener usuarios del localStorage
      const users = this.getUsersFromStorage();
      console.log('👥 AuthService: Usuarios disponibles', users.length);
      
      // Buscar usuario
      const user = users.find(u => 
        (u.email === credentials.email || u.name === credentials.email) && 
        u.password === credentials.password && 
        u.active
      );
      
      if (!user) {
        this.handleFailedLogin();
        const remainingAttempts = this.getRemainingAttempts();
        return {
          success: false,
          message: remainingAttempts > 0 
            ? `Credenciales incorrectas. Te quedan ${remainingAttempts} intentos.`
            : 'Cuenta bloqueada por 15 minutos debido a múltiples intentos fallidos.'
        };
      }
      
      // Login exitoso
      this.createSession(user, rememberMe);
      this.clearLoginAttempts();
      
      return {
        success: true,
        message: `¡Bienvenido, ${user.name}!`
      };
      
    } catch (error) {
      console.error('Error en login:', error);
      return {
        success: false,
        message: 'Error interno del sistema. Intenta nuevamente.'
      };
    }
  }
  
  async register(registerData: RegisterData): Promise<{ success: boolean; message: string }> {
    try {
      // Validar que las contraseñas coincidan
      if (registerData.password !== registerData.confirmPassword) {
        return {
          success: false,
          message: 'Las contraseñas no coinciden.'
        };
      }
      
      // Obtener usuarios existentes
      const users = this.getUsersFromStorage();
      
      // Verificar si el email ya existe
      const existingUser = users.find(u => u.email === registerData.email);
      if (existingUser) {
        return {
          success: false,
          message: 'Ya existe una cuenta con este email.'
        };
      }
      
      // Crear nuevo usuario
      const newUser: User = {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password, // En producción debería estar hasheada
        role: UserRole.BUYER, // Por defecto es buyer
        active: true,
        registeredAt: new Date().toISOString()
      };
      
      // Agregar usuario a la lista
      users.push(newUser);
      localStorage.setItem(StorageKeys.USERS, JSON.stringify(users));
      
      return {
        success: true,
        message: 'Cuenta creada exitosamente. Ya puedes iniciar sesión.'
      };
      
    } catch (error) {
      console.error('Error en registro:', error);
      return {
        success: false,
        message: 'Error interno del sistema. Intenta nuevamente.'
      };
    }
  }
  
  logout(): void {
    this.clearSession();
    this.clearInactivityTimer();
    this.notificationService.info('Sesión cerrada correctamente');
    this.router.navigate(['/']);
  }
  
  // ===================================
  // SESSION MANAGEMENT
  // ===================================
  
  private checkSession(): SessionData | null {
    const session = localStorage.getItem(StorageKeys.SESSION);
    
    if (!session) {
      return null;
    }
    
    try {
      const sessionData: SessionData = JSON.parse(session);
      
      // Verificar si la sesión es válida
      const now = new Date().getTime();
      const sessionAge = now - sessionData.loginTime;
      
      if (sessionAge > this.config.sessionTimeout) {
        // Sesión expirada
        this.clearSession();
        return null;
      }
      
      // Renovar timestamp de la sesión
      sessionData.loginTime = now;
      localStorage.setItem(StorageKeys.SESSION, JSON.stringify(sessionData));
      
      return sessionData;
    } catch (error) {
      console.error('Error al parsear sesión:', error);
      this.clearSession();
      return null;
    }
  }
  
  private createSession(user: User, rememberMe: boolean): void {
    const sessionData: SessionData = {
      isLoggedIn: true,
      userId: Math.random(), // En una app real sería el ID real del usuario
      username: user.name,
      email: user.email,
      name: user.name,
      fullName: user.name,
      role: user.role as UserRole,
      token: this.generateToken(),
      loginTime: new Date().getTime(),
      rememberMe
    };
    
    localStorage.setItem(StorageKeys.SESSION, JSON.stringify(sessionData));
    this.updateAuthState(sessionData);
    this.setupInactivityTimer();
  }
  
  private clearSession(): void {
    localStorage.removeItem(StorageKeys.SESSION);
    this.authStateSignal.set({
      isAuthenticated: false,
      user: null,
      role: null
    });
    this.authStateSubject.next({
      isAuthenticated: false,
      user: null,
      role: null
    });
  }
  
  private updateAuthState(session: SessionData): void {
    const user: User = {
      name: session.fullName,
      email: session.email,
      password: '', // No almacenar password en el estado
      role: session.role as UserRole,
      active: true,
      registeredAt: ''
    };
    
    const newState: AuthState = {
      isAuthenticated: true,
      user,
      role: session.role
    };
    
    this.authStateSignal.set(newState);
    this.authStateSubject.next(newState);
  }
  
  // ===================================
  // LOGIN ATTEMPTS & LOCKOUT
  // ===================================
  
  private isAccountLocked(): boolean {
    const lockoutTime = localStorage.getItem('lockoutTime');
    if (!lockoutTime) return false;
    
    const now = new Date().getTime();
    const lockTime = parseInt(lockoutTime);
    const isLocked = (now - lockTime) < this.config.lockoutTime;
    
    // Si el bloqueo ha expirado, limpiarlo automáticamente
    if (!isLocked) {
      this.clearLockout();
    }
    
    return isLocked;
  }
  
  private handleFailedLogin(): void {
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    const newAttempts = attempts + 1;
    
    localStorage.setItem('loginAttempts', newAttempts.toString());
    
    if (newAttempts >= this.config.maxLoginAttempts) {
      localStorage.setItem('lockoutTime', new Date().getTime().toString());
    }
  }
  
  private getRemainingAttempts(): number {
    const attempts = parseInt(localStorage.getItem('loginAttempts') || '0');
    return Math.max(0, this.config.maxLoginAttempts - attempts);
  }
  
  private clearLoginAttempts(): void {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');
  }
  
  /**
   * Limpia el bloqueo de cuenta (público para debugging)
   */
  public clearLockout(): void {
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('lockoutTime');
    console.log('🔓 AuthService: Bloqueo de cuenta eliminado');
  }
  
  // ===================================
  // INACTIVITY TIMER
  // ===================================
  
  private setupInactivityTimer(): void {
    if (!this.isAuthenticated()) return;
    
    this.clearInactivityTimer();
    
    // Eventos que resetean el timer
    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    const activity$ = merge(...activityEvents.map(event => fromEvent(document, event)));
    
    const resetTimer = () => {
      this.clearInactivityTimer();
      this.inactivityTimer = setTimeout(() => {
        this.notificationService.warning('Sesión cerrada por inactividad');
        this.logout();
      }, this.config.sessionTimeout);
    };
    
    // Suscribirse a eventos de actividad
    activity$.subscribe(() => resetTimer());
    
    // Iniciar timer
    resetTimer();
  }
  
  private clearInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = undefined;
    }
  }
  
  // ===================================
  // UTILITY METHODS
  // ===================================
  
  private getUsersFromStorage(): User[] {
    const users = localStorage.getItem(StorageKeys.USERS);
    return users ? JSON.parse(users) : [];
  }
  
  private generateToken(): string {
    return 'token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }
  
  // ===================================
  // PUBLIC UTILITY METHODS
  // ===================================
  
  public getCurrentUser(): User | null {
    return this.currentUser();
  }
  
  public hasRole(role: UserRole): boolean {
    return this.userRole() === role;
  }
  
  public canAccess(allowedRoles: UserRole[]): boolean {
    if (!this.isAuthenticated()) return false;
    if (allowedRoles.length === 0) return true;
    return allowedRoles.includes(this.userRole()!);
  }
  
  public redirectToDashboard(): void {
    const role = this.userRole();
    if (role === UserRole.ADMIN) {
      this.router.navigate(['/admin']);
    } else if (role === UserRole.BUYER) {
      this.router.navigate(['/buyer']);
    } else {
      this.router.navigate(['/']);
    }
  }
}