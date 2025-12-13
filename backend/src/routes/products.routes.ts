import { Router, Request, Response } from 'express';
import { dataService } from '../services/data.service';
import { ProductCategoryEnum } from '../models/types';

const router = Router();

/**
 * GET /api/products
 * Obtener todos los productos activos
 */
router.get('/', (req: Request, res: Response) => {
  try {
    const { category, search, featured } = req.query;
    
    let products = dataService.getActiveProducts();
    
    // Filtrar por categoría
    if (category && typeof category === 'string') {
      products = dataService.getProductsByCategory(category as any);
    }
    
    // Filtrar por búsqueda
    if (search && typeof search === 'string') {
      products = dataService.searchProducts(search);
    }
    
    // Filtrar por featured
    if (featured === 'true') {
      products = dataService.getFeaturedProducts();
    }
    
    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/products/featured
 * Obtener productos destacados
 */
router.get('/featured', (req: Request, res: Response) => {
  try {
    const products = dataService.getFeaturedProducts();
    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error('Error obteniendo productos destacados:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/products/category/:category
 * Obtener productos por categoría
 */
router.get('/category/:category', (req: Request, res: Response) => {
  try {
    const { category } = req.params;
    const products = dataService.getProductsByCategory(category as any);
    
    res.json({
      success: true,
      data: products,
      total: products.length
    });
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * GET /api/products/:id
 * Obtener producto por ID
 */
router.get('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = dataService.getProductById(id);
    
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
      return;
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * POST /api/products
 * Crear nuevo producto (solo admin)
 */
router.post('/', (req: Request, res: Response) => {
  try {
    const productData = req.body;
    const product = dataService.createProduct(productData);
    
    res.status(201).json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente'
    });
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

/**
 * PUT /api/products/:id
 * Actualizar producto (solo admin)
 */
router.put('/:id', (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const product = dataService.updateProduct(id, updates);
    
    if (!product) {
      res.status(404).json({
        success: false,
        error: 'Producto no encontrado'
      });
      return;
    }
    
    res.json({
      success: true,
      data: product,
      message: 'Producto actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor'
    });
  }
});

export default router;
