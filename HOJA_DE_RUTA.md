# 🗺️ HOJA DE RUTA - ShikenShop
## Sistema de Autenticación y Gestión con Roles

---

## 📋 RESUMEN EJECUTIVO

### Objetivo
Implementar un sistema completo de autenticación con dos roles (Comprador y Administrador), incluyendo paneles de gestión y vistas de usuario.

### Tecnologías
- HTML5 + Tailwind CSS
- JavaScript (ES6+)
- LocalStorage para persistencia
- Sistema de roles basado en tokens

---

## ✅ FASE 1: SISTEMA DE AUTENTICACIÓN (COMPLETADA)

### 1.1 Login System ✅
**Prioridad: ALTA** | **Estimado: 2-3 horas** | **Estado: COMPLETADO**

#### Archivos creados:
```
pages/
├── auth/
│   ├── login.html               ✅
│   ├── login.css                ✅
│   ├── login.js                 ✅
│   ├── forgot-password.html     ✅
│   └── forgot-password.js       ✅
```

#### Funcionalidades implementadas:
- ✅ Formulario de login (email/username + password)
- ✅ Validación de credenciales contra LocalStorage
- ✅ Manejo de roles (buyer/admin)
- ✅ Redirección según rol
- ✅ Recordar sesión
- ✅ Protección contra fuerza bruta (5 intentos, bloqueo 15 min)
- ✅ Link a "Olvidé mi contraseña"
- ✅ Sistema de recuperación de contraseña con código de 6 dígitos
- ✅ Link a registro
- ✅ Animaciones de carga y efectos visuales

#### Usuarios Hardcoded (LocalStorage):
```javascript
const HARDCODED_USERS = [
    {
        id: 'user_001',
        username: 'admin',
        email: 'admin@shikenshop.com',
        password: 'Admin123',
        role: 'admin',
        fullName: 'Administrador Principal',
        phone: '+56 9 1234 5678',
        birthdate: '1990-01-01',
        address: 'Santiago, Chile'
    },
    {
        id: 'user_002',
        username: 'comprador1',
        email: 'comprador@test.com',
        password: 'Comprador123',
        role: 'buyer',
        fullName: 'Juan Pérez',
        phone: '+56 9 8765 4321',
        birthdate: '1995-06-15',
        address: 'Valparaíso, Chile'
    },
    {
        id: 'user_003',
        username: 'maria_gomez',
        email: 'maria.gomez@test.com',
        password: 'Maria123',
        role: 'buyer',
        fullName: 'María Gómez',
        phone: '+56 9 5555 5555',
        birthdate: '1992-03-20',
        address: 'Concepción, Chile'
    }
];
```

#### Estados de sesión:
```javascript
sessionData = {
    userId: string,
    username: string,
    email: string,
    fullName: string,
    role: 'admin' | 'buyer',
    loginTime: timestamp,
    lastActivity: timestamp
}
```

---

### 1.2 Auth Guard / Middleware ✅
**Prioridad: ALTA** | **Estimado: 1 hora** | **Estado: COMPLETADO**

#### Archivo creado:
```
scripts/
└── auth-guard.js                ✅
```

#### Funcionalidades implementadas:
- ✅ Verificar si usuario está logueado
- ✅ Validar rol requerido para cada página
- ✅ Redireccionar si no autorizado
- ✅ Renovar sesión automáticamente
- ✅ Cerrar sesión con timeout (30 minutos de inactividad)
- ✅ Funciones: requireAuth(), isLoggedIn(), hasRole(), getSession(), logout()

---

### 1.3 Data Initialization ✅
**Prioridad: ALTA** | **Estimado: 1 hora** | **Estado: COMPLETADO**

#### Archivo creado:
```
scripts/
└── init-data.js                 ✅
```

#### Datos inicializados:
- ✅ 3 usuarios hardcodeados (1 admin, 2 buyers)
- ✅ 12 productos (3 por categoría: Acción, RPG, Estrategia, Aventura)
- ✅ 3 órdenes de ejemplo
- ✅ Inicialización automática en primer acceso

---

### 1.4 Registration System Updates ✅
**Prioridad: ALTA** | **Estimado: 1 hora** | **Estado: COMPLETADO**

#### Archivo actualizado:
```
pages/
└── registro/
    └── registro.js              ✅
```

