/**
 * Mitti Mitra Agricultural Crop Recommendation Engine
 * Based on Indian Council of Agricultural Research (ICAR) Agro-Climatic Zones
 * and State Agricultural Universities (SAU) Package of Practices.
 */

export const CROP_DATABASE = [
  {
    name: 'Wheat (गेहूं)',
    scientificName: 'Triticum aestivum',
    category: 'Cereal / Food Grain',
    suitableSeasons: ['Rabi (Winter)'],
    suitableSoilTypes: ['Alluvial', 'Clay Loam', 'Sandy Loam', 'Black'],
    optimalPh: { min: 6.0, max: 7.5 },
    nutrientReq: { n: 'medium-to-high', p: 'medium', k: 'medium' },
    waterRequirementMm: '450 - 650 mm (4 - 6 irrigations at critical stages)',
    durationDays: '110 - 130 days',
    states: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar', 'Gujarat'],
    plantingWindow: 'Late October to Mid November',
    estimatedCostPerAcre: 16500,
    expectedYieldRange: '18 - 25 quintals / acre',
    marketPriceOutlook: 'Stable with MSP backing (approx ₹2,275 - ₹2,500/qtl)',
    environmentalBenefits: 'Excellent in rotation with Kharif legumes; straw can be used for mulching or mushroom cultivation.',
    soilConsiderations: 'Requires well-drained fertile loam. Sensitive to waterlogging and severe salinity (EC > 4 dS/m).',
    minIrrigation: 'sprinkler'
  },
  {
    name: 'Paddy / Rice (धान / चावल)',
    scientificName: 'Oryza sativa',
    category: 'Cereal / Food Grain',
    suitableSeasons: ['Kharif (Monsoon)', 'Summer / Boro'],
    suitableSoilTypes: ['Alluvial', 'Clay Loam', 'Black'],
    optimalPh: { min: 5.5, max: 7.2 },
    nutrientReq: { n: 'high', p: 'medium', k: 'medium' },
    waterRequirementMm: '1100 - 1500 mm (High water requiring crop)',
    durationDays: '120 - 145 days',
    states: ['West Bengal', 'Uttar Pradesh', 'Punjab', 'Andhra Pradesh', 'Tamil Nadu', 'Odisha', 'Bihar', 'Chhattisgarh', 'Telangana'],
    plantingWindow: 'June - July (Nursery sowing in late May - June)',
    estimatedCostPerAcre: 21000,
    expectedYieldRange: '20 - 28 quintals / acre',
    marketPriceOutlook: 'High demand, MSP protected (approx ₹2,183 - ₹2,320/qtl)',
    environmentalBenefits: 'Provides substantial biomass; Alternate Wetting and Drying (AWD) reduces methane emissions significantly.',
    soilConsiderations: 'Heavy clay or clay-loam with impermeable hard pan beneath retains water best.',
    minIrrigation: 'flood'
  },
  {
    name: 'Chickpea / Gram (चना)',
    scientificName: 'Cicer arietinum',
    category: 'Pulses / Legume',
    suitableSeasons: ['Rabi (Winter)'],
    suitableSoilTypes: ['Black', 'Alluvial', 'Sandy Loam', 'Red & Yellow'],
    optimalPh: { min: 6.0, max: 7.8 },
    nutrientReq: { n: 'low', p: 'high', k: 'medium' },
    waterRequirementMm: '250 - 350 mm (Low water, drought tolerant)',
    durationDays: '95 - 110 days',
    states: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Uttar Pradesh', 'Karnataka', 'Gujarat'],
    plantingWindow: 'October to early November',
    estimatedCostPerAcre: 11500,
    expectedYieldRange: '7 - 12 quintals / acre',
    marketPriceOutlook: 'High market demand, attractive remunerative prices (₹5,400 - ₹6,200/qtl)',
    environmentalBenefits: 'Biological Nitrogen Fixation (fixes 30-40 kg atmospheric N/ha), enriches soil for succeeding crops.',
    soilConsiderations: 'Requires loose, deep, well-aerated seedbed. Extremely sensitive to waterlogging and salinity.',
    minIrrigation: 'rainfed'
  },
  {
    name: 'Cotton (कपास)',
    scientificName: 'Gossypium hirsutum',
    category: 'Commercial / Cash Crop',
    suitableSeasons: ['Kharif (Monsoon)'],
    suitableSoilTypes: ['Black', 'Alluvial', 'Red & Yellow'],
    optimalPh: { min: 6.5, max: 8.0 },
    nutrientReq: { n: 'high', p: 'medium', k: 'high' },
    waterRequirementMm: '700 - 900 mm',
    durationDays: '150 - 180 days',
    states: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Madhya Pradesh', 'Punjab', 'Haryana', 'Karnataka'],
    plantingWindow: 'May to June',
    estimatedCostPerAcre: 24000,
    expectedYieldRange: '8 - 14 quintals / acre (Kapas)',
    marketPriceOutlook: 'Export commodity with good market prices (₹6,800 - ₹7,800/qtl)',
    environmentalBenefits: 'Deep taproot system opens up hard soil layers; stalk residues can be converted into biochar or briquettes.',
    soilConsiderations: 'Deep black cotton soil (Vertisols) with good water holding capacity is ideal.',
    minIrrigation: 'drip'
  },
  {
    name: 'Mustard / Rapeseed (सरसों)',
    scientificName: 'Brassica juncea',
    category: 'Oilseed',
    suitableSeasons: ['Rabi (Winter)'],
    suitableSoilTypes: ['Sandy Loam', 'Alluvial', 'Clay Loam'],
    optimalPh: { min: 6.0, max: 7.5 },
    nutrientReq: { n: 'medium', p: 'medium', k: 'medium' },
    waterRequirementMm: '300 - 400 mm (2 - 3 irrigations)',
    durationDays: '105 - 125 days',
    states: ['Rajasthan', 'Haryana', 'Madhya Pradesh', 'Uttar Pradesh', 'West Bengal', 'Gujarat'],
    plantingWindow: 'Mid September to late October',
    estimatedCostPerAcre: 11000,
    expectedYieldRange: '7 - 11 quintals / acre',
    marketPriceOutlook: 'High edible oil deficit in India ensures steady prices (₹5,300 - ₹6,000/qtl)',
    environmentalBenefits: 'Attracts honeybees, boosting regional biodiversity and pollination; low chemical pesticide requirement.',
    soilConsiderations: 'Tolerates light soils and mild salinity; requires adequate soil Sulfur for oil synthesis.',
    minIrrigation: 'rainfed'
  },
  {
    name: 'Soybean (सोयाबीन)',
    scientificName: 'Glycine max',
    category: 'Oilseed / Legume',
    suitableSeasons: ['Kharif (Monsoon)'],
    suitableSoilTypes: ['Black', 'Alluvial', 'Clay Loam'],
    optimalPh: { min: 6.0, max: 7.5 },
    nutrientReq: { n: 'low-to-medium', p: 'high', k: 'medium' },
    waterRequirementMm: '500 - 650 mm',
    durationDays: '90 - 105 days',
    states: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Telangana'],
    plantingWindow: 'June 15 to July 10 (with onset of monsoon)',
    estimatedCostPerAcre: 13500,
    expectedYieldRange: '8 - 13 quintals / acre',
    marketPriceOutlook: 'Steady industrial processing and export meal demand (₹4,200 - ₹4,900/qtl)',
    environmentalBenefits: 'Fixes atmospheric nitrogen through symbiotic Rhizobium japonicum nodules; excellent for soil fertility restoration.',
    soilConsiderations: 'Requires well-drained loam to clay loam. Dislikes acidic soils (pH < 5.8).',
    minIrrigation: 'rainfed'
  },
  {
    name: 'Maize / Corn (मक्का)',
    scientificName: 'Zea mays',
    category: 'Cereal / Coarse Grain',
    suitableSeasons: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'],
    suitableSoilTypes: ['Alluvial', 'Red & Yellow', 'Black', 'Sandy Loam'],
    optimalPh: { min: 5.8, max: 7.5 },
    nutrientReq: { n: 'high', p: 'medium', k: 'high' },
    waterRequirementMm: '500 - 700 mm',
    durationDays: '90 - 115 days',
    states: ['Karnataka', 'Madhya Pradesh', 'Bihar', 'Tamil Nadu', 'Telangana', 'Maharashtra', 'Rajasthan', 'Andhra Pradesh'],
    plantingWindow: 'June - July (Kharif), October - November (Rabi)',
    estimatedCostPerAcre: 15000,
    expectedYieldRange: '20 - 30 quintals / acre',
    marketPriceOutlook: 'Surging demand from poultry feed and starch/ethanol industries (₹1,950 - ₹2,400/qtl)',
    environmentalBenefits: 'High biomass producer (C4 crop); efficient photosynthetic energy conversion.',
    soilConsiderations: 'Highly sensitive to waterlogging. Needs friable, fertile, well-aerated soil.',
    minIrrigation: 'sprinkler'
  },
  {
    name: 'Groundnut / Peanut (मूंगफली)',
    scientificName: 'Arachis hypogaea',
    category: 'Oilseed / Legume',
    suitableSeasons: ['Kharif (Monsoon)', 'Zaid (Summer)'],
    suitableSoilTypes: ['Sandy Loam', 'Red & Yellow', 'Alluvial'],
    optimalPh: { min: 6.0, max: 7.0 },
    nutrientReq: { n: 'low', p: 'medium', k: 'medium' },
    waterRequirementMm: '450 - 600 mm',
    durationDays: '105 - 120 days',
    states: ['Gujarat', 'Rajasthan', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka', 'Maharashtra'],
    plantingWindow: 'June - July (Kharif), January - February (Summer)',
    estimatedCostPerAcre: 18000,
    expectedYieldRange: '9 - 15 quintals / acre',
    marketPriceOutlook: 'Premium edible oil and snack industry demand (₹6,000 - ₹7,100/qtl)',
    environmentalBenefits: 'Enriches soil with organic residues and fixed Nitrogen; prevents soil erosion with ground cover.',
    soilConsiderations: 'Requires loose, friable sandy loam so peg penetration and pod development can occur unhindered.',
    minIrrigation: 'sprinkler'
  },
  {
    name: 'Sugarcane (गन्ना)',
    scientificName: 'Saccharum officinarum',
    category: 'Commercial / Cash Crop',
    suitableSeasons: ['Year-round'],
    suitableSoilTypes: ['Alluvial', 'Black', 'Clay Loam'],
    optimalPh: { min: 6.5, max: 7.8 },
    nutrientReq: { n: 'high', p: 'high', k: 'high' },
    waterRequirementMm: '1500 - 2200 mm',
    durationDays: '300 - 360 days',
    states: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Bihar', 'Gujarat', 'Haryana', 'Punjab'],
    plantingWindow: 'February - March (Spring) or October (Autumn)',
    estimatedCostPerAcre: 35000,
    expectedYieldRange: '320 - 450 quintals / acre',
    marketPriceOutlook: 'Assured FRP / SAP state purchase price by sugar mills (₹315 - ₹340/qtl)',
    environmentalBenefits: 'Produces trash that serves as natural mulch; bagasse provides renewable cogeneration power.',
    soilConsiderations: 'Deep, rich loamy soil of at least 1 meter depth. Heavy feeder crop.',
    minIrrigation: 'drip'
  },
  {
    name: 'Tomato (टमाटर)',
    scientificName: 'Solanum lycopersicum',
    category: 'Vegetable / Horticulture',
    suitableSeasons: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)'],
    suitableSoilTypes: ['Sandy Loam', 'Clay Loam', 'Alluvial', 'Red & Yellow'],
    optimalPh: { min: 6.0, max: 7.0 },
    nutrientReq: { n: 'medium', p: 'high', k: 'high' },
    waterRequirementMm: '500 - 600 mm',
    durationDays: '90 - 120 days',
    states: ['Andhra Pradesh', 'Madhya Pradesh', 'Karnataka', 'Gujarat', 'Odisha', 'West Bengal', 'Maharashtra', 'Bihar'],
    plantingWindow: 'July - August (Kharif), October - November (Rabi)',
    estimatedCostPerAcre: 32000,
    expectedYieldRange: '120 - 200 quintals / acre',
    marketPriceOutlook: 'Dynamic prices with potential for high returns (₹1,200 - ₹3,500/qtl depending on arrival cycles)',
    environmentalBenefits: 'High calorie and micronutrient density per unit of land and water.',
    soilConsiderations: 'Well drained sandy loam rich in organic matter. Avoid soils with nematode history.',
    minIrrigation: 'drip'
  },
  {
    name: 'Green Gram / Moong (मूंग)',
    scientificName: 'Vigna radiata',
    category: 'Pulses / Short Duration',
    suitableSeasons: ['Zaid (Summer)', 'Kharif (Monsoon)'],
    suitableSoilTypes: ['Alluvial', 'Sandy Loam', 'Black', 'Red & Yellow'],
    optimalPh: { min: 6.2, max: 7.5 },
    nutrientReq: { n: 'low', p: 'medium', k: 'medium' },
    waterRequirementMm: '250 - 350 mm',
    durationDays: '60 - 70 days',
    states: ['Rajasthan', 'Madhya Pradesh', 'Maharashtra', 'Karnataka', 'Bihar', 'Uttar Pradesh'],
    plantingWindow: 'March (Summer) or June - July (Kharif)',
    estimatedCostPerAcre: 9500,
    expectedYieldRange: '5 - 8 quintals / acre',
    marketPriceOutlook: 'Highest priced pulse with strong MSP support (₹7,500 - ₹8,600/qtl)',
    environmentalBenefits: 'Short 60-day catch crop; fixes Nitrogen, prevents fallow weed growth and fits between Wheat and Paddy.',
    soilConsiderations: 'Avoid waterlogged and saline soils.',
    minIrrigation: 'sprinkler'
  },
  {
    name: 'Pearl Millet / Bajra (बाजरा)',
    scientificName: 'Pennisetum glaucum',
    category: 'Nutri-Cereal / Millet',
    suitableSeasons: ['Kharif (Monsoon)', 'Zaid (Summer)'],
    suitableSoilTypes: ['Sandy Loam', 'Arid / Desert', 'Red & Yellow', 'Alluvial'],
    optimalPh: { min: 6.5, max: 8.0 },
    nutrientReq: { n: 'medium', p: 'low', k: 'low' },
    waterRequirementMm: '250 - 350 mm (Extremely drought hardy)',
    durationDays: '75 - 85 days',
    states: ['Rajasthan', 'Uttar Pradesh', 'Gujarat', 'Haryana', 'Maharashtra', 'Madhya Pradesh'],
    plantingWindow: 'Late June to Mid July',
    estimatedCostPerAcre: 8500,
    expectedYieldRange: '10 - 16 quintals / acre',
    marketPriceOutlook: 'Promoted under Shree Anna initiative with rising health-conscious consumer demand (₹2,200 - ₹2,700/qtl)',
    environmentalBenefits: 'Requires 70% less water than rice; thrives in poor soils with minimal fertilizer; high climate resilience.',
    soilConsiderations: 'Can grow in light sandy soils where other crops fail. Well-drained soil is essential.',
    minIrrigation: 'rainfed'
  }
];

