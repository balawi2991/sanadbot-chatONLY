# دليل التضمين التقني - Technical Embedding Guide

## نظرة عامة
هذا الدليل التقني يشرح التفاصيل الداخلية لنظام التضمين وآلية توليد الكود المخصص.

**ملاحظة**: للحصول على دليل التكامل الشامل، راجع `SanadBot-Integration-Guide.md`

## التفاصيل التقنية لآلية التضمين

### ملف embed.js المحسن
```javascript
// ملف embed.js مع معالجة أخطاء محسنة
(function() {
  // منع التحميل المتكرر
  if (window.SanadBotWidgetLoaded) {
    console.log('SanadBot widget already loaded');
    return;
  }

  // البحث عن عنصر HTML مع data-bot-id
  const embedElement = document.querySelector('[data-bot-id]');
  if (!embedElement) {
    console.error('Sanad Bot: لم يتم العثور على عنصر مع data-bot-id');
    return;
  }

  // استخراج معرف البوت والإعدادات
  const botId = embedElement.getAttribute('data-bot-id');
  const apiBase = embedElement.getAttribute('data-api-base') || window.location.origin;
  const isLazy = embedElement.getAttribute('data-lazy') === 'true';

  if (!botId) {
    console.error('Sanad Bot: معرف البوت مطلوب');
    return;
  }

  // دالة تحميل البوت
  function loadWidget() {
    const script = document.createElement('script');
    script.src = `${apiBase}/api/widget/${botId}`;
    script.async = true;
    script.onload = () => {
      window.SanadBotWidgetLoaded = true;
      console.log('SanadBot widget loaded successfully');
    };
    script.onerror = () => {
      console.error('Sanad Bot: فشل في تحميل البوت');
    };
    
    document.head.appendChild(script);
  }

  // تحميل فوري أو متأخر
  if (isLazy) {
    // تحميل عند التفاعل الأول
    const events = ['mouseenter', 'click', 'touchstart'];
    const loadOnce = () => {
      loadWidget();
      events.forEach(event => 
        document.removeEventListener(event, loadOnce)
      );
    };
    events.forEach(event => 
      document.addEventListener(event, loadOnce, { passive: true })
    );
  } else {
    loadWidget();
  }
})();
```

## 3. مولد الكود المخصص - Custom Code Generator

### 3.1 ملف route.ts المحسن
```typescript
// /api/widget/[botId]/route.ts - معالج محسن مع تخزين مؤقت وأمان
export async function GET(request: Request, { params }: { params: { botId: string } }) {
  // التحقق من صحة معرف البوت
  if (!params.botId || typeof params.botId !== 'string') {
    return new Response('معرف البوت غير صحيح', { status: 400 });
  }
  
  try {
    // 1. جلب بيانات البوت مع التحقق من الحالة النشطة
    const botData = await getBotData(params.botId, { includeActive: true });
    
    if (!botData || !botData.isActive) {
      return new Response('البوت غير موجود أو غير نشط', { status: 404 });
    }

    // 2. إنشاء تكوين البوت مع تنظيف البيانات
    const BOT_CONFIG = {
      id: botData.id,
      name: (botData.name || 'مساعد سند').replace(/["'<>]/g, ''),
      color: botData.color || '#1e1e1e',
      placeholder: botData.placeholder || 'اسألني أي شيء...',
      welcomeMessage: botData.welcomeMessage || 'مرحباً بك!',
      personality: botData.personality || '',
      logo: botData.logo || null,
      avatar: botData.avatar || null,
      apiBase: process.env.NEXT_PUBLIC_API_URL || request.url.split('/api')[0]
    };

    // 3. توليد الكود المحسن
    const widgetCode = generateOptimizedWidgetCode(BOT_CONFIG);
    
    return new Response(widgetCode, {
      headers: {
        'Content-Type': 'application/javascript; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, stale-while-revalidate=3600',
        'Access-Control-Allow-Origin': '*',
        'ETag': `"${params.botId}-${Date.now()}"`
      }
    });
  } catch (error) {
    console.error('خطأ في تحميل البوت:', error);
    return new Response('خطأ في الخادم', { status: 500 });
  }
}
```

