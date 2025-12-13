import fs from 'fs/promises';
import path from 'path';
import {
  User,
  Product,
  Order,
  Cart,
  CartItem,
  UserRole,
  ProductCategoryEnum,
  OrderStatus,
  CreateOrderRequest,
  CheapSharkGame,
  ProductCategory
} from '../models/types';

/**
 * Servicio de datos en memoria para ShikenShop Backend
 * Carga datos iniciales desde archivos JSON y los mantiene en memoria
 */
class DataService {
  private users: User[] = [];
  private products: Product[] = [];
  private orders: Order[] = [];
  private carts: Map<string, Cart> = new Map(); // Carts indexados por userId
  private initialized = false;

  /**
   * Inicializa el servicio cargando datos desde archivos JSON
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('⚠️ DataService ya está inicializado');
      return;
    }

    console.log('🚀 Inicializando DataService...');
    
    try {
      await this.loadUsers();
      await this.loadProducts();
      await this.loadOrders();
      this.initialized = true;
      this.displayStats();
      console.log('✨ DataService inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando DataService:', error);
      throw error;
    }
  }

  /**
   * Carga usuarios desde users.json
   */
  private async loadUsers(): Promise<void> {
    try {
      const filePath = path.join(__dirname, '../data/users.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const usersData = JSON.parse(fileContent);
      
      this.users = usersData.map((user: any) => ({
        ...user,
        role: user.role === 'admin' ? UserRole.ADMIN : UserRole.BUYER
      }));
      
      console.log(`✅ ${this.users.length} usuarios cargados`);
    } catch (error) {
      console.error('❌ Error cargando users.json:', error);
      throw error;
    }
  }

  /**
   * Carga productos desde products.json
   */
  private async loadProducts(): Promise<void> {
    try {
      const filePath = path.join(__dirname, '../data/products.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const productsData = JSON.parse(fileContent);
      
      this.products = productsData.map((product: any) => ({
        ...product,
        category: this.mapCategory(product.category)
      }));
      
      console.log(`✅ ${this.products.length} productos cargados`);
    } catch (error) {
      console.error('❌ Error cargando products.json:', error);
      throw error;
    }
  }

  /**
   * Carga órdenes desde orders.json
   */
  private async loadOrders(): Promise<void> {
    try {
      const filePath = path.join(__dirname, '../data/orders.json');
      const fileContent = await fs.readFile(filePath, 'utf-8');
      this.orders = JSON.parse(fileContent);
      
      console.log(`✅ ${this.orders.length} órdenes cargadas`);
    } catch (error) {
      console.error('❌ Error cargando orders.json:', error);
      throw error;
    }
  }

  /**
   * Mapea categoría string a ProductCategoryEnum
   */
  private mapCategory(category: string): ProductCategory {
    const categoryMap: Record<string, ProductCategory> = {
      'accion': ProductCategoryEnum.ACCION,
      'rpg': ProductCategoryEnum.RPG,
      'estrategia': ProductCategoryEnum.ESTRATEGIA,
      'aventura': ProductCategoryEnum.AVENTURA
    };
    return categoryMap[category.toLowerCase()] || ProductCategoryEnum.ACCION;
  }

  /**
   * Muestra estadísticas de datos cargados
   */
  private displayStats(): void {
    console.log('\n📊 Estadísticas de datos:');
    console.log(`   👥 Usuarios: ${this.users.length}`);
    console.log(`   🎮 Productos: ${this.products.length}`);
    console.log(`   📦 Órdenes: ${this.orders.length}`);
    console.log(`   🛒 Carritos activos: ${this.carts.size}\n`);
  }

  // ===================================
  // MÉTODOS DE USUARIOS
  // ===================================

  getAllUsers(): User[] {
    return this.users;
  }

  getUserByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email);
  }

  getUserById(index: number): User | undefined {
    return this.users[index];
  }

  createUser(userData: Omit<User, 'registeredAt'>): User {
    const newUser: User = {
      ...userData,
      registeredAt: new Date().toISOString(),
      active: true
    };
    this.users.push(newUser);
    return newUser;
  }

