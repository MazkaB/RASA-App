# 🚀 **Complete Installation Guide - Tourist App Indonesia with GCP**

## 📋 **What You'll Get**

Setelah setup ini, Anda akan memiliki aplikasi tourist yang sangat canggih dengan fitur:

- **🎤 Voice Translation** - Berbicara dalam bahasa apapun, dengar terjemahan bahasa Indonesia
- **📸 Landmark Detection** - Foto landmark dan dapatkan informasi instant
- **📝 OCR Translation** - Scan teks Indonesia dan translate otomatis
- **🤖 AI Itinerary Generator** - Buat rencana perjalanan dengan AI
- **💬 Smart Review Moderation** - Moderasi review otomatis dengan sentiment analysis
- **🔥 Real-time Firebase Sync** - Data tersinkronisasi real-time di semua device
- **☁️ Serverless Architecture** - Auto-scaling dengan Cloud Functions

---

## 🛠️ **Prerequisites**

### **1. System Requirements**
```bash
# Node.js 18+
node --version  # Should be 18+

# npm 8+
npm --version   # Should be 8+

# Expo CLI
npm install -g @expo/cli
```

### **2. Accounts Needed**
- [ ] **Google Cloud Platform** account dengan $50 free credit
- [ ] **Firebase** project (gunakan GCP project yang sama)
- [ ] **MongoDB Atlas** (opsional - kita menggunakan Firestore)

---

## ⚡ **Quick Start (5 Menit)**

### **Step 1: Clone & Install**
```bash
# Sudah ada di: /home/mazka/Documents/AIC/tourist-app-indonesia
cd /home/mazka/Documents/AIC/tourist-app-indonesia

# Install backend dependencies
cd backend
npm install

# Install mobile dependencies
cd ../mobile
npm install
```

### **Step 2: Setup Environment Files**
```bash
# Backend environment
cd ../backend
cp .env.example .env
# Edit .env file dengan API keys Anda

# Mobile environment
cd ../mobile
cp .env.example .env
# Edit .env file dengan Firebase config Anda
```

### **Step 3: Start Development**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Mobile App
cd mobile
expo start --web
```

---

## 🔧 **Detailed Setup Guide**

### **1. Google Cloud Platform Setup**

#### **A. Create GCP Project**
```bash
# Install gcloud CLI (if not already installed)
# Visit: https://cloud.google.com/sdk/docs/install

# Login and create project
gcloud auth login
gcloud projects create tourist-app-indonesia-2025
gcloud config set project tourist-app-indonesia-2025
```

#### **B. Enable Required APIs**
```bash
# Enable all required APIs
gcloud services enable vision.googleapis.com
gcloud services enable speech.googleapis.com
gcloud services enable texttospeech.googleapis.com
gcloud services enable translate.googleapis.com
gcloud services enable language.googleapis.com
gcloud services enable aiplatform.googleapis.com
gcloud services enable cloudfunctions.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable firestore.googleapis.com
```

#### **C. Create Service Account**
```bash
# Create service account
gcloud iam service-accounts create tourist-app-service \
    --display-name="Tourist App Service Account"

# Grant necessary roles
PROJECT_ID=$(gcloud config get-value project)

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:tourist-app-service@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:tourist-app-service@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/ml.developer"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:tourist-app-service@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Create and download service account key
gcloud iam service-accounts keys create ./backend/tourist-app-service-key.json \
    --iam-account=tourist-app-service@$PROJECT_ID.iam.gserviceaccount.com
```

### **2. Firebase Setup**

#### **A. Create Firebase Project**
1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Select your existing GCP project: `tourist-app-indonesia-2025`
4. Enable Google Analytics (recommended)

#### **B. Configure Firebase Services**
```bash
# Enable Authentication
# - Go to Authentication → Sign-in method
# - Enable Email/Password, Google, Facebook

# Enable Firestore Database
# - Go to Firestore Database → Create database
# - Start in production mode
# - Choose region: us-central1

# Enable Cloud Storage
# - Go to Storage → Get started
# - Start in production mode
# - Choose region: us-central1

