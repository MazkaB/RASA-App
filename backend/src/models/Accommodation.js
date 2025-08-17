const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['hotel', 'hostel', 'guesthouse', 'apartment'],
    required: true
  },
  description: String,
  location: {
    address: String,
    city: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  pricing: {
    currency: {
      type: String,
      default: 'IDR'
    },
    pricePerNight: Number
  },
  amenities: [String],
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  images: [String],
  contact: {
    phone: String,
    email: String,
    website: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Accommodation', accommodationSchema);