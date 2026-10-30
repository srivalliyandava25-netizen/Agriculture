import mongoose from 'mongoose';

const fertilizerRecommendationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    soilReport: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SoilReport',
      default: null
    },
    cropName: {
      type: String,
      required: true
    },
    landArea: {
      type: Number,
      required: true
    },
    landUnit: {
      type: String,
      default: 'acres'
    },
    nutrientDeficiencies: [String],
    organicOptions: [
      {
        name: String,
        quantityPerAcre: String,
        timing: String,
        benefits: String,
        applicationInstructions: String
      }
    ],
    chemicalOptions: [
      {
        fertilizerName: String,
        quantityPerAcre: String,
        basalDose: String,
        splitDoses: String,
        timing: String,
        precautions: String
      }
    ],
    integratedNutrientManagementPlan: String,
    safetyAndStorageGuidelines: [String],
    overApplicationWarnings: [String],
    disclaimer: {
      type: String,
      default: 'Recommendations are based on standard ICAR state-wise nutrient packages of practices. Calibrate precisely based on verified lab Soil Health Card measurements.'
    }
  },
  { timestamps: true }
);

export const FertilizerRecommendation = mongoose.model('FertilizerRecommendation', fertilizerRecommendationSchema);

