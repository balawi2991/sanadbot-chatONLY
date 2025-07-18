import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params

    if (!botId) {
      return new NextResponse(
        'console.error("SanadBot: Bot ID is required");',
        {
          status: 400,
          headers: {
            'Content-Type': 'application/javascript',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      )
    }

    // البحث عن البوت
    const bot = await prisma.bot.findUnique({
      where: {
        id: botId
      }
    })

    if (!bot || !bot.isActive) {
      return new NextResponse(
        'console.error("SanadBot: Bot not found or inactive");',
        {
          status: 404,
          headers: {
            'Content-Type': 'application/javascript',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      )
    }

    // إنشاء JavaScript bundle للبوت
    const widgetScript = generateWidgetScript(bot)

    return new NextResponse(widgetScript, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'public, max-age=300' // 5 minutes cache
      }
    })

  } catch (error) {
    console.error('Error generating widget:', error)
    return new NextResponse(
      'console.error("SanadBot: Server error");',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
}

function generateWidgetScript(bot: any) {
  const config = {
    id: bot.id,
    name: bot.name,
    color: bot.color,
    logo: bot.logo,
    avatar: bot.avatar,
    placeholder: bot.placeholder,
    welcomeMessage: bot.welcome,
    personality: bot.personality
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

  // إعدادات البوت
  const BOT_CONFIG = ${JSON.stringify(config)};
  const API_BASE = '${process.env.NEXTAUTH_URL || 'http://localhost:3002'}';

  // إضافة الأنماط المطلوبة
  const styles = \`
    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@200;300;400;500;700;800;900&display=swap');
    
    .sanadbot-widget {
      font-family: 'Tajawal', sans-serif;
      direction: rtl;
      text-align: right;
    }
    
    .sanadbot-widget * {
      box-sizing: border-box;
    }
    
    /* أنماط التوهج المتحرك */
    @keyframes sanadbot-border-flow {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes sanadbot-glow-pulse {
      0%, 100% { filter: blur(3px) brightness(1); }
      50% { filter: blur(4px) brightness(1.2); }
    }
    
    .sanadbot-widget-glow {
      position: relative;
    }
    
    .sanadbot-widget-glow::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 9999px;
      background: linear-gradient(90deg, #fbbf24 0%, #f472b6 33%, #a78bfa 66%, #fbbf24 100%);
      background-size: 300% 100%;
      animation: sanadbot-border-flow 8s linear infinite, sanadbot-glow-pulse 3s ease-in-out infinite;
      z-index: -1;
      opacity: 0.9;
    }
    
    .sanadbot-widget-glow::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 9999px;
      background: #1e1e1e;
      z-index: -1;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 8px rgba(251, 191, 36, 0.3), 0 0 12px rgba(244, 114, 182, 0.2);
    }
    
    /* أنماط مؤشر الكتابة */
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
    
    /* أنماط المودال */
    .sanadbot-modal-glow {
      position: relative;
    }
    
    .sanadbot-modal-glow::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 1rem;
      background: linear-gradient(90deg, #fbbf24 0%, #f472b6 33%, #a78bfa 66%, #fbbf24 100%);
      background-size: 300% 100%;
      animation: sanadbot-border-flow 8s linear infinite, sanadbot-glow-pulse 3s ease-in-out infinite;
      z-index: -1;
      opacity: 0.7;
    }
    
    .sanadbot-modal-glow::after {
      content: '';
      position: absolute;
      inset: -1px;
      border-radius: 1rem;
      background: linear-gradient(to bottom, #1e1e1e, #2a2a2a);
      z-index: -1;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 8px rgba(251, 191, 36, 0.3), 0 0 12px rgba(244, 114, 182, 0.2);
    }
  \`;
  
  // إضافة الأنماط للصفحة
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);

  // متغيرات الحالة
  let isModalOpen = false;
  let inputValue = '';
  let messages = [];
  let isTyping = false;
  let widgetContainer = null;
  let modalContainer = null;

  // إنشاء أيقونات SVG - مطابقة للتصميم الأصلي
  const icons = {
    message: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>',
    send: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>',
    close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
    bot: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2" ry="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>',
    user: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
    arrowUp: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"></path></svg>'
  };

  // إنشاء الشريط السفلي
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
      <div class="sanadbot-widget-glow">
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
              \${icons.message}
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
            oninput="SanadBot.updateInput(this.value)"
          />
          
          <!-- زر الإرسال -->
          <button 
            onclick="event.stopPropagation(); SanadBot.sendMessage()"
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
              position: relative;
              overflow: hidden;
              color: white;
            "
            onmouseover="this.style.transform = 'scale(1.05)'; this.querySelector('span').style.opacity = '1';"
            onmouseout="this.style.transform = 'scale(1)'; this.querySelector('span').style.opacity = '0';"
          >
            <span style="
              position: absolute;
              inset: 0;
              background: rgba(255, 255, 255, 0.1);
              opacity: 0;
              transition: opacity 0.3s;
              z-index: 1;
            "></span>
            <span style="position: relative; z-index: 2;">\${icons.arrowUp}</span>
          </button>
        </div>
      </div>
    \`;

    return container;
  }

  // إنشاء المودال
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
      <div class="sanadbot-modal-glow">
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
                    \${icons.bot}
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
                  ">\${BOT_CONFIG.name || 'مساعد سند'}</h3>
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
          <div id="sanadbot-messages" style="
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

  // إرسال رسالة - استخدام البيانات الخاصة بالعميل
  async function sendMessage() {
    if (!inputValue.trim()) return;

    const messageText = inputValue;
    inputValue = '';
    updateInputField();

    // إضافة رسالة المستخدم
    addMessage(messageText, 'user');
    
    // فتح المودال إذا لم يكن مفتوحاً
    if (!isModalOpen) {
      openModal();
    }

    // إظهار مؤشر الكتابة
    setTyping(true);

    try {
      // استخدام botId الخاص بالعميل لضمان الحصول على البيانات الصحيحة
      const response = await fetch(API_BASE + '/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          botId: BOT_CONFIG.id, // معرف البوت الخاص بالعميل
          clientId: 'widget-embed-' + BOT_CONFIG.id, // معرف فريد للعميل
          agentId: BOT_CONFIG.id // التأكد من استخدام معرف العميل
        })
      });

      if (response.ok) {
        const data = await response.json();
        addMessage(data.response, 'bot');
      } else {
        addMessage(BOT_CONFIG.welcomeMessage || 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.', 'bot');
      }
    } catch (error) {
      console.error('SanadBot: Error sending message:', error);
      addMessage(BOT_CONFIG.welcomeMessage || 'عذراً، حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.', 'bot');
    } finally {
      setTyping(false);
    }
  }

  // إضافة رسالة
  function addMessage(text, sender) {
    const message = {
      id: Date.now().toString(),
      text: text,
      sender: sender,
      timestamp: new Date()
    };
    
    messages.push(message);
    renderMessages();
  }

  // عرض الرسائل
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
            ? 'background: #2563eb; color: white; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);' 
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

  // إظهار/إخفاء مؤشر الكتابة
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

  // تحديث حقل الإدخال
  function updateInputField() {
    const input = widgetContainer?.querySelector('input');
    if (input) {
      input.value = inputValue;
    }
  }

  // فتح المودال
  function openModal() {
    if (isModalOpen) return;
    
    isModalOpen = true;
    modalContainer = createModal();
    document.body.appendChild(modalContainer);
    renderMessages();
  }

  // إغلاق المودال
  function closeModal() {
    if (!isModalOpen) return;
    
    isModalOpen = false;
    if (modalContainer) {
      document.body.removeChild(modalContainer);
      modalContainer = null;
    }
  }

  // تبديل المودال
  function toggleModal() {
    if (isModalOpen) {
      closeModal();
    } else {
      openModal();
    }
  }

  // معالجة ضغط المفاتيح
  function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  // تحديث قيمة الإدخال
  function updateInput(value) {
    inputValue = value;
  }

  // إنشاء الواجهة
  function init() {
    console.log('SanadBot: Initializing widget...');
    
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
    
    console.log('SanadBot: Widget initialization complete!');
  }

  // API عام
  window.SanadBot = {
    sendMessage: sendMessage,
    openModal: openModal,
    closeModal: closeModal,
    toggleModal: toggleModal,
    handleKeyPress: handleKeyPress,
    updateInput: updateInput,
    isOpen: function() { return isModalOpen; }
  };

  // تشغيل البوت
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
`;
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}