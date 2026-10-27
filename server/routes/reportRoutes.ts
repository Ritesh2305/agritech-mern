import { Router } from 'express';
import { param } from 'express-validator';
import { exportFarmReportCSV, exportFarmReportSummary } from '../controllers/reportController.ts';
import { protect } from '../middleware/authMiddleware.ts';
import { validateRequest } from '../middleware/validateMiddleware.ts';

const router = Router();

// Protected report generation routes
router.get(
  '/farms/:farmId/csv',
  protect,
  [param('farmId').notEmpty().withMessage('Farm ID is required')],
  validateRequest,
  exportFarmReportCSV
);

router.get(
  '/farms/:farmId/summary',
  protect,
  [param('farmId').notEmpty().withMessage('Farm ID is required')],
  validateRequest,
  exportFarmReportSummary
);

export default router;
