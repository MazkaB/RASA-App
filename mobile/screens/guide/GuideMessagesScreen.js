import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView,
  TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function GuideMessagesScreen() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  
  const chats = [
    {
      id: 1,
      touristName: 'John Smith',
      lastMessage: 'Looking forward to the tour tomorrow!',
      time: '10:30 AM',
      unread: 2,
      avatar: 'JS'
    },
    {
      id: 2,
      touristName: 'Sarah Johnson',
      lastMessage: 'Thank you for the information',
      time: 'Yesterday',
      unread: 0,
      avatar: 'SJ'
    },
    {
      id: 3,
      touristName: 'Alice Brown',
      lastMessage: 'Can we start 30 minutes earlier?',
      time: '2 days ago',
      unread: 1,
      avatar: 'AB'
    }
  ];

  const messages = [
    {
      id: 1,
      text: 'Hi! I have a question about tomorrow\'s tour',
      sender: 'tourist',
      time: '10:15 AM'
    },
    {
      id: 2,
      text: 'Hello! Of course, how can I help you?',
      sender: 'guide',
      time: '10:20 AM'
    },
    {
      id: 3,
      text: 'What should I bring? And what\'s the meeting point?',
      sender: 'tourist',
      time: '10:25 AM'
    },
    {
      id: 4,
      text: 'Please bring water, sunscreen, and comfortable shoes. We\'ll meet at the temple entrance at 9 AM',
      sender: 'guide',
      time: '10:28 AM'
    },
    {
      id: 5,
      text: 'Looking forward to the tour tomorrow!',
      sender: 'tourist',
      time: '10:30 AM'
    }
  ];

  const sendMessage = () => {
    if (messageText.trim()) {
      // Handle send message
      setMessageText('');
    }
  };

  if (selectedChat) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setSelectedChat(null)}>
            <Ionicons name="arrow-back" size={24} color="#202124" />
          </TouchableOpacity>
          <View style={styles.chatHeaderInfo}>
            <Text style={styles.chatHeaderName}>{selectedChat.touristName}</Text>
            <Text style={styles.chatHeaderStatus}>Online</Text>
          </View>
          <TouchableOpacity>
            <Ionicons name="call-outline" size={24} color="#2E7D32" />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView 
          style={styles.chatContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <FlatList
            data={messages}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={[
                styles.messageContainer,
                item.sender === 'guide' && styles.myMessageContainer
              ]}>
                <View style={[
                  styles.messageBubble,
                  item.sender === 'guide' && styles.myMessageBubble
                ]}>
                  <Text style={[
                    styles.messageText,
                    item.sender === 'guide' && styles.myMessageText
                  ]}>
                    {item.text}
                  </Text>
                  <Text style={styles.messageTime}>{item.time}</Text>
                </View>
              </View>
            )}
          />

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.messageInput}
              placeholder="Type a message..."
              value={messageText}
              onChangeText={setMessageText}
              multiline
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons name="send" size={24} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity>
          <Ionicons name="search-outline" size={24} color="#2E7D32" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {chats.map((chat) => (
          <TouchableOpacity
            key={chat.id}
            style={styles.chatItem}
            onPress={() => setSelectedChat(chat)}
          >
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{chat.avatar}</Text>
            </View>
            <View style={styles.chatInfo}>
              <Text style={styles.chatName}>{chat.touristName}</Text>
              <Text style={styles.lastMessage}>{chat.lastMessage}</Text>
            </View>
            <View style={styles.chatMeta}>
              <Text style={styles.chatTime}>{chat.time}</Text>
              {chat.unread > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{chat.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
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
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#202124',
  },
  content: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
  },
  chatInfo: {
    flex: 1,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#5f6368',
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  chatTime: {
    fontSize: 12,
    color: '#9aa0a6',
    marginBottom: 4,
  },
  unreadBadge: {
    backgroundColor: '#2E7D32',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e8eaed',
  },
  chatHeaderInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chatHeaderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
  },
  chatHeaderStatus: {
    fontSize: 12,
    color: '#2E7D32',
  },
  chatContainer: {
    flex: 1,
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: '#f1f3f4',
    borderRadius: 16,
    padding: 12,
    maxWidth: '80%',
  },
  myMessageBubble: {
    backgroundColor: '#2E7D32',
  },
  messageText: {
    fontSize: 14,
    color: '#202124',
  },
  myMessageText: {
    color: '#ffffff',
  },
  messageTime: {
    fontSize: 11,
    color: '#9aa0a6',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e8eaed',
  },
  messageInput: {
    flex: 1,
    backgroundColor: '#f1f3f4',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    padding: 8,
  },
});