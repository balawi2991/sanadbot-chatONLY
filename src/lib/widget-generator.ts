/**
 * مولد الويدجت الموحد
 * ينشئ JavaScript bundle للتضمين باستخدام نفس منطق ChatWidget
 */

import { BotConfig } from './widget-core'

// أنماط CSS المشتركة
const WIDGET_STYLES = `
.sanadbot-widget {
  font-family: 'Tajawal', sans-serif;
  direction: rtl;
  text-align: right;
}

.sanadbot-widget * {
  box-sizing: border-box;
}

/* أنماط التوهج المتحرك - مطابقة للتصميم الأصلي */
@keyframes sanadbot-strokeGlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}

@keyframes sanadbot-strokePulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}

.sanadbot-widget-glow {
  position: relative;
  z-index: 1;
}

.sanadbot-widget-glow::before {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 9999px;
          background: linear-gradient(270deg, #ff00cc, #3333ff, #00ffff, #ff00cc);
          background-size: 300% 300%;
          animation: sanadbot-strokeGlow 5s linear infinite, sanadbot-strokePulse 3s ease-in-out infinite;
          z-index: -1;
          filter: blur(1px);
        }
        
        .sanadbot-widget-glow::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: #1e1e1e;
          z-index: -1;
        }

/* أنماط شريط التمرير للبوت */
.chat-scroll-area::-webkit-scrollbar {
  width: 6px;
}

.chat-scroll-area::-webkit-scrollbar-thumb {
  background-color: rgba(100, 116, 139, 0.4);
  border-radius: 6px;
}

.chat-scroll-area::-webkit-scrollbar-track {
  background: transparent;
}

/* أنماط مؤشر الكتابة - مطابقة للتصميم الأصلي */
@keyframes sanadbot-typing-dots {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}

.sanadbot-typing-indicator {
  display: flex;
  gap: 4px;
  align-items: center;
}

.sanadbot-typing-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #6b7280;
  animation: sanadbot-typing-dots 1.4s infinite ease-in-out;
}

.sanadbot-typing-dot:nth-child(1) { animation-delay: -0.32s; }
.sanadbot-typing-dot:nth-child(2) { animation-delay: -0.16s; }
.sanadbot-typing-dot:nth-child(3) { animation-delay: 0; }

/* أنماط المودال - مطابقة للتصميم الأصلي */
.sanadbot-modal-glow {
  position: relative;
  z-index: 1;
}

.sanadbot-modal-glow::before {
          content: "";
          position: absolute;
          inset: -3px;
          border-radius: 1rem;
          background: linear-gradient(270deg, #ff00cc, #3333ff, #00ffff, #ff00cc);
          background-size: 300% 300%;
          animation: sanadbot-strokeGlow 5s linear infinite, sanadbot-strokePulse 3s ease-in-out infinite;
          z-index: -1;
          filter: blur(1px);
        }
        
        .sanadbot-modal-glow::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: 1rem;
          background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 50%, #1e1e1e 100%);
          z-index: -1;
        }

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* تنسيق placeholder مطابق للنسخة الأصلية */
.sanadbot-widget input::placeholder {
  color: #9ca3af;
  opacity: 1;
}

.sanadbot-widget input::-webkit-input-placeholder {
  color: #9ca3af;
}

.sanadbot-widget input::-moz-placeholder {
  color: #9ca3af;
  opacity: 1;
}

.sanadbot-widget input:-ms-input-placeholder {
  color: #9ca3af;
}

.sanadbot-widget input::-ms-input-placeholder {
  color: #9ca3af;
}
`

// أيقونات SVG - مطابقة تماماً للتصميم الأصلي (Lucide React)
const WIDGET_ICONS = {
  message: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
  arrowUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>',
  close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  bot: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>',
  user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
}

/**
 * إنشاء JavaScript bundle للويدجت
 */
