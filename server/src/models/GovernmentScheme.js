import mongoose from 'mongoose';

const governmentSchemeSchema = new mongoose.Schema(
  {
    schemeName: {
      type: String,
      required: true,
      unique: true
    },
    code: {
      type: String,
      required: true,
      unique: true
    },
    category: {
      type: String,
      enum: ['financial_support', 'crop_insurance', 'irrigation_water', 'soil_health', 'organic_farming', 'machinery', 'credit_loan'],
      required: true
    },
    level: {
      type: String,
      enum: ['Central', 'State'],
      default: 'Central'
    },
    statesApplicable: [String],
    purpose: {
      type: String,
      required: true
    },
    eligibilityCriteria: [String],
    benefits: [String],
    requiredDocuments: [String],
    applicationProcedure: [String],
    officialUrl: {
      type: String,
      required: true
    },
    helpline: String,
    applicationDeadline: Date,
    deadlineNote: String,
    verifiedDate: {
      type: Date,
      default: Date.now
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const GovernmentScheme = mongoose.model('GovernmentScheme', governmentSchemeSchema);

