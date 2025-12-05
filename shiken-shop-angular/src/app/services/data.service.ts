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

// ===================================
// CHEAPSHARK API INTERFACE
// ===================================
/**
 * Interface para la respuesta de la API de CheapShark
 * https://www.cheapshark.com/api/1.0/games
 */
interface CheapSharkGame {
  gameID: string;
  steamAppID: string | null;
  cheapest: string;
  cheapestDealID: string;
  external: string;
  internalName: string;
  thumb: string;
}

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

  // Flag para indicar si los datos están listos
  private dataReadySignal = signal<boolean>(false);
  public readonly dataReady = this.dataReadySignal.asReadonly();

  constructor() {
    this.initializeData();
  }

  // ===================================
  // INITIALIZATION
  // ===================================
  
  public async initializeData(): Promise<void> {
    console.log('🚀 Inicializando datos de ShikenShop...');
    
    const dataVersion = localStorage.getItem('dataVersion');
    
    // Si no existe versión o se fuerza reset
    if (!dataVersion || this.config.forceReset) {
      console.log('📦 Cargando datos iniciales desde archivos JSON...');
      
      try {
        await this.initializeUsersFromJson();
        await this.initializeProductsFromJson();
        await this.initializeOrdersFromJson();
        this.initializeCart();
        
        // Cargar datos desde localStorage primero
        this.loadAllData();
        
        // Inyectar productos desde CheapShark API (categoría Aventura)
        console.log('🎮 Inyectando productos desde CheapShark API...');
        await this.injectProductsFromCheapShark('mario', ProductCategoryEnum.AVENTURA);
        
        // Guardar versión
        localStorage.setItem('dataVersion', this.config.version);
        console.log('✨ Datos cargados desde JSON y API correctamente');
      } catch (error) {
        console.error('❌ Error cargando datos:', error);
      }
    } else {
      console.log('ℹ️ Datos ya inicializados (versión ' + dataVersion + ')');
    }
    
    // Cargar datos desde localStorage
    this.loadAllData();
    this.dataReadySignal.set(true);
    this.displayStats();
  }

  /**
   * Carga usuarios desde el archivo JSON externo
   */
  private async initializeUsersFromJson(): Promise<void> {
    if (!localStorage.getItem(StorageKeys.USERS) || this.config.forceReset) {
      try {
        const response = await fetch('/data/users.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const usersData: User[] = await response.json();
        
        // Mapear roles del JSON a UserRole enum
        const defaultUsers: User[] = usersData.map(user => ({
          ...user,
          role: user.role === 'admin' ? UserRole.ADMIN : UserRole.BUYER
        }));
        
        localStorage.setItem(StorageKeys.USERS, JSON.stringify(defaultUsers));
        console.log(`✅ ${defaultUsers.length} usuarios cargados desde users.json`);
      } catch (error) {
        console.error('❌ Error cargando users.json:', error);
        throw error;
      }
    }
  }

  /**
   * Carga productos desde el archivo JSON externo
   */
  private async initializeProductsFromJson(): Promise<void> {
    if (!localStorage.getItem(StorageKeys.PRODUCTS) || this.config.forceReset) {
      try {
        const response = await fetch('/data/products.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const productsData: Product[] = await response.json();
        
        // Mapear categorías del JSON a ProductCategoryEnum
        const defaultProducts: Product[] = productsData.map(product => ({
          ...product,
          category: this.mapCategoryFromJson(product.category as string)
        }));
        
        localStorage.setItem(StorageKeys.PRODUCTS, JSON.stringify(defaultProducts));
        console.log(`✅ ${defaultProducts.length} productos cargados desde products.json`);
      } catch (error) {
        console.error('❌ Error cargando products.json:', error);
        throw error;
      }
    }
  }

  /**
   * Carga órdenes desde el archivo JSON externo
   */
  private async initializeOrdersFromJson(): Promise<void> {
    if (!localStorage.getItem(StorageKeys.ORDERS) || this.config.forceReset) {
      try {
        const response = await fetch('/data/orders.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const ordersData: Order[] = await response.json();
        
        localStorage.setItem(StorageKeys.ORDERS, JSON.stringify(ordersData));
        console.log(`✅ ${ordersData.length} órdenes cargadas desde orders.json`);
      } catch (error) {
        console.error('❌ Error cargando orders.json:', error);
        throw error;
      }
    }
  }

  /**
   * Mapea la categoría del JSON al enum ProductCategoryEnum
   */
  private mapCategoryFromJson(category: string): ProductCategory {
    const categoryMap: Record<string, ProductCategory> = {
      'accion': ProductCategoryEnum.ACCION,
      'rpg': ProductCategoryEnum.RPG,
      'estrategia': ProductCategoryEnum.ESTRATEGIA,
      'aventura': ProductCategoryEnum.AVENTURA
    };
    return categoryMap[category.toLowerCase()] || ProductCategoryEnum.ACCION;
  }

  // ===================================
  // CHEAPSHARK API INTEGRATION
  // ===================================

  /**
   * Interface para la respuesta de CheapShark API
   */
  private cheapSharkApiUrl = 'https://www.cheapshark.com/api/1.0/games';

  /**
   * Carga productos desde la API de CheapShark y los normaliza al formato de Product
   * @param searchTerm - Término de búsqueda para la API (ej: 'mario', 'zelda')
   * @param category - Categoría a asignar a los productos importados
   * @returns Promise<Product[]> - Array de productos normalizados
   */
  public async loadProductsFromCheapShark(
    searchTerm: string, 
    category: ProductCategory = ProductCategoryEnum.AVENTURA
  ): Promise<Product[]> {
    console.log(`🎮 Cargando juegos desde CheapShark API: "${searchTerm}"...`);
    
    try {
      const response = await fetch(`${this.cheapSharkApiUrl}?title=${encodeURIComponent(searchTerm)}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const cheapSharkGames: CheapSharkGame[] = await response.json();
      
      if (!cheapSharkGames || cheapSharkGames.length === 0) {
        console.warn('⚠️ No se encontraron juegos en CheapShark para:', searchTerm);
        return [];
      }
      
      // Normalizar los juegos al formato Product
      const normalizedProducts: Product[] = cheapSharkGames.map((game, index) => 
        this.normalizeCheapSharkGame(game, category, index)
      );
      
      console.log(`✅ ${normalizedProducts.length} juegos cargados desde CheapShark API`);
      return normalizedProducts;
      
    } catch (error) {
      console.error('❌ Error cargando desde CheapShark API:', error);
      throw error;
    }
  }

  /**
   * Normaliza un juego de CheapShark al formato Product de ShikenShop
   */
  private normalizeCheapSharkGame(
    game: CheapSharkGame, 
    category: ProductCategory,
    index: number
  ): Product {
    // Convertir precio de USD a CLP (aproximado)
    const priceUSD = parseFloat(game.cheapest) || 0;
    const priceCLP = Math.round(priceUSD * 950); // Tipo de cambio aproximado
    
    // Generar un precio original con descuento aleatorio entre 10-30%
    const discountPercent = Math.floor(Math.random() * 21) + 10; // 10-30%
    const originalPriceCLP = Math.round(priceCLP / (1 - discountPercent / 100));
    
    // Generar rating aleatorio entre 3.5 y 5
    const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
    
    // Generar número de reviews aleatorio
    const reviews = Math.floor(Math.random() * 2000) + 100;
    
    // Generar stock aleatorio
    const stock = Math.floor(Math.random() * 150) + 50;
    
    const now = new Date().toISOString();
    
    return {
      id: `cheapshark-${game.gameID}`,
      name: game.external,
      description: `${game.external} - Disponible al mejor precio. Juego importado desde la plataforma de ofertas de videojuegos.`,
      category: category,
      price: priceCLP,
      originalPrice: originalPriceCLP,
      discount: discountPercent,
      stock: stock,
      image: game.thumb || 'https://via.placeholder.com/400x225?text=Game+Image',
      active: true,
      featured: index < 3, // Los primeros 3 son destacados
      rating: rating,
      reviews: reviews,
      releaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      developer: 'CheapShark Import',
      platform: game.steamAppID ? ['PC'] : ['PC', 'Multi-platform'],
      tags: ['Imported', 'Deal', category],
      createdAt: now,
      updatedAt: now
    };
  }

  /**
   * Carga juegos desde CheapShark y los agrega al catálogo existente
   * @param searchTerm - Término de búsqueda
   * @param category - Categoría para los productos
   */
  public async injectProductsFromCheapShark(
    searchTerm: string,
    category: ProductCategory = ProductCategoryEnum.AVENTURA
  ): Promise<void> {
    try {
      const newProducts = await this.loadProductsFromCheapShark(searchTerm, category);
      
      if (newProducts.length === 0) {
        console.warn('⚠️ No hay productos para inyectar');
        return;
      }
      
      // Obtener productos actuales
      const currentProducts = this.products();
      
      // Filtrar productos que ya existen (por ID)
      const existingIds = new Set(currentProducts.map(p => p.id));
      const uniqueNewProducts = newProducts.filter(p => !existingIds.has(p.id));
      
      if (uniqueNewProducts.length === 0) {
        console.log('ℹ️ Todos los productos ya existen en el catálogo');
        return;
      }
      
      // Combinar productos existentes con los nuevos
      const updatedProducts = [...currentProducts, ...uniqueNewProducts];
      
      // Guardar en localStorage y actualizar estado
      this.saveProducts(updatedProducts);
      
      console.log(`🎉 ${uniqueNewProducts.length} nuevos productos inyectados al catálogo`);
      console.log('📊 Total de productos en catálogo:', updatedProducts.length);
      
    } catch (error) {
      console.error('❌ Error inyectando productos desde CheapShark:', error);
      throw error;
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

  public async resetAllData(): Promise<void> {
    localStorage.removeItem(StorageKeys.USERS);
    localStorage.removeItem(StorageKeys.PRODUCTS);
    localStorage.removeItem(StorageKeys.ORDERS);
    localStorage.removeItem(StorageKeys.CART);
    localStorage.removeItem(StorageKeys.SESSION);
    localStorage.removeItem('dataVersion');
    
    console.log('🗑️ Todos los datos han sido eliminados');
    
    // Reinicializar desde JSON
    this.config.forceReset = true;
    await this.initializeData();
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
    this.ordersSignal.set(orders);
    this.ordersSubject.next(orders);
    console.log('💾 Órdenes guardadas:', orders.length, 'órdenes');
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

  // ===================================
  // PRODUCT CRUD METHODS
  // ===================================

  /**
   * Crea un nuevo producto
   */
  public createProduct(productData: Omit<Product, 'id'>): Product {
    const newProduct: Product = {
      ...productData,
      id: 'product_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
    };

    const currentProducts = this.products();
    const updatedProducts = [...currentProducts, newProduct];
    
    this.saveProducts(updatedProducts);
    console.log('✅ Producto creado:', newProduct.name);
    
    return newProduct;
  }

  /**
   * Actualiza un producto existente
   */
  public updateProduct(productId: string, updatedData: Partial<Product>): Product | null {
    const currentProducts = this.products();
    const productIndex = currentProducts.findIndex(p => p.id === productId);
    
    if (productIndex === -1) {
      console.error('❌ Producto no encontrado:', productId);
      return null;
    }

    const updatedProduct: Product = {
      ...currentProducts[productIndex],
      ...updatedData,
      id: productId // Ensure ID doesn't change
    };

    const updatedProducts = [...currentProducts];
    updatedProducts[productIndex] = updatedProduct;
    
    this.saveProducts(updatedProducts);
    console.log('✅ Producto actualizado:', updatedProduct.name);
    
    return updatedProduct;
  }

  /**
   * Elimina un producto
   */
  public deleteProduct(productId: string): boolean {
    const currentProducts = this.products();
    const filteredProducts = currentProducts.filter(p => p.id !== productId);
    
    if (filteredProducts.length === currentProducts.length) {
      console.error('❌ Producto no encontrado para eliminar:', productId);
      return false;
    }

    this.saveProducts(filteredProducts);
    console.log('✅ Producto eliminado:', productId);
    
    return true;
  }

  // ===================================
  // USER MANAGEMENT METHODS
  // ===================================

  /**
   * Actualiza el rol de un usuario
   */
  public updateUserRole(userEmail: string, newRole: UserRole): boolean {
    const currentUsers = this.users();
    const userIndex = currentUsers.findIndex(u => u.email === userEmail);
    
    if (userIndex === -1) {
      console.error('❌ Usuario no encontrado:', userEmail);
      return false;
    }

    const updatedUsers = [...currentUsers];
    updatedUsers[userIndex] = {
      ...updatedUsers[userIndex],
      role: newRole
    };

    this.saveUsers(updatedUsers);
    console.log('✅ Rol de usuario actualizado:', userEmail, 'nuevo rol:', newRole);
    
    return true;
  }

  // ===================================
  // ORDER MANAGEMENT METHODS
  // ===================================

  /**
   * Actualiza el estado de una orden
   */
  public updateOrderStatus(orderNumber: string, newStatus: any): boolean {
    const currentOrders = this.orders();
    const orderIndex = currentOrders.findIndex(o => o.orderNumber === orderNumber);
    
    if (orderIndex === -1) {
      console.error('❌ Orden no encontrada:', orderNumber);
      return false;
    }

    const updatedOrders = [...currentOrders];
    updatedOrders[orderIndex] = {
      ...updatedOrders[orderIndex],
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    this.saveOrders(updatedOrders);
    console.log('✅ Estado de orden actualizado:', orderNumber, 'nuevo estado:', newStatus);
    
    return true;
  }

  /**
   * Crea una nueva orden
   */
  public createOrder(orderData: Omit<Order, 'orderNumber' | 'createdAt' | 'updatedAt'>): Order {
    const newOrder: Order = {
      ...orderData,
      orderNumber: this.generateOrderNumber(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const currentOrders = this.orders();
    const updatedOrders = [...currentOrders, newOrder];
    
    this.saveOrders(updatedOrders);
    console.log('✅ Orden creada:', newOrder.orderNumber);
    
    return newOrder;
  }

  /**
   * Genera un número único para la orden
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }


}