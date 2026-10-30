# Mitti Mitra REST API Documentation

Base URL: `http://localhost:5000/api`

## Authentication (`/api/auth`)

### 1. Register User
- **POST** `/auth/register`
- **Body**:
  ```json
  {
    "name": "Ramesh Patel",
    "email": "farmer@mittimitra.org",
    "phone": "9876543210",
    "password": "Farmer@123",
    "role": "farmer",
    "preferredLanguage": "en",
    "state": "Maharashtra",
    "district": "Pune",
    "village": "Khed Shivapur"
  }
  ```
- **Response** `201 Created`:
  ```json
  {
    "success": true,
    "token": "eyJhbGciOi...",
    "user": { "id": "...", "name": "...", "role": "farmer" }
  }
  ```

### 2. Login User
- **POST** `/auth/login`
- **Body**:
  ```json
  {
    "identifier": "farmer@mittimitra.org",
    "password": "Farmer@123"
  }
  ```
- **Response** `200 OK`: Returns JWT token and sanitized user details.

### 3. Current User Profile
- **GET** `/auth/me`
- **Header**: `Authorization: Bearer <token>`
- **Response** `200 OK`: Returns logged-in user and corresponding `FarmerProfile`.

---

## Soil Health & Reports (`/api/soil`)

### 1. Analyze Soil Sample & Generate Report
- **POST** `/soil/analyze` (Multipart Form Data)
- **Header**: `Authorization: Bearer <token>`
- **Fields**:
  - `image`: (File) Optional soil photograph
  - `farmLocation`: (String) e.g., "North Canal Plot"
  - `knownSoilType`: (String) "Black" | "Alluvial" | "Red & Yellow"
  - `season`: (String) "Rabi (Winter)"
  - `currentOrPlannedCrop`: (String) "Wheat"
  - `ph`: (Number) e.g., 7.1
  - `nitrogen`: (Number) e.g., 240
  - `phosphorus`: (Number) e.g., 16
  - `potassium`: (Number) e.g., 310
  - `organicCarbon`: (Number) e.g., 0.62
  - `electricalConductivity`: (Number) e.g., 0.45
- **Response** `201 Created`: Returns SoilReport document with ICAR health evaluations and remedial amendments.

### 2. Get My Soil Reports
- **GET** `/soil/reports`
- **Header**: `Authorization: Bearer <token>`
- **Response** `200 OK`: Paginated list of user-owned reports.

---

## Crop Recommendations (`/api/crops`)

### 1. Run Crop Recommendation Engine
- **POST** `/crops/recommend`
- **Header**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "state": "Maharashtra",
    "district": "Pune",
    "season": "Rabi (Winter)",
    "soilType": "Black",
    "irrigationType": "drip",
    "previousCrop": "Paddy / Rice",
    "ph": 7.1,
    "farmSize": 2,
    "saveResult": true
  }
  ```
- **Response** `200 OK`:
  ```json
  {
    "success": true,
    "recommendations": [
      {
        "cropName": "Wheat (गेहूं)",
        "suitabilityScore": 92,
        "suitabilityCategory": "Highly Suitable",
        "plantingWindow": "Late October to Mid November",
        "waterRequirementMm": "450 - 650 mm",
        "estimatedCostPerAcre": 16500,
        "expectedYieldRange": "18 - 25 quintals / acre",
        "matchReasons": [...]
      }
    ],
    "alternativeCrops": [...],
    "cropRotationAdvice": "..."
  }
  ```

---

## Fertilizer Advisory (`/api/fertilizers`)

### 1. Calculate Fertilizer Schedule
- **POST** `/fertilizers/advisory`
- **Header**: `Authorization: Bearer <token>`
- **Body**:
  ```json
  {
    "cropName": "Wheat",
    "landArea": 2,
    "landUnit": "acres",
    "soilReportId": "optional-soil-report-object-id"
  }
  ```
- **Response** `201 Created`: Returns chemical options (DAP, Urea, MOP) with basal and split doses, organic alternatives (FYM, Vermicompost), INM stewardship plan, and over-application warnings.

---

## Crop Disease Doctor (`/api/disease`)

### 1. Detect Disease from Leaf Image
- **POST** `/disease/detect` (Multipart Form Data)
- **Header**: `Authorization: Bearer <token>`
- **Fields**:
  - `image`: (File) Affected leaf photograph
  - `cropName`: (String) "Tomato"
  - `symptomsDescription`: (String) Optional notes
- **Response** `201 Created`: Returns pathogen diagnosis, model confidence, organic bio-cures, chemical controls, and inconclusive classification for blurry or non-plant images.

---

## Mandi Prices & Freight (`/api/market`)

### 1. Fetch APMC Mandi Rates
- **GET** `/market/prices?state=Maharashtra&commodity=Onion`
- **Response** `200 OK`: Min, Max, Modal prices, variety, and trend.

### 2. Transport Economics Calculator
- **POST** `/market/transport-calculator`
- **Body**:
  ```json
  {
    "distanceKm": 45,
    "produceQuantityQuintals": 25,
    "localMandiPrice": 2100,
    "distantMandiPrice": 2450
  }
  ```
- **Response** `200 OK`: Net profit after transport overhead and recommendation.

---

## Government Schemes (`/api/schemes`)

### 1. List Schemes
- **GET** `/schemes?category=crop_insurance`
- **Response** `200 OK`: Verified schemes (PM-KISAN, PMFBY, PKVY, etc.) with official application URLs and eligibility.

---

## Administrative Console (`/api/admin`)
*Requires role: `admin`*

- `GET /admin/metrics` - Real database metrics.
- `GET /admin/users` - User list with pagination and search.
- `PUT /admin/users/:id` - Update user role or active status.
- `GET /admin/flagged-posts` - Moderation queue.
- `POST /admin/moderate-post/:id` - Approve or delete flagged community post.