# Enable Cloud Messaging
# - Go to Cloud Messaging → Get started
```

#### **C. Get Firebase Config**
1. Go to Project Settings → General
2. Add Web App
3. Copy the config object
4. Go to Service Accounts tab
5. Generate new private key (JSON file)

### **3. API Keys Setup**

#### **A. Get Individual API Keys**
```bash
# Go to Google Cloud Console → APIs & Services → Credentials
# Create API Key and restrict to these APIs:
# - Maps JavaScript API
# - Translation API  
# - Vision API
# - Speech API
```

### **4. Environment Configuration**

#### **A. Backend .env File**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=tourist-app-indonesia-secret-key-2025

# Firebase Configuration (from Firebase console)
FIREBASE_PROJECT_ID=tourist-app-indonesia-2025
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour actual private key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@tourist-app-indonesia-2025.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=123456789012345678901

# Google Cloud APIs
GOOGLE_CLOUD_PROJECT_ID=tourist-app-indonesia-2025
GOOGLE_APPLICATION_CREDENTIALS=./tourist-app-service-key.json

# Individual API Keys (from Google Cloud Console)
GOOGLE_TRANSLATE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_VISION_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_SPEECH_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Vertex AI
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=text-bison@001
```

#### **B. Mobile .env File**
```bash
cd mobile
cp .env.example .env
```

Edit `mobile/.env`:
```env
# Firebase Web Config (from Firebase console)
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tourist-app-indonesia-2025.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tourist-app-indonesia-2025
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tourist-app-indonesia-2025.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxxxxxxxxx

# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## 🧪 **Testing Your Setup**

### **1. Test Backend APIs**
```bash
# Start backend
cd backend
npm run dev

# Test health endpoint
curl http://localhost:5000/api/health
# Should return: {"status":"OK","message":"Tourist App API with GCP Integration is running",...}

# Test AI voice translation
curl -X POST http://localhost:5000/api/ai/voice/translate \
  -H "Content-Type: application/json" \
  -d '{"audioBase64":"test","sourceLanguage":"id","targetLanguage":"en"}'
```

### **2. Test Mobile App**
```bash
# Start mobile app
cd mobile
expo start --web

# Open browser to http://localhost:19010
# Navigate to AI Features tab
# Test each AI feature
```

### **3. Test Individual Features**

#### **Voice Translation**
1. Go to AI Features → Voice Translation
2. Tap microphone and speak in Indonesian
3. Should see transcription and English translation
4. Should hear English audio response

#### **Photo Analysis**
1. Go to AI Features → Photo Analysis
2. Take photo of a landmark or text
3. Should detect landmarks or extract text
4. Should show translations for extracted text

#### **AI Itinerary**
1. Go to AI Features → AI Itinerary
2. Fill in destination, duration, interests
3. Should generate detailed travel plan
4. Should include daily activities and costs

---

## 💰 **Cost Monitoring**

### **Set Up Billing Alerts**
```bash
# Create billing budget
gcloud billing budgets create \
    --billing-account=YOUR_BILLING_ACCOUNT \
    --display-name="Tourist App Budget" \
    --budget-amount=50USD \
    --threshold-rule=percent=50,spend-basis=current-spend \
    --threshold-rule=percent=90,spend-basis=current-spend \
    --all-updates-rule-monitoring-notification-channels=YOUR_EMAIL
