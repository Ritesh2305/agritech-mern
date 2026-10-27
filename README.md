# AgriTech - Empowering Farmers Through Digital Technology

> A modern, smart, scalable farming management system engineered for rural accessibility, multilingual communication (English, Hindi, Telugu, Tamil), real-time agro-meteorology, soil health diagnostics, bio-pest alerts, agricultural resource ordering, and expert consultations.

---

## 🌟 Key Features

1. **Multilingual Architecture**: Native UI and advisory in **English**, **हिंदी (Hindi)**, **తెలుగు (Telugu)**, and **தமிழ் (Tamil)**.
2. **Soil Health Intelligence**:
   - Digital soil sampling input with N, P, K, pH, and moisture meters.
   - Algorithmic nutrient deficit calculations and customized fertilizer prescriptions (e.g. split Urea doses, SSP, MOP).
   - Soil acidity/alkalinity remediation (Agricultural Lime vs. Gypsum).
   - Bio-fertilizer remediation (PSB, Azotobacter, Farm Yard Manure).
3. **Agro-Meteorology & Pest Surveillance**:
   - 5-Day hyper-local agricultural weather forecast (temperatures, rainfall probability, humidity, wind).
   - Real-time **Foliar Spray Feasibility Index** (wind, precipitation, and evaporation thresholds).
   - Active pest & disease outbreak warnings (Pink Bollworm, Fall Armyworm, Paddy Blast) with organic remedies and action plans.
4. **Farm Land & Crop Lifecycle Monitoring**:
   - Manage multiple land parcels with soil type (Black, Alluvial, Red, Loamy) and irrigation method (Drip, Sprinkler, Canal, Borewell).
   - Crop stage progress tracking (Sowing ➔ Germination ➔ Vegetative ➔ Flowering ➔ Maturity ➔ Harvested).
   - Days-to-harvest countdown and yield projection.
5. **Direct Agricultural Resource Marketplace**:
   - Certified seeds, bio-fertilizers, solar drip controllers, and diagnostic probes.
   - Integrated shopping cart with Kisan Credit Card (KCC) and Cash on Delivery (COD) checkout.
   - Door-to-farm delivery tracking with a 4-stage live status stepper.
6. **Agronomist Consultation & Community Forum**:
   - 1-Click scheduling with ICAR-certified crop specialists.
   - Peer farmer discussion threads with upvotes and community answers.
7. **APMC Mandi Rates & Government Welfare Schemes**:
   - Live mandi rates for Cotton, Paddy, Wheat, Soybean, Tomato, and Mustard against Govt MSP.
   - Step-by-step guides for PM-KISAN (₹6,000/yr), PMFBY Crop Insurance, Soil Health Card, and SMAM farm mechanization subsidies.
8. **Admin Operations Dashboard**:
   - Order fulfillment queue (Approve, Mark Shipped, Deliver, Reject).
   - User registry and security audit logs.
   - Emergency pest alert broadcasting.
9. **Export & Interoperability**:
   - Instant downloadable **CSV spreadsheet** and formatted **Printable PDF** farm reports.
   - Built-in **Postman Collection (JSON)** covering all RESTful API endpoints.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Custom i18n
- **Backend**: Node.js, Express.js, JWT, bcryptjs, CORS
- **Database**: MongoDB (Mongoose) with intelligent fallback and preview cache
- **External APIs**: OpenWeatherMap API integration with agro-meteorological calibration

---

## ⚙️ Environment Variables (.env)

Create a `.env` file in the root directory:

```env
# Application Port & Node Environment
PORT=3000
NODE_ENV=development

# MongoDB Connection String (MongoDB Atlas or local MongoDB)
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/agritech?retryWrites=true&w=majority

# JWT Authentication
JWT_SECRET=agritech_jwt_secure_agricultural_secret_key_2026
JWT_EXPIRES_IN=7d

# Optional OpenWeatherMap API Key
OPENWEATHER_API_KEY=

# Preview Mock Mode (Set to true or false)
VITE_USE_MOCK=false
```

---

## 💻 Installation & Run Commands

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Full-Stack Application (Express API + Vite Frontend)
```bash
npm run dev
```
The app will be available on `http://localhost:3000`.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 👥 Demo Personas & Credentials

You can test the system with 1-click login buttons in the app header or with the credentials below:

