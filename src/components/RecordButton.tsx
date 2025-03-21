import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RecordButtonProps {
  isRecording: boolean;
  onToggleRecording: () => void;
}

export const RecordButton: React.FC<RecordButtonProps> = ({ 
  isRecording, 
  onToggleRecording 
}) => {
  return (
    <TouchableOpacity 
      style={[styles.button, isRecording ? styles.recordingButton : null]}
      onPress={onToggleRecording}
    >
      <View style={[styles.innerCircle, isRecording && styles.recordingInnerCircle]}>
        <Ionicons 
          name={isRecording ? "square" : "mic"} 
          size={isRecording ? 20 : 28} 
          color={isRecording ? "white" : "#007AFF"} 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  recordingButton: {
    backgroundColor: '#007AFF',
  },
  innerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  recordingInnerCircle: {
    backgroundColor: 'rgba(255, 0, 0, 0.9)',
  },
});