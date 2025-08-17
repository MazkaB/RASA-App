import axios from 'axios';
import { Alert } from 'react-native';

class GCPService {
  constructor() {
    this.baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
    this.isRecording = false;
  }

  // 📸 Basic Photo Services (Mock for now)
  async takePhoto() {
    try {
      // Mock photo data for demo
      return {
        uri: 'https://example.com/photo.jpg',
        base64: 'mock-base64-data',
        width: 800,
        height: 600
      };
    } catch (error) {
      Alert.alert('Camera Error', 'Camera feature not available in this demo');
      return null;
    }
  }

  async selectPhoto() {
    try {
      // Mock photo selection for demo
      return {
        uri: 'https://example.com/photo.jpg',
        base64: 'mock-base64-data',
        width: 800,
        height: 600
      };
    } catch (error) {
      Alert.alert('Gallery Error', 'Gallery feature not available in this demo');
      return null;
    }
  }

  // 🏛️ Landmark Detection
  async detectLandmarks(imageBase64) {
    try {
      console.log('🔍 Detecting landmarks...');
      
      const response = await axios.post(`${this.baseURL}/ai/vision/landmark`, {
        imageBase64: imageBase64
      });

      return response.data;
    } catch (error) {
      console.error('❌ Landmark detection failed:', error);
      
      // Return mock data for demo
      return {
        success: true,
        landmarks: [
          {
            name: 'Borobudur Temple',
            confidence: 0.95,
            locations: [
              {
                latitude: -7.6079,
                longitude: 110.2038
              }
            ]
          }
        ],
        message: 'Demo: Found famous Indonesian landmark!'
      };
    }
  }

  // 📝 OCR Text Recognition
  async extractText(imageBase64, targetLanguage = 'en') {
    try {
      console.log('📝 Extracting text from image...');
      
      const response = await axios.post(`${this.baseURL}/ai/vision/ocr`, {
        imageBase64: imageBase64,
        targetLanguage
      });

      return response.data;
    } catch (error) {
      console.error('❌ OCR failed:', error);
      
      // Return mock data for demo
      return {
        success: true,
        originalText: 'Selamat datang di Indonesia',
        translatedText: 'Welcome to Indonesia',
        confidence: 0.9,
        message: 'Demo: Text extracted and translated!'
      };
    }
  }

  // 🎤 Voice Recording & Translation (Mock for now)
  async startRecording() {
    try {
      this.isRecording = true;
      console.log('🎙️ Mock recording started');
      return true;
    } catch (error) {
      Alert.alert('Audio Error', 'Voice recording not available in this demo');
      return false;
    }
  }

  async stopRecording() {
    try {
      this.isRecording = false;
      console.log('⏹️ Mock recording stopped');
      
      return {
        uri: 'mock-audio-uri',
        base64: 'mock-audio-base64'
      };
    } catch (error) {
      Alert.alert('Audio Error', 'Failed to stop voice recording');
      throw error;
    }
  }

  // 🌍 Voice Translation
  async translateVoice(audioBase64, sourceLanguage = 'id', targetLanguage = 'en') {
    try {
      console.log('🎤 Translating voice...');
      
      const response = await axios.post(`${this.baseURL}/ai/voice/translate`, {
        audioBase64: audioBase64,
        sourceLanguage,
        targetLanguage
      });

      return response.data;
    } catch (error) {
      console.error('❌ Voice translation failed:', error);
      
      // Return mock data for demo
      return {
        success: true,
        transcription: 'Halo, apa kabar?',
        translation: 'Hello, how are you?',
        translatedAudio: 'data:audio/mp3;base64,mock-audio',
        sourceLanguage: 'id',
        targetLanguage: 'en',
        confidence: 0.9
      };
    }
  }

  // 📢 Text-to-Speech
  async synthesizeSpeech(text, language = 'id-ID') {
    try {
      console.log('🔊 Synthesizing speech...');

      const response = await axios.post(`${this.baseURL}/ai/speech/synthesize`, {
        text,
        language,
        voice: language === 'en-US' ? 'en-US-Standard-A' : 'id-ID-Standard-A'
      });

      return response.data;
    } catch (error) {
      console.error('❌ Speech synthesis failed:', error);
      
      // Mock response for demo
      Alert.alert('Demo Mode', `Would play: "${text}" in ${language}`);
      return { success: true, text, audio: null };
    }
  }

