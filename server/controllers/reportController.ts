import { Response, NextFunction } from 'express';
import { FarmModel, CropModel, SoilTestModel, isMongoConnected } from '../models/index.ts';
import { fallbackStore } from '../state.ts';

// @desc    Export farm data report as CSV
// @route   GET /api/v1/reports/farms/:farmId/csv
// @access  Private
export const exportFarmReportCSV = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { farmId } = req.params;
    const userId = req.user?.id || req.user?._id;
    const role = req.user?.role;

    let farm: any;
    let crops: any[] = [];
    let soilTests: any[] = [];

    if (isMongoConnected()) {
      farm = await FarmModel.findById(farmId);
      if (!farm) {
        res.status(404).json({ success: false, message: 'Farm not found' });
        return;
      }
      if (role !== 'admin' && farm.owner.toString() !== userId.toString()) {
        res.status(403).json({ success: false, message: 'Not authorized to access this farm report' });
        return;
      }
      crops = await CropModel.find({ farm: farmId });
      soilTests = await SoilTestModel.find({ farm: farmId });
    } else {
      farm = fallbackStore.farms.find((f: any) => f._id === farmId || f.id === farmId);
      if (!farm) {
        res.status(404).json({ success: false, message: 'Farm not found' });
        return;
      }
      const ownerId = farm.owner?._id || farm.owner?.id || farm.owner;
      if (role !== 'admin' && ownerId !== userId) {
        res.status(403).json({ success: false, message: 'Not authorized to access this farm report' });
        return;
      }
      crops = fallbackStore.crops.filter((c: any) => {
        const cFarmId = c.farm?._id || c.farm?.id || c.farm;
        return cFarmId === farmId;
      });
      soilTests = fallbackStore.soilTests.filter((s: any) => {
        const sFarmId = s.farm?._id || s.farm?.id || s.farm;
        return sFarmId === farmId;
      });
    }

    // Build CSV content
    const csvRows: string[] = [];
    csvRows.push('--- AGRI-TECH FARM REPORT ---');
    csvRows.push(`Farm Name,${farm.name}`);
    csvRows.push(`Location,${farm.location}`);
    csvRows.push(`Area (Acres),${farm.area}`);
    csvRows.push(`Soil Type,${farm.soilType}`);
    csvRows.push(`Irrigation Type,${farm.irrigationType}`);
    csvRows.push(`Generated Date,${new Date().toISOString()}`);
    csvRows.push('');

    csvRows.push('--- CROPS SUMMARY ---');
    csvRows.push('Crop Name,Variety,Sowing Date,Expected Harvest,Status,Yield (kg),Health Rating');
    crops.forEach((c: any) => {
      csvRows.push(`"${c.name}","${c.variety || ''}","${c.sowingDate || ''}","${c.expectedHarvest || ''}","${c.status || ''}","${c.yield || 0}","${c.healthScore || 'Good'}"`);
    });
    csvRows.push('');

    csvRows.push('--- SOIL HEALTH TESTS ---');
    csvRows.push('Test Date,pH,Nitrogen (N),Phosphorus (P),Potassium (K),Moisture (%),Organic Matter (%),Overall Health');
    soilTests.forEach((s: any) => {
      csvRows.push(`"${s.createdAt ? new Date(s.createdAt).toLocaleDateString() : 'N/A'}",${s.ph},${s.nitrogen},${s.phosphorus},${s.potassium},${s.moisture || 'N/A'},${s.organicMatter || 'N/A'},"${s.overallHealth || 'N/A'}"`);
    });

    const csvContent = csvRows.join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="AgriTech_Farm_${farm.name.replace(/\s+/g, '_')}_Report.csv"`);
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Export complete farm report in printable structured JSON format
// @route   GET /api/v1/reports/farms/:farmId/summary
// @access  Private
export const exportFarmReportSummary = async (req: any, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { farmId } = req.params;
    const userId = req.user?.id || req.user?._id;
    const role = req.user?.role;

    let farm: any;
    let crops: any[] = [];
    let soilTests: any[] = [];

    if (isMongoConnected()) {
      farm = await FarmModel.findById(farmId);
      if (!farm) {
        res.status(404).json({ success: false, message: 'Farm not found' });
        return;
      }
      if (role !== 'admin' && farm.owner.toString() !== userId.toString()) {
        res.status(403).json({ success: false, message: 'Not authorized to access this farm report' });
        return;
      }
      crops = await CropModel.find({ farm: farmId });
      soilTests = await SoilTestModel.find({ farm: farmId }).sort({ createdAt: -1 });
    } else {
      farm = fallbackStore.farms.find((f: any) => f._id === farmId || f.id === farmId);
      if (!farm) {
        res.status(404).json({ success: false, message: 'Farm not found' });
        return;
      }
      const ownerId = farm.owner?._id || farm.owner?.id || farm.owner;
      if (role !== 'admin' && ownerId !== userId) {
        res.status(403).json({ success: false, message: 'Not authorized to access this farm report' });
        return;
      }
      crops = fallbackStore.crops.filter((c: any) => {
        const cFarmId = c.farm?._id || c.farm?.id || c.farm;
        return cFarmId === farmId;
      });
      soilTests = fallbackStore.soilTests
        .filter((s: any) => {
          const sFarmId = s.farm?._id || s.farm?.id || s.farm;
          return sFarmId === farmId;
        })
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const latestSoil = soilTests[0] || null;

    res.json({
      success: true,
      reportTitle: `Comprehensive Farm Diagnostic Report - ${farm.name}`,
      generatedAt: new Date().toISOString(),
      farm: {
        id: farm._id || farm.id,
        name: farm.name,
        location: farm.location,
        areaAcres: farm.area,
        soilType: farm.soilType,
        irrigationType: farm.irrigationType,
      },
      crops: {
        totalCrops: crops.length,
        items: crops,
      },
      soilAnalytics: {
        totalTestsConducted: soilTests.length,
        latestReading: latestSoil,
        history: soilTests,
      },
      exportFormatsAvailable: ['CSV', 'JSON', 'PDF-Print'],
    });
  } catch (error) {
    next(error);
  }
};
