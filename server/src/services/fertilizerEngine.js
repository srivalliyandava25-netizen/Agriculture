/**
 * Mitti Mitra Fertilizer & Nutrient Advisory Engine
 * Adheres to ICAR Fertilizer Recommendation Standards & INM (Integrated Nutrient Management)
 */

export const SOIL_STANDARDS = {
  nitrogen: { low: 280, high: 560, unit: 'kg/ha' },
  phosphorus: { low: 10, high: 25, unit: 'kg/ha' },
  potassium: { low: 110, high: 280, unit: 'kg/ha' },
  organicCarbon: { low: 0.5, high: 0.75, unit: '%' },
  ph: { acidic: 6.0, optimalMin: 6.0, optimalMax: 7.5, alkaline: 8.5 },
  electricalConductivity: { normal: 1.0, critical: 2.0, unit: 'dS/m' }
};

export const CROP_NUTRIENT_REQUIREMENTS = {
  Wheat: { n: 120, p: 60, k: 40, fymTonsPerAcre: 4 },
  Paddy: { n: 100, p: 50, k: 50, fymTonsPerAcre: 5 },
  Chickpea: { n: 20, p: 40, k: 20, fymTonsPerAcre: 2 },
  Cotton: { n: 100, p: 50, k: 50, fymTonsPerAcre: 4 },
  Mustard: { n: 80, p: 40, k: 40, fymTonsPerAcre: 3 },
  Soybean: { n: 30, p: 60, k: 40, fymTonsPerAcre: 3 },
  Maize: { n: 120, p: 60, k: 40, fymTonsPerAcre: 4 },
  Groundnut: { n: 25, p: 50, k: 40, fymTonsPerAcre: 3 },
  Sugarcane: { n: 250, p: 100, k: 120, fymTonsPerAcre: 10 },
  Tomato: { n: 100, p: 80, k: 80, fymTonsPerAcre: 8 },
  Default: { n: 80, p: 40, k: 40, fymTonsPerAcre: 4 }
};

