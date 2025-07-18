# دليل التضمين الشامل - Complete Embedding Guide

## نظرة عامة
هذا الدليل يشرح بالتفصيل كيفية عمل نظام تضمين بوت سند، وكيفية ضمان التطابق الكامل بين البوت في لوحة التحكم والبوت المضمن في المواقع الخارجية.

## 1. هيكل النظام - System Architecture

### المكونات الأساسية
```
Sanad Bot Embedding System
├── Frontend Components
│   ├── ChatWidget.tsx (الأصلي)
│   ├── WidgetBar.tsx
│   ├── WidgetExpanded.tsx
│   └── styles.css
├── Backend API
│   ├── /api/widget/[botId]/route.ts (مولد الكود)
│   ├── /api/chat (معالج المحادثة)
│   └── Database (بيانات البوت)
├── Embedding Files
│   ├── embed.js (سكريبت التضمين)
│   └── Generated Widget Code (كود مخصص لكل عميل)
└── Client Website
    └── <script src="embed.js"></script>
```

### تدفق البيانات
```
1. العميل يضع embed.js في موقعه
2. embed.js يقرأ data-bot-id من HTML
3. يرسل طلب إلى /api/widget/[botId]
4. الخادم يجلب بيانات البوت من قاعدة البيانات
5. يولد كود JavaScript مخصص للعميل
6. يتم تحميل الكود وعرض البوت
7. البوت يرسل الرسائل إلى /api/chat مع معرف العميل
```

## 2. آلية التضمين - Embedding Mechanism

### 2.1 ملف embed.js
```javascript
// ملف embed.js الأساسي
(function() {
  // البحث عن عنصر HTML مع data-bot-id
  const embedElement = document.querySelector('[data-bot-id]');
  if (!embedElement) {
    console.error('Sanad Bot: لم يتم العثور على عنصر مع data-bot-id');
    return;
  }

  // استخراج معرف البوت
  const botId = embedElement.getAttribute('data-bot-id');
  if (!botId) {
    console.error('Sanad Bot: معرف البوت مطلوب');
    return;
  }

  // تحديد الخادم الأساسي
  const API_BASE = embedElement.getAttribute('data-api-base') || 'https://sanad-bot.com';

  // تحميل كود البوت المخصص
  const script = document.createElement('script');
  script.src = `${API_BASE}/api/widget/${botId}`;
  script.async = true;
  script.onerror = function() {
    console.error('Sanad Bot: فشل في تحميل البوت');
  };
  
  document.head.appendChild(script);
})();
```

### 2.2 استخدام embed.js في المواقع
```html
<!-- الطريقة الأساسية -->
<div data-bot-id="bot_123456"></div>
<script src="https://sanad-bot.com/embed.js"></script>

<!-- مع تخصيص الخادم -->
<div data-bot-id="bot_123456" data-api-base="https://custom-domain.com"></div>
<script src="https://sanad-bot.com/embed.js"></script>

<!-- تحميل متأخر -->
<div data-bot-id="bot_123456" data-lazy="true"></div>
<script src="https://sanad-bot.com/embed.js"></script>
```

## 3. مولد الكود المخصص - Custom Code Generator

### 3.1 ملف route.ts
```typescript
// /api/widget/[botId]/route.ts
export async function GET(request: Request, { params }: { params: { botId: string } }) {
  try {
    // 1. جلب بيانات البوت من قاعدة البيانات
    const botData = await getBotData(params.botId);
    
    if (!botData) {
      return new Response('البوت غير موجود', { status: 404 });
    }

    // 2. إنشاء تكوين البوت
    const BOT_CONFIG = {
      id: botData.id,
      name: botData.name || 'مساعد سند',
      color: botData.color || '#1e1e1e',
      placeholder: botData.placeholder || 'اسألني أي شيء...',
      welcomeMessage: botData.welcomeMessage || 'مرحباً بك!',
      personality: botData.personality || '',
      logo: botData.logo || null,
      avatar: botData.avatar || null
    };

    // 3. توليد الكود المخصص
    const widgetCode = generateWidgetCode(BOT_CONFIG);
    
    return new Response(widgetCode, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=300', // 5 دقائق
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    console.error('خطأ في تحميل البوت:', error);
    return new Response('خطأ في الخادم', { status: 500 });
  }
}
```

