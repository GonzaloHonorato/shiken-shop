import { Router, Request, Response } from 'express';
import { dataService } from '../services/data.service';
import { AddToCartRequest, UpdateCartItemRequest } from '../models/types';

const router = Router();

/**
 * GET /api/cart/:userId
 * Obtener carrito de usuario
 */
router.get('/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = dataService.getCart(userId);
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error obteniendo carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * POST /api/cart/:userId/add
 * Agregar producto al carrito
 */
router.post('/:userId/add', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { productId, quantity = 1 }: AddToCartRequest = req.body;
    
    if (!productId) {
      res.status(400).json({
        success: false,
        error: 'productId es requerido'
      });
      return;
    }
    
    const cart = dataService.addToCart(userId, productId, quantity);
    
    if (!cart) {
      res.status(400).json({
        success: false,
        error: 'No se pudo agregar al carrito. Verifique stock disponible'
      });
      return;
    }
    
    res.json({
      success: true,
      data: cart,
      message: 'Producto agregado al carrito'
    });
  } catch (error) {
    console.error('Error agregando al carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * PUT /api/cart/:userId/update
 * Actualizar cantidad de item en carrito
 */
router.put('/:userId/update', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { itemId, quantity }: UpdateCartItemRequest = req.body;
    
    if (!itemId || quantity === undefined) {
      res.status(400).json({
        success: false,
        error: 'itemId y quantity son requeridos'
      });
      return;
    }
    
    const cart = dataService.updateCartItem(userId, itemId, quantity);
    
    if (!cart) {
      res.status(400).json({
        success: false,
        error: 'No se pudo actualizar el carrito'
      });
      return;
    }
    
    res.json({
      success: true,
      data: cart,
      message: 'Carrito actualizado'
    });
  } catch (error) {
    console.error('Error actualizando carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * DELETE /api/cart/:userId/remove/:itemId
 * Eliminar item del carrito
 */
router.delete('/:userId/remove/:itemId', (req: Request, res: Response) => {
  try {
    const { userId, itemId } = req.params;
    const cart = dataService.removeFromCart(userId, itemId);
    
    res.json({
      success: true,
      data: cart,
      message: 'Item eliminado del carrito'
    });
  } catch (error) {
    console.error('Error eliminando del carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * DELETE /api/cart/:userId/clear
 * Vaciar carrito
 */
router.delete('/:userId/clear', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const cart = dataService.clearCart(userId);
    
    res.json({
      success: true,
      data: cart,
      message: 'Carrito vaciado'
    });
  } catch (error) {
    console.error('Error vaciando carrito:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

export default router;
