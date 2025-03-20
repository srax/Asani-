import { Audio } from 'expo-av';

// Initialize audio recording
export const startRecording = async (): Promise<Audio.Recording | null> => {
  try {
    // Request permissions
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      console.error('Audio recording permission not granted');
      return null;
    }
    
    // Prepare recording options
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    
    // Start recording
    const { recording } = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );
    
    return recording;
  } catch (error) {
    console.error('Failed to start recording:', error);
    return null;
  }
};

// Stop recording and get the audio file URI
export const stopRecording = async (
  recording: Audio.Recording
): Promise<string | null> => {
  try {
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    return uri;
  } catch (error) {
    console.error('Failed to stop recording:', error);
    return null;
  }
};

// Play audio from a URI
export const playAudio = async (uri: string): Promise<void> => {
  try {
    const { sound } = await Audio.Sound.createAsync({ uri });
    await sound.playAsync();
  } catch (error) {
    console.error('Failed to play audio:', error);
  }
};