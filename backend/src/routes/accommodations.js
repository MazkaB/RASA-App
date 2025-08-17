const express = require('express');
const router = express.Router();

router.get('/nearby', async (req, res) => {
  try {
    const { lat, lng, radius = 5000 } = req.query;
    
    const mockAccommodations = [
      {
        id: 1,
        name: 'Hotel Indonesia Kempinski',
        type: 'hotel',
        rating: 4.5,
        price: 2500000,
        distance: 1200,
        image: 'hotel1.jpg'
      },
      {
        id: 2,
        name: 'The Hermitage Jakarta',
        type: 'hotel',
        rating: 4.8,
        price: 3500000,
        distance: 800,
        image: 'hotel2.jpg'
      },
      {
        id: 3,
        name: 'Backpacker Hostel Jakarta',
        type: 'hostel',
        rating: 4.2,
        price: 150000,
        distance: 2000,
        image: 'hostel1.jpg'
      }
    ];
    
    res.json(mockAccommodations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;