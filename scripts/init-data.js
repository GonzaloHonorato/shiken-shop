// ===================================
// INIT DATA - ShikenShop
// Inicialización de datos hardcoded en LocalStorage
// ===================================

const INIT_CONFIG = {
    FORCE_RESET: false, // Cambiar a true para resetear datos
    VERSION: '1.0.0'
};

// ===================================
// DEFAULT USERS
// ===================================
const DEFAULT_USERS = [
    {
        name: 'Administrador Principal',
        email: 'admin@shikenshop.com',
        password: 'Admin123', // En producción debe estar hasheada
        role: 'admin',
        active: true,
        registeredAt: new Date('2024-01-01').toISOString()
    },
    {
        name: 'Juan Pérez',
        email: 'comprador@test.com',
        password: 'Comprador123',
        role: 'buyer',
        active: true,
        registeredAt: new Date('2024-06-15').toISOString()
    },
    {
        name: 'María Gómez',
        email: 'maria.gomez@test.com',
        password: 'Maria123',
        role: 'buyer',
        active: true,
        registeredAt: new Date('2024-09-10').toISOString()
    },
    {
        name: 'Carlos Rodríguez',
        email: 'carlos.rodriguez@test.com',
        password: 'Carlos123',
        role: 'buyer',
        active: true,
        registeredAt: new Date('2024-08-20').toISOString()
    },
    {
        name: 'Ana Silva',
        email: 'ana.silva@test.com',
        password: 'Ana123',
        role: 'buyer',
        active: true,
        registeredAt: new Date('2024-10-05').toISOString()
    }
];

