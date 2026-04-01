import React, { useRef } from 'react';
import { Send, User, Bot, Loader2, Heart, Shield, Sparkles, MessageCircle, X, RotateCcw, AlertTriangle } from 'lucide-react';
import useSahaayChat from '../hooks/useSahaayChat';
import {
  formatTime,
  getMessageStyle,
  getDistressLevelInfo,
  getInterventionTypeText,
  checkForCrisisKeywords,
  getEmojiForEmotion
} from '../utils/chatUtils';

const WellnessChat = () => {
  const [input, setInput] = React.useState('');
  const [showCrisisModal, setShowCrisisModal] = React.useState(false);
  const [showHelpModal, setShowHelpModal] = React.useState(false);
  const [suggestedResponses, setSuggestedResponses] = React.useState([
    "I'm feeling anxious",
    "I'm having a tough day",
    "I need help with stress",
    "I'm feeling overwhelmed"
  ]);

  const messagesEndRef = useRef(null);

  // Use our custom hook for chat functionality
  const {
    messages,
    isTyping,
    distressLevel,
    sessionReady,
    sendMessage,
    addSystemMessage,
    clearChat
  } = useSahaayChat();

  // Get distress level info
  const distressInfo = getDistressLevelInfo(distressLevel);

  // Auto-scroll to bottom of messages
  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    // Check for crisis keywords
    if (checkForCrisisKeywords(input)) {
      setShowCrisisModal(true);
    }

    // Send message and clear input
    await sendMessage(input);
    setInput('');
  };

  const handleQuickReply = async (text) => {
    setInput(text);
    // Small delay to allow the input to update
    setTimeout(() => {
      document.getElementById('message-input')?.focus();
    }, 50);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      clearChat();
    }
  };

  const handleCrisisHelp = () => {
    setShowCrisisModal(true);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center mr-3">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-semibold">Manas Veda</h1>
            <p className="text-sm opacity-80">AI chat</p>
          </div>
          <div className="ml-auto flex items-center space-x-2">
            <span className="text-sm bg-white/20 px-2 py-1 rounded-full">
              {distressLevel <= 2 ? '😊 Calm' : distressLevel === 3 ? '😟 Stressed' : '😰 In Distress'}
            </span>
          </div>
        </div>
      </header>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {!sessionReady && (
          <div className="flex items-center justify-center py-12 text-gray-500 text-sm">
            Connecting…
          </div>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={getMessageStyle(message.sender)}>
              <div className="flex items-start">
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center mr-2 flex-shrink-0">
                    <Bot className="w-4 h-4 text-teal-600" />
                  </div>
                )}
                <div>
                  <p className="whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-60 mt-1">
                    {formatTime(message.timestamp)}
                  </p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ml-2 flex-shrink-0">
                    <User className="w-4 h-4 text-blue-600" />
                  </div>
                )}
              </div>

              {message.interventionType && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <span className="inline-flex items-center text-xs text-teal-600">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {message.interventionType === 'CBT' ? 'CBT' : 'DBT'} tip
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 p-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            <span className="text-sm text-gray-500 ml-2">Thinking…</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center bg-gray-50 rounded-full px-4 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-transparent border-none outline-none text-gray-800 placeholder-gray-400"
            disabled={isTyping || !sessionReady}
          />
          <button
            type="submit"
            disabled={!input.trim() || isTyping || !sessionReady}
            className="ml-2 p-2 rounded-full bg-teal-500 text-white hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Emergency Help */}
        <div className="mt-2 text-center">
          <p className="text-xs text-gray-500">
            In crisis? <button
              type="button"
              onClick={handleCrisisHelp}
              className="text-teal-600 hover:underline focus:outline-none"
            >
              Get emergency help
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default WellnessChat;
