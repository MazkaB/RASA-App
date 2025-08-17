# 🚀 **Quick Start Guide - RASA**

## ⚡ **Cara Menjalankan Aplikasi**

### **1. Start Backend Server**
```bash
# Terminal 1 - Backend
cd /home/mazka/Documents/AIC/tourist-app-indonesia/backend
npm run dev

# Output yang diharapkan:
# 🔥 Initializing Firebase...
# 🔥 Firebase Admin initialized successfully
# ☁️ Cloud Storage initialized successfully
# ✅ Connected to MongoDB (or Firestore ready)
# Server running on port 5000
```

### **2. Start Mobile App**
```bash
# Terminal 2 - Mobile App
cd /home/mazka/Documents/AIC/tourist-app-indonesia/mobile
expo start --web

# Output yang diharapkan:
# Starting Metro Bundler
# Web app running on http://localhost:19010
# Press w to open in web browser
```

### **3. Test API Health**
```bash
# Terminal 3 - Test API
curl http://localhost:5000/api/health

# Expected response:
{
  "status": "OK",
  "message": "Tourist App API with GCP Integration is running",
  "services": {
    "firebase": "🔥 Ready",
    "vision": "📸 Ready",
    "speech": "🎤 Ready",
    "translate": "🌍 Ready",
    "ai": "🤖 Ready"
  }
}
```

---

## 🎯 **Fitur-Fitur yang Bisa Ditest**

### **1. 🎤 Voice Translation**
**Lokasi:** AI Features → Voice Translation
**Test:**
- Tap microphone icon
- "Speak" (mock recording akan dimulai)
- Tap stop
- Lihat hasil transcription dan translation
- Mock result: "Halo, apa kabar?" → "Hello, how are you?"

### **2. 📸 Photo Landmark Detection**
**Lokasi:** AI Features → Photo Analysis
**Test:**
- Tap "Take Photo" atau "From Gallery"
- Mock photo akan dianalisis
- Lihat hasil landmark detection
- Mock result: "Borobudur Temple" dengan confidence 95%

### **3. 🗺️ AI Itinerary Generator**
**Lokasi:** AI Features → AI Itinerary
**Test:**
- Step 1: Pilih destination (contoh: "Bali"), duration (contoh: "3 days")
- Step 2: Pilih interests (contoh: Culture, Food, Beach)
- Step 3: Set budget ($500) dan group size (2 people)
- Tap "Generate Itinerary"
- Lihat detailed 3-day itinerary dengan activities dan costs

### **4. 🗺️ Maps Integration**
**Lokasi:** Maps tab
**Test:**
- Lihat Google Maps dengan tourist destinations
- Tap markers untuk place details
- Test directions functionality

### **5. 🏠 Home Screen**
**Lokasi:** Home tab
**Test:**
- Lihat welcome message dan quick actions
- Tap quick action cards
- Navigate to other features

---

## 🛠️ **Troubleshooting**

### **Error: "Cannot resolve module"**
```bash
cd mobile
npm install --force
# atau
rm -rf node_modules package-lock.json
npm install
```

### **Error: "Firebase not initialized"**
```bash
# Check environment variables
cat backend/.env | grep FIREBASE
cat mobile/.env | grep EXPO_PUBLIC_FIREBASE
```

### **Error: "API connection failed"**
- Backend tidak berjalan di port 5000
- Check `EXPO_PUBLIC_API_BASE_URL` di mobile/.env
- Test: `curl http://localhost:5000/api/health`

### **Error: "Expo CLI not found"**
```bash
npm install -g @expo/cli
```

---

## 🎨 **Demo Mode Features**

Aplikasi dirancang dengan **fallback demo mode** jika backend tidak tersedia:

### **Backend Available** 🟢
- Real GCP API calls
- Firebase integration
- Live data processing
- Cloud storage upload

### **Demo Mode** 🟡
- Mock responses
- Simulated AI results
- Offline functionality
- UI tetap berfungsi penuh

---

## 📱 **Platform Testing**

### **Web Browser** (Recommended untuk development)
```bash
cd mobile
expo start --web
# Buka http://localhost:19010
```

### **Android APK**
```bash
cd mobile
expo build:android
# atau gunakan existing APK di root folder
```

### **iOS Simulator**
```bash
cd mobile
expo start --ios
```

---

## 🔥 **What You'll See**

### **Home Screen**
- Welcome header dengan gradient
- Quick action cards
- Feature highlights
- Navigation tabs

### **AI Features Screen**
- 3 feature cards dengan gradients
- Voice Translation modal
- Photo Analysis modal
- AI Itinerary wizard

### **Maps Screen**
- Google Maps integration
- Tourist attraction markers
- Place details
- Directions

### **Profile Screen**
- User info
- App features checklist
- Settings

---

## ✅ **Success Indicators**

- [ ] ✅ Backend server running on port 5000
- [ ] ✅ Mobile app accessible on http://localhost:19010
- [ ] ✅ All tabs navigable
- [ ] ✅ AI Features modals open correctly
- [ ] ✅ Mock data displays properly
- [ ] ✅ No console errors
- [ ] ✅ Smooth animations and gradients
- [ ] ✅ Responsive design on all screen sizes

---

## 🚀 **Next Steps untuk Production**

1. **Enable Real GCP APIs** - Setelah setup API keys
2. **Add Camera/Microphone** - Install expo-camera, expo-av
3. **Firebase Auth** - Implement user authentication
4. **Push Notifications** - Setup FCM
5. **App Store Deploy** - Build dengan EAS Build

---

**🎉 Selamat! Aplikasi Tourist Indonesia dengan AI sudah siap digunakan!** 🇮🇩🤖