### 3.2 دالة توليد الكود
```typescript
function generateWidgetCode(BOT_CONFIG: BotConfig): string {
  return `
    (function() {
      // تكوين البوت الخاص بالعميل
      const BOT_CONFIG = ${JSON.stringify(BOT_CONFIG)};
      
      // متغيرات الحالة
      let isModalOpen = false;
      let messages = [];
      let isTyping = false;
      let inputValue = '';
      
      // الأيقونات SVG
      const icons = {
        message: '${getMessageIcon()}',
        send: '${getSendIcon()}',
        arrowUp: '${getArrowUpIcon()}',
        bot: '${getBotIcon()}',
        user: '${getUserIcon()}',
        close: '${getCloseIcon()}'
      };
      
      // CSS الأنيميشن
      const styles = \`${getAnimationStyles()}\`;
      
      // إضافة الأنماط إلى الصفحة
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      document.head.appendChild(styleSheet);
      
      // دوال البوت
      ${getWidgetFunctions()}
      
      // تهيئة البوت
      init();
      
      // API خارجي
      window.SanadBot = {
        open: openModal,
        close: closeModal,
        toggle: toggleModal,
        sendMessage: function(text) {
          if (text && text.trim()) {
            sendMessage(text.trim());
          }
        },
        getConfig: function() {
          return { ...BOT_CONFIG };
        },
        getMessages: function() {
          return [...messages];
        }
      };
    })();
  `;
}
```

## 4. ضمان البيانات الخاصة بالعميل - Client-Specific Data

### 4.1 معرفات فريدة
```javascript
// في الكود المولد
const clientId = 'widget-embed-' + BOT_CONFIG.id;
const agentId = BOT_CONFIG.id;

// في طلبات API
fetch(API_BASE + '/api/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: messageText,
    botId: BOT_CONFIG.id,        // معرف البوت
    clientId: clientId,          // معرف العميل الفريد
    agentId: agentId,           // معرف الوكيل
    sessionId: generateSessionId() // معرف الجلسة
  })
});
```

### 4.2 عزل البيانات
```typescript
// في /api/chat
export async function POST(request: Request) {
  const { message, botId, clientId, agentId } = await request.json();
  
  // التحقق من صحة المعرفات
  if (!botId || !clientId || !agentId) {
    return Response.json({ error: 'معرفات مطلوبة' }, { status: 400 });
  }
  
  // جلب بيانات البوت الخاصة بالعميل فقط
  const botData = await getBotByIdAndAgent(botId, agentId);
  
  if (!botData) {
    return Response.json({ error: 'البوت غير موجود' }, { status: 404 });
  }
  
  // معالجة الرسالة باستخدام بيانات العميل فقط
  const response = await processMessage({
    message,
    botConfig: botData,
    clientId,
    agentId,
    knowledgeBase: botData.knowledgeBase, // قاعدة معرفة خاصة
    personality: botData.personality,      // شخصية خاصة
    context: await getClientContext(clientId) // سياق خاص
  });
  
  return Response.json({ response });
}
```

## 5. التطابق مع التصميم الأصلي - Design Consistency

### 5.1 نسخ الأنماط
```javascript
// نسخ CSS من الملفات الأصلية
function getAnimationStyles() {
  return `
    /* نسخة طبق الأصل من styles.css */
    @keyframes sanadbot-border-flow {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    
    @keyframes sanadbot-glow-pulse {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 0.6; }
    }
    
    @keyframes sanadbot-typing-dots {
      0%, 20% { transform: scale(1); }
      50% { transform: scale(1.2); }
      80%, 100% { transform: scale(1); }
    }
    
    .sanadbot-widget-glow {
      position: relative;
    }
    
    .sanadbot-widget-glow::before {
      content: '';
      position: absolute;
      inset: -2px;
      border-radius: 9999px;
      background: linear-gradient(
        90deg,
        #fbbf24 0%,
        #f472b6 33%,
        #a78bfa 66%,
        #fbbf24 100%
      );
      background-size: 300% 100%;
      animation: 
        sanadbot-border-flow 8s linear infinite,
        sanadbot-glow-pulse 3s ease-in-out infinite;
      z-index: -1;
      opacity: 0.9;
    }
  `;
}
```

### 5.2 نسخ المكونات
```javascript
// نسخة طبق الأصل من WidgetBar.tsx
function createWidgetBar() {
  const container = document.createElement('div');
  container.style.cssText = `
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 50;
  `;
  
  container.innerHTML = `
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
      ">
        <!-- نفس المحتوى من WidgetBar.tsx -->
      </div>
    </div>
  `;
  
  return container;
}
```

## 6. إدارة الحالة والتفاعل - State Management

### 6.1 متغيرات الحالة
```javascript
// حالة البوت
let state = {
  isModalOpen: false,
  messages: [],
  isTyping: false,
  inputValue: '',
  isInitialized: false,
  sessionId: null
};

// دوال إدارة الحالة
function setState(newState) {
  state = { ...state, ...newState };
  render();
}

