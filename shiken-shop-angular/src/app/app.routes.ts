import { Routes } from '@angular/router';
import { AuthGuard, AdminGuard, BuyerGuard, GuestGuard, RoleGuard } from './guards';

export const routes: Routes = [
  // Ruta por defecto - Home
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  // Página principal
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'ShikenShop - Tienda de Videojuegos'
  },

  // Rutas de error - Por ahora solo estas dos funcionan
  {
    path: '404',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Página No Encontrada - ShikenShop'
  },

  // TODO: Las siguientes rutas se activarán cuando creemos los componentes correspondientes
  
  // FASE 2: Autenticación - Rutas públicas (solo para invitados)
  {
    path: 'login',
    canActivate: [GuestGuard],
    loadComponent: () => import('./components/auth/login.component').then(m => m.LoginComponent),
    title: 'Iniciar Sesión - ShikenShop'
  },
  {
    path: 'register', 
    canActivate: [GuestGuard],
    loadComponent: () => import('./components/auth/register.component').then(m => m.RegisterComponent),
    title: 'Registro - ShikenShop'
  },
  {
    path: 'forgot-password',
    canActivate: [GuestGuard], 
    loadComponent: () => import('./pages/auth/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    title: 'Recuperar Contraseña - ShikenShop'
  },

  // FASE 2: Categorías de juegos - Rutas públicas
  {
    path: 'categories/accion',
    loadComponent: () => import('./pages/categories/accion/accion.component').then(m => m.AccionComponent),
    title: 'Juegos de Acción - ShikenShop'
  },
  {
    path: 'categories/rpg',
    loadComponent: () => import('./pages/categories/rpg/rpg.component').then(m => m.RpgComponent),
    title: 'Juegos RPG - ShikenShop'  
  },
  {
    path: 'categories/estrategia',
    loadComponent: () => import('./pages/categories/estrategia/estrategia.component').then(m => m.EstrategiaComponent),
    title: 'Juegos de Estrategia - ShikenShop'
  },
  {
    path: 'categories/aventura',
    loadComponent: () => import('./pages/categories/aventura/aventura.component').then(m => m.AventuraComponent),
    title: 'Juegos de Aventura - ShikenShop'
  },

  // Rutas de compatibilidad para categorías
  { path: 'accion', redirectTo: '/categories/accion', pathMatch: 'full' },
  { path: 'rpg', redirectTo: '/categories/rpg', pathMatch: 'full' },
  { path: 'estrategia', redirectTo: '/categories/estrategia', pathMatch: 'full' },
  { path: 'aventura', redirectTo: '/categories/aventura', pathMatch: 'full' },

  // FASE 3: Carrito de compras
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
    title: 'Carrito de Compras - ShikenShop'
  },
  {
    path: 'carrito', // Ruta alternativa para compatibilidad
    redirectTo: '/cart',
    pathMatch: 'full'
  },
  
  // Mi cuenta (accesible para usuarios autenticados de cualquier rol)
  // {
  //   path: 'mi-cuenta',
  //   canActivate: [AuthGuard],
  //   loadComponent: () => import('./pages/my-account/my-account.component').then(m => m.MyAccountComponent),
  //   title: 'Mi Cuenta - ShikenShop'
  // },

  // FASE 3: Panel Administrativo - Solo admins
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { 
        path: '', 
        redirectTo: 'dashboard', 
        pathMatch: 'full' 
      },
      { 
        path: 'dashboard', 
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Dashboard Administrativo - ShikenShop'
      },
      { 
        path: 'productos', 
        loadComponent: () => import('./pages/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
        title: 'Gestión de Productos - ShikenShop'
      },
      { 
        path: 'usuarios', 
        loadComponent: () => import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
        title: 'Gestión de Usuarios - ShikenShop'
      },
      // TODO: Descomentar cuando se cree el componente
      // { 
      //   path: 'ventas', 
      //   loadComponent: () => import('./pages/admin-sales/admin-sales.component').then(m => m.AdminSalesComponent),
      //   title: 'Gestión de Ventas - ShikenShop'
      // }
      // { 
      //   path: 'ventas', 
      //   loadComponent: () => import('./pages/admin-sales/admin-sales.component').then(m => m.AdminSalesComponent),
      //   title: 'Gestión de Ventas - ShikenShop'
      // }
    ]
  },  // FASE 5: Mi Cuenta - Usuarios autenticados
  {
    path: 'mi-cuenta',
    canActivate: [AuthGuard],
    loadComponent: () => import('./pages/mi-cuenta/mi-cuenta.component').then(m => m.MiCuentaComponent),
    title: 'Mi Cuenta - ShikenShop'
  },

  // FASE 4: Panel de Comprador - Solo buyers
  // {
  //   path: 'buyer',
  //   canActivate: [BuyerGuard],
  //   children: [
  //     { 
  //       path: '', 
  //       redirectTo: 'dashboard', 
  //       pathMatch: 'full' 
  //     },
  //     { 
  //       path: 'dashboard', 
  //       loadComponent: () => import('./pages/buyer-dashboard/buyer-dashboard.component').then(m => m.BuyerDashboardComponent),
  //       title: 'Mi Dashboard - ShikenShop'
  //     },
  //     { 
  //       path: 'mis-compras', 
  //       loadComponent: () => import('./pages/my-purchases/my-purchases.component').then(m => m.MyPurchasesComponent),
  //       title: 'Mis Compras - ShikenShop'
  //     }
  //   ]
  // },

  // Wildcard route - debe ser la última
  {
    path: '**',
    redirectTo: '/404'
  }
];
