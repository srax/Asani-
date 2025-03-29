import { useState, useCallback } from 'react';
import { transcribeAudio, getChatGptResponse, textToSpeech } from '../services/openaiService';
import { playAudio } from '../services/audioService';

export const useChatCompletion = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [useEnglishProcessing, setUseEnglishProcessing] = useState(true); // New state to control workflow
  
  const processAudio = useCallback(async (audioUri: string) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      if (useEnglishProcessing) {
        // ----------------- NEW WORKFLOW (English Processing) -----------------
        // Step 1: First transcribe to get original Urdu text
        setCurrentStep('transcribing');
        const originalUrduText = await transcribeAudio(audioUri, false); // false = don't translate
        if (!originalUrduText) {
          throw new Error('Failed to transcribe audio');
        }
        
        // Step 2: Translate to English for processing
        setCurrentStep('translating');
        const translatedText = await transcribeAudio(audioUri, true); // true = translate to English
        if (!translatedText) {
          throw new Error('Failed to translate audio to English');
        }
        
        // Step 3: Get ChatGPT response in English, then translate back to Urdu
        setCurrentStep('thinking');
        const response = await getChatGptResponse(translatedText, true); // true = process in English
        if (!response) {
          throw new Error('Failed to get response from ChatGPT');
        }
        
        // Step 4: Convert Urdu response to speech
        setCurrentStep('speaking');
        const speechUri = await textToSpeech(response);
        if (!speechUri) {
          throw new Error('Failed to convert text to speech');
        }
        
        // Step 5: Play the response
        await playAudio(speechUri);
        
        setIsProcessing(false);
        setCurrentStep('');
        
        return {
          userMessage: translatedText,
          originalUrduText: originalUrduText,
          assistantMessage: response,
          audioUri: speechUri
        };
      } else {
        // ----------------- ORIGINAL WORKFLOW (Urdu Processing) -----------------
        // Step 1: Transcribe audio to Urdu
        setCurrentStep('transcribing');
        const transcription = await transcribeAudio(audioUri, false); // false = don't translate
        if (!transcription) {
          throw new Error('Failed to transcribe audio');
        }
        
        // Step 2: Get ChatGPT response in Urdu
        setCurrentStep('thinking');
        const response = await getChatGptResponse(transcription, false); // false = process in Urdu
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
          originalUrduText: transcription, // For the Urdu workflow, the original text is the same as the user message
          assistantMessage: response,
          audioUri: speechUri
        };
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsProcessing(false);
      setCurrentStep('');
      return null;
    }
  }, [useEnglishProcessing]);

  // Function to toggle between workflows
  const toggleWorkflow = useCallback(() => {
    setUseEnglishProcessing(prev => !prev);
  }, []);

  return {
    isProcessing,
    currentStep,
    error,
    processAudio,
    useEnglishProcessing,
    toggleWorkflow
  };
}; 