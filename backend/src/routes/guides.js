const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Get all guides or search with filters
router.get('/', async (req, res) => {
  try {
    const { city, language, specialization } = req.query;
    let filter = {};
    
    if (city) filter.city = new RegExp(city, 'i');
    if (language) filter.languages = { $in: [language] };
    if (specialization) filter.speciality = new RegExp(specialization, 'i');
    
    const db = mongoose.connection.db;
    const guides = await db.collection('guides')
      .find(filter)
      .sort({ rating: -1 })
      .toArray();
    
    res.json(guides);
  } catch (error) {
    console.error('Error fetching guides:', error);
    // Fallback to mock data
    const mockGuides = [
      { 
        id: 1, name: 'Andi Setiawan', languages: ['Indonesian', 'English'], 
        rating: 4.9, reviews: 127, price: 500000, city: 'Jakarta',
        speciality: 'City Tours & Cultural Sites', experience: '5+ years',
        avatar: '👨‍🦱', description: 'Professional guide with deep knowledge of Jakarta history'
      },
      { 
        id: 2, name: 'Sarah Johnson', languages: ['English', 'Indonesian', 'German'], 
        rating: 4.8, reviews: 89, price: 750000, city: 'Bali',
        speciality: 'Adventure & Nature Tours', experience: '7+ years',
        avatar: '👩‍🦰', description: 'Adventure specialist offering unique Bali experiences'
      }
    ];
    res.json(mockGuides);
  }
});

// Get guide by ID
router.get('/:id', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const guide = await db.collection('guides').findOne({
      $or: [
        { _id: new mongoose.Types.ObjectId(req.params.id) },
        { id: parseInt(req.params.id) }
      ]
    });
    
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    
    res.json(guide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get reviews for a guide
router.get('/:id/reviews', async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const reviews = await db.collection('reviews')
      .find({ guideId: req.params.id })
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;