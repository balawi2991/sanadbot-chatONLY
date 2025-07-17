'use client';

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import WidgetBar from './WidgetBar';
import WidgetExpanded from './WidgetExpanded';

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

interface ChatWidgetProps {
  botId?: string;
  config?: BotConfig;
  isEmbedded?: boolean;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ botId, config, isEmbedded = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(isEmbedded);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  // التحقق من وجود البوت في iframe (للتضمين)
  const isInIframe = typeof window !== 'undefined' && window.parent !== window;

  const handleToggleModal = () => {
    if (isInIframe && isModalOpen) {
      // في حالة التضمين، إرسال رسالة إغلاق للصفحة الأساسية
      window.parent.postMessage('sanadbot-close', '*');
    } else {
      setIsModalOpen(!isModalOpen);
    }
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

    // فتح المودال إذا لم يكن مفتوحاً (إلا في حالة التضمين)
    if (!isModalOpen && !isEmbedded) {
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
          botId: botId || 'demo', // استخدام botId المرسل أو demo للمعاينة
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
        // رد احتياطي في حالة الخطأ
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
      // رد احتياطي في حالة الخطأ
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

  // في حالة التضمين، عرض المحادثة مباشرة بدون شريط
  if (isEmbedded) {
    return (
      <WidgetExpanded
        onClose={() => {}} // لا حاجة للإغلاق في التضمين
        messages={messages}
        isTyping={isTyping}
        config={config}
        isEmbedded={true}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
      />
    );
  }

  return (
    <>
      {/* الشريط السفلي - ثابت دائماً */}
      <WidgetBar
        onToggleModal={handleToggleModal}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onSendMessage={handleSendMessage}
        config={config}
      />
      
      {/* المودال - يظهر فوق الشريط */}
      <AnimatePresence>
        {isModalOpen && (
          <WidgetExpanded
            onClose={handleToggleModal}
            messages={messages}
            isTyping={isTyping}
            config={config}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;