  // 🤖 AI Itinerary Generation
  async generateItinerary(preferences) {
    try {
      console.log('🗺️ Generating AI itinerary...');
      
      const response = await axios.post(`${this.baseURL}/ai/itinerary/generate`, preferences);
      return response.data;
    } catch (error) {
      console.error('❌ Itinerary generation failed:', error);
      
      // Return mock itinerary for demo
      const mockItinerary = {
        destination: preferences.destination,
        duration: preferences.duration,
        days: [],
        totalEstimatedCost: preferences.budget * 0.8,
        tips: [
          'Learn basic Indonesian phrases like "Terima kasih" (Thank you)',
          'Respect local customs and dress modestly when visiting temples',
          'Try local street food but ensure it\'s from busy stalls',
          'Always negotiate prices in traditional markets'
        ]
      };

      // Generate daily activities
      for (let day = 1; day <= preferences.duration; day++) {
        const dailyActivities = {
          day,
          title: `Day ${day} - ${day === 1 ? 'Arrival & City Exploration' : 'Adventure Day'}`,
          activities: day === 1 ? [
            'Arrive and check into accommodation',
            'Explore local neighborhood and markets',
            'Welcome dinner at traditional restaurant',
            'Evening walk around city center'
          ] : [
            'Visit historical temples or museums',
            'Traditional craft workshop',
            'Local cooking class',
            'Cultural performance in the evening'
          ],
          estimatedCost: preferences.budget * 0.15
        };
        
        mockItinerary.days.push(dailyActivities);
      }

      return {
        success: true,
        itinerary: mockItinerary,
        message: 'Demo: AI itinerary generated!'
      };
    }
  }

  // 💬 Sentiment Analysis for Reviews
  async analyzeSentiment(text, reviewId = null) {
    try {
      console.log('😊 Analyzing sentiment...');
      
      const response = await axios.post(`${this.baseURL}/ai/sentiment/analyze`, {
        text,
        reviewId
      });

      return response.data;
    } catch (error) {
      console.error('❌ Sentiment analysis failed:', error);
      
      // Mock sentiment analysis
      return {
        success: true,
        sentiment: {
          score: 0.7,
          magnitude: 0.8,
          label: 'positive',
          isAppropriate: true
        },
        isAppropriate: true,
        recommendation: 'Review can be published'
      };
    }
  }

  // 🔊 Play Audio from Base64 (Mock)
  async playAudio(audioBase64) {
    try {
      console.log('🔊 Playing audio...');
      Alert.alert('Demo Mode', 'Audio would play here in full version');
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to play audio:', error);
      throw new Error('Failed to play audio');
    }
  }

  // 🛡️ Error Handling with Retry
  async retryRequest(requestFn, maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        console.log(`⚠️ Retry ${i + 1}/${maxRetries} after error:`, error.message);
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  // 📊 Get AI Activity History
  async getAIHistory(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/ai/history/${userId}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to get AI history:', error);
      
      // Mock history data
      return {
        success: true,
        history: {
          itineraries: [],
          landmarkDetections: [],
          sentimentAnalysis: [],
          totalActivities: 0
        },
        message: 'Demo: No history available'
      };
    }
  }

  // Test API Connection
  async testConnection() {
    try {
      const response = await axios.get(`${this.baseURL.replace('/api', '')}/api/health`);
      return response.data;
    } catch (error) {
      console.error('❌ API connection failed:', error);
      return {
        status: 'ERROR',
        message: 'Backend not available - using demo mode',
        services: {
          firebase: '⚠️ Demo',
          vision: '⚠️ Demo',
          speech: '⚠️ Demo',
          translate: '⚠️ Demo',
          ai: '⚠️ Demo'
        }
      };
    }
  }
}

export default new GCPService();