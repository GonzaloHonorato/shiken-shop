# Guía de Documentación JSDoc para ShikenShop

Este documento proporciona ejemplos y plantillas para documentar el código del proyecto usando JSDoc con máxima cobertura.

## Etiquetas Principales

### @description
Descripción detallada del elemento (clase, método, propiedad, etc.)

### @param
Documenta parámetros de funciones y métodos
```typescript
@param {tipo} nombreParametro - Descripción del parámetro
```

### @returns
Documenta el valor de retorno
```typescript
@returns {tipo} Descripción de lo que retorna
```

### @example
Muestra ejemplos de uso del código
```typescript
@example
// Código de ejemplo
const result = myFunction(param1, param2);
```

### @usageNotes
Notas importantes sobre el uso, advertencias, limitaciones, etc.

## Ejemplos Completos

### Documentar una Clase/Servicio

```typescript
/**
 * @description
 * Servicio de autenticación que gestiona el login, logout y estado de sesión de usuarios.
 * Implementa control de sesiones, timeouts, y manejo de roles (admin/buyer).
 * 
 * @usageNotes
 * - Este servicio debe inyectarse en componentes que requieran autenticación
 * - La sesión expira después de 30 minutos de inactividad
 * - Soporta "recordarme" para persistir sesiones
 * - Emite eventos de cambio de estado mediante signals y observables
 * 
 * @example
 * ```typescript
 * constructor(private authService: AuthService) {
 *   // Verificar si el usuario está autenticado
 *   if (this.authService.isAuthenticated()) {
 *     console.log('Usuario logueado:', this.authService.currentUser());
 *   }
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Login de usuario
 * this.authService.login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * }, true).subscribe({
 *   next: (user) => console.log('Login exitoso', user),
 *   error: (err) => console.error('Error en login', err)
 * });
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // ...
}
```

### Documentar un Método

```typescript
/**
 * @description
 * Autentica un usuario con email y contraseña, creando una sesión activa.
 * Valida las credenciales, aplica límites de intentos fallidos, y guarda
 * el estado de sesión en localStorage si se especifica "recordarme".
 * 
 * @param {LoginCredentials} credentials - Credenciales del usuario (email y password)
 * @param {boolean} [rememberMe=false] - Si es true, persiste la sesión en localStorage
 * 
 * @returns {Observable<User>} Observable que emite el usuario autenticado o error
 * 
 * @usageNotes
 * - Después de 5 intentos fallidos, la cuenta se bloquea por 15 minutos
 * - El email debe estar en formato válido
 * - La contraseña debe tener al menos 6 caracteres
 * - La sesión expira después de 30 minutos de inactividad
 * 
 * @example
 * ```typescript
 * // Login básico
 * this.authService.login(
 *   { email: 'admin@shiken.com', password: 'admin123' },
 *   false
 * ).subscribe({
 *   next: (user) => {
 *     console.log('Bienvenido:', user.name);
 *     this.router.navigate(['/dashboard']);
 *   },
 *   error: (err) => {
 *     console.error('Error:', err.message);
 *   }
 * });
 * ```
 * 
 * @example
 * ```typescript
 * // Login con "recordarme"
 * this.authService.login(credentials, true).subscribe();
 * ```
 */
public login(credentials: LoginCredentials, rememberMe: boolean = false): Observable<User> {
  // ...
}
```

### Documentar una Interface

```typescript
/**
 * @description
 * Define la estructura de datos para un usuario del sistema ShikenShop.
 * Incluye información básica, credenciales, rol y datos opcionales de perfil.
 * 
 * @interface User
 * 
 * @property {string} name - Nombre del usuario (requerido)
 * @property {string} email - Email único del usuario (requerido)
 * @property {string} password - Contraseña hasheada (requerido)
 * @property {UserRole} role - Rol del usuario: 'admin' o 'buyer'
 * @property {boolean} active - Estado activo/inactivo del usuario
 * @property {string} registeredAt - Fecha ISO de registro
 * @property {string} [fullName] - Nombre completo (opcional)
 * @property {string} [username] - Nombre de usuario único (opcional)
 * @property {string} [phone] - Teléfono de contacto (opcional)
 * @property {string} [birthdate] - Fecha de nacimiento ISO (opcional)
 * @property {string} [address] - Dirección postal (opcional)
 * @property {string} [updatedAt] - Fecha ISO de última actualización (opcional)
 * 
 * @usageNotes
 * - El email debe ser único en el sistema
 * - La contraseña debe ser hasheada antes de guardar
 * - Los campos opcionales pueden agregarse después del registro
 * - El campo 'active' permite deshabilitar usuarios sin eliminarlos
 * 
 * @example
 * ```typescript
 * const newUser: User = {
 *   name: 'Juan Pérez',
 *   email: 'juan@example.com',
 *   password: 'hashed_password_here',
 *   role: UserRole.BUYER,
 *   active: true,
 *   registeredAt: new Date().toISOString(),
 *   fullName: 'Juan Carlos Pérez García',
 *   phone: '+56912345678'
 * };
 * ```
 */
export interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  registeredAt: string;
  fullName?: string;
  username?: string;
  phone?: string;
  birthdate?: string;
  address?: string;
  updatedAt?: string;
}
```

### Documentar Propiedades/Señales

```typescript
/**
 * @description
 * Signal de solo lectura que contiene el estado actual de autenticación.
 * Incluye información sobre si el usuario está autenticado, sus datos y rol.
 * 
 * @type {Signal<AuthState>}
 * @readonly
 * 
 * @usageNotes
 * - Es una signal de solo lectura, no puede modificarse directamente
 * - Se actualiza automáticamente cuando cambia el estado de autenticación
 * - Útil para templates que necesitan reactividad automática
 * 
 * @example
 * ```typescript
 * // En un componente
 * if (this.authService.authState().isAuthenticated) {
 *   const userName = this.authService.authState().user?.name;
 *   console.log('Usuario:', userName);
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // En un template
 * @if (authService.authState().isAuthenticated) {
 *   <p>Bienvenido {{ authService.authState().user?.name }}</p>
 * }
 * ```
 */
public readonly authState = this.authStateSignal.asReadonly();
```

### Documentar un Componente

```typescript
/**
 * @description
 * Componente de login que permite a los usuarios autenticarse en el sistema.
 * Incluye validación de formularios, manejo de errores y redirección después del login.
 * 
 * @component LoginComponent
 * @selector app-login
 * @standalone true
 * 
 * @usageNotes
 * - Solo accesible para usuarios no autenticados (protegido por GuestGuard)
 * - Valida email y contraseña en tiempo real
 * - Muestra mensajes de error específicos para cada tipo de fallo
 * - Redirige según el rol: admin -> /admin, buyer -> /buyer
 * - Soporta funcionalidad "recordarme"
 * 
 * @example
 * ```typescript
 * // Uso en rutas
 * {
 *   path: 'login',
 *   component: LoginComponent,
 *   canActivate: [GuestGuard]
 * }
 * ```
 * 
 * @example
 * ```html
 * <!-- Uso directo -->
 * <app-login></app-login>
 * ```
 */
@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  // ...
}
```

## Plantillas por Tipo de Elemento

### Servicio
```typescript
/**
 * @description [Descripción detallada del servicio]
 * 
 * @usageNotes
 * - [Nota importante 1]
 * - [Nota importante 2]
 * 
 * @example
 * ```typescript
 * // [Ejemplo de uso]
 * ```
 */
```

### Método Público
```typescript
/**
 * @description [Qué hace el método]
 * 
 * @param {tipo} nombre - [Descripción del parámetro]
 * @returns {tipo} [Descripción del retorno]
 * 
 * @usageNotes
 * - [Consideraciones importantes]
 * 
 * @example
 * ```typescript
 * // [Ejemplo básico]
 * ```
 * 
 * @example
 * ```typescript
 * // [Ejemplo avanzado]
 * ```
 */
```

### Interface/Type
```typescript
/**
 * @description [Propósito de la interface]
 * 
 * @interface [Nombre]
 * 
 * @property {tipo} nombre - [Descripción]
 * 
 * @usageNotes
 * - [Restricciones o reglas]
 * 
 * @example
 * ```typescript
 * // [Ejemplo de creación]
 * ```
 */
```

## Mejores Prácticas

1. **Siempre documenta**: Clases, métodos públicos, interfaces, tipos, enums
2. **Sé específico**: Describe comportamientos, no solo repitas el nombre
3. **Incluye ejemplos**: Al menos uno por método/clase principal
4. **Documenta excepciones**: Cuándo y por qué puede fallar
5. **Actualiza documentación**: Cuando cambies el código
6. **Usa @usageNotes**: Para advertencias, limitaciones, mejores prácticas

## Comandos

- Generar documentación: `npm run docs`
- Solo Compodoc: `npm run docs:compodoc`
- Solo JSDoc: `npm run docs:jsdoc`
- Ver Compodoc: `npm run docs:compodoc:serve`
