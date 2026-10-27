import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getCurrentWeatherAndForecast,
  getPestAlerts,
  createPestAlert,
  deletePestAlert,
} from '../controllers/weatherController.ts';
import { protect, authorize } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

// Public/User Weather Forecast
router.get(
  '/',
  [query('location').optional().isString().trim()],
  validateRequest,
  getCurrentWeatherAndForecast
);

// Pest Alert Routes
router.get('/alerts', getPestAlerts);

router.post(
  '/alerts',
  protect,
  authorize('admin'),
  [
    body('title').trim().notEmpty().withMessage('Alert title is required'),
    body('crop').trim().notEmpty().withMessage('Target crop is required'),
    body('pestName').trim().notEmpty().withMessage('Pest name is required'),
    body('severity')
      .isIn(['low', 'medium', 'high', 'critical'])
      .withMessage('Severity must be low, medium, high, or critical'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('advisory').trim().notEmpty().withMessage('Advisory guidance is required'),
  ],
  validateRequest,
  createPestAlert
);

router.delete(
  '/alerts/:id',
  protect,
  authorize('admin'),
  [param('id').notEmpty().withMessage('Alert ID is required')],
  validateRequest,
  deletePestAlert
);

export default router;
