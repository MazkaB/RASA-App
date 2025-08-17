const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/translate', async (req, res) => {
  try {
    const { text, sourceLang, targetLang } = req.body;
    
    // Try Google Translate API first
    if (process.env.GOOGLE_TRANSLATE_API_KEY && process.env.GOOGLE_TRANSLATE_API_KEY !== 'your-google-translate-api-key-here') {
      try {
        const response = await axios.post(
          `https://translation.googleapis.com/language/translate/v2?key=${process.env.GOOGLE_TRANSLATE_API_KEY}`,
          {
            q: text,
            source: sourceLang,
            target: targetLang,
            format: 'text'
          }
        );
        
        const translatedText = response.data.data.translations[0].translatedText;
        
        return res.json({
          originalText: text,
          translatedText,
          sourceLang,
          targetLang,
          provider: 'Google Translate API'
        });
      } catch (apiError) {
        console.log('Google Translate API error, falling back to dictionary:', apiError.message);
      }
    }
    
    // Enhanced translation dictionary for demo
    const translations = {
      'hello': { id: 'halo', en: 'hello' },
      'thank you': { id: 'terima kasih', en: 'thank you' },
      'where is': { id: 'dimana', en: 'where is' },
      'how much': { id: 'berapa harga', en: 'how much' },
      'help': { id: 'tolong', en: 'help' },
      'good morning': { id: 'selamat pagi', en: 'good morning' },
      'good night': { id: 'selamat malam', en: 'good night' },
      'excuse me': { id: 'permisi', en: 'excuse me' },
      'i need help': { id: 'saya butuh bantuan', en: 'i need help' },
      'where is the bathroom': { id: 'dimana kamar mandi', en: 'where is the bathroom' },
      'do you speak english': { id: 'apakah anda bisa bahasa inggris', en: 'do you speak english' },
      'i am lost': { id: 'saya tersesat', en: 'i am lost' },
      'can you help me': { id: 'bisakah anda membantu saya', en: 'can you help me' },
      'where is the hospital': { id: 'dimana rumah sakit', en: 'where is the hospital' },
      'i need a taxi': { id: 'saya butuh taksi', en: 'i need a taxi' },
      'what time is it': { id: 'jam berapa sekarang', en: 'what time is it' },
      'how much does this cost': { id: 'berapa harga ini', en: 'how much does this cost' },
      'water': { id: 'air', en: 'water' },
      'food': { id: 'makanan', en: 'food' },
      'hotel': { id: 'hotel', en: 'hotel' },
      'airport': { id: 'bandara', en: 'airport' },
      'train station': { id: 'stasiun kereta', en: 'train station' },
      'bus station': { id: 'terminal bus', en: 'bus station' },
      'police': { id: 'polisi', en: 'police' },
      'doctor': { id: 'dokter', en: 'doctor' },
      'pharmacy': { id: 'apotek', en: 'pharmacy' }
    };
    
    const translatedText = translations[text.toLowerCase()]?.[targetLang] || text;
    
    res.json({
      originalText: text,
      translatedText,
      sourceLang,
      targetLang,
      provider: 'Fallback Dictionary'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/voice', async (req, res) => {
  try {
    res.json({
      message: 'Voice translation endpoint - to be implemented with Google Speech API'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;