// ===================================
// PRODUCT INTERFACE
// Estructura de datos para productos
// ===================================

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
  active: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
  releaseDate: string;
  developer: string;
  platform: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

// ===================================
// PRODUCT CATEGORIES
// Categorías de productos disponibles
// ===================================

export type ProductCategory = 'accion' | 'rpg' | 'estrategia' | 'aventura';

export enum ProductCategoryEnum {
  ACCION = 'accion',
  RPG = 'rpg',
  ESTRATEGIA = 'estrategia',
  AVENTURA = 'aventura'
}

// ===================================
// CATEGORY INTERFACE
// Información sobre categorías
// ===================================

export interface Category {
  id: ProductCategory;
  name: string;
  description: string;
  color: string;
  icon: string;
  gradient: string;
}

// ===================================
// PRODUCT FILTERS
// Interfaces para filtrado de productos
// ===================================

export interface ProductFilter {
  category?: ProductCategory[];
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  platforms?: string[];
  tags?: string[];
  featured?: boolean;
  active?: boolean;
}

export interface ProductSearchParams {
  query?: string;
  category?: ProductCategory;
  sortBy?: 'name' | 'price' | 'rating' | 'releaseDate';
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}