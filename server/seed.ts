import bcrypt from 'bcryptjs';
import { User } from './models/User.ts';
import { Farm } from './models/Farm.ts';
import { Crop } from './models/Crop.ts';
import { SoilTest } from './models/SoilTest.ts';
import { Resource } from './models/Resource.ts';
import { Order } from './models/Order.ts';
import { Consultation } from './models/Consultation.ts';
import { ForumPost } from './models/ForumPost.ts';
import { Alert } from './models/Alert.ts';

import { initialSeedData } from '../shared/seedData.ts';
export { initialSeedData };

export async function seedDatabase(): Promise<{ success: boolean; message: string; counts: any }> {
  try {
    if (User.db?.readyState === 1) {
      console.log('[Seed] Seeding live MongoDB database...');
      await User.deleteMany({});
      await Farm.deleteMany({});
      await Crop.deleteMany({});
      await SoilTest.deleteMany({});
      await Resource.deleteMany({});
      await Order.deleteMany({});
      await Consultation.deleteMany({});
      await ForumPost.deleteMany({});
      await Alert.deleteMany({});

      // Create users with hashed passwords
      const createdUsers = [];
      for (const u of initialSeedData.users) {
        const user = new User({
          name: u.name,
          email: u.email,
          password: u.password,
          phone: u.phone,
          role: u.role,
          language: u.language,
          region: u.region,
        });
        await user.save();
        createdUsers.push(user);
      }

      // Farms
      const farmer1 = createdUsers.find(u => u.email === 'ramesh@farmer.in');
      const farmer2 = createdUsers.find(u => u.email === 'lakshmi@farmer.in');

      const createdFarms = [];
      if (farmer1) {
        const farm1 = await Farm.create({
          owner: farmer1._id,
          name: 'Patel Krishi Farm - Plot A',
          location: 'Wardhannapet, Warangal',
          area: 6.5,
          areaUnit: 'acres',
          soilType: 'Black',
          irrigationType: 'Drip',
        });
        createdFarms.push(farm1);

        await Crop.create({
          farm: farm1._id,
          owner: farmer1._id,
          name: 'Bt Cotton',
          variety: 'Bollgard II Supreme Hybrid',
          sowingDate: new Date('2026-06-12'),
          expectedHarvest: new Date('2026-11-25'),
          stage: 'Vegetative',
          status: 'Healthy',
          plantedArea: 4.5,
          expectedYield: 36,
          healthScore: 92,
        });

        await SoilTest.create({
          farm: farm1._id,
          owner: farmer1._id,
          nitrogen: 240,
          phosphorus: 32,
          potassium: 195,
          ph: 6.8,
          moisture: 52,
          organicCarbon: 0.68,
          status: 'Optimal',
          recommendations: [
            'Nitrogen slightly below high-yield potential. Apply 25 kg/acre Urea before square formation.',
            'Soil pH (6.8) is ideal for cotton and pulses.',
          ],
        });
      }

      if (farmer2) {
        const farm2 = await Farm.create({
          owner: farmer2._id,
          name: 'Lakshmi Organic Valley',
          location: 'Tenali, Guntur',
          area: 8.2,
          areaUnit: 'acres',
          soilType: 'Alluvial',
          irrigationType: 'Sprinkler',
        });
        createdFarms.push(farm2);

        await Crop.create({
          farm: farm2._id,
          owner: farmer2._id,
          name: 'Paddy (Basmati)',
          variety: 'Pusa 1121 Organic',
          sowingDate: new Date('2026-06-25'),
          expectedHarvest: new Date('2026-11-10'),
          stage: 'Vegetative',
          status: 'Healthy',
          plantedArea: 5.0,
          expectedYield: 52,
          healthScore: 95,
        });
      }

      // Resources
      for (const r of initialSeedData.resources) {
        await Resource.create({
          name: r.name,
          category: r.category,
          description: r.description,
          price: r.price,
          unit: r.unit,
          stock: r.stock,
          rating: r.rating,
          manufacturer: r.manufacturer,
          imageUrl: r.imageUrl,
          subsidyEligible: r.subsidyEligible,
        });
      }

      // Alerts
      for (const a of initialSeedData.alerts) {
        await Alert.create({
          title: a.title,
          description: a.description,
          severity: a.severity,
          pestOrDisease: a.pestOrDisease,
          affectedCrops: a.affectedCrops,
          region: a.region,
          recommendedAction: a.recommendedAction,
          organicRemedy: a.organicRemedy,
          active: a.active,
        });
      }

      return {
        success: true,
        message: 'MongoDB database successfully populated with AgriTech initial dataset.',
        counts: {
          users: createdUsers.length,
          farms: createdFarms.length,
          resources: initialSeedData.resources.length,
          alerts: initialSeedData.alerts.length,
        },
      };
    }

    return {
      success: true,
      message: 'In-memory mock store populated successfully with 1 Admin, 2 Farmers, Farms, Crops, and Resources.',
      counts: {
        users: initialSeedData.users.length,
        farms: initialSeedData.farms.length,
        crops: initialSeedData.crops.length,
        resources: initialSeedData.resources.length,
        orders: initialSeedData.orders.length,
        alerts: initialSeedData.alerts.length,
      },
    };
  } catch (error: any) {
    console.error('[Seed Error]:', error.message);
    return {
      success: false,
      message: `Seed failed: ${error.message}`,
      counts: null,
    };
  }
}
