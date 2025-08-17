import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Dimensions,
  FlatList,
  Linking
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const TransportationHelper = ({ onClose, userProfile }) => {
  const [selectedCategory, setSelectedCategory] = useState('ridehail');
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    from: '',
    to: '',
    time: 'now',
    passengers: '1',
    vehicle: 'car'
  });

  const transportationTypes = [
    { id: 'ridehail', name: 'Ride Hailing', icon: 'car-outline' },
    { id: 'public', name: 'Public Transport', icon: 'bus-outline' },
    { id: 'taxi', name: 'Taxi Services', icon: 'car-outline' },
    { id: 'rental', name: 'Vehicle Rental', icon: 'key-outline' },
    { id: 'airport', name: 'Airport Transfer', icon: 'airplane-outline' }
  ];

  const transportServices = {
    ridehail: [
      {
        id: 'gojek',
        name: 'Gojek',
        type: 'Motorcycle & Car',
        rating: 4.6,
        price: 'From Rp 8,000',
        coverage: 'Nationwide',
        features: ['GoRide (Motorcycle)', 'GoCar (Car)', 'GoBluebird (Premium)', 'Real-time tracking'],
        pros: ['Fastest in traffic', 'Cheapest option', 'Food delivery included', 'Multi-service app'],
        cons: ['Motorcycle only in some areas', 'Limited English support'],
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.gojek.app',
        color: '#00AA13',
        popular: true
      },
      {
        id: 'grab',
        name: 'Grab',
        type: 'Car & Motorcycle',
        rating: 4.5,
        price: 'From Rp 12,000',
        coverage: 'Major cities',
        features: ['GrabCar (Budget/Premium)', 'GrabBike (Motorcycle)', 'English interface', 'Tourist-friendly'],
        pros: ['English support', 'Tourist-friendly', 'Premium options', 'International payment'],
        cons: ['More expensive', 'Less coverage in small cities'],
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.grabtaxi.passenger',
        color: '#00B14F',
        popular: true
      },
      {
        id: 'bluebird',
        name: 'Blue Bird',
        type: 'Traditional Taxi',
        rating: 4.3,
        price: 'From Rp 15,000',
        coverage: 'Jakarta, Surabaya, Bali',
        features: ['Airport pickup', 'Phone booking', 'Credit card accepted', 'Professional drivers'],
        pros: ['Most trusted taxi', 'Airport services', 'Fixed rates', 'Professional service'],
        cons: ['More expensive', 'Limited cities', 'Older fleet'],
        downloadUrl: 'tel:+622114117777',
        color: '#0099CC',
        popular: false
      }
    ],
    public: [
      {
        id: 'transjakarta',
        name: 'TransJakarta BRT',
        type: 'Bus Rapid Transit',
        rating: 4.2,
        price: 'Rp 3,500 per trip',
        coverage: 'Jakarta only',
        features: ['Dedicated bus lanes', 'Air conditioning', 'Digital payment', 'Wide coverage'],
        pros: ['Very cheap', 'Avoids traffic jams', 'Extensive network', 'Modern buses'],
        cons: ['Jakarta only', 'Can be crowded', 'Complex route system'],
        downloadUrl: 'https://play.google.com/store/apps/details?id=id.co.telkom.tjapp',
        color: '#FF6B00',
        popular: true
      },
      {
        id: 'krl',
        name: 'KRL Commuter',
        type: 'Electric Train',
        rating: 4.4,
        price: 'Rp 3,000-5,000',
        coverage: 'Greater Jakarta',
        features: ['Fast and reliable', 'Air conditioning', 'Women-only cars', 'Frequent service'],
        pros: ['Fastest for long distances', 'Very reliable', 'Cheap', 'Comfortable'],
        cons: ['Limited coverage', 'Crowded in rush hour', 'No luggage space'],
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.kci.kaistation',
        color: '#1E88E5',
        popular: true
      },
      {
        id: 'busway',
        name: 'City Buses',
        type: 'Regular City Bus',
        rating: 3.8,
        price: 'Rp 2,000-5,000',
        coverage: 'Most cities',
        features: ['Cheapest option', 'Local routes', 'Cash payment', 'Basic service'],
        pros: ['Very cheap', 'Available everywhere', 'Local experience'],
        cons: ['No AC', 'Unpredictable schedule', 'Language barrier', 'Basic comfort'],
        downloadUrl: null,
        color: '#FFA726',
        popular: false
      }
    ],
    taxi: [
      {
        id: 'express',
        name: 'Express Taxi',
        type: 'Metered Taxi',
        rating: 4.1,
        price: 'Rp 7,000 base + meter',
        coverage: 'Jakarta, Bali',
        features: ['Metered fare', 'Airport service', 'Phone booking', '24/7 available'],
        pros: ['Transparent pricing', 'Reliable service', 'Airport pickup'],
        cons: ['Can get stuck in traffic', 'Meter can be expensive', 'Limited coverage'],
        downloadUrl: 'tel:+622127657000',
        color: '#FF5722',
        popular: false
      }
    ],
    rental: [
      {
        id: 'traveloka',
        name: 'Traveloka Car Rental',
        type: 'Car Rental Platform',
        rating: 4.5,
        price: 'From Rp 200,000/day',
        coverage: 'Nationwide',
        features: ['Multiple car types', 'With/without driver', 'Insurance included', 'English support'],
        pros: ['Flexible options', 'Tourist-friendly', 'Insurance coverage', 'Multiple pickup points'],
        cons: ['Need international license', 'Expensive for short trips', 'Fuel not included'],
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.traveloka.android',
        color: '#3E7BFA',
        popular: true
      },
      {
        id: 'avis',
        name: 'Avis Indonesia',
        type: 'International Car Rental',
        rating: 4.3,
        price: 'From Rp 350,000/day',
        coverage: 'Major cities & airports',
        features: ['International standard', 'English service', 'Premium vehicles', 'Airport counters'],
        pros: ['International quality', 'English support', 'Premium service', 'Reliable'],
        cons: ['More expensive', 'Limited locations', 'Requires international license'],
        downloadUrl: 'https://www.avis.com',
        color: '#CC0000',
        popular: false
      }
    ],
    airport: [
      {
        id: 'damri',
        name: 'DAMRI Airport Bus',
        type: 'Airport Shuttle',
        rating: 4.0,
        price: 'Rp 20,000-40,000',
        coverage: 'All major airports',
        features: ['Fixed schedule', 'Luggage space', 'Multiple routes', 'Affordable'],
        pros: ['Very cheap', 'Reliable schedule', 'Luggage friendly', 'All airports'],
        cons: ['Fixed stops only', 'Can be slow', 'Limited frequency'],
        downloadUrl: null,
        color: '#4CAF50',
        popular: true
      },
      {
        id: 'airport-taxi',
        name: 'Airport Taxi',
        type: 'Fixed-rate Taxi',
        rating: 4.2,
        price: 'Rp 100,000-200,000',
        coverage: 'All airports',
        features: ['Fixed rates', 'Direct service', 'Luggage assistance', '24/7 available'],
        pros: ['Direct to destination', 'Fixed price', 'Luggage help', 'Always available'],
        cons: ['More expensive', 'No app booking', 'Can have long queues'],
        downloadUrl: null,
        color: '#FFC107',
        popular: true
      }
    ]
  };

  const popularRoutes = [
    { from: 'Soekarno-Hatta Airport', to: 'Central Jakarta', price: 'Rp 150k-300k', time: '45-90 min', method: 'Grab/Taxi' },
    { from: 'Ngurah Rai Airport', to: 'Kuta/Seminyak', price: 'Rp 80k-150k', time: '30-60 min', method: 'Grab/Taxi' },
    { from: 'Jakarta', to: 'Bandung', price: 'Rp 50k-100k', time: '3-4 hours', method: 'Train/Bus' },
    { from: 'Yogyakarta', to: 'Borobudur', price: 'Rp 100k-200k', time: '1.5-2 hours', method: 'Car rental/Tour' }
  ];

  const quickTips = [
    { icon: '💳', title: 'Payment Methods', tip: 'Download Gojek/Grab apps and link credit card for easy payment' },
    { icon: '🗺️', title: 'Offline Maps', tip: 'Download Google Maps offline for areas you\'ll visit' },
    { icon: '📱', title: 'Translation', tip: 'Use Google Translate camera feature for transportation signs' },
    { icon: '💰', title: 'Budget Tips', tip: 'Public transport is 10x cheaper than ride-hailing apps' },
    { icon: '🕐', title: 'Rush Hours', tip: 'Avoid 7-9 AM and 5-7 PM in major cities (heavy traffic)' },
    { icon: '🛡️', title: 'Safety', tip: 'Always share your ride details with someone when using taxis' }
  ];

  const openService = (service) => {
    if (service.downloadUrl) {
      if (service.downloadUrl.startsWith('tel:')) {
        Linking.openURL(service.downloadUrl);
      } else if (service.downloadUrl.startsWith('http')) {
        Linking.openURL(service.downloadUrl);
      }
    }
  };

  const startBooking = (service) => {
    setSelectedService(service);
    setShowBookingModal(true);
  };

  const submitBooking = () => {
    if (!bookingData.from || !bookingData.to) {
      Alert.alert('Missing Information', 'Please enter pickup and destination locations');
      return;
    }

    Alert.alert(
      'Booking Request',
      `Service: ${selectedService.name}\nFrom: ${bookingData.from}\nTo: ${bookingData.to}\nTime: ${bookingData.time}\nPassengers: ${bookingData.passengers}\n\nWe'll help you connect with this service.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Continue', 
          onPress: () => {
            setShowBookingModal(false);
            if (selectedService.downloadUrl) {
              Alert.alert(
                'Next Steps',
                'We\'ll now open the service app or website for you to complete the booking.',
                [
                  { text: 'OK', onPress: () => openService(selectedService) }
                ]
              );
            } else {
              Alert.alert('Info', 'Please visit the service counter at your location or call them directly.');
            }
          }
        }
      ]
    );
  };

  const renderServiceCard = ({ item: service }) => (
    <View style={[styles.serviceCard, { borderLeftColor: service.color }]}>
      <View style={styles.serviceHeader}>
        <View style={styles.serviceInfo}>
          <View style={styles.serviceNameRow}>
            <Text style={styles.serviceName}>{service.name}</Text>
            {service.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>Popular</Text>
              </View>
            )}
          </View>
          <Text style={styles.serviceType}>{service.type}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color="#fbbc04" />
            <Text style={styles.ratingText}>{service.rating}</Text>
            <Text style={styles.priceText}>{service.price}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.coverageText}>Coverage: {service.coverage}</Text>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Features:</Text>
        {service.features.slice(0, 2).map((feature, index) => (
          <Text key={index} style={styles.featureText}>• {feature}</Text>
        ))}
        {service.features.length > 2 && (
          <Text style={styles.moreFeatures}>+{service.features.length - 2} more features</Text>
        )}
      </View>

      <View style={styles.prosConsContainer}>
        <View style={styles.prosContainer}>
          <Text style={styles.prosTitle}>✅ Pros</Text>
          <Text style={styles.prosText}>{service.pros[0]}</Text>
        </View>
        <View style={styles.consContainer}>
          <Text style={styles.consTitle}>⚠️ Consider</Text>
          <Text style={styles.consText}>{service.cons[0]}</Text>
        </View>
      </View>

      <View style={styles.serviceActions}>
        <TouchableOpacity 
          style={styles.detailsButton}
          onPress={() => Alert.alert(
            service.name,
            `Type: ${service.type}\nCoverage: ${service.coverage}\n\nFeatures:\n${service.features.map(f => `• ${f}`).join('\n')}\n\nPros:\n${service.pros.map(p => `• ${p}`).join('\n')}\n\nCons:\n${service.cons.map(c => `• ${c}`).join('\n')}`
          )}
        >
          <Ionicons name="information-circle-outline" size={16} color="#1a73e8" />
          <Text style={styles.detailsText}>Details</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.useButton, { backgroundColor: service.color }]}
          onPress={() => selectedCategory === 'ridehail' ? startBooking(service) : openService(service)}
        >
          <Text style={styles.useText}>
            {selectedCategory === 'ridehail' ? 'Book Ride' : 'Use Service'}
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const filteredServices = transportServices[selectedCategory] || [];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="car-outline" size={24} color="#1a73e8" />
          <Text style={styles.headerTitle}>Transportation Helper</Text>
        </View>
        <Text style={styles.headerSubtitle}>Get around Indonesia easily and safely</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Transportation Types */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {transportationTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.categoryTab,
                selectedCategory === type.id && styles.selectedCategoryTab
              ]}
              onPress={() => setSelectedCategory(type.id)}
            >
              <Ionicons 
                name={type.icon} 
                size={18} 
                color={selectedCategory === type.id ? '#1a73e8' : '#5f6368'} 
              />
              <Text style={[
                styles.categoryText,
                selectedCategory === type.id && styles.selectedCategoryText
              ]}>
                {type.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Routes */}
        <View style={styles.routesSection}>
          <Text style={styles.sectionTitle}>Popular Tourist Routes</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.routesContainer}>
              {popularRoutes.map((route, index) => (
                <View key={index} style={styles.routeCard}>
                  <View style={styles.routeHeader}>
                    <Ionicons name="location" size={16} color="#1a73e8" />
                    <Text style={styles.routeFromTo}>{route.from} → {route.to}</Text>
                  </View>
                  <View style={styles.routeDetails}>
                    <Text style={styles.routePrice}>{route.price}</Text>
                    <Text style={styles.routeTime}>{route.time}</Text>
                    <Text style={styles.routeMethod}>via {route.method}</Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Services List */}
        <View style={styles.servicesSection}>
          <Text style={styles.sectionTitle}>
            {transportationTypes.find(t => t.id === selectedCategory)?.name} Options
          </Text>
          
          <FlatList
            data={filteredServices}
            renderItem={renderServiceCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Quick Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Transportation Tips</Text>
          <View style={styles.tipsGrid}>
            {quickTips.map((tip, index) => (
              <View key={index} style={styles.tipCard}>
                <Text style={styles.tipIcon}>{tip.icon}</Text>
                <View style={styles.tipContent}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipText}>{tip.tip}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowBookingModal(false)}
      >
        {selectedService && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowBookingModal(false)}
              >
                <Ionicons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Book with {selectedService.name}</Text>
              <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.modalContent}>
              {/* Service Summary */}
              <View style={styles.serviceSummary}>
                <Text style={styles.serviceSummaryName}>{selectedService.name}</Text>
                <Text style={styles.serviceSummaryType}>{selectedService.type}</Text>
                <Text style={styles.serviceSummaryPrice}>{selectedService.price}</Text>
              </View>

              {/* Booking Form */}
              <View style={styles.bookingForm}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Pickup Location</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter pickup address or landmark"
                    value={bookingData.from}
                    onChangeText={(text) => setBookingData({...bookingData, from: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Destination</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter destination address or landmark"
                    value={bookingData.to}
                    onChangeText={(text) => setBookingData({...bookingData, to: text})}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>When do you need the ride?</Text>
                  <View style={styles.timeOptions}>
                    {['now', '15min', '30min', '1hour'].map((time) => (
                      <TouchableOpacity
                        key={time}
                        style={[
                          styles.timeOption,
                          bookingData.time === time && styles.selectedTimeOption
                        ]}
                        onPress={() => setBookingData({...bookingData, time})}
                      >
                        <Text style={[
                          styles.timeOptionText,
                          bookingData.time === time && styles.selectedTimeOptionText
                        ]}>
                          {time === 'now' ? 'Now' : 
                           time === '15min' ? 'In 15 min' :
                           time === '30min' ? 'In 30 min' : 'In 1 hour'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Number of Passengers</Text>
                  <View style={styles.passengerOptions}>
                    {['1', '2', '3', '4+'].map((passengers) => (
                      <TouchableOpacity
                        key={passengers}
                        style={[
                          styles.passengerOption,
                          bookingData.passengers === passengers && styles.selectedPassengerOption
                        ]}
                        onPress={() => setBookingData({...bookingData, passengers})}
                      >
                        <Text style={[
                          styles.passengerOptionText,
                          bookingData.passengers === passengers && styles.selectedPassengerOptionText
                        ]}>
                          {passengers}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {selectedService.id === 'gojek' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Vehicle Type</Text>
                    <View style={styles.vehicleOptions}>
                      <TouchableOpacity
                        style={[
                          styles.vehicleOption,
                          bookingData.vehicle === 'bike' && styles.selectedVehicleOption
                        ]}
                        onPress={() => setBookingData({...bookingData, vehicle: 'bike'})}
                      >
                        <Ionicons name="bicycle" size={20} color={bookingData.vehicle === 'bike' ? '#1a73e8' : '#5f6368'} />
                        <Text style={[
                          styles.vehicleOptionText,
                          bookingData.vehicle === 'bike' && styles.selectedVehicleOptionText
                        ]}>
                          GoRide (Motorcycle)
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[
                          styles.vehicleOption,
                          bookingData.vehicle === 'car' && styles.selectedVehicleOption
                        ]}
                        onPress={() => setBookingData({...bookingData, vehicle: 'car'})}
                      >
                        <Ionicons name="car" size={20} color={bookingData.vehicle === 'car' ? '#1a73e8' : '#5f6368'} />
                        <Text style={[
                          styles.vehicleOptionText,
                          bookingData.vehicle === 'car' && styles.selectedVehicleOptionText
                        ]}>
                          GoCar (Car)
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            {/* Book Button */}
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.bookButton} onPress={submitBooking}>
                <Text style={styles.bookButtonText}>Continue to {selectedService.name}</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        )}
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
  content: {
    flex: 1,
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
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
    paddingVertical: 10,
    gap: 8,
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
  routesSection: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  routesContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
  },
  routeCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    width: 200,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  routeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  routeFromTo: {
    fontSize: 12,
    fontWeight: '600',
    color: '#202124',
    flex: 1,
  },
  routeDetails: {
    gap: 2,
  },
  routePrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a73e8',
  },
  routeTime: {
    fontSize: 12,
    color: '#5f6368',
  },
  routeMethod: {
    fontSize: 11,
    color: '#9aa0a6',
    fontStyle: 'italic',
  },
  servicesSection: {
    backgroundColor: '#ffffff',
    paddingTop: 16,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  serviceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderLeftWidth: 4,
  },
  serviceHeader: {
    marginBottom: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  serviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    flex: 1,
  },
  popularBadge: {
    backgroundColor: '#34a853',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  popularText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  serviceType: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a73e8',
    marginLeft: 8,
  },
  coverageText: {
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  featuresContainer: {
    marginBottom: 12,
  },
  featuresTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  featureText: {
    fontSize: 11,
    color: '#5f6368',
    marginBottom: 2,
  },
  moreFeatures: {
    fontSize: 11,
    color: '#9aa0a6',
    fontStyle: 'italic',
  },
  prosConsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  prosContainer: {
    flex: 1,
  },
  consContainer: {
    flex: 1,
  },
  prosTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#34a853',
    marginBottom: 2,
  },
  consTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ea4335',
    marginBottom: 2,
  },
  prosText: {
    fontSize: 10,
    color: '#34a853',
    lineHeight: 14,
  },
  consText: {
    fontSize: 10,
    color: '#ea4335',
    lineHeight: 14,
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  detailsText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500',
  },
  useButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
    gap: 6,
  },
  useText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  tipsSection: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  tipsGrid: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  tipIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 12,
    color: '#5f6368',
    lineHeight: 16,
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
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  serviceSummary: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8eaed',
    alignItems: 'center',
  },
  serviceSummaryName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  serviceSummaryType: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 4,
  },
  serviceSummaryPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a73e8',
  },
  bookingForm: {
    gap: 20,
  },
  inputGroup: {
    marginBottom: 4,
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
  timeOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  timeOption: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
    alignItems: 'center',
  },
  selectedTimeOption: {
    backgroundColor: '#e8f0fe',
    borderColor: '#1a73e8',
  },
  timeOptionText: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
  },
  selectedTimeOptionText: {
    color: '#1a73e8',
  },
  passengerOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  passengerOption: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
    alignItems: 'center',
  },
  selectedPassengerOption: {
    backgroundColor: '#e8f0fe',
    borderColor: '#1a73e8',
  },
  passengerOptionText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  selectedPassengerOptionText: {
    color: '#1a73e8',
  },
  vehicleOptions: {
    gap: 8,
  },
  vehicleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
    gap: 12,
  },
  selectedVehicleOption: {
    backgroundColor: '#e8f0fe',
    borderColor: '#1a73e8',
  },
  vehicleOptionText: {
    fontSize: 14,
    color: '#5f6368',
    fontWeight: '500',
  },
  selectedVehicleOptionText: {
    color: '#1a73e8',
  },
  modalFooter: {
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
});

export default TransportationHelper;