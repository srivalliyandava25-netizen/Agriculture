import mongoose from 'mongoose';

const marketPriceSchema = new mongoose.Schema(
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
    marketName: {
      type: String,
      required: true
    },
    commodity: {
      type: String,
      required: true,
      index: true
    },
    variety: {
      type: String,
      default: 'Standard / FAQ'
    },
    minPrice: {
      type: Number,
      required: true
    },
    maxPrice: {
      type: Number,
      required: true
    },
    modalPrice: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      default: '₹ / Quintal'
    },
    trend: {
      type: String,
      enum: ['rising', 'stable', 'falling'],
      default: 'stable'
    },
    priceDate: {
      type: Date,
      default: Date.now
    },
    isSampleData: {
      type: Boolean,
      default: false
    },
    dataSource: {
      type: String,
      default: 'Agmarknet / Directorate of Marketing & Inspection (DMI)'
    }
  },
  { timestamps: true }
);

export const MarketPrice = mongoose.model('MarketPrice', marketPriceSchema);

