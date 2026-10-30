import mongoose from 'mongoose';

const weatherAlertSchema = new mongoose.Schema(
  {
    state: {
      type: String,
      required: true,
      index: true
    },
    district: {
      type: String,
      required: true,
      index: true
    },
    alertType: {
      type: String,
      enum: ['Heavy Rain', 'Heatwave', 'Cold Wave / Frost', 'Strong Winds', 'Dry Spell', 'Hailstorm'],
      required: true
    },
    severity: {
      type: String,
      enum: ['info', 'warning', 'danger'],
      default: 'warning'
    },
    advisory: {
      type: String,
      required: true
    },
    validUntil: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

export const WeatherAlert = mongoose.model('WeatherAlert', weatherAlertSchema);

