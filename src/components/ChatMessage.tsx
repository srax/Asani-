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
    marginVertical: 6,
    paddingHorizontal: 12,
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
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 14,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: '#007AFF', // iMessage blue
    borderTopRightRadius: 4,
  },
  botBubble: {
    backgroundColor: '#E9E9EB', // Light gray for AI messages (iMessage style)
    borderTopLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: '#000000',
  },
});