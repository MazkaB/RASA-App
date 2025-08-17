import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function RegisterScreen({ onComplete }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryOrigin: '',
    destinations: [],
    travelDates: {
      startDate: '',
      endDate: ''
    },
    interests: [],
    travelStyle: '',
    budget: ''
  });

  const countries = [
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'CN', name: 'China', flag: '🇨🇳' },
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'TH', name: 'Thailand', flag: '🇹🇭' }
  ];

  const destinations = [
    { 
      id: 'jakarta', 
      name: 'Jakarta', 
      image: 'https://images.unsplash.com/photo-1555400113-3f1ec3ceec6d?w=300&h=200&fit=crop',
      description: 'Capital city with modern attractions'
    },
    { 
      id: 'bali', 
      name: 'Bali', 
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=200&fit=crop',
      description: 'Beautiful beaches and cultural temples'
    },
    { 
      id: 'yogyakarta', 
      name: 'Yogyakarta', 
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop',
      description: 'Cultural heart with historic temples'
    },
    { 
      id: 'bandung', 
      name: 'Bandung', 
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop',
      description: 'Cool mountain city with great food'
    },
    { 
      id: 'lombok', 
      name: 'Lombok', 
      image: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=300&h=200&fit=crop',
      description: 'Pristine beaches and adventure'
    },
    { 
      id: 'surabaya', 
      name: 'Surabaya', 
      image: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?w=300&h=200&fit=crop',
      description: 'Modern port city in East Java'
    }
  ];

  const interests = [
    { id: 'culture', name: 'Culture & History', icon: 'library-outline', color: '#ea4335' },
    { id: 'nature', name: 'Nature & Wildlife', icon: 'leaf-outline', color: '#34a853' },
    { id: 'food', name: 'Food & Culinary', icon: 'restaurant-outline', color: '#fbbc04' },
    { id: 'adventure', name: 'Adventure Sports', icon: 'fitness-outline', color: '#1a73e8' },
    { id: 'beach', name: 'Beach & Relaxation', icon: 'water-outline', color: '#00bcd4' },
    { id: 'shopping', name: 'Shopping', icon: 'bag-outline', color: '#9c27b0' },
    { id: 'nightlife', name: 'Nightlife', icon: 'wine-outline', color: '#ff5722' },
    { id: 'photography', name: 'Photography', icon: 'camera-outline', color: '#607d8b' }
  ];

  const travelStyles = [
    { id: 'luxury', name: 'Luxury Travel', icon: 'diamond-outline', description: 'Premium accommodations & experiences' },
    { id: 'backpacker', name: 'Backpacker', icon: 'bag-outline', description: 'Budget-friendly & authentic experiences' },
    { id: 'family', name: 'Family Travel', icon: 'people-outline', description: 'Family-friendly activities & accommodations' },
    { id: 'business', name: 'Business Travel', icon: 'briefcase-outline', description: 'Efficient & professional travel' }
  ];

  const budgetRanges = [
    { id: 'budget', name: 'Budget', range: 'Under $50/day', icon: 'cash-outline' },
    { id: 'mid', name: 'Mid-range', range: '$50-100/day', icon: 'card-outline' },
    { id: 'luxury', name: 'Luxury', range: '$100-200/day', icon: 'diamond-outline' },
    { id: 'premium', name: 'Premium', range: 'Above $200/day', icon: 'star-outline' }
  ];

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleDestination = (destinationId) => {
    setFormData(prev => ({
      ...prev,
      destinations: prev.destinations.includes(destinationId)
        ? prev.destinations.filter(id => id !== destinationId)
        : [...prev.destinations, destinationId]
    }));
  };

  const toggleInterest = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.name || !formData.email || !formData.countryOrigin) {
          Alert.alert('Missing Information', 'Please fill in all required fields');
          return false;
        }
        return true;
      case 2:
        if (formData.destinations.length === 0) {
          Alert.alert('Select Destinations', 'Please select at least one destination');
          return false;
        }
        return true;
      case 3:
        if (formData.interests.length === 0) {
          Alert.alert('Select Interests', 'Please select at least one interest');
          return false;
        }
        return true;
      case 4:
        if (!formData.travelStyle || !formData.budget) {
          Alert.alert('Complete Profile', 'Please select travel style and budget');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const completeRegistration = () => {
    if (validateStep()) {
      Alert.alert(
        'Registration Complete!',
        'Welcome to Tourist App Indonesia. Your personalized travel experience awaits!',
        [
          {
            text: 'Start Exploring',
            onPress: () => onComplete(formData)
          }
        ]
      );
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3, 4].map((stepNumber) => (
        <View key={stepNumber} style={styles.progressStep}>
          <View style={[
            styles.progressCircle,
            step >= stepNumber && styles.progressCircleActive
          ]}>
            <Text style={[
              styles.progressText,
              step >= stepNumber && styles.progressTextActive
            ]}>
              {stepNumber}
            </Text>
          </View>
          {stepNumber < 4 && (
            <View style={[
              styles.progressLine,
              step > stepNumber && styles.progressLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Tell us about yourself</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Full Name *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.name}
          onChangeText={(text) => updateFormData('name', text)}
          placeholder="Enter your full name"
          placeholderTextColor="#9aa0a6"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Email Address *</Text>
        <TextInput
          style={styles.textInput}
          value={formData.email}
          onChangeText={(text) => updateFormData('email', text)}
          placeholder="Enter your email"
          placeholderTextColor="#9aa0a6"
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Country of Origin *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.countriesContainer}>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={[
                  styles.countryCard,
                  formData.countryOrigin === country.code && styles.countryCardSelected
                ]}
                onPress={() => updateFormData('countryOrigin', country.code)}
              >
                <Text style={styles.countryFlag}>{country.flag}</Text>
                <Text style={[
                  styles.countryName,
                  formData.countryOrigin === country.code && styles.countryNameSelected
                ]}>
                  {country.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Choose Your Destinations</Text>
      <Text style={styles.stepSubtitle}>Select places you want to visit in Indonesia</Text>

      <View style={styles.destinationsGrid}>
        {destinations.map((destination) => (
          <TouchableOpacity
            key={destination.id}
            style={[
              styles.destinationCard,
              formData.destinations.includes(destination.id) && styles.destinationCardSelected
            ]}
            onPress={() => toggleDestination(destination.id)}
          >
            <Image source={{ uri: destination.image }} style={styles.destinationImage} />
            <View style={styles.destinationOverlay}>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <Text style={styles.destinationDescription}>{destination.description}</Text>
            </View>
            {formData.destinations.includes(destination.id) && (
              <View style={styles.selectedIndicator}>
                <Ionicons name="checkmark" size={16} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your Travel Interests</Text>
      <Text style={styles.stepSubtitle}>What kind of experiences do you enjoy?</Text>

      <View style={styles.interestsGrid}>
        {interests.map((interest) => (
          <TouchableOpacity
            key={interest.id}
            style={[
              styles.interestCard,
              formData.interests.includes(interest.id) && { 
                borderColor: interest.color,
                backgroundColor: `${interest.color}15`
              }
            ]}
            onPress={() => toggleInterest(interest.id)}
          >
            <Ionicons 
              name={interest.icon} 
              size={24} 
              color={formData.interests.includes(interest.id) ? interest.color : '#5f6368'} 
            />
            <Text style={[
              styles.interestText,
              formData.interests.includes(interest.id) && { color: interest.color }
            ]}>
              {interest.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Travel Preferences</Text>
      <Text style={styles.stepSubtitle}>How do you like to travel?</Text>

      <Text style={styles.sectionLabel}>Travel Style</Text>
      <View style={styles.travelStylesContainer}>
        {travelStyles.map((style) => (
          <TouchableOpacity
            key={style.id}
            style={[
              styles.travelStyleCard,
              formData.travelStyle === style.id && styles.travelStyleCardSelected
            ]}
            onPress={() => updateFormData('travelStyle', style.id)}
          >
            <Ionicons 
              name={style.icon} 
              size={24} 
              color={formData.travelStyle === style.id ? '#1a73e8' : '#5f6368'} 
            />
            <Text style={[
              styles.travelStyleName,
              formData.travelStyle === style.id && styles.travelStyleNameSelected
            ]}>
              {style.name}
            </Text>
            <Text style={styles.travelStyleDescription}>{style.description}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.sectionLabel}>Budget Range</Text>
      <View style={styles.budgetContainer}>
        {budgetRanges.map((budget) => (
          <TouchableOpacity
            key={budget.id}
            style={[
              styles.budgetCard,
              formData.budget === budget.id && styles.budgetCardSelected
            ]}
            onPress={() => updateFormData('budget', budget.id)}
          >
            <Ionicons 
              name={budget.icon} 
              size={20} 
              color={formData.budget === budget.id ? '#1a73e8' : '#5f6368'} 
            />
            <View style={styles.budgetContent}>
              <Text style={[
                styles.budgetName,
                formData.budget === budget.id && styles.budgetNameSelected
              ]}>
                {budget.name}
              </Text>
              <Text style={styles.budgetRange}>{budget.range}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Welcome to Indonesia! 🇮🇩</Text>
        <Text style={styles.headerSubtitle}>Let's personalize your travel experience</Text>
      </View>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        {step > 1 && (
          <TouchableOpacity style={styles.prevButton} onPress={prevStep}>
            <Ionicons name="arrow-back" size={20} color="#5f6368" />
            <Text style={styles.prevText}>Previous</Text>
          </TouchableOpacity>
        )}
        
        <View style={styles.spacer} />
        
        {step < 4 ? (
          <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
            <Text style={styles.nextText}>Next</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.completeButton} onPress={completeRegistration}>
            <Text style={styles.completeText}>Complete Registration</Text>
            <Ionicons name="checkmark" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

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
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5f6368',
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#ffffff',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircleActive: {
    backgroundColor: '#1a73e8',
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5f6368',
  },
  progressTextActive: {
    color: '#ffffff',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#e8eaed',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#1a73e8',
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#202124',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  countriesContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  countryCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
    minWidth: 80,
  },
  countryCardSelected: {
    borderColor: '#1a73e8',
    backgroundColor: '#e8f0fe',
  },
  countryFlag: {
    fontSize: 24,
    marginBottom: 4,
  },
  countryName: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
  },
  countryNameSelected: {
    color: '#1a73e8',
    fontWeight: '500',
  },
  destinationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  destinationCard: {
    width: (width - 52) / 2,
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#e8eaed',
    position: 'relative',
  },
  destinationCardSelected: {
    borderColor: '#1a73e8',
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  destinationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  destinationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  destinationDescription: {
    fontSize: 11,
    color: '#ffffff',
    opacity: 0.9,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
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
  sectionLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
    marginTop: 8,
  },
  travelStylesContainer: {
    gap: 12,
    marginBottom: 24,
  },
  travelStyleCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
    flexDirection: 'row',
    alignItems: 'center',
  },
  travelStyleCardSelected: {
    borderColor: '#1a73e8',
    backgroundColor: '#e8f0fe',
  },
  travelStyleName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 16,
    flex: 1,
  },
  travelStyleNameSelected: {
    color: '#1a73e8',
  },
  travelStyleDescription: {
    fontSize: 12,
    color: '#5f6368',
    marginLeft: 16,
    flex: 2,
  },
  budgetContainer: {
    gap: 8,
  },
  budgetCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
    flexDirection: 'row',
    alignItems: 'center',
  },
  budgetCardSelected: {
    borderColor: '#1a73e8',
    backgroundColor: '#e8f0fe',
  },
  budgetContent: {
    marginLeft: 16,
  },
  budgetName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  budgetNameSelected: {
    color: '#1a73e8',
  },
  budgetRange: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 2,
  },
  navigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  prevText: {
    fontSize: 14,
    color: '#5f6368',
    marginLeft: 8,
    fontWeight: '500',
  },
  spacer: {
    flex: 1,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  nextText: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 8,
    fontWeight: '600',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#34a853',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  completeText: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 8,
    fontWeight: '600',
  },
});