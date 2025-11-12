# Guards

Esta carpeta contiene los guards de Angular para proteger rutas y controlar el acceso a diferentes secciones de ShikenShop.

## Guards Principales:

### Authentication Guards
- `auth.guard.ts` - Verificar si el usuario está autenticado
- `guest.guard.ts` - Permitir acceso solo a usuarios no autenticados
- `admin.guard.ts` - Verificar rol de administrador
- `buyer.guard.ts` - Verificar rol de comprador

### Feature Guards
- `cart.guard.ts` - Verificar que el carrito tenga ítems antes del checkout
- `profile-complete.guard.ts` - Verificar que el perfil esté completo
- `subscription.guard.ts` - Verificar suscripciones o membresías (futuro)

### Utility Guards
- `unsaved-changes.guard.ts` - Prevenir navegación con cambios no guardados
- `permissions.guard.ts` - Verificar permisos específicos

## Tipos de Guards Implementados:
- **CanActivate**: Controlar si una ruta puede ser activada
- **CanDeactivate**: Controlar si se puede salir de una ruta
- **CanLoad**: Controlar si un módulo puede ser cargado (lazy loading)

## Convenciones:
- Sufijo `.guard.ts` para archivos
- Implementar interfaces CanActivate, CanDeactivate, etc.
- Retornar boolean, Promise<boolean> o Observable<boolean>
- Usar inyección de dependencias para servicios requeridos
- Manejar redirecciones en caso de acceso denegado

## Ejemplo:
```typescript
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
```