import { Router, Request, Response } from 'express';
import { seedDatabase } from '../seed.ts';
import { memoryStore } from '../state.ts';

const router = Router();

// POST /api/v1/seed
router.post('/', async (_req: Request, res: Response) => {
  try {
    memoryStore.reset();
    const result = await seedDatabase();
    res.json({
      success: true,
      message: result.message,
      counts: result.counts,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
