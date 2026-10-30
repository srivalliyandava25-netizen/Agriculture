# Mitti Mitra Database Architecture (MongoDB / Mongoose)

## Primary Collections & Schemas

| Collection | Model Name | Primary Indexes | Description |
| :--- | :--- | :--- | :--- |
| `users` | `User` | `email` (sparse), `phone` (sparse) | Stores authentication credentials, hashed passwords, roles (`farmer`, `expert`, `admin`), language preference, state, district. |
| `farmerprofiles` | `FarmerProfile` | `user` (unique) | Holds operational farm attributes: acreage, units, soil type, irrigation type, water source, practices. |
| `soilreports` | `SoilReport` | `user`, `createdAt` | Stores photographic visual observations, laboratory N-P-K & pH measurements, ICAR status, and remedial recommendations. |
| `croprecommendations` | `CropRecommendation` | `user`, `createdAt` | Saved crop recommendation records with ranked suitability scores and crop rotation advice. |
| `fertilizerrecommendations` | `FertilizerRecommendation` | `user` | Calculated chemical (DAP, Urea, MOP) and organic (FYM, Vermicompost) schedules. |
| `diseaseanalyses` | `DiseaseAnalysis` | `user`, `createdAt` | Vision diagnostic history with symptoms, confidence score, organic and chemical controls. |
| `farmingexpenses` | `FarmingExpense` | `user`, `year` | Cultivation expenses, expected yields, market selling prices, net profit/loss, break-even prices. |
| `farmingactivities` | `FarmingActivity` | `user`, `dueDate`, `completed` | Farm calendar tasks (sowing, irrigation, weeding, fertilizer split doses) with reminder flags. |
| `communityposts` | `CommunityPost` | `author`, `category`, `createdAt` | Kisan Chaupal forum posts, comments, likes, and moderation flags. |
| `expertrequests` | `ExpertRequest` | `farmer`, `assignedExpert`, `status` | Agronomist consultation tickets, specialist responses, follow-up threads, and ratings. |
| `marketprices` | `MarketPrice` | `state`, `district`, `commodity`, `priceDate` | APMC mandi wholesale auction prices per quintal and price trends. |
| `governmentschemes` | `GovernmentScheme` | `category`, `code` (unique) | Verified central and state agricultural subsidy and insurance schemes. |
| `educationalguides` | `EducationalGuide` | `slug` (unique), `category` | Step-by-step guides for vermicomposting, green manuring, crop residue management. |
| `damageincidents` | `DamageIncident` | `user`, `incidentDate` | Private farmer records of crop loss from flood, drought, hail with timestamped photos for PMFBY. |
| `notifications` | `Notification` | `user`, `read`, `createdAt` | In-app alerts for weather warnings, task reminders, expert responses, and report updates. |
| `weatheralerts` | `WeatherAlert` | `state`, `district`, `validUntil` | Severe weather warnings and meteorological advisories. |
| `auditlogs` | `AuditLog` | `user`, `timestamp` | Security audit trail of logins, password resets, role changes, and account deletions. |

