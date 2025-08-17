import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://localhost:5000';

const AIItineraryGenerator = ({ onClose }) => {
  const [preferences, setPreferences] = useState({
    destination: 'Bali',
    duration: '3',
    interests: [],
    budget: '500',
    groupSize: '2'
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState(null);

  const interests = [
    { id: 'culture', name: 'Culture & History', icon: 'library-outline', color: '#ea4335' },
    { id: 'nature', name: 'Nature & Wildlife', icon: 'leaf-outline', color: '#34a853' },
    { id: 'food', name: 'Food & Culinary', icon: 'restaurant-outline', color: '#fbbc04' },
    { id: 'adventure', name: 'Adventure Sports', icon: 'fitness-outline', color: '#1a73e8' },
    { id: 'beach', name: 'Beach & Relaxation', icon: 'water-outline', color: '#00bcd4' },
    { id: 'shopping', name: 'Shopping', icon: 'bag-outline', color: '#9c27b0' }
  ];

  const destinations = [
    'Bali', 'Jakarta', 'Yogyakarta', 'Bandung', 'Lombok', 'Surabaya'
  ];

  const toggleInterest = (interestId) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const generateItinerary = async () => {
    if (!preferences.destination) {
      Alert.alert('Missing Information', 'Please select a destination');
      return;
    }
    if (preferences.interests.length === 0) {
      Alert.alert('Missing Information', 'Please select at least one interest');
      return;
    }

    setIsGenerating(true);
    try {
      // Try to connect to backend first
      const response = await axios.post(`${API_BASE_URL}/api/ai/itinerary/generate`, preferences, {
        timeout: 5000
      });
      setGeneratedItinerary(response.data.itinerary);
    } catch (error) {
      console.log('Backend unavailable, using demo data');
      // Fallback to demo itinerary
      const demoItinerary = generateDemoItinerary();
      setGeneratedItinerary(demoItinerary);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateDemoItinerary = () => {
    const selectedInterests = preferences.interests.map(id => 
      interests.find(i => i.id === id)?.name || id
    ).join(', ');

    return {
      destination: preferences.destination,
      duration: `${preferences.duration} days`,
      budget: `$${preferences.budget}`,
      days: [
        {
          day: 1,
          title: "Arrival & Cultural Exploration",
          activities: [
            { time: "09:00", activity: "Airport pickup and hotel check-in", cost: "$25" },
            { time: "11:00", activity: "Traditional market visit & local breakfast", cost: "$15" },
            { time: "14:00", activity: "Cultural center and museum tour", cost: "$12" },
            { time: "18:00", activity: "Welcome dinner at local restaurant", cost: "$30" }
          ],
          total: "$82"
        },
        {
          day: 2,
          title: "Adventure & Nature Day",
          activities: [
            { time: "07:00", activity: "Sunrise trek to viewpoint", cost: "$20" },
            { time: "10:00", activity: "Traditional breakfast at local warung", cost: "$8" },
            { time: "13:00", activity: "Nature reserve exploration", cost: "$15" },
            { time: "16:00", activity: "Craft workshop experience", cost: "$25" },
            { time: "19:00", activity: "Seafood dinner by the beach", cost: "$35" }
          ],
          total: "$103"
        },
        {
          day: 3,
          title: "Relaxation & Departure",
          activities: [
            { time: "09:00", activity: "Beach relaxation and swimming", cost: "$5" },
            { time: "12:00", activity: "Spa treatment and massage", cost: "$40" },
            { time: "15:00", activity: "Souvenir shopping", cost: "$50" },
            { time: "18:00", activity: "Farewell dinner", cost: "$45" },
            { time: "21:00", activity: "Airport transfer", cost: "$25" }
          ],
          total: "$165"
        }
      ],
      highlights: [
        "🏛️ UNESCO World Heritage site visit",
        "🍜 Authentic local food experiences",
        "🏔️ Stunning sunrise viewpoint trek",
        "🏖️ Private beach access",
        "🎨 Traditional craft workshops"
      ],
      tips: [
        "Bring comfortable walking shoes",
        "Pack light rain jacket for outdoor activities",
        "Try local transportation like ojek or angkot",
        "Learn basic Bahasa Indonesia phrases",
        "Always carry small bills for local vendors"
      ],
      totalBudget: "$350",
      notes: `Customized for ${selectedInterests} interests. All prices are estimates and may vary based on season and availability.`
    };
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="map-outline" size={24} color="#1a73e8" />
          <Text style={styles.headerTitle}>AI Itinerary Generator</Text>
        </View>
        <Text style={styles.headerSubtitle}>Create your perfect Indonesian adventure</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {!generatedItinerary ? (
          <>
            {/* Destination Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Destination</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.destinationsRow}>
                  {destinations.map((dest) => (
                    <TouchableOpacity
                      key={dest}
                      style={[
                        styles.destinationChip,
                        preferences.destination === dest && styles.selectedChip
                      ]}
                      onPress={() => setPreferences(prev => ({ ...prev, destination: dest }))}
                    >
                      <Text style={[
                        styles.chipText,
                        preferences.destination === dest && styles.selectedChipText
                      ]}>
                        {dest}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Trip Details */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Trip Details</Text>
              <View style={styles.detailsGrid}>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Duration (days)</Text>
                  <TextInput
                    style={styles.detailInput}
                    value={preferences.duration}
                    onChangeText={(text) => setPreferences(prev => ({ ...prev, duration: text }))}
                    keyboardType="numeric"
                    placeholder="3"
                  />
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Budget (USD)</Text>
                  <TextInput
                    style={styles.detailInput}
                    value={preferences.budget}
                    onChangeText={(text) => setPreferences(prev => ({ ...prev, budget: text }))}
                    keyboardType="numeric"
                    placeholder="500"
                  />
                </View>
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>Group Size</Text>
                  <TextInput
                    style={styles.detailInput}
                    value={preferences.groupSize}
                    onChangeText={(text) => setPreferences(prev => ({ ...prev, groupSize: text }))}
                    keyboardType="numeric"
                    placeholder="2"
                  />
                </View>
              </View>
            </View>

            {/* Interests Selection */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Your Interests</Text>
              <View style={styles.interestsGrid}>
                {interests.map((interest) => (
                  <TouchableOpacity
                    key={interest.id}
                    style={[
                      styles.interestCard,
                      preferences.interests.includes(interest.id) && { 
                        borderColor: interest.color,
                        backgroundColor: `${interest.color}15`
                      }
                    ]}
                    onPress={() => toggleInterest(interest.id)}
                  >
                    <Ionicons 
                      name={interest.icon} 
                      size={24} 
                      color={preferences.interests.includes(interest.id) ? interest.color : '#5f6368'} 
                    />
                    <Text style={[
                      styles.interestText,
                      preferences.interests.includes(interest.id) && { color: interest.color }
                    ]}>
                      {interest.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Generate Button */}
            <TouchableOpacity
              style={[styles.generateButton, isGenerating && styles.generatingButton]}
              onPress={generateItinerary}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.generateText}>Generating...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="sparkles" size={20} color="#fff" />
                  <Text style={styles.generateText}>Generate AI Itinerary</Text>
                </>
              )}
            </TouchableOpacity>
          </>
        ) : (
          // Generated Itinerary Display
          <View style={styles.itineraryContainer}>
            {/* Itinerary Header */}
            <View style={styles.itineraryHeader}>
              <Text style={styles.itineraryTitle}>
                {generatedItinerary.duration} in {generatedItinerary.destination}
              </Text>
              <Text style={styles.itineraryBudget}>
                Total Budget: {generatedItinerary.totalBudget}
              </Text>
            </View>

            {/* Daily Itinerary */}
            {generatedItinerary.days.map((day) => (
              <View key={day.day} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <Text style={styles.dayTitle}>Day {day.day}</Text>
                  <Text style={styles.daySubtitle}>{day.title}</Text>
                  <Text style={styles.dayTotal}>Total: {day.total}</Text>
                </View>
                
                {day.activities.map((activity, index) => (
                  <View key={index} style={styles.activityItem}>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                    <Text style={styles.activityText}>{activity.activity}</Text>
                    <Text style={styles.activityCost}>{activity.cost}</Text>
                  </View>
                ))}
              </View>
            ))}

            {/* Highlights & Tips */}
            <View style={styles.extrasContainer}>
              <View style={styles.highlightsSection}>
                <Text style={styles.extrasTitle}>Trip Highlights</Text>
                {generatedItinerary.highlights.map((highlight, index) => (
                  <Text key={index} style={styles.highlightText}>{highlight}</Text>
                ))}
              </View>

              <View style={styles.tipsSection}>
                <Text style={styles.extrasTitle}>Travel Tips</Text>
                {generatedItinerary.tips.map((tip, index) => (
                  <Text key={index} style={styles.tipText}>• {tip}</Text>
                ))}
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => setGeneratedItinerary(null)}
              >
                <Ionicons name="refresh" size={16} color="#1a73e8" />
                <Text style={styles.actionText}>Generate New</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={16} color="#1a73e8" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 12,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5f6368',
    marginLeft: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  destinationsRow: {
    flexDirection: 'row',
    gap: 8,
    paddingRight: 20,
  },
  destinationChip: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  selectedChip: {
    backgroundColor: '#1a73e8',
    borderColor: '#1a73e8',
  },
  chipText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  selectedChipText: {
    color: '#ffffff',
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 6,
    fontWeight: '500',
  },
  detailInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
    fontSize: 16,
    color: '#202124',
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  interestCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: (width - 64) / 2,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  interestText: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  generateButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  generatingButton: {
    backgroundColor: '#9aa0a6',
  },
  generateText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  itineraryContainer: {
    marginTop: 20,
  },
  itineraryHeader: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
    alignItems: 'center',
  },
  itineraryTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8,
  },
  itineraryBudget: {
    fontSize: 16,
    color: '#34a853',
    fontWeight: '600',
  },
  dayCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  dayHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a73e8',
    marginBottom: 4,
  },
  daySubtitle: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 4,
  },
  dayTotal: {
    fontSize: 14,
    color: '#34a853',
    fontWeight: '600',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  activityTime: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '600',
    width: 50,
  },
  activityText: {
    flex: 1,
    fontSize: 14,
    color: '#202124',
    marginHorizontal: 12,
  },
  activityCost: {
    fontSize: 12,
    color: '#34a853',
    fontWeight: '500',
  },
  extrasContainer: {
    gap: 16,
    marginTop: 8,
  },
  highlightsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  tipsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  extrasTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  highlightText: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 6,
    lineHeight: 20,
  },
  tipText: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 6,
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  actionText: {
    fontSize: 14,
    color: '#1a73e8',
    marginLeft: 6,
    fontWeight: '500',
  },
});

export default AIItineraryGenerator;