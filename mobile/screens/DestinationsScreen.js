import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DestinationsScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All', icon: 'grid-outline' },
    { id: 'temple', name: 'Temples', icon: 'library-outline' },
    { id: 'beach', name: 'Beaches', icon: 'water-outline' },
    { id: 'mountain', name: 'Mountains', icon: 'triangle-outline' },
    { id: 'city', name: 'Cities', icon: 'business-outline' },
    { id: 'nature', name: 'Nature', icon: 'leaf-outline' }
  ];

  const destinations = [
    // Java
    { 
      id: 1, 
      name: 'Borobudur Temple', 
      location: 'Yogyakarta', 
      province: 'Central Java',
      rating: 4.8,
      reviews: 15240,
      image: 'https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80',
      category: 'temple',
      description: '9th-century Mahayana Buddhist temple, UNESCO World Heritage Site',
      highlights: ['Sunrise viewing', 'Ancient architecture', 'Buddhist heritage'],
      bestTime: 'May - September',
      price: 'Rp 40,000',
      duration: '2-3 hours'
    },
    { 
      id: 2, 
      name: 'Prambanan Temple', 
      location: 'Yogyakarta', 
      province: 'Central Java',
      rating: 4.7,
      reviews: 11580,
      image: 'https://images.unsplash.com/photo-1581481615985-ba4775734a9b?w=800&q=80',
      category: 'temple',
      description: 'Magnificent Hindu temple complex with intricate stone carvings',
      highlights: ['Hindu architecture', 'Stone carvings', 'Cultural heritage'],
      bestTime: 'April - October',
      price: 'Rp 40,000',
      duration: '2-3 hours'
    },
    // Bali
    { 
      id: 3, 
      name: 'Kuta Beach', 
      location: 'Badung', 
      province: 'Bali',
      rating: 4.6,
      reviews: 8934,
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      category: 'beach',
      description: 'Famous beach destination with golden sand and perfect surfing waves',
      highlights: ['Surfing waves', 'Sunset views', 'Beach clubs'],
      bestTime: 'April - October',
      price: 'Free',
      duration: 'Full day'
    },
    { 
      id: 4, 
      name: 'Tegallalang Rice Terraces', 
      location: 'Ubud', 
      province: 'Bali',
      rating: 4.8,
      reviews: 11234,
      image: 'https://images.unsplash.com/photo-1569659083804-98908d81e02f?w=800&q=80',
      category: 'nature',
      description: 'Stunning terraced rice fields showcasing traditional Balinese agriculture',
      highlights: ['Rice terraces', 'Traditional farming', 'Photography'],
      bestTime: 'April - September',
      price: 'Rp 30,000',
      duration: '2-3 hours'
    },
    { 
      id: 5, 
      name: 'Tanah Lot Temple', 
      location: 'Tabanan', 
      province: 'Bali',
      rating: 4.7,
      reviews: 9420,
      image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&q=80',
      category: 'temple',
      description: 'Iconic sea temple perched on a rock formation',
      highlights: ['Ocean views', 'Sunset photography', 'Hindu temple'],
      bestTime: 'April - October',
      price: 'Rp 60,000',
      duration: '2-3 hours'
    },
    // East Java
    { 
      id: 6, 
      name: 'Mount Bromo', 
      location: 'Probolinggo', 
      province: 'East Java',
      rating: 4.7,
      reviews: 12567,
      image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?w=800&q=80',
      category: 'mountain',
      description: 'Active volcano offering spectacular sunrise views and unique landscapes',
      highlights: ['Sunrise viewing', 'Volcanic landscape', 'Horseback riding'],
      bestTime: 'April - October',
      price: 'Rp 34,000',
      duration: '1-2 days'
    },
    { 
      id: 7, 
      name: 'Ijen Crater', 
      location: 'Banyuwangi', 
      province: 'East Java',
      rating: 4.8,
      reviews: 8750,
      image: 'https://images.unsplash.com/photo-1611161616305-93d4d4bb2b48?w=800&q=80',
      category: 'mountain',
      description: 'Volcanic crater famous for its blue fire phenomenon',
      highlights: ['Blue fire', 'Sulfur mining', 'Night trekking'],
      bestTime: 'April - October',
      price: 'Rp 100,000',
      duration: '8-10 hours'
    },
    // West Java
    { 
      id: 8, 
      name: 'Kawah Putih', 
      location: 'Bandung', 
      province: 'West Java',
      rating: 4.5,
      reviews: 7890,
      image: 'https://images.unsplash.com/photo-1598536090867-97a5221d1c24?w=800&q=80',
      category: 'nature',
      description: 'Stunning white crater lake with turquoise waters',
      highlights: ['Crater lake', 'Unique colors', 'Photography'],
      bestTime: 'April - October',
      price: 'Rp 18,000',
      duration: '3-4 hours'
    },
    { 
      id: 9, 
      name: 'Jakarta Old Town', 
      location: 'Jakarta', 
      province: 'DKI Jakarta',
      rating: 4.4,
      reviews: 6789,
      image: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?w=800&q=80',
      category: 'city',
      description: 'Historic area showcasing Dutch colonial architecture and museums',
      highlights: ['Colonial architecture', 'Museums', 'Historical sites'],
      bestTime: 'Year round',
      price: 'Rp 15,000',
      duration: '3-4 hours'
    },
    // Lombok
    { 
      id: 10, 
      name: 'Gili Islands', 
      location: 'Lombok', 
      province: 'West Nusa Tenggara',
      rating: 4.8,
      reviews: 13640,
      image: 'https://images.unsplash.com/photo-1559627503-85b3be9e585f?w=800&q=80',
      category: 'beach',
      description: 'Three pristine islands perfect for snorkeling and diving',
      highlights: ['Snorkeling', 'Diving', 'Crystal clear water'],
      bestTime: 'April - October',
      price: 'Rp 85,000',
      duration: 'Full day'
    },
    { 
      id: 11, 
      name: 'Mount Rinjani', 
      location: 'Lombok', 
      province: 'West Nusa Tenggara',
      rating: 4.9,
      reviews: 5240,
      image: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?w=800&q=80',
      category: 'mountain',
      description: 'Second highest volcano in Indonesia with crater lake',
      highlights: ['Volcano trekking', 'Crater lake', 'Challenging hike'],
      bestTime: 'April - November',
      price: 'Rp 150,000',
      duration: '2-4 days'
    },
    // Flores
    { 
      id: 12, 
      name: 'Komodo Island', 
      location: 'Flores', 
      province: 'East Nusa Tenggara',
      rating: 4.9,
      reviews: 7456,
      image: 'https://images.unsplash.com/photo-1565624700796-509ac41fac17?w=800&q=80',
      category: 'nature',
      description: 'Home of the famous Komodo dragons, UNESCO World Heritage Site',
      highlights: ['Komodo dragons', 'Pink beach', 'Diving spots'],
      bestTime: 'April - December',
      price: 'Rp 150,000',
      duration: 'Full day'
    },
    { 
      id: 13, 
      name: 'Kelimutu Lake', 
      location: 'Ende', 
      province: 'East Nusa Tenggara',
      rating: 4.6,
      reviews: 4320,
      image: 'https://images.unsplash.com/photo-1598621416894-091c8a14e85c?w=800&q=80',
      category: 'nature',
      description: 'Three colored crater lakes on Mount Kelimutu',
      highlights: ['Three colored lakes', 'Sunrise viewing', 'Local legends'],
      bestTime: 'April - October',
      price: 'Rp 30,000',
      duration: '4-5 hours'
    },
    // Sumatra
    { 
      id: 14, 
      name: 'Lake Toba', 
      location: 'North Sumatra', 
      province: 'North Sumatra',
      rating: 4.6,
      reviews: 8750,
      image: 'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?w=800&q=80',
      category: 'nature',
      description: 'Largest volcanic lake in the world with Samosir Island',
      highlights: ['Volcanic lake', 'Batak culture', 'Traditional villages'],
      bestTime: 'March - October',
      price: 'Free entry',
      duration: '1-2 days'
    },
    { 
      id: 15, 
      name: 'Bukit Lawang', 
      location: 'North Sumatra', 
      province: 'North Sumatra',
      rating: 4.7,
      reviews: 5630,
      image: 'https://images.unsplash.com/photo-1551085254-e96b210db58a?w=800&q=80',
      category: 'nature',
      description: 'Orangutan rehabilitation center in tropical rainforest',
      highlights: ['Orangutan watching', 'Jungle trekking', 'River tubing'],
      bestTime: 'March - October',
      price: 'Rp 150,000',
      duration: 'Full day'
    },
    // Kalimantan
    { 
      id: 16, 
      name: 'Tanjung Puting', 
      location: 'Central Kalimantan', 
      province: 'Central Kalimantan',
      rating: 4.8,
      reviews: 3240,
      image: 'https://images.unsplash.com/photo-1580836845661-a0b179dcd478?w=800&q=80',
      category: 'nature',
      description: 'National park famous for orangutan conservation',
      highlights: ['Orangutan spotting', 'River cruise', 'Klotok boat ride'],
      bestTime: 'April - October',
      price: 'Rp 500,000',
      duration: '2-3 days'
    },
    // Papua
    { 
      id: 17, 
      name: 'Raja Ampat', 
      location: 'West Papua', 
      province: 'West Papua',
      rating: 4.9,
      reviews: 2150,
      image: 'https://images.unsplash.com/photo-1570789210967-2cac24afeb00?w=800&q=80',
      category: 'beach',
      description: 'World-class diving destination with incredible marine biodiversity',
      highlights: ['World-class diving', 'Marine biodiversity', 'Remote islands'],
      bestTime: 'October - April',
      price: 'Rp 1,000,000',
      duration: '3-7 days'
    }
  ];

  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         destination.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || destination.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderDestinationCard = ({ item }) => (
    <TouchableOpacity style={styles.destinationCard} activeOpacity={0.7}>
      <Image source={{ uri: item.image }} style={styles.destinationImage} />
      <View style={styles.destinationInfo}>
        <View style={styles.destinationHeader}>
          <Text style={styles.destinationName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#fbbc04" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="#5f6368" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        
        <Text style={styles.destinationDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        {item.highlights && (
          <View style={styles.highlightsContainer}>
            {item.highlights.slice(0, 2).map((highlight, index) => (
              <View key={index} style={styles.highlightTag}>
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
            {item.highlights.length > 2 && (
              <Text style={styles.moreHighlights}>+{item.highlights.length - 2}</Text>
            )}
          </View>
        )}
        
        <View style={styles.destinationDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="card-outline" size={12} color="#5f6368" />
            <Text style={styles.detailText} numberOfLines={1}>{item.price}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={12} color="#5f6368" />
            <Text style={styles.detailText} numberOfLines={1}>{item.duration || 'Varies'}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="people-outline" size={12} color="#5f6368" />
            <Text style={styles.detailText} numberOfLines={1}>{item.reviews?.toLocaleString() || '0'}</Text>
          </View>
        </View>
        
        {item.bestTime && (
          <View style={styles.bestTimeContainer}>
            <Ionicons name="sunny-outline" size={12} color="#5f6368" />
            <Text style={styles.bestTimeText}>Best time: {item.bestTime}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderCategoryTab = (category) => (
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
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#202124" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Popular Destinations</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search" size={24} color="#5f6368" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#9aa0a6" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search destinations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9aa0a6"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close" size={20} color="#9aa0a6" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Tabs */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map(renderCategoryTab)}
      </ScrollView>

      {/* Results Summary */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredDestinations.length} destinations found
        </Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={16} color="#1a73e8" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Destinations List */}
      <FlatList
        data={filteredDestinations}
        renderItem={renderDestinationCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.destinationsList}
        numColumns={1}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
  },
  categoriesContainer: {
    backgroundColor: '#ffffff',
    paddingBottom: 16,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
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
  destinationsList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  destinationCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
    overflow: 'hidden',
  },
  destinationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  destinationInfo: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  destinationName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    flex: 1,
    marginRight: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#202124',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#5f6368',
  },
  destinationDescription: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 12,
  },
  highlightsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 12,
    gap: 6,
  },
  highlightTag: {
    backgroundColor: '#e8f0fe',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  highlightText: {
    fontSize: 11,
    color: '#1a73e8',
    fontWeight: '500',
  },
  moreHighlights: {
    fontSize: 11,
    color: '#9aa0a6',
    fontStyle: 'italic',
  },
  destinationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
    textAlign: 'center',
  },
  bestTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  bestTimeText: {
    fontSize: 12,
    color: '#5f6368',
    fontStyle: 'italic',
  },
});