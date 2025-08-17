import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, 
  SafeAreaView, ScrollView, Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const MapScreen = () => {
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Sample tourist destinations in Indonesia
  const touristDestinations = [
    {
      id: 1,
      name: 'Monas (National Monument)',
      description: 'Iconic monument in Jakarta',
      location: 'Central Jakarta',
      category: 'Monument',
      rating: 4.2,
      emoji: '🏛️',
      features: ['Historical', 'City View', 'Museum']
    },
    {
      id: 2,
      name: 'Borobudur Temple',
      description: 'Ancient Buddhist temple',
      location: 'Yogyakarta',
      category: 'Temple',
      rating: 4.8,
      emoji: '🛕',
      features: ['UNESCO Site', 'Sunrise View', 'Cultural']
    },
    {
      id: 3,
      name: 'Kuta Beach Bali',
      description: 'Famous beach in Bali',
      location: 'Bali',
      category: 'Beach',
      rating: 4.5,
      emoji: '🏖️',
      features: ['Surfing', 'Sunset', 'Nightlife']
    },
    {
      id: 4,
      name: 'Mount Bromo',
      description: 'Active volcano in East Java',
      location: 'East Java',
      category: 'Mountain',
      rating: 4.7,
      emoji: '🏔️',
      features: ['Hiking', 'Sunrise', 'Adventure']
    },
    {
      id: 5,
      name: 'Komodo Island',
      description: 'Home of Komodo dragons',
      location: 'Flores',
      category: 'Island',
      rating: 4.9,
      emoji: '🦎',
      features: ['Wildlife', 'Diving', 'National Park']
    },
    {
      id: 6,
      name: 'Taman Mini Indonesia',
      description: 'Cultural theme park',
      location: 'Jakarta',
      category: 'Cultural',
      rating: 4.1,
      emoji: '🎭',
      features: ['Cultural', 'Family', 'Educational']
    }
  ];

  const getDirections = (destination) => {
    Alert.alert(
      'Get Directions',
      `Navigate to ${destination.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open Maps', 
          onPress: () => {
            Alert.alert('Navigation', `Would open Google Maps to ${destination.name}`);
          }
        }
      ]
    );
  };

  const renderDestinationCard = (destination) => (
    <TouchableOpacity
      key={destination.id}
      style={styles.destinationCard}
      onPress={() => setSelectedDestination(destination)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.destinationEmoji}>{destination.emoji}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.destinationName}>{destination.name}</Text>
          <Text style={styles.destinationLocation}>{destination.location}</Text>
        </View>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={16} color="#FFD700" />
          <Text style={styles.ratingText}>{destination.rating}</Text>
        </View>
      </View>
      
      <Text style={styles.destinationDescription}>{destination.description}</Text>
      
      <View style={styles.featuresContainer}>
        {destination.features.map((feature, index) => (
          <View key={index} style={styles.featureTag}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
      
      <TouchableOpacity 
        style={styles.directionsButton}
        onPress={() => getDirections(destination)}
      >
        <Ionicons name="navigate" size={16} color="#fff" />
        <Text style={styles.directionsText}>Get Directions</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>🗺️ Explore Indonesia</Text>
        <Text style={styles.headerSubtitle}>
          Discover amazing destinations across the archipelago
        </Text>
      </LinearGradient>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Map Placeholder */}
        <View style={styles.mapPlaceholder}>
          <LinearGradient
            colors={['#4facfe', '#00f2fe']}
            style={styles.mapGradient}
          >
            <Ionicons name="map" size={48} color="rgba(255,255,255,0.8)" />
            <Text style={styles.mapPlaceholderTitle}>Interactive Map</Text>
            <Text style={styles.mapPlaceholderSubtitle}>
              Google Maps integration available
            </Text>
            
            <View style={styles.mapFeatures}>
              <View style={styles.mapFeature}>
                <Ionicons name="location" size={20} color="rgba(255,255,255,0.9)" />
                <Text style={styles.mapFeatureText}>Real-time location</Text>
              </View>
              <View style={styles.mapFeature}>
                <Ionicons name="navigate" size={20} color="rgba(255,255,255,0.9)" />
                <Text style={styles.mapFeatureText}>Turn-by-turn directions</Text>
              </View>
              <View style={styles.mapFeature}>
                <Ionicons name="star" size={20} color="rgba(255,255,255,0.9)" />
                <Text style={styles.mapFeatureText}>Popular attractions</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Categories */}
        <View style={styles.categoriesContainer}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesScroll}
          >
            {['All', 'Temple', 'Beach', 'Mountain', 'Cultural', 'Monument'].map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryButton}>
                <Text style={styles.categoryText}>{category}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Destinations List */}
        <View style={styles.destinationsContainer}>
          <Text style={styles.sectionTitle}>Popular Destinations</Text>
          {touristDestinations.map(renderDestinationCard)}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="location" size={24} color="#667eea" />
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>Find Nearby</Text>
              <Text style={styles.quickActionSubtitle}>Discover attractions around you</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="bookmark" size={24} color="#e74c3c" />
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>Saved Places</Text>
              <Text style={styles.quickActionSubtitle}>Your favorite destinations</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickActionCard}>
            <Ionicons name="car" size={24} color="#27ae60" />
            <View style={styles.quickActionText}>
              <Text style={styles.quickActionTitle}>Transportation</Text>
              <Text style={styles.quickActionSubtitle}>Find rides and routes</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  mapPlaceholder: {
    marginHorizontal: 20,
    marginTop: 30,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  mapGradient: {
    padding: 30,
    alignItems: 'center',
  },
  mapPlaceholderTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginTop: 15,
    marginBottom: 5,
  },
  mapPlaceholderSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 20,
  },
  mapFeatures: {
    width: '100%',
  },
  mapFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  mapFeatureText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginLeft: 10,
    fontWeight: '500',
  },
  categoriesContainer: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  categoryText: {
    fontSize: 14,
    color: '#667eea',
    fontWeight: '500',
  },
  destinationsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  destinationCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  destinationEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 2,
  },
  destinationLocation: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  destinationDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 15,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  featureTag: {
    backgroundColor: '#f8f9fa',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 8,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  featureText: {
    fontSize: 12,
    color: '#667eea',
    fontWeight: '500',
  },
  directionsButton: {
    backgroundColor: '#667eea',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  directionsText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  quickActionsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  quickActionCard: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  quickActionText: {
    flex: 1,
    marginLeft: 15,
  },
  quickActionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});

export default MapScreen;