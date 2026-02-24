import { useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';

const API_BASE = "http://localhost:5000/api/sahaay"; // Updated base URL

const useWellnessChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Namaste! I'm your emotional wellbeing companion 🌿 How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);

  const [isTyping, setIsTyping] = useState(false);
  const [distressLevel, setDistressLevel] = useState(1);
  const [sessionId, setSessionId] = useState('');
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [userId] = useState(() => {
    // Try to get userId from localStorage, or generate a new one
    const storedId = localStorage.getItem('sahaay_userId');
    if (storedId) return storedId;
    const newId = `user_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('sahaay_userId', newId);
    return newId;
  });
  const [error, setError] = useState(null);

  // Create axios instance with base config
  const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true, // For sending cookies
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add response interceptor for error handling
  api.interceptors.response.use(
    response => response,
    error => {
      console.error('API Error:', error);
      setError(error.response?.data?.message || 'Something went wrong');
      return Promise.reject(error);
    }
  );

  // 📌 Add system message
  const addSystemMessage = useCallback((text, type = 'info') => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender: 'system',
      type,
      timestamp: new Date()
    }]);
  }, []);

  // 📌 Start Session
  const startSession = useCallback(async () => {
    try {
      setError(null);
      setIsTyping(true);

      const response = await api.post('/start_session', {
        userId,
        initialDistressScore: 1
      });

      setSessionId(response.data.sessionId);
      setIsSessionActive(true);
      setIsTyping(false);

      // Add welcome message from the server if available
      if (response.data.welcomeMessage) {
        addMessage(response.data.welcomeMessage, 'bot');
      }

      return response.data.sessionId;
    } catch (err) {
      console.error('Start session error:', err);
      // Offline fallback (auth/api disabled mode)
      const localSessionId = `local_${Date.now()}`;
      setSessionId(localSessionId);
      setIsSessionActive(true);
      setError(null);
      addSystemMessage("You're in offline mode. Chat replies are simplified, but you can still use the chat.", 'info');
      setIsTyping(false);
      return localSessionId;
    }
  }, [userId, addSystemMessage]);

  // 📌 Add Message Helper
  const addMessage = useCallback((text, sender = 'bot', type = 'text') => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      text,
      sender,
      type,
      timestamp: new Date()
    }]);
  }, []);

  // 📌 End Session
  const endSession = useCallback(async () => {
    if (!sessionId) return;
    try {
      setIsTyping(true);
      await api.post(`/end_session`, {
        sessionId,
        userId
      });
      setIsSessionActive(false);
      setSessionId('');
      addSystemMessage("Session ended. Start a new one whenever you're ready.", 'info');
    } catch (err) {
      console.error('Error ending session:', err);
      addSystemMessage("Error ending session. You can safely close the chat.", 'error');
    } finally {
      setIsTyping(false);
    }
  }, [sessionId, userId, addSystemMessage, api]);

  // 📌 Send Message
  const sendMessage = useCallback(async (text) => {
    if (!text.trim()) {
      addSystemMessage("Please type a message.", 'warning');
      return;
    }

    if (!isSessionActive) {
      await startSession();
    }

    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await api.post('/chat', {
        message: text,
        sessionId,
        userId,
        distressLevel
      });

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.response.text,
        sender: 'bot',
        timestamp: new Date(),
        interventionType: response.data.response.interventionType,
        type: 'text',
        data: null
      };

      setMessages(prev => [...prev, botMessage]);

      if (response.data.distressScore !== undefined) {
        setDistressLevel(response.data.distressScore);
      }

      if (response.data.sessionId && response.data.sessionId !== sessionId) {
        setSessionId(response.data.sessionId);
      }

    } catch (err) {
      console.error('Error sending message:', err);
      // Offline fallback response
      const lower = text.toLowerCase();
      let reply =
        "I'm here with you. Want to tell me a bit more about what's going on?";
      if (lower.includes('anx') || lower.includes('worried') || lower.includes('panic')) {
        reply =
          "That sounds really stressful. Try a quick grounding: name 5 things you see, 4 you feel, 3 you hear, 2 you smell, 1 you taste. What do you notice?";
      } else if (lower.includes('sad') || lower.includes('depress') || lower.includes('hopeless')) {
        reply =
          "I'm sorry you're feeling this way. If you're up for it, what's one small thing that usually helps even a little—music, a walk, or talking to someone?";
      } else if (lower.includes('stress') || lower.includes('overwhelm') || lower.includes('burnout')) {
        reply =
          "It makes sense to feel overwhelmed. Let's break it down: what's the biggest pressure right now, and what's one small next step you could take today?";
      }

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: reply,
        sender: 'bot',
        timestamp: new Date(),
        interventionType: 'DBT',
        type: 'text',
        data: null
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [sessionId, userId, distressLevel, isSessionActive, startSession, addSystemMessage, api]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 1,
        text: "Namaste! I'm your emotional wellbeing companion 🌿 How are you feeling today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setDistressLevel(1);
    setError(null);
  }, []);

  // Initialize session on mount
  // Initialize session on mount
  const initializingRef = useRef(false);

  useEffect(() => {
    const initializeChat = async () => {
      // Prevent double initialization
      if (initializingRef.current || isSessionActive) return;
      initializingRef.current = true;

      try {
        await startSession();
      } catch (err) {
        console.error('Session initialization error:', err);
      } finally {
        initializingRef.current = false;
      }
    };

    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  return {
    messages,
    sendMessage,
    isTyping,
    distressLevel,
    error,
    sessionId,
    isSessionActive,
    startSession,
    endSession,
    addMessage,
    addSystemMessage,
    clearChat
  };
};

export default useWellnessChat;
