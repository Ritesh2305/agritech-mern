import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getConsultations,
  getConsultationById,
  bookConsultation,
  updateConsultation,
  cancelConsultation,
} from '../controllers/consultationController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

router
  .route('/')
  .get(protect, getConsultations)
  .post(
    protect,
    [
      body('expertName').trim().notEmpty().withMessage('Expert name is required'),
      body('topic').trim().notEmpty().withMessage('Consultation topic is required'),
      body('date').notEmpty().withMessage('Scheduled date is required'),
      body('timeSlot').trim().notEmpty().withMessage('Time slot is required'),
      body('query').optional().isString(),
    ],
    validateRequest,
    bookConsultation
  );

router
  .route('/:id')
  .get(
    protect,
    [param('id').notEmpty().withMessage('Consultation ID is required')],
    validateRequest,
    getConsultationById
  )
  .put(
    protect,
    [param('id').notEmpty().withMessage('Consultation ID is required')],
    validateRequest,
    updateConsultation
  );

router.put(
  '/:id/cancel',
  protect,
  [param('id').notEmpty().withMessage('Consultation ID is required')],
  validateRequest,
  cancelConsultation
);

export default router;
