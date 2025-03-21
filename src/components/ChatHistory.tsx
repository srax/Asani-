import React from 'react';
import { FlatList, StyleSheet, View, Text, Image } from 'react-native';
import { ChatMessage } from './ChatMessage';

interface Message {
  user: string;
  assistant: string;
  timestamp: string;
}

interface ChatHistoryProps {
  messages: Message[];
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({ messages }) => {
  if (messages.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Asani</Text>
        <Text style={styles.subtitleText}>Your Urdu voice assistant</Text>
      </View>
    );
  }
  
  // Flatten the conversation into individual messages
  const flattenedMessages = messages.flatMap((message, index) => {
    const items = [];
    if (message.user) {
      items.push({
        id: `user-${index}`,
        text: message.user,
        isUser: true,
      });
    }
    if (message.assistant) {
      items.push({
        id: `assistant-${index}`,
        text: message.assistant,
        isUser: false,
      });
    }
    return items;
  });
  
  return (
    <FlatList
      data={flattenedMessages}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatMessage text={item.text} isUser={item.isUser} />
      )}
      contentContainerStyle={styles.listContent}
      inverted={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 10,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#7209b7',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitleText: {
    fontSize: 18,
    color: '#7209b7',
    textAlign: 'center',
  },
});