```

### **Usage Optimization**
- **Image Optimization**: Images auto-resized before API calls
- **Request Caching**: Implemented for repeated requests
- **Free Tier Maximization**: Firebase Firestore provides generous free tier
- **API Rate Limiting**: Prevents accidental overuse

---

## 🏗️ **Project Structure**

```
tourist-app-indonesia/
├── backend/                          # Express.js API server
│   ├── src/
│   │   ├── config/
│   │   │   └── firebase.js           # Firebase admin configuration
│   │   ├── services/
│   │   │   └── gcp-services.js       # All GCP API integrations
│   │   ├── routes/
│   │   │   └── ai-services.js        # AI endpoints
│   │   └── server.js                 # Main server file
│   ├── .env.example                  # Environment template
│   └── package.json
├── mobile/                           # React Native Expo app
│   ├── config/
│   │   └── firebase.js               # Firebase client configuration
│   ├── services/
│   │   └── GCPService.js             # Frontend GCP service wrapper
│   ├── components/
│   │   ├── VoiceTranslator.js        # Voice translation UI
│   │   ├── LandmarkDetector.js       # Photo analysis UI
│   │   └── AIItineraryGenerator.js   # AI itinerary UI
│   ├── screens/
│   │   └── AIFeaturesScreen.js       # Main AI features screen
│   ├── .env.example                  # Environment template
│   └── package.json
├── GCP-SETUP-GUIDE.md               # Detailed GCP setup
└── README.md                        # Updated with GCP features
```

---

## 🎯 **What's Different Now**

### **New API Endpoints**
```
POST /api/ai/voice/translate         # Voice translation
POST /api/ai/vision/landmark         # Landmark detection  
POST /api/ai/vision/ocr              # OCR text extraction
POST /api/ai/itinerary/generate      # AI itinerary generation
POST /api/ai/sentiment/analyze       # Review sentiment analysis
POST /api/ai/upload/analyze          # Image upload with analysis
GET  /api/ai/history/:userId         # User's AI activity history
```

### **New Mobile Features**
- **AI Features Tab** - Dedicated screen for all AI capabilities
- **Voice Recording** - High-quality audio capture and playback
- **Camera Integration** - Photo capture with real-time analysis
- **Progressive AI Wizard** - Step-by-step itinerary generation
- **Premium Animations** - Smooth gradients and micro-interactions

### **Enhanced Backend**
- **Firebase Integration** - Real-time data synchronization
- **GCP Services** - All major AI APIs integrated
- **Cost Optimization** - Smart image resizing and request caching
- **Error Handling** - Comprehensive fallback mechanisms
- **Monitoring** - Built-in usage tracking and logging

---

## 🆘 **Troubleshooting**

### **Common Issues**

#### **"Firebase Admin SDK error"**
```bash
# Check service account JSON file
ls -la backend/tourist-app-service-key.json

# Verify environment variables
grep FIREBASE_ backend/.env
```

#### **"GCP API not enabled"**
```bash
# Re-enable APIs
gcloud services enable vision.googleapis.com speech.googleapis.com
```

#### **"CORS errors in mobile app"**
```bash
# Update EXPO_PUBLIC_API_BASE_URL in mobile/.env
# Make sure backend is running on correct port
```

#### **"Camera/Microphone permissions"**
- Ensure browser permissions are granted
- For mobile app, permissions are requested automatically

### **Performance Issues**
- **Slow API responses**: Check your internet connection and GCP region
- **High costs**: Review usage in GCP Console → Billing
- **App crashes**: Check Chrome DevTools console for errors

---

## 🎉 **Success Checklist**

- [ ] ✅ Backend server running on http://localhost:5000
- [ ] ✅ Mobile app running on http://localhost:19010  
- [ ] ✅ Firebase console shows active project
- [ ] ✅ GCP APIs returning valid responses
- [ ] ✅ Voice translation working end-to-end
- [ ] ✅ Photo landmark detection working
- [ ] ✅ AI itinerary generation working
- [ ] ✅ Real-time data sync working
- [ ] ✅ Cost monitoring alerts set up

---

## 🚀 **Next Steps**

1. **Customize AI Responses** - Train models with Indonesia-specific data
2. **Add More Languages** - Extend to regional Indonesian languages
3. **Deploy to Production** - Use Firebase Hosting + Cloud Run
4. **Mobile App Store** - Build with EAS and deploy to stores
5. **Analytics Dashboard** - Create admin panel for usage insights

---

**🎯 Congratulations! You now have the most advanced AI-powered tourist app for Indonesia!** 🇮🇩🤖

Need help? Check the logs in your terminal or GCP Console for detailed error messages.