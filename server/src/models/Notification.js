import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    type: {
      type: String,
      enum: ['soil_report', 'expert_reply', 'weather_alert', 'activity_reminder', 'community_reply', 'system_update'],
      default: 'system_update'
    },
    title: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: ''
    },
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FarmingActivity'
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

export const Notification = mongoose.model('Notification', notificationSchema);

