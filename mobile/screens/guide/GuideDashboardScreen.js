import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, RefreshControl, Dimensions, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function GuideDashboardScreen({ route, navigation }) {
  const { userProfile } = route.params || {};
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    earnings: {
      today: 450000,
      week: 3200000,
      month: 12500000,
      pending: 850000
    },
    stats: {
      totalTours: 47,
      rating: 4.8,
      reviewCount: 89,
      responseRate: 95
    },
    todayBookings: [
      {
        id: 1,
        touristName: 'John Smith',
        time: '09:00 - 13:00',
        location: 'Borobudur Temple',
        status: 'confirmed',
        price: 450000
      },
      {
        id: 2,
        touristName: 'Sarah Johnson',
        time: '14:00 - 18:00',
        location: 'Prambanan Temple',
        status: 'confirmed',
        price: 400000
      }
    ],
    upcomingBookings: [
      {
        id: 3,
        date: 'Tomorrow',
        touristName: 'Mike Chen',
        time: '08:00 - 17:00',
        location: 'Yogyakarta City Tour',
        status: 'confirmed'
      }
    ],
    recentReviews: [
      {
        id: 1,
        touristName: 'Emma Wilson',
        rating: 5,
        comment: 'Excellent guide! Very knowledgeable and friendly.',
        date: '2 days ago'
      },
      {
        id: 2,
        touristName: 'David Lee',
        rating: 4,
        comment: 'Great experience, learned a lot about local culture.',
        date: '5 days ago'
      }
    ]
  });

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const formatCurrency = (amount) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const handleBookingAction = (booking, action) => {
    Alert.alert(
      `${action} Booking`,
      `Are you sure you want to ${action.toLowerCase()} booking with ${booking.touristName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm', 
          onPress: () => {
            Alert.alert('Success', `Booking ${action.toLowerCase()}ed successfully`);
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <Text style={styles.userName}>{userProfile?.name || 'Guide Professional'}</Text>
          <View style={styles.guideInfo}>
            <Ionicons name="shield-checkmark" size={14} color="#2E7D32" />
            <Text style={styles.verifiedText}>Verified Guide</Text>
            <Text style={styles.ratingText}>★ {dashboardData.stats.rating}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color="#2E7D32" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Professional Earnings Dashboard */}
        <LinearGradient
          colors={['#1B5E20', '#2E7D32', '#4CAF50']}
          style={styles.earningsCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.earningsHeader}>
            <View>
              <Text style={styles.earningsTitle}>Today's Revenue</Text>
              <View style={styles.earningsSubHeader}>
                <Ionicons name="trending-up" size={16} color="#ffffff" />
                <Text style={styles.earningsTrend}>+12.5% vs yesterday</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.withdrawButton}>
              <Ionicons name="wallet-outline" size={18} color="#ffffff" />
              <Text style={styles.withdrawText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.earningsAmount}>{formatCurrency(dashboardData.earnings.today)}</Text>
          <View style={styles.earningsGrid}>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>This Week</Text>
              <Text style={styles.earningValue}>{formatCurrency(dashboardData.earnings.week)}</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>This Month</Text>
              <Text style={styles.earningValue}>{formatCurrency(dashboardData.earnings.month)}</Text>
            </View>
            <View style={styles.earningItem}>
              <Text style={styles.earningLabel}>Available</Text>
              <Text style={styles.earningValue}>{formatCurrency(dashboardData.earnings.pending)}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Professional Performance Dashboard */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="trophy" size={24} color="#FFB74D" />
              <View style={styles.changeIndicator}>
                <Text style={styles.changeText}>+3</Text>
              </View>
            </View>
            <Text style={styles.statValue}>{dashboardData.stats.totalTours}</Text>
            <Text style={styles.statLabel}>Completed Tours</Text>
            <Text style={styles.statSubLabel}>This month</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="star" size={24} color="#FFD700" />
              <View style={[styles.changeIndicator, styles.positiveChange]}>
                <Text style={[styles.changeText, styles.positiveChangeText]}>+0.1</Text>
              </View>
            </View>
            <Text style={styles.statValue}>{dashboardData.stats.rating}</Text>
            <Text style={styles.statLabel}>Average Rating</Text>
            <Text style={styles.statSubLabel}>From {dashboardData.stats.reviewCount} reviews</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="people" size={24} color="#64B5F6" />
            </View>
            <Text style={styles.statValue}>{dashboardData.stats.responseRate}%</Text>
            <Text style={styles.statLabel}>Response Rate</Text>
            <Text style={styles.statSubLabel}>Within 2 hours</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconContainer}>
              <Ionicons name="calendar" size={24} color="#81C784" />
            </View>
            <Text style={styles.statValue}>85%</Text>
            <Text style={styles.statLabel}>Booking Rate</Text>
            <Text style={styles.statSubLabel}>This week</Text>
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Today's Schedule</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.todayBookings.length > 0 ? (
            dashboardData.todayBookings.map((booking) => (
              <View key={booking.id} style={styles.bookingCard}>
                <View style={styles.bookingTime}>
                  <Ionicons name="time-outline" size={16} color="#2E7D32" />
                  <Text style={styles.timeText}>{booking.time}</Text>
                </View>
                <View style={styles.bookingInfo}>
                  <Text style={styles.touristName}>{booking.touristName}</Text>
                  <Text style={styles.locationText}>{booking.location}</Text>
                  <View style={styles.bookingFooter}>
                    <View style={[styles.statusBadge, styles[`status_${booking.status}`]]}>
                      <Text style={styles.statusText}>{booking.status}</Text>
                    </View>
                    <Text style={styles.priceText}>{formatCurrency(booking.price)}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.messageButton}
                  onPress={() => Alert.alert('Message', `Opening chat with ${booking.touristName}`)}
                >
                  <Ionicons name="chatbubble-outline" size={20} color="#2E7D32" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="calendar-clear-outline" size={48} color="#9aa0a6" />
              <Text style={styles.emptyText}>No bookings for today</Text>
            </View>
          )}
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Bookings</Text>
          {dashboardData.upcomingBookings.map((booking) => (
            <View key={booking.id} style={styles.upcomingCard}>
              <View style={styles.dateTag}>
                <Text style={styles.dateText}>{booking.date}</Text>
              </View>
              <View style={styles.upcomingInfo}>
                <Text style={styles.touristName}>{booking.touristName}</Text>
                <Text style={styles.upcomingTime}>{booking.time}</Text>
                <Text style={styles.locationText}>{booking.location}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9aa0a6" />
            </View>
          ))}
        </View>

        {/* Recent Reviews */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Reviews</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          {dashboardData.recentReviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.reviewerInfo}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {review.touristName.split(' ').map(n => n[0]).join('')}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.reviewerName}>{review.touristName}</Text>
                    <View style={styles.ratingContainer}>
                      {[...Array(5)].map((_, i) => (
                        <Ionicons
                          key={i}
                          name={i < review.rating ? 'star' : 'star-outline'}
                          size={12}
                          color="#FFD700"
                        />
                      ))}
                      <Text style={styles.reviewDate}> • {review.date}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
            </View>
          ))}
        </View>

        {/* Professional Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Tools</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryAction]}
              onPress={() => navigation.navigate('Calendar')}
            >
              <Ionicons name="calendar" size={24} color="#ffffff" />
              <Text style={[styles.actionText, styles.primaryActionText]}>Manage Schedule</Text>
              <Text style={styles.actionSubtext}>Set availability & rates</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Analytics')}
            >
              <Ionicons name="bar-chart-outline" size={24} color="#2E7D32" />
              <Text style={styles.actionText}>View Analytics</Text>
              <Text style={styles.actionSubtext}>Performance insights</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Messages')}
            >
              <Ionicons name="chatbubbles-outline" size={24} color="#2E7D32" />
              <Text style={styles.actionText}>Messages</Text>
              <Text style={styles.actionSubtext}>Chat with tourists</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person-circle-outline" size={24} color="#2E7D32" />
              <Text style={styles.actionText}>Guide Profile</Text>
              <Text style={styles.actionSubtext}>Update your listing</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Business Insights */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Business Insights</Text>
          <View style={styles.insightsContainer}>
            <View style={styles.insightCard}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
              <Text style={styles.insightTitle}>Peak Hours</Text>
              <Text style={styles.insightValue}>9AM - 2PM</Text>
              <Text style={styles.insightDesc}>Best booking times</Text>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="location" size={20} color="#FF9800" />
              <Text style={styles.insightTitle}>Popular Tours</Text>
              <Text style={styles.insightValue}>Borobudur</Text>
              <Text style={styles.insightDesc}>Most requested</Text>
            </View>
            <View style={styles.insightCard}>
              <Ionicons name="time" size={20} color="#2196F3" />
              <Text style={styles.insightTitle}>Avg Duration</Text>
              <Text style={styles.insightValue}>4.2 hours</Text>
              <Text style={styles.insightDesc}>Per tour</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  greeting: {
    fontSize: 14,
    color: '#5f6368',
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
  },
  guideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 6,
  },
  verifiedText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '500',
  },
  ratingText: {
    fontSize: 12,
    color: '#FFD700',
    fontWeight: '600',
    marginLeft: 4,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#FF6B35',
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  earningsCard: {
    margin: 20,
    padding: 20,
    borderRadius: 16,
    elevation: 4,
  },
  earningsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  earningsTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  earningsSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  earningsTrend: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.9,
  },
  withdrawButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  withdrawText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '500',
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 20,
  },
  earningsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  earningItem: {
    flex: 1,
  },
  earningLabel: {
    fontSize: 12,
    color: '#ffffff',
    opacity: 0.8,
    marginBottom: 4,
  },
  earningValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
    position: 'relative',
  },
  statIconContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  changeIndicator: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  positiveChange: {
    backgroundColor: '#E8F5E9',
  },
  changeText: {
    fontSize: 8,
    fontWeight: '600',
    color: '#FF6B35',
  },
  positiveChangeText: {
    color: '#2E7D32',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202124',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#202124',
    fontWeight: '500',
    marginTop: 4,
    textAlign: 'center',
  },
  statSubLabel: {
    fontSize: 10,
    color: '#9aa0a6',
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: '500',
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  bookingTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  timeText: {
    fontSize: 12,
    color: '#5f6368',
    marginLeft: 4,
  },
  bookingInfo: {
    flex: 1,
  },
  touristName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  locationText: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  status_confirmed: {
    backgroundColor: '#E8F5E9',
  },
  status_pending: {
    backgroundColor: '#FFF3E0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2E7D32',
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
  },
  messageButton: {
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#9aa0a6',
    marginTop: 12,
  },
  upcomingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  dateTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 12,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FF6B35',
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingTime: {
    fontSize: 12,
    color: '#5f6368',
    marginVertical: 2,
  },
  reviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  reviewerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  reviewDate: {
    fontSize: 12,
    color: '#9aa0a6',
  },
  reviewComment: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
    minHeight: 80,
  },
  primaryAction: {
    backgroundColor: '#2E7D32',
    borderColor: '#2E7D32',
  },
  actionText: {
    fontSize: 13,
    color: '#2E7D32',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  primaryActionText: {
    color: '#ffffff',
  },
  actionSubtext: {
    fontSize: 11,
    color: '#9aa0a6',
    marginTop: 2,
    textAlign: 'center',
  },
  insightsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  insightCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  insightTitle: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 8,
    textAlign: 'center',
  },
  insightValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#202124',
    marginTop: 4,
    textAlign: 'center',
  },
  insightDesc: {
    fontSize: 10,
    color: '#9aa0a6',
    marginTop: 2,
    textAlign: 'center',
  },
});