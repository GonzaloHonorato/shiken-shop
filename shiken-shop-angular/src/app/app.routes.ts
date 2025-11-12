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

  // FASE 2: Categorías de juegos - Rutas públicas
  {
    path: 'accion',
    loadComponent: () => import('./pages/categories/accion/accion.component').then(m => m.AccionComponent),
    title: 'Juegos de Acción - ShikenShop'
  },
  {
    path: 'rpg',
    loadComponent: () => import('./pages/categories/rpg/rpg.component').then(m => m.RpgComponent),
    title: 'Juegos RPG - ShikenShop'  
  },
  {
    path: 'estrategia',
    loadComponent: () => import('./pages/categories/estrategia/estrategia.component').then(m => m.EstrategiaComponent),
    title: 'Juegos de Estrategia - ShikenShop'
  },
  {
    path: 'aventura',
    loadComponent: () => import('./pages/categories/aventura/aventura.component').then(m => m.AventuraComponent),
    title: 'Juegos de Aventura - ShikenShop'
  },

  // FASE 3: Carrito de compras (requiere autenticación)
  // {
  //   path: 'carrito',
  //   canActivate: [AuthGuard],
  //   loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
  //   title: 'Carrito de Compras - ShikenShop'
  // },
  
  // Mi cuenta (accesible para usuarios autenticados de cualquier rol)
  // {
  //   path: 'mi-cuenta',
  //   canActivate: [AuthGuard],
  //   loadComponent: () => import('./pages/my-account/my-account.component').then(m => m.MyAccountComponent),
  //   title: 'Mi Cuenta - ShikenShop'
  // },

  // FASE 4: Panel de Administrador - Solo admins
  // {
  //   path: 'admin',
  //   canActivate: [AdminGuard],
  //   children: [
  //     { 
  //       path: '', 
  //       redirectTo: 'dashboard', 
  //       pathMatch: 'full' 
  //     },
  //     { 
  //       path: 'dashboard', 
  //       loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
  //       title: 'Dashboard Administrativo - ShikenShop'
  //     },
  //     { 
  //       path: 'productos', 
  //       loadComponent: () => import('./pages/admin-products/admin-products.component').then(m => m.AdminProductsComponent),
  //       title: 'Gestión de Productos - ShikenShop'
  //     },
  //     { 
  //       path: 'usuarios', 
  //       loadComponent: () => import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent),
  //       title: 'Gestión de Usuarios - ShikenShop'
  //     },
  //     { 
  //       path: 'ventas', 
  //       loadComponent: () => import('./pages/admin-sales/admin-sales.component').then(m => m.AdminSalesComponent),
  //       title: 'Gestión de Ventas - ShikenShop'
  //     }
  //   ]
  // },

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
