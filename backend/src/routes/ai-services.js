const express = require('express');
const router = express.Router();
const multer = require('multer');
const gcpServices = require('../services/gcp-services');
const { getFirestore } = require('../config/firebase');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// 🎤 Voice Translation Endpoint
router.post('/voice/translate', async (req, res) => {
  try {
    const { audioBase64, sourceLanguage = 'id', targetLanguage = 'en' } = req.body;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    console.log('🎙️ Processing voice translation request...');

    // Step 1: Transcribe audio to text
    const transcription = await gcpServices.transcribeAudio(audioBase64, sourceLanguage);

    if (!transcription.trim()) {
      return res.status(400).json({ error: 'No speech detected in audio' });
    }

    // Step 2: Translate the transcribed text
    const translation = await gcpServices.translateText(transcription, targetLanguage, sourceLanguage);

    // Step 3: Generate speech for the translation
    const speechAudio = await gcpServices.synthesizeSpeech(
      translation.translatedText, 
      targetLanguage === 'en' ? 'en-US' : 'id-ID'
    );

    res.json({
      success: true,
      originalAudio: audioBase64,
      transcription: transcription,
      translation: translation.translatedText,
      translatedAudio: speechAudio,
      sourceLanguage: translation.sourceLanguage,
      targetLanguage: translation.targetLanguage,
      confidence: translation.confidence
    });

  } catch (error) {
    console.error('❌ Voice translation error:', error);
    res.status(500).json({ 
      error: 'Voice translation failed', 
      message: error.message,
      fallback: {
        message: 'Voice translation temporarily unavailable. Please try text translation.'
      }
    });
  }
});