### 3.2 دالة توليد الكود المحسن
```typescript
function generateOptimizedWidgetCode(BOT_CONFIG: BotConfig): string {
  return `
    (function() {
      'use strict';
      
      // منع التحميل المتكرر
      if (window.SanadBot_${BOT_CONFIG.id}) {
        console.log('SanadBot already initialized');
        return;
      }
      
      // تكوين البوت الخاص بالعميل
      const BOT_CONFIG = ${JSON.stringify(BOT_CONFIG)};
      
      // متغيرات الحالة
      let isModalOpen = false;
      let messages = [];
      let isTyping = false;
      let inputValue = '';
      
      // الأيقونات SVG المحسنة
      const icons = {
        message: '${getMessageIcon()}',
        send: '${getSendIcon()}',
        arrowUp: '${getArrowUpIcon()}',
        bot: '${getBotIcon()}',
        user: '${getUserIcon()}',
        close: '${getCloseIcon()}'
      };
      
      // CSS الأنيميشن المحسن
      const styles = \`${getOptimizedAnimationStyles()}\`;
      
      // إضافة الأنماط إلى الصفحة مع تحسينات الأداء
      const styleSheet = document.createElement('style');
      styleSheet.textContent = styles;
      styleSheet.setAttribute('data-sanad-widget', BOT_CONFIG.id);
      document.head.appendChild(styleSheet);
      
      // دوال البوت المحسنة
      ${getOptimizedWidgetFunctions()}
      
      // تهيئة البوت مع معالجة الأخطاء
      try {
        init();
      } catch (error) {
        console.error('خطأ في تهيئة بوت سند:', error);
      }
      
      // API خارجي محسن
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
        },
        isReady: function() {
          return !!window.SanadBot_${BOT_CONFIG.id};
        }
      };
      
      // تسجيل التحميل الناجح
      window.SanadBot_${BOT_CONFIG.id} = true;
    })();
  `;
}
```

## آليات الحماية وضمان البيانات

### حماية API والتحقق من الصلاحيات
```typescript
// دالة التحقق من صحة البوت وصلاحيات الوصول
async function validateBotAccess(botId: string) {
  const bot = await prisma.bot.findFirst({
    where: { 
      id: botId,
      isActive: true,
      user: { isActive: true }
    },
    include: {
      user: {
        select: {
          id: true,
          plan: true,
          isActive: true,
          usageStats: true
        }
      },
      knowledgeSources: {
        where: { isActive: true },
        select: { id: true, title: true, type: true }
      },
      qas: {
        where: { isActive: true },
        select: { id: true, question: true, answer: true }
      }
    }
  });

  if (!bot) return null;

  // التحقق من حدود الخطة
  const planLimits = getPlanLimits(bot.user.plan);
  if (!planLimits.allowEmbedding) {
    throw new Error('التضمين غير مسموح في هذه الخطة');
  }

  return bot;
}

// دالة إنشاء تكوين آمن للبوت
function createSafeConfig(bot: any) {
  return {
    id: bot.id,
    name: sanitizeString(bot.name),
    color: bot.color || '#007bff',
    placeholder: sanitizeString(bot.placeholder),
    welcomeMessage: sanitizeString(bot.welcomeMessage),
    apiEndpoint: `/api/chat/${bot.id}`,
    // إحصائيات عامة فقط - بدون بيانات حساسة
    stats: {
      knowledgeSourcesCount: bot.knowledgeSources?.length || 0,
      qasCount: bot.qas?.length || 0
    },
    features: {
      fileUpload: bot.allowFileUpload || false,
      voiceInput: bot.allowVoiceInput || false
    }
  };
}

// دالة تنظيف النصوص من المحتوى الضار
function sanitizeString(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>"']/g, '') // إزالة HTML tags والاقتباسات
    .replace(/javascript:/gi, '') // إزالة JavaScript URLs
    .trim()
    .substring(0, 200); // تحديد الطول الأقصى
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

### تتبع الاستخدام والإحصائيات
```typescript
// تسجيل التفاعلات مع معالجة الأخطاء
async function logInteraction(data: {
  botId: string;
  action: string;
  sessionId?: string;
  metadata?: any;
}) {
  try {
    await prisma.interaction.create({
      data: {
        botId: data.botId,
        action: data.action,
        sessionId: data.sessionId,
        timestamp: new Date(),
        metadata: {
          ...data.metadata,
          source: 'embedded_widget'
        }
      }
    });
  } catch (error) {
    console.error('خطأ في تسجيل التفاعل:', error);
    // لا نوقف العملية في حالة فشل التسجيل
  }
}

// إحصائيات الاستخدام المحسنة
async function getUsageStats(botId: string, period: number = 30) {
  const startDate = new Date(Date.now() - period * 24 * 60 * 60 * 1000);
  
  const stats = await prisma.interaction.groupBy({
    by: ['action'],
    where: {
      botId: botId,
      timestamp: { gte: startDate }
    },
    _count: { action: true },
    _max: { timestamp: true }
  });
  
  return {
    period: `${period} days`,
    totalInteractions: stats.reduce((sum, stat) => sum + stat._count.action, 0),
    breakdown: stats,
    lastActivity: stats.length > 0 ? Math.max(...stats.map(s => s._max.timestamp?.getTime() || 0)) : null
  };
}
```

---

## الخلاصة التقنية

يوفر هذا الدليل التقني المعلومات الأساسية لفهم آلية التضمين في Sanad Bot:

✅ **آلية التضمين المحسنة** مع منع التحميل المتكرر  
✅ **API محسن** مع تخزين مؤقت وحماية من XSS  
✅ **حماية البيانات** وعزل المعلومات الحساسة  
✅ **تتبع الاستخدام** مع معالجة أخطاء شاملة  

**للحصول على دليل التكامل الشامل والأمثلة العملية، راجع:** `SanadBot-Integration-Guide.md`