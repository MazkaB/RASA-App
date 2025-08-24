import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { 
  StyleSheet, Text, View, SafeAreaView, ScrollView, 
  TouchableOpacity, RefreshControl, Dimensions, Modal, Alert, Image, Animated
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import AIFeaturesScreen from './screens/AIFeaturesScreen';
import MapScreen from './components/MapScreen';
import DestinationsScreen from './screens/DestinationsScreen';
import RegisterScreen from './screens/RegisterScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import LoginScreen from './screens/LoginScreen';

// Import Guide App
import GuideApp from './GuideApp';

// Import service components
import SIMCardLocator from './components/SIMCardLocator';
import CurrencyExchange from './components/CurrencyExchange';
import TourGuideBooking from './components/TourGuideBooking';
import TransportationHelper from './components/TransportationHelper';
import UserProfile from './components/UserProfile';

const Tab = createBottomTabNavigator();
const { width } = Dimensions.get('window');

// Comprehensive countries list for registration
const countries = [
  // Asia Pacific
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭' },
  { code: 'CN', name: 'China', flag: '🇨🇳' },
  { code: 'HK', name: 'Hong Kong', flag: '🇭🇰' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳' },
  // Europe
  { code: 'AT', name: 'Austria', flag: '🇦🇹' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  // Americas
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  // Middle East & Africa
  { code: 'EG', name: 'Egypt', flag: '🇪🇬' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦' }
];

// Comprehensive Popular Destinations database
const allPopularDestinations = [
  // Java
  { 
    id: 1, 
    name: 'Borobudur Temple', 
    location: 'Yogyakarta', 
    province: 'Central Java',
    rating: 4.8,
    reviews: 15240,
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
    category: 'temple',
    description: '9th-century Mahayana Buddhist temple, UNESCO World Heritage Site',
    highlights: ['Sunrise viewing', 'Ancient architecture', 'Buddhist heritage'],
    bestTime: 'May - September',
    price: 'Rp 40,000'
  },
  { 
    id: 2, 
    name: 'Prambanan Temple', 
    location: 'Yogyakarta', 
    province: 'Central Java',
    rating: 4.7,
    reviews: 9876,
    image: 'https://images.unsplash.com/photo-1572089549852-3e2c0c4fdc6d?w=400&h=300&fit=crop',
    category: 'temple',
    description: 'Magnificent Hindu temple complex dedicated to Trimurti',
    highlights: ['Hindu architecture', 'Ramayana reliefs', 'Evening light show'],
    bestTime: 'April - October',
    price: 'Rp 40,000'
  },
  { 
    id: 3, 
    name: 'Jakarta Old Town', 
    location: 'Jakarta', 
    province: 'DKI Jakarta',
    rating: 4.4,
    reviews: 8934,
    image: 'https://images.unsplash.com/photo-1555400113-3f1ec3ceec6d?w=400&h=300&fit=crop',
    category: 'city',
    description: 'Historic area showcasing Dutch colonial architecture',
    highlights: ['Colonial buildings', 'Museums', 'Traditional cafes'],
    bestTime: 'Year round',
    price: 'Free entry'
  },
  { 
    id: 4, 
    name: 'Malioboro Street', 
    location: 'Yogyakarta', 
    province: 'Central Java',
    rating: 4.5,
    reviews: 12430,
    image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73d15?w=400&h=300&fit=crop',
    category: 'city',
    description: 'Famous pedestrian street with shopping and street food',
    highlights: ['Street food', 'Shopping', 'Cultural performances'],
    bestTime: 'Year round',
    price: 'Free entry'
  },
  { 
    id: 5, 
    name: 'Dieng Plateau', 
    location: 'Wonosobo', 
    province: 'Central Java',
    rating: 4.6,
    reviews: 7654,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'nature',
    description: 'High plateau with ancient temples and volcanic lakes',
    highlights: ['Ancient temples', 'Colorful lake', 'Cool climate'],
    bestTime: 'April - October',
    price: 'Rp 20,000'
  },
  // Bali
  { 
    id: 6, 
    name: 'Kuta Beach', 
    location: 'Kuta', 
    province: 'Bali',
    rating: 4.6,
    reviews: 18500,
    image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop',
    category: 'beach',
    description: 'Famous beach with golden sand, perfect for surfing',
    highlights: ['Surfing', 'Sunset views', 'Beach clubs'],
    bestTime: 'April - October',
    price: 'Free entry'
  },
  { 
    id: 7, 
    name: 'Ubud Rice Terraces', 
    location: 'Ubud', 
    province: 'Bali',
    rating: 4.8,
    reviews: 14320,
    image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=400&h=300&fit=crop',
    category: 'nature',
    description: 'Beautiful terraced rice fields with traditional irrigation',
    highlights: ['Rice terraces', 'Traditional farming', 'Photography'],
    bestTime: 'March - August',
    price: 'Rp 30,000'
  },
  { 
    id: 8, 
    name: 'Tanah Lot Temple', 
    location: 'Tabanan', 
    province: 'Bali',
    rating: 4.7,
    reviews: 16780,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    category: 'temple',
    description: 'Iconic temple on a rock formation surrounded by ocean',
    highlights: ['Ocean temple', 'Sunset views', 'Traditional architecture'],
    bestTime: 'April - October',
    price: 'Rp 60,000'
  },
  { 
    id: 9, 
    name: 'Mount Batur', 
    location: 'Kintamani', 
    province: 'Bali',
    rating: 4.9,
    reviews: 11250,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'mountain',
    description: 'Active volcano offering spectacular sunrise trekking',
    highlights: ['Sunrise trekking', 'Volcanic landscape', 'Hot springs'],
    bestTime: 'April - October',
    price: 'Rp 150,000'
  },
  { 
    id: 10, 
    name: 'Seminyak Beach', 
    location: 'Seminyak', 
    province: 'Bali',
    rating: 4.5,
    reviews: 13640,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    category: 'beach',
    description: 'Upscale beach area with luxury resorts and beach clubs',
    highlights: ['Luxury resorts', 'Beach clubs', 'Fine dining'],
    bestTime: 'April - October',
    price: 'Free entry'
  },
  // East Java
  { 
    id: 11, 
    name: 'Mount Bromo', 
    location: 'Probolinggo', 
    province: 'East Java',
    rating: 4.7,
    reviews: 12567,
    image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop',
    category: 'mountain',
    description: 'Active volcano with stunning sunrise views from viewpoint',
    highlights: ['Sunrise viewing', 'Volcanic crater', 'Sea of sand'],
    bestTime: 'April - October',
    price: 'Rp 34,000'
  },
  { 
    id: 12, 
    name: 'Ijen Crater', 
    location: 'Banyuwangi', 
    province: 'East Java',
    rating: 4.8,
    reviews: 8940,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'mountain',
    description: 'Volcanic crater famous for blue fire phenomenon',
    highlights: ['Blue fire', 'Sulfur mining', 'Acidic lake'],
    bestTime: 'April - October',
    price: 'Rp 150,000'
  },
  // Lombok
  { 
    id: 13, 
    name: 'Mount Rinjani', 
    location: 'Lombok', 
    province: 'West Nusa Tenggara',
    rating: 4.9,
    reviews: 6780,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
    category: 'mountain',
    description: 'Second highest volcano in Indonesia with crater lake',
    highlights: ['Multi-day trekking', 'Crater lake', 'Hot springs'],
    bestTime: 'April - December',
    price: 'Rp 150,000'
  },
  { 
    id: 14, 
    name: 'Gili Islands', 
    location: 'Lombok', 
    province: 'West Nusa Tenggara',
    rating: 4.7,
    reviews: 15430,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    category: 'beach',
    description: 'Three small islands perfect for snorkeling and diving',
    highlights: ['Snorkeling', 'No motorized vehicles', 'Turtle watching'],
    bestTime: 'April - October',
    price: 'Rp 50,000'
  },
  // Flores
  { 
    id: 15, 
    name: 'Komodo Island', 
    location: 'Flores', 
    province: 'East Nusa Tenggara',
    rating: 4.9,
    reviews: 7456,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
    category: 'nature',
    description: 'Home of the famous Komodo dragons, UNESCO site',
    highlights: ['Komodo dragons', 'Pink beach', 'Diving spots'],
    bestTime: 'April - November',
    price: 'Rp 150,000'
  },
  { 
    id: 16, 
    name: 'Kelimutu Lake', 
    location: 'Ende', 
    province: 'East Nusa Tenggara',
    rating: 4.6,
    reviews: 4320,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'nature',
    description: 'Three colored crater lakes on Mount Kelimutu',
    highlights: ['Three colored lakes', 'Sunrise viewing', 'Local legends'],
    bestTime: 'April - October',
    price: 'Rp 30,000'
  },
  // Sumatra
  { 
    id: 17, 
    name: 'Lake Toba', 
    location: 'North Sumatra', 
    province: 'North Sumatra',
    rating: 4.6,
    reviews: 8750,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    category: 'nature',
    description: 'Largest volcanic lake in the world with Samosir Island',
    highlights: ['Volcanic lake', 'Batak culture', 'Traditional villages'],
    bestTime: 'March - October',
    price: 'Free entry'
  },
  { 
    id: 18, 
    name: 'Bukit Lawang', 
    location: 'North Sumatra', 
    province: 'North Sumatra',
    rating: 4.7,
    reviews: 5630,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
    category: 'nature',
    description: 'Orangutan rehabilitation center in tropical rainforest',
    highlights: ['Orangutan watching', 'Jungle trekking', 'River tubing'],
    bestTime: 'March - October',
    price: 'Rp 150,000'
  },
  // Kalimantan
  { 
    id: 19, 
    name: 'Tanjung Puting', 
    location: 'Central Kalimantan', 
    province: 'Central Kalimantan',
    rating: 4.8,
    reviews: 3240,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
    category: 'nature',
    description: 'National park famous for orangutan conservation',
    highlights: ['Orangutan spotting', 'River cruise', 'Klotok boat ride'],
    bestTime: 'April - October',
    price: 'Rp 500,000'
  },
  // Papua
  { 
    id: 20, 
    name: 'Raja Ampat', 
    location: 'West Papua', 
    province: 'West Papua',
    rating: 4.9,
    reviews: 2150,
    image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=300&fit=crop',
    category: 'beach',
    description: 'World-class diving destination with incredible marine biodiversity',
    highlights: ['World-class diving', 'Marine biodiversity', 'Remote islands'],
    bestTime: 'October - April',
    price: 'Rp 1,000,000'
  }
];

// Modern Home Screen dengan design yang clean
function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState('Traveler');
  const [activeService, setActiveService] = useState(null);
  const [showDestinations, setShowDestinations] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Essential tourist services sesuai README.md
  const services = [
    {
      id: 'sim-card',
      title: 'SIM Card Guide',
      subtitle: 'Complete purchase workflow',
      icon: 'phone-portrait',
      color: '#1a73e8',
      component: SIMCardLocator
    },
    {
      id: 'currency',
      title: 'Currency Exchange',
      subtitle: 'Live rates & locations',
      icon: 'card',
      color: '#34a853',
      component: CurrencyExchange
    },
    {
      id: 'tour-guide',
      title: 'Tour Guide Booking',
      subtitle: 'Find & book local guides',
      icon: 'people',
      color: '#ea4335',
      component: TourGuideBooking
    },
    {
      id: 'transportation',
      title: 'Transportation',
      subtitle: 'Rides, public transport & tips',
      icon: 'car',
      color: '#ff6d01',
      component: TransportationHelper
    }
  ];

  const handleServicePress = (service) => {
    if (service.component) {
      setActiveService(service);
    } else {
      // Show coming soon for AI Assistant and Emergency
      Alert.alert(
        service.title,
        'This feature is coming soon! We\'re working hard to bring you the best experience.',
        [{ text: 'OK' }]
      );
    }
  };

  const closeServiceModal = () => {
    setActiveService(null);
  };

  const popularDestinations = [
    { 
      id: 1, 
      name: 'Borobudur Temple', 
      location: 'Yogyakarta', 
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
    },
    { 
      id: 2, 
      name: 'Kuta Beach', 
      location: 'Bali', 
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop'
    },
    { 
      id: 3, 
      name: 'Mount Bromo', 
      location: 'East Java', 
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=300&fit=crop'
    }
  ];

  const handleQuickAction = (actionType) => {
    switch(actionType) {
      case 'bookings':
        Alert.alert('My Bookings', 'View and manage your travel bookings');
        break;
      case 'reviews':
        Alert.alert('Reviews', 'Read and write reviews for destinations');
        break;
      case 'favorites':
        Alert.alert('Favorites', 'Your saved favorite destinations');
        break;
      default:
        Alert.alert('Coming Soon', 'This feature will be available soon!');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with clean design */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Welcome back,</Text>
            <Text style={styles.userName}>{userName} 🇮🇩</Text>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person-circle-outline" size={32} color="#1a73e8" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.locationContainer}>
          <Ionicons name="location-outline" size={16} color="#5f6368" />
          <Text style={styles.locationText}>Jakarta, Indonesia</Text>
          <Ionicons name="chevron-down" size={16} color="#5f6368" />
        </View>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Essential Services - Clean card design */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Essential Services</Text>
          <View style={styles.servicesGrid}>
            {services.map((service) => (
              <TouchableOpacity 
                key={service.id} 
                style={styles.serviceCard}
                activeOpacity={0.7}
                onPress={() => handleServicePress(service)}
              >
                <View style={[styles.serviceIcon, { backgroundColor: `${service.color}15` }]}>
                  <Ionicons name={service.icon} size={24} color={service.color} />
                </View>
                <Text style={styles.serviceTitle}>{service.title}</Text>
                <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Destinations - Horizontal scroll */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Destinations</Text>
            <TouchableOpacity onPress={() => setShowDestinations(true)}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.destinationsScroll}
          >
            {popularDestinations.map((destination) => (
              <TouchableOpacity 
                key={destination.id} 
                style={styles.destinationCard}
                activeOpacity={0.8}
              >
                <Image 
                  source={{ uri: destination.image }} 
                  style={styles.destinationImage}
                  defaultSource={{ uri: 'https://via.placeholder.com/140x100/e8eaed/9aa0a6?text=Loading...' }}
                />
                <View style={styles.destinationInfo}>
                  <Text style={styles.destinationName}>{destination.name}</Text>
                  <Text style={styles.destinationLocation}>{destination.location}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={12} color="#fbbc04" />
                    <Text style={styles.ratingText}>{destination.rating}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsContainer}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => handleQuickAction('bookings')}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={20} color="#1a73e8" />
              <Text style={styles.quickActionText}>My Bookings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => handleQuickAction('reviews')}
              activeOpacity={0.7}
            >
              <Ionicons name="star-outline" size={20} color="#1a73e8" />
              <Text style={styles.quickActionText}>Reviews</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => handleQuickAction('favorites')}
              activeOpacity={0.7}
            >
              <Ionicons name="heart-outline" size={20} color="#1a73e8" />
              <Text style={styles.quickActionText}>Favorites</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Destinations Modal */}
      <Modal
        visible={showDestinations}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDestinations(false)}
      >
        <DestinationsScreen 
          navigation={{ goBack: () => setShowDestinations(false) }}
        />
      </Modal>

      {/* Service Modal */}
      {activeService && (
        <Modal
          visible={!!activeService}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeServiceModal}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.serviceModalHeader}>
              <TouchableOpacity
                style={styles.serviceCloseButton}
                onPress={closeServiceModal}
              >
                <Ionicons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
              <Text style={styles.serviceModalTitle}>{activeService.title}</Text>
              <View style={styles.servicePlaceholder} />
            </View>
            
            <activeService.component 
              onClose={closeServiceModal} 
              userProfile={null}
            />
          </SafeAreaView>
        </Modal>
      )}
    </SafeAreaView>
  );
}

// Profile Screen with UserProfile integration
function ProfileScreen({ onLogout }) {
  const [userProfile, setUserProfile] = useState(null);
  const [showFullProfile, setShowFullProfile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    loadUserProfile();
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const loadUserProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem('userProfile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const updateProfile = (newProfile) => {
    setUserProfile(newProfile);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      // Clear stored data
      await AsyncStorage.multiRemove(['userProfile', 'userRole', 'savedEmail']);
      
      // Animate out
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onLogout) {
          onLogout();
        }
      });
    } catch (error) {
      console.log('Error during logout:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  if (showFullProfile) {
    return (
      <UserProfile 
        userProfile={userProfile}
        onUpdateProfile={updateProfile}
        onClose={() => setShowFullProfile(false)}
      />
    );
  }

  const userStats = [
    { label: 'Trips Taken', value: '3', icon: 'airplane' },
    { label: 'Reviews Written', value: '8', icon: 'star' },
    { label: 'Places Visited', value: userProfile?.destinations?.length || '0', icon: 'location' },
    { label: 'Countries', value: '1', icon: 'flag' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#1a73e8" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{userProfile?.name || 'Tourist User'}</Text>
              <Text style={styles.profileEmail}>{userProfile?.email || 'tourist@example.com'}</Text>
              {userProfile?.countryOrigin && (
                <View style={styles.countryBadge}>
                  <Text style={styles.countryText}>
                    {countries.find(c => c.code === userProfile.countryOrigin)?.flag || '🌍'} {' '}
                    {countries.find(c => c.code === userProfile.countryOrigin)?.name || 'International'}
                  </Text>
                </View>
              )}
            </View>
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setShowFullProfile(true)}
            >
              <Ionicons name="person-circle" size={20} color="#1a73e8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Trip Statistics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Statistics</Text>
          <View style={styles.statsGrid}>
            {userStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons name={stat.icon} size={24} color="#1a73e8" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => setShowFullProfile(true)}
            >
              <Ionicons name="person-outline" size={20} color="#1a73e8" />
              <Text style={styles.quickActionText}>View Full Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Travel History', 'View your complete travel history and experiences')}
            >
              <Ionicons name="calendar-outline" size={20} color="#1a73e8" />
              <Text style={styles.quickActionText}>Travel History</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Settings', 'Manage app preferences and notifications')}
            >
              <Ionicons name="settings-outline" size={20} color="#1a73e8" />
              <Text style={styles.quickActionText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickActionCard}
              onPress={() => Alert.alert('Help', 'Get help and support for your travel needs')}
            >
              <Ionicons name="help-circle-outline" size={20} color="#1a73e8" />
              <Text style={styles.quickActionText}>Help & Support</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Travel Preferences */}
        {userProfile && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Your Travel Preferences</Text>
            <View style={styles.preferencesContainer}>
              {userProfile.destinations && userProfile.destinations.length > 0 && (
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Planned Destinations:</Text>
                  <View style={styles.destinationTags}>
                    {userProfile.destinations.slice(0, 3).map((dest, index) => (
                      <View key={index} style={styles.destinationTag}>
                        <Text style={styles.destinationTagText}>
                          {dest.charAt(0).toUpperCase() + dest.slice(1)}
                        </Text>
                      </View>
                    ))}
                    {userProfile.destinations.length > 3 && (
                      <Text style={styles.moreDestinations}>
                        +{userProfile.destinations.length - 3} more
                      </Text>
                    )}
                  </View>
                </View>
              )}
              
              {userProfile.interests && userProfile.interests.length > 0 && (
                <View style={styles.preferenceItem}>
                  <Text style={styles.preferenceLabel}>Interests:</Text>
                  <View style={styles.interestTags}>
                    {userProfile.interests.slice(0, 3).map((interest, index) => (
                      <View key={index} style={styles.interestTag}>
                        <Text style={styles.interestTagText}>
                          {interest.charAt(0).toUpperCase() + interest.slice(1)}
                        </Text>
                      </View>
                    ))}
                    {userProfile.interests.length > 3 && (
                      <Text style={styles.moreInterests}>
                        +{userProfile.interests.length - 3} more
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color="#ea4335" />
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLogoutModal(false)}
        >
          <TouchableOpacity 
            style={styles.logoutModalContent}
            activeOpacity={1}
          >
            <View style={styles.logoutModalHeader}>
              <View style={styles.logoutIconContainer}>
                <Ionicons name="log-out-outline" size={32} color="#ea4335" />
              </View>
            </View>
            
            <Text style={styles.logoutModalTitle}>Confirm Logout</Text>
            <Text style={styles.logoutModalMessage}>
              Are you sure you want to logout? You'll need to login again to access your account.
            </Text>
            
            <View style={styles.logoutModalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.confirmLogoutButton}
                onPress={confirmLogout}
              >
                <Text style={styles.confirmLogoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// Main Tab Navigator dengan clean design
function MainApp({ onLogout }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'AI Features') {
            iconName = focused ? 'sparkles' : 'sparkles-outline';
          } else if (route.name === 'Explore') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1a73e8',
        tabBarInactiveTintColor: '#9aa0a6',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0.5,
          borderTopColor: '#e8eaed',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        }
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="AI Features" component={AIFeaturesScreen} />
      <Tab.Screen name="Explore" component={MapScreen} />
      <Tab.Screen name="Profile">
        {(props) => <ProfileScreen {...props} onLogout={onLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

// Main App Component
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasSelectedRole, setHasSelectedRole] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const initApp = async () => {
      try {
        // Check if user is already registered
        const savedProfile = await AsyncStorage.getItem('userProfile');
        const savedRole = await AsyncStorage.getItem('userRole');
        
        if (savedProfile && savedRole) {
          setUserProfile(JSON.parse(savedProfile));
          setIsRegistered(true);
          setHasSelectedRole(true);
        }
        
        // Simulate app initialization
        await new Promise(resolve => setTimeout(resolve, 1500));
      } catch (error) {
        console.log('App initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();
  }, []);

  const handleRoleSelection = async (role) => {
    try {
      await AsyncStorage.setItem('userRole', role);
      setHasSelectedRole(true);
    } catch (error) {
      console.log('Error saving user role:', error);
    }
  };

  const handleRegistrationComplete = async (formData) => {
    try {
      // Save user profile to AsyncStorage
      const profileWithRole = { ...formData, role: formData.role || 'tourist' };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileWithRole));
      setUserProfile(profileWithRole);
      setIsRegistered(true);
      setShowLogin(false);
    } catch (error) {
      console.log('Error saving user profile:', error);
    }
  };

  const handleLoginSuccess = async (userData) => {
    try {
      // Save user profile to AsyncStorage
      const profileWithRole = { ...userData, role: userData.role || 'tourist' };
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileWithRole));
      setUserProfile(profileWithRole);
      setIsRegistered(true);
      setShowLogin(false);
    } catch (error) {
      console.log('Error saving user profile:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['userProfile', 'userRole']);
      setUserProfile(null);
      setIsRegistered(false);
      setHasSelectedRole(false);
    } catch (error) {
      console.log('Error during logout:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <Text style={styles.loadingTitle}>RASA</Text>
          <Text style={styles.loadingSubtitle}>Revolutionizing Asian Smart Travel</Text>
          <View style={styles.loadingIndicator}>
            <View style={styles.loadingDot} />
            <View style={[styles.loadingDot, { animationDelay: '0.2s' }]} />
            <View style={[styles.loadingDot, { animationDelay: '0.4s' }]} />
          </View>
        </View>
      </View>
    );
  }

  if (!hasSelectedRole) {
    return (
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <RoleSelectionScreen onRoleSelect={handleRoleSelection} />
      </NavigationContainer>
    );
  }

  if (!isRegistered) {
    // Show login screen if user chooses to login
    if (showLogin) {
      return (
        <NavigationContainer>
          <StatusBar style="dark" backgroundColor="#ffffff" />
          <LoginScreen 
            onLoginSuccess={handleLoginSuccess}
            onRegisterPress={() => setShowLogin(false)}
          />
        </NavigationContainer>
      );
    }
    
    // Show registration screen with option to switch to login
    return (
      <NavigationContainer>
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <View style={styles.authContainer}>
          <RegisterScreen onComplete={handleRegistrationComplete} />
          <TouchableOpacity 
            style={styles.switchAuthButton}
            onPress={() => setShowLogin(true)}
          >
            <Text style={styles.switchAuthText}>Already have an account? </Text>
            <Text style={styles.switchAuthLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </NavigationContainer>
    );
  }

  // Determine which app to show based on user role
  const userRole = userProfile?.role || 'tourist';
  
  if (userRole === 'guide') {
    return (
      <GuideApp userProfile={userProfile} onLogout={handleLogout} />
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <MainApp onLogout={handleLogout} />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  loadingSubtitle: {
    fontSize: 16,
    color: '#5f6368',
    marginBottom: 32,
  },
  loadingIndicator: {
    flexDirection: 'row',
    gap: 8,
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1a73e8',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 2,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  profileButton: {
    padding: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#5f6368',
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  seeAllText: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 4,
  },
  serviceSubtitle: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 16,
  },
  destinationsScroll: {
    paddingRight: 20,
  },
  destinationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  destinationImage: {
    width: '100%',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    resizeMode: 'cover',
  },
  destinationImagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  destinationInfo: {
    padding: 12,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  destinationLocation: {
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#202124',
  },
  quickActionsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  quickActionText: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 8,
    textAlign: 'center',
  },
  profileSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f3f4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#5f6368',
  },
  editButton: {
    padding: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
  },
  essentialsList: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  essentialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  essentialContent: {
    flex: 1,
    marginLeft: 12,
  },
  essentialName: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '500',
    marginBottom: 2,
  },
  essentialStatus: {
    fontSize: 12,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  placeholder: {
    width: 40,
  },
  // Additional profile styles
  countryBadge: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  countryText: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  quickActionText: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 8,
    textAlign: 'center',
  },
  preferencesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  preferenceItem: {
    marginBottom: 16,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  destinationTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  destinationTag: {
    backgroundColor: '#e8f0fe',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  destinationTagText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500',
  },
  moreDestinations: {
    fontSize: 12,
    color: '#9aa0a6',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  interestTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  interestTag: {
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  interestTagText: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
  },
  moreInterests: {
    fontSize: 12,
    color: '#9aa0a6',
    fontStyle: 'italic',
    alignSelf: 'center',
  },
  // Service Modal Styles
  serviceModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  serviceCloseButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  servicePlaceholder: {
    width: 40,
  },
  // Auth container styles
  authContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  switchAuthButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  switchAuthText: {
    fontSize: 14,
    color: '#5f6368',
  },
  switchAuthLink: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '600',
  },
  // Logout button styles
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: '#fee2e2',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ea4335',
    marginLeft: 8,
  },
  // Logout modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    width: width - 48,
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoutModalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 12,
  },
  logoutModalMessage: {
    fontSize: 14,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  logoutModalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5f6368',
  },
  confirmLogoutButton: {
    flex: 1,
    backgroundColor: '#ea4335',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#ea4335',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  confirmLogoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});