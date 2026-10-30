import mongoose from 'mongoose';

const damageIncidentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    cropName: {
      type: String,
      required: true
    },
    incidentType: {
      type: String,
      enum: ['Flood', 'Drought', 'Hailstorm', 'Pest Attack', 'Cyclone', 'Excessive Rain', 'Frost', 'Wild Animal Damage', 'Other'],
      required: true
    },
    incidentDate: {
      type: Date,
      required: true
    },
    affectedAreaAcres: {
      type: Number,
      required: true
    },
    estimatedLossPercent: {
      type: Number,
      min: 1,
      max: 100,
      required: true
    },
    cropStageAtDamage: {
      type: String,
      default: 'Vegetative'
    },
    photos: [String],
    surveyConducted: {
      type: Boolean,
      default: false
    },
    insuranceClaimNumber: {
      type: String,
      default: ''
    },
    notes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export const DamageIncident = mongoose.model('DamageIncident', damageIncidentSchema);

