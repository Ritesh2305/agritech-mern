import { Response, NextFunction } from 'express';
import { Consultation } from '../models/Consultation.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { memoryStore } from '../state.ts';

// @desc    Get consultations (user specific or all for admin)
// @route   GET /api/v1/consultations
export async function getConsultations(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (Consultation.db?.readyState === 1) {
      const query = req.user.role === 'admin' ? {} : { farmer: req.user._id || req.user.id };
      const list = await Consultation.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, count: list.length, data: list });
    }

    const list =
      req.user.role === 'admin'
        ? memoryStore.consultations
        : memoryStore.consultations.filter(
            (c: any) => c.farmerId === req.user.id || c.farmerId === req.user._id
          );

    return res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    next(error);
  }
}

// @desc    Get single consultation by ID
// @route   GET /api/v1/consultations/:id
export async function getConsultationById(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Consultation.db?.readyState === 1) {
      const item = await Consultation.findById(id);
      if (!item) return res.status(404).json({ success: false, message: 'Consultation not found' });
      return res.json({ success: true, data: item });
    }

    const item = memoryStore.consultations.find((c: any) => c.id === id);
    if (!item) return res.status(404).json({ success: false, message: 'Consultation not found' });

    return res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
}

// @desc    Book agronomist consultation
// @route   POST /api/v1/consultations
export async function bookConsultation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { expertName, expertRole, date, timeSlot, cropAffected, topic, description, urgency } = req.body;

    if (Consultation.db?.readyState === 1) {
      const item = await Consultation.create({
        farmer: req.user._id || req.user.id,
        farmerName: req.user.name || 'Farmer',
        expertName,
        expertRole: expertRole || 'Agronomist & Soil Specialist',
        date,
        timeSlot: timeSlot || '10:00 AM - 10:30 AM',
        cropAffected: cropAffected || 'General Crop',
        topic,
        description,
        status: 'scheduled',
        urgency: urgency || 'Routine',
      });
      return res.status(201).json({ success: true, data: item });
    }

    const newItem = {
      id: `cons_${Date.now()}`,
      farmerId: req.user.id || req.user._id,
      farmerName: req.user.name || 'Farmer',
      expertName,
      expertRole: expertRole || 'Agronomist & Soil Specialist',
      date,
      timeSlot: timeSlot || '10:00 AM - 10:30 AM',
      cropAffected: cropAffected || 'General Crop',
      topic,
      description,
      status: 'scheduled',
      expertPrescription: '',
      urgency: urgency || 'Routine',
      createdAt: new Date().toISOString(),
    };
    memoryStore.consultations.unshift(newItem);

    return res.status(201).json({ success: true, data: newItem });
  } catch (error) {
    next(error);
  }
}

// @desc    Update consultation status or add prescription
// @route   PATCH /api/v1/consultations/:id
export async function updateConsultation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { status, expertPrescription } = req.body;

    if (Consultation.db?.readyState === 1) {
      const item = await Consultation.findById(id);
      if (!item) return res.status(404).json({ success: false, message: 'Consultation not found' });
      if (status) item.status = status;
      if (expertPrescription !== undefined) item.expertPrescription = expertPrescription;
      await item.save();
      return res.json({ success: true, data: item });
    }

    const idx = memoryStore.consultations.findIndex((c: any) => c.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Consultation not found' });

    memoryStore.consultations[idx] = {
      ...memoryStore.consultations[idx],
      ...(status && { status }),
      ...(expertPrescription !== undefined && { expertPrescription }),
    };

    return res.json({ success: true, data: memoryStore.consultations[idx] });
  } catch (error) {
    next(error);
  }
}

// @desc    Cancel consultation
// @route   DELETE /api/v1/consultations/:id
export async function cancelConsultation(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Consultation.db?.readyState === 1) {
      const item = await Consultation.findById(id);
      if (!item) return res.status(404).json({ success: false, message: 'Consultation not found' });
      item.status = 'cancelled';
      await item.save();
      return res.json({ success: true, message: 'Consultation cancelled' });
    }

    const idx = memoryStore.consultations.findIndex((c: any) => c.id === id);
    if (idx === -1) return res.status(404).json({ success: false, message: 'Consultation not found' });

    memoryStore.consultations[idx].status = 'cancelled';
    return res.json({ success: true, message: 'Consultation cancelled' });
  } catch (error) {
    next(error);
  }
}
