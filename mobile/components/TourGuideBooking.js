import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TourGuideBooking = ({ onClose, userProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showCityGuideModal, setShowCityGuideModal] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: '4',
    groupSize: '2',
    specialRequests: ''
  });

  const categories = [
    { id: 'all', name: 'All Guides', icon: 'people-outline' },
    { id: 'cultural', name: 'Cultural', icon: 'library-outline' },
    { id: 'nature', name: 'Nature', icon: 'leaf-outline' },
    { id: 'adventure', name: 'Adventure', icon: 'fitness-outline' },
    { id: 'food', name: 'Food Tours', icon: 'restaurant-outline' },
    { id: 'city', name: 'City Tours', icon: 'business-outline' }
  ];

  const cityOptions = [
    { id: 'jakarta', name: 'Jakarta', region: 'Java' },
    { id: 'yogyakarta', name: 'Yogyakarta', region: 'Java' },
    { id: 'bandung', name: 'Bandung', region: 'Java' },
    { id: 'surabaya', name: 'Surabaya', region: 'Java' },
    { id: 'bali', name: 'Bali', region: 'Bali' },
    { id: 'lombok', name: 'Lombok', region: 'Nusa Tenggara' },
    { id: 'medan', name: 'Medan', region: 'Sumatra' },
    { id: 'makassar', name: 'Makassar', region: 'Sulawesi' },
    { id: 'balikpapan', name: 'Balikpapan', region: 'Kalimantan' },
    { id: 'jayapura', name: 'Jayapura', region: 'Papua' }
  ];

  const tourGuides = [
    {
      id: 1,
      name: 'Sari Dewi',
      category: 'cultural',
      location: 'Yogyakarta',
      cityId: 'yogyakarta',
      type: 'individual',
      rating: 4.9,
      reviews: 234,
      languages: ['Indonesian', 'English', 'Dutch'],
      specialties: ['Borobudur', 'Prambanan', 'Sultan Palace'],
      price: 150000,
      availability: 'Available Today',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b8a5?w=150&h=150&fit=crop&crop=face',
      experience: '8 years',
      description: 'Expert in Javanese culture and history with UNESCO site specialization.',
      verifiedBadge: true,
      responseTime: '< 1 hour'
    },
    {
      id: 2,
      name: 'Made Arya',
      category: 'nature',
      location: 'Bali',
      cityId: 'bali',
      type: 'individual',
      rating: 4.8,
      reviews: 189,
      languages: ['Indonesian', 'English', 'Japanese'],
      specialties: ['Rice Terraces', 'Volcano Hiking', 'Waterfalls'],
      price: 200000,
      availability: 'Available Tomorrow',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      experience: '6 years',
      description: 'Adventure specialist with deep knowledge of Bali\'s natural wonders.',
      verifiedBadge: true,
      responseTime: '< 2 hours'
    },
    {
      id: 3,
      name: 'Rika Putri',
      category: 'food',
      location: 'Jakarta',
      cityId: 'jakarta',
      type: 'individual',
      rating: 4.7,
      reviews: 156,
      languages: ['Indonesian', 'English', 'Mandarin'],
      specialties: ['Street Food', 'Traditional Markets', 'Cooking Classes'],
      price: 120000,
      availability: 'Available Today',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      experience: '4 years',
      description: 'Culinary expert who knows the best hidden food gems in Jakarta.',
      verifiedBadge: true,
      responseTime: '< 30 min'
    },
    {
      id: 4,
      name: 'Budi Santoso',
      category: 'adventure',
      location: 'East Java',
      cityId: 'surabaya',
      type: 'individual',
      rating: 4.9,
      reviews: 267,
      languages: ['Indonesian', 'English'],
      specialties: ['Mount Bromo', 'Ijen Crater', 'Hiking'],
      price: 250000,
      availability: 'Available This Week',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      experience: '10 years',
      description: 'Professional mountaineer and certified adventure guide.',
      verifiedBadge: true,
      responseTime: '< 3 hours'
    },
    {
      id: 5,
      name: 'Lisa Handayani',
      category: 'city',
      location: 'Jakarta',
      cityId: 'jakarta',
      type: 'individual',
      rating: 4.6,
      reviews: 98,
      languages: ['Indonesian', 'English', 'Korean'],
      specialties: ['Modern Jakarta', 'Shopping', 'Nightlife'],
      price: 100000,
      availability: 'Available Today',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
      experience: '3 years',
      description: 'Young, energetic guide specializing in modern Jakarta experiences.',
      verifiedBadge: false,
      responseTime: '< 1 hour'
    },
    {
      id: 6,
      name: 'Pak Wayan',
      category: 'cultural',
      location: 'Bali',
      cityId: 'bali',
      type: 'individual',
      rating: 4.8,
      reviews: 302,
      languages: ['Indonesian', 'English', 'German'],
      specialties: ['Hindu Temples', 'Traditional Ceremonies', 'Art Villages'],
      price: 180000,
      availability: 'Available Tomorrow',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      experience: '15 years',
      description: 'Balinese cultural expert with deep spiritual knowledge.',
      verifiedBadge: true,
      responseTime: '< 2 hours'
    },
    // Vendor Companies
    {
      id: 7,
      name: 'Java Heritage Tours',
      category: 'cultural',
      location: 'Yogyakarta',
      cityId: 'yogyakarta',
      type: 'vendor',
      rating: 4.7,
      reviews: 456,
      languages: ['Indonesian', 'English', 'Dutch', 'Japanese'],
      specialties: ['UNESCO Sites', 'Cultural Heritage', 'Group Tours'],
      price: 300000,
      availability: 'Available Daily',
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=150&h=150&fit=crop',
      experience: 'Company since 2015',
      description: 'Professional tour company specializing in Javanese cultural heritage tours.',
      verifiedBadge: true,
      responseTime: '< 30 min',
      teamSize: '15+ guides'
    },
    {
      id: 8,
      name: 'Bali Adventure Co.',
      category: 'adventure',
      location: 'Bali',
      cityId: 'bali',
      type: 'vendor',
      rating: 4.9,
      reviews: 789,
      languages: ['Indonesian', 'English', 'Japanese', 'Korean'],
      specialties: ['Volcano Trekking', 'Water Sports', 'Adventure Tours'],
      price: 400000,
      availability: 'Available Daily',
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=150&h=150&fit=crop',
      experience: 'Company since 2012',
      description: 'Leading adventure tour operator in Bali with certified professionals.',
      verifiedBadge: true,
      responseTime: '< 15 min',
      teamSize: '25+ guides'
    },
    {
      id: 9,
      name: 'Jakarta Food Tours',
      category: 'food',
      location: 'Jakarta',
      cityId: 'jakarta',
      type: 'vendor',
      rating: 4.6,
      reviews: 234,
      languages: ['Indonesian', 'English', 'Mandarin'],
      specialties: ['Street Food', 'Fine Dining', 'Cooking Classes'],
      price: 250000,
      availability: 'Available Daily',
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=150&h=150&fit=crop',
      experience: 'Company since 2018',
      description: 'Culinary tour specialist connecting visitors with Jakarta\'s food scene.',
      verifiedBadge: true,
      responseTime: '< 1 hour',
      teamSize: '10+ guides'
    },
    {
      id: 10,
      name: 'Lombok Explorer',
      category: 'nature',
      location: 'Lombok',
      cityId: 'lombok',
      type: 'vendor',
      rating: 4.8,
      reviews: 167,
      languages: ['Indonesian', 'English', 'Dutch'],
      specialties: ['Rinjani Trekking', 'Gili Islands', 'Snorkeling'],
      price: 350000,
      availability: 'Available Daily',
      image: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=150&h=150&fit=crop',
      experience: 'Company since 2016',
      description: 'Expert guides for Lombok and Gili Islands adventures.',
      verifiedBadge: true,
      responseTime: '< 2 hours',
      teamSize: '12+ guides'
    },
    // More Individual Guides
    {
      id: 11,
      name: 'Ahmad Supardi',
      category: 'cultural',
      location: 'Bandung',
      cityId: 'bandung',
      type: 'individual',
      rating: 4.5,
      reviews: 134,
      languages: ['Indonesian', 'English', 'Sundanese'],
      specialties: ['Sundanese Culture', 'Art Villages', 'Traditional Crafts'],
      price: 140000,
      availability: 'Available Today',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      experience: '6 years',
      description: 'Local expert in Sundanese culture and traditional arts.',
      verifiedBadge: true,
      responseTime: '< 2 hours'
    },
    {
      id: 12,
      name: 'Putri Sari',
      category: 'nature',
      location: 'Medan',
      cityId: 'medan',
      type: 'individual',
      rating: 4.7,
      reviews: 89,
      languages: ['Indonesian', 'English', 'Batak'],
      specialties: ['Lake Toba', 'Orangutan Tours', 'Traditional Villages'],
      price: 180000,
      availability: 'Available Tomorrow',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b8a5?w=150&h=150&fit=crop&crop=face',
      experience: '5 years',
      description: 'Specialist in North Sumatra natural attractions and Batak culture.',
      verifiedBadge: true,
      responseTime: '< 3 hours'
    }
  ];

  const filteredGuides = tourGuides.filter(guide => {
    const matchesCategory = selectedCategory === 'all' || guide.category === selectedCategory;
    const matchesCity = !selectedCity || guide.cityId === selectedCity;
    return matchesCategory && matchesCity;
  });

  const durations = [
    { value: '2', label: '2 Hours', price: 0.5 },
    { value: '4', label: '4 Hours', price: 1 },
    { value: '8', label: 'Full Day', price: 1.8 },
    { value: '16', label: '2 Days', price: 3.2 }
  ];

  const groupSizes = [
    { value: '1', label: '1 Person' },
    { value: '2', label: '2 People' },
    { value: '4', label: '4 People' },
    { value: '6', label: '6 People' },
    { value: '8+', label: '8+ People' }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'
  ];

  const openBookingModal = (guide) => {
    setSelectedGuide(guide);
    setShowBookingModal(true);
  };

  const calculateTotalPrice = () => {
    if (!selectedGuide) return 0;
    const duration = durations.find(d => d.value === bookingData.duration);
    const basePrice = selectedGuide.price * (duration?.price || 1);
    const groupMultiplier = bookingData.groupSize === '1' ? 1 : 
                           bookingData.groupSize === '2' ? 1.2 :
                           bookingData.groupSize === '4' ? 1.8 :
                           bookingData.groupSize === '6' ? 2.4 : 3;
    return Math.round(basePrice * groupMultiplier);
  };

  const submitBooking = () => {
    if (!bookingData.date || !bookingData.time) {
      Alert.alert('Missing Information', 'Please select date and time');
      return;
    }

    const totalPrice = calculateTotalPrice();
    Alert.alert(
      'Booking Confirmation',
      `Guide: ${selectedGuide.name}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\nDuration: ${durations.find(d => d.value === bookingData.duration)?.label}\nGroup: ${bookingData.groupSize} people\nTotal: Rp ${totalPrice.toLocaleString()}\n\nProceed with booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Book Now', 
          onPress: () => {
            setShowBookingModal(false);
            Alert.alert('Success!', 'Your booking request has been sent to the guide. You will receive confirmation within 1 hour.');
          }
        }
      ]
    );
  };

  const renderGuideCard = ({ item: guide }) => (
    <TouchableOpacity 
      style={styles.guideCard} 
      onPress={() => openBookingModal(guide)}
      activeOpacity={0.7}
    >
      <View style={styles.guideImageContainer}>
        <Image source={{ uri: guide.image }} style={styles.guideImage} />
        {guide.verifiedBadge && (
          <View style={styles.verifiedBadge}>
            <Ionicons name="checkmark-circle" size={16} color="#34a853" />
          </View>
        )}
        <View style={[styles.availabilityBadge, { 
          backgroundColor: guide.availability.includes('Today') ? '#34a853' : '#fbbc04' 
        }]}>
          <Text style={styles.availabilityText}>
            {guide.availability.includes('Today') ? 'Available' : 'Busy'}
          </Text>
        </View>
      </View>
      
      <View style={styles.guideInfo}>
        <View style={styles.guideHeader}>
          <Text style={styles.guideName}>{guide.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color="#fbbc04" />
            <Text style={styles.ratingText}>{guide.rating}</Text>
            <Text style={styles.reviewCount}>({guide.reviews})</Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#5f6368" />
          <Text style={styles.locationText}>{guide.location}</Text>
          <Text style={styles.experienceText}>{guide.experience} exp</Text>
        </View>
        
        <Text style={styles.guideDescription} numberOfLines={2}>
          {guide.description}
        </Text>
        
        <View style={styles.specialtiesContainer}>
          {guide.specialties.slice(0, 2).map((specialty, index) => (
            <View key={index} style={styles.specialtyTag}>
              <Text style={styles.specialtyText}>{specialty}</Text>
            </View>
          ))}
          {guide.specialties.length > 2 && (
            <Text style={styles.moreSpecialties}>+{guide.specialties.length - 2}</Text>
          )}
        </View>
        
        <View style={styles.guideFooter}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceText}>From Rp {guide.price.toLocaleString()}</Text>
            <Text style={styles.priceUnit}>per 4 hours</Text>
          </View>
          <View style={styles.languagesContainer}>
            {guide.languages.slice(0, 2).map((lang, index) => (
              <Text key={index} style={styles.languageTag}>
                {lang === 'Indonesian' ? 'ID' : lang === 'English' ? 'EN' : 
                 lang === 'Dutch' ? 'NL' : lang === 'Japanese' ? 'JP' :
                 lang === 'Mandarin' ? 'CN' : lang === 'Korean' ? 'KR' : 
                 lang === 'German' ? 'DE' : lang.slice(0, 2)}
              </Text>
            ))}
          </View>
        </View>
        
        <View style={styles.responseTimeContainer}>
          <Ionicons name="time-outline" size={12} color="#5f6368" />
          <Text style={styles.responseTimeText}>Responds {guide.responseTime}</Text>
          {guide.teamSize && (
            <>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.teamSizeText}>{guide.teamSize}</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="people-outline" size={24} color="#1a73e8" />
          <Text style={styles.headerTitle}>Tour Guide Booking</Text>
        </View>
        <Text style={styles.headerSubtitle}>Find verified local guides for your trip</Text>
      </View>

      {/* City-based Guide Selection for Confused Tourists */}
      <View style={styles.cityGuideSection}>
        <View style={styles.cityGuideHeader}>
          <Ionicons name="help-circle-outline" size={20} color="#ea4335" />
          <Text style={styles.cityGuideTitle}>Need Help Choosing?</Text>
        </View>
        <Text style={styles.cityGuideSubtitle}>
          Select guides based on your origin city for personalized recommendations
        </Text>
        <TouchableOpacity 
          style={styles.cityGuideButton}
          onPress={() => setShowCityGuideModal(true)}
        >
          <Ionicons name="location-outline" size={18} color="#1a73e8" />
          <Text style={styles.cityGuideButtonText}>
            {selectedCity ? `Showing guides for ${cityOptions.find(c => c.id === selectedCity)?.name}` : 'Find Guides by Your City'}
          </Text>
          <Ionicons name="chevron-forward" size={16} color="#1a73e8" />
        </TouchableOpacity>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryTab,
              selectedCategory === category.id && styles.selectedCategoryTab
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={16} 
              color={selectedCategory === category.id ? '#1a73e8' : '#5f6368'} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredGuides.length} guides available
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={16} color="#1a73e8" />
          <Text style={styles.filterText}>Sort</Text>
        </TouchableOpacity>
      </View>

      {/* Guides List */}
      <FlatList
        data={filteredGuides}
        renderItem={renderGuideCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.guidesList}
      />

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBookingModal(false)}
      >
        {selectedGuide && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowBookingModal(false)}
              >
                <Ionicons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Book {selectedGuide.name}</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.bookingContent}>
              {/* Guide Summary */}
              <View style={styles.guideSummary}>
                <Image source={{ uri: selectedGuide.image }} style={styles.modalGuideImage} />
                <View style={styles.modalGuideInfo}>
                  <Text style={styles.modalGuideName}>{selectedGuide.name}</Text>
                  <Text style={styles.modalGuideLocation}>{selectedGuide.location}</Text>
                  <View style={styles.modalRating}>
                    <Ionicons name="star" size={14} color="#fbbc04" />
                    <Text style={styles.modalRatingText}>{selectedGuide.rating} ({selectedGuide.reviews} reviews)</Text>
                  </View>
                </View>
              </View>

              {/* Date Selection */}
              <View style={styles.bookingSection}>
                <Text style={styles.sectionLabel}>Select Date</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="YYYY-MM-DD"
                  value={bookingData.date}
                  onChangeText={(text) => setBookingData({...bookingData, date: text})}
                />
              </View>

              {/* Time Selection */}
              <View style={styles.bookingSection}>
                <Text style={styles.sectionLabel}>Select Time</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.timeSlots}>
                    {timeSlots.map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeSlot,
                          bookingData.time === time && styles.selectedTimeSlot
                        ]}
                        onPress={() => setBookingData({...bookingData, time})}
                      >
                        <Text style={[
                          styles.timeSlotText,
                          bookingData.time === time && styles.selectedTimeSlotText
                        ]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Duration */}
              <View style={styles.bookingSection}>
                <Text style={styles.sectionLabel}>Duration</Text>
                <View style={styles.durationOptions}>
                  {durations.map((duration) => (
                    <TouchableOpacity
                      key={duration.value}
                      style={[
                        styles.durationOption,
                        bookingData.duration === duration.value && styles.selectedDurationOption
                      ]}
                      onPress={() => setBookingData({...bookingData, duration: duration.value})}
                    >
                      <Text style={[
                        styles.durationText,
                        bookingData.duration === duration.value && styles.selectedDurationText
                      ]}>
                        {duration.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Group Size */}
              <View style={styles.bookingSection}>
                <Text style={styles.sectionLabel}>Group Size</Text>
                <View style={styles.groupSizeOptions}>
                  {groupSizes.map((size) => (
                    <TouchableOpacity
                      key={size.value}
                      style={[
                        styles.groupSizeOption,
                        bookingData.groupSize === size.value && styles.selectedGroupSizeOption
                      ]}
                      onPress={() => setBookingData({...bookingData, groupSize: size.value})}
                    >
                      <Text style={[
                        styles.groupSizeText,
                        bookingData.groupSize === size.value && styles.selectedGroupSizeText
                      ]}>
                        {size.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Special Requests */}
              <View style={styles.bookingSection}>
                <Text style={styles.sectionLabel}>Special Requests (Optional)</Text>
                <TextInput
                  style={styles.requestsInput}
                  placeholder="Any special requirements or requests..."
                  value={bookingData.specialRequests}
                  onChangeText={(text) => setBookingData({...bookingData, specialRequests: text})}
                  multiline
                  numberOfLines={3}
                />
              </View>

              {/* Price Summary */}
              <View style={styles.priceSummary}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Base Price ({durations.find(d => d.value === bookingData.duration)?.label})</Text>
                  <Text style={styles.priceValue}>Rp {(selectedGuide.price * (durations.find(d => d.value === bookingData.duration)?.price || 1)).toLocaleString()}</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Group Size ({bookingData.groupSize} people)</Text>
                  <Text style={styles.priceValue}>×{bookingData.groupSize === '1' ? '1' : bookingData.groupSize === '2' ? '1.2' : bookingData.groupSize === '4' ? '1.8' : bookingData.groupSize === '6' ? '2.4' : '3'}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Total</Text>
                  <Text style={styles.totalValue}>Rp {calculateTotalPrice().toLocaleString()}</Text>
                </View>
              </View>
            </ScrollView>

            {/* Book Button */}
            <View style={styles.bookingFooter}>
              <TouchableOpacity style={styles.bookButton} onPress={submitBooking}>
                <Text style={styles.bookButtonText}>Send Booking Request</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>

      {/* City Guide Selection Modal */}
      <Modal
        visible={showCityGuideModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCityGuideModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCityGuideModal(false)}
            >
              <Ionicons name="close" size={24} color="#5f6368" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Choose Your City</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.cityModalDescription}>
              Select your origin city to find local guides who understand tourists from your region and can provide personalized recommendations.
            </Text>

            <View style={styles.guideTypesSection}>
              <Text style={styles.sectionLabel}>Available Guide Types:</Text>
              <View style={styles.guideTypeCards}>
                <View style={styles.guideTypeCard}>
                  <Ionicons name="person-outline" size={24} color="#1a73e8" />
                  <Text style={styles.guideTypeTitle}>Individual Guides</Text>
                  <Text style={styles.guideTypeDesc}>Personal, one-on-one attention</Text>
                </View>
                <View style={styles.guideTypeCard}>
                  <Ionicons name="business-outline" size={24} color="#ea4335" />
                  <Text style={styles.guideTypeTitle}>Vendor Companies</Text>
                  <Text style={styles.guideTypeDesc}>Professional tour operators</Text>
                </View>
              </View>
            </View>

            <View style={styles.cityOptionsSection}>
              <Text style={styles.sectionLabel}>Select Your City:</Text>
              {cityOptions.map((city) => (
                <TouchableOpacity
                  key={city.id}
                  style={[
                    styles.cityOption,
                    selectedCity === city.id && styles.selectedCityOption
                  ]}
                  onPress={() => {
                    setSelectedCity(city.id);
                    setShowCityGuideModal(false);
                  }}
                >
                  <View style={styles.cityOptionContent}>
                    <Text style={styles.cityName}>{city.name}</Text>
                    <Text style={styles.cityRegion}>{city.region}</Text>
                  </View>
                  <View style={styles.cityGuideCount}>
                    <Text style={styles.guideCountText}>
                      {tourGuides.filter(g => g.cityId === city.id).length} guides
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.clearFilterButton}
              onPress={() => {
                setSelectedCity('');
                setShowCityGuideModal(false);
              }}
            >
              <Text style={styles.clearFilterText}>Show All Guides</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  selectedCategoryTab: {
    backgroundColor: '#e8f0fe',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5f6368',
  },
  selectedCategoryText: {
    color: '#1a73e8',
  },
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  resultsText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  filterText: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
  },
  guidesList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  guideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
    overflow: 'hidden',
  },
  guideImageContainer: {
    position: 'relative',
  },
  guideImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 4,
  },
  availabilityBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  availabilityText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  guideInfo: {
    padding: 16,
  },
  guideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  guideName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 3,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#202124',
  },
  reviewCount: {
    fontSize: 10,
    color: '#5f6368',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#5f6368',
    flex: 1,
    marginRight: 8,
  },
  experienceText: {
    fontSize: 12,
    color: '#9aa0a6',
    fontStyle: 'italic',
  },
  guideDescription: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 12,
  },
  specialtiesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  specialtyTag: {
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  specialtyText: {
    fontSize: 11,
    color: '#5f6368',
    fontWeight: '500',
  },
  moreSpecialties: {
    fontSize: 11,
    color: '#9aa0a6',
    fontStyle: 'italic',
  },
  guideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    minHeight: 40,
  },
  priceContainer: {
    flex: 1,
    marginRight: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a73e8',
  },
  priceUnit: {
    fontSize: 12,
    color: '#5f6368',
  },
  languagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    gap: 4,
    maxWidth: 120,
  },
  languageTag: {
    backgroundColor: '#e8eaed',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    fontSize: 10,
    color: '#5f6368',
    fontWeight: '600',
  },
  responseTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  responseTimeText: {
    fontSize: 12,
    color: '#5f6368',
    fontStyle: 'italic',
  },
  separator: {
    fontSize: 12,
    color: '#9aa0a6',
    marginHorizontal: 6,
  },
  teamSizeText: {
    fontSize: 12,
    color: '#5f6368',
    fontStyle: 'italic',
  },
  // Modal styles
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
  bookingContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  guideSummary: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  modalGuideImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  modalGuideInfo: {
    flex: 1,
  },
  modalGuideName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  modalGuideLocation: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 4,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  modalRatingText: {
    fontSize: 12,
    color: '#5f6368',
  },
  bookingSection: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  dateInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#202124',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  timeSlots: {
    flexDirection: 'row',
    gap: 8,
  },
  timeSlot: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  selectedTimeSlot: {
    backgroundColor: '#1a73e8',
    borderColor: '#1a73e8',
  },
  timeSlotText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  selectedTimeSlotText: {
    color: '#ffffff',
  },
  durationOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  durationOption: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
    width: (width - 56) / 2,
  },
  selectedDurationOption: {
    backgroundColor: '#e8f0fe',
    borderColor: '#1a73e8',
  },
  durationText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedDurationText: {
    color: '#1a73e8',
  },
  groupSizeOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  groupSizeOption: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  selectedGroupSizeOption: {
    backgroundColor: '#e8f0fe',
    borderColor: '#1a73e8',
  },
  groupSizeText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  selectedGroupSizeText: {
    color: '#1a73e8',
  },
  requestsInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#202124',
    borderWidth: 1,
    borderColor: '#e8eaed',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priceSummary: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#5f6368',
  },
  priceValue: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '500',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a73e8',
  },
  bookingFooter: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a73e8',
    borderRadius: 12,
    paddingVertical: 16,
    gap: 8,
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  // City Guide Selection Styles
  cityGuideSection: {
    backgroundColor: '#fff4e6',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#fed7aa',
  },
  cityGuideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cityGuideTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ea4335',
    marginLeft: 8,
  },
  cityGuideSubtitle: {
    fontSize: 13,
    color: '#92400e',
    lineHeight: 18,
    marginBottom: 12,
  },
  cityGuideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  cityGuideButtonText: {
    flex: 1,
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
    marginHorizontal: 8,
  },
  cityModalDescription: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  guideTypesSection: {
    marginBottom: 24,
  },
  guideTypeCards: {
    flexDirection: 'row',
    gap: 12,
  },
  guideTypeCard: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  guideTypeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginTop: 8,
    marginBottom: 4,
  },
  guideTypeDesc: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
  },
  cityOptionsSection: {
    marginBottom: 24,
  },
  cityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  selectedCityOption: {
    backgroundColor: '#e8f0fe',
    borderColor: '#1a73e8',
  },
  cityOptionContent: {
    flex: 1,
  },
  cityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  cityRegion: {
    fontSize: 14,
    color: '#5f6368',
  },
  cityGuideCount: {
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  guideCountText: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
  },
  clearFilterButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  clearFilterText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
});

export default TourGuideBooking;