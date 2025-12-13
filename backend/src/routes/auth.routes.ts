import { Router, Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { LoginCredentials, RegisterData } from '../models/types';

const router = Router();

/**
 * POST /api/auth/login
 * Login de usuario
 */
router.post('/login', (req: Request, res: Response) => {
  try {
    const credentials: LoginCredentials = req.body;
    
    if (!credentials.email || !credentials.password) {
      res.status(400).json({
        success: false,
        error: 'Email y contraseña son requeridos'
      });
      return;
    }

    const result = authService.login(credentials);
    
    if (!result.success) {
      res.status(401).json(result);
      return;
    }

    res.json(result);
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * POST /api/auth/register
 * Registro de nuevo usuario
 */
router.post('/register', (req: Request, res: Response) => {
  try {
    const data: RegisterData = req.body;
    
    if (!data.name || !data.email || !data.password || !data.confirmPassword) {
      res.status(400).json({
        success: false,
        error: 'Todos los campos son requeridos'
      });
      return;
    }

    const result = authService.register(data);
    
    if (!result.success) {
      res.status(400).json(result);
      return;
    }

    res.status(201).json(result);
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * POST /api/auth/verify
 * Verificar token
 */
router.post('/verify', (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      res.status(400).json({
        success: false,
        error: 'Token requerido'
      });
      return;
    }

    const result = authService.verifyToken(token);
    res.json({ success: result.valid });
  } catch (error) {
    console.error('Error verificando token:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

export default router;
