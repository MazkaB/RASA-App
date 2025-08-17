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
  Image,
  Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const UserProfile = ({ userProfile, onUpdateProfile, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile || {});
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);
  const [notifications, setNotifications] = useState({
    tripReminders: true,
    weatherAlerts: true,
    priceDrops: false,
    promotions: true
  });

  const [savedPlaces, setSavedPlaces] = useState([
    { id: 1, name: 'Borobudur Temple', type: 'attraction', saved: true },
    { id: 2, name: 'Kuta Beach', type: 'beach', saved: true },
    { id: 3, name: 'Warung Made', type: 'restaurant', saved: true }
  ]);

  const [travelHistory, setTravelHistory] = useState([
    { id: 1, destination: 'Jakarta', date: '2024-01-15', status: 'completed', rating: 4.5 },
    { id: 2, destination: 'Bali', date: '2024-02-20', status: 'completed', rating: 5.0 },
    { id: 3, destination: 'Yogyakarta', date: '2024-04-10', status: 'planned', rating: null }
  ]);


  const profileStats = [
    { label: 'Places Visited', value: travelHistory.filter(t => t.status === 'completed').length, icon: 'location' },
    { label: 'Countries', value: '1', icon: 'flag' },
    { label: 'Reviews Written', value: '8', icon: 'star' },
    { label: 'Photos Shared', value: '156', icon: 'camera' }
  ];

  const achievements = [
    { id: 1, title: 'Explorer', description: 'Visited 3+ destinations', icon: 'compass', earned: true },
    { id: 2, title: 'Foodie', description: 'Tried 10+ local dishes', icon: 'restaurant', earned: true },
    { id: 3, title: 'Culture Enthusiast', description: 'Visited 5+ temples', icon: 'library', earned: false },
    { id: 4, title: 'Social Traveler', description: 'Shared 100+ photos', icon: 'share', earned: true }
  ];

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
    { code: 'CN', name: 'China', flag: '🇨🇳' }
  ];

  const destinations = [
    { id: 'jakarta', name: 'Jakarta' },
    { id: 'bali', name: 'Bali' },
    { id: 'yogyakarta', name: 'Yogyakarta' },
    { id: 'bandung', name: 'Bandung' },
    { id: 'lombok', name: 'Lombok' },
    { id: 'surabaya', name: 'Surabaya' }
  ];

  const interests = [
    { id: 'culture', name: 'Culture & History' },
    { id: 'nature', name: 'Nature & Wildlife' },
    { id: 'food', name: 'Food & Culinary' },
    { id: 'adventure', name: 'Adventure Sports' },
    { id: 'beach', name: 'Beach & Relaxation' },
    { id: 'shopping', name: 'Shopping' }
  ];

  useEffect(() => {
    loadNotificationSettings();
  }, []);

  const loadNotificationSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem('notificationSettings');
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
    } catch (error) {
      console.log('Error loading notification settings:', error);
    }
  };

  const saveNotificationSettings = async (newSettings) => {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(newSettings));
      setNotifications(newSettings);
    } catch (error) {
      console.log('Error saving notification settings:', error);
    }
  };

  const saveProfile = async () => {
    try {
      await AsyncStorage.setItem('userProfile', JSON.stringify(editedProfile));
      onUpdateProfile(editedProfile);
      setIsEditing(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    }
  };



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#202124" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setIsEditing(!isEditing)}
        >
          <Ionicons name={isEditing ? "checkmark" : "pencil"} size={20} color="#1a73e8" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person" size={40} color="#1a73e8" />
            </View>
            <View style={styles.profileInfo}>
              {isEditing ? (
                <View>
                  <TextInput
                    style={styles.editInput}
                    value={editedProfile.name || ''}
                    onChangeText={(text) => setEditedProfile({...editedProfile, name: text})}
                    placeholder="Full Name"
                  />
                  <TextInput
                    style={styles.editInput}
                    value={editedProfile.email || ''}
                    onChangeText={(text) => setEditedProfile({...editedProfile, email: text})}
                    placeholder="Email"
                    keyboardType="email-address"
                  />
                </View>
              ) : (
                <View>
                  <Text style={styles.profileName}>{userProfile?.name || 'Tourist User'}</Text>
                  <Text style={styles.profileEmail}>{userProfile?.email || 'tourist@example.com'}</Text>
                  <View style={styles.profileBadges}>
                    <View style={styles.countryBadge}>
                      <Text style={styles.countryFlag}>
                        {countries.find(c => c.code === userProfile?.countryOrigin)?.flag || '🌍'}
                      </Text>
                      <Text style={styles.countryName}>
                        {countries.find(c => c.code === userProfile?.countryOrigin)?.name || 'International'}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Travel Statistics</Text>
          <View style={styles.statsGrid}>
            {profileStats.map((stat, index) => (
              <View key={index} style={styles.statCard}>
                <Ionicons name={stat.icon} size={24} color="#1a73e8" />
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => setShowPreferencesModal(true)}
            >
              <Ionicons name="settings-outline" size={20} color="#1a73e8" />
              <Text style={styles.quickActionText}>Preferences</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.quickAction}
              onPress={() => Alert.alert('Saved Places', 'View your saved destinations and favorites')}
            >
              <Ionicons name="bookmark-outline" size={20} color="#1a73e8" />
              <Text style={styles.quickActionText}>Saved Places</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Travel History */}
        <View style={styles.travelHistorySection}>
          <Text style={styles.sectionTitle}>Travel History</Text>
          {travelHistory.map((trip) => (
            <View key={trip.id} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <Text style={styles.tripDestination}>{trip.destination}</Text>
                <View style={[
                  styles.tripStatus,
                  { backgroundColor: trip.status === 'completed' ? '#34a853' : '#fbbc04' }
                ]}>
                  <Text style={styles.tripStatusText}>
                    {trip.status === 'completed' ? 'Completed' : 'Planned'}
                  </Text>
                </View>
              </View>
              <Text style={styles.tripDate}>{trip.date}</Text>
              {trip.rating && (
                <View style={styles.tripRating}>
                  <Ionicons name="star" size={14} color="#fbbc04" />
                  <Text style={styles.tripRatingText}>{trip.rating}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.achievementsSection}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          <View style={styles.achievementsGrid}>
            {achievements.map((achievement) => (
              <View 
                key={achievement.id} 
                style={[
                  styles.achievementCard,
                  !achievement.earned && styles.achievementCardLocked
                ]}
              >
                <Ionicons 
                  name={achievement.icon} 
                  size={24} 
                  color={achievement.earned ? '#1a73e8' : '#9aa0a6'} 
                />
                <Text style={[
                  styles.achievementTitle,
                  !achievement.earned && styles.achievementTitleLocked
                ]}>
                  {achievement.title}
                </Text>
                <Text style={[
                  styles.achievementDescription,
                  !achievement.earned && styles.achievementDescriptionLocked
                ]}>
                  {achievement.description}
                </Text>
                {achievement.earned && (
                  <View style={styles.earnedBadge}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>


      {/* Preferences Modal */}
      <Modal
        visible={showPreferencesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowPreferencesModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowPreferencesModal(false)}
            >
              <Ionicons name="close" size={24} color="#5f6368" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Preferences</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Notifications */}
            <View style={styles.preferencesSection}>
              <Text style={styles.preferencesSectionTitle}>Notifications</Text>
              
              {Object.entries(notifications).map(([key, value]) => (
                <View key={key} style={styles.preferenceItem}>
                  <View style={styles.preferenceInfo}>
                    <Text style={styles.preferenceTitle}>
                      {key === 'tripReminders' ? 'Trip Reminders' :
                       key === 'weatherAlerts' ? 'Weather Alerts' :
                       key === 'priceDrops' ? 'Price Drop Alerts' :
                       'Promotions & Offers'}
                    </Text>
                    <Text style={styles.preferenceDescription}>
                      {key === 'tripReminders' ? 'Get notified about upcoming trips' :
                       key === 'weatherAlerts' ? 'Weather updates for your destinations' :
                       key === 'priceDrops' ? 'Alerts when prices drop for saved items' :
                       'Special offers and promotions'}
                    </Text>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={(newValue) => {
                      const newSettings = { ...notifications, [key]: newValue };
                      saveNotificationSettings(newSettings);
                    }}
                    trackColor={{ false: '#e8eaed', true: '#1a73e8' }}
                    thumbColor={value ? '#ffffff' : '#f1f3f4'}
                  />
                </View>
              ))}
            </View>

            {/* Travel Preferences */}
            <View style={styles.preferencesSection}>
              <Text style={styles.preferencesSectionTitle}>Travel Preferences</Text>
              
              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceTitle}>Preferred Destinations</Text>
                  <View style={styles.destinationsList}>
                    {(userProfile?.destinations || []).map((dest) => (
                      <View key={dest} style={styles.destinationTag}>
                        <Text style={styles.destinationTagText}>
                          {destinations.find(d => d.id === dest)?.name || dest}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.preferenceItem}>
                <View style={styles.preferenceInfo}>
                  <Text style={styles.preferenceTitle}>Interests</Text>
                  <View style={styles.interestsList}>
                    {(userProfile?.interests || []).map((interest) => (
                      <View key={interest} style={styles.interestTag}>
                        <Text style={styles.interestTagText}>
                          {interests.find(i => i.id === interest)?.name || interest}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>

            {/* App Settings */}
            <View style={styles.preferencesSection}>
              <Text style={styles.preferencesSectionTitle}>App Settings</Text>
              
              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="language-outline" size={20} color="#5f6368" />
                <Text style={styles.settingText}>Language: English</Text>
                <Ionicons name="chevron-forward" size={16} color="#9aa0a6" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="card-outline" size={20} color="#5f6368" />
                <Text style={styles.settingText}>Payment Methods</Text>
                <Ionicons name="chevron-forward" size={16} color="#9aa0a6" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="shield-outline" size={20} color="#5f6368" />
                <Text style={styles.settingText}>Privacy & Security</Text>
                <Ionicons name="chevron-forward" size={16} color="#9aa0a6" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingItem}>
                <Ionicons name="help-circle-outline" size={20} color="#5f6368" />
                <Text style={styles.settingText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={16} color="#9aa0a6" />
              </TouchableOpacity>
            </View>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    width: 60,
    height: 60,
    backgroundColor: '#f1f3f4',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 8,
  },
  profileBadges: {
    flexDirection: 'row',
    gap: 8,
  },
  countryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  countryFlag: {
    fontSize: 16,
  },
  countryName: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
  },
  editInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#202124',
    borderWidth: 1,
    borderColor: '#e8eaed',
    marginBottom: 8,
  },
  saveButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  statsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#5f6368',
    textAlign: 'center',
  },
  quickActionsSection: {
    marginBottom: 16,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  quickActionText: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 8,
    textAlign: 'center',
  },
  travelHistorySection: {
    marginBottom: 16,
  },
  tripCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDestination: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
  },
  tripStatus: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tripStatusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  tripDate: {
    fontSize: 14,
    color: '#5f6368',
    marginBottom: 4,
  },
  tripRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripRatingText: {
    fontSize: 12,
    color: '#5f6368',
  },
  achievementsSection: {
    marginBottom: 32,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    width: (width - 52) / 2,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e8eaed',
    position: 'relative',
  },
  achievementCardLocked: {
    backgroundColor: '#f8f9fa',
    opacity: 0.6,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementTitleLocked: {
    color: '#9aa0a6',
  },
  achievementDescription: {
    fontSize: 11,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 16,
  },
  achievementDescriptionLocked: {
    color: '#9aa0a6',
  },
  earnedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#34a853',
    justifyContent: 'center',
    alignItems: 'center',
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f3f4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 40,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  // Preferences styles
  preferencesSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  preferencesSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  preferenceInfo: {
    flex: 1,
    marginRight: 16,
  },
  preferenceTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 2,
  },
  preferenceDescription: {
    fontSize: 12,
    color: '#5f6368',
    lineHeight: 16,
  },
  destinationsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  destinationTag: {
    backgroundColor: '#e8f0fe',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  destinationTagText: {
    fontSize: 11,
    color: '#1a73e8',
    fontWeight: '500',
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  interestTag: {
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  interestTagText: {
    fontSize: 11,
    color: '#5f6368',
    fontWeight: '500',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
    gap: 12,
  },
  settingText: {
    fontSize: 14,
    color: '#202124',
    flex: 1,
  },
});

export default UserProfile;