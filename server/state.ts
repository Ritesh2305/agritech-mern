import { initialSeedData } from '../shared/seedData.ts';

// In-memory data store for preview mode and fallback operations
class MemoryStore {
  users: any[] = JSON.parse(JSON.stringify(initialSeedData.users));
  farms: any[] = JSON.parse(JSON.stringify(initialSeedData.farms));
  crops: any[] = JSON.parse(JSON.stringify(initialSeedData.crops));
  soilTests: any[] = JSON.parse(JSON.stringify(initialSeedData.soilTests));
  resources: any[] = JSON.parse(JSON.stringify(initialSeedData.resources));
  orders: any[] = JSON.parse(JSON.stringify(initialSeedData.orders));
  consultations: any[] = JSON.parse(JSON.stringify(initialSeedData.consultations));
  alerts: any[] = JSON.parse(JSON.stringify(initialSeedData.alerts));
  forumPosts: any[] = JSON.parse(JSON.stringify(initialSeedData.forumPosts));
  govtSchemes: any[] = JSON.parse(JSON.stringify(initialSeedData.govtSchemes));
  mandiPrices: any[] = JSON.parse(JSON.stringify(initialSeedData.mandiPrices));
  activityLogs: any[] = [
    {
      _id: 'log_1',
      id: 'log_1',
      userId: 'usr_admin_1',
      user: { _id: 'usr_admin_1', name: 'Dr. Vikramaditya Rao', email: 'admin@agritech.org' },
      userName: 'Dr. Vikramaditya Rao',
      userRole: 'admin',
      action: 'System Boot',
      entity: 'Server',
      details: 'AgriTech server initialized with agro-meteorological monitoring and soil health models.',
      timestamp: new Date().toISOString(),
    },
    {
      _id: 'log_2',
      id: 'log_2',
      userId: 'usr_farmer_1',
      user: { _id: 'usr_farmer_1', name: 'Ramesh Patel', email: 'ramesh@farmer.in' },
      userName: 'Ramesh Patel',
      userRole: 'farmer',
      action: 'Soil Test Upload',
      entity: 'Soil Analysis',
      details: 'Submitted soil sample for Plot A (NPK: 240-32-195).',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
  ];

  get posts(): any[] {
    return this.forumPosts;
  }

  set posts(val: any[]) {
    this.forumPosts = val;
  }

  reset() {
    this.users = JSON.parse(JSON.stringify(initialSeedData.users));
    this.farms = JSON.parse(JSON.stringify(initialSeedData.farms));
    this.crops = JSON.parse(JSON.stringify(initialSeedData.crops));
    this.soilTests = JSON.parse(JSON.stringify(initialSeedData.soilTests));
    this.resources = JSON.parse(JSON.stringify(initialSeedData.resources));
    this.orders = JSON.parse(JSON.stringify(initialSeedData.orders));
    this.consultations = JSON.parse(JSON.stringify(initialSeedData.consultations));
    this.alerts = JSON.parse(JSON.stringify(initialSeedData.alerts));
    this.forumPosts = JSON.parse(JSON.stringify(initialSeedData.forumPosts));
    this.govtSchemes = JSON.parse(JSON.stringify(initialSeedData.govtSchemes));
    this.mandiPrices = JSON.parse(JSON.stringify(initialSeedData.mandiPrices));
  }
}

export const memoryStore = new MemoryStore();
export const fallbackStore = memoryStore;
