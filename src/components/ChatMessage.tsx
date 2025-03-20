import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ChatMessageProps {
  text: string;
  isUser: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ text, isUser }) => {
  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.botContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
          {text}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
    paddingHorizontal: 10,
    width: '100%',
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  botContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#DCF8C6',
  },
  botBubble: {
    backgroundColor: '#F1F0F0',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: '#000',
  },
  botText: {
    color: '#000',
  },
});