| Persona | Email | Password | Role | Region |
| :--- | :--- | :--- | :--- | :--- |
| **Dr. Vikramaditya Rao** | `admin@agritech.org` | `adminpassword123` | **Admin** | Hyderabad Central |
| **Ramesh Patel** | `ramesh@farmer.in` | `password123` | **Farmer** | Warangal, Telangana |
| **Lakshmi Devi** | `lakshmi@farmer.in` | `password123` | **Farmer** | Guntur, Andhra Pradesh |

---

## 🏛️ Server Architecture & Controllers

The backend follows an enterprise MVC architecture with clean separation of concerns. All business logic is encapsulated in modular controllers under `/server/controllers/`, while route files in `/server/routes/` strictly map HTTP endpoints, enforce `express-validator` schema validations, and attach authentication/authorization guards.

### Controllers Directory (`/server/controllers/`):

| Controller | Responsibility | Key Handlers |
| :--- | :--- | :--- |
| `authController.ts` | Identity, Session & JWT Tokenization | `register`, `login`, `getMe`, `logout`, `demoLogin` |
| `farmController.ts` | Farm profile management & Land parcels | `getFarms`, `getFarmById`, `createFarm`, `updateFarm`, `deleteFarm` |
| `cropController.ts` | Crop lifecycle, stages, and yield metrics | `getCrops`, `getCropById`, `createCrop`, `updateCrop`, `deleteCrop` |
| `soilController.ts` | Soil health testing & NPK recommendations | `getSoilTests`, `getSoilTestById`, `analyzeSoilHealthAndSave`, `deleteSoilTest` |
| `weatherController.ts`| Agro-meteorology & Bio-pest warnings | `getCurrentWeatherAndForecast`, `getPestAlerts`, `createPestAlert`, `deletePestAlert` |
| `resourceController.ts`| Seed/fertilizer store & admin catalog approval | `getResources`, `getResourceById`, `createResource`, `updateResource`, `approveResource`, `deleteResource` |
| `orderController.ts` | Cart checkout, live order tracking & status | `getMyOrders`, `getAllOrders`, `getOrderById`, `placeOrder`, `updateOrderStatus`, `cancelOrder` |
| `consultationController.ts`| Agronomist booking & query handling | `getConsultations`, `getConsultationById`, `bookConsultation`, `updateConsultation`, `cancelConsultation` |
| `forumController.ts` | Community discussions, replies, likes & moderation | `getPosts`, `getPostById`, `createPost`, `addComment`, `likePost`, `moderatePost` |
| `adminController.ts` | System telemetry, user registry, role updates & audit | `getSystemStats`, `getUsers`, `updateUserRole`, `deleteUser`, `getActivityLogs` |
| `reportController.ts`| Farm data analytics, CSV export & PDF summary | `exportFarmReportCSV`, `exportFarmReportSummary` |

---

## 📡 REST API Documentation

The complete Postman Collection v2.1.0 can be downloaded directly from the UI or via GET request to `/api/v1/postman?download=true`.

### Key Endpoints:
- `POST /api/v1/auth/login` - Authenticate user & get JWT
- `POST /api/v1/auth/register` - Create farmer or admin account
- `POST /api/v1/auth/demo` - 1-Click fast login with demo persona
- `GET /api/v1/farms` - List user's registered farms
- `POST /api/v1/farms` - Register new farm land
- `GET /api/v1/crops` - List crop plantings
- `POST /api/v1/crops` - Register crop sowing
- `POST /api/v1/soil/analyze` - Run NPK and pH diagnostic analysis
- `GET /api/v1/weather` - Real-time weather and 5-day agro-forecast
- `GET /api/v1/weather/alerts` - Active pest outbreak alerts
- `POST /api/v1/weather/alerts` - Admin broadcast emergency pest outbreak alert
- `GET /api/v1/resources` - Browse agricultural input store
- `POST /api/v1/orders` - Place resource order
- `GET /api/v1/orders` - Get farmer order history with timeline
- `PUT /api/v1/orders/:id/status` - Admin update order status
- `POST /api/v1/consultations` - Book agronomist consultation
- `GET /api/v1/forum` - Community forum threads
- `POST /api/v1/forum/:id/comments` - Add reply to forum topic
- `PUT /api/v1/forum/:id/like` - Upvote forum discussion
- `GET /api/v1/reports/farms/:farmId/csv` - Download farm metrics spreadsheet
- `GET /api/v1/reports/farms/:farmId/summary` - Comprehensive printable diagnostic summary
- `GET /api/v1/admin/stats` - System overview metrics (Admin only)
- `GET /api/v1/admin/users` - User registry (Admin only)
- `GET /api/v1/admin/logs` - System audit activity logs (Admin only)
- `POST /api/v1/seed` - Populate database with sample dataset

