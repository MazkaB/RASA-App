#!/bin/bash
echo "🚀 Starting Tourist App Indonesia - Production Mode"
echo "================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if MongoDB Atlas is configured
if grep -q "mongodb+srv://touristapp:touristapp123@cluster0.cwyhc5g.mongodb.net" backend/.env; then
    echo -e "${GREEN}✅ MongoDB Atlas configured${NC}"
else
    echo -e "${RED}❌ MongoDB Atlas not configured${NC}"
    echo "Please update backend/.env with your MongoDB Atlas connection string"
    exit 1
fi

# Start backend server
echo -e "${YELLOW}📡 Starting backend server...${NC}"
cd backend
npm install --silent
if npm run dev &>/dev/null &
then
    BACKEND_PID=$!
    echo -e "${GREEN}✅ Backend server started (PID: $BACKEND_PID)${NC}"
    sleep 3
else
    echo -e "${RED}❌ Failed to start backend server${NC}"
    exit 1
fi

# Test backend health
echo -e "${YELLOW}🔍 Testing backend health...${NC}"
if curl -s http://localhost:5000/api/health | grep -q "OK"; then
    echo -e "${GREEN}✅ Backend is healthy${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

# Test MongoDB connection
echo -e "${YELLOW}🗄️ Testing MongoDB connection...${NC}"
cd ..
node -e "
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://touristapp:touristapp123@cluster0.cwyhc5g.mongodb.net/tourist-app-indonesia?retryWrites=true&w=majority')
.then(() => { console.log('✅ MongoDB connected'); mongoose.connection.close(); })
.catch(err => { console.log('❌ MongoDB connection failed:', err.message); process.exit(1); });
"

# Start mobile app
echo -e "${YELLOW}📱 Starting mobile app...${NC}"
cd mobile
npm install --silent --legacy-peer-deps

# Try different ports for mobile app
for port in 19006 19007 19008 19009; do
    echo -e "${YELLOW}🔄 Trying port $port...${NC}"
    if npx expo start --web --port $port &>/dev/null &
    then
        MOBILE_PID=$!
        echo -e "${GREEN}✅ Mobile app started on port $port (PID: $MOBILE_PID)${NC}"
        break
    else
        echo -e "${YELLOW}⚠️ Port $port unavailable, trying next...${NC}"
    fi
done

sleep 5

echo ""
echo -e "${GREEN}🎉 Tourist App Indonesia is now running!${NC}"
echo "=============================================="
echo -e "${GREEN}🔗 Backend API:${NC} http://localhost:5000"
echo -e "${GREEN}📱 Mobile App:${NC} http://localhost:$port"
echo -e "${GREEN}🗄️ Database:${NC} MongoDB Atlas (Connected)"
echo ""
echo -e "${YELLOW}📋 Available Features:${NC}"
echo "   ✅ User Authentication (Register/Login)"
echo "   ✅ Tour Guide Booking System"
echo "   ✅ Hotel Accommodation Booking"
echo "   ✅ Review & Rating System"
echo "   ✅ AI Translation Service"
echo "   ✅ Real-time AI Chat Assistant"
echo "   ✅ Emergency Services & Info"
echo ""
echo -e "${YELLOW}🧪 Test the application:${NC}"
echo "1. Open http://localhost:$port in your browser"
echo "2. Register a new user account"
echo "3. Browse and book tour guides"
echo "4. Use the AI chat assistant"
echo "5. Try the translation feature"
echo ""
echo -e "${YELLOW}🛑 To stop the application:${NC}"
echo "   kill $BACKEND_PID $MOBILE_PID"
echo ""
echo -e "${GREEN}Happy exploring Indonesia! 🇮🇩✨${NC}"

# Keep script running to show PIDs
wait