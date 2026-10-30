# Mitti Mitra (मिट्टीमित्र) — AI-Powered Smart Farming and Farmer Livelihood Platform

> **Tagline:** Better Soil. Better Crops. Better Livelihood.  
> **Theme:** Environment, Sustainable Agriculture, Farmer Empowerment, and Rural Livelihood Improvement.

---

## 1. Project Overview & Mission

**Mitti Mitra** is a full-stack, production-minded agricultural intelligence web platform tailored specifically for Indian farmers, agronomists, and rural agricultural stakeholders.

Indian agriculture faces compounded challenges:
1. **Soil Exhaustion & Chemical Imbalance:** Heavy over-application of synthetic Nitrogen (Urea) has depleted soil organic carbon (<0.5%) and damaged natural microbial biodiversity.
2. **Asymmetric Market Intelligence:** Middlemen exploit price opacity during post-harvest gluts.
3. **Severe Weather & Stubble Burning:** Climate instability, unseasonal rains, and crop residue fires cause severe economic distress and atmospheric pollution.

Mitti Mitra bridges these gaps by providing:
- **Scientific Soil Health Card Reports** that separate visual surface observations from laboratory titration metrics.
- **ICAR-Guided Agro-Climatic Crop Recommendation Engine** matching season, soil, irrigation, and rotation history.
- **4R Nutrient Stewardship & Integrated Nutrient Management (INM)** calculating exact DAP, Urea, and MOP doses while incorporating Vermicompost and green manure.
- **Plant Doctor Disease Screening** with confidence scoring, symptom breakdowns, organic bio-cures, and explicit inconclusive fallbacks.
- **Cultivation Cost & Net Profit Calculator** determining break-even mandi selling prices.
- **Live Mandi Prices & Transport Profitability Economics** comparing local vs. distant markets.
- **Verified Central & State Government Scheme Directory** (PM-KISAN, PMFBY, PKVY, SHC, PMKSY, KCC).
- **Disaster Loss Logging** maintaining private timestamped photographic evidence for PMFBY insurance claims.
- **Bilingual Accessibility** with English and Hindi (हिन्दी) support and Web Speech API Text-to-Speech audio reading.

---

## 2. Technology Stack

- **Frontend:**
  - React 18, Vite 5, JavaScript (ES Modules)
  - Tailwind CSS 3 (Nature-inspired green, cream, and earth palette)
  - React Router v6
  - Lucide React (Accessible agricultural iconography)
  - Recharts (Visual agricultural analytics & charts)
  - Web Speech API (Native voice synthesis and reading)
- **Backend:**
  - Node.js & Express.js REST APIs
  - MongoDB 8.0 & Mongoose ORM
  - JWT Authentication & bcrypt password hashing
  - Multer (Controlled image upload with MIME validation & 5MB limit)
  - Helmet & CORS security middleware
  - Express-Rate-Limit (DDoS & brute-force protection)
- **Testing & Quality Assurance:**
  - Vitest & Supertest automated backend test suites (100% pass rate)

---

## 3. Directory Structure

```
agriculture/
├── package.json                 # Monorepo root scripts
├── README.md                    # Platform documentation
├── .gitignore                   # Version control ignore rules
├── docs/
│   ├── API.md                   # REST API documentation
│   ├── ARCHITECTURE.md          # Scientific methodology & architecture
│   └── DATABASE.md              # MongoDB collections & schema design
├── server/
│   ├── package.json             # Server dependencies & scripts
│   ├── .env.example             # Environment template
│   ├── .env                     # Server environment configuration
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js            # MongoDB connection (supports Unix sockets & TCP)
│   │   │   └── env.js           # Configuration loader
│   │   ├── models/              # Mongoose schemas (User, SoilReport, Scheme, etc.)
│   │   ├── middleware/          # Auth, authorize, upload, rateLimiter, errorHandler
│   │   ├── services/            # Recommendation engine, INM, Disease vision, Weather, Market
│   │   ├── controllers/         # Modular REST controllers
│   │   ├── routes/              # Express API route modules
│   │   ├── utils/
│   │   │   └── seed.js          # Database seeding script with realistic Indian data
│   │   ├── app.js               # Express application setup
│   │   └── server.js            # Entry point
│   ├── tests/                   # Automated Vitest / Supertest suites
│   │   ├── auth.test.js         # Authentication, hashing, authorization tests
│   │   ├── soil.test.js         # Soil report isolation & ownership tests
│   │   ├── recommendation.test.js # Crop & fertilizer ICAR calculation tests
│   │   └── expense.test.js      # Cultivation economic calculation tests
│   └── uploads/                 # Local image storage directory
└── client/
    ├── package.json             # Client dependencies & scripts
    ├── index.html               # Main HTML entry with Google Fonts
    ├── vite.config.js           # Vite configuration with API reverse proxy
    ├── tailwind.config.js       # Agricultural color palette configuration
    ├── postcss.config.js        # PostCSS configuration
    └── src/
        ├── index.css            # Tailwind directives & print styling
        ├── main.jsx             # React DOM root
        ├── App.jsx              # Navigation routes & guards
        ├── context/             # AuthContext, LanguageContext, NotificationContext
        ├── i18n/                # en.json, hi.json (English & Hindi dictionaries)
        ├── services/            # API fetch layer
        ├── components/          # Reusable Navbar, Footer, VoiceReader, SoilNutrientGauge
        └── pages/               # 18+ Responsive agricultural pages
```

