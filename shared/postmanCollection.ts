export function getPostmanCollection(baseUrl: string = 'http://localhost:3000/api/v1') {
  return {
    info: {
      name: 'AgriTech REST API Collection v1.0',
      description: 'Comprehensive REST API documentation and test endpoints for AgriTech - Empowering Farmers Through Digital Technology.',
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: [
      {
        name: 'Authentication',
        item: [
          {
            name: 'Register Farmer',
            request: {
              method: 'POST',
              header: [{ key: 'Content-Type', value: 'application/json' }],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  name: 'Ramesh Patel',
                  email: 'ramesh@farmer.in',
                  password: 'password123',
                  phone: '+91 98765 43210',
                  role: 'farmer',
                  language: 'en',
                  region: 'Warangal, Telangana',
                }, null, 2),
              },
              url: { raw: `${baseUrl}/auth/register` },
            },
          },
          {
            name: 'Login User',
            request: {
              method: 'POST',
              header: [{ key: 'Content-Type', value: 'application/json' }],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  email: 'admin@agritech.org',
                  password: 'adminpassword123',
                }, null, 2),
              },
              url: { raw: `${baseUrl}/auth/login` },
            },
          },
          {
            name: 'Get Current User Profile',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: `${baseUrl}/auth/me` },
            },
          },
        ],
      },
      {
        name: 'Farms & Land Holdings',
        item: [
          {
            name: 'Get All User Farms',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: `${baseUrl}/farms` },
            },
          },
          {
            name: 'Create New Farm',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{token}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  name: 'Green Acres Plot 1',
                  location: 'Khammam District, Telangana',
                  area: 5.5,
                  areaUnit: 'acres',
                  soilType: 'Black',
                  irrigationType: 'Drip',
                }, null, 2),
              },
              url: { raw: `${baseUrl}/farms` },
            },
          },
        ],
      },
      {
        name: 'Crops & Monitoring',
        item: [
          {
            name: 'Get Crops for Farm',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: `${baseUrl}/crops` },
            },
          },
          {
            name: 'Register Crop Sowing',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{token}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  farmId: '{{farmId}}',
                  name: 'Bt Cotton',
                  variety: 'Bollgard II Supreme',
                  sowingDate: '2026-06-15',
                  expectedHarvest: '2026-11-20',
                  stage: 'Vegetative',
                  plantedArea: 3.5,
                  expectedYield: 28,
                  notes: 'First top dressing with neem coated urea done.',
                }, null, 2),
              },
              url: { raw: `${baseUrl}/crops` },
            },
          },
        ],
      },
      {
        name: 'Soil Health & Diagnostics',
        item: [
          {
            name: 'Get Soil Test History',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: `${baseUrl}/soil` },
            },
          },
          {
            name: 'Submit Soil Sample & Run Diagnostic',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{token}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  farmId: '{{farmId}}',
                  nitrogen: 210,
                  phosphorus: 28,
                  potassium: 190,
                  ph: 6.5,
                  moisture: 48,
                  organicCarbon: 0.72,
                }, null, 2),
              },
              url: { raw: `${baseUrl}/soil/analyze` },
            },
          },
        ],
      },
      {
        name: 'Agro Weather & Pest Alerts',
        item: [
          {
            name: 'Get Weather Advisory & Forecast',
            request: {
              method: 'GET',
              url: { raw: `${baseUrl}/weather?location=Hyderabad` },
            },
          },
          {
            name: 'Get Active Pest Alerts',
            request: {
              method: 'GET',
              url: { raw: `${baseUrl}/weather/alerts` },
            },
          },
        ],
      },
      {
        name: 'Marketplace & Orders',
        item: [
          {
            name: 'Get Resources / Inputs Catalog',
            request: {
              method: 'GET',
              url: { raw: `${baseUrl}/resources?category=Seeds` },
            },
          },
          {
            name: 'Checkout / Place Order',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{token}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  items: [
                    { resourceId: 'res_1', name: 'Certified Hybrid Cotton Seeds', price: 850, quantity: 2, unit: 'packet' }
                  ],
                  shippingAddress: {
                    fullName: 'Ramesh Patel',
                    phone: '9876543210',
                    village: 'Palakurthy',
                    district: 'Jangaon',
                    state: 'Telangana',
                    pincode: '506252',
                  },
                  paymentMethod: 'Cash on Delivery',
                }, null, 2),
              },
              url: { raw: `${baseUrl}/orders` },
            },
          },
          {
            name: 'Get Farmer Orders',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{token}}' }],
              url: { raw: `${baseUrl}/orders/my-orders` },
            },
          },
        ],
      },
      {
        name: 'Expert Consultations & Forum',
        item: [
          {
            name: 'Book Agronomist Consultation',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{token}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  expertName: 'Dr. Lekshmi Sharma',
                  expertRole: 'Senior Entomologist & Crop Scientist',
                  date: '2026-10-29',
                  timeSlot: '10:30 AM - 11:00 AM',
                  cropAffected: 'Cotton',
                  topic: 'Pink Bollworm Resistance',
                  description: 'Spotted premature boll opening and caterpillar frass inside flower buds.',
                  urgency: 'High',
                }, null, 2),
              },
              url: { raw: `${baseUrl}/consultations` },
            },
          },
          {
            name: 'Get Community Forum Threads',
            request: {
              method: 'GET',
              url: { raw: `${baseUrl}/forum` },
            },
          },
          {
            name: 'Create Forum Topic',
            request: {
              method: 'POST',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{token}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  title: 'Best organic foliar spray for chilli leaf curl?',
                  category: 'Organic Farming',
                  content: 'Has anyone tried Dashaparni Ark or Agniastra for vector control in dry chilli farming?',
                  tags: ['Organic', 'Chilli', 'Pest Control'],
                }, null, 2),
              },
              url: { raw: `${baseUrl}/forum` },
            },
          },
        ],
      },
      {
        name: 'Admin & Auditing',
        item: [
          {
            name: 'Get Admin System Dashboard',
            request: {
              method: 'GET',
              header: [{ key: 'Authorization', value: 'Bearer {{adminToken}}' }],
              url: { raw: `${baseUrl}/admin/stats` },
            },
          },
          {
            name: 'Update Order Status (Approve/Ship)',
            request: {
              method: 'PATCH',
              header: [
                { key: 'Content-Type', value: 'application/json' },
                { key: 'Authorization', value: 'Bearer {{adminToken}}' },
              ],
              body: {
                mode: 'raw',
                raw: JSON.stringify({
                  status: 'shipped',
                  note: 'Dispatched through AgriTech Krishi Express Logistics tracking #KR9921',
                }, null, 2),
              },
              url: { raw: `${baseUrl}/admin/orders/{{orderId}}/status` },
            },
          },
        ],
      },
    ],
  };
}
