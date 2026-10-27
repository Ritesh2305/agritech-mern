import { Response, NextFunction } from 'express';
import { Crop } from '../models/Crop.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { memoryStore } from '../state.ts';

// @desc    Get crops (filtered by farmId or user)
// @route   GET /api/v1/crops
export async function getCrops(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { farmId } = req.query;

    if (Crop.db?.readyState === 1) {
      const filter: any = {};
      if (req.user.role !== 'admin') filter.owner = req.user.id || req.user._id;
      if (farmId) filter.farm = farmId;
      const crops = await Crop.find(filter).populate('farm', 'name location');
      return res.json({ success: true, count: crops.length, data: crops });
    }

    let crops = memoryStore.crops;
    if (req.user.role !== 'admin') {
      crops = crops.filter((c: any) => c.ownerId === req.user.id || c.ownerId === req.user._id);
    }
    if (farmId) {
      crops = crops.filter((c: any) => c.farmId === farmId);
    }

    return res.json({ success: true, count: crops.length, data: crops });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single crop by ID
// @route   GET /api/v1/crops/:id
export async function getCropById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Crop.db?.readyState === 1) {
      const crop = await Crop.findById(id).populate('farm', 'name location');
      if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
      return res.json({ success: true, data: crop });
    }

    const crop = memoryStore.crops.find((c: any) => c.id === id);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

    return res.json({ success: true, data: crop });
  } catch (error) {
    next(error);
  }
}

// @desc    Register new crop planting
// @route   POST /api/v1/crops
export async function createCrop(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { farmId, name, variety, sowingDate, expectedHarvest, stage, status, plantedArea, expectedYield, notes } = req.body;

    if (Crop.db?.readyState === 1) {
      const crop = await Crop.create({
        farm: farmId,
        owner: req.user._id || req.user.id,
        name,
        variety: variety || 'Standard',
        sowingDate: new Date(sowingDate),
        expectedHarvest: new Date(expectedHarvest),
        stage: stage || 'Sowing',
        status: status || 'Healthy',
        plantedArea: Number(plantedArea) || 1,
        expectedYield: Number(expectedYield) || 20,
        notes: notes || '',
        healthScore: 88,
      });
      return res.status(201).json({ success: true, data: crop });
    }

    const newCrop = {
      id: `crop_${Date.now()}`,
      farmId: farmId || memoryStore.farms[0]?.id || 'farm_1',
      ownerId: req.user.id || req.user._id,
      name,
      variety: variety || 'Standard Hybrid',
      sowingDate,
      expectedHarvest,
      stage: stage || 'Sowing',
      status: status || 'Healthy',
      plantedArea: Number(plantedArea) || 1,
      expectedYield: Number(expectedYield) || 20,
      notes: notes || '',
      healthScore: 88,
      createdAt: new Date().toISOString(),
    };
    memoryStore.crops.push(newCrop);

    return res.status(201).json({ success: true, data: newCrop });
  } catch (error) {
    next(error);
  }
}

// @desc    Update crop stage, yield, health score, or notes
// @route   PUT /api/v1/crops/:id
export async function updateCrop(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, stage, status, actualYield, notes, healthScore } = req.body;

    if (Crop.db?.readyState === 1) {
      const crop = await Crop.findById(id);
      if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
      if (name) crop.name = name;
      if (stage) crop.stage = stage;
      if (status) crop.status = status;
      if (actualYield !== undefined) crop.actualYield = Number(actualYield);
      if (notes !== undefined) crop.notes = notes;
      if (healthScore !== undefined) crop.healthScore = Number(healthScore);
      await crop.save();
      return res.json({ success: true, data: crop });
    }

    const idx = memoryStore.crops.findIndex((c: any) => c.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Crop not found' });

    memoryStore.crops[idx] = {
      ...memoryStore.crops[idx],
      ...(name && { name }),
      ...(stage && { stage }),
      ...(status && { status }),
      ...(actualYield !== undefined && { actualYield: Number(actualYield) }),
      ...(notes !== undefined && { notes }),
      ...(healthScore !== undefined && { healthScore: Number(healthScore) }),
    };

    return res.json({ success: true, data: memoryStore.crops[idx] });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete crop record
// @route   DELETE /api/v1/crops/:id
export async function deleteCrop(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Crop.db?.readyState === 1) {
      const crop = await Crop.findById(id);
      if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });
      await crop.deleteOne();
      return res.json({ success: true, message: 'Crop record deleted' });
    }

    memoryStore.crops = memoryStore.crops.filter((c: any) => c.id !== id);
    return res.json({ success: true, message: 'Crop record deleted' });
  } catch (error) {
    next(error);
  }
}
