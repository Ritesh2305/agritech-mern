import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getSoilTests,
  getSoilTestById,
  analyzeSoilHealthAndSave,
  deleteSoilTest,
} from '../controllers/soilController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

router.get('/', protect, getSoilTests);

router.post(
  '/analyze',
  protect,
  [
    body('farm').notEmpty().withMessage('Farm ID is required'),
    body('ph')
      .isFloat({ min: 0, max: 14 })
      .withMessage('Soil pH must be between 0 and 14'),
    body('nitrogen')
      .isFloat({ min: 0 })
      .withMessage('Nitrogen value must be non-negative'),
    body('phosphorus')
      .isFloat({ min: 0 })
      .withMessage('Phosphorus value must be non-negative'),
    body('potassium')
      .isFloat({ min: 0 })
      .withMessage('Potassium value must be non-negative'),
    body('moisture')
      .optional()
      .isFloat({ min: 0, max: 100 })
      .withMessage('Moisture must be between 0% and 100%'),
  ],
  validateRequest,
  analyzeSoilHealthAndSave
);

router
  .route('/:id')
  .get(
    protect,
    [param('id').notEmpty().withMessage('Soil test ID is required')],
    validateRequest,
    getSoilTestById
  )
  .delete(
    protect,
    [param('id').notEmpty().withMessage('Soil test ID is required')],
    validateRequest,
    deleteSoilTest
  );

export default router;
