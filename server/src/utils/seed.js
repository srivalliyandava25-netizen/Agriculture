import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import {
  User,
  FarmerProfile,
  SoilReport,
  GovernmentScheme,
  EducationalGuide,
  MarketPrice,
  WeatherAlert,
  FarmingActivity,
  CommunityPost
} from '../models/index.js';

export const seedDatabase = async () => {
  try {
    await connectDB();
    console.log('[Seed] Connected to database. Purging old seed data...');

    // Clear existing collections
    await User.deleteMany({});
    await FarmerProfile.deleteMany({});
    await SoilReport.deleteMany({});
    await GovernmentScheme.deleteMany({});
    await EducationalGuide.deleteMany({});
    await MarketPrice.deleteMany({});
    await WeatherAlert.deleteMany({});
    await FarmingActivity.deleteMany({});
    await CommunityPost.deleteMany({});

    console.log('[Seed] Seeding demo users...');

    // 1. Create Demo Users
    const demoFarmer = await User.create({
      name: 'Ramesh Patel',
      email: 'farmer@mittimitra.org',
      phone: '9876543210',
      password: 'Farmer@123',
      role: 'farmer',
      preferredLanguage: 'en',
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Khed Shivapur',
      active: true
    });

    await FarmerProfile.create({
      user: demoFarmer._id,
      farmLocation: 'Khed Shivapur, Pune, Maharashtra',
      farmSize: 4.5,
      sizeUnit: 'acres',
      soilType: 'Black',
      waterSource: 'Borewell & Canal',
      irrigationType: 'drip',
      cropsGrown: ['Wheat', 'Soybean', 'Tomato'],
      preferredCrops: ['Wheat', 'Chickpea', 'Tomato'],
      farmingPractices: 'mixed',
      preferredUnits: 'acres'
    });

    const demoExpert = await User.create({
      name: 'Dr. Sunita Deshmukh',
      email: 'expert@mittimitra.org',
      phone: '9876543211',
      password: 'Expert@123',
      role: 'expert',
      preferredLanguage: 'en',
      state: 'Maharashtra',
      district: 'Pune',
      village: 'Agricultural University Campus',
      active: true
    });

    const demoAdmin = await User.create({
      name: 'Mitti Mitra Admin',
      email: 'admin@mittimitra.org',
      phone: '9876543212',
      password: 'Admin@123',
      role: 'admin',
      preferredLanguage: 'en',
      state: 'New Delhi',
      district: 'Central Delhi',
      village: 'ICAR Pusa Road',
      active: true
    });

    console.log('[Seed] Seeding verified Government Schemes...');

    // 2. Government Schemes (Verified Indian agricultural schemes)
    await GovernmentScheme.create([
      {
        schemeName: 'Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)',
        code: 'PM-KISAN',
        category: 'financial_support',
        level: 'Central',
        statesApplicable: ['All India'],
        purpose: 'Direct income support of ₹6,000 per year in three equal instalments of ₹2,000 directly into the bank accounts of landholding farmer families.',
        eligibilityCriteria: [
          'All landholding farmer families having cultivable landholding in their names.',
          'Institutional landholders and high-income taxpayers excluded.'
        ],
        benefits: ['₹6,000 annually paid directly via Direct Benefit Transfer (DBT) in April-July, August-November, and December-March cycles.'],
        requiredDocuments: ['Aadhaar Card', 'Land holding papers / Khasra-Khatauni Record of Rights (RoR)', 'Bank passbook copy with active DBT/Aadhaar seeding'],
        applicationProcedure: [
          'Visit official portal https://pmkisan.gov.in or contact Common Service Centre (CSC).',
          'Click on Farmers Corner -> New Farmer Registration.',
          'Input Aadhaar, mobile number, land record details, and submit e-KYC.'
        ],
        officialUrl: 'https://pmkisan.gov.in',
        helpline: '155261 / 011-24300606',
        verifiedDate: new Date('2026-01-15')
      },
      {
        schemeName: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
        code: 'PMFBY',
        category: 'crop_insurance',
        level: 'Central',
        statesApplicable: ['All India'],
        purpose: 'Comprehensive crop insurance coverage against non-preventable natural risks from pre-sowing to post-harvest losses.',
        eligibilityCriteria: [
          'All farmers growing notified crops in notified areas including sharecroppers and tenant farmers.'
        ],
        benefits: [
          'Extremely affordable premium: Only 2.0% for Kharif food/oilseeds, 1.5% for Rabi crops, and 5% for annual commercial/horticultural crops; remaining premium subsidized by Government.'
        ],
        requiredDocuments: ['Sowing certificate from Patwari/Gram Sevak', 'Land possession document / tenancy contract', 'Bank account linked with Aadhaar'],
        applicationProcedure: [
          'Apply through designated commercial banks, Cooperative Societies, CSCs, or PMFBY portal https://pmfby.gov.in before cutoff date for the season.',
          'In case of localized disaster (hailstorm, inundation, landslide), report claim within 72 hours via Crop Insurance App or helpline.'
        ],
        officialUrl: 'https://pmfby.gov.in',
        deadlineNote: 'Seasonal application cutoff varies by crop, state, and insurer; confirm the current date on the official portal or with the bank.',
        helpline: '1800-180-1551',
        verifiedDate: new Date('2026-01-15')
      },
      {
        schemeName: 'Soil Health Card Scheme (मृदा स्वास्थ्य कार्ड)',
        code: 'SHC',
        category: 'soil_health',
        level: 'Central',
        statesApplicable: ['All India'],
        purpose: 'Provides farmers with printed report cards on 12 nutrient parameters of their soil every 2 years along with customized fertilizer dosage.',
        eligibilityCriteria: ['All operational agricultural landholders across India.'],
        benefits: [
          'Free or highly subsidized soil testing for 12 parameters: N, P, K (Macro), S (Secondary), Zn, Fe, Cu, Mn, Bo (Micro), and pH, EC, OC (Physical).',
          'Prevents over-application of Urea, reducing fertilizer costs by 15-20% and improving crop yields.'
        ],
        requiredDocuments: ['Aadhaar or local farmer ID', 'Khasra land parcel survey number'],
        applicationProcedure: [
          'Collect soil samples according to GPS grid protocols or request village agriculture extension assistant.',
          'Submit sample at nearest block Soil Testing Laboratory (STL) or Krishi Vigyan Kendra (KVK).'
        ],
        officialUrl: 'https://soilhealth.dac.gov.in',
        helpline: '1800-180-1551',
        verifiedDate: new Date('2026-01-10')
      },
      {
        schemeName: 'Paramparagat Krishi Vikas Yojana (PKVY)',
        code: 'PKVY',
        category: 'organic_farming',
        level: 'Central',
        statesApplicable: ['All India'],
        purpose: 'Promotes commercial organic farming through cluster approach and Participatory Guarantee System (PGS) certification.',
        eligibilityCriteria: ['Farmers forming clusters of 50 or more farmers having 50 acres of land.'],
        benefits: [
          'Financial assistance of ₹50,000 per hectare over 3 years, of which ₹31,000/ha is directly transferred for organic inputs (seeds, biofertilizers, biopesticides, vermicompost).'
        ],
        requiredDocuments: ['Group cluster formation resolution', 'Farmer identification details and land documents'],
        applicationProcedure: [
          'Form farmer group with local Agriculture Officer / Regional Council under PGS-India.',
          'Register cluster on PGS portal https://pgsindia-ncof.gov.in.'
        ],
        officialUrl: 'https://pgsindia-ncof.gov.in',
        helpline: '0120-2764906',
        verifiedDate: new Date('2026-01-12')
      },
      {
        schemeName: 'Per Drop More Crop - PMKSY (सूक्ष्म सिंचाई योजना)',
        code: 'PMKSY-PDMC',
        category: 'irrigation_water',
        level: 'Central',
        statesApplicable: ['All India'],
        purpose: 'Enhancing water use efficiency through micro-irrigation technologies like drip and sprinkler irrigation systems.',
        eligibilityCriteria: ['All landowning farmers; priority given to Small and Marginal Farmers (SMF).'],
        benefits: [
          'Up to 55% subsidy for Small & Marginal farmers and 45% subsidy for other farmers on the cost of drip and sprinkler irrigation equipment.'
        ],
        requiredDocuments: ['Land 7/12 extract / RoR', 'Electricity connection bill for pump', 'Quotation from authorized micro-irrigation vendor'],
        applicationProcedure: ['Apply online on State Agriculture/Horticulture portal or via District Horticulture Officer (DHO).'],
        officialUrl: 'https://pmksy.gov.in',
        helpline: '1800-180-1551',
        verifiedDate: new Date('2026-01-10')
      },
      {
        schemeName: 'Kisan Credit Card (KCC)',
        code: 'KCC',
        category: 'credit_loan',
        level: 'Central',
        statesApplicable: ['All India'],
        purpose: 'Provides timely short-term credit to farmers for crop cultivation expenses, post-harvest costs, and maintenance of farm assets.',
        eligibilityCriteria: ['All farmers, individual/joint borrowers, tenant farmers, oral lessees, and sharecroppers.'],
        benefits: [
          'Collateral-free loan up to ₹1.60 lakh (extendable to ₹3 lakh with prompt repayment at effective interest rate of only 4% per annum).'
        ],
        requiredDocuments: ['Duly filled application form', 'Identity and address proof', 'Land cultivation certificate'],
        applicationProcedure: ['Apply at your nearest rural/commercial bank branch or via PM-KISAN portal single-page KCC form.'],
        officialUrl: 'https://www.myscheme.gov.in/schemes/kcc',
        helpline: '1800-115-526',
        verifiedDate: new Date('2026-01-05')
      }
    ]);

    console.log('[Seed] Seeding Educational Sustainability Guides...');

    // 3. Educational Guides
    await EducationalGuide.create([
      {
        slug: 'vermicomposting-guide',
        title: 'Step-by-Step Guide to Farm Vermicomposting (केंचुआ खाद निर्माण)',
        category: 'vermicompost',
        shortDescription: 'Transform agricultural residues and cow dung into black gold vermicompost using Eisenia fetida earthworms in 45-60 days.',
        materialsRequired: [
          'Red Wiggler Earthworms (Eisenia fetida) @ 1,000 worms per cubic meter',
          'Semi-decomposed cow dung (10-15 days old to avoid heating)',
          'Dry crop residues, shredded straw, or fallen leaves',
          'Shaded area under thatch roof or nylon green net',
          'Watering can or sprinkler hose'
        ],
        stepByStepInstructions: [
          'Prepare a bed of 10 feet length x 3 feet width x 2 feet height under complete shade.',
          'Lay a bottom bed layer (3 inches) of coarse dry straw and shredded stalks for drainage and aeration.',
          'Add a 6-inch layer of semi-decomposed cow dung mixed with dry biomass (50:50 ratio).',
          'Release 1 to 2 kg of Eisenia fetida worms gently on the surface; they will burrow downward naturally away from light.',
          'Cover the bed with damp gunny bags (burlap) to preserve darkness and humidity.',
          'Sprinkle water every 2-3 days to maintain 60-70% moisture content (cool to touch, no dripping slurry).',
          'After 50-60 days, loose black granular tea-powder-like castings will appear on the top layer.',
          'Stop watering for 3 days prior to harvest to encourage worms to migrate to lower moist layers, then scrape off top vermicompost.'
        ],
        environmentalBenefits: [
          'Recycles 100% of farm organic waste on-site.',
          'Increases soil water holding capacity by up to 25%, cutting irrigation requirements.',
          'Provides rich population of beneficial mycorrhizae and Azotobacter that unlock trapped soil nutrients.'
        ],
        estimatedCost: '₹3,500 for a 10x3 ft permanent brick/tarpaulin bed, lasting multiple years with self-multiplying worms.',
        precautions: [
          'Never use fresh hot cow dung directly; it generates methane heat exceeding 45°C which kills earthworms.',
          'Protect the bed from waterlogging, poultry chickens, and ants (place water moat around bed legs).'
        ],
        suitableConditions: 'Year-round, with optimum worm activity between 20°C and 30°C temperature.',
        references: ['National Centre of Organic Farming (NCOF) Technical Bulletin', 'ICAR Central Soil Salinity Research Institute']
      },
      {
        slug: 'green-manuring-dhaincha',
        title: 'In-Situ Green Manuring with Dhaincha (Sesbania aculeata)',
        category: 'green_manure',
        shortDescription: 'Grow and plow-down biomass to add 60-80 kg natural Nitrogen and 15-20 tons organic matter per hectare.',
        materialsRequired: [
          'Sesbania aculeata (Dhaincha) or Sunnhemp seed @ 20 kg per acre',
          'Rhizobium biofertilizer culture for seed inoculation',
          'Tractor with disc harrow or rotavator for incorporation'
        ],
        stepByStepInstructions: [
          'Sow Dhaincha seeds immediately after pre-monsoon showers (May - June) before primary Kharif crop.',
          'Broadcast seeds into moist field and run light planking to cover seeds 2 cm deep.',
          'Allow crop to grow vigorously for 40 to 45 days until early succulent flowering stage.',
          'Do not allow crop to form hard woody stems or seed pods.',
          'Plow down and incorporate the succulent green biomass into the moist soil using a disc harrow or rotavator.',
          'Submerge the field with light water for 7-10 days to facilitate rapid microbial decomposition before transplanting paddy or sowing main crop.'
        ],
        environmentalBenefits: [
          'Fixes 60-80 kg atmospheric Nitrogen per hectare biologically.',
          'Reclaims saline and alkaline soils by secreting carbonic acid during decomposition.',
          'Smothers stubborn monsoon weeds without chemical herbicides.'
        ],
        estimatedCost: 'Seed investment ₹800 - ₹1,000 per acre; saves ₹2,500 on chemical urea and DAP.',
        precautions: ['Incorporate strictly at 45 days; delaying causes lignification and delays decomposition.'],
        suitableConditions: 'Ideal ahead of Kharif Paddy, Sugarcane, Wheat, or Cotton.',
        references: ['ICAR Indian Institute of Soil Science, Bhopal']
      },
      {
        slug: 'crop-residue-management',
        title: 'Zero-Burn Stubble & Crop Residue Management (फसल अवशेष प्रबंधन)',
        category: 'crop_residue',
        shortDescription: 'Prevent air pollution and conserve soil microbial life by converting paddy and wheat stubble into surface mulch and bio-fertilizer.',
        materialsRequired: [
          'Happy Seeder / Super Seeder or Straw Management System (SMS) attachment',
          'Pusa Bio-Decomposer microbial consortia (fungal capsules / liquid formulation)',
          'Jaggery (gur) and chickpea flour for bio-decomposer activation'
        ],
        stepByStepInstructions: [
          'Harvest paddy with combine harvester fitted with Super SMS to chop and spread straw uniformly.',
          'Direct-sow wheat into the standing stubble using Happy Seeder in a single pass without prior tillage.',
          'The chopped straw acts as protective 3-inch surface mulch, suppressing weed emergence and retaining winter soil moisture.',
          'Alternatively, spray activated Pusa Bio-Decomposer solution (25 litres/acre) over chopped residue and rotavate lightly into soil.',
          'Stubble softens and turns into organic humus in 20-25 days.'
        ],
        environmentalBenefits: [
          'Eliminates smog, greenhouse gas emissions, and severe particulate matter (PM2.5) air pollution.',
          'Preserves 1 kg Nitrogen, 0.5 kg Phosphorus, and 2.5 kg Potassium present in every 100 kg of crop residue.',
          'Saves helpful soil earthworms and predatory insects that are burned during open field fires.'
        ],
        estimatedCost: 'Custom hiring of Happy Seeder costs ₹1,200 - ₹1,500/acre (50-80% subsidized under CRM scheme).',
        precautions: ['Do not flood the field excessively after spraying bio-decomposer; maintain moist aerated condition.'],
        suitableConditions: 'Post-harvest October-November period across Indo-Gangetic Plains and Central India.',
        references: ['Indian Agricultural Research Institute (IARI), Pusa', 'Ministry of Agriculture CRM Guidelines']
      }
    ]);

    console.log('[Seed] Seeding sample Mandi Market Prices...');

    // 4. Sample APMC Mandi Prices across major Indian Agricultural Hubs
    await MarketPrice.create([
      {
        state: 'Maharashtra',
        district: 'Nashik',
        marketName: 'Lasalgaon APMC',
        commodity: 'Onion (प्याज)',
        variety: 'Red Onion / Garva',
        minPrice: 1650,
        maxPrice: 2850,
        modalPrice: 2350,
        unit: '₹ / Quintal',
        trend: 'rising',
        priceDate: new Date(),
        isSampleData: true,
        dataSource: 'APMC Lasalgaon Benchmark Bulletin'
      },
      {
        state: 'Maharashtra',
        district: 'Pune',
        marketName: 'Pune Gultekdi Mandi',
        commodity: 'Tomato (टमाटर)',
        variety: 'Hybrid Vaishali',
        minPrice: 1200,
        maxPrice: 2200,
        modalPrice: 1750,
        unit: '₹ / Quintal',
        trend: 'stable',
        priceDate: new Date(),
        isSampleData: true,
        dataSource: 'Maharashtra State Agricultural Marketing Board (MSAMB)'
      },
      {
        state: 'Madhya Pradesh',
        district: 'Indore',
        marketName: 'Indore APMC (Chhawani)',
        commodity: 'Soybean (सोयाबीन)',
        variety: 'Yellow JS-9560',
        minPrice: 4250,
        maxPrice: 4780,
        modalPrice: 4560,
        unit: '₹ / Quintal',
        trend: 'stable',
        priceDate: new Date(),
        isSampleData: true,
        dataSource: 'MP Mandi Board'
      },
      {
        state: 'Punjab',
        district: 'Ludhiana',
        marketName: 'Khanna Mandi (Asia Largest Grain Market)',
        commodity: 'Wheat (गेहूं)',
        variety: 'HD-3086 / Sharbati',
        minPrice: 2275,
        maxPrice: 2480,
        modalPrice: 2350,
        unit: '₹ / Quintal',
        trend: 'rising',
        priceDate: new Date(),
        isSampleData: true,
        dataSource: 'Punjab Mandi Board'
      },
      {
        state: 'Gujarat',
        district: 'Rajkot',
        marketName: 'Rajkot APMC',
        commodity: 'Cotton (कपास)',
        variety: 'Shankar-6 (Medium-Long Staple)',
        minPrice: 6800,
        maxPrice: 7650,
        modalPrice: 7250,
        unit: '₹ / Quintal',
        trend: 'rising',
        priceDate: new Date(),
        isSampleData: true,
        dataSource: 'Gujarat Agricultural Marketing Board'
      },
      {
        state: 'Rajasthan',
        district: 'Kota',
        marketName: 'Bhamashah Mandi Kota',
        commodity: 'Mustard (सरसों)',
        variety: '42% Oil Content',
        minPrice: 5100,
        maxPrice: 5650,
        modalPrice: 5420,
        unit: '₹ / Quintal',
        trend: 'stable',
        priceDate: new Date(),
        isSampleData: true,
        dataSource: 'Rajasthan Directorate of Agricultural Marketing'
      },
      {
        state: 'Andhra Pradesh',
        district: 'Guntur',
        marketName: 'Guntur Mirchi Yard',
        commodity: 'Chili (लाल मिर्च)',
        variety: 'Teja / Sannam',
        minPrice: 18500,
        maxPrice: 22500,
        modalPrice: 20500,
        unit: '₹ / Quintal',
        trend: 'rising',
        priceDate: new Date(),
        isSampleData: true,
        dataSource: 'Guntur APMC Spices Board'
      }
    ]);

    console.log('[Seed] Seeding sample Soil Reports & Activities...');

    // 5. Sample Soil Report for demo farmer
    await SoilReport.create({
      user: demoFarmer._id,
      farmLocation: 'Khed Shivapur Field 1',
      sampleLocation: 'Block A (North Parcel)',
      currentOrPlannedCrop: 'Wheat',
      season: 'Rabi (Winter)',
      irrigationAvailable: true,
      knownSoilType: 'Black',
      imageUrl: '',
      imageAnalysis: {
        visibleColor: 'Deep Dark Brown / Vertisol',
        textureClass: 'Clay Loam',
        moistureAppearance: 'Good moisture retention',
        organicMatterVisual: 'Residues detected',
        possibleSoilType: 'Black (Regur)',
        confidence: 84,
        isVisualOnly: false,
        visualNotes: 'Black Vertisol soil showing high clay fraction and swelling-shrinkage cracks.'
      },
      isLabTested: true,
      labMeasurements: {
        ph: 7.2,
        nitrogen: 240, // Low (<280)
        phosphorus: 18, // Medium (10-25)
        potassium: 310, // High (>280)
        organicCarbon: 0.62, // Medium (0.5 - 0.75)
        electricalConductivity: 0.45, // Normal (<1.0)
        sulfur: 14,
        zinc: 1.1,
        iron: 6.5
      },
      soilHealthStatus: {
        overallCondition: 'Moderate Soil Fertility - Balanced Supplementation Advised',
        phRating: 'Optimal Neutral (7.2)',
        nRating: 'Deficient (240 kg/ha)',
        pRating: 'Medium (18 kg/ha)',
        kRating: 'High / Sufficient (310 kg/ha)',
        ocRating: 'Adequate (0.62%)',
        ecRating: 'Normal (0.45 dS/m)'
      },
      recommendations: [
        'Available Nitrogen is below the 280 kg/ha threshold. Apply 25% higher initial basal nitrogen or include leguminous green manure in Kharif.',
        'Soil pH is ideal (7.2) for cereal and legume cultivation; no lime or gypsum chemical amendments needed.',
        'Available Potassium is abundant (310 kg/ha). Synthetic MOP can be reduced by 20% to save input costs.'
      ],
      organicAmendments: [
        'Apply 3 tons of FYM or 1.5 tons Vermicompost per acre before pre-sowing plowing.',
        'Treat wheat seeds with Azotobacter biofertilizer to fix 20-25 kg atmospheric Nitrogen naturally.'
      ]
    });

    // 6. Sample Farming Activities for demo farmer
    const now = new Date();
    await FarmingActivity.create([
      {
        user: demoFarmer._id,
        title: 'Wheat: First Irrigation at Crown Root Initiation (CRI)',
        cropName: 'Wheat',
        activityType: 'irrigation',
        dueDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // in 2 days
        priority: 'high',
        notes: 'Critical stage 21 days after sowing. Follow up immediately with first top dressing of Neem-coated Urea.'
      },
      {
        user: demoFarmer._id,
        title: 'Tomato: Yellow Sticky Traps Installation',
        cropName: 'Tomato',
        activityType: 'pest_monitoring',
        dueDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
        priority: 'medium',
        notes: 'Place 15 yellow traps per acre at canopy height to control whiteflies and prevent Leaf Curl Virus.'
      },
      {
        user: demoFarmer._id,
        title: 'Vermicompost Bed Moisture Inspection',
        cropName: 'Organic Yard',
        activityType: 'other',
        dueDate: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
        priority: 'low',
        notes: 'Check moisture level in Bed #2 and sprinkle light water under burlap sacks.'
      }
    ]);

    // 7. Sample Community Posts
    await CommunityPost.create([
      {
        author: demoFarmer._id,
        authorName: demoFarmer.name,
        authorRole: 'farmer',
        title: 'Successful experience with Jeevamrit and Trichoderma on Tomato wilt',
        content:
          'Last season my tomato crop suffered from early root rot and damping off. Instead of repeated chemical drenching, this year I applied fresh Jeevamrit (cow dung, cow urine, jaggery, pulse flour, soil) combined with Trichoderma viride culture every 15 days through drip fertigation. Root vigor is remarkable and plant mortality dropped to zero! Has anyone else tried Jeevamrit in drip systems?',
        category: 'organic_farming',
        likes: [demoExpert._id],
        comments: [
          {
            user: demoExpert._id,
            userName: demoExpert.name,
            text: 'Excellent practice Ramesh ji! Just ensure the Jeevamrit is filtered through a 100-mesh nylon cloth before entering the drip venture to avoid emitter clogging.'
          }
        ]
      },
      {
        author: demoExpert._id,
        authorName: demoExpert.name,
        authorRole: 'expert',
        title: 'Advisory on managing Yellow Rust in Northern and Central Wheat belts',
        content:
          'Dear farmers, with current morning fog and temperature lingering around 12-15°C, keep a close watch on wheat foliage for parallel yellow powdery stripes. If detected, do not wait for the pustules to turn black. Apply Propiconazole 25% EC @ 1 ml per litre of water immediately on calm mornings.',
        category: 'pest_management',
        likes: [demoFarmer._id],
        comments: []
      }
    ]);

    // 8. Sample Weather Alert
    await WeatherAlert.create({
      state: 'Maharashtra',
      district: 'Pune',
      alertType: 'Cold Wave / Frost',
      severity: 'warning',
      advisory: 'Night temperatures expected to drop below 8°C over next 48 hours. Provide light evening irrigation to orchards and winter vegetables to insulate root zones from ground frost.',
      validUntil: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    });

    console.log('[Seed] Database seeding completed successfully!');
    console.log('====================================================');
    console.log('Demo Credentials for Testing:');
    console.log('  Farmer Account: farmer@mittimitra.org / Farmer@123');
    console.log('  Expert Account: expert@mittimitra.org / Expert@123');
    console.log('  Admin Account:  admin@mittimitra.org  / Admin@123');
    console.log('====================================================');

    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();