export const calculateFertilizerPlan = ({
  cropName = 'Wheat',
  landArea = 1,
  landUnit = 'acres',
  labMeasurements = null,
  isVisualOnly = false
}) => {
  // Area multiplier (convert to acres)
  let acres = Number(landArea) || 1;
  if (landUnit === 'hectares') acres = acres * 2.471;
  if (landUnit === 'bigha') acres = acres * 0.4; // approx standard Pucca Bigha

  // Base key
  let cropKey = 'Default';
  for (const k of Object.keys(CROP_NUTRIENT_REQUIREMENTS)) {
    if (cropName.toLowerCase().includes(k.toLowerCase())) {
      cropKey = k;
      break;
    }
  }
  const baseReq = CROP_NUTRIENT_REQUIREMENTS[cropKey];

  const nutrientDeficiencies = [];
  let nAdj = 1.0;
  let pAdj = 1.0;
  let kAdj = 1.0;

  // Interpret laboratory test measurements if present
  if (labMeasurements && !isVisualOnly) {
    const { nitrogen, phosphorus, potassium, ph, organicCarbon, electricalConductivity } = labMeasurements;

    if (nitrogen !== null && nitrogen !== undefined) {
      if (nitrogen < SOIL_STANDARDS.nitrogen.low) {
        nutrientDeficiencies.push(`Nitrogen is Low (${nitrogen} kg/ha). Crops may exhibit pale yellowing (chlorosis) in older lower leaves.`);
        nAdj = 1.25; // add 25% to base dose
      } else if (nitrogen > SOIL_STANDARDS.nitrogen.high) {
        nutrientDeficiencies.push(`Nitrogen is High (${nitrogen} kg/ha). Reduce chemical nitrogen to prevent lodging and pest infestation.`);
        nAdj = 0.75;
      }
    }

    if (phosphorus !== null && phosphorus !== undefined) {
      if (phosphorus < SOIL_STANDARDS.phosphorus.low) {
        nutrientDeficiencies.push(`Phosphorus is Low (${phosphorus} kg/ha). Root development and early tillering will be stunted.`);
        pAdj = 1.25;
      } else if (phosphorus > SOIL_STANDARDS.phosphorus.high) {
        pAdj = 0.8;
      }
    }

    if (potassium !== null && potassium !== undefined) {
      if (potassium < SOIL_STANDARDS.potassium.low) {
        nutrientDeficiencies.push(`Potassium is Low (${potassium} kg/ha). Leaf margins may show scorching; reduced resistance to drought and disease.`);
        kAdj = 1.2;
      } else if (potassium > SOIL_STANDARDS.potassium.high) {
        kAdj = 0.8;
      }
    }

    if (organicCarbon !== null && organicCarbon !== undefined && organicCarbon < SOIL_STANDARDS.organicCarbon.low) {
      nutrientDeficiencies.push(`Organic Carbon is Depleted (${organicCarbon}%). Critical need for Farmyard Manure (FYM) or green manuring to restore microbial life.`);
    }

    if (ph !== null && ph !== undefined) {
      if (ph < SOIL_STANDARDS.ph.acidic) {
        nutrientDeficiencies.push(`Soil is Acidic (pH ${ph}). Phosphorus and micronutrient availability is bound. Agricultural lime application recommended.`);
      } else if (ph > SOIL_STANDARDS.ph.alkaline) {
        nutrientDeficiencies.push(`Soil is Alkaline/Sodic (pH ${ph}). Micronutrient deficiencies (Zinc/Iron) likely. Gypsum application recommended.`);
      }
    }
  } else {
    nutrientDeficiencies.push('Soil chemical measurements not provided. Using baseline recommended package of practices. Testing your soil sample in an accredited laboratory is strongly advised.');
  }

  // Calculated requirements per acre
  const totalN = Math.round(baseReq.n * nAdj * acres);
  const totalP = Math.round(baseReq.p * pAdj * acres);
  const totalK = Math.round(baseReq.k * kAdj * acres);

  // Common Indian fertilizers:
  // DAP (18-46-0): 100 kg DAP gives 18 kg N and 46 kg P2O5
  // Urea (46-0-0): 100 kg Urea gives 46 kg N
  // MOP (0-0-60): 100 kg MOP gives 60 kg K2O

  const dapKg = Math.round((totalP / 46) * 100);
  const nSuppliedByDap = (dapKg * 18) / 100;
  const remainingN = Math.max(0, totalN - nSuppliedByDap);
  const ureaKg = Math.round((remainingN / 46) * 100);
  const mopKg = Math.round((totalK / 60) * 100);

  const organicOptions = [
    {
      name: 'Well-Decomposed Farmyard Manure (FYM)',
      quantityPerAcre: `${(baseReq.fymTonsPerAcre * acres).toFixed(1)} metric tons (applied across ${acres.toFixed(1)} ${landUnit})`,
      timing: 'Apply 3 to 4 weeks prior to sowing during field preparation and plow into soil.',
      benefits: 'Improves soil water-holding capacity, microbial diversity, and releases micronutrients gradually throughout the season.',
      applicationInstructions: 'Broadcast evenly across the field before the pre-sowing tillage.'
    },
    {
      name: 'Vermicompost (Earthworm Compost)',
      quantityPerAcre: `${(1.5 * acres).toFixed(1)} tons`,
      timing: 'Apply at sowing or into seed furrows.',
      benefits: 'Rich in plant growth-promoting hormones (auxins, gibberellins) and beneficial mycorrhizae.',
      applicationInstructions: 'Apply directly near root zone during sowing or inter-culture.'
    },
    {
      name: 'Neem Cake (Coated organic protection)',
      quantityPerAcre: `${Math.round(100 * acres)} kg`,
      timing: 'Mix with basal fertilizer dose during final land preparation.',
      benefits: 'Acts as a natural nitrification inhibitor (slows nitrogen leaching) and repels subterranean soil nematodes and termites.',
      applicationInstructions: 'Mix thoroughly with FYM or topsoil.'
    },
    {
      name: 'Biofertilizers (Azotobacter / Rhizobium & PSB culture)',
      quantityPerAcre: `${(250 * acres).toFixed(0)} grams per acre seed treatment`,
      timing: 'Seed treatment before sowing.',
      benefits: 'Fixes 20-30 kg atmospheric N/ha and solubilizes native insoluble soil phosphates.',
      applicationInstructions: 'Mix biofertilizer slurry with jaggery water, coat seeds gently in shade 30 mins before sowing.'
    }
  ];

  const chemicalOptions = [
    {
      fertilizerName: 'DAP (Di-Ammonium Phosphate 18:46:0)',
      quantityPerAcre: `${dapKg} kg total for ${acres.toFixed(1)} ${landUnit} (${Math.round(dapKg / acres)} kg/acre)`,
      basalDose: '100% of DAP applied at time of sowing/transplanting',
      splitDoses: 'None (Phosphorus does not leach easily; full dose must be placed near root depth at sowing).',
      timing: 'Basal placement 3-5 cm below seed depth.',
      precautions: 'Do not place in direct physical contact with delicate germinating seeds.'
    },
    {
      fertilizerName: 'Urea (46% Nitrogen)',
      quantityPerAcre: `${ureaKg} kg total for ${acres.toFixed(1)} ${landUnit} (${Math.round(ureaKg / acres)} kg/acre)`,
      basalDose: cropName.toLowerCase().includes('pulse') ? '100% at sowing (starter dose)' : '33% at sowing',
      splitDoses: cropName.toLowerCase().includes('pulse')
        ? 'None needed (pulses fix own N through root nodules)'
        : 'First top dressing (33%) at crown root initiation / first irrigation; Second top dressing (33%) at panicle / flowering stage.',
      timing: 'Top-dress in moist soil following irrigation or rain. Avoid broadcasting in standing water.',
      precautions: 'Never apply urea immediately before heavy rains to prevent leaching loss. Use neem-coated urea.'
    },
    {
      fertilizerName: 'MOP (Muriate of Potash 0:0:60)',
      quantityPerAcre: `${mopKg} kg total for ${acres.toFixed(1)} ${landUnit} (${Math.round(mopKg / acres)} kg/acre)`,
      basalDose: '50% to 100% as basal dose at sowing.',
      splitDoses: 'In light sandy soils, split 50% basal and 50% at active tillering / fruit development.',
      timing: 'Basal application.',
      precautions: 'Important for grain filling, disease resistance, and drought tolerance.'
    }
  ];

  const safetyAndStorageGuidelines = [
    'Store chemical fertilizers in a dry, ventilated, and moisture-free shed elevated on wooden pallets.',
    'Keep bags away from direct sunlight, children, and livestock.',
    'Always wear gloves and a dust mask when handling powdered or dusty fertilizers.',
    'Never mix ammonium fertilizers with slaked lime or rock phosphate during storage.'
  ];

  const overApplicationWarnings = [
    'Excessive Nitrogen leads to succulent, dark green foliage that is highly vulnerable to insect attacks (aphids, armyworms) and fungal rusts, plus stem lodging.',
    'Chemical fertilizer overuse without organic matter degrades beneficial earthworms and destroys natural soil microbial biodiversity.',
    'Nitrate runoff into village ponds and groundwater causes toxic algal blooms and blue-baby syndrome (methemoglobinemia) in local drinking water.'
  ];

  const integratedNutrientManagementPlan = `Adopt the 4R Nutrient Stewardship principle: Right Source, Right Rate, Right Time, and Right Place. Combine 70% recommended inorganic nutrients with 30% organic sources (FYM + Vermicompost + Biofertilizers). This hybrid approach prevents soil acidification, preserves organic carbon reserves, and saves up to 25% on annual cultivation expenses.`;

  return {
    cropName,
    landArea: acres,
    landUnit,
    nutrientDeficiencies,
    organicOptions,
    chemicalOptions,
    integratedNutrientManagementPlan,
    safetyAndStorageGuidelines,
    overApplicationWarnings
  };
};

