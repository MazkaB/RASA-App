# 🗺️ **Google Maps API Integration Setup**

## 📋 **Overview**

RASA sekarang telah terintegrasi dengan **Google Maps API** untuk menyediakan:
- **Real-time Maps** dengan lokasi destinasi wisata
- **Location Services** dan geolocation 
- **Places API** untuk mencari tempat wisata terdekat
- **Directions API** untuk navigasi
- **Geocoding API** untuk konversi alamat ke koordinat

---

## 🔑 **Setup Google Maps API Key**

### **1. Buat Project di Google Cloud Console**

1. **Kunjungi Google Cloud Console**
   ```
   https://console.cloud.google.com/
   ```

2. **Create New Project**
   - Klik "Select a project" → "New Project"
   - Project Name: `rasa`
   - Klik "Create"

### **2. Enable Required APIs**

Aktifkan API berikut di Google Cloud Console:

1. **Maps SDK for Android** (untuk mobile app)
2. **Maps SDK for iOS** (untuk iOS support)  
3. **Maps JavaScript API** (untuk web support)
4. **Places API** (untuk mencari tempat)
5. **Directions API** (untuk navigasi)
6. **Geocoding API** (untuk konversi alamat)
7. **Maps Static API** (untuk static maps)

**Cara Enable:**
```
Google Cloud Console → APIs & Services → Library
Search masing-masing API → Enable
```

### **3. Create API Key**

1. **Navigate to Credentials**
   ```
   Google Cloud Console → APIs & Services → Credentials
   ```

2. **Create Credentials**
   - Klik "Create Credentials" → "API Key"
   - Copy API Key yang dibuat
   - API Key format: `AIzaSyBd...`

3. **Restrict API Key (Recommended)**
   - Edit API Key yang telah dibuat
   - **Application restrictions**: HTTP referrers atau Android apps
   - **API restrictions**: Pilih APIs yang telah diaktifkan

---

## ⚙️ **Configuration dalam Project**

### **1. Update Environment Variables**

Edit file `/backend/.env`:
```env
# Google Cloud APIs
GOOGLE_MAPS_API_KEY=AIzaSyBd_your_actual_api_key_here
GOOGLE_TRANSLATE_API_KEY=AIzaSyBd_your_actual_api_key_here

# Alternative: Service Account (more secure)
# GOOGLE_APPLICATION_CREDENTIALS=./google-service-account.json
# GOOGLE_PROJECT_ID=rasa
```

### **2. Restart Backend Server**

```bash
cd backend
npm run dev
```

Backend akan otomatis menggunakan Google API jika keys tersedia.

---

## 🧪 **Testing API Integration**

### **1. Test Translation API**
```bash
curl -X POST http://localhost:5000/api/translation/translate \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, welcome to Indonesia",
    "sourceLang": "en", 
    "targetLang": "id"
  }'
```

**Expected Response:**
```json
{
  "originalText": "Hello, welcome to Indonesia",
  "translatedText": "Halo, selamat datang di Indonesia", 
  "sourceLang": "en",
  "targetLang": "id",
  "provider": "Google Translate API"
}
```

### **2. Test Maps Nearby Places API**
```bash
curl "http://localhost:5000/api/maps/nearby-places?lat=-6.2088&lng=106.8456&radius=5000&type=tourist_attraction"
```

**Expected Response:**
```json
{
  "places": [
    {
      "id": "ChIJqwS8fHoaGzERm9HhrEhQgQQ",
      "name": "Monas",
      "latitude": -6.1754,
      "longitude": 106.8272,
      "rating": 4.2,
      "types": ["tourist_attraction"],
      "vicinity": "Central Jakarta"
    }
  ],
  "provider": "Google Maps Places API"
}
```

### **3. Test Geocoding API**
```bash
curl "http://localhost:5000/api/maps/geocode?address=Monas+Jakarta"
```

---

## 📱 **Mobile App Integration**

### **1. Maps Screen Features**

Mobile app sekarang memiliki **MapScreen** dengan fitur:

✅ **Interactive Google Maps**
- Real-time user location 
- Tourist destination markers
- Custom marker designs dengan emoji

✅ **Location Services**  
- Auto-detect current location
- Permission handling
- Distance calculation

✅ **Place Information**
- Destination details in callouts
- Ratings dan categories
- Distance from user location
- Get Directions button

✅ **Navigation Controls**
- Center on user location
- Quick destination buttons  
- Map type selector (Standard/Satellite/Hybrid)
- Floating action buttons

### **2. Navigation Integration**

MapScreen terintegrasi dalam Tab Navigation:
```
Home → Guides → Maps → Translate → Profile
```

Icon: `map` dan `map-outline` dari Ionicons

---

## 🌍 **API Endpoints Summary**

