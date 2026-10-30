import mongoose from 'mongoose';

const farmingExpenseSchema = new mongoose.Schema(
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
    season: {
      type: String,
      default: 'Kharif'
    },
    year: {
      type: Number,
      default: new Date().getFullYear()
    },
    landArea: {
      type: Number,
      required: true
    },
    landUnit: {
      type: String,
      enum: ['acres', 'hectares', 'bigha'],
      default: 'acres'
    },
    seedsCost: { type: Number, default: 0 },
    landPrepCost: { type: Number, default: 0 },
    fertilizersCost: { type: Number, default: 0 },
    organicInputsCost: { type: Number, default: 0 },
    irrigationCost: { type: Number, default: 0 },
    labourCost: { type: Number, default: 0 },
    machineryCost: { type: Number, default: 0 },
    pestManagementCost: { type: Number, default: 0 },
    transportCost: { type: Number, default: 0 },
    otherCost: { type: Number, default: 0 },
    expectedYieldQuantity: { type: Number, required: true },
    yieldUnit: { type: String, default: 'quintals' },
    expectedPricePerUnit: { type: Number, required: true }, // price per quintal
    totalCost: { type: Number, required: true },
    costPerUnitArea: { type: Number, default: 0 },
    grossRevenue: { type: Number, required: true },
    netProfitOrLoss: { type: Number, required: true },
    breakEvenPrice: { type: Number, default: 0 },
    notes: { type: String, default: '' }
  },
  { timestamps: true }
);

export const FarmingExpense = mongoose.model('FarmingExpense', farmingExpenseSchema);

