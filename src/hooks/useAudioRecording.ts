import { useState, useCallback } from 'react';
import { Audio } from 'expo-av';
import { startRecording, stopRecording } from '../services/audioService';

export const useAudioRecording = () => {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  const start = useCallback(async () => {
    const newRecording = await startRecording();
    if (newRecording) {
      setRecording(newRecording);
      setIsRecording(true);
      return true;
    }
    return false;
  }, []);
  
  const stop = useCallback(async () => {
    if (!recording) return null;
    
    setIsRecording(false);
    const uri = await stopRecording(recording);
    setRecording(null);
    return uri;
  }, [recording]);
  
  return {
    isRecording,
    start,
    stop
  };
};