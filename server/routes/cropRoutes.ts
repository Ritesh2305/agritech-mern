import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
} from '../controllers/cropController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

router
  .route('/')
  .get(protect, getCrops)
  .post(
    protect,
    [
      body('farm').notEmpty().withMessage('Farm reference ID is required'),
      body('name').trim().notEmpty().withMessage('Crop name is required'),
      body('sowingDate').optional().isISO8601().withMessage('Sowing date must be a valid date'),
      body('yield').optional().isNumeric().withMessage('Yield must be a number'),
    ],
    validateRequest,
    createCrop
  );

router
  .route('/:id')
  .get(
    protect,
    [param('id').notEmpty().withMessage('Crop ID is required')],
    validateRequest,
    getCropById
  )
  .put(
    protect,
    [param('id').notEmpty().withMessage('Crop ID is required')],
    validateRequest,
    updateCrop
  )
  .delete(
    protect,
    [param('id').notEmpty().withMessage('Crop ID is required')],
    validateRequest,
    deleteCrop
  );

export default router;