export const recommendCrops = ({
  state,
  district,
  season,
  soilType,
  ph,
  nitrogen,
  phosphorus,
  potassium,
  climate = 'Semi-arid',
  irrigationType = 'flood',
  farmSize = 2,
  farmSizeUnit = 'acres',
  previousCrop = '',
  farmerPreference = ''
}) => {
  const scoredCrops = [];

  for (const crop of CROP_DATABASE) {
    let score = 50; // baseline
    const matchReasons = [];

    // 1. Season match (Critical)
    const normalizedSeason = season ? season.toLowerCase() : '';
    const matchesSeason = crop.suitableSeasons.some((s) => s.toLowerCase().includes(normalizedSeason.split(' ')[0]));
    if (matchesSeason) {
      score += 20;
      matchReasons.push(`Naturally suited for ${season} planting season.`);
    } else {
      score -= 25;
    }

    // 2. State suitability
    if (state && crop.states.some((st) => st.toLowerCase() === state.toLowerCase())) {
      score += 15;
      matchReasons.push(`Agro-climatically proven in ${state}.`);
    }

    // 3. Soil Type match
    if (soilType && soilType !== 'Unknown') {
      const matchesSoil = crop.suitableSoilTypes.some((st) => st.toLowerCase().includes(soilType.toLowerCase()));
      if (matchesSoil) {
        score += 15;
        matchReasons.push(`Well adapted to ${soilType} soil conditions.`);
      } else {
        score -= 10;
      }
    }

    // 4. Soil pH check (if provided from lab test)
    if (ph !== null && ph !== undefined && !isNaN(ph) && ph > 0) {
      if (ph >= crop.optimalPh.min && ph <= crop.optimalPh.max) {
        score += 10;
        matchReasons.push(`Soil pH (${ph}) is within the optimal range (${crop.optimalPh.min} - ${crop.optimalPh.max}).`);
      } else if (Math.abs(ph - crop.optimalPh.min) <= 0.6 || Math.abs(ph - crop.optimalPh.max) <= 0.6) {
        score += 2;
        matchReasons.push(`Soil pH (${ph}) is slightly outside optimal range, manageable with organic amendments.`);
      } else {
        score -= 15;
      }
    }

    // 5. Available soil nutrients (kg/ha when supplied by soil test)
    const nutrientValues = { N: nitrogen, P: phosphorus, K: potassium };
    const deficientNutrients = Object.entries(nutrientValues)
      .filter(([, value]) => value !== null && value !== undefined && !isNaN(value))
      .filter(([nutrient, value]) => {
        if (nutrient === 'N') return value < 280;
        if (nutrient === 'P') return value < 10;
        return value < 110;
      });
    if (deficientNutrients.length > 0) {
      score += Math.min(8, deficientNutrients.length * 2);
      matchReasons.push(`Soil-test values identify ${deficientNutrients.map(([name]) => name).join(', ')} limitation(s); rotation or nutrient management may be considered.`);
    } else if (nitrogen || phosphorus || potassium) {
      score += 4;
      matchReasons.push('Available soil-test nutrient levels support this recommendation.');
    }

    // 6. Climate suitability
    if (climate && climate !== 'Temperate / Mixed') {
      const warmClimates = ['Hot / Tropical', 'Semi-arid', 'Arid / Dry'];
      if (warmClimates.includes(climate) && crop.waterRequirementMm.includes('Low')) {
        score += 8;
        matchReasons.push(`${climate} climate conditions favour this drought-tolerant crop.`);
      } else if (climate === 'Humid / Subtropical' && crop.suitableSeasons.some((item) => item.includes('Kharif'))) {
        score += 8;
        matchReasons.push('Suitable monsoon humidity supports this crop in the selected season.');
      }
    }

    // 6. Irrigation availability & Water compatibility
    if (irrigationType === 'rainfed') {
      if (crop.waterRequirementMm.includes('Low') || crop.waterRequirementMm.includes('250') || crop.waterRequirementMm.includes('300')) {
        score += 10;
        matchReasons.push('Low water requirement makes it suitable for rainfed cultivation.');
      } else if ((crop.name || crop.cropName || '').includes('Paddy') || (crop.name || crop.cropName || '').includes('Sugarcane')) {
        score -= 30; // Cannot grow heavy water crops without irrigation
      }
    } else if (irrigationType === 'drip' || irrigationType === 'sprinkler') {
      score += 5;
      matchReasons.push('Micro-irrigation increases yield efficiency and fertilizer uptake.');
    }

    // 6. Crop rotation compatibility
    if (previousCrop) {
      const prev = previousCrop.toLowerCase();
      // If previous crop was a cereal, recommend legumes
      if ((prev.includes('wheat') || prev.includes('paddy') || prev.includes('rice')) && crop.category.includes('Legume')) {
        score += 12;
        matchReasons.push(`Breaks pest cycles and replenishes soil Nitrogen after previous ${previousCrop} crop.`);
      }
      // Avoid planting the same family consecutively (e.g. Tomato after Potato)
      if (prev.includes('tomato') && (crop.name || crop.cropName || '').includes('Tomato')) {
        score -= 20;
      }
    }

    // Clamp score 0 - 100
    const finalScore = Math.max(10, Math.min(98, score));

    let suitabilityCategory = 'Conditional';
    if (finalScore >= 80) suitabilityCategory = 'Highly Suitable';
    else if (finalScore >= 65) suitabilityCategory = 'Suitable';
    else if (finalScore >= 50) suitabilityCategory = 'Moderately Suitable';

    scoredCrops.push({
      cropName: crop.name,
      scientificName: crop.scientificName,
      suitabilityScore: finalScore,
      suitabilityCategory,
      matchReasons,
      plantingWindow: crop.plantingWindow,
      waterRequirementMm: crop.waterRequirementMm,
      cropDurationDays: crop.durationDays,
      soilConsiderations: crop.soilConsiderations,
      estimatedCostPerAcre: crop.estimatedCostPerAcre,
      expectedYieldRange: crop.expectedYieldRange,
      marketPriceOutlook: crop.marketPriceOutlook,
      environmentalBenefits: crop.environmentalBenefits
    });
  }

  // Sort descending by suitability score
  scoredCrops.sort((a, b) => b.suitabilityScore - a.suitabilityScore);

  const recommendedCrops = scoredCrops.slice(0, 4);
  const alternativeCrops = scoredCrops.slice(4, 7).map((c) => ({
    cropName: c.cropName,
    reason: c.matchReasons[0] || 'Viable alternative crop for your agro-climatic conditions.',
    plantingWindow: c.plantingWindow,
    tradeOffs: `Estimated investment ₹${c.estimatedCostPerAcre.toLocaleString('en-IN')}/acre with duration of ${c.cropDurationDays}.`
  }));

  // Scientific Crop rotation advice
  let cropRotationAdvice = 'Practice 2-year or 3-year crop rotation alternating deep-rooted cereals with nodulating leguminous pulses (such as Chickpea, Moong, or Urad) to maintain soil structure, disrupt weed seedbanks, and restore biological nitrogen reserves naturally.';
  if (previousCrop) {
    cropRotationAdvice = `Following your previous harvest of ${previousCrop}, alternating with a restorative pulse like ${recommendedCrops.find((c) => c.cropName.includes('Gram') || c.cropName.includes('Soybean'))?.cropName || 'Chickpea or Green Gram'} will naturally fix 30-40 kg Nitrogen per hectare and protect against continuous crop pathogen build-up.`;
  }

  return {
    recommendedCrops,
    alternativeCrops,
    cropRotationAdvice
  };
};

