import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, Dimensions, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function GuideBookingsScreen({ navigation }) {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const bookings = {
    pending: [
      {
        id: 1,
        touristName: 'Alice Brown',
        touristCountry: 'USA',
        date: '2025-01-20',
        time: '09:00 - 13:00',
        location: 'Borobudur Temple',
        groupSize: 2,
        price: 500000,
        specialRequests: 'Vegetarian lunch preferred',
        languages: ['English'],
        touristPhone: '+1234567890'
      },
      {
        id: 2,
        touristName: 'Thomas Mueller',
        touristCountry: 'Germany',
        date: '2025-01-21',
        time: '14:00 - 18:00',
        location: 'Prambanan Temple',
        groupSize: 4,
        price: 800000,
        specialRequests: 'Photography tour focus',
        languages: ['English', 'German'],
        touristPhone: '+4912345678'
      }
    ],
    confirmed: [
      {
        id: 3,
        touristName: 'John Smith',
        touristCountry: 'UK',
        date: '2025-01-19',
        time: '09:00 - 13:00',
        location: 'Borobudur Temple',
        groupSize: 2,
        price: 450000,
        status: 'confirmed',
        touristPhone: '+4412345678'
      },
      {
        id: 4,
        touristName: 'Sarah Johnson',
        touristCountry: 'Australia',
        date: '2025-01-19',
        time: '14:00 - 18:00',
        location: 'Prambanan Temple',
        groupSize: 3,
        price: 600000,
        status: 'confirmed',
        touristPhone: '+6112345678'
      }
    ],
    completed: [
      {
        id: 5,
        touristName: 'Emma Wilson',
        touristCountry: 'Canada',
        date: '2025-01-15',
        time: '08:00 - 17:00',
        location: 'Yogyakarta Full Day Tour',
        groupSize: 2,
        price: 1200000,
        status: 'completed',
        rating: 5,
        review: 'Excellent guide! Very knowledgeable.'
      },
      {
        id: 6,
        touristName: 'David Lee',
        touristCountry: 'Singapore',
        date: '2025-01-14',
        time: '09:00 - 13:00',
        location: 'Malioboro Street Tour',
        groupSize: 1,
        price: 300000,
        status: 'completed',
        rating: 4
      }
    ]
  };

  const handleAcceptBooking = (booking) => {
    Alert.alert(
      'Accept Booking',
      `Accept booking from ${booking.touristName} for ${booking.location}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            Alert.alert('Success', 'Booking accepted successfully!');
            setShowDetailsModal(false);
          }
        }
      ]
    );
  };

  const handleDeclineBooking = (booking) => {
    Alert.alert(
      'Decline Booking',
      'Are you sure you want to decline this booking?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Booking Declined', 'The tourist will be notified.');
            setShowDetailsModal(false);
          }
        }
      ]
    );
  };

  const handleContactTourist = (booking) => {
    Alert.alert(
      'Contact Tourist',
      `Open chat with ${booking.touristName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Chat', onPress: () => navigation.navigate('Messages') }
      ]
    );
  };

  const formatCurrency = (amount) => {
    return `Rp ${amount.toLocaleString('id-ID')}`;
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FF6B35';
      case 'confirmed': return '#2E7D32';
      case 'completed': return '#1976D2';
      default: return '#9aa0a6';
    }
  };

  const renderBookingCard = (booking, status) => (
    <TouchableOpacity
      key={booking.id}
      style={styles.bookingCard}
      onPress={() => {
        setSelectedBooking(booking);
        setShowDetailsModal(true);
      }}
    >
      <View style={styles.bookingHeader}>
        <View style={styles.dateContainer}>
          <Ionicons name="calendar-outline" size={16} color="#5f6368" />
          <Text style={styles.dateText}>{booking.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(status) + '20' }]}>
          <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
            {status.toUpperCase()}
          </Text>
        </View>
      </View>

      <View style={styles.bookingBody}>
        <View style={styles.touristInfo}>
          <Text style={styles.touristName}>{booking.touristName}</Text>
          <View style={styles.countryContainer}>
            <Ionicons name="flag-outline" size={14} color="#9aa0a6" />
            <Text style={styles.countryText}>{booking.touristCountry}</Text>
          </View>
        </View>

        <View style={styles.tourDetails}>
          <View style={styles.detailRow}>
            <Ionicons name="location-outline" size={16} color="#5f6368" />
            <Text style={styles.detailText}>{booking.location}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={16} color="#5f6368" />
            <Text style={styles.detailText}>{booking.time}</Text>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="people-outline" size={16} color="#5f6368" />
            <Text style={styles.detailText}>{booking.groupSize} people</Text>
          </View>
        </View>

        <View style={styles.bookingFooter}>
          <Text style={styles.priceText}>{formatCurrency(booking.price)}</Text>
          {booking.rating && (
            <View style={styles.ratingContainer}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < booking.rating ? 'star' : 'star-outline'}
                  size={12}
                  color="#FFD700"
                />
              ))}
            </View>
          )}
        </View>
      </View>

      {status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.declineButton]}
            onPress={() => handleDeclineBooking(booking)}
          >
            <Text style={styles.declineText}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.acceptButton]}
            onPress={() => handleAcceptBooking(booking)}
          >
            <Text style={styles.acceptText}>Accept</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      {/* Tab Selector */}
      <View style={styles.tabContainer}>
        {['pending', 'confirmed', 'completed'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.activeTab]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
            <View style={[styles.tabBadge, selectedTab === tab && styles.activeTabBadge]}>
              <Text style={[styles.badgeText, selectedTab === tab && styles.activeBadgeText]}>
                {bookings[tab].length}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {bookings[selectedTab].length > 0 ? (
          bookings[selectedTab].map((booking) => renderBookingCard(booking, selectedTab))
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-clear-outline" size={64} color="#9aa0a6" />
            <Text style={styles.emptyTitle}>No {selectedTab} bookings</Text>
            <Text style={styles.emptyText}>
              {selectedTab === 'pending' 
                ? 'New booking requests will appear here'
                : `Your ${selectedTab} bookings will appear here`}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Booking Details Modal */}
      <Modal
        visible={showDetailsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowDetailsModal(false)}
      >
        {selectedBooking && (
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <Ionicons name="close" size={24} color="#5f6368" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Booking Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalContent}>
              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Tourist Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name:</Text>
                  <Text style={styles.infoValue}>{selectedBooking.touristName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Country:</Text>
                  <Text style={styles.infoValue}>{selectedBooking.touristCountry}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone:</Text>
                  <Text style={styles.infoValue}>{selectedBooking.touristPhone}</Text>
                </View>
                {selectedBooking.languages && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Languages:</Text>
                    <Text style={styles.infoValue}>{selectedBooking.languages.join(', ')}</Text>
                  </View>
                )}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Tour Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Date:</Text>
                  <Text style={styles.infoValue}>{selectedBooking.date}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Time:</Text>
                  <Text style={styles.infoValue}>{selectedBooking.time}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Location:</Text>
                  <Text style={styles.infoValue}>{selectedBooking.location}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Group Size:</Text>
                  <Text style={styles.infoValue}>{selectedBooking.groupSize} people</Text>
                </View>
              </View>

              {selectedBooking.specialRequests && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Special Requests</Text>
                  <Text style={styles.specialRequestText}>{selectedBooking.specialRequests}</Text>
                </View>
              )}

              <View style={styles.modalSection}>
                <Text style={styles.sectionTitle}>Payment</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Total Amount:</Text>
                  <Text style={[styles.infoValue, styles.priceText]}>
                    {formatCurrency(selectedBooking.price)}
                  </Text>
                </View>
              </View>

              {selectedBooking.review && (
                <View style={styles.modalSection}>
                  <Text style={styles.sectionTitle}>Review</Text>
                  <View style={styles.ratingContainer}>
                    {[...Array(5)].map((_, i) => (
                      <Ionicons
                        key={i}
                        name={i < selectedBooking.rating ? 'star' : 'star-outline'}
                        size={16}
                        color="#FFD700"
                      />
                    ))}
                  </View>
                  <Text style={styles.reviewText}>{selectedBooking.review}</Text>
                </View>
              )}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.contactButton]}
                onPress={() => handleContactTourist(selectedBooking)}
              >
                <Ionicons name="chatbubble-outline" size={20} color="#2E7D32" />
                <Text style={styles.contactButtonText}>Contact Tourist</Text>
              </TouchableOpacity>
              
              {selectedTab === 'pending' && (
                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.declineModalButton]}
                    onPress={() => handleDeclineBooking(selectedBooking)}
                  >
                    <Text style={styles.declineText}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.acceptModalButton]}
                    onPress={() => handleAcceptBooking(selectedBooking)}
                  >
                    <Text style={styles.acceptText}>Accept</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </SafeAreaView>
        )}
      </Modal>
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
  },
  filterButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#E8F5E9',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#5f6368',
    marginRight: 6,
  },
  activeTabText: {
    color: '#2E7D32',
  },
  tabBadge: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activeTabBadge: {
    backgroundColor: '#2E7D32',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#5f6368',
  },
  activeBadgeText: {
    color: '#ffffff',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  bookingCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#5f6368',
    marginLeft: 6,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bookingBody: {
    marginBottom: 12,
  },
  touristInfo: {
    marginBottom: 12,
  },
  touristName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryText: {
    fontSize: 14,
    color: '#9aa0a6',
    marginLeft: 4,
  },
  tourDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#5f6368',
    marginLeft: 8,
  },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2E7D32',
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButton: {
    backgroundColor: '#ffebee',
  },
  acceptButton: {
    backgroundColor: '#2E7D32',
  },
  declineText: {
    color: '#d32f2f',
    fontWeight: '600',
  },
  acceptText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9aa0a6',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#5f6368',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
  },
  specialRequestText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
  },
  reviewText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginTop: 8,
  },
  modalFooter: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
  },
  modalButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  contactButton: {
    backgroundColor: '#E8F5E9',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
  },
  contactButtonText: {
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  declineModalButton: {
    flex: 1,
    backgroundColor: '#ffebee',
  },
  acceptModalButton: {
    flex: 1,
    backgroundColor: '#2E7D32',
  },
});