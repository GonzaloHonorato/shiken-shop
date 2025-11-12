import { Injectable, signal, computed, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { 
  User, 
  Product, 
  Order, 
  CartItem, 
  ProductCategory, 
  ProductCategoryEnum,
  Category,
  ProductFilter,
  ProductSearchParams,
  StorageKeys,
  UserRole 
} from '../models';

// ===================================
// DATA SERVICE CONFIGURATION
// ===================================
interface DataConfig {
  forceReset: boolean;
  version: string;
}

const DEFAULT_DATA_CONFIG: DataConfig = {
  forceReset: false,
  version: '1.0.0'
};

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private config: DataConfig = DEFAULT_DATA_CONFIG;

  // ===================================
  // REACTIVE STATE MANAGEMENT
  // ===================================
  
  // Signals para estado reactivo
  private usersSignal = signal<User[]>([]);
  private productsSignal = signal<Product[]>([]);
  private ordersSignal = signal<Order[]>([]);
  private cartSignal = signal<CartItem[]>([]);
  
  // Computed signals
  public readonly users = this.usersSignal.asReadonly();
  public readonly products = this.productsSignal.asReadonly();
  public readonly orders = this.ordersSignal.asReadonly();
  public readonly cart = this.cartSignal.asReadonly();
  
  // Computed properties
  public readonly featuredProducts = computed(() => 
    this.products().filter(p => p.featured && p.active)
  );
  
  public readonly activeProducts = computed(() => 
    this.products().filter(p => p.active)
  );
  
  public readonly categories = computed(() => this.getCategories());
  
  public readonly cartCount = computed(() => 
    this.cart().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  // BehaviorSubjects para compatibilidad con observables
  private usersSubject = new BehaviorSubject<User[]>([]);
  private productsSubject = new BehaviorSubject<Product[]>([]);
  private ordersSubject = new BehaviorSubject<Order[]>([]);
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  
  public readonly users$ = this.usersSubject.asObservable();
  public readonly products$ = this.productsSubject.asObservable();
  public readonly orders$ = this.ordersSubject.asObservable();
  public readonly cart$ = this.cartSubject.asObservable();

  constructor() {
    this.initializeData();
  }

  // ===================================
  // INITIALIZATION
  // ===================================
  
  public initializeData(): void {
    console.log('🚀 Inicializando datos de ShikenShop...');
    
    const dataVersion = localStorage.getItem('dataVersion');
    
    // Si no existe versión o se fuerza reset
    if (!dataVersion || this.config.forceReset) {
      console.log('📦 Creando datos iniciales...');
      
      this.initializeUsers();
      this.initializeProducts();
      this.initializeOrders();
      this.initializeCart();
      
      // Guardar versión
      localStorage.setItem('dataVersion', this.config.version);
      console.log('✨ Datos inicializados correctamente');
    } else {
      console.log('ℹ️ Datos ya inicializados (versión ' + dataVersion + ')');
    }
    
    // Cargar datos desde localStorage
    this.loadAllData();
    this.displayStats();
  }

  private initializeUsers(): void {
    if (!localStorage.getItem(StorageKeys.USERS) || this.config.forceReset) {
      const defaultUsers: User[] = [
        {
          name: 'Administrador Principal',
          email: 'admin@shikenshop.com',
          password: 'Admin123',
          role: UserRole.ADMIN,
          active: true,
          registeredAt: new Date('2024-01-01').toISOString()
        },
        {
          name: 'Juan Pérez',
          email: 'comprador@test.com',
          password: 'Comprador123',
          role: UserRole.BUYER,
          active: true,
          registeredAt: new Date('2024-06-15').toISOString()
        },
        {
          name: 'María Gómez',
          email: 'maria.gomez@test.com',
          password: 'Maria123',
          role: UserRole.BUYER,
          active: true,
          registeredAt: new Date('2024-09-10').toISOString()
        },
        {
          name: 'Carlos Rodríguez',
          email: 'carlos.rodriguez@test.com',
          password: 'Carlos123',
          role: UserRole.BUYER,
          active: true,
          registeredAt: new Date('2024-08-20').toISOString()
        },
        {
          name: 'Ana Silva',
          email: 'ana.silva@test.com',
          password: 'Ana123',
          role: UserRole.BUYER,
          active: true,
          registeredAt: new Date('2024-10-05').toISOString()
        }
      ];
      
      localStorage.setItem(StorageKeys.USERS, JSON.stringify(defaultUsers));
      console.log(`✅ ${defaultUsers.length} usuarios creados`);
    }
  }

  private initializeProducts(): void {
    if (!localStorage.getItem(StorageKeys.PRODUCTS) || this.config.forceReset) {
      const defaultProducts: Product[] = [
        // ACCIÓN
        {
          id: 'accion-1',
          name: 'Cyberpunk Fury',
          description: 'Explora una metrópolis futurista llena de peligros y secretos oscuros en este RPG de acción cyberpunk.',
          category: ProductCategoryEnum.ACCION,
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
          category: ProductCategoryEnum.ACCION,
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
          category: ProductCategoryEnum.ACCION,
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
          category: ProductCategoryEnum.RPG,
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
          category: ProductCategoryEnum.RPG,
          price: 48990,
          originalPrice: 64990,
          discount: 25,
          stock: 90,
          image: 'https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=400',
          active: true,
          featured: false,
          rating: 4.6,
          reviews: 1120,
          releaseDate: '2024-06-12',
          developer: 'MysticSoft',
          platform: ['PC', 'PS5'],
          tags: ['Turn-Based', 'Magic', 'Fantasy'],
          createdAt: new Date('2024-06-01').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'rpg-3',
          name: 'Skybound Odyssey',
          description: 'Vuela por los cielos en dirigibles y explora islas flotantes en este RPG de aventuras aéreas.',
          category: ProductCategoryEnum.RPG,
          price: 51990,
          originalPrice: 59990,
          discount: 13,
          stock: 75,
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          active: true,
          featured: true,
          rating: 4.8,
          reviews: 1890,
          releaseDate: '2024-03-28',
          developer: 'SkyForge Studios',
          platform: ['PC', 'PS5', 'Xbox Series X', 'Switch'],
          tags: ['Exploration', 'Flying', 'Adventure'],
          createdAt: new Date('2024-03-15').toISOString(),
          updatedAt: new Date().toISOString()
        },
        // ESTRATEGIA
        {
          id: 'estrategia-1',
          name: 'Civilization Empire',
          description: 'Construye tu imperio desde la edad de piedra hasta la era espacial en este juego de estrategia por turnos.',
          category: ProductCategoryEnum.ESTRATEGIA,
          price: 47990,
          originalPrice: 47990,
          discount: 0,
          stock: 110,
          image: 'https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=400',
          active: true,
          featured: true,
          rating: 4.7,
          reviews: 2450,
          releaseDate: '2024-02-14',
          developer: 'Firaxis Games',
          platform: ['PC'],
          tags: ['Turn-Based', 'Historical', 'Empire Building'],
          createdAt: new Date('2024-02-01').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'estrategia-2',
          name: 'StarCraft Genesis',
          description: 'Comanda flotas espaciales en batallas épicas de estrategia en tiempo real.',
          category: ProductCategoryEnum.ESTRATEGIA,
          price: 42990,
          originalPrice: 49990,
          discount: 14,
          stock: 95,
          image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400',
          active: true,
          featured: false,
          rating: 4.8,
          reviews: 1780,
          releaseDate: '2024-05-08',
          developer: 'Blizzard Entertainment',
          platform: ['PC'],
          tags: ['RTS', 'Sci-Fi', 'Multiplayer'],
          createdAt: new Date('2024-05-01').toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'estrategia-3',
          name: 'Total War Kingdoms',
          description: 'Conquista territorios y libra batallas masivas en este juego de estrategia medieval.',
          category: ProductCategoryEnum.ESTRATEGIA,
          price: 45990,
          originalPrice: 59990,
          discount: 23,
          stock: 80,
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
          active: true,
          featured: true,
          rating: 4.6,
          reviews: 1340,
          releaseDate: '2024-04-18',
          developer: 'Creative Assembly',
          platform: ['PC'],
          tags: ['Medieval', 'War', 'Tactical'],
          createdAt: new Date('2024-04-01').toISOString(),
          updatedAt: new Date().toISOString()
        },
        // AVENTURA
        {
          id: 'aventura-1',
          name: 'The Last Explorer',
          description: 'Explora ruinas antiguas y descubre civilizaciones perdidas en este juego de aventura narrativa.',
          category: ProductCategoryEnum.AVENTURA,
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
          category: ProductCategoryEnum.AVENTURA,
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
          category: ProductCategoryEnum.AVENTURA,
          price: 38990,
          originalPrice: 49990,
          discount: 22,
          stock: 125,
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
          active: true,
          featured: false,
          rating: 4.5,
          reviews: 980,
          releaseDate: '2024-07-10',
          developer: 'Crystal Dynamics',
          platform: ['PC', 'PS5', 'Xbox Series X'],
          tags: ['Puzzle', 'Exploration', 'Archaeology'],
          createdAt: new Date('2024-07-01').toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      localStorage.setItem(StorageKeys.PRODUCTS, JSON.stringify(defaultProducts));
      console.log(`✅ ${defaultProducts.length} productos creados`);
    }
  }

  private initializeOrders(): void {
    if (!localStorage.getItem(StorageKeys.ORDERS) || this.config.forceReset) {
      const defaultOrders: Order[] = [];
      localStorage.setItem(StorageKeys.ORDERS, JSON.stringify(defaultOrders));
      console.log(`✅ Órdenes inicializadas`);
    }
  }

  private initializeCart(): void {
    if (!localStorage.getItem(StorageKeys.CART)) {
      localStorage.setItem(StorageKeys.CART, JSON.stringify([]));
      console.log('✅ Carrito inicializado');
    }
  }

  private loadAllData(): void {
    this.loadUsers();
    this.loadProducts();
    this.loadOrders();
    this.loadCart();
  }

  private loadUsers(): void {
    const users = JSON.parse(localStorage.getItem(StorageKeys.USERS) || '[]');
    this.usersSignal.set(users);
    this.usersSubject.next(users);
  }

  private loadProducts(): void {
    const products = JSON.parse(localStorage.getItem(StorageKeys.PRODUCTS) || '[]');
    this.productsSignal.set(products);
    this.productsSubject.next(products);
  }

  private loadOrders(): void {
    const orders = JSON.parse(localStorage.getItem(StorageKeys.ORDERS) || '[]');
    this.ordersSignal.set(orders);
    this.ordersSubject.next(orders);
  }

  private loadCart(): void {
    const cart = JSON.parse(localStorage.getItem(StorageKeys.CART) || '[]');
    this.cartSignal.set(cart);
    this.cartSubject.next(cart);
  }

  // ===================================
  // CATEGORIES DATA
  // ===================================
  
  private getCategories(): Category[] {
    return [
      {
        id: ProductCategoryEnum.ACCION,
        name: 'Acción',
        description: 'Vive la adrenalina de los juegos más intensos',
        color: 'from-red-600 to-orange-500',
        icon: 'M13 10V3L4 14h7v7l9-11h-7z',
        gradient: 'bg-gradient-to-br from-red-600 to-orange-500'
      },
      {
        id: ProductCategoryEnum.RPG,
        name: 'RPG',
        description: 'Aventuras épicas y mundos por descubrir',
        color: 'from-purple-600 to-indigo-700',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        gradient: 'bg-gradient-to-br from-purple-600 to-indigo-700'
      },
      {
        id: ProductCategoryEnum.ESTRATEGIA,
        name: 'Estrategia',
        description: 'Pon a prueba tu ingenio y planificación',
        color: 'from-blue-600 to-cyan-500',
        icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
        gradient: 'bg-gradient-to-br from-blue-600 to-cyan-500'
      },
      {
        id: ProductCategoryEnum.AVENTURA,
        name: 'Aventura',
        description: 'Explora mundos fascinantes y misteriosos',
        color: 'from-green-600 to-teal-500',
        icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        gradient: 'bg-gradient-to-br from-green-600 to-teal-500'
      }
    ];
  }

  // ===================================
  // PUBLIC DATA ACCESS METHODS
  // ===================================

  public getProductsByCategory(category: ProductCategory): Product[] {
    return this.products().filter(p => p.category === category && p.active);
  }

  public getProductById(id: string): Product | undefined {
    return this.products().find(p => p.id === id);
  }

  public searchProducts(params: ProductSearchParams): Product[] {
    let filteredProducts = this.activeProducts();

    // Filtrar por categoría
    if (params.category) {
      filteredProducts = filteredProducts.filter(p => p.category === params.category);
    }

    // Filtrar por query de búsqueda
    if (params.query) {
      const query = params.query.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.developer.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Ordenar resultados
    if (params.sortBy) {
      filteredProducts = this.sortProducts(filteredProducts, params.sortBy, params.sortOrder || 'asc');
    }

    // Aplicar paginación
    if (params.limit) {
      const offset = params.offset || 0;
      filteredProducts = filteredProducts.slice(offset, offset + params.limit);
    }

    return filteredProducts;
  }

  public filterProducts(filter: ProductFilter): Product[] {
    let filteredProducts = this.activeProducts();

    // Filtrar por categorías
    if (filter.category && filter.category.length > 0) {
      filteredProducts = filteredProducts.filter(p => filter.category!.includes(p.category));
    }

    // Filtrar por rango de precios
    if (filter.priceRange) {
      filteredProducts = filteredProducts.filter(p => 
        p.price >= filter.priceRange!.min && p.price <= filter.priceRange!.max
      );
    }

    // Filtrar por rating
    if (filter.rating) {
      filteredProducts = filteredProducts.filter(p => p.rating >= filter.rating!);
    }

    // Filtrar por plataformas
    if (filter.platforms && filter.platforms.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        filter.platforms!.some(platform => p.platform.includes(platform))
      );
    }

    // Filtrar por tags
    if (filter.tags && filter.tags.length > 0) {
      filteredProducts = filteredProducts.filter(p => 
        filter.tags!.some(tag => p.tags.includes(tag))
      );
    }

    // Filtrar por featured
    if (filter.featured !== undefined) {
      filteredProducts = filteredProducts.filter(p => p.featured === filter.featured);
    }

    return filteredProducts;
  }

  private sortProducts(products: Product[], sortBy: string, sortOrder: 'asc' | 'desc'): Product[] {
    return products.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'releaseDate':
          comparison = new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime();
          break;
        default:
          return 0;
      }
      
      return sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  public getUserById(id: string): User | undefined {
    return this.users().find(u => u.email === id);
  }

  public getUserByEmail(email: string): User | undefined {
    return this.users().find(u => u.email === email);
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  public displayStats(): void {
    const users = this.users();
    const products = this.products();
    const orders = this.orders();
    const cart = this.cart();
    
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

  public resetAllData(): void {
    localStorage.removeItem(StorageKeys.USERS);
    localStorage.removeItem(StorageKeys.PRODUCTS);
    localStorage.removeItem(StorageKeys.ORDERS);
    localStorage.removeItem(StorageKeys.CART);
    localStorage.removeItem(StorageKeys.SESSION);
    localStorage.removeItem('dataVersion');
    
    console.log('🗑️ Todos los datos han sido eliminados');
    
    // Reinicializar
    this.config.forceReset = true;
    this.initializeData();
    this.config.forceReset = false;
  }

  // ===================================
  // DATA PERSISTENCE METHODS
  // ===================================

  public saveProducts(products: Product[]): void {
    localStorage.setItem(StorageKeys.PRODUCTS, JSON.stringify(products));
    this.loadProducts();
  }

  public saveUsers(users: User[]): void {
    localStorage.setItem(StorageKeys.USERS, JSON.stringify(users));
    this.loadUsers();
  }

  public saveOrders(orders: Order[]): void {
    localStorage.setItem(StorageKeys.ORDERS, JSON.stringify(orders));
    this.loadOrders();
  }

  public saveCart(cart: CartItem[]): void {
    localStorage.setItem(StorageKeys.CART, JSON.stringify(cart));
    this.loadCart();
  }

  // ===================================
  // CART MANAGEMENT METHODS
  // ===================================

  /**
   * Agrega un producto al carrito
   */
  public addToCart(productId: string, quantity: number = 1): boolean {
    console.log('🛒 [DataService] addToCart llamado con:', { productId, quantity });
    
    const product = this.products().find(p => p.id === productId);
    console.log('🛒 [DataService] Producto encontrado:', product);
    
    if (!product) {
      console.warn('Producto no encontrado:', productId);
      return false;
    }

    const currentCart = [...this.cart()];
    console.log('🛒 [DataService] Carrito actual:', currentCart);
    
    const existingItemIndex = currentCart.findIndex(item => item.id === productId);

    if (existingItemIndex >= 0) {
      // El producto ya existe en el carrito, actualizar cantidad
      const existingItem = currentCart[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity <= product.stock) {
        existingItem.quantity = newQuantity;
        console.log('🛒 [DataService] Actualizando cantidad existente:', newQuantity);
      } else {
        console.warn('Stock insuficiente para el producto:', product.name);
        return false;
      }
    } else {
      // Agregar nuevo producto al carrito
      if (quantity <= product.stock) {
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice || product.price,
          discount: product.discount || 0,
          image: product.image,
          quantity: quantity,
          maxStock: product.stock
        };
        console.log('🛒 [DataService] Creando nuevo cartItem:', cartItem);
        currentCart.push(cartItem);
      } else {
        console.warn('Stock insuficiente para el producto:', product.name);
        return false;
      }
    }

    console.log('🛒 [DataService] Carrito después de agregar:', currentCart);
    this.saveCart(currentCart);
    console.log('🛒 [DataService] Carrito guardado, nuevo carrito:', this.cart());
    return true;
  }

  /**
   * Actualiza la cantidad de un producto en el carrito
   */
  public updateCartItemQuantity(productId: string, quantity: number): boolean {
    if (quantity < 0) return false;

    const currentCart = [...this.cart()];
    const itemIndex = currentCart.findIndex(item => item.id === productId);

    if (itemIndex >= 0) {
      if (quantity === 0) {
        // Eliminar el producto si la cantidad es 0
        currentCart.splice(itemIndex, 1);
      } else if (quantity <= currentCart[itemIndex].maxStock) {
        // Actualizar la cantidad
        currentCart[itemIndex].quantity = quantity;
      } else {
        console.warn('Stock insuficiente');
        return false;
      }

      this.saveCart(currentCart);
      return true;
    }

    return false;
  }

  /**
   * Elimina un producto del carrito
   */
  public removeFromCart(productId: string): boolean {
    const currentCart = [...this.cart()];
    const itemIndex = currentCart.findIndex(item => item.id === productId);

    if (itemIndex >= 0) {
      currentCart.splice(itemIndex, 1);
      this.saveCart(currentCart);
      return true;
    }

    return false;
  }

  /**
   * Limpia completamente el carrito
   */
  public clearCart(): void {
    this.saveCart([]);
  }

  /**
   * Obtiene el resumen del carrito (totales, cantidades, etc.)
   */
  public getCartSummary(): {
    totalItems: number;
    subtotal: number;
    totalDiscount: number;
    total: number;
  } {
    const cartItems = this.cart();
    let subtotal = 0;
    let totalDiscount = 0;
    let totalItems = 0;

    cartItems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      totalItems += item.quantity;

      if (item.originalPrice && item.originalPrice > item.price) {
        const discountAmount = (item.originalPrice - item.price) * item.quantity;
        totalDiscount += discountAmount;
      }
    });

    return {
      totalItems,
      subtotal,
      totalDiscount,
      total: subtotal
    };
  }

  /**
   * Verifica si un producto está en el carrito
   */
  public isProductInCart(productId: string): boolean {
    return this.cart().some(item => item.id === productId);
  }

  /**
   * Obtiene la cantidad de un producto específico en el carrito
   */
  public getProductQuantityInCart(productId: string): number {
    const item = this.cart().find(item => item.id === productId);
    return item ? item.quantity : 0;
  }
}