function getState() {
  return { ...state };
}
```

### 6.2 معالجة الأحداث
```javascript
// معالج الرسائل
function handleSendMessage() {
  const message = state.inputValue.trim();
  if (!message) return;
  
  // إضافة رسالة المستخدم
  setState({
    messages: [...state.messages, {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    }],
    inputValue: '',
    isTyping: true
  });
  
  // إرسال إلى الخادم
  sendToServer(message);
}

// معالج لوحة المفاتيح
function handleKeyPress(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    handleSendMessage();
  }
  
  if (event.key === 'Escape') {
    closeModal();
  }
}
```

## 7. الأمان والحماية - Security

### 7.1 التحقق من المعرفات
```typescript
// في الخادم
function validateBotAccess(botId: string, origin: string) {
  // التحقق من صحة معرف البوت
  if (!botId || typeof botId !== 'string') {
    throw new Error('معرف البوت غير صحيح');
  }
  
  // التحقق من النطاق المسموح (اختياري)
  const bot = getBotById(botId);
  if (bot.allowedDomains && bot.allowedDomains.length > 0) {
    const domain = new URL(origin).hostname;
    if (!bot.allowedDomains.includes(domain)) {
      throw new Error('النطاق غير مسموح');
    }
  }
  
  return true;
}
```

### 7.2 تنظيف البيانات
```javascript
// تنظيف رسائل المستخدم
function sanitizeMessage(message) {
  if (typeof message !== 'string') {
    return '';
  }
  
  // إزالة HTML والسكريبت
  return message
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim()
    .substring(0, 1000); // حد أقصى 1000 حرف
}
```

## 8. الأداء والتحسين - Performance

### 8.1 التحميل المتأخر
```javascript
// تحميل البوت عند الحاجة فقط
function lazyLoadBot() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        initializeBot();
        observer.disconnect();
      }
    });
  });
  
  const trigger = document.querySelector('[data-bot-id]');
  if (trigger) {
    observer.observe(trigger);
  }
}
```

### 8.2 تخزين مؤقت
```javascript
// تخزين مؤقت للرسائل
const messageCache = new Map();

function cacheMessage(sessionId, messages) {
  messageCache.set(sessionId, {
    messages,
    timestamp: Date.now()
  });
  
  // تنظيف التخزين المؤقت القديم
  setTimeout(() => {
    messageCache.delete(sessionId);
  }, 30 * 60 * 1000); // 30 دقيقة
}
```

## 9. اختبار التطابق - Testing Consistency

### 9.1 اختبار بصري
```javascript
// دالة مقارنة التصميم
function compareDesigns() {
  const originalWidget = document.querySelector('.original-widget');
  const embeddedWidget = document.querySelector('.sanadbot-widget');
  
  const originalStyles = window.getComputedStyle(originalWidget);
  const embeddedStyles = window.getComputedStyle(embeddedWidget);
  
  const properties = ['width', 'height', 'backgroundColor', 'borderRadius'];
  
  properties.forEach(prop => {
    if (originalStyles[prop] !== embeddedStyles[prop]) {
      console.warn(`اختلاف في ${prop}:`, {
        original: originalStyles[prop],
        embedded: embeddedStyles[prop]
      });
    }
  });
}
```

### 9.2 اختبار وظيفي
```javascript
// اختبار إرسال الرسائل
async function testMessageSending() {
  const testMessage = 'رسالة اختبار';
  
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: testMessage,
        botId: BOT_CONFIG.id,
        clientId: 'test-client'
      })
    });
    
    const data = await response.json();
    console.log('اختبار الرسالة نجح:', data);
  } catch (error) {
    console.error('اختبار الرسالة فشل:', error);
  }
}
```

## 10. الصيانة والتطوير - Maintenance

### 10.1 تحديث التصميم
```javascript
// عند تحديث التصميم الأصلي
// 1. تحديث WidgetBar.tsx
// 2. تحديث WidgetExpanded.tsx  
// 3. تحديث styles.css
// 4. تحديث route.ts ليطابق التغييرات
// 5. اختبار التطابق

