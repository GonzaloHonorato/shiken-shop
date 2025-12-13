import { Router, Request, Response } from 'express';
import { cheapSharkService } from '../services/cheapshark.service';
import { ProductCategoryEnum } from '../models/types';

const router = Router();

/**
 * GET /api/cheapshark/search
 * Buscar juegos en CheapShark
 */
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      res.status(400).json({
        success: false,
        error: 'Parámetro de búsqueda "q" es requerido'
      });
      return;
    }
    
    const games = await cheapSharkService.searchGames(q);
    
    res.json({
      success: true,
      data: games,
      total: games.length
    });
  } catch (error) {
    console.error('Error buscando en CheapShark:', error);
    res.status(500).json({
      success: false,
      error: 'Error consultando API de CheapShark'
    });
  }
});

/**
 * POST /api/cheapshark/import
 * Importar juegos de CheapShark al catálogo
 */
router.post('/import', async (req: Request, res: Response) => {
  try {
    const { searchTerm, category = ProductCategoryEnum.AVENTURA, limit = 20 } = req.body;
    
    if (!searchTerm) {
      res.status(400).json({
        success: false,
        error: 'searchTerm es requerido'
      });
      return;
    }
    
    const products = await cheapSharkService.importGames(searchTerm, category, limit);
    
    res.json({
      success: true,
      data: products,
      total: products.length,
      message: `${products.length} productos importados exitosamente`
    });
  } catch (error) {
    console.error('Error importando de CheapShark:', error);
    res.status(500).json({
      success: false,
      error: 'Error importando juegos de CheapShark'
    });
  }
});

export default router;
