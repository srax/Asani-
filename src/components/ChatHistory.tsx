import React from 'react';
import { FlatList, StyleSheet, View, Text } from 'react-native';
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
      </View>
    );
  }
  
  return (
    <FlatList
      data={messages}
      keyExtractor={(_, index) => index.toString()}
      inverted
      renderItem={({ item }) => (
        <View style={styles.messageContainer}>
          <ChatMessage text={item.user} isUser={true} />
          <ChatMessage text={item.assistant} isUser={false} />
        </View>
      )}
      contentContainerStyle={styles.listContent}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingVertical: 20,
  },
  messageContainer: {
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});