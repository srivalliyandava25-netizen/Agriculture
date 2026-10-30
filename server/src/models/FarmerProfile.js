import mongoose from 'mongoose';

const farmerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    farmLocation: {
      type: String,
      default: ''
    },
    farmSize: {
      type: Number,
      default: 2,
      min: [0, 'Farm size must be positive']
    },
    sizeUnit: {
      type: String,
      enum: ['acres', 'hectares', 'bigha'],
      default: 'acres'
    },
    soilType: {
      type: String,
      enum: ['Alluvial', 'Black', 'Red & Yellow', 'Laterite', 'Arid / Desert', 'Clay Loam', 'Sandy Loam', 'Unknown'],
      default: 'Unknown'
    },
    waterSource: {
      type: String,
      default: 'Borewell'
    },
    irrigationType: {
      type: String,
      enum: ['drip', 'sprinkler', 'flood', 'rainfed'],
      default: 'flood'
    },
    cropsGrown: [{ type: String, trim: true }],
    preferredCrops: [{ type: String, trim: true }],
    farmingPractices: {
      type: String,
      enum: ['conventional', 'organic', 'natural', 'mixed'],
      default: 'conventional'
    },
    preferredUnits: {
      type: String,
      default: 'acres'
    }
  },
  { timestamps: true }
);

export const FarmerProfile = mongoose.model('FarmerProfile', farmerProfileSchema);

