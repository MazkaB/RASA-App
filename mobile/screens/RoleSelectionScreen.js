import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Dimensions, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function RoleSelectionScreen({ onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState(null);

  const roles = [
    {
      id: 'tourist',
      title: 'I am a Tourist',
      subtitle: 'Explore Indonesia with local guides',
      description: 'Discover amazing places, book tours, and connect with experienced local guides',
      icon: 'map',
      color: ['#1a73e8', '#4285f4'],
      features: [
        'Book local tour guides',
        'Explore destinations',
        'AI-powered translation',
        'Emergency assistance',
        'Currency exchange info'
      ]
    },
    {
      id: 'guide',
      title: 'I am a Tour Guide',
      subtitle: 'Share your expertise with travelers',
      description: 'Manage bookings, earn money, and help tourists discover your local area',
      icon: 'people',
      color: ['#2E7D32', '#4CAF50'],
      features: [
        'Manage tour bookings',
        'Set availability & pricing',
        'Chat with tourists',
        'Track earnings',
        'Build your reputation'
      ]
    }
  ];

  const handleContinue = () => {
    if (!selectedRole) {
      Alert.alert('Please select a role', 'Choose whether you are a tourist or a tour guide');
      return;
    }

    onRoleSelect(selectedRole);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to RASA</Text>
        <Text style={styles.subtitle}>
          Revolutionizing Asian Smart Travel
        </Text>
        <Text style={styles.description}>
          Choose your role to get started with the best travel experience in Indonesia
        </Text>
      </View>

      <View style={styles.rolesContainer}>
        {roles.map((role) => (
          <TouchableOpacity
            key={role.id}
            style={[
              styles.roleCard,
              selectedRole === role.id && styles.selectedRoleCard
            ]}
            onPress={() => setSelectedRole(role.id)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={selectedRole === role.id ? role.color : ['#ffffff', '#ffffff']}
              style={styles.roleCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.roleHeader}>
                <View style={[
                  styles.roleIcon,
                  selectedRole === role.id && styles.selectedRoleIcon
                ]}>
                  <Ionicons 
                    name={role.icon} 
                    size={32} 
                    color={selectedRole === role.id ? '#ffffff' : role.color[0]} 
                  />
                </View>
                <View style={styles.checkContainer}>
                  {selectedRole === role.id && (
                    <View style={styles.checkIcon}>
                      <Ionicons name="checkmark" size={16} color="#ffffff" />
                    </View>
                  )}
                </View>
              </View>

              <Text style={[
                styles.roleTitle,
                selectedRole === role.id && styles.selectedRoleTitle
              ]}>
                {role.title}
              </Text>
              
              <Text style={[
                styles.roleSubtitle,
                selectedRole === role.id && styles.selectedRoleSubtitle
              ]}>
                {role.subtitle}
              </Text>

              <Text style={[
                styles.roleDescription,
                selectedRole === role.id && styles.selectedRoleDescription
              ]}>
                {role.description}
              </Text>

              <View style={styles.featuresContainer}>
                {role.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <Ionicons 
                      name="checkmark-circle" 
                      size={16} 
                      color={selectedRole === role.id ? '#ffffff' : role.color[0]} 
                    />
                    <Text style={[
                      styles.featureText,
                      selectedRole === role.id && styles.selectedFeatureText
                    ]}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedRole && styles.disabledButton
          ]}
          onPress={handleContinue}
          disabled={!selectedRole}
        >
          <Text style={styles.continueButtonText}>
            Continue as {selectedRole ? roles.find(r => r.id === selectedRole)?.title.replace('I am a ', '') : 'User'}
          </Text>
          <Ionicons name="arrow-forward" size={20} color="#ffffff" />
        </TouchableOpacity>

        <Text style={styles.footerText}>
          You can always change your role later in settings
        </Text>
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
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#1a73e8',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#5f6368',
    textAlign: 'center',
    lineHeight: 24,
  },
  rolesContainer: {
    flex: 1,
    paddingHorizontal: 24,
    gap: 16,
  },
  roleCard: {
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e8eaed',
    overflow: 'hidden',
  },
  selectedRoleCard: {
    borderColor: '#2E7D32',
    elevation: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  roleCardGradient: {
    padding: 20,
  },
  roleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  roleIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedRoleIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  checkContainer: {
    width: 24,
    height: 24,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 8,
  },
  selectedRoleTitle: {
    color: '#ffffff',
  },
  roleSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5f6368',
    marginBottom: 8,
  },
  selectedRoleSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  roleDescription: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 16,
  },
  selectedRoleDescription: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresContainer: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  featureText: {
    fontSize: 14,
    color: '#5f6368',
    flex: 1,
  },
  selectedFeatureText: {
    color: 'rgba(255, 255, 255, 0.9)',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  continueButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  disabledButton: {
    backgroundColor: '#9aa0a6',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  footerText: {
    fontSize: 12,
    color: '#9aa0a6',
    textAlign: 'center',
  },
});