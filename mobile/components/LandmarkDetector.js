import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const LandmarkDetector = ({ onClose }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);

  const selectImage = async () => {
    try {
      // Simulate image selection
      Alert.alert('Feature Demo', 'Image picker will be implemented with expo-image-picker');
      
      // Demo image selection
      const demoImage = {
        uri: 'https://via.placeholder.com/400x300/1a73e8/ffffff?text=Demo+Image',
        width: 400,
        height: 300
      };
      
      setSelectedImage(demoImage);
      setAnalysisResult(null);
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const takePhoto = async () => {
    try {
      Alert.alert('Feature Demo', 'Camera will be implemented with expo-image-picker');
      
      // Demo photo
      const demoImage = {
        uri: 'https://via.placeholder.com/400x300/34a853/ffffff?text=Camera+Photo',
        width: 400,
        height: 300
      };
      
      setSelectedImage(demoImage);
      setAnalysisResult(null);
    } catch (error) {
      console.error('Error taking photo:', error);
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      Alert.alert('No Image', 'Please select an image first');
      return;
    }

    setIsAnalyzing(true);
    try {
      // Simulate API call to backend
      console.log('🔍 Analyzing image for landmarks...');
      
      // Demo analysis result
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const demoResult = {
        landmarks: [
          {
            name: 'Borobudur Temple',
            description: 'A 9th-century Mahayana Buddhist temple in Central Java, Indonesia',
            confidence: 0.92,
            location: {
              latitude: -7.6079,
              longitude: 110.2038,
              address: 'Borobudur, Magelang Regency, Central Java'
            },
            categories: ['Temple', 'UNESCO World Heritage', 'Buddhist Architecture'],
            visitingHours: '06:00 - 17:00',
            entryFee: 'Rp 40,000 (Domestic), $25 (International)',
            bestTimeToVisit: 'Early morning for sunrise view'
          }
        ],
        extractedText: [
          {
            text: 'CANDI BOROBUDUR',
            translation: 'Borobudur Temple',
            confidence: 0.95
          }
        ],
        additionalInfo: {
          historicalSignificance: 'Built during the Sailendra dynasty, represents Buddhist cosmology',
          culturalImportance: 'Symbol of Indonesian heritage and Buddhist pilgrimage site',
          tips: [
            'Visit during sunrise or sunset for best views',
            'Wear comfortable walking shoes',
            'Bring water and sun protection',
            'Respect the sacred nature of the site'
          ]
        }
      };

      setAnalysisResult(demoResult);
      
      // Add to history
      const historyEntry = {
        id: Date.now(),
        timestamp: new Date().toLocaleString(),
        image: selectedImage.uri,
        result: demoResult
      };
      
      setAnalysisHistory(prev => [historyEntry, ...prev.slice(0, 9)]); // Keep last 10

    } catch (error) {
      console.error('Analysis failed:', error);
      Alert.alert('Analysis Failed', 'Unable to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearResults = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
  };

  const clearHistory = () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all analysis history?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: () => setAnalysisHistory([]) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="camera-outline" size={24} color="#1a73e8" />
          <Text style={styles.headerTitle}>Photo Analysis</Text>
        </View>
        <Text style={styles.headerSubtitle}>Detect landmarks and extract text from photos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Selection */}
        <View style={styles.imageSection}>
          <Text style={styles.sectionTitle}>Select Photo</Text>
          
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage.uri }} style={styles.selectedImage} />
              <TouchableOpacity style={styles.clearImageButton} onPress={clearResults}>
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={48} color="#9aa0a6" />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}

          <View style={styles.imageActions}>
            <TouchableOpacity style={styles.actionButton} onPress={takePhoto}>
              <Ionicons name="camera" size={20} color="#1a73e8" />
              <Text style={styles.actionText}>Take Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={selectImage}>
              <Ionicons name="image" size={20} color="#1a73e8" />
              <Text style={styles.actionText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>

          {selectedImage && (
            <TouchableOpacity
              style={[styles.analyzeButton, isAnalyzing && styles.analyzingButton]}
              onPress={analyzeImage}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={styles.analyzeText}>Analyzing...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="search" size={20} color="#fff" />
                  <Text style={styles.analyzeText}>Analyze Photo</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Analysis Results */}
        {analysisResult && (
          <View style={styles.resultsSection}>
            <Text style={styles.sectionTitle}>Analysis Results</Text>
            
            {/* Landmarks */}
            {analysisResult.landmarks && analysisResult.landmarks.length > 0 && (
              <View style={styles.landmarksContainer}>
                <Text style={styles.subsectionTitle}>🏛️ Detected Landmarks</Text>
                {analysisResult.landmarks.map((landmark, index) => (
                  <View key={index} style={styles.landmarkCard}>
                    <View style={styles.landmarkHeader}>
                      <Text style={styles.landmarkName}>{landmark.name}</Text>
                      <View style={styles.confidenceBadge}>
                        <Text style={styles.confidenceText}>
                          {Math.round(landmark.confidence * 100)}% confident
                        </Text>
                      </View>
                    </View>
                    
                    <Text style={styles.landmarkDescription}>{landmark.description}</Text>
                    
                    <View style={styles.landmarkInfo}>
                      <View style={styles.infoRow}>
                        <Ionicons name="location-outline" size={16} color="#5f6368" />
                        <Text style={styles.infoText}>{landmark.location.address}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="time-outline" size={16} color="#5f6368" />
                        <Text style={styles.infoText}>{landmark.visitingHours}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="card-outline" size={16} color="#5f6368" />
                        <Text style={styles.infoText}>{landmark.entryFee}</Text>
                      </View>
                      <View style={styles.infoRow}>
                        <Ionicons name="sunny-outline" size={16} color="#5f6368" />
                        <Text style={styles.infoText}>{landmark.bestTimeToVisit}</Text>
                      </View>
                    </View>

                    <View style={styles.categoriesContainer}>
                      {landmark.categories.map((category, idx) => (
                        <View key={idx} style={styles.categoryTag}>
                          <Text style={styles.categoryText}>{category}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Extracted Text */}
            {analysisResult.extractedText && analysisResult.extractedText.length > 0 && (
              <View style={styles.textContainer}>
                <Text style={styles.subsectionTitle}>📝 Extracted Text</Text>
                {analysisResult.extractedText.map((textItem, index) => (
                  <View key={index} style={styles.textCard}>
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Original:</Text>
                      <Text style={styles.originalText}>{textItem.text}</Text>
                    </View>
                    <View style={styles.textRow}>
                      <Text style={styles.textLabel}>Translation:</Text>
                      <Text style={styles.translatedText}>{textItem.translation}</Text>
                    </View>
                    <Text style={styles.textConfidence}>
                      Confidence: {Math.round(textItem.confidence * 100)}%
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Additional Information */}
            {analysisResult.additionalInfo && (
              <View style={styles.additionalInfoContainer}>
                <Text style={styles.subsectionTitle}>ℹ️ Additional Information</Text>
                
                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Historical Significance</Text>
                  <Text style={styles.infoCardText}>{analysisResult.additionalInfo.historicalSignificance}</Text>
                </View>

                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Cultural Importance</Text>
                  <Text style={styles.infoCardText}>{analysisResult.additionalInfo.culturalImportance}</Text>
                </View>

                <View style={styles.infoCard}>
                  <Text style={styles.infoCardTitle}>Visitor Tips</Text>
                  {analysisResult.additionalInfo.tips.map((tip, index) => (
                    <Text key={index} style={styles.tipText}>• {tip}</Text>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* Analysis History */}
        {analysisHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Analysis History</Text>
              <TouchableOpacity onPress={clearHistory}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.historyList}>
                {analysisHistory.map((entry) => (
                  <TouchableOpacity 
                    key={entry.id} 
                    style={styles.historyItem}
                    onPress={() => {
                      setSelectedImage({ uri: entry.image });
                      setAnalysisResult(entry.result);
                    }}
                  >
                    <Image source={{ uri: entry.image }} style={styles.historyImage} />
                    <Text style={styles.historyTime}>{entry.timestamp}</Text>
                    <Text style={styles.historyLandmarks}>
                      {entry.result.landmarks?.length || 0} landmarks
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* How to Use */}
        <View style={styles.helpSection}>
          <Text style={styles.sectionTitle}>How to Use</Text>
          <View style={styles.helpList}>
            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>📸</Text>
              <Text style={styles.helpText}>Take a photo or select from gallery</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>🔍</Text>
              <Text style={styles.helpText}>Tap "Analyze Photo" to detect landmarks</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>🏛️</Text>
              <Text style={styles.helpText}>Get detailed information about detected landmarks</Text>
            </View>
            <View style={styles.helpItem}>
              <Text style={styles.helpIcon}>📝</Text>
              <Text style={styles.helpText}>Extract and translate text from signs or menus</Text>
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
  subsectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 12,
  },
  imageSection: {
    marginTop: 20,
    marginBottom: 24,
  },
  selectedImageContainer: {
    position: 'relative',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectedImage: {
    width: width - 40,
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  clearImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e8eaed',
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  placeholderText: {
    fontSize: 14,
    color: '#9aa0a6',
    marginTop: 8,
  },
  imageActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  actionText: {
    fontSize: 14,
    color: '#1a73e8',
    marginLeft: 8,
    fontWeight: '500',
  },
  analyzeButton: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  analyzingButton: {
    backgroundColor: '#9aa0a6',
  },
  analyzeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  resultsSection: {
    marginBottom: 24,
  },
  landmarksContainer: {
    marginBottom: 20,
  },
  landmarkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  landmarkHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  landmarkName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    flex: 1,
  },
  confidenceBadge: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  confidenceText: {
    fontSize: 11,
    color: '#34a853',
    fontWeight: '600',
  },
  landmarkDescription: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 16,
  },
  landmarkInfo: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#5f6368',
    marginLeft: 8,
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryTag: {
    backgroundColor: '#f1f3f4',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  categoryText: {
    fontSize: 11,
    color: '#5f6368',
    fontWeight: '500',
  },
  textContainer: {
    marginBottom: 20,
  },
  textCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  textRow: {
    marginBottom: 8,
  },
  textLabel: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '600',
    marginBottom: 4,
  },
  originalText: {
    fontSize: 14,
    color: '#202124',
    fontWeight: '500',
  },
  translatedText: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: '500',
  },
  textConfidence: {
    fontSize: 11,
    color: '#5f6368',
    textAlign: 'right',
  },
  additionalInfoContainer: {
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  infoCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 8,
  },
  infoCardText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
  },
  tipText: {
    fontSize: 14,
    color: '#5f6368',
    lineHeight: 20,
    marginBottom: 4,
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
  historyList: {
    flexDirection: 'row',
    gap: 12,
    paddingRight: 20,
  },
  historyItem: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    width: 120,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  historyImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  historyTime: {
    fontSize: 10,
    color: '#5f6368',
    marginBottom: 4,
  },
  historyLandmarks: {
    fontSize: 11,
    color: '#1a73e8',
    fontWeight: '500',
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

export default LandmarkDetector;