import { Request, Response, NextFunction } from 'express';
import { fetchWeatherForLocation } from '../services/weatherService.ts';
import { Alert } from '../models/Alert.ts';
import { AuthRequest } from '../middleware/authMiddleware.ts';
import { memoryStore } from '../state.ts';

// @desc    Get current agro-weather and 5-day forecast
// @route   GET /api/v1/weather
export async function getCurrentWeatherAndForecast(req: Request, res: Response, next: NextFunction) {
  try {
    const location = (req.query.location as string) || 'Hyderabad, Telangana';
    const report = await fetchWeatherForLocation(location);
    return res.json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
}

// @desc    Get active pest and biological outbreak alerts
// @route   GET /api/v1/weather/alerts
export async function getPestAlerts(_req: Request, res: Response, next: NextFunction) {
  try {
    if (Alert.db?.readyState === 1) {
      const alerts = await Alert.find({ active: true }).sort({ issuedAt: -1 });
      return res.json({ success: true, count: alerts.length, data: alerts });
    }
    const alerts = memoryStore.alerts.filter((a: any) => a.active);
    return res.json({ success: true, count: alerts.length, data: alerts });
  } catch (error) {
    next(error);
  }
}

// @desc    Broadcast new pest outbreak alert (Admin only)
// @route   POST /api/v1/weather/alerts
export async function createPestAlert(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { title, description, severity, pestOrDisease, affectedCrops, region, recommendedAction, organicRemedy } = req.body;

    if (Alert.db?.readyState === 1) {
      const alert = await Alert.create({
        title,
        description,
        severity: severity || 'medium',
        pestOrDisease,
        affectedCrops: Array.isArray(affectedCrops) ? affectedCrops : [affectedCrops],
        region: region || 'All Agricultural Districts',
        recommendedAction,
        organicRemedy: organicRemedy || 'Neem oil 10,000 PPM spray.',
        active: true,
      });
      return res.status(201).json({ success: true, data: alert });
    }

    const newAlert = {
      id: `alt_${Date.now()}`,
      title,
      description,
      severity: severity || 'medium',
      pestOrDisease,
      affectedCrops: Array.isArray(affectedCrops) ? affectedCrops : [affectedCrops],
      region: region || 'All Agricultural Districts',
      recommendedAction,
      organicRemedy: organicRemedy || 'Neem oil 10,000 PPM spray.',
      active: true,
      issuedAt: new Date().toISOString(),
    };
    memoryStore.alerts.unshift(newAlert);

    return res.status(201).json({ success: true, data: newAlert });
  } catch (error) {
    next(error);
  }
}

// @desc    Dismiss / delete pest alert (Admin only)
// @route   DELETE /api/v1/weather/alerts/:id
export async function deletePestAlert(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;

    if (Alert.db?.readyState === 1) {
      const alert = await Alert.findById(id);
      if (!alert) return res.status(404).json({ success: false, message: 'Alert not found' });
      await alert.deleteOne();
      return res.json({ success: true, message: 'Alert removed' });
    }

    memoryStore.alerts = memoryStore.alerts.filter((a: any) => a.id !== id);
    return res.json({ success: true, message: 'Alert removed' });
  } catch (error) {
    next(error);
  }
}