#### Funcionalidades implementadas:
- ✅ Asignación automática de rol "buyer"
- ✅ Generación de ID único (user_timestamp)
- ✅ Redirección a login después de registro exitoso
- ✅ Validación de duplicados (email/username)

---

### 1.5 Dynamic Navigation UI ✅
**Prioridad: ALTA** | **Estimado: 2 horas** | **Estado: COMPLETADO**

#### Archivos actualizados:
```
index.html                       ✅
scripts/index.js                 ✅
```

#### Funcionalidades implementadas:
- ✅ Menú para usuarios invitados (Login/Registrarse)
- ✅ Menú para usuarios autenticados (Avatar, Dropdown)
- ✅ Dropdown con opciones: Mi Panel, Mi Cuenta, Cerrar Sesión
- ✅ Redirección dinámica según rol (admin/buyer panel)
- ✅ Contador de carrito actualizado
- ✅ Confirmación antes de cerrar sesión

---

### 1.6 Password Recovery System ✅
**Prioridad: ALTA** | **Estimado: 2 horas** | **Estado: COMPLETADO**

#### Archivos creados:
```
pages/
└── auth/
    ├── forgot-password.html     ✅
    └── forgot-password.js       ✅
```

#### Funcionalidades implementadas:
- ✅ Proceso de 3 pasos (Email → Código → Nueva Contraseña)
- ✅ Generación de código de 6 dígitos
- ✅ Validación de email contra usuarios registrados
- ✅ Token temporal con expiración (15 minutos)
- ✅ Opción para reenviar código
- ✅ Medidor de fortaleza de contraseña
- ✅ Validación de requisitos de contraseña

---

### 1.7 Account Management ✅
**Prioridad: ALTA** | **Estimado: 3 horas** | **Estado: COMPLETADO**

#### Archivos creados:
```
pages/
└── mi-cuenta/
    ├── mi-cuenta.html           ✅
    ├── mi-cuenta.css            ✅
    └── mi-cuenta.js             ✅
```

#### Funcionalidades implementadas:
- ✅ Sistema de pestañas (Perfil / Seguridad)
- ✅ Edición de perfil completo:
  - ✅ Nombre completo
  - ✅ Nombre de usuario
  - ✅ Correo electrónico
  - ✅ Teléfono
  - ✅ Fecha de nacimiento
  - ✅ Dirección
- ✅ Avatar dinámico generado automáticamente
- ✅ Validación en tiempo real de campos
- ✅ Cambio de contraseña con validación de contraseña actual
- ✅ Botón cancelar para descartar cambios
- ✅ Toggle de visibilidad para contraseñas
- ✅ Notificaciones de éxito/error
- ✅ Prevención de duplicados (email/username)
- ✅ Actualización automática de sesión si cambia email

---

## 📊 RESUMEN FASE 1

### ✅ Completado: 100%
- Sistema de login completo con validaciones
- Middleware de autenticación (auth-guard.js)
- Datos hardcodeados inicializados
- Registro actualizado con asignación de roles
- UI dinámica en navegación principal
- Sistema de recuperación de contraseña
- Gestión completa de cuenta de usuario

### 📁 Archivos creados: 11
- pages/auth/login.html
- pages/auth/login.css
- pages/auth/login.js
- pages/auth/forgot-password.html
- pages/auth/forgot-password.js
- pages/mi-cuenta/mi-cuenta.html
- pages/mi-cuenta/mi-cuenta.css
- pages/mi-cuenta/mi-cuenta.js
- scripts/auth-guard.js
- scripts/init-data.js
- ✏️ Actualizados: index.html, scripts/index.js, pages/registro/registro.js, README.md

### ⏱️ Tiempo total estimado: ~15 horas

---

## 🎯 FASE 2: REESTRUCTURACIÓN DE CARPETAS
    requireAuth(['admin']); // o ['buyer'] o ['admin', 'buyer']
