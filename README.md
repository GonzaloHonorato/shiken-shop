# ShikenShop - Tienda de Videojuegos 🎮

## Descripción del Proyecto

ShikenShop es una tienda de videojuegos moderna y atractiva desarrollada como proyecto académico. La tienda ofrece una experiencia de navegación fluida y visualmente atractiva para explorar diferentes categorías de videojuegos.

## Estructura del Proyecto

```
codebase/
├── index.html                 # Página principal
├── styles/
│   └── index.css             # Estilos globales con variables CSS y animaciones
├── scripts/
│   └── index.js              # JavaScript para interactividad global
├── assets/
│   └── images/               # Directorio para imágenes
└── pages/
    ├── accion/
    │   ├── accion.html       # Página de juegos de acción
    │   ├── accion.css        # Estilos específicos de acción
    │   └── accion.js         # JavaScript específico de acción
    ├── rpg/
    │   ├── rpg.html          # Página de juegos RPG
    │   ├── rpg.css           # Estilos específicos de RPG
    │   └── rpg.js            # JavaScript específico de RPG
    ├── estrategia/
    │   ├── estrategia.html   # Página de juegos de estrategia
    │   ├── estrategia.css    # Estilos específicos de estrategia
    │   └── estrategia.js     # JavaScript específico de estrategia
    └── aventura/
        ├── aventura.html     # Página de juegos de aventura
        ├── aventura.css      # Estilos específicos de aventura
        └── aventura.js       # JavaScript específico de aventura
```

## Características Principales

### 1. Página Principal (index.html)
- **Nombre de la PYME**: ShikenShop
- **Hero Section**: Banner llamativo con gradientes y animaciones
- **Grid de Categorías**: 4 categorías con iconos SVG, hipervínculos y efectos hover
- **Features Section**: Destacados de la tienda (mejores precios, entrega rápida, compra segura)
- **Footer**: Información de contacto y redes sociales

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


