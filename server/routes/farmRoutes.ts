import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getFarms,
  getFarmById,
  createFarm,
  updateFarm,
  deleteFarm,
} from '../controllers/farmController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

router
  .route('/')
  .get(protect, getFarms)
  .post(
    protect,
    [
      body('name').trim().notEmpty().withMessage('Farm name is required'),
      body('location').trim().notEmpty().withMessage('Location is required'),
      body('area').isNumeric().withMessage('Area must be a number in acres'),
      body('soilType').optional().isString(),
      body('irrigationType').optional().isString(),
    ],
    validateRequest,
    createFarm
  );

router
  .route('/:id')
  .get(
    protect,
    [param('id').notEmpty().withMessage('Farm ID is required')],
    validateRequest,
    getFarmById
  )
  .put(
    protect,
    [param('id').notEmpty().withMessage('Farm ID is required')],
    validateRequest,
    updateFarm
  )
  .delete(
    protect,
    [param('id').notEmpty().withMessage('Farm ID is required')],
    validateRequest,
    deleteFarm
  );

export default router;