</script>
```

---

### 1.3 Actualizar Registro
**Prioridad: MEDIA** | **Estimado: 1 hora**

#### Modificaciones en `pages/registro/`:
- ✅ Asignar rol 'buyer' por defecto
- ✅ Generar ID único
- ✅ Redirigir a login después de registro exitoso
- ✅ Agregar usuario a lista de usuarios en LocalStorage

---

## 🎯 FASE 2: RESTRUCTURACIÓN DE NAVEGACIÓN

### 2.1 Nueva Estructura de Carpetas
**Prioridad: ALTA** | **Estimado: 30 min**

```
pages/
├── public/              # Páginas públicas (sin login)
│   ├── home/
│   │   ├── home.html
│   │   ├── home.css
│   │   └── home.js
│   ├── accion/
│   ├── rpg/
│   ├── estrategia/
│   ├── aventura/
│   └── auth/
│       ├── login.html
│       └── registro.html
│
├── buyer/               # Panel del comprador (requiere login)
│   ├── dashboard/
│   │   ├── dashboard.html
│   │   ├── dashboard.css
│   │   └── dashboard.js
│   ├── mis-compras/
│   │   ├── mis-compras.html
│   │   ├── mis-compras.css
│   │   └── mis-compras.js
│   ├── mi-cuenta/
│   │   ├── mi-cuenta.html
│   │   ├── mi-cuenta.css
│   │   └── mi-cuenta.js
│   └── carrito/
│       └── (mover carrito aquí)
│
└── admin/               # Panel del administrador (requiere login admin)
    ├── dashboard/
    │   ├── dashboard.html
    │   ├── dashboard.css
    │   └── dashboard.js
    ├── productos/
    │   ├── productos.html
    │   ├── productos.css
    │   └── productos.js
    ├── ventas/
    │   ├── ventas.html
    │   ├── ventas.css
    │   └── ventas.js
    └── usuarios/
        ├── usuarios.html
        ├── usuarios.css
        └── usuarios.js
```

### 2.2 Actualizar index.html
**Prioridad: ALTA** | **Estimado: 30 min**

#### Cambios en header:
```html
<!-- Si NO está logueado -->
<a href="./pages/auth/login.html">Iniciar Sesión</a>
<a href="./pages/auth/registro.html">Registrarse</a>

<!-- Si está logueado como BUYER -->
<a href="./pages/buyer/dashboard/dashboard.html">Mi Panel</a>
<a href="./pages/buyer/mi-cuenta/mi-cuenta.html">
    <img src="avatar" /> Juan Pérez
</a>
<a href="./pages/buyer/carrito/carrito.html">Carrito (3)</a>
<button onclick="logout()">Cerrar Sesión</button>

