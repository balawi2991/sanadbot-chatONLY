'use client';

import React from 'react';
import { MessageSquare, ArrowUp } from 'lucide-react';
import './styles.css';

interface BotConfig {
  name?: string;
  color?: string;
  logo?: string;
  avatar?: string;
  placeholder?: string;
  welcomeMessage?: string;
  personality?: string;
}

interface WidgetBarProps {
  onToggleModal: () => void;
  onOpenModal: () => void;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  config?: BotConfig;
}

const WidgetBar: React.FC<WidgetBarProps> = ({
  onToggleModal,
  onOpenModal,
  inputValue,
  onInputChange,
  onSendMessage,
  config
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSendMessage();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleBarClick = () => {
    onToggleModal();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange(value);
    
    // فتح المودال تلقائياً عند بدء الكتابة
    if (value.trim().length > 0) {
      onOpenModal();
    }
  };

  const handleInputFocus = () => {
    // فتح المودال تلقائياً عند التركيز على حقل الإدخال
    onOpenModal();
  };

  const primaryColor = config?.color || '#1e1e1e';
  const placeholder = config?.placeholder || 'اسألني أي شيء...';

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="widget-glow">
        <div 
            className="w-80 h-14 bg-[#1e1e1e] rounded-full shadow-2xl flex items-center px-4 gap-3 backdrop-blur-sm border border-white/10 cursor-pointer"
            onClick={handleBarClick}
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
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              onFocus={handleInputFocus}
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
  );
};

export default WidgetBar;