// 📢 Text-to-Speech Endpoint
router.post('/speech/synthesize', async (req, res) => {
  try {
    const { text, language = 'id-ID', voice = 'id-ID-Standard-A' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('🔊 Synthesizing speech for:', text.substring(0, 50) + '...');

    const audioBase64 = await gcpServices.synthesizeSpeech(text, language, voice);

    res.json({
      success: true,
      text,
      audio: audioBase64,
      language,
      voice
    });

  } catch (error) {
    console.error('❌ Speech synthesis error:', error);
    res.status(500).json({ 
      error: 'Speech synthesis failed', 
      message: error.message 
    });
  }
});

// 📸 Photo Landmark Detection
router.post('/vision/landmark', async (req, res) => {
  try {
    const { imageBase64 } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    console.log('🔍 Processing landmark detection request...');

    const landmarks = await gcpServices.detectLandmarks(imageBase64);

    if (landmarks.length === 0) {
      return res.json({
        success: true,
        landmarks: [],
        message: 'No landmarks detected in this image. Try taking a clearer photo of a famous landmark.'
      });
    }

    // Save detection result to Firestore
    const db = getFirestore();
    await db.collection('landmark_detections').add({
      landmarks,
      detectedAt: new Date().toISOString(),
      userId: req.user?.id || 'anonymous'
    });

    res.json({
      success: true,
      landmarks,
      count: landmarks.length,
      message: `Found ${landmarks.length} landmark(s) in your photo!`
    });

  } catch (error) {
    console.error('❌ Landmark detection error:', error);
    res.status(500).json({ 
      error: 'Landmark detection failed', 
      message: error.message,
      fallback: {
        message: 'Landmark detection temporarily unavailable. Please try again later.'
      }
    });
  }
});

// 🔤 OCR Text Detection and Translation
router.post('/vision/ocr', async (req, res) => {
  try {
    const { imageBase64, targetLanguage = 'en' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    console.log('📝 Processing OCR and translation request...');

    const ocrResult = await gcpServices.detectText(imageBase64);

    if (!ocrResult.text.trim()) {
      return res.json({
        success: true,
        text: '',
        translation: '',
        message: 'No text detected in this image. Try taking a clearer photo of text.'
      });
    }

    res.json({
      success: true,
      originalText: ocrResult.text,
      translatedText: ocrResult.translation,
      confidence: ocrResult.confidence,
      message: 'Text successfully extracted and translated!'
    });

  } catch (error) {
    console.error('❌ OCR error:', error);
    res.status(500).json({ 
      error: 'OCR processing failed', 
      message: error.message 
    });
  }
});

// 🤖 AI Itinerary Generator
router.post('/itinerary/generate', async (req, res) => {
  try {
    const { 
      destination, 
      duration, 
      interests = [], 
      budget = 500, 
      groupSize = 2,
      arrivalDate,
      preferences = {}
    } = req.body;

    if (!destination || !duration) {
      return res.status(400).json({ 
        error: 'Destination and duration are required' 
      });
    }

    console.log(`🗺️ Generating ${duration}-day itinerary for ${destination}...`);

    const userPreferences = {
      destination,
      duration: parseInt(duration),
      interests,
      budget: parseFloat(budget),
      groupSize: parseInt(groupSize),
      arrivalDate,
      ...preferences
    };

    const itinerary = await gcpServices.generateItinerary(userPreferences);

    // Save itinerary to Firestore
    const db = getFirestore();
    const itineraryDoc = await db.collection('generated_itineraries').add({
      ...itinerary,
      userId: req.user?.id || 'anonymous',
      createdAt: new Date().toISOString()
    });

    res.json({
      success: true,
      itinerary: {
        id: itineraryDoc.id,
        ...itinerary
      },
      message: 'Your personalized itinerary has been generated!'
    });

  } catch (error) {
    console.error('❌ Itinerary generation error:', error);
    res.status(500).json({ 
      error: 'Itinerary generation failed', 
      message: error.message 
    });
  }
});

// 💬 Review Sentiment Analysis
router.post('/sentiment/analyze', async (req, res) => {
  try {
    const { text, reviewId } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }

    console.log('😊 Analyzing sentiment for review...');

    const sentiment = await gcpServices.analyzeSentiment(text);

    // Save sentiment analysis result
    const db = getFirestore();
    await db.collection('sentiment_analysis').add({
      text,
      reviewId,
      sentiment,
      analyzedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      sentiment,
      isAppropriate: sentiment.isAppropriate,
      recommendation: sentiment.isAppropriate 
        ? 'Review can be published' 
        : 'Review needs moderation'
    });

  } catch (error) {
    console.error('❌ Sentiment analysis error:', error);
    res.status(500).json({ 
      error: 'Sentiment analysis failed', 
      message: error.message 
    });
  }
});

// 📁 Image Upload with Analysis
router.post('/upload/analyze', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Image file is required' });
    }

    console.log('📤 Processing image upload and analysis...');

    const imageBase64 = req.file.buffer.toString('base64');
    const imageDataUrl = `data:${req.file.mimetype};base64,${imageBase64}`;

    // Parallel processing: upload and analyze
    const [uploadUrl, landmarks, ocrResult] = await Promise.all([
      gcpServices.uploadImage(req.file.buffer, req.file.originalname),
      gcpServices.detectLandmarks(imageDataUrl).catch(() => []),
      gcpServices.detectText(imageDataUrl).catch(() => ({ text: '', translation: '' }))
    ]);

    const analysis = {
      uploadUrl,
      landmarks: landmarks || [],
      extractedText: ocrResult.text || '',
      translation: ocrResult.translation || '',
      hasLandmarks: landmarks && landmarks.length > 0,
      hasText: Boolean(ocrResult.text && ocrResult.text.trim())
    };

    // Save analysis to Firestore
    const db = getFirestore();
    await db.collection('image_analysis').add({
      ...analysis,
      userId: req.user?.id || 'anonymous',
      uploadedAt: new Date().toISOString()
    });

    res.json({
      success: true,
      analysis,
      message: 'Image uploaded and analyzed successfully!'
    });

  } catch (error) {
    console.error('❌ Image upload and analysis error:', error);
    res.status(500).json({ 
      error: 'Image processing failed', 
      message: error.message 
    });
  }
});

// 📊 Get User's AI Activity History
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const db = getFirestore();

    const [itineraries, landmarks, sentiments] = await Promise.all([
      db.collection('generated_itineraries').where('userId', '==', userId).limit(10).get(),
      db.collection('landmark_detections').where('userId', '==', userId).limit(10).get(),
      db.collection('sentiment_analysis').where('userId', '==', userId).limit(10).get()
    ]);

    const history = {
      itineraries: itineraries.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      landmarkDetections: landmarks.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      sentimentAnalysis: sentiments.docs.map(doc => ({ id: doc.id, ...doc.data() })),
      totalActivities: itineraries.size + landmarks.size + sentiments.size
    };

    res.json({
      success: true,
      history,
      message: `Found ${history.totalActivities} AI-powered activities`
    });

  } catch (error) {
    console.error('❌ History retrieval error:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve history', 
      message: error.message 
    });
  }
});

module.exports = router;