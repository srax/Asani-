export interface Message {
    user: string;
    assistant: string;
    timestamp: string;
  }
  
  export interface AudioRecordingProps {
    isRecording: boolean;
    start: () => Promise<boolean>;
    stop: () => Promise<string | null>;
  }
  
  export interface ChatCompletionProps {
    isProcessing: boolean;
    currentStep: string;
    processAudio: (audioUri: string) => Promise<{
      userMessage: string;
      assistantMessage: string;
    } | null>;
  }
  
  export interface ConversationProps {
    messages: Message[];
    addMessage: (userMessage: string, assistantMessage: string) => void;
    clearConversation: () => void;
  }