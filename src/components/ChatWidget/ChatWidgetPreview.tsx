'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WidgetExpanded from './WidgetExpanded';
import { MessageSquare, ArrowUp, X, User } from 'lucide-react';
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
  glowEffect?: boolean;
}

interface ChatWidgetPreviewProps {
  botId?: string;
  config?: BotConfig;
}

const ChatWidgetPreview: React.FC<ChatWidgetPreviewProps> = ({ botId, config }) => {
  const [isModalOpen, setIsModalOpen] = useState(true); // مفتوح تلقائياً للمعاينة
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // إضافة رسالة المستخدم
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    const currentMessage = inputValue;
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // فتح المودال إذا لم يكن مفتوحاً
    if (!isModalOpen) {
      setIsModalOpen(true);
    }

    try {
      // إرسال الرسالة إلى API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentMessage,
          botId: botId || 'demo',
          clientId: 'widget-preview'
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: config?.welcomeMessage || 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: config?.welcomeMessage || 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      handleSendMessage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const primaryColor = config?.color || '#1e1e1e';
  const placeholder = config?.placeholder || 'اسألني أي شيء...';

  return (
    <div className="w-[650px] h-[700px] bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
      {/* رأس المتصفح الوهمي */}
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-3 flex items-center space-x-2">
        {/* أزرار التحكم */}
        <div className="flex space-x-2">
          <div className="w-3 h-3 bg-red-400 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
        </div>
        {/* شريط العنوان */}
        <div className="flex-1 bg-white rounded-md px-3 py-1 text-sm text-gray-600 border border-gray-300 mr-4">
          🔒 https://client-site.com
        </div>
      </div>
      
      {/* محتوى الموقع الوهمي */}
      <div className="relative h-full bg-gradient-to-br from-gray-50 to-gray-100" style={{ height: 'calc(100% - 60px)' }}>
        {/* محتوى الصفحة الوهمي */}
        <div className="p-8 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-5/6"></div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
            <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-4/5 mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-3/4"></div>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
            <div className="h-3 bg-gray-100 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
          </div>
        </div>
        
        {/* البوت مع تصغير بسيط */}
        <div className="absolute inset-0 transform scale-85 origin-bottom-right">
          {/* شريط البوت في الأسفل - تحت المودال */}
          <div className="absolute bottom-6 left-8 z-10">
            <div className={config?.glowEffect !== false ? "widget-glow" : ""}>
              <div 
                className="w-80 h-14 bg-[#1e1e1e] rounded-full shadow-2xl flex items-center px-4 gap-3 backdrop-blur-sm border border-white/10 cursor-pointer"
                onClick={handleToggleModal}
              >
                {/* أيقونة الرسالة على اليمين */}
                <div className="flex-shrink-0 p-1 rounded-full">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <MessageSquare className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* حقل الإدخال في المنتصف */}
                <form onSubmit={handleSubmit} className="flex-1" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => handleInputChange(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={placeholder}
                    className="w-full bg-transparent border-none outline-none text-white placeholder-gray-400 font-medium text-sm selection:bg-white/20"
                    style={{ fontFamily: 'Tajawal, sans-serif' }}
                  />
                </form>
                
                {/* زر الإرسال على اليسار */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubmit(e);
                  }}
                  disabled={!inputValue.trim()}
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-lg relative overflow-hidden"
                  style={{ backgroundColor: primaryColor }}
                >
                  <span className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  <ArrowUp className="w-4 h-4 text-white relative z-10" />
                </button>
              </div>
            </div>
          </div>
          
          {/* المودال - يظهر فوق الشريط داخل الحاوية */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="absolute bottom-24 left-8 z-20">
                <div className="relative">
                  <div className="bg-gradient-to-br from-[#1e1e1e] via-[#2a2a2a] to-[#1e1e1e] rounded-2xl shadow-2xl border border-white/10 overflow-hidden backdrop-blur-sm w-96">
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
                              <MessageSquare className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-[#1e1e1e] animate-pulse"></div>
                          </div>
                          
                          {/* العنوان */}
                          <div>
                            <h3 className="font-bold text-lg text-white" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              {config?.name || 'المساعد الذكي'}
                            </h3>
                            <p className="text-gray-300 text-sm" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                              متصل الآن
                            </p>
                          </div>
                        </div>
                        
                        {/* زر الإغلاق */}
                        <button
                          onClick={handleToggleModal}
                          className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors duration-200"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* منطقة المحادثة */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-transparent to-black/5">
                      {messages.length === 0 ? (
                        <div className="text-center text-gray-400 mt-8">
                          <div 
                            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                            style={{ backgroundColor: `${primaryColor}20` }}
                          >
                            <MessageSquare className="w-8 h-8 text-gray-300" />
                          </div>
                          <p className="text-lg font-medium" style={{ fontFamily: 'Tajawal, sans-serif' }}>
                            {config?.welcomeMessage || 'مرحباً! كيف يمكنني مساعدتك؟'}
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
                                <MessageSquare className="w-4 h-4 text-white" />
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
                            <MessageSquare className="w-4 h-4 text-white" />
                          </div>
                          <div className="bg-white/10 px-4 py-3 rounded-2xl border border-white/20 backdrop-blur-sm">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ChatWidgetPreview;