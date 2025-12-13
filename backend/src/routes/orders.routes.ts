import { Router, Request, Response } from 'express';
import { dataService } from '../services/data.service';
import { CreateOrderRequest, OrderStatus } from '../models/types';

const router = Router();

/**
 * GET /api/orders
 * Obtener todas las órdenes (admin) o por usuario
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    
    let orders;
    if (userId && typeof userId === 'string') {
      orders = dataService.getOrdersByUserId(userId);
    } else {
      orders = dataService.getAllOrders();
    }
    
    res.json({
      success: true,
      data: orders,
      total: orders.length
    });
  } catch (error) {
    console.error('Error obteniendo órdenes:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/orders/:orderNumber
 * Obtener orden por número
 */
router.get('/:orderNumber', (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const order = dataService.getOrderByNumber(orderNumber);
    
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
      return;
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error obteniendo orden:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * POST /api/orders
 * Crear nueva orden
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const orderData: CreateOrderRequest = req.body;
    
    if (!orderData.items || orderData.items.length === 0) {
      res.status(400).json({
        success: false,
        error: 'La orden debe contener al menos un item'
      });
      return;
    }
    
    if (!orderData.shippingAddress || !orderData.paymentMethod) {
      res.status(400).json({
        success: false,
        error: 'Dirección de envío y método de pago son requeridos'
      });
      return;
    }
    
    const order = dataService.createOrder(orderData);
    
    if (!order) {
      res.status(400).json({
        success: false,
        error: 'No se pudo crear la orden. Verifique stock disponible'
      });
      return;
    }
    
    res.status(201).json({
      success: true,
      data: order,
      message: 'Orden creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * PUT /api/orders/:orderNumber/status
 * Actualizar estado de orden (admin)
 */
router.put('/:orderNumber/status', (req: Request, res: Response) => {
  try {
    const { orderNumber } = req.params;
    const { status } = req.body;
    
    if (!status || !Object.values(OrderStatus).includes(status)) {
      res.status(400).json({
        success: false,
        error: 'Estado inválido'
      });
      return;
    }
    
    const order = dataService.updateOrderStatus(orderNumber, status);
    
    if (!order) {
      res.status(404).json({
        success: false,
        error: 'Orden no encontrada'
      });
      return;
    }
    
    res.json({
      success: true,
      data: order,
      message: 'Estado de orden actualizado'
    });
  } catch (error) {
    console.error('Error actualizando estado de orden:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

export default router;
