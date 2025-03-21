import { OPENAI_API_KEY } from '@env';
import * as FileSystem from 'expo-file-system';

// Transcribe audio using Whisper API
export const transcribeAudio = async (uri: string): Promise<string | null> => {
  try {
    // Prepare form data for the API request
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'audio/m4a',
      name: 'recording.m4a',
    } as any);
    formData.append('model', 'whisper-1');
    formData.append('language', 'ur'); // Urdu language code
    
    // Make the API request
    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Whisper API error:', errorText);
      return null;
    }
    
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Failed to transcribe audio:', error);
    return null;
  }
};

// Get response from ChatGPT
export const getChatGptResponse = async (userMessage: string): Promise<string | null> => {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are a helpful assistant that replies in Urdu. Keep your answers concise and informative.' 
          },
          { role: 'user', content: userMessage }
        ],
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('ChatGPT API error:', errorText);
      return null;
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || null;
  } catch (error) {
    console.error('Failed to get ChatGPT response:', error);
    return null;
  }
};

// Convert text to speech using OpenAI TTS
export const textToSpeech = async (text: string): Promise<string | null> => {
  try {
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1',
        voice: 'alloy',
        input: text,
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('TTS API error:', errorText);
      return null;
    }
    
    // Convert the response to an array buffer
    const arrayBuffer = await response.arrayBuffer();
    
    // Save the audio file
    const fileUri = `${FileSystem.documentDirectory}response-${Date.now()}.mp3`;
    
    // Write the audio data to a file
    await FileSystem.writeAsStringAsync(
      fileUri,
      arrayBufferToBase64(arrayBuffer),
      { encoding: FileSystem.EncodingType.Base64 }
    );
    
    return fileUri;
  } catch (error) {
    console.error('Failed to convert text to speech:', error);
    return null;
  }
};

// Helper function to convert ArrayBuffer to Base64 string
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  
  return btoa(binary);
} 