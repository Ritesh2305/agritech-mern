import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

import { connectDB } from './server/config/db.ts';
import authRoutes from './server/routes/authRoutes.ts';
import farmRoutes from './server/routes/farmRoutes.ts';
import cropRoutes from './server/routes/cropRoutes.ts';
import soilRoutes from './server/routes/soilRoutes.ts';
import weatherRoutes from './server/routes/weatherRoutes.ts';
import resourceRoutes from './server/routes/resourceRoutes.ts';
import orderRoutes from './server/routes/orderRoutes.ts';
import consultationRoutes from './server/routes/consultationRoutes.ts';
import forumRoutes from './server/routes/forumRoutes.ts';
import adminRoutes from './server/routes/adminRoutes.ts';
import reportRoutes from './server/routes/reportRoutes.ts';
import postmanRoutes from './server/routes/postmanRoutes.ts';
import seedRoutes from './server/routes/seedRoutes.ts';
import { errorHandler } from './server/middleware/errorMiddleware.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Middlewares
  app.use(cors());
  app.use(express.json());

  // Connect to DB (with resilient fallback)
  await connectDB();

  // API v1 Routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/farms', farmRoutes);
  app.use('/api/v1/crops', cropRoutes);
  app.use('/api/v1/soil', soilRoutes);
  app.use('/api/v1/weather', weatherRoutes);
  app.use('/api/v1/resources', resourceRoutes);
  app.use('/api/v1/orders', orderRoutes);
  app.use('/api/v1/consultations', consultationRoutes);
  app.use('/api/v1/forum', forumRoutes);
  app.use('/api/v1/admin', adminRoutes);
  app.use('/api/v1/reports', reportRoutes);
  app.use('/api/v1/postman', postmanRoutes);
  app.use('/api/v1/seed', seedRoutes);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'AgriTech Smart Farming Management System',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    });
  });

  // Global Error Handler
  app.use(errorHandler);

  // Vite Integration in Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static frontend in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AgriTech Server] Running on http://0.0.0.0:${PORT}`);
    console.log(`[AgriTech Server] REST API documentation available at /api/v1/postman`);
  });
}

startServer().catch(err => {
  console.error('[AgriTech Fatal Error]:', err);
});
