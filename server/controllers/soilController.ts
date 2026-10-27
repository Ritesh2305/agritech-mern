import { Response, NextFunction } from 'express';
import { SoilTest } from '../models/SoilTest.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { analyzeSoilHealth } from '../../shared/soilRecommendation.ts';
import { memoryStore } from '../state.ts';

// @desc    Get past soil tests
// @route   GET /api/v1/soil
export async function getSoilTests(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { farmId } = req.query;

    if (SoilTest.db?.readyState === 1) {
      const filter: any = {};
      if (req.user.role !== 'admin') filter.owner = req.user.id || req.user._id;
      if (farmId) filter.farm = farmId;
      const tests = await SoilTest.find(filter).sort({ testedAt: -1 }).populate('farm', 'name location');
      return res.json({ success: true, count: tests.length, data: tests });
    }

    let tests = memoryStore.soilTests;
    if (req.user.role !== 'admin') {
      tests = tests.filter((t: any) => t.ownerId === req.user.id || t.ownerId === req.user._id);
    }
    if (farmId) {
      tests = tests.filter((t: any) => t.farmId === farmId);
    }

    return res.json({ success: true, count: tests.length, data: tests });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single soil test by ID
// @route   GET /api/v1/soil/:id
export async function getSoilTestById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (SoilTest.db?.readyState === 1) {
      const test = await SoilTest.findById(id).populate('farm', 'name location');
      if (!test) return res.status(404).json({ success: false, message: 'Soil test not found' });
      return res.json({ success: true, data: test });
    }

    const test = memoryStore.soilTests.find((t: any) => t.id === id);
    if (!test) return res.status(404).json({ success: false, message: 'Soil test not found' });

    return res.json({ success: true, data: test });
  } catch (error) {
    next(error);
  }
}

// @desc    Analyze soil sample and save diagnostic record
// @route   POST /api/v1/soil/analyze
export async function analyzeSoilHealthAndSave(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { farmId, nitrogen, phosphorus, potassium, ph, moisture, organicCarbon, cropName } = req.body;

    const n = Number(nitrogen) || 240;
    const p = Number(phosphorus) || 35;
    const k = Number(potassium) || 180;
    const soilPh = Number(ph) || 6.8;
    const m = Number(moisture) || 50;
    const oc = Number(organicCarbon) || 0.65;

    // Run scientific agronomy diagnosis
    const diagnosis = analyzeSoilHealth(n, p, k, soilPh, m, cropName);

    if (SoilTest.db?.readyState === 1 && farmId) {
      const newTest = await SoilTest.create({
        farm: farmId,
        owner: req.user._id || req.user.id,
        nitrogen: n,
        phosphorus: p,
        potassium: k,
        ph: soilPh,
        moisture: m,
        organicCarbon: oc,
        status: diagnosis.status,
        recommendations: diagnosis.recommendations,
        testedAt: new Date(),
      });
      return res.status(201).json({ success: true, data: newTest, diagnosis });
    }

    const testRecord = {
      id: `soil_${Date.now()}`,
      farmId: farmId || memoryStore.farms[0]?.id || 'farm_1',
      ownerId: req.user.id || req.user._id,
      nitrogen: n,
      phosphorus: p,
      potassium: k,
      ph: soilPh,
      moisture: m,
      organicCarbon: oc,
      status: diagnosis.status,
      recommendations: diagnosis.recommendations,
      testedAt: new Date().toISOString(),
    };
    memoryStore.soilTests.unshift(testRecord);

    return res.status(201).json({
      success: true,
      data: testRecord,
      diagnosis,
    });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete soil test
// @route   DELETE /api/v1/soil/:id
export async function deleteSoilTest(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (SoilTest.db?.readyState === 1) {
      const test = await SoilTest.findById(id);
      if (!test) return res.status(404).json({ success: false, message: 'Soil test not found' });
      await test.deleteOne();
      return res.json({ success: true, message: 'Soil test deleted' });
    }

    memoryStore.soilTests = memoryStore.soilTests.filter((t: any) => t.id !== id);
    return res.json({ success: true, message: 'Soil test deleted' });
  } catch (error) {
    next(error);
  }
}
