import mongoose from 'mongoose';

const educationalGuideSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['composting', 'vermicompost', 'green_manure', 'crop_rotation', 'intercropping', 'pest_management', 'water_conservation', 'crop_residue'],
      required: true
    },
    shortDescription: {
      type: String,
      required: true
    },
    materialsRequired: [String],
    stepByStepInstructions: [String],
    environmentalBenefits: [String],
    estimatedCost: String,
    precautions: [String],
    suitableConditions: String,
    references: [String]
  },
  { timestamps: true }
);

export const EducationalGuide = mongoose.model('EducationalGuide', educationalGuideSchema);

