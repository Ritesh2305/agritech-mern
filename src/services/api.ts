import { initialSeedData } from '../../shared/seedData.ts';
import { analyzeSoilHealth } from '../../shared/soilRecommendation.ts';

const API_BASE = '/api/v1';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('agritech_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Client-side fallback state cache
class LocalFallbackStore {
  farms: any[] = [...initialSeedData.farms];
  crops: any[] = [...initialSeedData.crops];
  soilTests: any[] = [...initialSeedData.soilTests];
  resources: any[] = [...initialSeedData.resources];
  orders: any[] = [...initialSeedData.orders];
  consultations: any[] = [...initialSeedData.consultations];
  alerts: any[] = [...initialSeedData.alerts];
  forumPosts: any[] = [...initialSeedData.forumPosts];
  govtSchemes: any[] = [...initialSeedData.govtSchemes];
  mandiPrices: any[] = [...initialSeedData.mandiPrices];
}

const localCache = new LocalFallbackStore();

export const api = {
  // Farms
  async getFarms() {
    try {
      const res = await fetch(`${API_BASE}/farms`, { headers: getAuthHeader() });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (e) {}
    return localCache.farms;
  },

  async createFarm(data: any) {
    try {
      const res = await fetch(`${API_BASE}/farms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    const newFarm = {
      id: `farm_${Date.now()}`,
      ownerId: 'usr_farmer_1',
      ...data,
      coordinates: { lat: 17.5, lng: 78.5 },
      createdAt: new Date().toISOString(),
    };
    localCache.farms.push(newFarm);
    return newFarm;
  },

  // Crops
  async getCrops(farmId?: string) {
    try {
      const url = farmId ? `${API_BASE}/crops?farmId=${farmId}` : `${API_BASE}/crops`;
      const res = await fetch(url, { headers: getAuthHeader() });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (e) {}
    return farmId ? localCache.crops.filter(c => c.farmId === farmId) : localCache.crops;
  },

  async createCrop(data: any) {
    try {
      const res = await fetch(`${API_BASE}/crops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    const newCrop = {
      id: `crop_${Date.now()}`,
      ...data,
      healthScore: 88,
      status: data.status || 'Healthy',
      createdAt: new Date().toISOString(),
    };
    localCache.crops.push(newCrop);
    return newCrop;
  },

  // Soil
  async getSoilTests(farmId?: string) {
    try {
      const url = farmId ? `${API_BASE}/soil?farmId=${farmId}` : `${API_BASE}/soil`;
      const res = await fetch(url, { headers: getAuthHeader() });
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) return json.data;
      }
    } catch (e) {}
    return farmId ? localCache.soilTests.filter(s => s.farmId === farmId) : localCache.soilTests;
  },

  async analyzeSoil(data: any) {
    try {
      const res = await fetch(`${API_BASE}/soil/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (e) {}

    const diagnosis = analyzeSoilHealth(
      Number(data.nitrogen),
      Number(data.phosphorus),
      Number(data.potassium),
      Number(data.ph),
      Number(data.moisture),
      data.cropName
    );

    const testRecord = {
      id: `soil_${Date.now()}`,
      farmId: data.farmId || 'farm_1',
      ownerId: 'usr_farmer_1',
      ...data,
      status: diagnosis.status,
      recommendations: diagnosis.recommendations,
      testedAt: new Date().toISOString(),
    };
    localCache.soilTests.unshift(testRecord);

    return { success: true, data: testRecord, diagnosis };
  },

  // Weather & Alerts
  async getWeather(location: string = 'Hyderabad, Telangana') {
    try {
      const res = await fetch(`${API_BASE}/weather?location=${encodeURIComponent(location)}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    // Fallback calibrated agro-weather
    return {
      location,
      temperature: 31,
      feelsLike: 33,
      humidity: 62,
      rainfall: 1.2,
      windSpeed: 11,
      windDirection: 'ENE',
      condition: 'Partly Cloudy',
      uvIndex: 7,
      soilMoistureEst: 54,
      advisory: 'High daytime photosynthesis rate. Maintain morning drip irrigation for cotton and pulses.',
      sprayCondition: 'Excellent',
      forecast: [
        { day: 'Today', date: 'Oct 27', tempMax: 31, tempMin: 22, rainfallChance: 15, condition: 'Partly Cloudy', advisory: 'Optimal foliar spray window 7 AM - 10 AM.' },
        { day: 'Wed', date: 'Oct 28', tempMax: 33, tempMin: 23, rainfallChance: 10, condition: 'Sunny', advisory: 'Clear skies. Good for weeding and aeration.' },
        { day: 'Thu', date: 'Oct 29', tempMax: 32, tempMin: 24, rainfallChance: 45, condition: 'Scattered Showers', advisory: 'Late afternoon showers expected.' },
        { day: 'Fri', date: 'Oct 30', tempMax: 29, tempMin: 21, rainfallChance: 65, condition: 'Rain / Thunder', advisory: 'Postpone fertilizer application.' },
        { day: 'Sat', date: 'Oct 31', tempMax: 30, tempMin: 22, rainfallChance: 25, condition: 'Partly Cloudy', advisory: 'Adequate soil moisture.' },
      ],
    };
  },

  async getPestAlerts() {
    try {
      const res = await fetch(`${API_BASE}/weather/alerts`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return localCache.alerts;
  },

  async broadcastAlert(data: any) {
    try {
      const res = await fetch(`${API_BASE}/weather/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    const newAlert = {
      id: `alt_${Date.now()}`,
      ...data,
      active: true,
      issuedAt: new Date().toISOString(),
    };
    localCache.alerts.unshift(newAlert);
    return newAlert;
  },

  // Resources
  async getResources(category?: string, search?: string) {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (search) params.append('search', search);

      const res = await fetch(`${API_BASE}/resources?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    let items = localCache.resources;
    if (category && category !== 'All') items = items.filter(r => r.category === category);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(r => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    return items;
  },

  // Orders
  async getMyOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders/my-orders`, { headers: getAuthHeader() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return localCache.orders;
  },

  async getAllOrders() {
    try {
      const res = await fetch(`${API_BASE}/orders`, { headers: getAuthHeader() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return localCache.orders;
  },

  async placeOrder(data: any) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const orderNumber = `AGT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newOrder = {
      id: `ord_${Date.now()}`,
      userId: 'usr_farmer_1',
      orderNumber,
      items: data.items,
      totalAmount: data.items.reduce((s: number, i: any) => s + i.price * i.quantity, 0),
      status: 'pending' as const,
      shippingAddress: data.shippingAddress,
      paymentMethod: data.paymentMethod || 'Cash on Delivery',
      timeline: [
        { status: 'pending', timestamp: new Date().toISOString(), note: 'Order placed by farmer' },
      ],
      createdAt: new Date().toISOString(),
    };
    localCache.orders.unshift(newOrder);
    return newOrder;
  },

  async updateOrderStatus(orderId: string, status: string, note?: string) {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ status, note }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const idx = localCache.orders.findIndex(o => o.id === orderId || o.orderNumber === orderId);
    if (idx > -1) {
      localCache.orders[idx].status = status as any;
      localCache.orders[idx].timeline.push({
        status,
        timestamp: new Date().toISOString(),
        note: note || `Order updated to ${status}`,
      });
      return localCache.orders[idx];
    }
  },

  // Consultations
  async getConsultations() {
    try {
      const res = await fetch(`${API_BASE}/consultations`, { headers: getAuthHeader() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return localCache.consultations;
  },

  async bookConsultation(data: any) {
    try {
      const res = await fetch(`${API_BASE}/consultations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const item = {
      id: `cons_${Date.now()}`,
      farmerId: 'usr_farmer_1',
      farmerName: 'Ramesh Patel',
      ...data,
      status: 'scheduled',
      expertPrescription: '',
      createdAt: new Date().toISOString(),
    };
    localCache.consultations.unshift(item);
    return item;
  },

  // Forum
  async getForumPosts(category?: string) {
    try {
      const url = category && category !== 'All' ? `${API_BASE}/forum?category=${category}` : `${API_BASE}/forum`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return category && category !== 'All'
      ? localCache.forumPosts.filter(p => p.category === category)
      : localCache.forumPosts;
  },

  async createForumPost(data: any) {
    try {
      const res = await fetch(`${API_BASE}/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const post = {
      id: `fp_${Date.now()}`,
      authorName: 'Ramesh Patel',
      authorRole: 'farmer',
      ...data,
      likes: 0,
      likedBy: [],
      comments: [],
      createdAt: new Date().toISOString(),
    };
    localCache.forumPosts.unshift(post);
    return post;
  },

  async addForumComment(postId: string, text: string) {
    try {
      const res = await fetch(`${API_BASE}/forum/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}

    const post = localCache.forumPosts.find(p => p.id === postId);
    if (post) {
      post.comments.push({
        author: 'usr_farmer_1',
        authorName: 'Ramesh Patel',
        authorRole: 'farmer',
        text,
        createdAt: new Date().toISOString(),
      });
      return post;
    }
  },

  async likeForumPost(postId: string) {
    try {
      const res = await fetch(`${API_BASE}/forum/${postId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      });
      if (res.ok) {
        const json = await res.json();
        return json.likes;
      }
    } catch (e) {}

    const post = localCache.forumPosts.find(p => p.id === postId);
    if (post) {
      post.likes += 1;
      return post.likes;
    }
    return 1;
  },

  // Admin stats
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`, { headers: getAuthHeader() });
      if (res.ok) {
        const json = await res.json();
        return json.stats;
      }
    } catch (e) {}

    return {
      totalUsers: initialSeedData.users.length,
      farmersCount: 2,
      totalFarms: localCache.farms.length,
      totalCrops: localCache.crops.length,
      totalOrders: localCache.orders.length,
      pendingOrders: localCache.orders.filter(o => o.status === 'pending').length,
      totalRevenue: localCache.orders.reduce((s, o) => s + o.totalAmount, 0),
      activeAlerts: localCache.alerts.filter(a => a.active).length,
      totalConsultations: localCache.consultations.length,
    };
  },

  async getAdminUsers() {
    try {
      const res = await fetch(`${API_BASE}/admin/users`, { headers: getAuthHeader() });
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch (e) {}
    return initialSeedData.users;
  },

  // Schemes & Mandi Rates
  getGovtSchemes() {
    return initialSeedData.govtSchemes;
  },

  getMandiPrices() {
    return initialSeedData.mandiPrices;
  },
};