<!-- Si está logueado como ADMIN -->
<a href="./pages/admin/dashboard/dashboard.html">Panel Admin</a>
<a href="./pages/admin/productos/productos.html">Productos</a>
<a href="./pages/admin/ventas/ventas.html">Ventas</a>
<button onclick="logout()">Cerrar Sesión</button>
```

---

## 🎯 FASE 3: PANEL DEL COMPRADOR (BUYER)

### 3.1 Dashboard del Comprador
**Prioridad: ALTA** | **Estimado: 2 horas**

#### `pages/buyer/dashboard/dashboard.html`

#### Secciones:
1. **Resumen de cuenta**
   - Nombre de usuario
   - Total gastado
   - Número de compras
   - Descuentos acumulados

2. **Últimas compras** (3 más recientes)
   - Imagen del juego
   - Nombre
   - Fecha de compra
   - Precio pagado

3. **Recomendaciones**
   - Basado en categorías compradas
   - Juegos destacados

4. **Accesos rápidos**
   - Ver todas mis compras
   - Actualizar mi cuenta
   - Ir al catálogo

---

### 3.2 Mis Compras
**Prioridad: ALTA** | **Estimado: 2 horas**

#### `pages/buyer/mis-compras/mis-compras.html`

#### Funcionalidades:
- ✅ Listar todas las órdenes del usuario
- ✅ Filtros:
  - Por fecha
  - Por categoría
  - Por rango de precio
- ✅ Búsqueda por nombre de juego
- ✅ Detalles de cada orden:
  - Número de orden
  - Fecha
  - Productos
  - Total pagado
  - Estado (completado)
- ✅ Botón "Descargar Factura" (generar PDF o imprimir)
- ✅ Estadísticas:
  - Gasto total
  - Categoría más comprada
  - Juego más caro comprado

#### Vista de tabla:
```
| # Orden | Fecha | Productos | Total | Acciones |
|---------|-------|-----------|-------|----------|
| 00123   | 01/11 | 3 juegos  | $150k | Ver/PDF  |
```

---

### 3.3 Mi Cuenta
**Prioridad: MEDIA** | **Estimado: 2 horas**

#### `pages/buyer/mi-cuenta/mi-cuenta.html`

#### Secciones:

1. **Información Personal**
   - Nombre completo (editable)
   - Email (editable)
   - Fecha de nacimiento
   - Dirección (editable)
   - Botón "Guardar Cambios"

2. **Seguridad**
   - Cambiar contraseña
   - Verificación de contraseña actual
   - Nueva contraseña (con validaciones)
   - Confirmar nueva contraseña

3. **Preferencias**
   - Categorías favoritas (checkboxes)
   - Recibir notificaciones de ofertas
   - Newsletter

4. **Eliminar Cuenta**
   - Botón con confirmación
   - Modal de advertencia

---

### 3.4 Carrito (Actualizado)
**Prioridad: MEDIA** | **Estimado: 1 hora**

#### Modificaciones:
- ✅ Mover a `pages/buyer/carrito/`
- ✅ Requiere login para checkout
- ✅ Mostrar información del usuario
- ✅ Guardar dirección de envío desde perfil
- ✅ Agregar orden a historial después de comprar

---

## 🎯 FASE 4: PANEL DEL ADMINISTRADOR (ADMIN)

### 4.1 Dashboard del Admin
**Prioridad: ALTA** | **Estimado: 3 horas**

#### `pages/admin/dashboard/dashboard.html`

#### Secciones:

1. **KPIs / Métricas**
   ```
   ┌─────────────┬─────────────┬─────────────┬─────────────┐
   │ Total       │ Ventas      │ Usuarios    │ Productos   │
   │ Ventas      │ del Mes     │ Activos     │ en Stock    │
   │ $2.5M       │ $450K       │ 1,234       │ 48          │
   └─────────────┴─────────────┴─────────────┴─────────────┘
   ```

2. **Gráfico de Ventas**
   - Línea temporal (últimos 7 días)
   - Ventas por categoría (gráfico de barras o pie)

3. **Últimas Ventas** (tabla)
   - 5 ventas más recientes
   - Usuario, productos, total, fecha

4. **Productos Más Vendidos**
   - Top 5 con imagen
   - Cantidad vendida
   - Ingresos generados

5. **Alertas/Notificaciones**
   - Productos con bajo stock
   - Nuevos usuarios registrados

---

### 4.2 Gestión de Productos
**Prioridad: ALTA** | **Estimado: 4 horas**

#### `pages/admin/productos/productos.html`

#### Funcionalidades:

1. **Lista de Productos**
   - Tabla con todos los productos
   - Columnas:
     - ID
     - Imagen
     - Nombre
     - Categoría
     - Precio
     - Descuento
     - Stock
     - Estado (Activo/Inactivo)
     - Acciones (Editar/Eliminar)
   - Paginación (10 por página)
   - Búsqueda en tiempo real
   - Filtros:
     - Por categoría
     - Por rango de precio
     - Por estado

2. **Agregar Producto**
   - Modal o página separada
   - Campos:
     - Nombre *
     - Descripción *
     - Categoría * (select)
     - Precio *
     - Descuento (%)
     - Stock *
     - Imagen (URL o upload simulado)
     - Estado (Activo/Inactivo)
   - Botones: Guardar / Cancelar

3. **Editar Producto**
   - Cargar datos existentes
   - Mismos campos que agregar
   - Validaciones

4. **Eliminar Producto**
   - Modal de confirmación
   - "¿Seguro que deseas eliminar [nombre]?"
   - No eliminar si tiene ventas (soft delete)

5. **Exportar Productos**
   - Botón "Exportar a CSV"
   - Descarga archivo con todos los productos

#### Estructura de datos (LocalStorage):
```javascript
products = [
    {
        id: 'accion-1',
        name: 'Cyberpunk Fury',
        description: '...',
        category: 'accion',
        price: 44990,
        originalPrice: 59990,
        discount: 25,
        stock: 100,
        image: 'url',
        active: true,
        createdAt: timestamp,
        updatedAt: timestamp
    }
]
```

---

### 4.3 Gestión de Ventas
**Prioridad: ALTA** | **Estimado: 3 horas**

#### `pages/admin/ventas/ventas.html`

#### Funcionalidades:

1. **Resumen de Ventas**
   - Total de ventas (hoy, semana, mes)
   - Ingresos totales
   - Promedio de venta
   - Número de transacciones

2. **Tabla de Órdenes**
   - Todas las órdenes realizadas
   - Columnas:
     - # Orden
     - Usuario
     - Fecha
     - Productos (cantidad)
     - Total
     - Estado
     - Acciones (Ver detalles)
   - Ordenar por fecha (desc)
   - Filtros:
     - Por fecha (rango)
     - Por usuario
     - Por monto

3. **Detalle de Orden** (Modal)
   - Información del cliente
   - Lista de productos comprados
   - Subtotal, descuentos, total
   - Dirección de envío
   - Fecha y hora de compra

4. **Estadísticas**
   - Categoría más vendida
   - Producto estrella
   - Cliente top (más compras)
   - Gráfico de ventas mensuales

5. **Exportar Ventas**
   - Filtrar por fechas
   - Exportar a CSV/Excel

#### Estructura de datos:
```javascript
orders = [
    {
        id: 'ORD-123456',
        userId: 2,
        userName: 'Juan Pérez',
        userEmail: 'juan@test.com',
        items: [
            { productId: 'accion-1', name: '...', price: 44990, quantity: 1 }
        ],
        subtotal: 44990,
        discount: 0,
        total: 44990,
        shippingAddress: '...',
        status: 'completed',
        createdAt: timestamp
    }
]
```

---

### 4.4 Gestión de Usuarios (OPCIONAL)
**Prioridad: BAJA** | **Estimado: 2 horas**

#### `pages/admin/usuarios/usuarios.html`

#### Funcionalidades:
- Lista de usuarios registrados
- Ver perfil de usuario
- Ver historial de compras
- Activar/Desactivar usuario
- Cambiar rol (buyer ↔ admin)
- Estadísticas por usuario

---

## 🎯 FASE 5: COMPONENTES COMPARTIDOS

### 5.1 Sidebar/Menú de Panel
**Prioridad: ALTA** | **Estimado: 1.5 horas**

#### Archivos:
```
components/
├── sidebar/
│   ├── sidebar-buyer.html
│   ├── sidebar-admin.html
│   ├── sidebar.css
│   └── sidebar.js
```

#### Sidebar Buyer:
- 🏠 Dashboard
- 🛒 Mis Compras
- 👤 Mi Cuenta
- 🎮 Catálogo (volver a tienda)
- 🚪 Cerrar Sesión

#### Sidebar Admin:
- 📊 Dashboard
- 📦 Productos
- 💰 Ventas
- 👥 Usuarios
- ⚙️ Configuración
- 🚪 Cerrar Sesión

#### Características:
- Responsive (colapsa en móvil)
- Highlight en página actual
- Iconos (usar Heroicons o similar)
- Animación de apertura/cierre

---

### 5.2 Header de Panel
**Prioridad: MEDIA** | **Estimado: 1 hora**

#### Elementos:
- Logo ShikenShop
- Breadcrumb (Dashboard > Productos > Editar)
- Buscador global
- Notificaciones (badge con número)
- Avatar + nombre de usuario
- Dropdown:
  - Ver perfil
  - Configuración
  - Cerrar sesión

---

### 5.3 Componentes Reutilizables
**Prioridad: MEDIA** | **Estimado: 2 horas**

#### `components/`:
```
components/
├── modal/
│   ├── modal.html
│   ├── modal.css
│   └── modal.js
├── table/
│   ├── data-table.html
│   ├── data-table.css
│   └── data-table.js
├── card/
│   ├── stat-card.html
│   └── stat-card.css
└── alerts/
    ├── alert.html
    ├── alert.css
    └── alert.js
```

---

## 🎯 FASE 6: LÓGICA DE DATOS (LocalStorage)

### 6.1 Data Manager
**Prioridad: ALTA** | **Estimado: 2 horas**

#### `scripts/data-manager.js`

#### Funciones:
```javascript
// Usuarios
- getUsers()
- getUserById(id)
- getUserByEmail(email)
- createUser(userData)
- updateUser(id, userData)
- deleteUser(id)

// Productos
- getProducts()
- getProductById(id)
- getProductsByCategory(category)
- createProduct(productData)
- updateProduct(id, productData)
- deleteProduct(id)
- searchProducts(query)

// Órdenes
- getOrders()
- getOrderById(id)
- getOrdersByUser(userId)
- createOrder(orderData)
- updateOrderStatus(id, status)

// Carrito
- getCart(userId)
- addToCart(userId, productId)
- removeFromCart(userId, productId)
- updateCartQuantity(userId, productId, quantity)
- clearCart(userId)

// Estadísticas
- getTotalSales()
- getSalesByPeriod(startDate, endDate)
- getTopProducts(limit)
- getTopCustomers(limit)
- getSalesByCategory()
```

---

## 🎯 FASE 7: MEJORAS Y OPTIMIZACIONES

### 7.1 Validaciones y Seguridad
**Prioridad: ALTA** | **Estimado: 1 hora**

- ✅ Sanitizar inputs
- ✅ Prevenir XSS
- ✅ Validar tokens en cada página
- ✅ Timeout de sesión (30 min inactividad)
- ✅ Encriptar contraseñas (usar simple hash para demo)

---

### 7.2 UX/UI Improvements
**Prioridad: MEDIA** | **Estimado: 2 horas**

- ✅ Loading states (spinners)
- ✅ Toast notifications
- ✅ Confirmaciones antes de acciones destructivas
- ✅ Estados vacíos (empty states)
- ✅ Skeleton loaders
- ✅ Mensajes de error descriptivos

---

### 7.3 Responsive Design
**Prioridad: ALTA** | **Estimado: 2 horas**

- ✅ Sidebar colapsable en móvil
- ✅ Tablas scrollables horizontalmente
- ✅ Cards adaptativas
- ✅ Forms apilados en móvil
- ✅ Menú hamburguesa

---

### 7.4 Accesibilidad
**Prioridad: MEDIA** | **Estimado: 1 hora**

- ✅ Labels en todos los inputs
- ✅ ARIA attributes
- ✅ Navegación por teclado
- ✅ Contraste de colores adecuado
- ✅ Focus states visibles

---

## 📊 CRONOGRAMA ESTIMADO

### Semana 1: Autenticación y Estructura
- Día 1-2: Login system + Auth guard
- Día 3: Restructuración de carpetas
- Día 4: Actualizar navegación
- Día 5: Testing fase 1

### Semana 2: Panel del Comprador
- Día 1: Dashboard buyer
- Día 2: Mis compras
- Día 3: Mi cuenta
- Día 4: Actualizar carrito
- Día 5: Testing fase 2

### Semana 3: Panel del Administrador
- Día 1: Dashboard admin
- Día 2-3: Gestión de productos (CRUD completo)
- Día 4: Gestión de ventas
- Día 5: Testing fase 3

### Semana 4: Componentes y Optimización
- Día 1: Componentes compartidos
- Día 2: Data manager
- Día 3: Validaciones y seguridad
- Día 4: UX/UI improvements
- Día 5: Testing final y ajustes

---

## 🎨 PALETA DE COLORES SUGERIDA

### Roles:
```css
/* Comprador (Buyer) */
--buyer-primary: #9333ea;  /* Purple */
--buyer-secondary: #ec4899; /* Pink */

