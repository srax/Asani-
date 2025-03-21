import React, { useMemo, useCallback } from 'react';
import { View, StyleSheet, SafeAreaView, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useConversation } from '../hooks/useConversation';
import { useAudioRecording } from '../hooks/useAudioRecording';
import { useChatCompletion } from '../hooks/useChatCompletion';
import { RecordButton } from '../components/RecordButton';
import { ChatHistory } from '../components/ChatHistory';

const ChatScreen: React.FC = () => {
  const { messages, addMessage, clearMessages } = useConversation();
  const { isRecording, start, stop } = useAudioRecording();
  const { isProcessing, currentStep, error, processAudio } = useChatCompletion();
  
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
        // Process the audio with OpenAI
        const result = await processAudio(audioUri);
        if (result) {
          // Add both user message and assistant response to the conversation
          addMessage(result.userMessage, true);
          addMessage(result.assistantMessage, false);
        }
      }
    } else {
      if (!isProcessing) {
        const success = await start();
        if (success) {
          console.log('Recording started');
        }
      }
    }
  }, [isRecording, isProcessing, start, stop, processAudio, addMessage]);

  // Get appropriate status text based on current state
  const getStatusText = useCallback(() => {
    if (error) return error;
    if (isRecording) return 'Recording...';
    if (isProcessing) {
      switch (currentStep) {
        case 'transcribing': return 'Transcribing your voice...';
        case 'thinking': return 'Generating response...';
        case 'speaking': return 'Speaking response...';
        default: return 'Processing...';
      }
    }
    return '';
  }, [isRecording, isProcessing, currentStep, error]);

  const statusText = getStatusText();

  const handleReset = useCallback(() => {
    clearMessages();
  }, [clearMessages]);

  return (
    <SafeAreaView style={styles.container}>
      {messages.length > 0 && (
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Asani</Text>
        </View>
      )}
      
      <View style={styles.content}>
        <ChatHistory messages={transformedMessages} />
      </View>
      
      {statusText ? (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusText}</Text>
          {isProcessing && <ActivityIndicator color="#007AFF" size="small" style={styles.spinner} />}
        </View>
      ) : null}
      
      <View style={styles.footer}>
        <RecordButton 
          isRecording={isRecording}
          onToggleRecording={!isProcessing ? handleToggleRecording : () => {}}
        />
        
        <TouchableOpacity 
          style={styles.crossButton}
          onPress={handleReset}
          disabled={isProcessing || isRecording}
        >
          <Ionicons name="close" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  statusText: {
    color: '#007AFF',
    fontSize: 15,
    textAlign: 'center',
  },
  spinner: {
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    backgroundColor: '#F5F5F7',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  crossButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});

export default ChatScreen;