// سكريبت تحديث تلقائي
function syncDesignChanges() {
  // قراءة الملفات الأصلية
  const originalCSS = readFile('styles.css');
  const originalWidget = readFile('WidgetBar.tsx');
  
  // تحويل إلى كود مضمن
  const embeddedCSS = convertToEmbeddedCSS(originalCSS);
  const embeddedWidget = convertToEmbeddedJS(originalWidget);
  
  // تحديث route.ts
  updateRouteFile(embeddedCSS, embeddedWidget);
}
```

### 10.2 مراقبة الأخطاء
```javascript
// نظام مراقبة الأخطاء
function setupErrorMonitoring() {
  window.addEventListener('error', (event) => {
    if (event.filename && event.filename.includes('sanadbot')) {
      console.error('خطأ في بوت سند:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        botId: BOT_CONFIG.id
      });
      
      // إرسال تقرير الخطأ (اختياري)
      sendErrorReport({
        error: event.message,
        botId: BOT_CONFIG.id,
        userAgent: navigator.userAgent,
        url: window.location.href
      });
    }
  });
}
```

## 11. أمثلة الاستخدام - Usage Examples

### 11.1 تضمين أساسي
```html
<!DOCTYPE html>
<html>
<head>
  <title>موقع العميل</title>
</head>
<body>
  <h1>مرحباً بكم في موقعنا</h1>
  
  <!-- تضمين بوت سند -->
  <div data-bot-id="bot_123456"></div>
  <script src="https://sanad-bot.com/embed.js"></script>
</body>
</html>
```

### 11.2 تضمين متقدم
```html
<!-- مع تخصيصات إضافية -->
<div 
  data-bot-id="bot_123456"
  data-api-base="https://custom-domain.com"
  data-position="bottom-right"
  data-theme="dark"
  data-language="ar"
></div>
<script src="https://sanad-bot.com/embed.js"></script>

<script>
// التحكم البرمجي
document.addEventListener('DOMContentLoaded', function() {
  // فتح البوت تلقائياً بعد 5 ثوان
  setTimeout(() => {
    if (window.SanadBot) {
      window.SanadBot.open();
    }
  }, 5000);
  
  // إرسال رسالة ترحيب
  setTimeout(() => {
    if (window.SanadBot) {
      window.SanadBot.sendMessage('مرحباً، كيف يمكنني مساعدتك؟');
    }
  }, 6000);
});
</script>
```

### 11.3 تكامل مع React
```jsx
// مكون React للبوت
import { useEffect } from 'react';

function SanadBotWidget({ botId }) {
  useEffect(() => {
    // إنشاء عنصر التضمين
    const embedDiv = document.createElement('div');
    embedDiv.setAttribute('data-bot-id', botId);
    document.body.appendChild(embedDiv);
    
    // تحميل سكريبت التضمين
    const script = document.createElement('script');
    script.src = 'https://sanad-bot.com/embed.js';
    script.async = true;
    document.head.appendChild(script);
    
    // تنظيف عند إلغاء التحميل
    return () => {
      document.body.removeChild(embedDiv);
      document.head.removeChild(script);
    };
  }, [botId]);
  
  return null; // البوت يظهر كعنصر ثابت
}

export default SanadBotWidget;
```

## 12. استكشاف الأخطاء - Troubleshooting

### 12.1 مشاكل شائعة
```javascript
// 1. البوت لا يظهر
if (!document.querySelector('[data-bot-id]')) {
  console.error('لم يتم العثور على عنصر data-bot-id');
}

// 2. معرف البوت خاطئ
if (!botId || botId.length < 5) {
  console.error('معرف البوت غير صحيح:', botId);
}

// 3. مشكلة في الشبكة
fetch('/api/widget/' + botId)
  .then(response => {
    if (!response.ok) {
      throw new Error('فشل في تحميل البوت: ' + response.status);
    }
  })
  .catch(error => {
    console.error('خطأ في الشبكة:', error);
  });
```

### 12.2 أدوات التشخيص
```javascript
// دالة تشخيص شاملة
function diagnoseSanadBot() {
  const report = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href,
    botElement: !!document.querySelector('[data-bot-id]'),
    botId: document.querySelector('[data-bot-id]')?.getAttribute('data-bot-id'),
    scriptLoaded: !!window.SanadBot,
    apiReachable: null
  };
  
  // اختبار الوصول للAPI
  fetch('/api/health')
    .then(response => {
      report.apiReachable = response.ok;
    })
    .catch(() => {
      report.apiReachable = false;
    })
    .finally(() => {
      console.log('تقرير تشخيص بوت سند:', report);
    });
  
  return report;
}
```

## الخلاصة

هذا النظام يضمن:

1. **التطابق الكامل** بين البوت الأصلي والمضمن
2. **عزل البيانات** لكل عميل
3. **الأمان والموثوقية** في التشغيل
4. **سهولة الصيانة** والتطوير
5. **الأداء المحسن** والتحميل السريع

النظام مصمم ليكون قابلاً للتوسع والصيانة، مع ضمان عدم وجود أي اختلافات بين تجربة العميل في لوحة التحكم وفي موقعه الخاص.