'use client';

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import WidgetBar from './widgetbar';
import WidgetExpanded from './widgetexpanded';
import { widgetCore, BotConfig, Message, createClientId } from '@/lib/widget-core';

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
  const [botConfig, setBotConfig] = useState<BotConfig | null>(config || null);
  const [clientId] = useState(() => createClientId(botId || 'demo', 'react'));

  // التحقق من وجود البوت في iframe (للتضمين)
  const isInIframe = typeof window !== 'undefined' && window.parent !== window;

  // تحميل إعدادات البوت عند التحميل
  useEffect(() => {
    if (botId && !config) {
      widgetCore.loadBotConfig(botId).then(loadedConfig => {
        if (loadedConfig) {
          setBotConfig(loadedConfig);
        }
      });
    }
  }, [botId, config]);

  const handleToggleModal = () => {
    if (isInIframe && isModalOpen) {
      // في حالة التضمين، إرسال رسالة إغلاق للصفحة الأساسية
      window.parent.postMessage('sanadbot-close', '*');
    } else {
      setIsModalOpen(!isModalOpen);
    }
  };

  const handleOpenModal = () => {
    if (!isModalOpen) {
      setIsModalOpen(true);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = widgetCore.createMessage(inputValue, 'user');
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // فتح المودال إذا لم يكن مفتوحاً (إلا في حالة التضمين)
    if (!isModalOpen && !isEmbedded) {
      setIsModalOpen(true);
    }

    try {
      const response = await widgetCore.sendMessage(
        inputValue,
        botId || 'demo',
        clientId
      );
      
      const botMessage = widgetCore.createMessage(
        response.response || 'عذراً، لم أتمكن من فهم رسالتك.',
        'bot'
      );

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('خطأ في إرسال الرسالة:', error);
      const errorMessage = widgetCore.createMessage(
        'عذراً، حدث خطأ في إرسال الرسالة. يرجى المحاولة مرة أخرى.',
        'bot'
      );
      setMessages(prev => [...prev, errorMessage]);
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
        config={botConfig || config}
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
          onOpenModal={handleOpenModal}
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onSendMessage={handleSendMessage}
          config={botConfig || config}
        />
      
      {/* المودال - يظهر فوق الشريط */}
      <AnimatePresence>
        {isModalOpen && (
          <WidgetExpanded
            onClose={handleToggleModal}
            messages={messages}
            isTyping={isTyping}
            config={botConfig || config}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatWidget;