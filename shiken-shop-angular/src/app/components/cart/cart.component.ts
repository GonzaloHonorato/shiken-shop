import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { CartItem, Product, Order, OrderStatus } from '../../models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  // ===================================
  // DEPENDENCY INJECTION
  // ===================================
  private dataService = inject(DataService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  // ===================================
  // REACTIVE STATE
  // ===================================
  public cart = this.dataService.cart;
  public cartCount = this.dataService.cartCount;
  public isLoggedIn = this.authService.isAuthenticated;
  public currentUser = this.authService.currentUser;

  // Component state
  public isProcessingCheckout = signal(false);
  public showCheckoutModal = signal(false);
  public orderNumber = signal('');

  // ===================================
  // COMPUTED VALUES
  // ===================================
  public cartSummary = computed(() => {
    const items = this.cart();
    let subtotal = 0;
    let totalDiscount = 0;
    
    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      if (item.discount && item.originalPrice) {
        const discountAmount = (item.originalPrice - item.price) * item.quantity;
        totalDiscount += discountAmount;
      }
    });
    
    return {
      subtotal,
      totalDiscount,
      total: subtotal,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0)
    };
  });

  public isEmpty = computed(() => this.cart().length === 0);

  // ===================================
  // LIFECYCLE METHODS
  // ===================================
  ngOnInit(): void {
    // Component initialization complete
  }

  // ===================================
  // CART OPERATIONS
  // ===================================

  /**
   * Incrementa la cantidad de un producto en el carrito
   */
  increaseQuantity(index: number): void {
    const cart = [...this.cart()];
    const item = cart[index];
    
    if (item && item.quantity < item.maxStock) {
      item.quantity++;
      this.dataService.saveCart(cart);
      this.notificationService.success(`Cantidad actualizada: ${item.name}`);
    } else {
      this.notificationService.warning('Stock máximo alcanzado');
    }
  }

  /**
   * Decrementa la cantidad de un producto en el carrito
   */
  decreaseQuantity(index: number): void {
    const cart = [...this.cart()];
    const item = cart[index];
    
    if (item && item.quantity > 1) {
      item.quantity--;
      this.dataService.saveCart(cart);
      this.notificationService.success(`Cantidad actualizada: ${item.name}`);
    } else {
      this.removeFromCart(index);
    }
  }

  /**
   * Elimina un producto del carrito
   */
  removeFromCart(index: number): void {
    const cart = [...this.cart()];
    const item = cart[index];
    
    if (item) {
      cart.splice(index, 1);
      this.dataService.saveCart(cart);
      this.notificationService.success(`${item.name} eliminado del carrito`);
    }
  }

  /**
   * Vacía completamente el carrito
   */
  clearCart(): void {
    if (this.isEmpty()) {
      this.notificationService.info('El carrito ya está vacío');
      return;
    }

    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      this.dataService.saveCart([]);
      this.notificationService.success('Carrito vaciado correctamente');
    }
  }

  // ===================================
  // CHECKOUT PROCESS
  // ===================================

  /**
   * Inicia el proceso de checkout
   */
  processCheckout(): void {
    if (this.isEmpty()) {
      this.notificationService.warning('Tu carrito está vacío');
      return;
    }

    if (!this.isLoggedIn()) {
      this.notificationService.info('Debes iniciar sesión para completar la compra');
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: '/cart' }
      });
      return;
    }

    this.isProcessingCheckout.set(true);

    // Simular procesamiento del pago (2 segundos)
    setTimeout(() => {
      this.completeOrder();
    }, 2000);
  }

  /**
   * Completa la orden y guarda en el historial
   */
  private completeOrder(): void {
    const cart = this.cart();
    const user = this.currentUser();
    const summary = this.cartSummary();

    if (!user || cart.length === 0) {
      this.isProcessingCheckout.set(false);
      return;
    }

    // Crear la orden
    const order: Order = {
      orderNumber: this.generateOrderId(),
      items: cart,
      total: summary.total,
      date: new Date().toISOString(),
      status: OrderStatus.DELIVERED,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Guardar la orden
    const orders = this.dataService.orders();
    const updatedOrders = [...orders, order];
    this.dataService.saveOrders(updatedOrders);

    // Limpiar el carrito
    this.dataService.saveCart([]);

    // Mostrar modal de éxito
    this.orderNumber.set(order.orderNumber);
    this.showCheckoutModal.set(true);
    this.isProcessingCheckout.set(false);

    this.notificationService.success('¡Compra realizada con éxito!');
  }

  /**
   * Genera un ID único para la orden
   */
  private generateOrderId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 9).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  // ===================================
  // MODAL MANAGEMENT
  // ===================================

  /**
   * Cierra el modal de checkout y redirige
   */
  closeCheckoutModal(): void {
    this.showCheckoutModal.set(false);
    this.router.navigate(['/']);
  }

  // ===================================
  // UTILITY METHODS
  // ===================================

  /**
   * Formatea precios para mostrar
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      minimumFractionDigits: 0
    }).format(price);
  }

  /**
   * Calcula el descuento de un item
   */
  getDiscountPercent(item: CartItem): number {
    if (!item.originalPrice || item.originalPrice <= item.price) return 0;
    return Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
  }

  /**
   * Navega a las categorías de productos
   */
  goToCategories(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navega al detalle de un producto (futuro feature)
   */
  goToProduct(productId: string): void {
    // TODO: Implementar cuando tengamos página de detalle de producto
    console.log('Navigating to product:', productId);
  }
}