import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { dataService } from './services/data.service';
import { cheapSharkService } from './services/cheapshark.service';
import { ProductCategoryEnum } from './models/types';

// Routes
import authRoutes from './routes/auth.routes';
import productsRoutes from './routes/products.routes';
import cartRoutes from './routes/cart.routes';
import ordersRoutes from './routes/orders.routes';
import usersRoutes from './routes/users.routes';
import cheapsharkRoutes from './routes/cheapshark.routes';

// Configuración
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';

// ===================================
// MIDDLEWARES
// ===================================

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger middleware
app.use((req: Request, res: Response, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ===================================
// ROUTES
// ===================================

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'ShikenShop Backend API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      products: '/api/products',
      cart: '/api/cart',
      orders: '/api/orders',
      users: '/api/users',
      cheapshark: '/api/cheapshark'
    }
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/cheapshark', cheapsharkRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint no encontrado'
  });
});

// ===================================
// INICIALIZACIÓN Y SERVIDOR
// ===================================

async function startServer() {
  try {
    console.log('🚀 Iniciando ShikenShop Backend...\n');
    
    // Inicializar datos
    await dataService.initialize();
    
    // Importar productos de CheapShark al inicio (opcional)
    const IMPORT_CHEAPSHARK = process.env.IMPORT_CHEAPSHARK === 'true';
    if (IMPORT_CHEAPSHARK) {
      console.log('🎮 Importando productos de CheapShark...');
      try {
        await cheapSharkService.importGames('mario', ProductCategoryEnum.AVENTURA, 10);
      } catch (error) {
        console.warn('⚠️ No se pudieron importar productos de CheapShark:', error);
      }
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`\n✨ Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📡 CORS habilitado para: ${CORS_ORIGIN}`);
      console.log(`\n🎯 Endpoints disponibles:`);
      console.log(`   POST   /api/auth/login`);
      console.log(`   POST   /api/auth/register`);
      console.log(`   GET    /api/products`);
      console.log(`   GET    /api/products/:id`);
      console.log(`   GET    /api/products/featured`);
      console.log(`   GET    /api/cart/:userId`);
      console.log(`   POST   /api/cart/:userId/add`);
      console.log(`   GET    /api/orders`);
      console.log(`   POST   /api/orders`);
      console.log(`   GET    /api/users`);
      console.log(`   GET    /api/cheapshark/search`);
      console.log(`   POST   /api/cheapshark/import`);
      console.log(`\n`);
    });
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer();
