import mongoose from 'mongoose';

const expertRequestSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    farmerName: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true,
      maxlength: 150
    },
    cropName: {
      type: String,
      default: ''
    },
    topic: {
      type: String,
      enum: ['soil_issue', 'pest_disease', 'fertilizer_deficiency', 'irrigation', 'market_advisory', 'general'],
      default: 'general'
    },
    description: {
      type: String,
      required: true,
      maxlength: 3000
    },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    imageUrl: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['normal', 'urgent'],
      default: 'normal'
    },
    status: {
      type: String,
      enum: ['submitted', 'assigned', 'in_review', 'answered', 'closed'],
      default: 'submitted'
    },
    assignedExpert: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    expertResponse: {
      diagnosis: String,
      recommendation: String,
      preventiveActions: String,
      answeredAt: Date,
      expertName: String
    },
    followUpMessages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        senderName: String,
        senderRole: String,
        message: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    feedback: String
  },
  { timestamps: true }
);

export const ExpertRequest = mongoose.model('ExpertRequest', expertRequestSchema);

