const mongoose = require('mongoose');

const guideSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  displayName: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    required: true,
    maxlength: 500
  },
  languages: [{
    language: String,
    proficiency: {
      type: String,
      enum: ['basic', 'conversational', 'fluent', 'native']
    }
  }],
  specializations: [{
    type: String
  }],
  cities: [{
    type: String
  }],
  experience: {
    years: Number,
    totalTours: {
      type: Number,
      default: 0
    }
  },
  pricing: {
    hourlyRate: {
      type: Number,
      required: true
    },
    fullDayRate: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'IDR'
    }
  },
  availability: [{
    date: Date,
    slots: [{
      startTime: String,
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false
      }
    }]
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: Date,
    image: String
  }],
  photos: [{
    type: String
  }],
  verified: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

guideSchema.index({ cities: 1, 'rating.average': -1 });
guideSchema.index({ specializations: 1 });
guideSchema.index({ languages: 1 });

module.exports = mongoose.model('Guide', guideSchema);