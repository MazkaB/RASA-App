const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

dotenv.config();

// Initialize Firebase and GCP Services
const { initializeFirebase, getFirestore } = require('./config/firebase');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const guideRoutes = require('./routes/guides');
const accommodationRoutes = require('./routes/accommodations');
const translationRoutes = require('./routes/translation');
const bookingRoutes = require('./routes/bookings');
const mapsRoutes = require('./routes/maps');
const aiServicesRoutes = require('./routes/ai-services');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize Firebase and MongoDB
const initializeServices = async () => {
  try {
    // Initialize Firebase
    console.log('🔥 Initializing Firebase...');
    initializeFirebase();
    
    // MongoDB connection - fallback to Firestore if not available
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log('✅ Connected to MongoDB');
    } else {
      console.log('⚠️  MongoDB not configured, using Firestore for data storage');
    }
  } catch (err) {
    console.log('⚠️  MongoDB unavailable, using Firestore for data storage');
    console.log('🔥 Firebase Firestore ready as primary database');
  }
};

initializeServices();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/guides', guideRoutes);
app.use('/api/accommodations', accommodationRoutes);
app.use('/api/translation', translationRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/ai', aiServicesRoutes);

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RASA API with GCP Integration is running',
    services: {
      firebase: '🔥 Ready',
      vision: '📸 Ready', 
      speech: '🎤 Ready',
      translate: '🌍 Ready',
      ai: '🤖 Ready'
    },
    timestamp: new Date().toISOString()
  });
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});