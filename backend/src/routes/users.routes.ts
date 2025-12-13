import { Router, Request, Response } from 'express';
import { dataService } from '../services/data.service';

const router = Router();

/**
 * GET /api/users
 * Obtener todos los usuarios (solo admin)
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const users = dataService.getAllUsers();
    
    // Remover passwords de la respuesta
    const usersWithoutPasswords = users.map(({ password, ...user }) => user);
    
    res.json({
      success: true,
      data: usersWithoutPasswords,
      total: usersWithoutPasswords.length
    });
  } catch (error) {
    console.error('Error obteniendo usuarios:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/users/:email
 * Obtener usuario por email
 */
router.get('/:email', (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const user = dataService.getUserByEmail(email);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
      return;
    }
    
    // Remover password
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * PUT /api/users/:email
 * Actualizar usuario
 */
router.put('/:email', (req: Request, res: Response) => {
  try {
    const { email } = req.params;
    const updates = req.body;
    
    // No permitir actualizar el email o el password aquí
    delete updates.email;
    delete updates.password;
    
    const user = dataService.updateUser(email, updates);
    
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'Usuario no encontrado'
      });
      return;
    }
    
    // Remover password
    const { password, ...userWithoutPassword } = user;
    
    res.json({
      success: true,
      data: userWithoutPassword,
      message: 'Usuario actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

export default router;
