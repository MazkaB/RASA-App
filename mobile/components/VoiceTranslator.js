import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const VoiceTranslator = ({ onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceLanguage, setSourceLanguage] = useState('id');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [conversationHistory, setConversationHistory] = useState([]);

  const languages = [
    { code: 'id', name: 'Indonesian', flag: '🇮🇩' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
  ];

  const touristPhrases = [
    { id: 1, phrase: 'Where is the nearest ATM?', translation: 'Di mana ATM terdekat?', category: 'Essential' },
    { id: 2, phrase: 'How much does this cost?', translation: 'Berapa harganya?', category: 'Shopping' },
    { id: 3, phrase: 'I need help', translation: 'Saya butuh bantuan', category: 'Emergency' },
    { id: 4, phrase: 'Where is the bathroom?', translation: 'Di mana kamar mandi?', category: 'Essential' },
    { id: 5, phrase: 'Can you recommend a good restaurant?', translation: 'Bisakah Anda merekomendasikan restoran yang bagus?', category: 'Food' },
    { id: 6, phrase: 'How do I get to the airport?', translation: 'Bagaimana cara ke bandara?', category: 'Transport' }
  ];

  const startRecording = async () => {
    try {
      setIsRecording(true);
      // Simulate recording for demo
      Alert.alert('Recording Started', 'Voice recording feature will be implemented with expo-av');
    } catch (err) {
      console.error('Failed to start recording:', err);
      Alert.alert('Error', 'Failed to start recording');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      await translateDemo();
    } catch (err) {
      console.error('Failed to stop recording:', err);
      Alert.alert('Error', 'Failed to stop recording');
    }
  };

  const translateDemo = async () => {
    setIsTranslating(true);
    try {
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Demo translation result
      const demoResult = {
        originalText: sourceLanguage === 'id' ? 'Halo, apa kabar?' : 'Hello, how are you?',
        translatedText: sourceLanguage === 'id' ? 'Hello, how are you?' : 'Halo, apa kabar?',
        confidence: 0.95
      };

      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        originalText: demoResult.originalText,
        translatedText: demoResult.translatedText,
        sourceLanguage: languages.find(l => l.code === sourceLanguage)?.name || sourceLanguage,
        targetLanguage: languages.find(l => l.code === targetLanguage)?.name || targetLanguage,
        confidence: demoResult.confidence
      };

      setConversationHistory(prev => [newEntry, ...prev]);

    } catch (error) {
      console.error('Translation failed:', error);
      Alert.alert('Translation Failed', 'Unable to translate audio. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  };

  const playQuickPhrase = async (phrase) => {
    try {
      setIsTranslating(true);
      // Simulate translation of quick phrase
      const newEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleTimeString(),
        originalText: phrase.phrase,
        translatedText: phrase.translation,
        sourceLanguage: 'English',
        targetLanguage: 'Indonesian',
        confidence: 1.0,
        isQuickPhrase: true
      };

      setConversationHistory(prev => [newEntry, ...prev]);
      
      // Simulate TTS playback
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Quick phrase failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all conversation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setConversationHistory([]) }
      ]
    );
  };

  const getLanguageInfo = (code) => {
    return languages.find(l => l.code === code);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="mic-outline" size={24} color="#1a73e8" />
          <Text style={styles.headerTitle}>Voice Translator</Text>
        </View>
        <Text style={styles.headerSubtitle}>Speak naturally, hear translations instantly</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Language Selection */}
        <View style={styles.languageSection}>
          <Text style={styles.sectionTitle}>Translation Languages</Text>
          <View style={styles.languageSelector}>
            <View style={styles.languageButton}>
              <Text style={styles.languageFlag}>{getLanguageInfo(sourceLanguage)?.flag}</Text>
              <Text style={styles.languageCode}>{getLanguageInfo(sourceLanguage)?.name}</Text>
            </View>

            <TouchableOpacity style={styles.swapButton} onPress={swapLanguages}>
              <Ionicons name="swap-horizontal" size={20} color="#1a73e8" />
            </TouchableOpacity>

            <View style={styles.languageButton}>
              <Text style={styles.languageFlag}>{getLanguageInfo(targetLanguage)?.flag}</Text>
              <Text style={styles.languageCode}>{getLanguageInfo(targetLanguage)?.name}</Text>
            </View>
          </View>
        </View>

        {/* Recording Button */}
        <View style={styles.recordingSection}>
          <Text style={styles.sectionTitle}>Voice Recording</Text>
          <TouchableOpacity
            style={[
              styles.recordButton,
              isRecording && styles.recordingButton,
              isTranslating && styles.processingButton
            ]}
            onPress={isRecording ? stopRecording : startRecording}
            disabled={isTranslating}
          >
            {isTranslating ? (
              <ActivityIndicator size="large" color="#fff" />
            ) : (
              <Ionicons 
                name={isRecording ? "stop" : "mic"} 
                size={32} 
                color="#fff" 
              />
            )}
          </TouchableOpacity>
          <Text style={styles.recordingText}>
            {isTranslating ? 'Translating...' : isRecording ? 'Tap to stop recording' : 'Tap to start recording'}
          </Text>
        </View>

        {/* Quick Phrases */}
        <View style={styles.phrasesSection}>
          <View style={styles.phrasesHeader}>
            <Text style={styles.sectionTitle}>Tourist Quick Phrases</Text>
            <Text style={styles.phrasesSubtitle}>Tap to hear translation</Text>
          </View>
          
          {touristPhrases.map((phrase) => (
            <TouchableOpacity 
              key={phrase.id} 
              style={styles.phraseCard}
              onPress={() => playQuickPhrase(phrase)}
              disabled={isTranslating}
            >
              <View style={styles.phraseContent}>
                <Text style={styles.phraseText}>{phrase.phrase}</Text>
                <Text style={styles.phraseTranslation}>{phrase.translation}</Text>
              </View>
              <View style={styles.phraseActions}>
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{phrase.category}</Text>
                </View>
                <Ionicons name="volume-high-outline" size={16} color="#1a73e8" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Conversation History */}
        {conversationHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Conversation History</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            {conversationHistory.map((entry) => (
              <View key={entry.id} style={styles.historyItem}>
                <View style={styles.historyTopRow}>
                  <Text style={styles.historyTime}>{entry.timestamp}</Text>
                  {entry.isQuickPhrase && (
                    <View style={styles.quickPhraseBadge}>
                      <Text style={styles.quickPhraseText}>Quick Phrase</Text>
                    </View>
                  )}
                </View>
                <View style={styles.historyContent}>
                  <View style={styles.historyTextRow}>
                    <Text style={styles.historyLabel}>{entry.sourceLanguage}:</Text>
                    <Text style={styles.historyText}>{entry.originalText}</Text>
                  </View>
                  <View style={styles.historyTextRow}>
                    <Text style={styles.historyLabel}>{entry.targetLanguage}:</Text>
                    <Text style={styles.historyTranslation}>{entry.translatedText}</Text>
                  </View>
                </View>
                <Text style={styles.confidenceText}>
                  Confidence: {Math.round(entry.confidence * 100)}%
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={styles.helpList}>
            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>🎤</Text>
              <Text style={styles.helpText}>Tap the microphone and speak clearly</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>🔄</Text>
              <Text style={styles.helpText}>Use the swap button to change languages</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>⚡</Text>
              <Text style={styles.helpText}>Try quick phrases for common situations</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>📚</Text>
              <Text style={styles.helpText}>Review your conversation history</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  languageSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  languageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 8,
  },
  languageCode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
  },
  swapButton: {
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    padding: 8,
    marginHorizontal: 16,
  },
  recordingSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  recordButton: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1a73e8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recordingButton: {
    backgroundColor: '#ea4335',
  },
  processingButton: {
    backgroundColor: '#9aa0a6',
  },
  recordingText: {
    fontSize: 14,
    color: '#5f6368',
    textAlign: 'center',
  },
  phrasesSection: {
    marginBottom: 24,
  },
  phrasesHeader: {
    marginBottom: 16,
  },
  phrasesSubtitle: {
    fontSize: 12,
    color: '#5f6368',
    marginTop: 4,
  },
  phraseCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
    flexDirection: 'row',
    alignItems: 'center',
  },
  phraseContent: {
    flex: 1,
  },
  phraseText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 4,
  },
  phraseTranslation: {
    fontSize: 12,
    color: '#5f6368',
  },
  phraseActions: {
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 10,
    color: '#5f6368',
    fontWeight: '500',
  },
  historySection: {
    marginBottom: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearText: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
  },
  historyItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  historyTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyTime: {
    fontSize: 12,
    color: '#5f6368',
  },
  quickPhraseBadge: {
    backgroundColor: '#e3f2fd',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quickPhraseText: {
    fontSize: 10,
    color: '#1a73e8',
    fontWeight: '500',
  },
  historyContent: {
    gap: 8,
    marginBottom: 8,
  },
  historyTextRow: {
    marginBottom: 4,
  },
  historyLabel: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
  },
  historyText: {
    fontSize: 14,
    color: '#202124',
    marginTop: 2,
  },
  historyTranslation: {
    fontSize: 14,
    color: '#1a73e8',
    marginTop: 2,
    fontWeight: '500',
  },
  confidenceText: {
    fontSize: 11,
    color: '#5f6368',
    textAlign: 'right',
  },
  helpSection: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  helpList: {
    gap: 12,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  helpIcon: {
    fontSize: 16,
    marginRight: 12,
    marginTop: 2,
  },
  helpText: {
    fontSize: 14,
    color: '#5f6368',
    flex: 1,
    lineHeight: 20,
  },
});

export default VoiceTranslator;