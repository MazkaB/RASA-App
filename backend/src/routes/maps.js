const express = require('express');
const router = express.Router();
const axios = require('axios');

// Get nearby places using Google Maps Places API
router.get('/nearby-places', async (req, res) => {
  try {
    const { lat, lng, radius = 5000, type = 'tourist_attraction' } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Try Google Maps Places API first
    if (process.env.GOOGLE_MAPS_API_KEY && process.env.GOOGLE_MAPS_API_KEY !== 'your-google-maps-api-key-here') {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        const places = response.data.results.map(place => ({
          id: place.place_id,
          name: place.name,
          latitude: place.geometry.location.lat,
          longitude: place.geometry.location.lng,
          rating: place.rating || 4.0,
          types: place.types,
          vicinity: place.vicinity,
          photos: place.photos ? place.photos.map(photo => 
            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          ) : [],
          priceLevel: place.price_level,
          openingHours: place.opening_hours
        }));

        return res.json({
          places,
          provider: 'Google Maps Places API'
        });
      } catch (apiError) {
        console.log('Google Maps Places API error, falling back to static data:', apiError.message);
      }
    }

    // Fallback to static tourist destinations data
    const staticDestinations = [
      {
        id: 'monas',
        name: 'Monas (National Monument)',
        latitude: -6.1754,
        longitude: 106.8272,
        rating: 4.2,
        types: ['tourist_attraction', 'establishment'],
        vicinity: 'Central Jakarta',
        photos: [],
        priceLevel: 1,
        description: 'Iconic 132m tower commemorating Indonesian independence'
      },
      {
        id: 'borobudur',
        name: 'Borobudur Temple',
        latitude: -7.6079,
        longitude: 110.2038,
        rating: 4.8,
        types: ['tourist_attraction', 'place_of_worship'],
        vicinity: 'Magelang, Central Java',
        photos: [],
        priceLevel: 2,
        description: '8th-century Mahayana Buddhist temple'
      },
      {
        id: 'kuta-beach',
        name: 'Kuta Beach',
        latitude: -8.7162,
        longitude: 115.1700,
        rating: 4.5,
        types: ['tourist_attraction', 'natural_feature'],
        vicinity: 'Badung Regency, Bali',
        photos: [],
        priceLevel: 1,
        description: 'Famous white sand beach perfect for surfing'
      },
      {
        id: 'mount-bromo',
        name: 'Mount Bromo',
        latitude: -7.9425,
        longitude: 112.9530,
        rating: 4.7,
        types: ['tourist_attraction', 'natural_feature'],
        vicinity: 'East Java',
        photos: [],
        priceLevel: 2,
        description: 'Active volcano with spectacular sunrise views'
      },
      {
        id: 'komodo-island',
        name: 'Komodo Island',
        latitude: -8.5500,
        longitude: 119.4833,
        rating: 4.9,
        types: ['tourist_attraction', 'natural_feature'],
        vicinity: 'East Nusa Tenggara',
        photos: [],
        priceLevel: 3,
        description: 'Home of the famous Komodo dragons'
      },
      {
        id: 'taman-mini',
        name: 'Taman Mini Indonesia Indah',
        latitude: -6.3025,
        longitude: 106.8952,
        rating: 4.1,
        types: ['tourist_attraction', 'amusement_park'],
        vicinity: 'East Jakarta',
        photos: [],
        priceLevel: 1,
        description: 'Cultural theme park showcasing Indonesian diversity'
      }
    ];

    // Calculate distance and filter by radius
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseInt(radius);

    const nearbyPlaces = staticDestinations.filter(place => {
      const distance = calculateDistance(userLat, userLng, place.latitude, place.longitude);
      return distance <= maxRadius;
    }).map(place => ({
      ...place,
      distance: calculateDistance(userLat, userLng, place.latitude, place.longitude)
    }));

    res.json({
      places: nearbyPlaces,
      provider: 'Static Data'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get place details
router.get('/place-details/:placeId', async (req, res) => {
  try {
    const { placeId } = req.params;

    // Try Google Maps Place Details API first
    if (process.env.GOOGLE_MAPS_API_KEY && process.env.GOOGLE_MAPS_API_KEY !== 'your-google-maps-api-key-here') {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,formatted_phone_number,formatted_address,opening_hours,website,photos,reviews&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        const place = response.data.result;
        return res.json({
          place: {
            id: placeId,
            name: place.name,
            rating: place.rating,
            phoneNumber: place.formatted_phone_number,
            address: place.formatted_address,
            website: place.website,
            openingHours: place.opening_hours,
            photos: place.photos ? place.photos.slice(0, 5).map(photo => 
              `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
            ) : [],
            reviews: place.reviews || []
          },
          provider: 'Google Maps Places API'
        });
      } catch (apiError) {
        console.log('Google Maps Place Details API error:', apiError.message);
      }
    }

    // Fallback to static data
    const staticDetails = {
      'monas': {
        name: 'Monas (National Monument)',
        rating: 4.2,
        phoneNumber: '+62 21 3441963',
        address: 'Jl. Medan Merdeka Selatan, Gambir, Central Jakarta',
        website: 'https://monas.jakarta.go.id/',
        openingHours: {
          weekday_text: [
            'Monday: 8:00 AM – 3:00 PM',
            'Tuesday: 8:00 AM – 3:00 PM', 
            'Wednesday: 8:00 AM – 3:00 PM',
            'Thursday: 8:00 AM – 3:00 PM',
            'Friday: 8:00 AM – 3:00 PM',
            'Saturday: 8:00 AM – 3:00 PM',
            'Sunday: 8:00 AM – 3:00 PM'
          ]
        },
        photos: [],
        reviews: [
          {
            author_name: 'Tourist123',
            rating: 4,
            text: 'Great view of Jakarta from the top!',
            time: Date.now()
          }
        ]
      }
    };

    const placeDetails = staticDetails[placeId];
    if (!placeDetails) {
      return res.status(404).json({ message: 'Place not found' });
    }

    res.json({
      place: { id: placeId, ...placeDetails },
      provider: 'Static Data'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get directions between two points
router.get('/directions', async (req, res) => {
  try {
    const { origin, destination, mode = 'driving' } = req.query;

    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }

    // Try Google Maps Directions API first
    if (process.env.GOOGLE_MAPS_API_KEY && process.env.GOOGLE_MAPS_API_KEY !== 'your-google-maps-api-key-here') {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=${mode}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        return res.json({
          routes: response.data.routes,
          provider: 'Google Maps Directions API'
        });
      } catch (apiError) {
        console.log('Google Maps Directions API error:', apiError.message);
      }
    }

    // Fallback response
    res.json({
      message: 'Directions API not available. Please configure Google Maps API key.',
      fallback: {
        origin,
        destination,
        mode,
        estimatedDistance: 'N/A',
        estimatedDuration: 'N/A'
      },
      provider: 'Fallback'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Geocoding: Convert address to coordinates
router.get('/geocode', async (req, res) => {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ message: 'Address is required' });
    }

    // Try Google Maps Geocoding API first
    if (process.env.GOOGLE_MAPS_API_KEY && process.env.GOOGLE_MAPS_API_KEY !== 'your-google-maps-api-key-here') {
      try {
        const response = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );

        return res.json({
          results: response.data.results,
          provider: 'Google Maps Geocoding API'
        });
      } catch (apiError) {
        console.log('Google Maps Geocoding API error:', apiError.message);
      }
    }

    // Fallback for major Indonesian cities
    const cityCoordinates = {
      'jakarta': { lat: -6.2088, lng: 106.8456 },
      'surabaya': { lat: -7.2575, lng: 112.7521 },
      'bandung': { lat: -6.9175, lng: 107.6191 },
      'medan': { lat: 3.5952, lng: 98.6722 },
      'semarang': { lat: -6.9175, lng: 110.4167 },
      'makassar': { lat: -5.1477, lng: 119.4327 },
      'palembang': { lat: -2.9761, lng: 104.7754 },
      'bali': { lat: -8.3405, lng: 115.0920 },
      'yogyakarta': { lat: -7.7956, lng: 110.3695 }
    };

    const searchTerm = address.toLowerCase();
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (searchTerm.includes(city)) {
        return res.json({
          results: [{
            formatted_address: `${city.charAt(0).toUpperCase() + city.slice(1)}, Indonesia`,
            geometry: {
              location: coords
            }
          }],
          provider: 'Static Data'
        });
      }
    }

    res.status(404).json({
      message: 'Location not found in fallback data',
      provider: 'Static Data'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

module.exports = router;