/* Administrador (Admin) */
--admin-primary: #3b82f6;  /* Blue */
--admin-secondary: #06b6d4; /* Cyan */

/* Estados */
--success: #10b981;  /* Green */
--warning: #f59e0b;  /* Orange */
--error: #ef4444;    /* Red */
--info: #3b82f6;     /* Blue */
```

---

## 📦 DEPENDENCIAS NECESARIAS

### Opcional (para mejorar funcionalidades):
- **Chart.js**: Para gráficos en dashboard
  ```html
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  ```

- **DayJS**: Para manejo de fechas
  ```html
  <script src="https://cdn.jsdelivr.net/npm/dayjs@1.11.9/dayjs.min.js"></script>
  ```

- **SortableJS**: Para ordenar tablas
  ```html
  <script src="https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js"></script>
  ```

---

## 🧪 TESTING CHECKLIST

### Autenticación:
- [ ] Login con credenciales correctas
- [ ] Login con credenciales incorrectas
- [ ] Redirección según rol
- [ ] Persistencia de sesión
- [ ] Logout correcto
- [ ] Timeout de sesión

### Panel Comprador:
- [ ] Ver dashboard
- [ ] Ver historial de compras
- [ ] Editar perfil
- [ ] Cambiar contraseña
- [ ] Agregar productos al carrito
- [ ] Completar compra

### Panel Admin:
- [ ] Ver dashboard con métricas
- [ ] Crear producto
- [ ] Editar producto
- [ ] Eliminar producto
- [ ] Ver listado de ventas
- [ ] Filtrar ventas por fecha
- [ ] Ver detalle de orden

### Seguridad:
- [ ] No acceder a panel admin sin rol
- [ ] No acceder a panel buyer sin login
- [ ] Token válido en todas las páginas
- [ ] Logout limpia sesión completamente

---

## 🚀 ORDEN DE IMPLEMENTACIÓN RECOMENDADO

### Prioridad 1 (CRÍTICO):
1. Sistema de Login
2. Auth Guard
3. Restructurar carpetas
4. Dashboard Admin
5. Gestión de Productos (CRUD)

### Prioridad 2 (IMPORTANTE):
6. Dashboard Buyer
7. Mis Compras
8. Gestión de Ventas
9. Mi Cuenta
10. Data Manager

### Prioridad 3 (DESEABLE):
11. Componentes compartidos
12. Gestión de Usuarios
13. Mejoras UI/UX
14. Gráficos y estadísticas avanzadas

---

## 💡 CONSEJOS DE IMPLEMENTACIÓN

### 1. LocalStorage Structure:
```javascript
localStorage = {
    'users': JSON.stringify([...]),
    'products': JSON.stringify([...]),
    'orders': JSON.stringify([...]),
    'cart': JSON.stringify({userId: [...]}),
    'session': JSON.stringify({...}),
    'settings': JSON.stringify({...})
}
```

### 2. Inicialización:
Crear un archivo `scripts/init-data.js` que cargue datos iniciales si no existen.

### 3. Separación de Responsabilidades:
- `auth.js`: Solo autenticación
- `data-manager.js`: Solo gestión de datos
- `ui.js`: Solo manipulación de UI
- `utils.js`: Funciones auxiliares

### 4. Nomenclatura Consistente:
```javascript
// Páginas
- dashboard.html
- mi-cuenta.html
- productos.html

