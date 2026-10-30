import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 1000
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const communityPostSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    authorName: {
      type: String,
      required: true
    },
    authorRole: {
      type: String,
      default: 'farmer'
    },
    title: {
      type: String,
      required: true,
      maxlength: 200
    },
    content: {
      type: String,
      required: true,
      maxlength: 5000
    },
    category: {
      type: String,
      enum: ['soil_health', 'crop_selection', 'organic_farming', 'pest_management', 'water_conservation', 'market_info'],
      default: 'soil_health'
    },
    imageUrl: {
      type: String,
      default: ''
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    comments: [commentSchema],
    flagged: {
      type: Boolean,
      default: false
    },
    flagReason: String
  },
  { timestamps: true }
);

export const CommunityPost = mongoose.model('CommunityPost', communityPostSchema);

