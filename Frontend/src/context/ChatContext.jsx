import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ChatContext = createContext();

export const useChat = () => {
  return useContext(ChatContext);
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I'm your emotional wellbeing companion. I'm here to listen and support you. How are you feeling today? 🌿",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [isTyping, setIsTyping] = useState(false);
  const [distressLevel, setDistressLevel] = useState(1);
  const [sessionId, setSessionId] = useState('');
  const [userId] = useState(`user_${Math.random().toString(36).substr(2, 9)}`);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Start a new chat session
  const startSession = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/sahaay/start_session', {
        userId,
        initialDistressScore: 1
      });
      
      setSessionId(response.data.sessionId);
      setIsSessionActive(true);
      return response.data.sessionId;
    } catch (error) {
      console.error('Error starting session:', error);
      addSystemMessage('Failed to start chat session. Please try again.');
      return null;
    }
  };

  // End the current chat session
  const endSession = async () => {
    if (!sessionId) return;
    
    try {
      await axios.post('http://localhost:5000/api/sahaay/end_session', {
        sessionId,
        userId,
        finalDistressScore: distressLevel
      });
      
      setSessionId('');
      setIsSessionActive(false);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  // Add a system message to the chat
  const addSystemMessage = (text) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'system',
      timestamp: new Date()
    }]);
  };

  // Send a message to the chatbot
  const sendMessage = async (text) => {
    if (!text.trim() || !sessionId) return;

    // Add user message to chat
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Send message to backend
      const response = await axios.post('http://localhost:5000/api/sahaay/chat', {
        sessionId,
        userId,
        message: text
      });

      // Add bot response to chat
      if (response.data.response) {
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          text: response.data.response.text,
          sender: 'bot',
          timestamp: new Date(),
          interventionType: response.data.response.interventionType
        }]);
      }

      // Update distress level if changed
      if (response.data.distressLevel) {
        setDistressLevel(response.data.distressLevel);
      }

      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      addSystemMessage('Sorry, I encountered an error. Please try again.');
      return null;
    } finally {
      setIsTyping(false);
    }
  };

  // Clear the chat history
  const clearChat = () => {
    setMessages([{
      id: 1,
      text: "Namaste! I'm your emotional wellbeing companion. I'm here to listen and support you. How are you feeling today? 🌿",
      sender: 'bot',
      timestamp: new Date()
    }]);
    setDistressLevel(1);
  };

  // Initialize session when component mounts
  useEffect(() => {
    startSession();
    
    // End session when component unmounts
    return () => {
      if (isSessionActive) {
        endSession();
      }
    };
  }, []);

  const value = {
    messages,
    isTyping,
    distressLevel,
    sessionId,
    isSessionActive,
    sendMessage,
    startSession,
    endSession,
    clearChat,
    addSystemMessage
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};

export default ChatContext;
