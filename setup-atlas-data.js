const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://touristapp:touristapp123@cluster0.cwyhc5g.mongodb.net/tourist-app-indonesia?retryWrites=true&w=majority";

async function setupSampleData() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log("🔗 Connected to MongoDB Atlas");
    
    const db = client.db("tourist-app-indonesia");
    
    // Clear existing collections
    console.log("🧹 Clearing existing data...");
    await db.collection("users").deleteMany({});
    await db.collection("guides").deleteMany({});
    await db.collection("accommodations").deleteMany({});
    await db.collection("reviews").deleteMany({});
    await db.collection("bookings").deleteMany({});
    
    // Insert sample users
    console.log("👥 Inserting sample users...");
    await db.collection("users").insertMany([
      {
        name: "Admin User",
        email: "admin@touristapp.id",
        password: "$2a$10$example.hash.password.here",
        nationality: "Indonesia",
        preferredLanguage: "Indonesian", 
        destinationCity: "Jakarta",
        createdAt: new Date()
      },
      {
        name: "John Traveler",
        email: "john@example.com",
        password: "$2a$10$example.hash.password.here",
        nationality: "United States",
        preferredLanguage: "English",
        destinationCity: "Bali",
        createdAt: new Date()
      },
      {
        name: "Sarah Explorer",
        email: "sarah@example.com", 
        password: "$2a$10$example.hash.password.here",
        nationality: "Australia",
        preferredLanguage: "English",
        destinationCity: "Jakarta",
        createdAt: new Date()
      }
    ]);

    // Insert sample guides
    console.log("🗺️ Inserting sample guides...");
    await db.collection("guides").insertMany([
      {
        name: "Andi Setiawan",
        languages: ["Indonesian", "English"],
        rating: 4.9,
        reviews: 127,
        price: 500000,
        city: "Jakarta",
        speciality: "City Tours & Cultural Sites",
        experience: "5+ years",
        description: "Professional guide with deep knowledge of Jakarta history and culture. Fluent in English and passionate about sharing Indonesian heritage.",
        avatar: "👨‍🦱",
        createdAt: new Date()
      },
      {
        name: "Sarah Johnson",
        languages: ["English", "Indonesian", "German"],
        rating: 4.8,
        reviews: 89,
        price: 750000,
        city: "Bali",
        speciality: "Adventure & Nature Tours",
        experience: "7+ years", 
        description: "Adventure specialist offering unique Bali experiences including volcano hiking, snorkeling, and cultural immersion.",
        avatar: "👩‍🦰",
        createdAt: new Date()
      },
      {
        name: "Made Wijaya",
        languages: ["Indonesian", "English", "Japanese"],
        rating: 4.7,
        reviews: 156,
        price: 600000,
        city: "Bali",
        speciality: "Temple Tours & Traditional Culture",
        experience: "8+ years",
        description: "Local Balinese expert specializing in temple tours and traditional cultural experiences. Speaks Japanese fluently.",
        avatar: "👨‍🦳",
        createdAt: new Date()
      },
      {
        name: "Indira Sari",
        languages: ["Indonesian", "English", "French"],
        rating: 4.9,
        reviews: 203,
        price: 650000,
        city: "Yogyakarta",
        speciality: "Cultural Heritage & Art Tours",
        experience: "6+ years",
        description: "Art historian and cultural guide specializing in Javanese culture, batik art, and royal heritage of Yogyakarta.",
        avatar: "👩",
        createdAt: new Date()
      }
    ]);

    // Insert sample accommodations
    console.log("🏨 Inserting sample accommodations...");
    await db.collection("accommodations").insertMany([
      {
        name: "Hotel Indonesia Kempinski Jakarta",
        type: "Luxury Hotel",
        price: 2500000,
        rating: 4.5,
        distance: 1.2,
        amenities: ["WiFi", "Parking", "Restaurant", "Pool", "Spa", "Gym", "Business Center"],
        description: "Iconic 5-star hotel in the heart of Jakarta with panoramic city views",
        image: "🏨",
        createdAt: new Date()
      },
      {
        name: "The Hermitage Jakarta",
        type: "Boutique Hotel",
        price: 1800000,
        rating: 4.8,
        distance: 0.8,
        amenities: ["WiFi", "Parking", "Restaurant", "Gym", "Business Center", "Concierge"],
        description: "Elegant boutique hotel with personalized service and modern amenities",
        image: "🏨",
        createdAt: new Date()
      },
      {
        name: "RedDoorz Plus Jakarta Central",
        type: "Budget Hotel",
        price: 300000,
        rating: 4.2,
        distance: 2.1,
        amenities: ["WiFi", "AC", "TV", "24h Front Desk"],
        description: "Comfortable budget accommodation with essential amenities",
        image: "🏨",
        createdAt: new Date()
      },
      {
        name: "Aloft Jakarta TB Simatupang",
        type: "Modern Hotel",
        price: 1200000,
        rating: 4.6,
        distance: 3.5,
        amenities: ["WiFi", "Parking", "Restaurant", "Pool", "Gym", "Business Center"],
        description: "Contemporary hotel with vibrant design and tech-savvy amenities",
        image: "🏨",
        createdAt: new Date()
      }
    ]);

    // Insert sample reviews
    console.log("⭐ Inserting sample reviews...");
    await db.collection("reviews").insertMany([
      {
        guideId: "guide_1",
        userId: "user_1", 
        userName: "Sarah M.",
        userAvatar: "👩‍🦰",
        rating: 5,
        date: "2025-01-10",
        comment: "Amazing tour guide! Andi has extensive knowledge of local culture and was very friendly throughout the tour. Highly recommended for anyone visiting Jakarta!",
        helpful: 12,
        createdAt: new Date("2025-01-10")
      },
      {
        guideId: "guide_1",
        userId: "user_2",
        userName: "John D.",
        userAvatar: "👨‍🦱", 
        rating: 4,
        date: "2025-01-05",
        comment: "Good guide with great English skills. Showed us hidden gems in Jakarta that we wouldn't have found ourselves. Could be more punctual though.",
        helpful: 8,
        createdAt: new Date("2025-01-05")
      },
      {
        guideId: "guide_2",
        userId: "user_3",
        userName: "Lisa K.",
        userAvatar: "👩",
        rating: 5,
        date: "2024-12-28",
        comment: "Excellent Bali experience! Sarah planned the perfect adventure tour including volcano hiking and snorkeling. Professional and fun guide!",
        helpful: 15,
        createdAt: new Date("2024-12-28")
      },
      {
        guideId: "guide_3",
        userId: "user_1",
        userName: "Mike R.",
        userAvatar: "👨",
        rating: 5,
        date: "2024-12-20",
        comment: "Made gave us an incredible cultural experience in Bali. His knowledge of temple history and traditions is outstanding. Best guide we've had!",
        helpful: 18,
        createdAt: new Date("2024-12-20")
      }
    ]);

    // Insert sample bookings
    console.log("📅 Inserting sample bookings...");
    await db.collection("bookings").insertMany([
      {
        userId: "user_1",
        guideId: "guide_1",
        guideName: "Andi Setiawan",
        date: "2025-08-25",
        duration: 1,
        notes: "Interested in historical sites and local food",
        status: "confirmed",
        totalPrice: 500000,
        createdAt: new Date()
      },
      {
        userId: "user_2", 
        guideId: "guide_2",
        guideName: "Sarah Johnson",
        date: "2025-08-30",
        duration: 3,
        notes: "Adventure tour with volcano hiking",
        status: "pending",
        totalPrice: 2250000,
        createdAt: new Date()
      },
      {
        userId: "user_3",
        guideId: "guide_3", 
        guideName: "Made Wijaya",
        date: "2025-09-05",
        duration: 2,
        notes: "Temple tour and traditional culture experience",
        status: "confirmed",
        totalPrice: 1200000,
        createdAt: new Date()
      }
    ]);

    // Insert sample accommodation bookings
    await db.collection("accommodation_bookings").insertMany([
      {
        userId: "user_1",
        accommodationId: "hotel_1",
        accommodationName: "Hotel Indonesia Kempinski Jakarta",
        checkIn: "2025-08-24",
        checkOut: "2025-08-27",
        guests: 2,
        rooms: 1,
        totalPrice: 7500000,
        status: "confirmed",
        createdAt: new Date()
      }
    ]);

    console.log("✅ Sample data setup complete!");
    console.log("📊 Database collections created:");
    console.log("   👥 Users: 3 records");
    console.log("   🗺️ Guides: 4 records");
    console.log("   🏨 Accommodations: 4 records");
    console.log("   ⭐ Reviews: 4 records");
    console.log("   📅 Bookings: 3 records");
    
  } catch (error) {
    console.error("❌ Error setting up data:", error);
  } finally {
    await client.close();
    console.log("🔒 Connection closed");
  }
}

setupSampleData();