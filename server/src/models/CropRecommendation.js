import mongoose from 'mongoose';

const cropRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    inputs: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      season: { type: String, required: true },
      soilType: { type: String, required: true },
      ph: { type: Number, default: null },
      nitrogen: { type: Number, default: null },
      phosphorus: { type: Number, default: null },
      potassium: { type: Number, default: null },
      climate: { type: String, default: 'Semi-arid' },
      irrigationType: { type: String, default: 'flood' },
      farmSize: { type: Number, default: 2 },
      farmSizeUnit: { type: String, default: 'acres' },
      previousCrop: { type: String, default: '' },
      farmerPreference: { type: String, default: '' }
    },
    recommendedCrops: [
      {
        cropName: { type: String, required: true },
        scientificName: String,
        suitabilityScore: Number, // 0 - 100
        suitabilityCategory: { type: String, enum: ['Highly Suitable', 'Suitable', 'Moderately Suitable', 'Conditional'] },
        matchReasons: [String],
        plantingWindow: String,
        waterRequirementMm: String,
        cropDurationDays: String,
        soilConsiderations: String,
        estimatedCostPerAcre: Number,
        expectedYieldRange: String,
        marketPriceOutlook: String,
        environmentalBenefits: String
      }
    ],
    alternativeCrops: [
      {
        cropName: String,
        reason: String,
        plantingWindow: String,
        tradeOffs: String
      }
    ],
    cropRotationAdvice: String,
    saved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const CropRecommendation = mongoose.model('CropRecommendation', cropRecommendationSchema);

