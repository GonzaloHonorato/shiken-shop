// ===================================
// USER INTERFACE
// Estructura de datos para usuarios
// ===================================

export interface User {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'buyer';
  active: boolean;
  registeredAt: string;
}

// ===================================
// USER ROLES ENUM
// Roles disponibles en el sistema
// ===================================

export enum UserRole {
  ADMIN = 'admin',
  BUYER = 'buyer'
}

// ===================================
// AUTH TYPES
// Tipos relacionados con autenticación
// ===================================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  role: UserRole | null;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}