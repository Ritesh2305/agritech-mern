import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getMyOrders,
  getAllOrders,
  getOrderById,
  placeOrder,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.ts';
import { protect, authorize } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

router
  .route('/')
  .get(protect, getMyOrders)
  .post(
    protect,
    [
      body('items')
        .isArray({ min: 1 })
        .withMessage('Order must contain at least one item'),
      body('deliveryAddress')
        .optional()
        .isString()
        .trim(),
    ],
    validateRequest,
    placeOrder
  );

router.get('/all', protect, authorize('admin'), getAllOrders);

router.get(
  '/:id',
  protect,
  [param('id').notEmpty().withMessage('Order ID is required')],
  validateRequest,
  getOrderById
);

router.put(
  '/:id/status',
  protect,
  authorize('admin'),
  [
    param('id').notEmpty().withMessage('Order ID is required'),
    body('status')
      .isIn(['pending', 'approved', 'shipped', 'delivered', 'rejected'])
      .withMessage('Invalid order status'),
  ],
  validateRequest,
  updateOrderStatus
);

router.put(
  '/:id/cancel',
  protect,
  [param('id').notEmpty().withMessage('Order ID is required')],
  validateRequest,
  cancelOrder
);

export default router;
