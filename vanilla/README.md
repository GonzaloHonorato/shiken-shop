# ShikenShop - Tienda de Videojuegos 🎮

## Descripción del Proyecto

ShikenShop es una tienda de videojuegos moderna y avanzada desarrollada como proyecto académico. La tienda ofrece una experiencia completa con sistema de autenticación, gestión de usuarios, carritos de compra y paneles de administración.

## 🚀 Características Principales

### ✅ Sistema de Autenticación
- **Login con validación**: Email y contraseña con validación en tiempo real
- **Registro de usuarios**: Con asignación automática de rol "comprador"
- **Recuperación de contraseña**: Sistema de códigos de verificación de 6 dígitos
- **Protección de rutas**: Middleware `auth-guard.js` para páginas protegidas
- **Gestión de sesiones**: Control de sesiones con localStorage (30 minutos de inactividad)
- **Protección contra fuerza bruta**: Máximo 5 intentos, bloqueo de 15 minutos

### 👤 Sistema de Roles
- **Administrador**: Acceso a panel de gestión de productos y ventas
- **Comprador**: Acceso a historial de compras y gestión de cuenta

### 📝 Gestión de Cuenta
- **Mi Cuenta**: Edición de perfil (nombre, email, usuario, teléfono, dirección)
- **Cambio de contraseña**: Con validación de contraseña actual
- **Avatar dinámico**: Generado automáticamente con iniciales
- **Validación en tiempo real**: Feedback inmediato en formularios

### 🔐 Cuentas Hardcodeadas
```javascript
// Administrador
Email: admin@shikenshop.com
Contraseña: Admin123

// Compradores
Email: comprador@test.com
Contraseña: Comprador123

Email: maria.gomez@test.com
Contraseña: Maria123
```

## Estructura del Proyecto

```
codebase/
├── index.html                 # Página principal con menú dinámico
├── HOJA_DE_RUTA.md           # Roadmap completo del proyecto (7 fases)
├── README.md                 # Este archivo
├── styles/
│   └── index.css             # Estilos globales
├── scripts/
│   ├── index.js              # JavaScript principal + auth UI
│   ├── auth-guard.js         # Middleware de autenticación
│   └── init-data.js          # Inicialización de datos hardcodeados
├── assets/
│   └── images/               # Directorio para imágenes
└── pages/
    ├── auth/                 # Sistema de autenticación
    │   ├── login.html        # Página de inicio de sesión
    │   ├── login.css         # Estilos del login
    │   ├── login.js          # Lógica de autenticación
    │   ├── forgot-password.html  # Recuperación de contraseña
    │   └── forgot-password.js    # Lógica de recuperación
    ├── mi-cuenta/            # Gestión de cuenta
    │   ├── mi-cuenta.html    # Página de perfil
    │   ├── mi-cuenta.css     # Estilos del perfil
    │   └── mi-cuenta.js      # Lógica de edición de perfil
    ├── registro/
    │   ├── registro.html     # Página de registro
    │   ├── registro.css      # Estilos del registro
    │   └── registro.js       # Lógica de registro (asigna rol buyer)
    ├── carrito/
    │   ├── carrito.html      # Carrito de compras
    │   ├── carrito.css       # Estilos del carrito
    │   └── carrito.js        # Lógica del carrito
    ├── accion/               # Categoría: Juegos de Acción
    │   ├── accion.html
    │   ├── accion.css
    │   └── accion.js
    ├── rpg/                  # Categoría: Juegos RPG
    │   ├── rpg.html
    │   ├── rpg.css
    │   └── rpg.js
    ├── estrategia/           # Categoría: Juegos de Estrategia
    │   ├── estrategia.html
    │   ├── estrategia.css
    │   └── estrategia.js
    └── aventura/             # Categoría: Juegos de Aventura
        ├── aventura.html
        ├── aventura.css
        └── aventura.js
```

### 2. Categorías Implementadas

#### 🔥 Acción
- Cyberpunk Fury (25% descuento)
- Warzone Elite
- Street Fighter Revolution (15% descuento)

#### 🐉 RPG
- Dragon's Legacy (30% descuento)
- Mystic Chronicles
- Kingdom Reborn (20% descuento)

#### 🧠 Estrategia
- Empire Builder (40% descuento)
- Tactical Command
- City Architect (25% descuento)

#### 🌍 Aventura
- Lost Horizons (35% descuento)
- Ocean Odyssey
- Jungle Expedition (20% descuento)

