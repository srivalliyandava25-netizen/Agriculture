import mongoose from 'mongoose';

const soilReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    farmLocation: {
      type: String,
      default: ''
    },
    sampleLocation: {
      type: String,
      default: 'Main field'
    },
    currentOrPlannedCrop: {
      type: String,
      default: ''
    },
    season: {
      type: String,
      enum: ['Kharif (Monsoon)', 'Rabi (Winter)', 'Zaid (Summer)', 'Year-round'],
      default: 'Kharif (Monsoon)'
    },
    irrigationAvailable: {
      type: Boolean,
      default: true
    },
    knownSoilType: {
      type: String,
      default: 'Unknown'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    imageAnalysis: {
      visibleColor: { type: String, default: '' },
      textureClass: { type: String, default: '' },
      moistureAppearance: { type: String, default: '' },
      organicMatterVisual: { type: String, default: '' },
      possibleSoilType: { type: String, default: 'Inconclusive' },
      confidence: { type: Number, default: 0 },
      isVisualOnly: { type: Boolean, default: true },
      visualNotes: { type: String, default: '' }
    },
    isLabTested: {
      type: Boolean,
      default: false
    },
    labMeasurements: {
      ph: { type: Number, min: 0, max: 14, default: null },
      nitrogen: { type: Number, min: 0, default: null }, // kg/ha
      phosphorus: { type: Number, min: 0, default: null }, // kg/ha
      potassium: { type: Number, min: 0, default: null }, // kg/ha
      organicCarbon: { type: Number, min: 0, default: null }, // %
      electricalConductivity: { type: Number, min: 0, default: null }, // dS/m
      sulfur: { type: Number, min: 0, default: null }, // ppm
      zinc: { type: Number, min: 0, default: null }, // ppm
      iron: { type: Number, min: 0, default: null } // ppm
    },
    soilHealthStatus: {
      overallCondition: { type: String, default: 'Pending Soil Test' },
      score: { type: Number, min: 0, max: 100, default: null },
      availableIndicators: { type: Number, min: 0, default: 0 },
      phRating: { type: String, default: 'Not Tested' },
      nRating: { type: String, default: 'Not Tested' },
      pRating: { type: String, default: 'Not Tested' },
      kRating: { type: String, default: 'Not Tested' },
      ocRating: { type: String, default: 'Not Tested' },
      ecRating: { type: String, default: 'Not Tested' }
    },
    recommendations: [{ type: String }],
    organicAmendments: [{ type: String }],
    scientificNotes: {
      type: String,
      default: 'Visual observation identifies surface characteristics only. Standard laboratory testing is essential for accurate N-P-K and pH dosage.'
    },
    disclaimer: {
      type: String,
      default: 'Mitti Mitra adheres to ICAR guidelines. Soil photographs cannot reliably measure chemical nutrients (N, P, K, pH). Obtain a Soil Health Card from your nearest laboratory for precise fertilizer rates.'
    }
  },
  { timestamps: true }
);

export const SoilReport = mongoose.model('SoilReport', soilReportSchema);

