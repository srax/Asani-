import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

// Initialize audio recording
export const startRecording = async (): Promise<Audio.Recording | null> => {
  try {
    // Request permissions
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      console.error('Audio recording permission not granted');
      return null;
    }
    
    // Configure audio mode for recording with proper iOS settings
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    
    // Create and prepare the recording
    const recording = new Audio.Recording();
    try {
      // Use more specific recording options for iOS
      await recording.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.AndroidOutputFormat.MPEG_4,
          audioEncoder: Audio.AndroidAudioEncoder.AAC,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
          audioQuality: Audio.IOSAudioQuality.MAX,
          sampleRate: 44100,
          numberOfChannels: 1,
          bitRate: 128000,
          linearPCMBitDepth: 16,
          linearPCMIsBigEndian: false,
          linearPCMIsFloat: false,
        },
        web: {
          mimeType: 'audio/webm',
          bitsPerSecond: 128000,
        },
      });
      
      // Start recording
      await recording.startAsync();
      return recording;
    } catch (error) {
      console.error('Error preparing recording:', error);
      return null;
    }
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
    
    // Reset audio mode after recording
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    
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
    // Configure audio mode for playback
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
    });
    
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true }
    );
    
    // Clean up the sound object when playback finishes
    sound.setOnPlaybackStatusUpdate(async (status) => {
      if (status.isLoaded && !status.isPlaying && status.didJustFinish) {
        await sound.unloadAsync();
      }
    });
    
    await sound.playAsync();
  } catch (error) {
    console.error('Failed to play audio:', error);
  }
};