  updateUser(email: string, updates: Partial<User>): User | null {
    const index = this.users.findIndex(u => u.email === email);
    if (index === -1) return null;
    
    this.users[index] = {
      ...this.users[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.users[index];
  }

  // ===================================
  // MÉTODOS DE PRODUCTOS
  // ===================================

  getAllProducts(): Product[] {
    return this.products;
  }

  getActiveProducts(): Product[] {
    return this.products.filter(p => p.active);
  }

  getFeaturedProducts(): Product[] {
    return this.products.filter(p => p.featured && p.active);
  }

  getProductById(id: string): Product | undefined {
    return this.products.find(p => p.id === id);
  }

  getProductsByCategory(category: ProductCategory): Product[] {
    return this.products.filter(p => p.category === category && p.active);
  }

  searchProducts(query: string): Product[] {
    const lowerQuery = query.toLowerCase();
    return this.products.filter(p => 
      p.active && (
        p.name.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
    );
  }

  createProduct(product: Product): Product {
    this.products.push(product);
    return product;
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    return this.products[index];
  }

  updateProductStock(id: string, quantityChange: number): boolean {
    const product = this.getProductById(id);
    if (!product) return false;
    
    const newStock = product.stock + quantityChange;
    if (newStock < 0) return false;
    
    product.stock = newStock;
    return true;
  }

  // ===================================
  // MÉTODOS DE CARRITO
  // ===================================

  getCart(userId: string): Cart {
    if (!this.carts.has(userId)) {
      this.carts.set(userId, this.createEmptyCart());
    }
    return this.carts.get(userId)!;
  }

  addToCart(userId: string, productId: string, quantity: number = 1): Cart | null {
    const product = this.getProductById(productId);
    if (!product || product.stock < quantity) return null;

    const cart = this.getCart(userId);
    const existingItem = cart.items.find(item => item.id === productId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;
      if (newQuantity > product.stock) return null;
      existingItem.quantity = newQuantity;
    } else {
      const cartItem: CartItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        originalPrice: product.originalPrice,
        discount: product.discount,
        image: product.image,
        quantity,
        maxStock: product.stock
      };
      cart.items.push(cartItem);
    }

    this.recalculateCart(cart);
    return cart;
  }

  updateCartItem(userId: string, itemId: string, quantity: number): Cart | null {
    const cart = this.getCart(userId);
    const item = cart.items.find(i => i.id === itemId);
    if (!item) return null;

    const product = this.getProductById(itemId);
    if (!product || quantity > product.stock) return null;

    if (quantity <= 0) {
      cart.items = cart.items.filter(i => i.id !== itemId);
    } else {
      item.quantity = quantity;
    }

    this.recalculateCart(cart);
    return cart;
  }

  removeFromCart(userId: string, itemId: string): Cart {
    const cart = this.getCart(userId);
    cart.items = cart.items.filter(item => item.id !== itemId);
    this.recalculateCart(cart);
    return cart;
  }

  clearCart(userId: string): Cart {
    const emptyCart = this.createEmptyCart();
    this.carts.set(userId, emptyCart);
    return emptyCart;
  }

  private createEmptyCart(): Cart {
    return {
      items: [],
      totalItems: 0,
      subtotal: 0,
      totalDiscount: 0,
      total: 0,
      updatedAt: new Date().toISOString()
    };
  }

  private recalculateCart(cart: Cart): void {
    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.subtotal = cart.items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    cart.total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cart.totalDiscount = cart.subtotal - cart.total;
    cart.updatedAt = new Date().toISOString();
  }

  // ===================================
  // MÉTODOS DE ÓRDENES
  // ===================================

  getAllOrders(): Order[] {
    return this.orders;
  }

  getOrdersByUserId(userId: string): Order[] {
    return this.orders.filter(o => o.userId === userId);
  }

  getOrderByNumber(orderNumber: string): Order | undefined {
    return this.orders.find(o => o.orderNumber === orderNumber);
  }

  createOrder(request: CreateOrderRequest): Order | null {
    // Verificar stock de todos los items
    for (const item of request.items) {
      const product = this.getProductById(item.id);
      if (!product || product.stock < item.quantity) {
        return null;
      }
    }

    // Crear orden
    const orderNumber = this.generateOrderNumber();
    const now = new Date().toISOString();
    const total = request.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order: Order = {
      orderNumber,
      userId: request.userId,
      items: request.items,
      total,
      date: now,
      status: OrderStatus.PENDING,
      shippingAddress: request.shippingAddress,
      paymentMethod: request.paymentMethod,
      createdAt: now,
      updatedAt: now
    };

    // Reducir stock de productos
    for (const item of request.items) {
      this.updateProductStock(item.id, -item.quantity);
    }

    // Limpiar carrito si es de un usuario
    if (request.userId) {
      this.clearCart(request.userId);
    }

    this.orders.push(order);
    return order;
  }

  updateOrderStatus(orderNumber: string, status: OrderStatus): Order | null {
    const order = this.getOrderByNumber(orderNumber);
    if (!order) return null;

    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD-${timestamp}-${random}`;
  }

  // ===================================
  // MÉTODOS DE CHEAPSHARK API
  // ===================================

  /**
   * Normaliza un juego de CheapShark al formato Product
   */
  normalizeCheapSharkGame(game: CheapSharkGame, category: ProductCategory): Product {
    const priceUSD = parseFloat(game.cheapest) || 0;
    const priceCLP = Math.round(priceUSD * 950);
    const discountPercent = Math.floor(Math.random() * 21) + 10;
    const originalPriceCLP = Math.round(priceCLP / (1 - discountPercent / 100));
    const rating = Math.round((Math.random() * 1.5 + 3.5) * 10) / 10;
    const reviews = Math.floor(Math.random() * 500) + 50;
    const stock = Math.floor(Math.random() * 100) + 20;

    return {
      id: `cheapshark-${game.gameID}`,
      name: game.external,
      description: `${game.external} - Disponible en oferta especial`,
      category,
      price: priceCLP,
      originalPrice: originalPriceCLP,
      discount: discountPercent,
      stock,
      image: game.thumb,
      images: [game.thumb],
      active: true,
      featured: false,
      rating,
      reviews,
      developer: 'Various',
      platform: ['PC'],
      tags: ['Importado', 'CheapShark'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  /**
   * Agrega productos desde CheapShark
   */
  addCheapSharkProducts(games: CheapSharkGame[], category: ProductCategory): Product[] {
    const normalizedProducts = games.map(game => this.normalizeCheapSharkGame(game, category));
    this.products.push(...normalizedProducts);
    console.log(`✅ ${normalizedProducts.length} productos de CheapShark agregados`);
    return normalizedProducts;
  }
}

// Singleton
export const dataService = new DataService();