### **Maps API Routes (`/api/maps/`)**

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/nearby-places` | GET | Cari tempat wisata terdekat |
| `/place-details/:id` | GET | Detail tempat berdasarkan ID |
| `/directions` | GET | Rute navigasi antar lokasi |
| `/geocode` | GET | Konversi alamat ke koordinat |

### **Translation API Routes (`/api/translation/`)**

| Endpoint | Method | Description |
|----------|---------|-------------|
| `/translate` | POST | Terjemahan teks |
| `/voice` | POST | Terjemahan suara (future) |

---

## 💰 **Pricing & Limits**

### **Google Maps API Pricing (2024)**

| API | Free Tier (per month) | Price after limit |
|-----|----------------------|-------------------|
| **Maps SDK** | $200 credit | $7 per 1,000 requests |
| **Places API** | $200 credit | $17 per 1,000 requests |
| **Directions** | $200 credit | $5 per 1,000 requests |
| **Geocoding** | $200 credit | $5 per 1,000 requests |

### **Best Practices untuk Menghemat Cost:**

1. **Implement Caching**
   - Cache static place data
   - Cache geocoding results
   - Use session tokens untuk Places Autocomplete

2. **Optimize Requests**
   - Gunakan appropriate radius untuk nearby search
   - Limit field selection di Place Details
   - Batch geocoding requests

3. **Fallback System**
   - App sudah memiliki fallback ke static data
   - Graceful degradation jika API limit tercapai

---

## 🔧 **Advanced Configuration**

### **1. Service Account Setup (Production)**

Untuk production yang lebih aman, gunakan Service Account:

1. **Create Service Account**
   ```
   Google Cloud Console → IAM & Admin → Service Accounts
   ```

2. **Download Key File**
   - Generate dan download JSON key file
   - Simpan sebagai `google-service-account.json`

3. **Update Environment**
   ```env
   GOOGLE_APPLICATION_CREDENTIALS=./google-service-account.json
   GOOGLE_PROJECT_ID=tourist-app-indonesia
   ```

### **2. API Key Restrictions**

**Application Restrictions:**
```
HTTP referrers:
- http://localhost:19006/*
- https://yourdomain.com/*

Android apps:
- Package name: com.rasa.indonesia
- SHA-1: Your app signing certificate SHA-1
```

**API Restrictions:**
- Maps SDK for Android
- Maps JavaScript API  
- Places API
- Directions API
- Geocoding API

### **3. Monitoring & Analytics**

Enable monitoring di Google Cloud Console:
```
APIs & Services → Dashboard → View detailed metrics
```

Track:
- Request count per API
- Error rates
- Response times
- Quota usage

---

## ⚠️ **Common Issues & Solutions**

### **1. API Key Not Working**
```
Error: "This API key is not valid"
```
**Solution:**
- Check API key is correct in `.env`
- Ensure required APIs are enabled
- Verify API key restrictions match your domain/app

### **2. CORS Issues**
```
Error: "CORS policy blocked"
```
**Solution:**
- Add proper CORS headers in backend
- Check HTTP referrer restrictions
- Ensure localhost is allowed during development

### **3. Billing Not Enabled**
```
Error: "Billing must be enabled"
```
**Solution:**
- Enable billing account di Google Cloud Console
- Link project to billing account
- Free tier $200 credit available for new users

### **4. Rate Limiting**
```
Error: "Quota exceeded"
```
**Solution:**
- Monitor usage di Cloud Console
- Implement exponential backoff
- Add caching untuk reduce requests
- Consider upgrading quota limits

---

## 🚀 **Testing in Development**

### **1. Backend Testing**
```bash
# Start backend
cd backend && npm run dev

# Test all APIs
curl http://localhost:5000/api/health
curl http://localhost:5000/api/maps/nearby-places?lat=-6.2088&lng=106.8456
```

### **2. Mobile App Testing**  
```bash
# Start mobile app
cd mobile && npx expo start --web --port 19010

# Test features:
# 1. Open Maps tab
# 2. Allow location permissions  
# 3. Verify markers appear
# 4. Test callouts dan directions
# 5. Test quick destination buttons
```

### **3. End-to-End Testing**
- Login ke app
- Navigate ke Maps tab
- Allow location access
- Verify current location marker
- Tap destination markers
- Test "Get Directions" functionality
- Test translation features

---

## 📈 **Performance Optimization**

### **1. API Response Caching**
```javascript
// Cache frequently requested places
const placeCache = new Map();
const CACHE_DURATION = 3600000; // 1 hour
```

### **2. Lazy Loading**
```javascript
// Load map only when Maps tab is active
const MapScreen = React.lazy(() => import('./MapScreen'));
```

### **3. Image Optimization**
```javascript
// Use appropriate photo sizes
const photoUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${ref}&key=${key}`;
```

---

## 🎯 **Next Steps & Enhancements**

### **Planned Features:**
1. **Offline Maps** - Cache maps untuk offline usage
2. **Route Planning** - Multi-destination trip planning  
3. **AR Navigation** - Augmented reality directions
4. **Voice Navigation** - Turn-by-turn voice guidance
5. **Traffic Information** - Real-time traffic data
6. **Public Transport** - Integration dengan TransJakarta, etc.

### **Advanced Integrations:**
1. **Google Street View** - 360° photo views
2. **Google Places Reviews** - User-generated reviews  
3. **Google My Business** - Business information
4. **Firebase** - Real-time data sync
5. **Google Analytics** - Usage tracking

---

## 📞 **Support & Resources**

### **Documentation:**
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [React Native Maps Documentation](https://github.com/react-native-maps/react-native-maps)
- [Expo Location Documentation](https://docs.expo.dev/versions/latest/sdk/location/)

### **Community:**
- [Google Maps Platform Community](https://developers.google.com/maps/platform)
- [Stack Overflow - Google Maps API](https://stackoverflow.com/questions/tagged/google-maps-api)
- [React Native Maps Issues](https://github.com/react-native-maps/react-native-maps/issues)

---

## 🎉 **Success! Maps Integration Complete**

✅ **Google Maps SDK** configured  
✅ **Places API** integrated dengan fallback  
✅ **Location Services** working  
✅ **Professional MapScreen** implemented  
✅ **Backend API routes** created  
✅ **Error handling** dan fallback systems  
✅ **Performance optimized** dengan caching  

**RASA sekarang memiliki fitur peta dan lokasi yang lengkap dan professional! 🗺️✨**

---

**Access your enhanced app at: http://localhost:19010**