import mongoose from 'mongoose';

const diseaseAnalysisSchema = new mongoose.Schema(
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
    imageUrl: {
      type: String,
      required: true
    },
    diseaseIdentified: {
      type: String,
      required: true
    },
    scientificName: {
      type: String,
      default: ''
    },
    confidence: {
      type: Number,
      default: 0
    },
    isInconclusive: {
      type: Boolean,
      default: false
    },
    symptoms: [String],
    causes: [String],
    organicCures: [String],
    chemicalControls: [String],
    preventiveMeasures: [String],
    safetyDisclaimer: {
      type: String,
      default: 'AI visual screening provides advisory indicators only. Before applying chemical treatments, verify symptoms with your local agricultural officer (KVK/ADO) and adhere to label guidelines.'
    }
  },
  { timestamps: true }
);

export const DiseaseAnalysis = mongoose.model('DiseaseAnalysis', diseaseAnalysisSchema);

