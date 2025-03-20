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
      {/* Header removed */}
      
      <View style={styles.content}>
        <ChatHistory messages={transformedMessages} />
      </View>
      
      {statusText ? (
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>{statusText}</Text>
          {isProcessing && <ActivityIndicator color="#8a2be2" size="small" style={styles.spinner} />}
        </View>
      ) : null}
      
      <View style={styles.footer}>
        <RecordButton 
          isRecording={isRecording}
          onToggleRecording={!isProcessing ? handleToggleRecording : () => {}}
        />
        
        {/* Red cross button */}
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
    backgroundColor: 'black',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    marginBottom: 10,
  },
  statusText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  spinner: {
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 40,
  },
  crossButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;