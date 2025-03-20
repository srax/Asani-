import React, { useMemo, useState, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConversation } from '../hooks/useConversation';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { RecordButton } from '../components/RecordButton';
import { ChatHistory } from '../components/ChatHistory';

const ChatScreen: React.FC = () => {
  const { messages, addMessage } = useConversation();
  const { isRecording, start, stop } = useAudioRecording();
  
  // Transform messages to match ChatHistory's expected format
  const transformedMessages = useMemo(() => {
    return messages.map(msg => ({
      user: msg.isUser ? msg.text : '',
      assistant: msg.isUser ? '' : msg.text,
      timestamp: msg.timestamp.toISOString()
    }));
  }, [messages]);

  const handleToggleRecording = useCallback(async () => {
    if (isRecording) {
      const audioUri = await stop();
      if (audioUri) {
        // Here you would typically process the audio and send it to your API
        console.log('Recording stopped, audio URI:', audioUri);
        // For now, just add a placeholder message
        addMessage('Audio message recorded', true);
      }
    } else {
      const success = await start();
      if (success) {
        console.log('Recording started');
      }
    }
  }, [isRecording, start, stop, addMessage]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header removed */}
      
      <View style={styles.content}>
        <ChatHistory messages={transformedMessages} />
      </View>
      
      <View style={styles.footer}>
        {/* Microphone and cross buttons side by side in the middle */}
        <View style={styles.buttonContainer}>
          {/* Microphone button */}
          <RecordButton 
            isRecording={isRecording}
            onToggleRecording={handleToggleRecording}
          />
          
          {/* Red cross button */}
          <TouchableOpacity style={styles.crossButton}>
            <Ionicons name="close" size={32} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  crossButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonIcon: {
    fontSize: 30,
    color: 'white',
  },
});

export default ChatScreen;