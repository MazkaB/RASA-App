const vision = require('@google-cloud/vision');
const speech = require('@google-cloud/speech');
const textToSpeech = require('@google-cloud/text-to-speech');
const { Translate } = require('@google-cloud/translate').v2;
const language = require('@google-cloud/language');
const { PredictionServiceClient } = require('@google-cloud/aiplatform');
const { getStorageBucket } = require('../config/firebase');
const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');

// Initialize GCP clients
const visionClient = new vision.ImageAnnotatorClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const speechClient = new speech.SpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const ttsClient = new textToSpeech.TextToSpeechClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const translateClient = new Translate({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const languageClient = new language.LanguageServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

const predictionClient = new PredictionServiceClient({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS
});

class GCPServices {
  // 📸 Vision API - Landmark Detection
  async detectLandmarks(imageBase64) {
    try {
      console.log('🔍 Detecting landmarks in image...');
      
      // Remove data URL prefix if present
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      // Optimize image size to reduce API costs
      const optimizedImage = await sharp(imageBuffer)
        .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toBuffer();

      const [result] = await visionClient.landmarkDetection({
        image: { content: optimizedImage }
      });

      const landmarks = result.landmarkAnnotations || [];
      console.log(`✅ Found ${landmarks.length} landmarks`);

      return landmarks.map(landmark => ({
        name: landmark.description,
        confidence: landmark.score,
        locations: landmark.locations?.map(loc => ({
          latitude: loc.latLng.latitude,
          longitude: loc.latLng.longitude
        })) || [],
        boundingBox: landmark.boundingPoly
      }));
    } catch (error) {
      console.error('❌ Landmark detection error:', error);
      throw new Error('Failed to detect landmarks');
    }
  }

  // 🔤 Vision API - OCR Text Detection
  async detectText(imageBase64) {
    try {
      console.log('📝 Extracting text from image...');
      
      const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Data, 'base64');

      const optimizedImage = await sharp(imageBuffer)
        .resize(1200, 900, { fit: 'inside', withoutEnlargement: true })
        .png()
        .toBuffer();

      const [result] = await visionClient.textDetection({
        image: { content: optimizedImage }
      });

      const textAnnotations = result.textAnnotations;
      if (!textAnnotations || textAnnotations.length === 0) {
        return { text: '', translations: [] };
      }

      const extractedText = textAnnotations[0].description;
      console.log('✅ Text extracted:', extractedText.substring(0, 100) + '...');

      // Auto-translate extracted text
      const translation = await this.translateText(extractedText, 'en');
      
      return {
        text: extractedText,
        translation: translation.translatedText,
        confidence: result.textAnnotations[0].confidence || 0.9
      };
    } catch (error) {
      console.error('❌ Text detection error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  // 🎤 Speech API - Voice Translation
  async transcribeAudio(audioBase64, languageCode = 'id') {
    try {
      console.log('🎙️ Transcribing audio...');
      
      const audioBytes = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');

      const request = {
        audio: { content: audioBytes },
        config: {
          encoding: 'WEBM_OPUS',
          sampleRateHertz: 48000,
          languageCode: languageCode,
          enableAutomaticPunctuation: true,
          model: 'latest_long'
        }
      };

      const [response] = await speechClient.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      console.log('✅ Transcription completed:', transcription);
      return transcription;
    } catch (error) {
      console.error('❌ Speech transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  // 📢 Text-to-Speech API
  async synthesizeSpeech(text, languageCode = 'id-ID', voiceName = 'id-ID-Standard-A') {
    try {
      console.log('🔊 Synthesizing speech...');

      const request = {
        input: { text },
        voice: {
          languageCode,
          name: voiceName,
          ssmlGender: 'NEUTRAL'
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.9,
          pitch: 0
        }
      };

      const [response] = await ttsClient.synthesizeSpeech(request);
      const audioBase64 = response.audioContent.toString('base64');
      
      console.log('✅ Speech synthesis completed');
      return `data:audio/mp3;base64,${audioBase64}`;
    } catch (error) {
      console.error('❌ Speech synthesis error:', error);
      throw new Error('Failed to synthesize speech');
    }
  }

  // 🌍 Translation API
  async translateText(text, targetLanguage = 'en', sourceLanguage = 'auto') {
    try {
      console.log(`🌐 Translating text to ${targetLanguage}...`);

      const [translation] = await translateClient.translate(text, {
        from: sourceLanguage === 'auto' ? undefined : sourceLanguage,
        to: targetLanguage
      });

      const [detection] = await translateClient.detect(text);
      
      return {
        originalText: text,
        translatedText: translation,
        sourceLanguage: detection.language,
        targetLanguage,
        confidence: detection.confidence
      };
    } catch (error) {
      console.error('❌ Translation error:', error);
      throw new Error('Failed to translate text');
    }
  }

  // 💬 Natural Language API - Sentiment Analysis
  async analyzeSentiment(text) {
    try {
      console.log('😊 Analyzing sentiment...');

      const document = {
        content: text,
        type: 'PLAIN_TEXT'
      };

      const [result] = await languageClient.analyzeSentiment({ document });
      const sentiment = result.documentSentiment;

      const sentimentLabel = sentiment.score > 0.1 ? 'positive' : 
                           sentiment.score < -0.1 ? 'negative' : 'neutral';

      console.log(`✅ Sentiment analysis completed: ${sentimentLabel}`);
      
      return {
        score: sentiment.score,
        magnitude: sentiment.magnitude,
        label: sentimentLabel,
        isAppropriate: sentiment.score > -0.7 && sentiment.magnitude < 3.0
      };
    } catch (error) {
      console.error('❌ Sentiment analysis error:', error);
      throw new Error('Failed to analyze sentiment');
    }
  }

  // 🤖 Vertex AI - Itinerary Generation
  async generateItinerary(userPreferences) {
    try {
      console.log('🗺️ Generating AI itinerary...');

      const { destination, duration, interests, budget, groupSize } = userPreferences;
      
      const prompt = `Create a detailed ${duration}-day itinerary for ${groupSize} people visiting ${destination}, Indonesia. 
      Interests: ${interests.join(', ')}
      Budget: ${budget} USD per person
      
      Include:
      - Daily activities with time slots
      - Recommended restaurants and local food
      - Transportation suggestions
      - Estimated costs
      - Cultural tips and etiquette
      - Must-visit landmarks and hidden gems
      
      Format the response as a structured JSON with days, activities, costs, and tips.`;

      // Using text-bison model for itinerary generation
      const endpoint = `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/${process.env.VERTEX_AI_LOCATION || 'us-central1'}/publishers/google/models/text-bison@001`;

      const instances = [{
        prompt: prompt,
        max_output_tokens: 2048,
        temperature: 0.7,
        top_p: 0.8,
        top_k: 40
      }];

      const request = {
        endpoint,
        instances
      };

      try {
        const [response] = await predictionClient.predict(request);
        const generatedText = response.predictions[0].content;
        
        console.log('✅ AI itinerary generated successfully');
        
        // Parse and structure the response
        return {
          destination,
          duration,
          generatedItinerary: generatedText,
          preferences: userPreferences,
          generatedAt: new Date().toISOString()
        };
      } catch (vertexError) {
        console.log('⚠️ Vertex AI unavailable, using fallback itinerary generator...');
        return this.generateFallbackItinerary(userPreferences);
      }
    } catch (error) {
      console.error('❌ Itinerary generation error:', error);
      return this.generateFallbackItinerary(userPreferences);
    }
  }

  // Fallback itinerary generator
  generateFallbackItinerary(userPreferences) {
    const { destination, duration, interests, budget } = userPreferences;
    
    const itinerary = {
      destination,
      duration,
      days: [],
      totalEstimatedCost: budget * 0.8,
      tips: [
        "Learn basic Indonesian phrases like 'Terima kasih' (Thank you)",
        "Respect local customs and dress modestly when visiting temples",
        "Try local street food but ensure it's from busy stalls",
        "Always negotiate prices in traditional markets",
        "Keep copies of important documents"
      ]
    };

    // Generate daily activities based on interests
    for (let day = 1; day <= duration; day++) {
      const dailyActivities = this.generateDailyActivities(destination, interests, budget, day);
      itinerary.days.push({
        day,
        title: `Day ${day} - ${dailyActivities.theme}`,
        activities: dailyActivities.activities,
        estimatedCost: dailyActivities.cost
      });
    }

    return itinerary;
  }

  generateDailyActivities(destination, interests, budget, day) {
    const activities = {
      1: {
        theme: "Arrival & City Exploration",
        activities: [
          "Arrive and check into accommodation",
          "Explore local neighborhood and markets",
          "Welcome dinner at traditional restaurant",
          "Evening walk around city center"
        ],
        cost: budget * 0.15
      },
      2: {
        theme: interests.includes('culture') ? "Cultural Heritage" : "Adventure Day",
        activities: interests.includes('culture') ? [
          "Visit historical temples or museums",
          "Traditional craft workshop",
          "Local cooking class",
          "Cultural performance in the evening"
        ] : [
          "Outdoor adventure activity",
          "Nature exploration",
          "Local sports or activities",
          "Sunset viewing spot"
        ],
        cost: budget * 0.2
      }
    };

    return activities[day] || {
      theme: "Flexible Day",
      activities: [
        "Personalized activities based on preferences",
        "Free time for individual exploration",
        "Shopping for souvenirs",
        "Relaxation and leisure"
      ],
      cost: budget * 0.1
    };
  }

  // 📁 Cloud Storage - Upload Images
  async uploadImage(imageBuffer, fileName) {
    try {
      console.log('📤 Uploading image to Cloud Storage...');
      
      const bucket = getStorageBucket();
      const uniqueFileName = `${uuidv4()}-${fileName}`;
      const file = bucket.file(`tourist-photos/${uniqueFileName}`);

      await file.save(imageBuffer, {
        metadata: {
          contentType: 'image/jpeg',
          cacheControl: 'public, max-age=31536000'
        }
      });

      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${file.name}`;
      
      console.log('✅ Image uploaded successfully:', publicUrl);
      return publicUrl;
    } catch (error) {
      console.error('❌ Image upload error:', error);
      throw new Error('Failed to upload image');
    }
  }
}

module.exports = new GCPServices();