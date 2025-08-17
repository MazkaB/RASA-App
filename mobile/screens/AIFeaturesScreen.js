import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import AI Components
import VoiceTranslator from '../components/VoiceTranslator';
import LandmarkDetector from '../components/LandmarkDetector';
import AIItineraryGenerator from '../components/AIItineraryGenerator';

const { width } = Dimensions.get('window');

export default function AIFeaturesScreen() {
  const [activeModal, setActiveModal] = useState(null);

  const closeModal = () => setActiveModal(null);

  // Clean feature design sesuai README.md GCP-Powered Features
  const features = [
    {
      id: 'voice',
      title: 'Voice Translation',
      description: 'Speak naturally and hear translations instantly',
      icon: 'mic-outline',
      color: '#1a73e8',
      component: VoiceTranslator,
      tags: ['Speech API', 'Real-time']
    },
    {
      id: 'landmark',
      title: 'Photo Analysis',
      description: 'Detect landmarks and extract text from photos',
      icon: 'camera-outline',
      color: '#34a853',
      component: LandmarkDetector,
      tags: ['Vision API', 'OCR']
    },
    {
      id: 'itinerary',
      title: 'AI Itinerary Generator',
      description: 'Create personalized travel plans with AI',
      icon: 'map-outline',
      color: '#ea4335',
      component: AIItineraryGenerator,
      tags: ['Vertex AI', 'Personalized']
    }
  ];

  const renderFeatureCard = (feature) => (
    <TouchableOpacity
      key={feature.id}
      style={styles.featureCard}
      onPress={() => setActiveModal(feature.id)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.iconContainer, { backgroundColor: `${feature.color}15` }]}>
          <Ionicons name={feature.icon} size={32} color={feature.color} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{feature.title}</Text>
          <Text style={styles.cardDescription}>{feature.description}</Text>
          <View style={styles.tagsContainer}>
            {feature.tags.map((tag, index) => (
              <View key={index} style={[styles.tag, { borderColor: feature.color }]}>
                <Text style={[styles.tagText, { color: feature.color }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9aa0a6" />
      </View>
    </TouchableOpacity>
  );

  const renderModal = () => {
    const activeFeature = features.find(f => f.id === activeModal);
    if (!activeFeature) return null;

    const Component = activeFeature.component;

    return (
      <Modal
        visible={!!activeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeModal}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <Ionicons name="close" size={24} color="#5f6368" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{activeFeature.title}</Text>
            <View style={styles.placeholder} />
          </View>
          
          <Component onClose={closeModal} />
        </SafeAreaView>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Clean header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Features</Text>
        <Text style={styles.headerSubtitle}>
          Powered by Google Cloud Platform
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Available Features</Text>
          {features.map(renderFeatureCard)}
        </View>

        {/* Features Demo Data */}
        <View style={styles.demoCard}>
          <View style={styles.demoHeader}>
            <Ionicons name="bulb-outline" size={20} color="#1a73e8" />
            <Text style={styles.demoTitle}>Try These Features</Text>
          </View>
          <View style={styles.demoList}>
            {[
              { feature: 'Voice Translation', example: 'Say "Hello" → Hear "Halo" in Indonesian', icon: 'mic' },
              { feature: 'Photo Analysis', example: 'Take photo of Borobudur → Get landmark info', icon: 'camera' },
              { feature: 'AI Itinerary', example: 'Plan 3-day Bali trip → Get personalized schedule', icon: 'map' }
            ].map((demo, index) => (
              <View key={index} style={styles.demoItem}>
                <Ionicons name={demo.icon} size={16} color="#1a73e8" />
                <View style={styles.demoContent}>
                  <Text style={styles.demoFeature}>{demo.feature}</Text>
                  <Text style={styles.demoExample}>{demo.example}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Privacy Notice */}
        <View style={styles.privacyCard}>
          <Ionicons name="lock-closed" size={20} color="#5f6368" />
          <Text style={styles.privacyText}>
            Your data is processed securely with Google Cloud's enterprise-grade security and privacy protection.
          </Text>
        </View>
      </ScrollView>

      {renderModal()}
    </SafeAreaView>
  );
}

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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
    textAlign: 'center',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#5f6368',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  overviewCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  overviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  overviewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 12,
  },
  overviewText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#f1f3f4',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#202124',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#5f6368',
  },
  featuresContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  featureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 18,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '500',
  },
  demoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 8,
  },
  demoList: {
    gap: 12,
  },
  demoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  demoContent: {
    flex: 1,
    marginLeft: 12,
  },
  demoFeature: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 4,
  },
  demoExample: {
    fontSize: 12,
    color: '#5f6368',
    lineHeight: 16,
  },
  privacyCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  privacyText: {
    fontSize: 12,
    color: '#5f6368',
    lineHeight: 16,
    marginLeft: 12,
    flex: 1,
  },
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
});