### 3. Características de cada Categoría
Cada página de categoría incluye:
- Imagen/Icono representativo del juego
- Nombre del juego
- Descripción breve
- Precio de venta
- Indicador de descuento (si aplica)
- Botón de compra interactivo
- Navegación entre categorías
- Hipervínculos para volver al inicio

## Elementos CSS Avanzados

### Variables CSS
```css
:root {
    --primary-color: #8b5cf6;
    --secondary-color: #ec4899;
    --dark-bg: #111827;
    --card-bg: #1f2937;
    --text-light: #f3f4f6;
    --text-gray: #9ca3af;
    --accent-purple: #a78bfa;
    --accent-pink: #f472b6;
    --transition-speed: 0.3s;
    --hover-scale: 1.05;
    --shadow-color: rgba(139, 92, 246, 0.3);
}
```

### Animaciones CSS Implementadas (8+ animaciones)

1. **logoPulse**: Animación pulsante para el logo
2. **slideUp**: Deslizamiento hacia arriba del título hero
3. **fadeIn**: Aparición gradual de elementos
4. **pulse**: Efecto de pulso en botones y badges
5. **slideInLeft**: Deslizamiento desde la izquierda
6. **glow**: Efecto de brillo en tarjetas
7. **float**: Animación flotante para iconos
8. **shimmer**: Efecto de brillo en gradientes
9. **bounce**: Rebote de iconos
10. **rotate**: Rotación continua
11. **swing**: Balanceo pendular

### Media Queries Responsive

#### Desktop (>1024px)
- Layout completo con grid de 4 columnas para categorías
- Animaciones completas
- Efectos 3D en hover

#### Tablet (768px - 1024px)
- Grid de 2 columnas
- Tamaño de fuente ajustado
- Animaciones optimizadas

#### Móvil (480px - 768px)
- Grid de 1 columna
- Navegación adaptativa
- Animaciones simplificadas
- Escala de hover reducida

#### Móvil pequeño (<480px)
- Layout optimizado para pantallas pequeñas
- Iconos reducidos
- Algunas animaciones desactivadas para mejor rendimiento

#### Reducción de movimiento
```css
@media (prefers-reduced-motion: reduce) {
    /* Animaciones mínimas para accesibilidad */
}
```

## Interactividad JavaScript

### Funcionalidades Implementadas

1. **Menú Móvil**: Toggle para navegación responsive
2. **Smooth Scroll**: Desplazamiento suave con offset para header fijo
3. **Intersection Observer**: Animación de aparición de elementos al hacer scroll
4. **Efecto Parallax**: En la sección hero
5. **Hover 3D**: Efecto de inclinación 3D en tarjetas con el mouse
6. **Botón Scroll to Top**: Aparece al hacer scroll hacia abajo
7. **Animaciones de Entrada**: Para tarjetas de juegos y categorías
8. **Efecto Ripple**: En botones de compra
9. **Feedback Visual**: Cambio de estado al agregar al carrito

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Variables, animaciones, flexbox, grid
- **Tailwind CSS**: Framework de utilidades CSS (CDN)
- **JavaScript Vanilla**: Sin dependencias externas
- **SVG**: Iconos vectoriales

## Cómo Usar el Proyecto

1. **Abrir el proyecto**: Simplemente abre `index.html` en tu navegador
2. **Navegación**: Haz clic en las categorías para explorar los juegos
3. **Interacción**: Prueba los efectos hover y los botones de compra
4. **Responsive**: Cambia el tamaño de la ventana para ver el diseño adaptativo

## Paleta de Colores por Categoría

- **Acción**: Rojo/Naranja (#dc2626, #ea580c)
- **RPG**: Púrpura/Índigo (#8b5cf6, #6366f1)
- **Estrategia**: Azul/Cian (#2563eb, #06b6d4)
- **Aventura**: Verde/Teal (#059669, #0d9488)

## Características de Accesibilidad

- Scroll behavior suave
- Reducción de movimiento para usuarios sensibles
- Contraste adecuado de colores
- Estructura semántica HTML5
- Navegación con teclado

## Optimizaciones

- CSS organizado con variables reutilizables
- JavaScript modular por página
- Animaciones optimizadas para rendimiento
- Media queries para diferentes dispositivos
- Lazy loading de animaciones

## Créditos

**Proyecto desarrollado por**: Gonzalo Honorato
**Curso**: Desarrollo Web Fullstack 2
**Institución**: DuocUC
**Fecha**: Octubre 2024

---

## Notas de Desarrollo

Este proyecto sigue una arquitectura inspirada en componentes donde cada página/componente tiene sus propios archivos HTML, CSS y JavaScript al mismo nivel, facilitando el mantenimiento y la escalabilidad del código.


