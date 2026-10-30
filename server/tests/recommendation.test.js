import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';
import { recommendCrops } from '../src/services/recommendationEngine.js';
import { calculateFertilizerPlan } from '../src/services/fertilizerEngine.js';

describe('Agricultural Recommendation Engines Tests', () => {
  beforeAll(async () => {
    await connectDB();
  });

  it('should recommend Rabi crops like Wheat or Mustard for Rabi season in Punjab', () => {
    const result = recommendCrops({
      state: 'Punjab',
      district: 'Ludhiana',
      season: 'Rabi (Winter)',
      soilType: 'Alluvial',
      ph: 7.0,
      irrigationType: 'sprinkler'
    });

    expect(result.recommendedCrops.length).toBeGreaterThan(0);
    const topCropNames = result.recommendedCrops.map((c) => c.cropName);
    const hasRabiCrop = topCropNames.some((n) => n.includes('Wheat') || n.includes('Mustard') || n.includes('Chickpea'));
    expect(hasRabiCrop).toBe(true);
    expect(result.recommendedCrops[0].suitabilityScore).toBeGreaterThanOrEqual(70);
  });

  it('should calculate accurate fertilizer dosages according to ICAR package of practices', () => {
    const plan = calculateFertilizerPlan({
      cropName: 'Wheat',
      landArea: 2,
      landUnit: 'acres',
      labMeasurements: {
        ph: 6.8,
        nitrogen: 210, // Deficient -> adjustment multiplier applied
        phosphorus: 12,
        potassium: 220,
        organicCarbon: 0.55
      }
    });

    expect(plan.cropName).toBe('Wheat');
    expect(plan.landArea).toBe(2);
    expect(plan.nutrientDeficiencies.length).toBeGreaterThan(0);
    expect(plan.chemicalOptions.length).toBeGreaterThan(0);
    expect(plan.organicOptions.length).toBeGreaterThan(0);
    expect(plan.integratedNutrientManagementPlan).toBeDefined();
  });
});

