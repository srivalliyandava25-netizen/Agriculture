import mongoose from 'mongoose';

const farmingActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    title: {
      type: String,
      required: true
    },
    cropName: {
      type: String,
      default: ''
    },
    activityType: {
      type: String,
      enum: ['sowing', 'irrigation', 'fertilizer', 'weeding', 'pest_monitoring', 'harvesting', 'other'],
      default: 'other'
    },
    dueDate: {
      type: Date,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    },
    completedAt: Date,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    notes: {
      type: String,
      default: ''
    },
    reminderSet: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const FarmingActivity = mongoose.model('FarmingActivity', farmingActivitySchema);

