import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, Alert, Switch, Modal, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GuideProfileScreen({ route }) {
  const { userProfile, onLogout } = route.params || {};
  const [isOnline, setIsOnline] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    bio: 'Experienced local guide with 5+ years showing tourists around Java. Specializing in cultural tours and temple visits.',
    hourlyRate: '120000',
    dailyRate: '800000'
  });

  const guideStats = {
    totalTours: 147,
    rating: 4.8,
    reviews: 89,
    languages: ['English', 'Indonesian', 'Javanese'],
    specializations: ['Cultural Tours', 'Temple Visits', 'Food Tours', 'Photography'],
    cities: ['Yogyakarta', 'Semarang', 'Solo']
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => {
            if (onLogout) onLogout();
          }
        }
      ]
    );
  };

  const handleSaveProfile = () => {
    Alert.alert('Success', 'Profile updated successfully');
    setShowEditModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => setShowEditModal(true)}
        >
          <Ionicons name="create-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color="#2E7D32" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userProfile?.name || 'Guide Professional'}</Text>
            <Text style={styles.profileEmail}>{userProfile?.email || 'guide@example.com'}</Text>
            <View style={styles.verificationBadge}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.verifiedText}>Verified Guide</Text>
            </View>
          </View>
          <View style={styles.onlineStatus}>
            <Switch
              value={isOnline}
              onValueChange={setIsOnline}
              trackColor={{ false: '#e8eaed', true: '#4CAF50' }}
              thumbColor={isOnline ? '#2E7D32' : '#9aa0a6'}
            />
            <Text style={styles.onlineText}>{isOnline ? 'Online' : 'Offline'}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{guideStats.totalTours}</Text>
            <Text style={styles.statLabel}>Total Tours</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{guideStats.rating}</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{guideStats.reviews}</Text>
            <Text style={styles.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* About */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Professional Profile</Text>
            <View style={styles.completionBadge}>
              <Text style={styles.completionText}>95% Complete</Text>
            </View>
          </View>
          <Text style={styles.bioText}>{editData.bio}</Text>
          <View style={styles.profileMetrics}>
            <View style={styles.metricItem}>
              <Ionicons name="eye" size={16} color="#5f6368" />
              <Text style={styles.metricText}>Profile views: 1,247</Text>
            </View>
            <View style={styles.metricItem}>
              <Ionicons name="calendar" size={16} color="#5f6368" />
              <Text style={styles.metricText}>Member since 2019</Text>
            </View>
          </View>
        </View>

        {/* Languages */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Languages</Text>
          <View style={styles.tagsContainer}>
            {guideStats.languages.map((language, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{language}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Specializations */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Specializations</Text>
          <View style={styles.tagsContainer}>
            {guideStats.specializations.map((spec, index) => (
              <View key={index} style={[styles.tag, styles.specializationTag]}>
                <Text style={[styles.tagText, styles.specializationText]}>{spec}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Service Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service Areas</Text>
          <View style={styles.tagsContainer}>
            {guideStats.cities.map((city, index) => (
              <View key={index} style={[styles.tag, styles.cityTag]}>
                <Ionicons name="location" size={14} color="#FF6B35" />
                <Text style={[styles.tagText, styles.cityText]}>{city}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Professional Rates */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Service Rates</Text>
            <TouchableOpacity style={styles.competitiveTag}>
              <Text style={styles.competitiveText}>Competitive</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.pricingContainer}>
            <View style={styles.pricingItem}>
              <View style={styles.pricingHeader}>
                <Ionicons name="time" size={20} color="#2E7D32" />
                <Text style={styles.pricingLabel}>Hourly Rate</Text>
              </View>
              <Text style={styles.pricingValue}>Rp {parseInt(editData.hourlyRate).toLocaleString('id-ID')}</Text>
              <Text style={styles.pricingNote}>Min. 3 hours</Text>
            </View>
            <View style={styles.pricingItem}>
              <View style={styles.pricingHeader}>
                <Ionicons name="calendar" size={20} color="#2E7D32" />
                <Text style={styles.pricingLabel}>Full Day Rate</Text>
              </View>
              <Text style={styles.pricingValue}>Rp {parseInt(editData.dailyRate).toLocaleString('id-ID')}</Text>
              <Text style={styles.pricingNote}>8-10 hours</Text>
            </View>
          </View>
          <View style={styles.pricingFeatures}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Free cancellation 24hrs before</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Transportation coordination</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
              <Text style={styles.featureText}>Photography assistance</Text>
            </View>
          </View>
        </View>

        {/* Professional Tools */}
        <View style={styles.actionsSection}>
          <View style={styles.actionsSectionHeader}>
            <Text style={styles.actionsSectionTitle}>Professional Tools</Text>
          </View>
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>Certifications & Licenses</Text>
              <Text style={styles.actionSubtext}>Manage your professional credentials</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9aa0a6" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="camera" size={24} color="#FF9800" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>Portfolio Gallery</Text>
              <Text style={styles.actionSubtext}>Showcase your tour experiences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9aa0a6" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="card" size={24} color="#2196F3" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>Payment & Banking</Text>
              <Text style={styles.actionSubtext}>Manage earnings and withdrawals</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9aa0a6" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="bar-chart" size={24} color="#9C27B0" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>Business Analytics</Text>
              <Text style={styles.actionSubtext}>Track performance and growth</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9aa0a6" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIcon}>
              <Ionicons name="settings" size={24} color="#607D8B" />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionText}>Account Settings</Text>
              <Text style={styles.actionSubtext}>Privacy, notifications & preferences</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9aa0a6" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#d32f2f" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={showEditModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowEditModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSaveProfile}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={styles.textArea}
                value={editData.bio}
                onChangeText={(text) => setEditData({...editData, bio: text})}
                multiline
                numberOfLines={4}
                placeholder="Tell tourists about yourself..."
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Hourly Rate (Rp)</Text>
              <TextInput
                style={styles.textInput}
                value={editData.hourlyRate}
                onChangeText={(text) => setEditData({...editData, hourlyRate: text})}
                keyboardType="numeric"
                placeholder="120000"
              />
            </View>

            <View style={styles.inputSection}>
              <Text style={styles.inputLabel}>Daily Rate (Rp)</Text>
              <TextInput
                style={styles.textInput}
                value={editData.dailyRate}
                onChangeText={(text) => setEditData({...editData, dailyRate: text})}
                keyboardType="numeric"
                placeholder="800000"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
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
  editButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  profileInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#5f6368',
    marginBottom: 8,
  },
  verificationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
    marginLeft: 4,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineText: {
    fontSize: 16,
    color: '#202124',
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#5f6368',
  },
  section: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 12,
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
  completionBadge: {
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completionText: {
    fontSize: 12,
    color: '#2E7D32',
    fontWeight: '600',
  },
  profileMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metricText: {
    fontSize: 12,
    color: '#5f6368',
  },
  competitiveTag: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  competitiveText: {
    fontSize: 12,
    color: '#FF6B35',
    fontWeight: '600',
  },
  bioText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f1f3f4',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  specializationTag: {
    backgroundColor: '#E8F5E9',
  },
  cityTag: {
    backgroundColor: '#FFF3E0',
  },
  tagText: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
  },
  specializationText: {
    color: '#2E7D32',
  },
  cityText: {
    color: '#FF6B35',
    marginLeft: 4,
  },
  pricingContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  pricingItem: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  pricingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  pricingLabel: {
    fontSize: 12,
    color: '#5f6368',
    marginBottom: 4,
  },
  pricingValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2E7D32',
    marginBottom: 4,
  },
  pricingNote: {
    fontSize: 11,
    color: '#9aa0a6',
  },
  pricingFeatures: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 13,
    color: '#5f6368',
  },
  actionsSection: {
    backgroundColor: '#ffffff',
    marginTop: 12,
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 12,
  },
  actionsSectionHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  actionsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f4',
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionContent: {
    flex: 1,
  },
  actionText: {
    fontSize: 16,
    color: '#202124',
    fontWeight: '500',
    marginBottom: 2,
  },
  actionSubtext: {
    fontSize: 13,
    color: '#9aa0a6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 12,
    marginBottom: 32,
  },
  logoutText: {
    fontSize: 16,
    color: '#d32f2f',
    marginLeft: 12,
    fontWeight: '500',
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
  cancelText: {
    fontSize: 16,
    color: '#5f6368',
  },
  saveText: {
    fontSize: 16,
    color: '#2E7D32',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  textArea: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
    height: 100,
    textAlignVertical: 'top',
  },
});