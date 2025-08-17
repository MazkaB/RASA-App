# 🔥 **Complete GCP Setup Guide for Tourist App Indonesia**

## 📋 **Prerequisites Checklist**

### **1. Google Cloud Platform Account**
- [ ] Create GCP account with $50 free credit
- [ ] Enable billing account
- [ ] Create new project: `tourist-app-indonesia`

### **2. Firebase Project Setup**
- [ ] Create Firebase project (use same GCP project)
- [ ] Enable Authentication (Email/Password, Google, Facebook)
- [ ] Enable Firestore Database (production mode)
- [ ] Enable Cloud Storage
- [ ] Enable Cloud Messaging (FCM)
- [ ] Enable Analytics
- [ ] Enable Hosting

### **3. Google Cloud APIs to Enable**
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

## 🔑 **API Keys & Credentials Setup**

### **Step 1: Create Service Account**
```bash
# Create service account
gcloud iam service-accounts create tourist-app-service \
    --display-name="Tourist App Service Account"

# Grant necessary roles
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:tourist-app-service@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:tourist-app-service@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/ml.developer"

gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:tourist-app-service@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

# Create and download service account key
gcloud iam service-accounts keys create ./tourist-app-service-key.json \
    --iam-account=tourist-app-service@PROJECT_ID.iam.gserviceaccount.com
```

### **Step 2: Get Individual API Keys**
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Create API Key for:
   - Maps JavaScript API
   - Translation API
   - Vision API
   - Speech API

### **Step 3: Firebase Configuration**
1. Go to Firebase Console → Project Settings → General
2. Add Web App and get config object
3. Go to Service Accounts tab
4. Generate new private key (JSON)

## 📁 **Environment Variables (.env)**

### **Backend Environment (.env)**
```bash
# Server Configuration
PORT=5000
NODE_ENV=development
JWT_SECRET=tourist-app-indonesia-secret-key-2025

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com

# Google Cloud APIs
GOOGLE_CLOUD_PROJECT_ID=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=./tourist-app-service-key.json

# Individual API Keys
GOOGLE_TRANSLATE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_VISION_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_SPEECH_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Vertex AI
VERTEX_AI_LOCATION=us-central1
VERTEX_AI_MODEL=text-bison@001

# MongoDB (Legacy - will migrate to Firestore)
MONGODB_URI=mongodb://localhost:27017/tourist-app-indonesia
```

### **Mobile Environment**
Create `mobile/.env`:
```bash
# Firebase Web Config
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:xxxxxxxxxxxxxxxxxxxxx

# API Configuration
EXPO_PUBLIC_API_BASE_URL=http://localhost:5000/api
EXPO_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 🔧 **Installation Steps**

### **1. Update Backend Dependencies**
```bash
cd backend
npm install @google-cloud/vision @google-cloud/speech @google-cloud/text-to-speech @google-cloud/translate @google-cloud/language @google-cloud/aiplatform firebase-admin multer
```

### **2. Update Mobile Dependencies**
```bash
cd mobile
npm install firebase expo-camera expo-av expo-speech expo-file-system react-native-voice react-native-sound lottie-react-native react-native-super-grid react-native-shimmer-placeholder
```

### **3. Setup Firebase SDK Files**
Place service account JSON in:
- `backend/tourist-app-service-key.json`
- Add to `.gitignore`

## 🎯 **Features Implementation Checklist**

### **🔥 Phase 1: Firebase Foundation**
- [ ] Firebase Authentication setup
- [ ] Firestore database configuration
- [ ] Cloud Storage for images
- [ ] Push notifications setup

### **🤖 Phase 2: AI Services**
- [ ] Voice Translation (Speech API)
- [ ] Photo Landmark Detection (Vision API)
- [ ] Text OCR and Translation
- [ ] Smart Review Moderation (Natural Language API)
- [ ] AI Itinerary Generator (Vertex AI)

### **📱 Phase 3: Mobile Enhancement**
- [ ] Camera integration for photos
- [ ] Voice recording for translation
- [ ] Real-time notifications
- [ ] Premium UI animations
- [ ] Offline capability

### **☁️ Phase 4: Cloud Infrastructure**
- [ ] Cloud Functions deployment
- [ ] Cloud Storage integration
- [ ] Performance monitoring
- [ ] Cost optimization

## 💰 **Cost Optimization Tips**

### **Free Tier Limits (Per Month)**
- Firebase: 1GB storage, 50k reads, 20k writes
- Vision API: 1,000 requests
- Speech API: 60 minutes
- Translation: 500k characters
- Natural Language: 5k requests
- Vertex AI: $200 credit (first-time users)

### **Cost Monitoring Setup**
1. Set billing alerts at $10, $30, $45
2. Enable detailed billing export
3. Use Cloud Monitoring dashboards
4. Implement request caching
5. Optimize image sizes before API calls

## 🚀 **Testing Guide**

### **1. Test Firebase Connection**
```bash
# Backend test
npm run test:firebase

# Mobile test
expo start --web
```

### **2. Test Individual APIs**
```bash
# Test Vision API
curl -X POST http://localhost:5000/api/vision/landmark \
  -H "Content-Type: application/json" \
  -d '{"imageBase64": "data:image/jpeg;base64,..."}'

# Test Speech API
curl -X POST http://localhost:5000/api/translation/voice \
  -H "Content-Type: application/json" \
  -d '{"audioBase64": "...", "language": "id"}'
```

## 🎨 **UI/UX Enhancement Guide**

### **Design System Implementation**
- Premium color palette with gradients
- Smooth animations with Lottie
- Micro-interactions for better UX
- Loading states with skeletons
- Error boundaries with retry options

### **Animation Libraries**
- `lottie-react-native` for complex animations
- `react-native-reanimated` for performance
- `react-native-shimmer-placeholder` for loading states

## 📊 **Monitoring & Analytics**

### **Setup Firebase Analytics**
- Custom events for feature usage
- User journey tracking
- Performance monitoring
- Crash reporting

### **GCP Monitoring**
- API usage tracking
- Error rate monitoring
- Response time metrics
- Cost analysis

---

## ⚡ **Quick Start Commands**

```bash
# 1. Setup backend
cd backend
npm install
cp .env.example .env  # Add your keys
npm run dev

# 2. Setup mobile
cd mobile
npm install
cp .env.example .env  # Add your Firebase config
expo start --web

# 3. Test everything
npm run test:all
```

**🎯 Ready to build the most advanced tourist app in Indonesia!** 🇮🇩🚀