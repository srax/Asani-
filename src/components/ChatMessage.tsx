import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, isUser }) => {
  if (!text) return null;
  
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <View style={[
        styles.bubble, 
        isUser ? styles.userBubble : styles.botBubble,
      ]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    paddingHorizontal: 14,
    width: '100%',
    flexDirection: 'row',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userBubble: {
    backgroundColor: '#0084FF', // Slightly more vibrant blue
    borderTopRightRadius: 6,
  },
  botBubble: {
    backgroundColor: '#F0F0F2', // Lighter gray for better contrast
    borderTopLeftRadius: 6,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '400',
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#111111',
  },
});