// ===================================
// DEFAULT PRODUCTS
// ===================================
const DEFAULT_PRODUCTS = [
    // ACCIÓN
    {
        id: 'accion-1',
        name: 'Cyberpunk Fury',
        description: 'Explora una metrópolis futurista llena de peligros y secretos oscuros en este RPG de acción cyberpunk.',
        category: 'accion',
        price: 44990,
        originalPrice: 59990,
        discount: 25,
        stock: 150,
        image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400',
        active: true,
        featured: true,
        rating: 4.8,
        reviews: 1250,
        releaseDate: '2024-03-15',
        developer: 'CyberGames Studio',
        platform: ['PC', 'PS5', 'Xbox Series X'],
        tags: ['Cyberpunk', 'Open World', 'RPG'],
        createdAt: new Date('2024-03-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'accion-2',
        name: 'Warzone Elite',
        description: 'Únete al campo de batalla en este shooter táctico multijugador con gráficos ultra realistas.',
        category: 'accion',
        price: 39990,
        originalPrice: 39990,
        discount: 0,
        stock: 200,
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400',
        active: true,
        featured: false,
        rating: 4.5,
        reviews: 890,
        releaseDate: '2024-05-20',
        developer: 'TacticalForce',
        platform: ['PC', 'PS5', 'Xbox Series X'],
        tags: ['FPS', 'Multiplayer', 'Tactical'],
        createdAt: new Date('2024-05-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'accion-3',
        name: 'Street Fighter Revolution',
        description: 'La próxima evolución de la legendaria saga de lucha con nuevos personajes y mecánicas.',
        category: 'accion',
        price: 50990,
        originalPrice: 59990,
        discount: 15,
        stock: 100,
        image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400',
        active: true,
        featured: true,
        rating: 4.9,
        reviews: 2100,
        releaseDate: '2024-02-10',
        developer: 'Capcom',
        platform: ['PC', 'PS5', 'Xbox Series X', 'Switch'],
        tags: ['Fighting', 'Competitive', '2D'],
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    // RPG
    {
        id: 'rpg-1',
        name: 'Dragon\'s Quest Legends',
        description: 'Embárcate en una épica aventura medieval donde tus decisiones moldean el destino del reino.',
        category: 'rpg',
        price: 54990,
        originalPrice: 54990,
        discount: 0,
        stock: 120,
        image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400',
        active: true,
        featured: true,
        rating: 4.7,
        reviews: 1580,
        releaseDate: '2024-04-05',
        developer: 'FantasyWorks',
        platform: ['PC', 'PS5', 'Xbox Series X'],
        tags: ['Medieval', 'Open World', 'Story-Rich'],
        createdAt: new Date('2024-04-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'rpg-2',
        name: 'Mystic Chronicles',
        description: 'Un RPG de mundo abierto con un sistema de magia único y combates por turnos estratégicos.',
        category: 'rpg',
        price: 41990,
        originalPrice: 49990,
        discount: 16,
        stock: 90,
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400',
        active: true,
        featured: false,
        rating: 4.6,
        reviews: 920,
        releaseDate: '2024-06-18',
        developer: 'MysticGames',
        platform: ['PC', 'Switch'],
        tags: ['Magic', 'Turn-Based', 'Fantasy'],
        createdAt: new Date('2024-06-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'rpg-3',
        name: 'Kingdom Hearts Destiny',
        description: 'La culminación de la saga que combina mundos Disney con acción RPG espectacular.',
        category: 'rpg',
        price: 39990,
        originalPrice: 59990,
        discount: 33,
        stock: 80,
        image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400',
        active: true,
        featured: true,
        rating: 4.9,
        reviews: 3200,
        releaseDate: '2024-01-25',
        developer: 'Square Enix',
        platform: ['PS5', 'Xbox Series X'],
        tags: ['Action RPG', 'Adventure', 'Disney'],
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    // ESTRATEGIA
    {
        id: 'estrategia-1',
        name: 'Civilization Empire',
        description: 'Construye un imperio desde cero y guíalo a través de los siglos hacia la dominación mundial.',
        category: 'estrategia',
        price: 47990,
        originalPrice: 59990,
        discount: 20,
        stock: 110,
        image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400',
        active: true,
        featured: true,
        rating: 4.8,
        reviews: 1840,
        releaseDate: '2024-03-30',
        developer: '2K Games',
        platform: ['PC', 'Mac'],
        tags: ['4X', 'Turn-Based', 'Historical'],
        createdAt: new Date('2024-03-15').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'estrategia-2',
        name: 'StarCraft: Galaxy Wars',
        description: 'Estrategia en tiempo real espacial con tres razas únicas y batallas épicas multijugador.',
        category: 'estrategia',
        price: 44990,
        originalPrice: 44990,
        discount: 0,
        stock: 140,
        image: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400',
        active: true,
        featured: false,
        rating: 4.7,
        reviews: 2600,
        releaseDate: '2024-02-14',
        developer: 'Blizzard',
        platform: ['PC'],
        tags: ['RTS', 'Sci-Fi', 'Competitive'],
        createdAt: new Date('2024-02-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'estrategia-3',
        name: 'Total War: Kingdoms',
        description: 'Combina estrategia por turnos con batallas tácticas en tiempo real en la edad media.',
        category: 'estrategia',
        price: 38990,
        originalPrice: 54990,
        discount: 29,
        stock: 95,
        image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400',
        active: true,
        featured: true,
        rating: 4.6,
        reviews: 1420,
        releaseDate: '2024-05-08',
        developer: 'Creative Assembly',
        platform: ['PC'],
        tags: ['Strategy', 'Medieval', 'Tactical'],
        createdAt: new Date('2024-05-01').toISOString(),
        updatedAt: new Date().toISOString()
    },
    // AVENTURA
    {
        id: 'aventura-1',
        name: 'The Last Explorer',
        description: 'Explora ruinas antiguas y descubre civilizaciones perdidas en este juego de aventura narrativa.',
        category: 'aventura',
        price: 52990,
        originalPrice: 52990,
        discount: 0,
        stock: 105,
        image: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?w=400',
        active: true,
        featured: true,
        rating: 4.8,
        reviews: 1670,
        releaseDate: '2024-04-22',
        developer: 'ExploreGames',
        platform: ['PC', 'PS5', 'Xbox Series X'],
        tags: ['Adventure', 'Puzzle', 'Story-Rich'],
        createdAt: new Date('2024-04-15').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'aventura-2',
        name: 'Uncharted Odyssey',
        description: 'Acción y aventura en una búsqueda del tesoro alrededor del mundo con gráficos impresionantes.',
        category: 'aventura',
        price: 45990,
        originalPrice: 64990,
        discount: 29,
        stock: 85,
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400',
        active: true,
        featured: true,
        rating: 4.9,
        reviews: 2890,
        releaseDate: '2024-01-30',
        developer: 'Naughty Dog',
        platform: ['PS5'],
        tags: ['Action-Adventure', 'Cinematic', 'Exploration'],
        createdAt: new Date('2024-01-15').toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 'aventura-3',
        name: 'Tomb Seeker',
        description: 'Resuelve puzzles antiguos y supera trampas mortales en templos olvidados.',
        category: 'aventura',
        price: 42990,
        originalPrice: 51990,
        discount: 17,
        stock: 130,
        image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400',
        active: true,
        featured: false,
        rating: 4.5,
        reviews: 1120,
        releaseDate: '2024-07-12',
        developer: 'Crystal Dynamics',
        platform: ['PC', 'PS5', 'Xbox Series X'],
        tags: ['Puzzle', 'Platformer', 'Adventure'],
        createdAt: new Date('2024-07-01').toISOString(),
        updatedAt: new Date().toISOString()
    }
];

// ===================================
// DEFAULT ORDERS (Órdenes de ejemplo)
// ===================================
const DEFAULT_ORDERS = [
    {
        id: 'order_1730800200000',
        userId: 'comprador@test.com',
        date: new Date('2024-10-15T14:30:00').toISOString(),
        items: [
            {
                id: 'accion-1',
                name: 'Cyberpunk Fury',
                price: 44.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400'
            },
            {
                id: 'rpg-3',
                name: 'Kingdom Hearts Destiny',
                price: 39.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=400'
            }
        ],
        total: 84.98,
        status: 'completed'
    },
    {
        id: 'order_1731991200000',
        userId: 'maria.gomez@test.com',
        date: new Date('2024-10-28T10:15:00').toISOString(),
        items: [
            {
                id: 'estrategia-1',
                name: 'Civilization Empire',
                price: 47.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400'
            }
        ],
        total: 47.99,
        status: 'completed'
    },
    {
        id: 'order_1732392000000',
        userId: 'comprador@test.com',
        date: new Date('2024-11-02T16:45:00').toISOString(),
        items: [
            {
                id: 'aventura-2',
                name: 'Uncharted Odyssey',
                price: 45.99,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=400'
            }
        ],
        total: 91.98,
        status: 'completed'
    },
    {
        id: 'order_1732810800000',
        userId: 'comprador@test.com',
        date: new Date('2024-11-05T09:20:00').toISOString(),
        items: [
            {
                id: 'accion-2',
                name: 'Battlefield Revolution',
                price: 39.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=400'
            }
        ],
        total: 39.99,
        status: 'pending'
    },
    {
        id: 'order_1732897200000',
        userId: 'maria.gomez@test.com',
        date: new Date('2024-11-06T12:00:00').toISOString(),
        items: [
            {
                id: 'rpg-1',
                name: 'Dragon Quest Legends',
                price: 52.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400'
            },
            {
                id: 'aventura-1',
                name: 'The Last Explorer',
                price: 41.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400'
            }
        ],
        total: 94.98,
        status: 'pending'
    },
    {
        id: 'order_1731204000000',
        userId: 'carlos.rodriguez@test.com',
        date: new Date('2024-10-20T15:30:00').toISOString(),
        items: [
            {
                id: 'estrategia-2',
                name: 'Total War Commander',
                price: 44.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1560253023-3ec5d502959f?w=400'
            }
        ],
        total: 44.99,
        status: 'completed'
    },
    {
        id: 'order_1731636000000',
        userId: 'ana.silva@test.com',
        date: new Date('2024-10-25T11:00:00').toISOString(),
        items: [
            {
                id: 'rpg-2',
                name: 'Final Fantasy Rebirth',
                price: 49.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400'
            },
            {
                id: 'aventura-3',
                name: 'Tomb Raider Infinity',
                price: 39.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400'
            }
        ],
        total: 89.98,
        status: 'completed'
    },
    {
        id: 'order_1732500000000',
        userId: 'carlos.rodriguez@test.com',
        date: new Date('2024-11-03T14:20:00').toISOString(),
        items: [
            {
                id: 'accion-3',
                name: 'Call of Honor',
                price: 42.99,
                quantity: 2,
                image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400'
            }
        ],
        total: 85.98,
        status: 'pending'
    },
    {
        id: 'order_1732156800000',
        userId: 'ana.silva@test.com',
        date: new Date('2024-10-30T16:45:00').toISOString(),
        items: [
            {
                id: 'estrategia-3',
                name: 'Age of Empires Legends',
                price: 46.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1560419015-7c427e8ae5ba?w=400'
            }
        ],
        total: 46.99,
        status: 'completed'
    },
    {
        id: 'order_1731420000000',
        userId: 'comprador@test.com',
        date: new Date('2024-10-22T13:15:00').toISOString(),
        items: [
            {
                id: 'aventura-4',
                name: 'Zelda: Tears of Adventure',
                price: 54.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1526509867162-5b0c0d1b5ec8?w=400'
            }
        ],
        total: 54.99,
        status: 'cancelled'
    }
];

// ===================================
// INITIALIZE DATA
// ===================================
function initializeData() {
    console.log('🚀 Inicializando datos de ShikenShop...');
    
    const dataVersion = localStorage.getItem('dataVersion');
    
    // Si no existe versión o se fuerza reset
    if (!dataVersion || INIT_CONFIG.FORCE_RESET) {
        console.log('📦 Creando datos iniciales...');
        
        // Usuarios
        if (!localStorage.getItem('users') || INIT_CONFIG.FORCE_RESET) {
            localStorage.setItem('users', JSON.stringify(DEFAULT_USERS));
            console.log(`✅ ${DEFAULT_USERS.length} usuarios creados`);
        }
        
        // Productos
        if (!localStorage.getItem('products') || INIT_CONFIG.FORCE_RESET) {
            localStorage.setItem('products', JSON.stringify(DEFAULT_PRODUCTS));
            console.log(`✅ ${DEFAULT_PRODUCTS.length} productos creados`);
        }
        
        // Órdenes
        if (!localStorage.getItem('orders') || INIT_CONFIG.FORCE_RESET) {
            localStorage.setItem('orders', JSON.stringify(DEFAULT_ORDERS));
            console.log(`✅ ${DEFAULT_ORDERS.length} órdenes de ejemplo creadas`);
        }
        
        // Carrito (vacío inicialmente)
        if (!localStorage.getItem('cart')) {
            localStorage.setItem('cart', JSON.stringify([]));
            console.log('✅ Carrito inicializado');
        }
        
        // Guardar versión
        localStorage.setItem('dataVersion', INIT_CONFIG.VERSION);
        
        console.log('✨ Datos inicializados correctamente');
    } else {
        console.log('ℹ️ Datos ya inicializados (versión ' + dataVersion + ')');
    }
    
    // Mostrar estadísticas
    displayStats();
}

// ===================================
// DISPLAY STATISTICS
// ===================================
function displayStats() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    console.log('\n📊 ESTADÍSTICAS DE DATOS:');
    console.log('👥 Usuarios:', users.length);
    console.log('📦 Productos:', products.length);
    console.log('🛒 Órdenes:', orders.length);
    console.log('🛍️ Items en carrito:', cart.length);
    console.log('\n🔐 CUENTAS DE PRUEBA:');
    console.log('Admin: admin@shikenshop.com / Admin123');
    console.log('Comprador: comprador@test.com / Comprador123');
    console.log('Comprador 2: maria.gomez@test.com / Maria123\n');
}

// ===================================
// RESET DATA (función de utilidad)
// ===================================
function resetAllData() {
    const confirm = window.confirm('⚠️ ¿Estás seguro de que quieres resetear TODOS los datos?\nEsto incluye usuarios, productos, órdenes y carrito.');
    
    if (confirm) {
        localStorage.removeItem('users');
        localStorage.removeItem('products');
        localStorage.removeItem('orders');
        localStorage.removeItem('cart');
        localStorage.removeItem('session');
        localStorage.removeItem('dataVersion');
        
        console.log('🗑️ Todos los datos han sido eliminados');
        console.log('🔄 Recargando página...');
        
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}

// ===================================
// AUTO-INITIALIZE
// ===================================
if (typeof window !== 'undefined') {
    // Inicializar al cargar el DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeData);
    } else {
        initializeData();
    }
    
    // Exponer función de reset en consola para debugging
    window.resetAllData = resetAllData;
    window.initializeData = initializeData;
}

// ===================================
// EXPORT
// ===================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeData,
        resetAllData,
        DEFAULT_USERS,
        DEFAULT_PRODUCTS,
        DEFAULT_ORDERS
    };
}