// JavaScript
- camelCase para funciones: getUserById()
- PascalCase para clases: DataManager
- UPPER_CASE para constantes: MAX_LOGIN_ATTEMPTS

// CSS
- kebab-case: .sidebar-menu, .btn-primary
```

---

## 📈 MÉTRICAS DE ÉXITO

- ✅ 100% de páginas protegidas con auth guard
- ✅ CRUD completo de productos funcionando
- ✅ Historial de compras persistente
- ✅ Dashboard con métricas en tiempo real
- ✅ Responsive en 3 tamaños de pantalla
- ✅ 0 errores en consola
- ✅ Validaciones en todos los formularios
- ✅ Experiencia fluida entre roles

---

## 🎓 SIGUIENTES PASOS SUGERIDOS

### Después de completar esta fase:
1. **Backend Real**: Migrar de LocalStorage a API REST
2. **Base de Datos**: PostgreSQL o MongoDB
3. **Autenticación Real**: JWT con refresh tokens
4. **Pagos**: Integrar Stripe o MercadoPago
5. **Email**: Envío de confirmaciones de compra
6. **CDN**: Subir imágenes reales
7. **Analytics**: Google Analytics o Mixpanel
8. **PWA**: Convertir en Progressive Web App
9. **Testing**: Jest + Cypress para tests automatizados
10. **Deploy**: Vercel, Netlify o Railway

---

## 📝 NOTAS FINALES

- Esta hoja de ruta es **modular**, puedes implementar las fases en orden o adaptar según necesidad
- Los **tiempos son estimados**, pueden variar según experiencia
- Prioriza **funcionalidad sobre estética** en primera iteración
- **Testea frecuentemente** para evitar bugs acumulados
- **Documenta** funciones complejas con comentarios
- Usa **Git** para control de versiones (commits frecuentes)

---

**Última actualización**: 6 de noviembre de 2025
**Versión**: 1.0
**Autor**: Sistema de Desarrollo ShikenShop