export function generateWidgetScript(bot: BotConfig, apiBaseUrl: string): string {
  const config = {
    id: bot.id,
    name: bot.name,
    color: bot.color,
    logo: bot.logo,
    avatar: bot.avatar,
    placeholder: bot.placeholder,
    welcomeMessage: bot.welcomeMessage,
    personality: bot.personality,
    glowEffect: bot.glowEffect
  }

  return `
(function() {
  'use strict';
  
  // منع التحميل المتكرر للـ widget script
  if (window.SanadBotWidgetLoaded || window.SanadBot) {
    console.warn('SanadBot: Widget script already loaded');
    return;
  }
  window.SanadBotWidgetLoaded = true;
  
  console.log('SanadBot: Widget script loaded, initializing...');

  // إعدادات البوت الأولية - سيتم تحديثها ديناميكياً
  let BOT_CONFIG = ${JSON.stringify(config)};
  const API_BASE = '${apiBaseUrl}';
  
  // آلية التحديث الديناميكي للتخصيصات
  async function updateBotTheme() {
    try {
      const response = await fetch(\`\${API_BASE}/api/agents/\${BOT_CONFIG.id}/theme\`, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (response.ok) {
        const freshTheme = await response.json();
        // تحديث BOT_CONFIG بالبيانات الجديدة
        BOT_CONFIG = { ...BOT_CONFIG, ...freshTheme };
        console.log('SanadBot: Theme updated successfully', BOT_CONFIG);
        
        // تحديث العناصر المرئية إذا كانت موجودة
        updateVisualElements();
        return true;
      }
    } catch (error) {
      console.warn('SanadBot: Failed to update theme, using cached version', error);
    }
    return false;
  }
  
  // تحديث العناصر المرئية بالتخصيصات الجديدة
  function updateVisualElements() {
    if (!widgetContainer || !modalContainer) return;
    
    // تحديث لون الأيقونة الرئيسية
    const messageIcon = widgetContainer.querySelector('.sanadbot-message-icon');
    if (messageIcon) {
      messageIcon.style.backgroundColor = BOT_CONFIG.color || '#1e1e1e';
    }
    
    // تحديث placeholder النص
    const input = modalContainer.querySelector('input');
    if (input) {
      input.placeholder = BOT_CONFIG.placeholder || 'اسألني أي شيء...';
    }
    
    // تحديث لون زر الإرسال
    const sendButton = modalContainer.querySelector('.sanadbot-send-button');
    if (sendButton) {
      sendButton.style.backgroundColor = BOT_CONFIG.color || '#1e1e1e';
    }
    
    // تحديث اسم البوت في الرأس
    const botName = modalContainer.querySelector('.sanadbot-bot-name');
    if (botName) {
      botName.textContent = BOT_CONFIG.name || 'مساعد سند';
    }
    
    // تحديث رسالة الترحيب
    const welcomeMsg = modalContainer.querySelector('.sanadbot-welcome-message');
    if (welcomeMsg) {
      welcomeMsg.textContent = BOT_CONFIG.welcomeMessage || 'مرحباً! كيف يمكنني مساعدتك اليوم؟';
    }
  }

  // إضافة الأنماط المطلوبة
  const styles = \`${WIDGET_STYLES}\`;
  
  // إضافة الأنماط للصفحة
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // متغيرات الحالة - مطابقة لـ ChatWidget
  let isModalOpen = false;
  let inputValue = '';
  let messages = [];
  let isTyping = false;
  let widgetContainer = null;
  let modalContainer = null;
  let clientId = 'embed-' + BOT_CONFIG.id + '-' + Date.now() + '-' + Math.random().toString(36).substring(2);

  // إنشاء أيقونات SVG - مطابقة للتصميم الأصلي
  const icons = ${JSON.stringify(WIDGET_ICONS)};

  // إنشاء الشريط السفلي - مطابق لـ WidgetBar
  function createWidgetBar() {
    const container = document.createElement('div');
    container.className = 'sanadbot-widget';
    container.style.cssText = \`
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 999998;
    \`;

    container.innerHTML = \`
      <div class="\${BOT_CONFIG.glowEffect !== false ? 'sanadbot-widget-glow' : ''}">
        <div style="
          width: 320px;
          height: 56px;
          background: #1e1e1e;
          border-radius: 9999px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 12px;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
        " onclick="SanadBot.toggleModal()">
          
          <!-- أيقونة الرسالة -->
          <div style="flex-shrink: 0; padding: 4px; border-radius: 9999px;">
            <div style="
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: \${BOT_CONFIG.color || '#1e1e1e'};
            ">
              \$\{icons.message\}
            </div>
          </div>
          
          <!-- حقل الإدخال -->
          <input 
            type="text" 
            placeholder="\${BOT_CONFIG.placeholder || 'اسألني أي شيء...'}"
            style="
              flex: 1;
              background: transparent;
              border: none;
              outline: none;
              color: white;
              font-family: 'Tajawal', sans-serif;
              font-size: 14px;
              font-weight: 500;
            "
            onclick="event.stopPropagation()"
            onkeypress="SanadBot.handleKeyPress(event)"
            oninput="SanadBot.handleInputChange(this.value)"
            onfocus="SanadBot.handleInputFocus()"
          />
          
          <!-- زر الإرسال -->
          <button 
            id="sanadbot-send-btn"
            onclick="event.stopPropagation(); SanadBot.sendMessage()"
            disabled
            style="
              flex-shrink: 0;
              width: 32px;
              height: 32px;
              border-radius: 9999px;
              display: flex;
              align-items: center;
              justify-content: center;
              background-color: \${BOT_CONFIG.color || '#1e1e1e'};
              border: none;
              cursor: pointer;
              transition: all 0.2s;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
              color: white;
              opacity: 0.5;
              position: relative;
              overflow: hidden;
            "
            onmouseover="if (!this.disabled) { this.style.transform = 'scale(1.05)'; this.style.opacity = '1'; const overlay = this.querySelector('.hover-overlay'); if (overlay) overlay.style.opacity = '1'; }"
            onmouseout="if (!this.disabled) { this.style.transform = 'scale(1)'; this.style.opacity = '0.5'; const overlay = this.querySelector('.hover-overlay'); if (overlay) overlay.style.opacity = '0'; }"
          >
            <span class="hover-overlay" style="
              position: absolute;
              inset: 0;
              background: rgba(255, 255, 255, 0.1);
              opacity: 0;
              transition: opacity 0.3s;
            "></span>
            <span style="position: relative; z-index: 10;">\${icons.arrowUp}</span>
          </button>
        </div>
      </div>
    \`;

    return container;
  }

  // إنشاء المودال - مطابق لـ WidgetExpanded
  function createModal() {
    const overlay = document.createElement('div');
    overlay.className = 'sanadbot-widget';
    overlay.style.cssText = \`
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(4px);
      z-index: 999997;
      display: flex;
      align-items: center;
      justify-content: center;
    \`;
    overlay.onclick = () => SanadBot.closeModal();

    const modal = document.createElement('div');
    modal.onclick = (e) => e.stopPropagation();
    modal.style.cssText = \`
      width: 384px;
      max-width: calc(100vw - 2rem);
      max-height: calc(100vh - 8rem);
    \`;

    modal.innerHTML = \`
      <div class="\${BOT_CONFIG.glowEffect !== false ? 'sanadbot-modal-glow' : ''}">
        <div style="
          background: linear-gradient(135deg, #1e1e1e 0%, #2a2a2a 50%, #1e1e1e 100%);
          border-radius: 1rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          backdrop-filter: blur(4px);
        ">
          <!-- الهيدر -->
          <div style="
            background: linear-gradient(90deg, rgba(107, 114, 128, 0.2) 0%, rgba(107, 114, 128, 0.2) 50%, rgba(107, 114, 128, 0.2) 100%);
            padding: 16px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          ">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <!-- صورة المساعد -->
                <div style="position: relative;">
                  <div style="
                    width: 40px;
                    height: 40px;
                    border-radius: 9999px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: \${BOT_CONFIG.color || '#1e1e1e'};
                  ">
                    \$\{icons.bot\}
                  </div>
                  <div style="
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    width: 16px;
                    height: 16px;
                    background: #10b981;
                    border-radius: 9999px;
                    border: 2px solid #1e1e1e;
                    animation: pulse 2s infinite;
                  "></div>
                </div>
                
                <!-- العنوان -->
                <div>
                  <h3 style="
                    font-family: 'Tajawal', sans-serif;
                    font-weight: bold;
                    font-size: 18px;
                    color: white;
                    margin: 0;
                  ">\$\{BOT_CONFIG.name || 'مساعد سند'\}</h3>
                  <p style="
                    font-family: 'Tajawal', sans-serif;
                    color: #d1d5db;
                    font-size: 14px;
                    margin: 0;
                  ">متصل الآن</p>
                </div>
              </div>
              
              <!-- زر الإغلاق -->
              <button onclick="SanadBot.closeModal()" style="
                width: 32px;
                height: 32px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 9999px;
                display: flex;
                align-items: center;
                justify-content: center;
                border: none;
                cursor: pointer;
                transition: background-color 0.2s;
                color: white;
              " onmouseover="this.style.background = 'rgba(255, 255, 255, 0.2)'" onmouseout="this.style.background = 'rgba(255, 255, 255, 0.1)'">
                \${icons.close}
              </button>
            </div>
          </div>
          
          <!-- منطقة المحادثة -->
          <div id="sanadbot-messages" class="chat-scroll-area" style="
            height: 384px;
            overflow-y: auto;
            padding: 16px;
            background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.05));
          ">
            <div id="sanadbot-welcome" style="
              text-align: center;
              color: #9ca3af;
              margin-top: 32px;
            ">
              <div style="
                width: 64px;
                height: 64px;
                border-radius: 9999px;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 16px;
                background-color: \${(BOT_CONFIG.color || '#1e1e1e') + '20'};
              ">
                \${icons.bot}
              </div>
              <p style="
                font-family: 'Tajawal', sans-serif;
                font-size: 18px;
                font-weight: 500;
                margin: 0 0 8px 0;
              ">\${BOT_CONFIG.welcomeMessage || 'مرحباً بك!'}</p>
              <p style="
                font-family: 'Tajawal', sans-serif;
                font-size: 14px;
                margin: 0;
              ">ابدأ المحادثة من الشريط أدناه</p>
            </div>
          </div>
        </div>
      </div>
    \`;

    overlay.appendChild(modal);
    return overlay;
  }

  // إرسال رسالة - استخدام نفس API المستخدم في ChatWidget
  async function sendMessage() {
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    inputValue = '';
    updateInputField();
    updateInput(''); // تحديث حالة زر الإرسال

    // إضافة رسالة المستخدم
    addMessage(messageText, 'user');
    
    // فتح المودال إذا لم يكن مفتوحاً
    if (!isModalOpen) {
      openModal();
    }

    // إظهار مؤشر الكتابة
    setTyping(true);

    try {
      // استخدام نفس API endpoint المستخدم في ChatWidget
      const response = await fetch(API_BASE + '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          botId: BOT_CONFIG.id,
          clientId: clientId
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.response, 'bot');
      } else {
        addMessage('عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 'bot');
      }
    } catch (error) {
      console.error('SanadBot: Error sending message:', error);
      addMessage('عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', 'bot');
    } finally {
      setTyping(false);
    }
  }

  // إضافة رسالة - مطابق لمنطق ChatWidget
  function addMessage(text, sender) {
    const message = {
      id: Date.now().toString() + Math.random().toString(36).substring(2),
      text: text,
      sender: sender,
      timestamp: new Date()
    };
    
    messages.push(message);
    renderMessages();
  }

  // عرض الرسائل - مطابق لتصميم WidgetExpanded
  function renderMessages() {
    const messagesContainer = document.getElementById('sanadbot-messages');
    if (!messagesContainer) return;

    const welcomeDiv = document.getElementById('sanadbot-welcome');
    if (welcomeDiv && messages.length > 0) {
      welcomeDiv.style.display = 'none';
    }

    // إضافة الرسائل الجديدة فقط
    messages.forEach(message => {
      if (document.getElementById('sanadbot-msg-' + message.id)) return;

      const messageDiv = document.createElement('div');
      messageDiv.id = 'sanadbot-msg-' + message.id;
      messageDiv.style.cssText = \`
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        \${message.sender === 'user' ? 'justify-content: flex-end;' : 'justify-content: flex-start;'}
      \`;

      messageDiv.innerHTML = \`
        \${message.sender === 'bot' ? \`
          <div style="
            width: 32px;
            height: 32px;
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background-color: \${BOT_CONFIG.color || '#1e1e1e'};
          ">
            \${icons.bot}
          </div>
        \` : ''}
        
        <div style="
          max-width: 240px;
          padding: 12px 16px;
          border-radius: 1rem;
          \${message.sender === 'user' 
            ? 'background: ' + (BOT_CONFIG.color || '#dc2626') + '; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);' 
            : 'background: rgba(255, 255, 255, 0.1); color: white; border: 1px solid rgba(255, 255, 255, 0.2); backdrop-filter: blur(4px);'
          }
        ">
          <p style="
            font-family: 'Tajawal', sans-serif;
            margin: 0;
            line-height: 1.5;
          ">\${message.text}</p>
        </div>
        
        \${message.sender === 'user' ? \`
          <div style="
            width: 32px;
            height: 32px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            border: 1px solid rgba(255, 255, 255, 0.3);
          ">
            \${icons.user}
          </div>
        \` : ''}
      \`;

      messagesContainer.appendChild(messageDiv);
    });

    // التمرير للأسفل
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // إظهار/إخفاء مؤشر الكتابة - مطابق للتصميم الأصلي
  function setTyping(typing) {
    isTyping = typing;
    const messagesContainer = document.getElementById('sanadbot-messages');
    if (!messagesContainer) return;

    const existingTyping = document.getElementById('sanadbot-typing');
    if (existingTyping) {
      existingTyping.remove();
    }

    if (typing) {
      const typingDiv = document.createElement('div');
      typingDiv.id = 'sanadbot-typing';
      typingDiv.style.cssText = \`
        display: flex;
        gap: 12px;
        margin-bottom: 16px;
        justify-content: flex-start;
      \`;

      typingDiv.innerHTML = \`
        <div style="
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          background-color: \${BOT_CONFIG.color || '#1e1e1e'};
        ">
          \${icons.bot}
        </div>
        <div style="
          background: rgba(255, 255, 255, 0.1);
          padding: 12px 16px;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(4px);
        ">
          <div class="sanadbot-typing-indicator">
            <div class="sanadbot-typing-dot" style="background-color: \${BOT_CONFIG.color || '#6b7280'};"></div>
            <div class="sanadbot-typing-dot" style="background-color: \${BOT_CONFIG.color || '#6b7280'};"></div>
            <div class="sanadbot-typing-dot" style="background-color: \${BOT_CONFIG.color || '#6b7280'};"></div>
          </div>
        </div>
      \`;

      messagesContainer.appendChild(typingDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }

  // باقي الدوال المساعدة
  function updateInputField() {
    const input = widgetContainer?.querySelector('input');
    if (input) {
      input.value = inputValue;
    }
  }

  async function openModal() {
    if (isModalOpen) return;
    
    // تحديث التخصيصات عند فتح المودال
    await updateBotTheme();
    
    isModalOpen = true;
    modalContainer = createModal();
    document.body.appendChild(modalContainer);
    renderMessages();
  }

  function closeModal() {
    if (!isModalOpen) return;
    
    isModalOpen = false;
    if (modalContainer) {
      document.body.removeChild(modalContainer);
      modalContainer = null;
    }
  }

  function toggleModal() {
    if (isModalOpen) {
      closeModal();
    } else {
      openModal();
    }
  }

  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  function updateInput(value) {
    inputValue = value;
    
    // تحديث حالة زر الإرسال - مطابق للبوت الأساسي
    const sendButton = document.getElementById('sanadbot-send-btn');
    if (sendButton) {
      const hasText = value.trim().length > 0;
      sendButton.disabled = !hasText;
      sendButton.style.opacity = hasText ? '1' : '0.5';
      sendButton.style.cursor = hasText ? 'pointer' : 'not-allowed';
      
      // إعادة تعيين التحويل عند التعطيل
      if (!hasText) {
        sendButton.style.transform = 'scale(1)';
        const overlay = sendButton.querySelector('.hover-overlay');
        if (overlay) overlay.style.opacity = '0';
      }
    }
  }

  // دالة جديدة للتعامل مع تغيير النص وفتح المودال تلقائياً
  function handleInputChange(value) {
    updateInput(value);
    
    // فتح المودال تلقائياً عند بدء الكتابة
    if (value.trim().length > 0 && !isModalOpen) {
      openModal();
    }
  }

  // دالة جديدة للتعامل مع التركيز على حقل الإدخال
  function handleInputFocus() {
    // فتح المودال تلقائياً عند التركيز على حقل الإدخال
    if (!isModalOpen) {
      openModal();
    }
  }

  // إنشاء الواجهة
  async function init() {
    console.log('SanadBot: Initializing widget...');
    
    // تحديث التخصيصات فور التحميل
    await updateBotTheme();
    
    // إنشاء الشريط السفلي
    widgetContainer = createWidgetBar();
    document.body.appendChild(widgetContainer);
    
    console.log('SanadBot: Widget bar created and added to DOM');

    // إضافة مستمع لمفتاح Escape
    document.addEventListener('keydown', function(event) {
      if (event.key === 'Escape' && isModalOpen) {
        closeModal();
      }
    });
    
    // آلية SWR للتحديث الدوري (كل 30 ثانية)
    setInterval(async () => {
      if (document.visibilityState === 'visible') {
        await updateBotTheme();
      }
    }, 30000); // 30 ثانية
    
    // تحديث عند عودة التركيز للصفحة
    document.addEventListener('visibilitychange', async () => {
      if (document.visibilityState === 'visible') {
        await updateBotTheme();
      }
    });
    
    console.log('SanadBot: Widget initialization complete!');
  }

  // API عام - مطابق لـ ChatWidget مع إضافات التحديث الديناميكي
  window.SanadBot = {
    sendMessage: sendMessage,
    openModal: openModal,
    closeModal: closeModal,
    toggleModal: toggleModal,
    handleKeyPress: handleKeyPress,
    updateInput: updateInput,
    handleInputChange: handleInputChange,
    handleInputFocus: handleInputFocus,
    isOpen: function() { return isModalOpen; },
    config: BOT_CONFIG,
    version: '2.1.0',
    // دوال جديدة للتحديث الديناميكي
    refreshTheme: updateBotTheme,
    getCurrentConfig: function() { return { ...BOT_CONFIG }; },
    updateVisualElements: updateVisualElements
  };

  // تشغيل البوت
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
`
}