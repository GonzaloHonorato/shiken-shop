import { Routes } from '@angular/router';

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
  
  // FASE 2: Autenticación - Rutas públicas
  // {
  //   path: 'login',
  //   loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
  //   title: 'Iniciar Sesión - ShikenShop'
  // },
  // {
  //   path: 'register', 
  //   loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent),
  //   title: 'Registro - ShikenShop'
  // },

  // FASE 2: Categorías de juegos - Rutas públicas
  // {
  //   path: 'accion',
  //   loadComponent: () => import('./pages/categories/action/action.component').then(m => m.ActionComponent),
  //   title: 'Juegos de Acción - ShikenShop'
  // },
  // {
  //   path: 'rpg',
  //   loadComponent: () => import('./pages/categories/rpg/rpg.component').then(m => m.RpgComponent),
  //   title: 'Juegos RPG - ShikenShop'  
  // },
  // {
  //   path: 'estrategia',
  //   loadComponent: () => import('./pages/categories/strategy/strategy.component').then(m => m.StrategyComponent),
  //   title: 'Juegos de Estrategia - ShikenShop'
  // },
  // {
  //   path: 'aventura',
  //   loadComponent: () => import('./pages/categories/adventure/adventure.component').then(m => m.AdventureComponent),
  //   title: 'Juegos de Aventura - ShikenShop'
  // },

  // FASE 3: Carrito de compras
  // {
  //   path: 'carrito',
  //   loadComponent: () => import('./pages/cart/cart.component').then(m => m.CartComponent),
  //   title: 'Carrito de Compras - ShikenShop'
  // },

  // FASE 4: Panel de Administrador - Rutas protegidas
  // {
  //   path: 'admin',
  //   canActivate: [AuthGuard, AdminGuard],
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent) },
  //     { path: 'productos', loadComponent: () => import('./pages/admin-products/admin-products.component').then(m => m.AdminProductsComponent) },
  //     { path: 'usuarios', loadComponent: () => import('./pages/admin-users/admin-users.component').then(m => m.AdminUsersComponent) },
  //     { path: 'ventas', loadComponent: () => import('./pages/admin-sales/admin-sales.component').then(m => m.AdminSalesComponent) }
  //   ]
  // },

  // FASE 4: Panel de Comprador - Rutas protegidas  
  // {
  //   path: 'buyer',
  //   canActivate: [AuthGuard, BuyerGuard],
  //   children: [
  //     { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  //     { path: 'dashboard', loadComponent: () => import('./pages/buyer-dashboard/buyer-dashboard.component').then(m => m.BuyerDashboardComponent) },
  //     { path: 'mis-compras', loadComponent: () => import('./pages/my-purchases/my-purchases.component').then(m => m.MyPurchasesComponent) }
  //   ]
  // },

  // Wildcard route - debe ser la última
  {
    path: '**',
    redirectTo: '/404'
  }
];
