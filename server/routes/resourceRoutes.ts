import { Router } from 'express';
import { body, param, query } from 'express-validator';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  approveResource,
  deleteResource,
} from '../controllers/resourceController.ts';
import { protect, authorize } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

router
  .route('/')
  .get(
    [
      query('category').optional().isString(),
      query('search').optional().isString(),
    ],
    validateRequest,
    getResources
  )
  .post(
    protect,
    authorize('admin'),
    [
      body('name').trim().notEmpty().withMessage('Resource name is required'),
      body('category')
        .isIn(['seeds', 'fertilizers', 'pesticides', 'tools', 'equipment'])
        .withMessage('Invalid category'),
      body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
      body('stock').isInt({ min: 0 }).withMessage('Stock must be an integer >= 0'),
      body('unit').trim().notEmpty().withMessage('Unit of measurement is required'),
    ],
    validateRequest,
    createResource
  );

router
  .route('/:id')
  .get(
    [param('id').notEmpty().withMessage('Resource ID is required')],
    validateRequest,
    getResourceById
  )
  .put(
    protect,
    authorize('admin'),
    [param('id').notEmpty().withMessage('Resource ID is required')],
    validateRequest,
    updateResource
  )
  .delete(
    protect,
    authorize('admin'),
    [param('id').notEmpty().withMessage('Resource ID is required')],
    validateRequest,
    deleteResource
  );

router.put(
  '/:id/approve',
  protect,
  authorize('admin'),
  [param('id').notEmpty().withMessage('Resource ID is required')],
  validateRequest,
  approveResource
);

export default router;
