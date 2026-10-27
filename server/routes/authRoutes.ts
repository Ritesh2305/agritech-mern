import { Router } from 'express';
import { body } from 'express-validator';
import {
  register,
  login,
  getMe,
  logout,
  demoLogin,
} from '../controllers/authController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please include a valid email address'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters long'),
    body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number format'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  validateRequest,
  login
);

router.get('/me', protect, getMe);

router.post('/logout', logout);

router.post('/demo', demoLogin);

export default router;
