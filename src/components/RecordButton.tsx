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
      <View style={styles.iconContainer}>
        <Ionicons 
          name={isRecording ? "mic" : "mic-off"} 
          size={32} 
          color="white" 
        />
        {isRecording ? null : (
          <View style={styles.slash} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333333', // Dark gray background
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#ea4335', // Red when recording
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  slash: {
    position: 'absolute',
    width: 2,
    height: 38,
    backgroundColor: 'white',
    transform: [{ rotate: '45deg' }],
  },
});