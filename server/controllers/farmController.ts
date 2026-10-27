import { Response, NextFunction } from 'express';
import { Farm } from '../models/Farm.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { memoryStore } from '../state.ts';

// @desc    Get user farms (or all if admin)
// @route   GET /api/v1/farms
export async function getFarms(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (Farm.db?.readyState === 1) {
      const query = req.user.role === 'admin' ? {} : { owner: req.user._id || req.user.id };
      const farms = await Farm.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: farms.length, data: farms });
    }

    const farms =
      req.user.role === 'admin'
        ? memoryStore.farms
        : memoryStore.farms.filter((f: any) => f.ownerId === req.user.id || f.ownerId === req.user._id);

    return res.json({ success: true, count: farms.length, data: farms });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single farm by ID
// @route   GET /api/v1/farms/:id
export async function getFarmById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Farm.db?.readyState === 1) {
      const farm = await Farm.findById(id);
      if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
      return res.json({ success: true, data: farm });
    }

    const farm = memoryStore.farms.find((f: any) => f.id === id);
    if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });

    return res.json({ success: true, data: farm });
  } catch (error) {
    next(error);
  }
}

// @desc    Create new farm
// @route   POST /api/v1/farms
export async function createFarm(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, location, area, areaUnit, soilType, irrigationType } = req.body;

    if (Farm.db?.readyState === 1) {
      const farm = await Farm.create({
        owner: req.user._id || req.user.id,
        name,
        location,
        area: Number(area),
        areaUnit: areaUnit || 'acres',
        soilType: soilType || 'Loamy',
        irrigationType: irrigationType || 'Drip',
      });
      return res.status(201).json({ success: true, data: farm });
    }

    const newFarm = {
      id: `farm_${Date.now()}`,
      ownerId: req.user.id || req.user._id,
      name,
      location,
      area: Number(area),
      areaUnit: areaUnit || 'acres',
      soilType: soilType || 'Loamy',
      irrigationType: irrigationType || 'Drip',
      coordinates: { lat: 17.5, lng: 78.5 },
      createdAt: new Date().toISOString(),
    };
    memoryStore.farms.push(newFarm);

    return res.status(201).json({ success: true, data: newFarm });
  } catch (error) {
    next(error);
  }
}

// @desc    Update farm
// @route   PUT /api/v1/farms/:id
export async function updateFarm(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { name, location, area, areaUnit, soilType, irrigationType } = req.body;

    if (Farm.db?.readyState === 1) {
      const farm = await Farm.findById(id);
      if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
      if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to edit this farm' });
      }

      farm.name = name || farm.name;
      farm.location = location || farm.location;
      farm.area = area !== undefined ? Number(area) : farm.area;
      farm.areaUnit = areaUnit || farm.areaUnit;
      farm.soilType = soilType || farm.soilType;
      farm.irrigationType = irrigationType || farm.irrigationType;
      await farm.save();
      return res.json({ success: true, data: farm });
    }

    const farmIndex = memoryStore.farms.findIndex((f: any) => f.id === id);
    if (farmIndex === -1) return res.status(404).json({ success: false, message: 'Farm not found' });

    memoryStore.farms[farmIndex] = {
      ...memoryStore.farms[farmIndex],
      ...(name && { name }),
      ...(location && { location }),
      ...(area !== undefined && { area: Number(area) }),
      ...(areaUnit && { areaUnit }),
      ...(soilType && { soilType }),
      ...(irrigationType && { irrigationType }),
    };

    return res.json({ success: true, data: memoryStore.farms[farmIndex] });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete farm
// @route   DELETE /api/v1/farms/:id
export async function deleteFarm(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Farm.db?.readyState === 1) {
      const farm = await Farm.findById(id);
      if (!farm) return res.status(404).json({ success: false, message: 'Farm not found' });
      if (farm.owner.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this farm' });
      }
      await farm.deleteOne();
      return res.json({ success: true, message: 'Farm deleted successfully' });
    }

    memoryStore.farms = memoryStore.farms.filter((f: any) => f.id !== id);
    return res.json({ success: true, message: 'Farm deleted successfully' });
  } catch (error) {
    next(error);
  }
}
