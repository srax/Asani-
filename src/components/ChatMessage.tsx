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
      {!isUser && <View style={styles.avatar}>
        <Text style={styles.avatarText}>🤖</Text>
      </View>}
      
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
        <Text style={[styles.text, isUser ? styles.userText : styles.botText]}>
          {text}
        </Text>
      </View>
      
      {isUser && <View style={styles.avatar}>
        <Text style={styles.avatarText}>👤</Text>
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  userContainer: {
    justifyContent: 'flex-end',
  },
  botContainer: {
    justifyContent: 'flex-start',
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  avatarText: {
    fontSize: 20,
  },
  bubble: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 16,
    maxWidth: '75%',
  },
  userBubble: {
    backgroundColor: '#8a2be2', // Purple for user messages
  },
  botBubble: {
    backgroundColor: '#444', // Dark gray for bot messages
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  userText: {
    color: 'white',
  },
  botText: {
    color: 'white',
  },
});