import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, Bot, User, Menu, ArrowLeft, Loader2, Clock, Shield,
  Sun, Leaf, Zap, Sparkles, XCircle, AlertCircle, AlertTriangle
} from 'lucide-react';
import useWellnessChat from '../hooks/useSahaayChat';

const ChatBot = () => {
  const [input, setInput] = useState('');
  const [currentTheme, setCurrentTheme] = useState('warm');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const {
    messages = [],
    sendMessage,
    isTyping,
    startSession,
    endSession,
    addSystemMessage,
    isSessionActive,
    error: chatError
  } = useWellnessChat();

  /** 📌 Auto-resize textbox */
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  /** 📌 Start session on mount */
  useEffect(() => {
    const initSession = async () => {
      try {
        await startSession();
      } catch (error) {
        console.error('Failed to start session:', error);
        addSystemMessage('Failed to initialize chat. Please refresh the page.', 'error');
      } finally {
        setIsInitializing(false);
      }
    };

    initSession();

    return () => {
      const cleanup = async () => {
        try {
          await endSession();
        } catch (error) {
          console.error('Error ending session:', error);
        }
      };
      cleanup();
    };
  }, [startSession, endSession, addSystemMessage]);

  /** 📌 Auto-scroll on new messages */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  /** 📌 Handle message send */
  const handleSend = useCallback(async (e) => {
    e.preventDefault();
    const message = input.trim();
    if (!message || isTyping) return;

    try {
      setInput('');
      await sendMessage(message);
      // Reset textarea height after sending
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addSystemMessage('Failed to send message. Please try again.', 'error');
    }
  }, [input, isTyping, sendMessage, addSystemMessage]);

  /** 📌 Handle quick reply */
  const handleQuickReply = useCallback(async (text) => {
    try {
      setInput('');
      await sendMessage(text);
    } catch (error) {
      console.error('Error sending quick reply:', error);
      addSystemMessage('Failed to send quick reply. Please try again.', 'error');
    }
  }, [sendMessage, addSystemMessage]);

  /** 📌 Theme selection */
  const getThemeIcon = (theme) => {
    switch (theme) {
      case 'warm': return <Sun className="w-4 h-4" />;
      case 'calm': return <Leaf className="w-4 h-4" />;
      case 'energy': return <Zap className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  };

  const getThemeColor = (theme) => {
    switch (theme) {
      case 'warm': return 'bg-amber-100 text-amber-800';
      case 'calm': return 'bg-teal-100 text-teal-800';
      case 'energy': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /** 📌 Format timestamps */
  const formatTime = (date) =>
    new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit', minute: '2-digit', hour12: true
    }).format(new Date(date));

  // Show loading state while initializing
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto animate-spin text-blue-500" />
          <p className="mt-4 text-gray-600">Starting your chat session...</p>
        </div>
      </div>
    );
  }

  // Show error state if session couldn't be started
  if (chatError && !isSessionActive) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 p-4">
        <div className="max-w-md w-full text-center p-6 bg-white rounded-xl shadow-sm border border-red-100">
          <AlertTriangle className="w-12 h-12 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connection Error</h2>
          <p className="text-gray-600 mb-6">We couldn't connect to the chat service. Please check your internet connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">Manas Veda · Your Mental Health Companion</h1>
          </div>

          <div className="flex items-center space-x-2">
            {['warm', 'calm', 'energy'].map((theme) => (
              <button
                key={theme}
                onClick={() => setCurrentTheme(theme)}
                className={`p-2 rounded-full ${currentTheme === theme ? getThemeColor(theme) : 'bg-gray-100'}`}
              >
                {getThemeIcon(theme)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <div className="w-64 bg-white border-r p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700">Chat History</h2>
              <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-full hover:bg-gray-100">
                <ArrowLeft className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-sm text-gray-700">
              Today's Chat
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {/* Error Message */}
          {chatError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{chatError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((msg, i) => (
                msg.sender === 'system' ? (
                  <div key={i} className="flex justify-center">
                    <div className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                      {msg.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`flex max-w-3xl ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        msg.sender === 'user' ? 'bg-blue-100 ml-3' : 'bg-green-100 mr-3'
                      }`}>
                        {msg.sender === 'user' ? <User className="w-4 h-4 text-blue-600"/> : <Bot className="w-4 h-4 text-green-600"/>}
                      </div>

                      <div 
                        className={`${msg.sender === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-white border border-gray-200'
                        } rounded-2xl p-4 shadow-sm`}
                      >
                        <div className="flex justify-between items-center text-xs opacity-80 mb-2">
                          <span className="font-medium">
                            {msg.sender === 'user' ? 'You' : 'Assistant'}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatTime(msg.timestamp)}
                          </span>
                        </div>
                        <div className="text-sm whitespace-pre-wrap">
                          {msg.text}
                        </div>
                        {msg.quickReplies && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {msg.quickReplies.map((r, idx) => (
                              <button 
                                key={idx} 
                                onClick={() => handleQuickReply(r)} 
                                disabled={isTyping}
                                className={`px-3 py-1.5 rounded-full text-xs transition-colors ${
                                  isTyping 
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                              >
                                {r}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              ))}

              {isTyping && (
                <div className="flex items-center text-sm text-gray-500">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin"/> Assistant is typing…
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-white border-t p-4 border-gray-200">
            <form onSubmit={handleSend} className="flex gap-3">
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                    }
                  }}
                  placeholder="Share your thoughts… 💙"
                  className="w-full p-3 pr-10 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 resize-none transition-all duration-200"
                  style={{ minHeight: '48px', maxHeight: '200px' }}
                  rows={1}
                  disabled={isTyping || !isSessionActive}
                  aria-label="Type your message"
                />
                {input && (
                  <button
                    type="button"
                    onClick={() => setInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear message"
                  >
                    <XCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                disabled={isTyping || !input.trim() || !isSessionActive}
                className={`p-3 rounded-xl transition-colors flex-shrink-0 ${
                  isTyping || !input.trim() || !isSessionActive
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-[#3d9098] text-white hover:bg-[#347a80]'
                }`}
                aria-label={isTyping ? 'Sending...' : 'Send message'}
              >
                {isTyping ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </form>
            {!isSessionActive && (
              <p className="mt-2 text-sm text-center text-amber-600">
                Please wait while we connect you to a counselor...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
