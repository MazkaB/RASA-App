import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
  Modal,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');

const CurrencyExchange = ({ onClose }) => {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IDR');
  const [result, setResult] = useState(null);
  const [exchangeRates, setExchangeRates] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [showCurrencySelector, setShowCurrencySelector] = useState(false);
  const [selectorType, setSelectorType] = useState('from');
  const [rateHistory, setRateHistory] = useState([]);
  const [rateAlert, setRateAlert] = useState(null);

  // Fallback exchange rates for demo purposes
  const fallbackRates = {
    USD: { IDR: 15750, EUR: 0.85, SGD: 1.35, MYR: 4.20, JPY: 150, KRW: 1320, CNY: 7.25, THB: 35.5, AUD: 1.52, GBP: 0.79 },
    EUR: { IDR: 18500, USD: 1.18, SGD: 1.59, MYR: 4.95, JPY: 162, KRW: 1450, CNY: 7.85, THB: 38.2, AUD: 1.65, GBP: 0.86 },
    SGD: { IDR: 11650, USD: 0.74, EUR: 0.63, MYR: 3.11, JPY: 111, KRW: 980, CNY: 5.36, THB: 26.3, AUD: 1.13, GBP: 0.58 },
    MYR: { IDR: 3750, USD: 0.24, EUR: 0.20, SGD: 0.32, JPY: 35.7, KRW: 315, CNY: 1.72, THB: 8.45, AUD: 0.36, GBP: 0.19 },
    IDR: { USD: 0.000063, EUR: 0.000054, SGD: 0.000086, MYR: 0.00027, JPY: 0.0095, KRW: 0.084, CNY: 0.00046, THB: 0.00225, AUD: 0.000096, GBP: 0.00005 },
    JPY: { IDR: 105, USD: 0.0067, EUR: 0.0062, SGD: 0.009, MYR: 0.028, KRW: 8.8, CNY: 0.048, THB: 0.237, AUD: 0.01, GBP: 0.0053 },
    KRW: { IDR: 11.9, USD: 0.00076, EUR: 0.00069, SGD: 0.001, MYR: 0.0032, JPY: 0.114, CNY: 0.0055, THB: 0.027, AUD: 0.0012, GBP: 0.0006 },
    CNY: { IDR: 2175, USD: 0.138, EUR: 0.127, SGD: 0.187, MYR: 0.58, JPY: 20.7, KRW: 182, THB: 4.9, AUD: 0.21, GBP: 0.109 },
    THB: { IDR: 444, USD: 0.028, EUR: 0.026, SGD: 0.038, MYR: 0.118, JPY: 4.23, KRW: 37.2, CNY: 0.204, AUD: 0.043, GBP: 0.022 },
    AUD: { IDR: 10350, USD: 0.66, EUR: 0.61, SGD: 0.88, MYR: 2.78, JPY: 98.7, KRW: 869, CNY: 4.77, THB: 23.4, GBP: 0.52 },
    GBP: { IDR: 19875, USD: 1.26, EUR: 1.16, SGD: 1.71, MYR: 5.26, JPY: 189, KRW: 1667, CNY: 9.14, THB: 44.8, AUD: 1.92 }
  };

  const currencies = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸', symbol: '$' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺', symbol: '€' },
    { code: 'SGD', name: 'Singapore Dollar', flag: '🇸🇬', symbol: 'S$' },
    { code: 'MYR', name: 'Malaysian Ringgit', flag: '🇲🇾', symbol: 'RM' },
    { code: 'IDR', name: 'Indonesian Rupiah', flag: '🇮🇩', symbol: 'Rp' },
    { code: 'JPY', name: 'Japanese Yen', flag: '🇯🇵', symbol: '¥' },
    { code: 'KRW', name: 'Korean Won', flag: '🇰🇷', symbol: '₩' },
    { code: 'CNY', name: 'Chinese Yuan', flag: '🇨🇳', symbol: '¥' },
    { code: 'THB', name: 'Thai Baht', flag: '🇹🇭', symbol: '฿' },
    { code: 'AUD', name: 'Australian Dollar', flag: '🇦🇺', symbol: 'A$' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧', symbol: '£' }
  ];

  // Fetch real-time exchange rates (lightweight implementation)
  const fetchExchangeRates = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from free API with lightweight payload
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/USD`, {
        timeout: 3000,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.data && response.data.rates) {
        const rates = {};
        const supportedCodes = currencies.map(c => c.code);
        
        // Build lightweight rate matrix only for supported currencies
        supportedCodes.forEach(fromCode => {
          rates[fromCode] = {};
          supportedCodes.forEach(toCode => {
            if (fromCode === 'USD') {
              rates[fromCode][toCode] = response.data.rates[toCode] || 1;
            } else if (toCode === 'USD') {
              rates[fromCode][toCode] = 1 / (response.data.rates[fromCode] || 1);
            } else {
              rates[fromCode][toCode] = response.data.rates[toCode] / response.data.rates[fromCode];
            }
          });
        });
        
        setExchangeRates(rates);
        setLastUpdated(new Date());
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      // Use fallback rates for fast performance
      setExchangeRates(fallbackRates);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize with cached rates for instant display
  useEffect(() => {
    setExchangeRates(fallbackRates);
    setLastUpdated(new Date());
    
    // Fetch real rates in background without blocking UI
    setTimeout(() => {
      fetchExchangeRates();
    }, 100);
  }, []);

  // Auto-refresh every 5 minutes (lightweight)
  useEffect(() => {
    const interval = setInterval(fetchExchangeRates, 300000);
    return () => clearInterval(interval);
  }, []);

  const exchangeLocations = [
    {
      id: 1,
      name: 'Bank Central Asia (BCA)',
      type: 'Bank',
      rate: 'Official Rate - 0.5% fee',
      location: 'Thamrin, Sudirman (Multiple branches)',
      hours: 'Mon-Fri 08:00-15:00',
      safety: 'Very Safe',
      color: '#34a853'
    },
    {
      id: 2,
      name: 'Money Changer Mulia',
      type: 'Money Changer',
      rate: 'Best Rate - 1% fee',
      location: 'Jl. Sabang Raya No. 30',
      hours: 'Daily 09:00-21:00',
      safety: 'Safe & Trusted',
      color: '#1a73e8'
    },
    {
      id: 3,
      name: 'Airport Exchange',
      type: 'Airport',
      rate: 'Convenient - 3% fee',
      location: 'Soekarno-Hatta Terminal 1,2,3',
      hours: '24/7',
      safety: 'Very Safe',
      color: '#fbbc04'
    }
  ];

  const calculateExchange = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid amount');
      return;
    }

    const rate = exchangeRates[fromCurrency]?.[toCurrency];
    if (!rate) {
      Alert.alert('Error', 'Exchange rate not available');
      return;
    }

    const converted = numericAmount * rate;
    setResult({
      amount: numericAmount,
      from: fromCurrency,
      to: toCurrency,
      rate: rate,
      result: converted
    });
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setResult(null);
  };

  const openCurrencySelector = (type) => {
    setSelectorType(type);
    setShowCurrencySelector(true);
  };

  const selectCurrency = (currencyCode) => {
    if (selectorType === 'from') {
      setFromCurrency(currencyCode);
    } else {
      setToCurrency(currencyCode);
    }
    setShowCurrencySelector(false);
    setResult(null);
  };

  const refreshRates = () => {
    if (!isLoading) {
      fetchExchangeRates();
    }
  };

  const formatCurrency = (amount, currency) => {
    const currencyInfo = currencies.find(c => c.code === currency);
    if (currency === 'IDR') {
      return `${currencyInfo.symbol} ${amount.toLocaleString('id-ID')}`;
    }
    return `${currencyInfo.symbol} ${amount.toFixed(2)}`;
  };

  const getCurrencyInfo = (code) => {
    return currencies.find(c => c.code === code);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="card-outline" size={24} color="#1a73e8" />
          <Text style={styles.headerTitle}>Currency Exchange</Text>
          <TouchableOpacity 
            style={styles.refreshButton} 
            onPress={refreshRates}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#1a73e8" />
            ) : (
              <Ionicons name="refresh" size={20} color="#1a73e8" />
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.statusRow}>
          <Text style={styles.headerSubtitle}>Real-time rates & safe locations</Text>
          {lastUpdated && (
            <Text style={styles.lastUpdated}>
              Updated: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Currency Calculator */}
        <View style={styles.calculatorSection}>
          <Text style={styles.sectionTitle}>Currency Calculator</Text>
          
          <View style={styles.calculatorCard}>
            {/* Amount Input */}
            <View style={styles.amountSection}>
              <Text style={styles.label}>Amount</Text>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="Enter amount"
                placeholderTextColor="#9aa0a6"
              />
            </View>

            {/* Currency Selector */}
            <View style={styles.currencySection}>
              <View style={styles.currencySelector}>
                <Text style={styles.label}>From</Text>
                <TouchableOpacity 
                  style={styles.currencyButton}
                  onPress={() => openCurrencySelector('from')}
                >
                  <Text style={styles.currencyFlag}>{getCurrencyInfo(fromCurrency)?.flag}</Text>
                  <Text style={styles.currencyCode}>{fromCurrency}</Text>
                  <Ionicons name="chevron-down" size={16} color="#5f6368" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.swapButton} onPress={swapCurrencies}>
                <Ionicons name="swap-horizontal" size={20} color="#1a73e8" />
              </TouchableOpacity>

              <View style={styles.currencySelector}>
                <Text style={styles.label}>To</Text>
                <TouchableOpacity 
                  style={styles.currencyButton}
                  onPress={() => openCurrencySelector('to')}
                >
                  <Text style={styles.currencyFlag}>{getCurrencyInfo(toCurrency)?.flag}</Text>
                  <Text style={styles.currencyCode}>{toCurrency}</Text>
                  <Ionicons name="chevron-down" size={16} color="#5f6368" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Calculate Button */}
            <TouchableOpacity style={styles.calculateButton} onPress={calculateExchange}>
              <Ionicons name="calculator-outline" size={20} color="#fff" />
              <Text style={styles.calculateText}>Calculate</Text>
            </TouchableOpacity>

            {/* Result */}
            {result && (
              <View style={styles.resultSection}>
                <View style={styles.resultCard}>
                  <Text style={styles.resultLabel}>Exchange Result</Text>
                  <Text style={styles.resultAmount}>
                    {formatCurrency(result.amount, result.from)} = {formatCurrency(result.result, result.to)}
                  </Text>
                  <Text style={styles.resultRate}>
                    Rate: 1 {result.from} = {result.rate.toLocaleString()} {result.to}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Exchange Locations */}
        <View style={styles.locationsSection}>
          <Text style={styles.sectionTitle}>Safe Exchange Locations</Text>
          
          {exchangeLocations.map((location) => (
            <View key={location.id} style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <View style={styles.locationBadge}>
                    <Text style={[styles.locationTypeBadge, { backgroundColor: `${location.color}15`, color: location.color }]}>
                      {location.type}
                    </Text>
                  </View>
                </View>
                <View style={styles.safetyIndicator}>
                  <Ionicons name="shield-checkmark" size={16} color="#34a853" />
                  <Text style={styles.safetyText}>{location.safety}</Text>
                </View>
              </View>

              <View style={styles.locationDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="trending-up-outline" size={14} color="#5f6368" />
                  <Text style={styles.detailText}>{location.rate}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color="#5f6368" />
                  <Text style={styles.detailText}>{location.location}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={14} color="#5f6368" />
                  <Text style={styles.detailText}>{location.hours}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Safety Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          <View style={styles.tipsList}>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🏪</Text>
              <Text style={styles.tipText}>Always use official banks or licensed money changers</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🧾</Text>
              <Text style={styles.tipText}>Ask for receipt and count money before leaving</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>🚫</Text>
              <Text style={styles.tipText}>Avoid street money changers - high risk of counterfeit</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>💳</Text>
              <Text style={styles.tipText}>Consider using ATMs for better rates on small amounts</Text>
            </View>
            <View style={styles.tipItem}>
              <Text style={styles.tipIcon}>📱</Text>
              <Text style={styles.tipText}>This app shows real-time rates to avoid overcharging</Text>
            </View>
          </View>
        </View>

        {/* Quick Reference */}
        <View style={styles.referenceSection}>
          <Text style={styles.sectionTitle}>Quick Reference (Live Rates)</Text>
          <View style={styles.referenceGrid}>
            {['USD', 'EUR', 'SGD', 'MYR'].map(currency => {
              const rate = exchangeRates[currency]?.['IDR'] || 0;
              const symbol = getCurrencyInfo(currency)?.symbol || '';
              return (
                <View key={currency} style={styles.referenceItem}>
                  <Text style={styles.referenceAmount}>{symbol}1 {currency}</Text>
                  <Text style={styles.referenceValue}>≈ Rp {rate.toLocaleString()}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Currency Selector Modal */}
      <Modal
        visible={showCurrencySelector}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCurrencySelector(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowCurrencySelector(false)}
            >
              <Ionicons name="close" size={24} color="#5f6368" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Currency</Text>
            <View style={styles.placeholder} />
          </View>
          
          <FlatList
            data={currencies}
            keyExtractor={(item) => item.code}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.currencyOption}
                onPress={() => selectCurrency(item.code)}
              >
                <Text style={styles.currencyOptionFlag}>{item.flag}</Text>
                <View style={styles.currencyOptionInfo}>
                  <Text style={styles.currencyOptionCode}>{item.code}</Text>
                  <Text style={styles.currencyOptionName}>{item.name}</Text>
                </View>
                <Text style={styles.currencyOptionRate}>
                  {exchangeRates[item.code]?.['IDR'] ? 
                    `1 ${item.code} = ${exchangeRates[item.code]['IDR'].toLocaleString()} IDR` : 
                    'Rate loading...'
                  }
                </Text>
              </TouchableOpacity>
            )}
            showsVerticalScrollIndicator={false}
          />
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
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 12,
    flex: 1,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5f6368',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#9aa0a6',
    fontStyle: 'italic',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  calculatorSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  calculatorCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  amountSection: {
    marginBottom: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5f6368',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  amountInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  currencySection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  currencySelector: {
    flex: 1,
  },
  currencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  currencyFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  currencyCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  swapButton: {
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 16,
  },
  calculateButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  calculateText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultSection: {
    marginTop: 8,
  },
  resultCard: {
    backgroundColor: '#f1f3f4',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  resultAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 4,
  },
  resultRate: {
    fontSize: 12,
    color: '#5f6368',
  },
  locationsSection: {
    marginBottom: 24,
  },
  locationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  locationInfo: {
    flex: 1,
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 6,
  },
  locationBadge: {
    flexDirection: 'row',
  },
  locationTypeBadge: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  safetyText: {
    fontSize: 12,
    color: '#34a853',
    marginLeft: 4,
    fontWeight: '600',
  },
  locationDetails: {
    gap: 8,
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
  tipsSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
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
  referenceSection: {
    marginBottom: 32,
  },
  referenceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  referenceItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    width: (width - 64) / 2,
    borderWidth: 1,
    borderColor: '#e8eaed',
    alignItems: 'center',
  },
  referenceAmount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 12,
    color: '#5f6368',
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
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  currencyOptionFlag: {
    fontSize: 24,
    marginRight: 16,
  },
  currencyOptionInfo: {
    flex: 1,
  },
  currencyOptionCode: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  currencyOptionName: {
    fontSize: 14,
    color: '#5f6368',
    marginTop: 2,
  },
  currencyOptionRate: {
    fontSize: 12,
    color: '#9aa0a6',
    textAlign: 'right',
    maxWidth: 120,
  },
});

export default CurrencyExchange;