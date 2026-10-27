import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getSystemStats,
  getUsers,
  updateUserRole,
  deleteUser,
  getActivityLogs,
} from '../controllers/adminController.ts';
import { protect, authorize } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

// Restrict all admin endpoints to authenticated users with 'admin' role
router.use(protect, authorize('admin'));

router.get('/stats', getSystemStats);

router.get('/users', getUsers);

router.put(
  '/users/:id/role',
  [
    param('id').notEmpty().withMessage('User ID is required'),
    body('role')
      .isIn(['farmer', 'admin', 'expert'])
      .withMessage('Role must be farmer, admin, or expert'),
  ],
  validateRequest,
  updateUserRole
);

router.delete(
  '/users/:id',
  [param('id').notEmpty().withMessage('User ID is required')],
  validateRequest,
  deleteUser
);

router.get('/logs', getActivityLogs);

export default router;
