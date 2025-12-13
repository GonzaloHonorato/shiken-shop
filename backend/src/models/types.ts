// ===================================
// USER TYPES
// ===================================

export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer'
}

export interface User {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  registeredAt: string;
  fullName?: string;
  username?: string;
  phone?: string;
  birthdate?: string;
  address?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  token?: string;
}

// ===================================
// PRODUCT TYPES
// ===================================

export enum ProductCategoryEnum {
  ACCION = 'accion',
  RPG = 'rpg',
  ESTRATEGIA = 'estrategia',
  AVENTURA = 'aventura'
}

export type ProductCategory = ProductCategoryEnum;

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  helpful: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  discount: number;
  stock: number;
  image: string;
  images?: string[];
  active: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
  productReviews?: ProductReview[];
  releaseDate?: string;
  developer?: string;
  platform?: string[];
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

// ===================================
// CART TYPES
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

export interface Cart {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  totalDiscount: number;
  total: number;
  updatedAt: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity?: number;
}

export interface UpdateCartItemRequest {
  itemId: string;
  quantity: number;
}

// ===================================
// ORDER TYPES
// ===================================

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  PAYPAL = 'paypal',
  BANK_TRANSFER = 'bank_transfer'
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface PaymentMethod {
  type: PaymentType;
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  transactionId?: string;
}

export interface Order {
  orderNumber: string;
  userId?: string;
  items: CartItem[];
  total: number;
  date: string;
  status: OrderStatus;
  shippingAddress?: ShippingAddress;
  paymentMethod?: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderRequest {
  userId?: string;
  items: CartItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
}

// ===================================
// API RESPONSE TYPES
// ===================================

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ===================================
// CHEAPSHARK API TYPES
// ===================================

export interface CheapSharkGame {
  gameID: string;
  steamAppID: string | null;
  cheapest: string;
  cheapestDealID: string;
  external: string;
  internalName: string;
  thumb: string;
}
