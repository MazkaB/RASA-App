import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Linking,
  Dimensions,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const SIMCardLocator = ({ onClose, userProfile }) => {
  const [selectedLocation, setSelectedLocation] = useState('airports');
  const [nearbyCounters, setNearbyCounters] = useState([]);
  const [showPurchaseGuide, setShowPurchaseGuide] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);

  const locations = {
    airports: {
      name: 'Airports',
      icon: 'airplane-outline',
      data: [
        {
          id: 1,
          name: 'Soekarno-Hatta International Airport',
          provider: 'Telkomsel, Indosat, XL Axiata',
          location: 'Terminal 1, 2, 3 - Arrival Hall',
          distance: '0.2 km',
          status: 'Open 24/7',
          price: 'From Rp 50,000',
          coordinates: { lat: -6.1256, lng: 106.6559 }
        },
        {
          id: 2,
          name: 'Ngurah Rai International Airport',
          provider: 'All Major Providers',
          location: 'Domestic & International Terminal',
          distance: '0.1 km',
          status: 'Open 24/7',
          price: 'From Rp 45,000',
          coordinates: { lat: -8.7467, lng: 115.1671 }
        }
      ]
    },
    malls: {
      name: 'Shopping Malls',
      icon: 'storefront-outline',
      data: [
        {
          id: 3,
          name: 'Grand Indonesia Mall',
          provider: 'Telkomsel Store',
          location: 'Ground Floor, West Mall',
          distance: '1.5 km',
          status: 'Open 10:00-22:00',
          price: 'From Rp 35,000',
          coordinates: { lat: -6.1950, lng: 106.8231 }
        },
        {
          id: 4,
          name: 'Plaza Indonesia',
          provider: 'Indosat & XL Store',
          location: 'Level 2, Electronic Zone',
          distance: '2.1 km',
          status: 'Open 10:00-22:00',
          price: 'From Rp 40,000',
          coordinates: { lat: -6.1944, lng: 106.8226 }
        }
      ]
    },
    convenience: {
      name: 'Convenience Stores',
      icon: 'bag-outline',
      data: [
        {
          id: 5,
          name: 'Indomaret Thamrin',
          provider: 'Prepaid SIM Cards',
          location: 'Jl. MH Thamrin No. 15',
          distance: '0.8 km',
          status: 'Open 24/7',
          price: 'From Rp 25,000',
          coordinates: { lat: -6.1944, lng: 106.8229 }
        },
        {
          id: 6,
          name: 'Alfamart Sudirman',
          provider: 'All Providers Available',
          location: 'Jl. Sudirman Kav. 28',
          distance: '1.2 km',
          status: 'Open 06:00-24:00',
          price: 'From Rp 30,000',
          coordinates: { lat: -6.2088, lng: 106.8456 }
        }
      ]
    }
  };

  const simProviders = [
    {
      id: 'telkomsel',
      name: 'Telkomsel',
      logo: '📱',
      coverage: 'Best Coverage',
      plans: [
        { name: 'Tourist 7 Days', price: 50000, data: '25GB', duration: '7 days', calls: 'Unlimited local' },
        { name: 'Tourist 30 Days', price: 100000, data: '60GB', duration: '30 days', calls: 'Unlimited local' },
        { name: 'Tourist Premium', price: 150000, data: '100GB', duration: '30 days', calls: 'Unlimited + International' }
      ],
      color: '#ea4335',
      pros: ['Best network coverage', '4G/5G in most areas', 'Tourist-friendly packages'],
      cons: ['Most expensive option', 'Crowded network in cities'],
      bestFor: 'Remote areas, long trips'
    },
    {
      id: 'indosat',
      name: 'Indosat Ooredoo',
      logo: '📞',
      coverage: 'Good 4G Speed',
      plans: [
        { name: 'Freedom 7 Days', price: 45000, data: '20GB', duration: '7 days', calls: 'Unlimited local' },
        { name: 'Freedom 30 Days', price: 90000, data: '50GB', duration: '30 days', calls: 'Unlimited local' },
        { name: 'Freedom Plus', price: 120000, data: '80GB', duration: '30 days', calls: 'Unlimited + 100 min international' }
      ],
      color: '#fbbc04',
      pros: ['Fast 4G speeds', 'Good city coverage', 'Competitive pricing'],
      cons: ['Limited rural coverage', 'Data speed throttling'],
      bestFor: 'City travels, data-heavy usage'
    },
    {
      id: 'xl',
      name: 'XL Axiata',
      logo: '📶',
      coverage: 'Competitive Price',
      plans: [
        { name: 'Xplor 7 Days', price: 40000, data: '22GB', duration: '7 days', calls: 'Unlimited local' },
        { name: 'Xplor 30 Days', price: 85000, data: '55GB', duration: '30 days', calls: 'Unlimited local' },
        { name: 'Xplor Max', price: 110000, data: '75GB', duration: '30 days', calls: 'Unlimited + 50 min international' }
      ],
      color: '#1a73e8',
      pros: ['Most affordable', 'Good data allowances', 'No speed throttling'],
      cons: ['Limited coverage outside Java', 'Slower in peak hours'],
      bestFor: 'Budget travelers, Java/Bali only'
    }
  ];

  const purchaseSteps = [
    {
      title: 'Prepare Documents',
      description: 'Have your passport ready for registration',
      icon: 'document-text-outline',
      details: [
        'Valid passport (original)',
        'Indonesian visa (if required)',
        'Cash payment (most places don\'t accept cards)',
        'Phone must be unlocked'
      ]
    },
    {
      title: 'Choose Location',
      description: 'Select the best place to buy your SIM',
      icon: 'location-outline',
      details: [
        'Airport: Most convenient but expensive',
        'Mall: Good selection, moderate prices',
        'Convenience store: Cheapest, limited service',
        'Official store: Best service, full plans'
      ]
    },
    {
      title: 'Select Provider & Plan',
      description: 'Pick the right provider for your needs',
      icon: 'phone-portrait-outline',
      details: [
        'Telkomsel: Best for remote areas',
        'Indosat: Good for cities and fast data',
        'XL: Budget-friendly for Java/Bali',
        'Consider your travel destinations'
      ]
    },
    {
      title: 'Registration Process',
      description: 'Complete the mandatory registration',
      icon: 'create-outline',
      details: [
        'Provide passport to staff',
        'Fill registration form',
        'Wait 10-30 minutes for activation',
        'Test SIM before leaving store'
      ]
    },
    {
      title: 'Activation & Setup',
      description: 'Get your SIM working properly',
      icon: 'checkmark-circle-outline',
      details: [
        'Insert SIM and restart phone',
        'Check network signal',
        'Test data connection',
        'Save provider customer service number'
      ]
    }
  ];

  const startPurchaseGuide = (provider = null) => {
    setSelectedProvider(provider);
    setCurrentStep(0);
    setShowPurchaseGuide(true);
  };

  const openMaps = (counter) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${counter.coordinates.lat},${counter.coordinates.lng}`;
    Linking.openURL(url);
  };

  const callCounter = (counter) => {
    Alert.alert(
      'Contact Information',
      `${counter.name}\n\nFor inquiries, please visit the location directly or check their official website for contact details.`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="phone-portrait-outline" size={24} color="#1a73e8" />
          <Text style={styles.headerTitle}>SIM Card Locator</Text>
        </View>
        <Text style={styles.headerSubtitle}>Find nearest SIM card counters</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Location Tabs */}
        <View style={styles.tabContainer}>
          {Object.entries(locations).map(([key, location]) => (
            <TouchableOpacity
              key={key}
              style={[
                styles.tab,
                selectedLocation === key && styles.activeTab
              ]}
              onPress={() => setSelectedLocation(key)}
            >
              <Ionicons 
                name={location.icon} 
                size={16} 
                color={selectedLocation === key ? '#1a73e8' : '#5f6368'} 
              />
              <Text style={[
                styles.tabText,
                selectedLocation === key && styles.activeTabText
              ]}>
                {location.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* SIM Providers Overview */}
        <View style={styles.providersSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose Your Provider</Text>
            <TouchableOpacity 
              style={styles.guideButton} 
              onPress={() => startPurchaseGuide()}
            >
              <Ionicons name="help-circle-outline" size={16} color="#1a73e8" />
              <Text style={styles.guideButtonText}>Purchase Guide</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.providersRow}>
              {simProviders.map((provider, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.providerCard}
                  onPress={() => startPurchaseGuide(provider)}
                  activeOpacity={0.7}
                >
                  <View style={styles.providerHeader}>
                    <Text style={styles.providerLogo}>{provider.logo}</Text>
                    <Text style={styles.providerName}>{provider.name}</Text>
                    <Text style={styles.providerCoverage}>{provider.coverage}</Text>
                  </View>
                  
                  <View style={styles.providerContent}>
                    <Text style={styles.bestForText}>Best for: {provider.bestFor}</Text>
                    <View style={styles.planPreview}>
                      <Text style={styles.planPreviewText}>
                        From Rp {provider.plans[0].price.toLocaleString()}
                      </Text>
                      <Text style={styles.planDuration}>
                        {provider.plans[0].data} • {provider.plans[0].duration}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.providerFooter}>
                    <View style={styles.prosContainer}>
                      <Ionicons name="checkmark-circle" size={12} color="#34a853" />
                      <Text style={styles.prosText}>{provider.pros[0]}</Text>
                    </View>
                    <TouchableOpacity style={styles.selectButton}>
                      <Text style={styles.selectButtonText}>View Plans</Text>
                      <Ionicons name="arrow-forward" size={14} color="#1a73e8" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Counter Locations */}
        <View style={styles.countersSection}>
          <Text style={styles.sectionTitle}>
            {locations[selectedLocation].name} Near You
          </Text>
          
          {locations[selectedLocation].data.map((counter) => (
            <View key={counter.id} style={styles.counterCard}>
              <View style={styles.counterHeader}>
                <View style={styles.counterInfo}>
                  <Text style={styles.counterName}>{counter.name}</Text>
                  <Text style={styles.counterProvider}>{counter.provider}</Text>
                </View>
                <View style={styles.counterDistance}>
                  <Ionicons name="location" size={16} color="#34a853" />
                  <Text style={styles.distanceText}>{counter.distance}</Text>
                </View>
              </View>

              <View style={styles.counterDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color="#5f6368" />
                  <Text style={styles.detailText}>{counter.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={14} color="#5f6368" />
                  <Text style={styles.detailText}>{counter.status}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="card-outline" size={14} color="#5f6368" />
                  <Text style={styles.detailText}>{counter.price}</Text>
                </View>
              </View>

              <View style={styles.counterActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => openMaps(counter)}
                >
                  <Ionicons name="map-outline" size={16} color="#1a73e8" />
                  <Text style={styles.actionText}>Directions</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => callCounter(counter)}
                >
                  <Ionicons name="information-circle-outline" size={16} color="#1a73e8" />
                  <Text style={styles.actionText}>Info</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Tourist Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Tourist Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🆔</Text>
              <Text style={styles.tipText}>Bring your passport for SIM card registration</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>💰</Text>
              <Text style={styles.tipText}>Airport counters are more expensive than city stores</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>📱</Text>
              <Text style={styles.tipText}>Check if your phone is unlocked before buying</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🌐</Text>
              <Text style={styles.tipText}>Telkomsel has the best coverage in remote areas</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Purchase Guide Modal */}
      <Modal
        visible={showPurchaseGuide}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPurchaseGuide(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPurchaseGuide(false)}
            >
              <Ionicons name="close" size={24} color="#5f6368" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>
              {selectedProvider ? `${selectedProvider.name} Plans` : 'SIM Purchase Guide'}
            </Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedProvider ? (
              // Provider Details View
              <View>
                {/* Provider Header */}
                <View style={styles.providerDetailHeader}>
                  <Text style={styles.providerDetailLogo}>{selectedProvider.logo}</Text>
                  <View style={styles.providerDetailInfo}>
                    <Text style={styles.providerDetailName}>{selectedProvider.name}</Text>
                    <Text style={styles.providerDetailCoverage}>{selectedProvider.coverage}</Text>
                    <Text style={styles.providerBestFor}>Best for: {selectedProvider.bestFor}</Text>
                  </View>
                </View>

                {/* Pros & Cons */}
                <View style={styles.prosConsSection}>
                  <View style={styles.prosSection}>
                    <Text style={styles.prosConsTitle}>✅ Advantages</Text>
                    {selectedProvider.pros.map((pro, index) => (
                      <Text key={index} style={styles.prosConsText}>• {pro}</Text>
                    ))}
                  </View>
                  <View style={styles.consSection}>
                    <Text style={styles.prosConsTitle}>⚠️ Considerations</Text>
                    {selectedProvider.cons.map((con, index) => (
                      <Text key={index} style={styles.prosConsText}>• {con}</Text>
                    ))}
                  </View>
                </View>

                {/* Plans */}
                <View style={styles.plansSection}>
                  <Text style={styles.plansSectionTitle}>Available Tourist Plans</Text>
                  {selectedProvider.plans.map((plan, index) => (
                    <View key={index} style={styles.planCard}>
                      <View style={styles.planHeader}>
                        <Text style={styles.planName}>{plan.name}</Text>
                        <Text style={styles.planPrice}>Rp {plan.price.toLocaleString()}</Text>
                      </View>
                      <View style={styles.planDetails}>
                        <View style={styles.planDetail}>
                          <Ionicons name="wifi" size={16} color="#5f6368" />
                          <Text style={styles.planDetailText}>{plan.data} data</Text>
                        </View>
                        <View style={styles.planDetail}>
                          <Ionicons name="time" size={16} color="#5f6368" />
                          <Text style={styles.planDetailText}>{plan.duration}</Text>
                        </View>
                        <View style={styles.planDetail}>
                          <Ionicons name="call" size={16} color="#5f6368" />
                          <Text style={styles.planDetailText}>{plan.calls}</Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            ) : (
              // Step-by-step Guide View
              <View>
                <Text style={styles.guideIntro}>
                  Complete step-by-step guide to buying a SIM card in Indonesia
                </Text>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                  {purchaseSteps.map((_, index) => (
                    <View key={index} style={styles.progressStep}>
                      <View style={[
                        styles.progressCircle,
                        index <= currentStep && styles.progressCircleActive
                      ]}>
                        <Text style={[
                          styles.progressText,
                          index <= currentStep && styles.progressTextActive
                        ]}>
                          {index + 1}
                        </Text>
                      </View>
                      {index < purchaseSteps.length - 1 && (
                        <View style={[
                          styles.progressLine,
                          index < currentStep && styles.progressLineActive
                        ]} />
                      )}
                    </View>
                  ))}
                </View>

                {/* Current Step */}
                <View style={styles.stepContainer}>
                  <View style={styles.stepHeader}>
                    <Ionicons 
                      name={purchaseSteps[currentStep].icon} 
                      size={32} 
                      color="#1a73e8" 
                    />
                    <View style={styles.stepTitleContainer}>
                      <Text style={styles.stepNumber}>
                        Step {currentStep + 1} of {purchaseSteps.length}
                      </Text>
                      <Text style={styles.stepTitle}>
                        {purchaseSteps[currentStep].title}
                      </Text>
                      <Text style={styles.stepDescription}>
                        {purchaseSteps[currentStep].description}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.stepDetails}>
                    {purchaseSteps[currentStep].details.map((detail, index) => (
                      <View key={index} style={styles.stepDetailItem}>
                        <Ionicons name="checkmark-circle" size={16} color="#34a853" />
                        <Text style={styles.stepDetailText}>{detail}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Navigation */}
                <View style={styles.stepNavigation}>
                  {currentStep > 0 && (
                    <TouchableOpacity 
                      style={styles.prevButton}
                      onPress={() => setCurrentStep(currentStep - 1)}
                    >
                      <Ionicons name="chevron-back" size={20} color="#5f6368" />
                      <Text style={styles.prevButtonText}>Previous</Text>
                    </TouchableOpacity>
                  )}
                  
                  <View style={styles.spacer} />
                  
                  {currentStep < purchaseSteps.length - 1 ? (
                    <TouchableOpacity 
                      style={styles.nextButton}
                      onPress={() => setCurrentStep(currentStep + 1)}
                    >
                      <Text style={styles.nextButtonText}>Next</Text>
                      <Ionicons name="chevron-forward" size={20} color="#fff" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity 
                      style={styles.completeButton}
                      onPress={() => {
                        setShowPurchaseGuide(false);
                        Alert.alert('Success!', 'You\'re all set! Use the location finder to find the nearest SIM card counter.');
                      }}
                    >
                      <Text style={styles.completeButtonText}>Complete Guide</Text>
                      <Ionicons name="checkmark" size={20} color="#fff" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
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
    marginLeft: 36,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 8,
    marginTop: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#f1f3f4',
  },
  tabText: {
    fontSize: 12,
    color: '#5f6368',
    marginLeft: 4,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1a73e8',
  },
  providersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  providersRow: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  providerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: 140,
    borderWidth: 1,
    borderColor: '#e8eaed',
    alignItems: 'center',
  },
  providerLogo: {
    fontSize: 24,
    marginBottom: 8,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 4,
  },
  providerCoverage: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
    marginBottom: 8,
  },
  providerPlans: {
    alignItems: 'center',
  },
  planText: {
    fontSize: 10,
    color: '#5f6368',
    textAlign: 'center',
    marginBottom: 2,
  },
  countersSection: {
    marginBottom: 24,
  },
  counterCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  counterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  counterInfo: {
    flex: 1,
  },
  counterName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  counterProvider: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500',
  },
  counterDistance: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  distanceText: {
    fontSize: 12,
    color: '#34a853',
    marginLeft: 4,
    fontWeight: '600',
  },
  counterDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 14,
    color: '#5f6368',
    marginLeft: 8,
  },
  counterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  actionText: {
    fontSize: 12,
    color: '#1a73e8',
    marginLeft: 4,
    fontWeight: '500',
  },
  tipsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#5f6368',
    flex: 1,
    lineHeight: 20,
  },
  // Enhanced provider card styles
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  guideButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
  },
  guideButtonText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500',
  },
  providerHeader: {
    alignItems: 'center',
    marginBottom: 12,
  },
  providerContent: {
    marginBottom: 12,
  },
  bestForText: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  planPreview: {
    alignItems: 'center',
  },
  planPreviewText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a73e8',
  },
  planDuration: {
    fontSize: 11,
    color: '#5f6368',
    marginTop: 2,
  },
  providerFooter: {
    gap: 8,
  },
  prosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  prosText: {
    fontSize: 11,
    color: '#34a853',
    flex: 1,
  },
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 8,
    gap: 4,
  },
  selectButtonText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500',
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
  // Provider detail styles
  providerDetailHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8eaed',
    alignItems: 'center',
  },
  providerDetailLogo: {
    fontSize: 40,
    marginRight: 16,
  },
  providerDetailInfo: {
    flex: 1,
  },
  providerDetailName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  providerDetailCoverage: {
    fontSize: 16,
    color: '#5f6368',
    marginBottom: 4,
  },
  providerBestFor: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
  },
  prosConsSection: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  prosSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  consSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  prosConsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  prosConsText: {
    fontSize: 13,
    color: '#5f6368',
    marginBottom: 4,
    lineHeight: 18,
  },
  plansSection: {
    marginBottom: 20,
  },
  plansSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  planCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a73e8',
  },
  planDetails: {
    gap: 8,
  },
  planDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  planDetailText: {
    fontSize: 14,
    color: '#5f6368',
  },
  // Guide styles
  guideIntro: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
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
  stepContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepTitleContainer: {
    flex: 1,
    marginLeft: 16,
  },
  stepNumber: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: '#5f6368',
    lineHeight: 24,
  },
  stepDetails: {
    gap: 12,
  },
  stepDetailItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepDetailText: {
    fontSize: 14,
    color: '#5f6368',
    flex: 1,
    lineHeight: 20,
  },
  stepNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
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
  prevButtonText: {
    fontSize: 14,
    color: '#5f6368',
    marginLeft: 4,
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
  nextButtonText: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 4,
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
  completeButtonText: {
    fontSize: 14,
    color: '#ffffff',
    marginRight: 4,
    fontWeight: '600',
  },
});

export default SIMCardLocator;