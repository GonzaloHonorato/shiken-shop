import { Product } from './product.model';

// ===================================
// CART ITEM INTERFACE
// Estructura de datos para items del carrito
// ===================================

export interface CartItem {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  quantity: number;
  maxStock: number;
}

// ===================================
// CART INTERFACE
// Estructura completa del carrito
// ===================================

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  totalDiscount: number;
  total: number;
  updatedAt: string;
}

// ===================================
// CART OPERATIONS
// Tipos para operaciones del carrito
// ===================================

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

export interface CartSummary {
  totalItems: number;
  subtotal: number;
  totalDiscount: number;
  total: number;
}

// ===================================
// CART UTILS
// Funciones utilitarias para el carrito
// ===================================

export class CartUtils {
  static calculateItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  static calculateCartSummary(items: CartItem[]): CartSummary {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalDiscount = subtotal - total;

    return {
      totalItems,
      subtotal,
      totalDiscount,
      total
    };
  }

  static createCartItemFromProduct(product: Product, quantity = 1): CartItem {
    return {
      id: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      discount: product.discount,
      image: product.image,
      quantity,
      maxStock: product.stock
    };
  }
}