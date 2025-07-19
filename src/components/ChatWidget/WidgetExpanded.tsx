'use client';

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, User, Bot } from 'lucide-react';
import './styles.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface BotConfig {
  name?: string;
  color?: string;
  logo?: string;
  avatar?: string;
  placeholder?: string;
  welcomeMessage?: string;
  personality?: string;
}

interface WidgetExpandedProps {
  onClose: () => void;
  messages: Message[];
  isTyping: boolean;
  config?: BotConfig;
  isEmbedded?: boolean;
  inputValue?: string;
  onInputChange?: (value: string) => void;
  onSendMessage?: () => void;
}

const WidgetExpanded: React.FC<WidgetExpandedProps> = ({
  onClose,
  messages,
  isTyping,
  config,
  isEmbedded = false,
  inputValue = '',
  onInputChange,
  onSendMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const botName = config?.name || 'مساعد سند';
  const primaryColor = config?.color || '#1e1e1e';
  const welcomeMessage = config?.welcomeMessage || 'مرحباً بك!';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage?.();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage?.();
  };

  // في حالة التضمين، عرض المحادثة بملء الشاشة
  if (isEmbedded) {
    return (
      <div className="h-screen flex flex-col bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e]">
        {/* الهيدر */}
        <div className="bg-gradient-to-r from-gray-600/20 via-gray-500/20 to-gray-600/20 p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {/* صورة المساعد مع النقطة الخضراء */}
            <div className="relative">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ backgroundColor: primaryColor }}
              >
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1e1e1e] animate-pulse"></div>
            </div>
            
            {/* العنوان */}
            <div>
              <h3 className="font-bold text-lg text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {botName}
              </h3>
              <p className="text-gray-300 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                متصل الآن
              </p>
            </div>
          </div>
        </div>
        
        {/* منطقة المحادثة */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/5 chat-scroll-area">
          {messages.length === 0 ? (
            <div className="text-center text-gray-400 mt-8">
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${primaryColor}20` }}
              >
                <Bot className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-lg font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                {welcomeMessage}
              </p>
              <p className="text-sm mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                اكتب رسالتك أدناه لبدء المحادثة
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white/10 text-white border border-white/20 backdrop-blur-sm'
                  }`}
                >
                  <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {message.text}
                  </p>
                </div>
                
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 border border-white/30">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {/* مؤشر الكتابة */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 backdrop-blur-sm">
                <div className="typing-indicator">
                  <div 
                    className="typing-dot"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div 
                    className="typing-dot"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <div 
                    className="typing-dot"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        {/* حقل الإدخال */}
        <div className="p-4 border-t border-white/10">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={config?.placeholder || 'اكتب رسالتك هنا...'}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              style={{ fontFamily: 'Tajawal, sans-serif' }}
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="px-6 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                backgroundColor: primaryColor,
                color: 'white'
              }}
            >
              إرسال
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* خلفية شفافة */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* المودال */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-96 max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)]"
      >
        <div className="modal-glow">
          <div className="bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-sm">
            {/* الهيدر */}
            <div className="bg-gradient-to-r from-gray-600/20 via-gray-500/20 to-gray-600/20 p-4 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* صورة المساعد مع النقطة الخضراء */}
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <Bot className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1e1e1e] animate-pulse"></div>
                  </div>
                  
                  {/* العنوان */}
                  <div>
                    <h3 className="font-bold text-lg text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      {botName}
                    </h3>
                    <p className="text-gray-300 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                      متصل الآن
                    </p>
                  </div>
                </div>
                
                {/* زر الإغلاق */}
                <button
                  onClick={onClose}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
            
            {/* منطقة المحادثة */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/5 chat-scroll-area">
              {messages.length === 0 ? (
                <div className="text-center text-gray-400 mt-8">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                    style={{ backgroundColor: `${primaryColor}20` }}
                  >
                    <Bot className="w-8 h-8 text-gray-300" />
                  </div>
                  <p className="text-lg font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    {welcomeMessage}
                  </p>
                  <p className="text-sm mt-2" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                    ابدأ المحادثة من الشريط أدناه
                  </p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.sender === 'bot' && (
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: primaryColor }}
                      >
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    
                    <div
                      className={`max-w-xs px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white shadow-lg'
                          : 'bg-white/10 text-white border border-white/20 backdrop-blur-sm'
                      }`}
                    >
                      <p style={{ fontFamily: 'Tajawal, sans-serif' }}>
                        {message.text}
                      </p>
                    </div>
                    
                    {message.sender === 'user' && (
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0 border border-white/30">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))
              )}
              
              {/* مؤشر الكتابة */}
              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 backdrop-blur-sm">
                    <div className="typing-indicator">
                      <div 
                        className="typing-dot"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <div 
                        className="typing-dot"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                      <div 
                        className="typing-dot"
                        style={{ backgroundColor: primaryColor }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default WidgetExpanded;