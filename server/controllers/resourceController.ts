import { Request, Response, NextFunction } from 'express';
import { Resource } from '../models/Resource.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { memoryStore } from '../state.ts';

// @desc    Get agricultural inputs catalog (seeds, fertilizers, tools)
// @route   GET /api/v1/resources
export async function getResources(req: Request, res: Response, next: NextFunction) {
  try {
    const { category, search } = req.query;

    if (Resource.db?.readyState === 1) {
      const filter: any = {};
      if (category && category !== 'All') filter.category = category;
      if (search) filter.name = { $regex: search, $options: 'i' };

      const resources = await Resource.find(filter).sort({ rating: -1 });
      return res.json({ success: true, count: resources.length, data: resources });
    }

    let items = memoryStore.resources;
    if (category && category !== 'All') {
      items = items.filter((r: any) => r.category === category);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      items = items.filter(
        (r: any) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
      );
    }

    return res.json({ success: true, count: items.length, data: items });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single resource by ID
// @route   GET /api/v1/resources/:id
export async function getResourceById(req: Request, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Resource.db?.readyState === 1) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
      return res.json({ success: true, data: resource });
    }

    const item = memoryStore.resources.find((r: any) => r.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Resource not found' });

    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

// @desc    Create new agricultural input / resource (Admin only)
// @route   POST /api/v1/resources
export async function createResource(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { name, category, description, price, unit, stock, manufacturer, imageUrl, subsidyEligible } = req.body;

    if (Resource.db?.readyState === 1) {
      const resource = await Resource.create({
        name,
        category,
        description: description || '',
        price: Number(price),
        unit: unit || 'kg',
        stock: Number(stock) || 50,
        manufacturer: manufacturer || 'AgriTech Certified',
        imageUrl: imageUrl || '',
        subsidyEligible: subsidyEligible !== false,
      });
      return res.status(201).json({ success: true, data: resource });
    }

    const newRes = {
      id: `res_${Date.now()}`,
      name,
      category,
      description: description || '',
      price: Number(price),
      unit: unit || 'kg',
      stock: Number(stock) || 50,
      rating: 4.8,
      manufacturer: manufacturer || 'AgriTech Certified',
      imageUrl: imageUrl || '/src/assets/images/organic_seeds_resources_1793110538678.jpg',
      subsidyEligible: subsidyEligible !== false,
    };
    memoryStore.resources.unshift(newRes);

    return res.status(201).json({ success: true, data: newRes });
  } catch (error) {
    next(error);
  }
}

// @desc    Update resource details & inventory (Admin only)
// @route   PUT /api/v1/resources/:id
export async function updateResource(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { price, stock, description } = req.body;

    if (Resource.db?.readyState === 1) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
      if (price !== undefined) resource.price = Number(price);
      if (stock !== undefined) resource.stock = Number(stock);
      if (description !== undefined) resource.description = description;
      await resource.save();
      return res.json({ success: true, data: resource });
    }

    const idx = memoryStore.resources.findIndex((r: any) => r.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Resource not found' });

    memoryStore.resources[idx] = {
      ...memoryStore.resources[idx],
      ...(price !== undefined && { price: Number(price) }),
      ...(stock !== undefined && { stock: Number(stock) }),
      ...(description !== undefined && { description }),
    };

    return res.json({ success: true, data: memoryStore.resources[idx] });
  } catch (error) {
    next(error);
  }
}

// @desc    Approve resource / mark subsidy verified (Admin only)
// @route   PATCH /api/v1/resources/:id/approve
export async function approveResource(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Resource.db?.readyState === 1) {
      const resource = await Resource.findById(id);
      if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
      resource.subsidyEligible = true;
      await resource.save();
      return res.json({ success: true, message: 'Resource approved for government subsidy', data: resource });
    }

    const item = memoryStore.resources.find((r: any) => r.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Resource not found' });

    item.subsidyEligible = true;
    return res.json({ success: true, message: 'Resource approved for government subsidy', data: item });
  } catch (error) {
    next(error);
  }
}

// @desc    Delete resource from catalog (Admin only)
// @route   DELETE /api/v1/resources/:id
export async function deleteResource(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Resource.db?.readyState === 1) {
      await Resource.findByIdAndDelete(id);
      return res.json({ success: true, message: 'Resource removed from catalog' });
    }

    memoryStore.resources = memoryStore.resources.filter((r: any) => r.id !== id);
    return res.json({ success: true, message: 'Resource removed from catalog' });
  } catch (error) {
    next(error);
  }
}
