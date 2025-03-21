import { useState, useCallback } from 'react';
import { transcribeAudio, getChatGptResponse, textToSpeech } from '../services/openaiService';
import { playAudio } from '../services/audioService';

export const useChatCompletion = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  
  const processAudio = useCallback(async (audioUri: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      // Step 1: Transcribe audio
      setCurrentStep('transcribing');
      const transcription = await transcribeAudio(audioUri);
      if (!transcription) {
        throw new Error('Failed to transcribe audio');
      }
      
      // Step 2: Get ChatGPT response
      setCurrentStep('thinking');
      const response = await getChatGptResponse(transcription);
      if (!response) {
        throw new Error('Failed to get response from ChatGPT');
      }
      
      // Step 3: Convert response to speech
      setCurrentStep('speaking');
      const speechUri = await textToSpeech(response);
      if (!speechUri) {
        throw new Error('Failed to convert text to speech');
      }
      
      // Step 4: Play the response
      await playAudio(speechUri);
      
      setIsProcessing(false);
      setCurrentStep('');
      
      return {
        userMessage: transcription,
        assistantMessage: response,
        audioUri: speechUri
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsProcessing(false);
      setCurrentStep('');
      return null;
    }
  }, []);

  return {
    isProcessing,
    currentStep,
    error,
    processAudio
  };
}; 