---

## 4. Quick Start & Installation

### Prerequisites
- Node.js >= 18 (Tested on v24.12.0)
- npm >= 9 (Tested on v11.6.2)
- MongoDB >= 6.0 (Tested on MongoDB 8.0.32)

### Step 1: Install Dependencies
```bash
# In project root
npm run server -- npm install
npm run client -- npm install
```

### Step 2: Configure Environment Variables
Copy `server/.env.example` to `server/.env`:
```bash
cp server/.env.example server/.env
```
Default parameters in `server/.env`:
```ini
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/mittimitra
MONGODB_SOCKET_PATH=/tmp/mongodb-27017.sock
JWT_SECRET=mittimitra_super_secret_jwt_key_2026_agro_safe_token
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

### Step 3: Seed Database with Indian Agricultural Data
```bash
npm run seed
```
This populates:
- Verified government schemes (PM-KISAN, PMFBY, PKVY, SHC, PMKSY, KCC).
- Educational sustainability guides (Vermicomposting, Green Manuring, Zero-Burn Stubble Management).
- Sample APMC mandi wholesale benchmarks across Maharashtra, Punjab, Gujarat, Rajasthan, MP, and AP.
- Demo user accounts for testing.

### Step 4: Run Automated Tests
```bash
npm test
```
Runs 14 automated tests covering authentication, role-based protection, soil report ownership isolation, recommendation matrices, and cost calculations.

### Step 5: Start Development Servers
In two separate terminals:

**Terminal 1 (Backend API):**
```bash
cd server
npm run dev
# Server listens at http://localhost:5000
# Health check available at http://localhost:5000/api/health
```

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
# Client runs at http://localhost:5173
```

---

## 5. Demo Accounts

| Role | Email / Phone | Password | Capabilities |
| :--- | :--- | :--- | :--- |
| **Farmer** | `farmer@mittimitra.org` (or `9876543210`) | `Farmer@123` | Full dashboard, soil analysis, crop recommendations, disease doctor, expense calculator, damage logging. |
| **Agronomist / Expert** | `expert@mittimitra.org` (or `9876543211`) | `Expert@123` | Access to consultation queue, prescribe medical diagnoses and verified treatments. |
| **Administrator** | `admin@mittimitra.org` (or `9876543212`) | `Admin@123` | Real-time database metrics, user role promotion, content moderation of reported posts, audit logs. |

*(Quick one-click login buttons are also available on the Sign-In page).*

---

## 6. Scientific Safeguards & Transparency

1. **Separation of Photographic Observations from Chemical Measurements:**
   - Mitti Mitra never claims that a photograph alone can measure soil pH or N-P-K. Photographs are used for surface texture and color assessment; chemical dosages require lab measurements.
2. **Inconclusive Diagnostic Results:**
   - Plant disease AI reports an inconclusive result for unclear or non-plant photographs and explicitly disclaims certainty before chemical application.
3. **4R Nutrient Stewardship:**
   - Fertilizer dosages follow ICAR Package of Practices, encouraging split Nitrogen doses to avoid leaching and groundwater nitrate pollution.
4. **Transport Economics Transparency:**
   - Distant mandi prices are offset against freight costs (₹800 base + ₹25/km) before recommending distant market sales.

---

## 7. External Integrations & Optional Credentials

The application works out-of-the-box with realistic built-in simulators. For live external services, configure the following in `server/.env`:
- `WEATHER_API_KEY`: OpenWeatherMap API Key for live global weather feeds.
- `MARKET_DATA_API_KEY`: Open Government Data (data.gov.in) API key for real-time Agmarknet mandi feeds.
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`: For cloud image hosting (if omitted, secure local `/uploads` storage is used automatically).

---

## 8. License

Licensed under the MIT License for open agricultural advancement and farmer empowerment.

