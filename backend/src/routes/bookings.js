const express = require('express');
const router = express.Router();

router.post('/create', async (req, res) => {
  try {
    const { userId, guideId, date, duration, notes } = req.body;
    
    const booking = {
      id: Date.now(),
      userId,
      guideId,
      date,
      duration,
      notes,
      status: 'pending',
      createdAt: new Date()
    };
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    res.json([]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;