import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const { width } = Dimensions.get('window');
const API_BASE_URL = 'http://localhost:5000';

const AIChat = ({ onClose, userProfile }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: `Welcome to Indonesia, ${userProfile?.name || 'Traveler'}! I'm your AI travel assistant. I can help you with recommendations and answer any questions about your trip. How can I assist you today?`,
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef();

  const quickQuestions = [
    { text: "What are the must-visit places?", icon: "location-outline" },
    { text: "How do I get around Jakarta?", icon: "car-outline" },
    { text: "Where can I find good local food?", icon: "restaurant-outline" },
    { text: "What's the weather like?", icon: "sunny-outline" },
    { text: "How much should I tip?", icon: "cash-outline" },
    { text: "Is it safe to drink tap water?", icon: "water-outline" }
  ];

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const generateAIResponse = async (userMessage) => {
    try {
      // Simple AI chat responses focused on general travel assistance
      return generateGeneralResponse(userMessage);
    } catch (error) {
      return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
    }
  };


  const generateGeneralResponse = (message) => {
    const responses = [
      "That's an interesting question! Indonesia is a fascinating country with 17,000+ islands. What specific aspect would you like to know more about?",
      "I'd be happy to help! Can you tell me more about what you're looking for during your visit to Indonesia?",
      "Indonesia has so much to offer! Are you interested in cultural experiences, natural attractions, food, or something else?",
      "Great question! Based on your travel preferences, I can provide personalized recommendations. What would you like to explore?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };


  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(async () => {
      const aiResponseText = await generateAIResponse(inputText);
      
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const sendQuickQuestion = (question) => {
    setInputText(question);
    setTimeout(() => sendMessage(), 100);
  };

  const renderMessage = (message) => (
    <View
      key={message.id}
      style={[
        styles.messageContainer,
        message.sender === 'user' ? styles.userMessage : styles.aiMessage
      ]}
    >
      {message.sender === 'ai' && (
        <View style={styles.aiAvatar}>
          <Ionicons name="sparkles" size={16} color="#1a73e8" />
        </View>
      )}
      <View
        style={[
          styles.messageBubble,
          message.sender === 'user' ? styles.userBubble : styles.aiBubble
        ]}
      >
        <Text
          style={[
            styles.messageText,
            message.sender === 'user' ? styles.userText : styles.aiText
          ]}
        >
          {message.text}
        </Text>
        <Text style={styles.messageTime}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Ionicons name="chatbubbles-outline" size={24} color="#1a73e8" />
          <Text style={styles.headerTitle}>AI Travel Assistant</Text>
        </View>
      </View>

      {/* Quick Questions */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.quickQuestionsContainer}
        contentContainerStyle={styles.quickQuestionsContent}
      >
        {quickQuestions.map((question, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickQuestionButton}
            onPress={() => sendQuickQuestion(question.text)}
          >
            <Ionicons name={question.icon} size={16} color="#1a73e8" />
            <Text style={styles.quickQuestionText}>{question.text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map(renderMessage)}
        
        {isTyping && (
          <View style={[styles.messageContainer, styles.aiMessage]}>
            <View style={styles.aiAvatar}>
              <Ionicons name="sparkles" size={16} color="#1a73e8" />
            </View>
            <View style={[styles.messageBubble, styles.aiBubble]}>
              <View style={styles.typingIndicator}>
                <Text style={styles.typingText}>AI is thinking</Text>
                <ActivityIndicator size="small" color="#5f6368" />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#9aa0a6"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              inputText.trim() ? styles.sendButtonActive : styles.sendButtonInactive
            ]}
            onPress={sendMessage}
            disabled={!inputText.trim() || isTyping}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={inputText.trim() ? "#ffffff" : "#9aa0a6"} 
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
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
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 12,
  },
  quickQuestionsContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
  },
  quickQuestionsContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  quickQuestionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
    gap: 6,
  },
  quickQuestionText: {
    fontSize: 12,
    color: '#1a73e8',
    fontWeight: '500',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 16,
    gap: 12,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessage: {
    justifyContent: 'flex-end',
  },
  aiMessage: {
    justifyContent: 'flex-start',
  },
  aiAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f0fe',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
  },
  userBubble: {
    backgroundColor: '#1a73e8',
    borderBottomRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e8eaed',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#ffffff',
  },
  aiText: {
    color: '#202124',
  },
  messageTime: {
    fontSize: 11,
    color: '#9aa0a6',
    marginTop: 4,
    textAlign: 'right',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 12,
    color: '#5f6368',
    fontStyle: 'italic',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f8f9fa',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e8eaed',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonActive: {
    backgroundColor: '#1a73e8',
  },
  sendButtonInactive: {
    backgroundColor: '#f1f3f4',
  },
});

export default AIChat;