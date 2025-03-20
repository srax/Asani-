import { useState } from 'react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const useConversation = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage = {
      text,
      isUser,
      timestamp: new Date(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    isLoading,
    addMessage,
    clearMessages,
  };
};