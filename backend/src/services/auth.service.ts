import { User, LoginCredentials, RegisterData, AuthResponse, UserRole } from '../models/types';
import { dataService } from './data.service';

/**
 * Servicio de autenticación
 */
class AuthService {
  /**
   * Realiza login de usuario
   */
  login(credentials: LoginCredentials): AuthResponse {
    const user = dataService.getUserByEmail(credentials.email);
    
    if (!user) {
      return {
        success: false,
        message: 'Usuario no encontrado'
      };
    }

    if (!user.active) {
      return {
        success: false,
        message: 'Usuario inactivo'
      };
    }

    // En producción esto debe usar bcrypt para comparar hashes
    if (user.password !== credentials.password) {
      return {
        success: false,
        message: 'Contraseña incorrecta'
      };
    }

    // Generar token simulado
    const token = this.generateToken(user);
    
    // Remover password de la respuesta
    const { password, ...userWithoutPassword } = user;

    return {
      success: true,
      message: 'Login exitoso',
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Registra nuevo usuario
   */
  register(data: RegisterData): AuthResponse {
    // Validar que las contraseñas coincidan
    if (data.password !== data.confirmPassword) {
      return {
        success: false,
        message: 'Las contraseñas no coinciden'
      };
    }

    // Verificar si el email ya existe
    const existingUser = dataService.getUserByEmail(data.email);
    if (existingUser) {
      return {
        success: false,
        message: 'El email ya está registrado'
      };
    }

    // Crear nuevo usuario (en producción hashear password con bcrypt)
    const newUser = dataService.createUser({
      name: data.name,
      email: data.email,
      password: data.password, // Debería ser hasheado
      role: UserRole.BUYER,
      active: true
    });

    // Generar token
    const token = this.generateToken(newUser);
    
    // Remover password de la respuesta
    const { password, ...userWithoutPassword } = newUser;

    return {
      success: true,
      message: 'Registro exitoso',
      user: userWithoutPassword,
      token
    };
  }

  /**
   * Verifica token (simulado)
   */
  verifyToken(token: string): { valid: boolean; userId?: string } {
    try {
      // En producción usar JWT
      const decoded = Buffer.from(token, 'base64').toString('utf-8');
      const [email] = decoded.split(':');
      const user = dataService.getUserByEmail(email);
      
      if (user) {
        return { valid: true, userId: user.email };
      }
    } catch (error) {
      // Token inválido
    }
    
    return { valid: false };
  }

  /**
   * Genera token simulado (en producción usar JWT)
   */
  private generateToken(user: User): string {
    const payload = `${user.email}:${Date.now()}`;
    return Buffer.from(payload).toString('base64');
  }
}

export const authService = new AuthService();
