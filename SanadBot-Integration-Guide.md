# دليل تكامل سند بوت - SanadBot Integration Guide

## جدول المحتويات
- [نظرة عامة](#نظرة-عامة)
- [هيكل النظام](#هيكل-النظام)
- [آلية التضمين](#آلية-التضمين)
- [التخصيص والتكوين](#التخصيص-والتكوين)
- [API للتحكم الخارجي](#api-للتحكم-الخارجي)
- [أمثلة التطبيق](#أمثلة-التطبيق)
- [استكشاف الأخطاء](#استكشاف-الأخطاء)

## نظرة عامة

سند بوت هو نظام مساعد ذكي قابل للتضمين في أي موقع إلكتروني. يوفر النظام:

- **تضمين سهل**: كود واحد لتضمين البوت في أي موقع
- **تخصيص كامل**: ألوان، رسائل، وشخصية مخصصة لكل عميل
- **ذكاء اصطناعي**: مدعوم بـ Gemini AI وتقنية RAG
- **عزل البيانات**: كل عميل له بيانات منفصلة ومحمية

## هيكل النظام

```
Sanad Bot System
├── Frontend Platform
│   ├── Dashboard (لوحة التحكم)
│   ├── ChatWidget.tsx (مكون المحادثة)
│   ├── WidgetBar.tsx (الشريط السفلي)
│   └── WidgetExpanded.tsx (النافذة المنبثقة)
├── Backend API
│   ├── /api/widget/[botId] (مولد الكود)
│   ├── /api/chat (معالج المحادثة)
│   ├── /api/agents/[id]/theme (تخصيصات البوت)
│   └── Database (قاعدة البيانات)
├── Embedding System
│   ├── embed.js (سكريبت التضمين)
│   └── widget-generator.ts (مولد الكود المخصص)
└── Client Integration
    └── <script> tag في موقع العميل
```

## آلية التضمين

### الخطوة 1: إضافة الكود إلى الموقع

```html
<!-- التضمين الأساسي -->
<div data-bot-id="YOUR_BOT_ID"></div>
<script src="https://your-domain.com/embed.js"></script>

<!-- مع تخصيص الخادم -->
<div data-bot-id="YOUR_BOT_ID" data-api-base="https://custom-domain.com"></div>
<script src="https://your-domain.com/embed.js"></script>
```

### الخطوة 2: تدفق البيانات

1. **تحميل embed.js**: يقرأ `data-bot-id` من HTML
2. **طلب التكوين**: يرسل طلب إلى `/api/widget/[botId]`
3. **توليد الكود**: الخادم يجلب بيانات البوت ويولد كود JavaScript مخصص
4. **تحميل البوت**: يتم تحميل الكود وعرض البوت
5. **التفاعل**: البوت يرسل الرسائل إلى `/api/chat`

### الخطوة 3: ملف embed.js

```javascript
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

  // استخراج معرف البوت
  const botId = embedElement.getAttribute('data-bot-id');
  const apiBase = embedElement.getAttribute('data-api-base') || window.location.origin;

  // تحميل كود البوت المخصص
  const script = document.createElement('script');
  script.src = `${apiBase}/api/widget/${botId}`;
  script.async = true;
  script.onload = () => {
    window.SanadBotWidgetLoaded = true;
  };
  script.onerror = () => {
    console.error('Sanad Bot: فشل في تحميل البوت');
  };
  
  document.head.appendChild(script);
})();
```

## التخصيص والتكوين

### تكوين البوت (BOT_CONFIG)

```javascript
const BOT_CONFIG = {
  id: 'client-bot-id',              // معرف البوت
  name: 'مساعد سند',                // اسم البوت
  color: '#3B82F6',                // اللون الأساسي
  placeholder: 'اكتب رسالتك هنا...', // نص حقل الإدخال
  welcome: 'مرحباً! كيف يمكنني مساعدتك؟', // رسالة الترحيب
  personality: 'مساعد ودود ومفيد',   // شخصية البوت
  logo: null,                      // شعار البوت
  avatar: null                     // صورة البوت
};
```

### مولد الكود المخصص

```typescript
// /api/widget/[botId]/route.ts
export async function GET(request: Request, { params }: { params: { botId: string } }) {
  try {
    // جلب بيانات البوت من قاعدة البيانات
    const botData = await getBotData(params.botId);
    
    if (!botData) {
      return new Response('البوت غير موجود', { status: 404 });
    }

    // إنشاء تكوين البوت
    const BOT_CONFIG = {
      id: botData.id,
      name: botData.name,
      color: botData.color,
      placeholder: botData.placeholder,
      welcome: botData.welcome,
      personality: botData.personality
    };

    // توليد الكود المخصص
    const widgetCode = generateWidgetCode(BOT_CONFIG);
    
    return new Response(widgetCode, {
      headers: {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'public, max-age=300',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response('خطأ في الخادم', { status: 500 });
  }
}
```

## API للتحكم الخارجي

### window.SanadBot

بعد تحميل البوت، يصبح متاحاً API للتحكم الخارجي:

```javascript
// فتح نافذة البوت
window.SanadBot.open();

// إغلاق نافذة البوت
window.SanadBot.close();

// تبديل حالة النافذة
window.SanadBot.toggle();

// إرسال رسالة برمجياً
window.SanadBot.sendMessage('مرحباً، كيف يمكنني مساعدتك؟');

// الحصول على تكوين البوت
const config = window.SanadBot.getConfig();

// الحصول على تاريخ المحادثة
const messages = window.SanadBot.getMessages();

// التحقق من حالة النافذة
const isOpen = window.SanadBot.isOpen();
```

## أمثلة التطبيق

### التضمين الأساسي

```html
<!DOCTYPE html>
<html>
<head>
    <title>موقع العميل</title>
</head>
<body>
    <h1>مرحباً بكم في موقعنا</h1>
    
    <!-- تضمين البوت -->
    <div data-bot-id="bot_123456"></div>
    <script src="https://sanad-bot.com/embed.js"></script>
</body>
</html>
```

### التحكم البرمجي

```html
<script>
// انتظار تحميل البوت
window.addEventListener('load', function() {
  // فتح البوت تلقائياً بعد 3 ثوانٍ
  setTimeout(() => {
    if (window.SanadBot) {
      window.SanadBot.open();
    }
  }, 3000);
});

// ربط البوت بزر مخصص
document.getElementById('help-button').addEventListener('click', function() {
  if (window.SanadBot) {
    window.SanadBot.toggle();
  }
});
</script>
```

### التكامل مع أحداث الموقع

```javascript
// إرسال رسالة ترحيب مخصصة
function welcomeUser(userName) {
  if (window.SanadBot) {
    window.SanadBot.sendMessage(`مرحباً ${userName}! كيف يمكنني مساعدتك اليوم؟`);
    window.SanadBot.open();
  }
}

// مراقبة تفاعل المستخدم
window.addEventListener('beforeunload', function() {
  if (window.SanadBot && window.SanadBot.isOpen()) {
    // حفظ حالة المحادثة قبل مغادرة الصفحة
    localStorage.setItem('sanad-chat-open', 'true');
  }
});
```

## استكشاف الأخطاء

### المشاكل الشائعة

1. **البوت لا يظهر**
   - تأكد من وجود `data-bot-id` في HTML
   - تحقق من صحة معرف البوت
   - افحص وحدة تحكم المتصفح للأخطاء

2. **البوت يظهر بدون تخصيص**
   - تأكد من أن البوت مُفعل في لوحة التحكم
   - تحقق من إعدادات CORS
   - تأكد من صحة رابط API

3. **الرسائل لا تُرسل**
   - تحقق من اتصال الإنترنت
   - تأكد من صحة endpoint الخاص بـ `/api/chat`
   - افحص إعدادات قاعدة البيانات

### أدوات التشخيص

```javascript
// تفعيل وضع التشخيص
window.SanadBotDebug = true;

// فحص حالة البوت
console.log('Bot Config:', window.SanadBot?.getConfig());
console.log('Messages:', window.SanadBot?.getMessages());
console.log('Is Open:', window.SanadBot?.isOpen());

// اختبار الاتصال
fetch('/api/widget/YOUR_BOT_ID')
  .then(response => response.text())
  .then(code => console.log('Widget Code:', code))
  .catch(error => console.error('Connection Error:', error));
```

### نصائح الأداء

- استخدم `data-lazy="true"` للتحميل المتأخر
- ضع سكريبت embed.js في نهاية الصفحة
- استخدم CDN لتسريع التحميل
- فعّل ضغط gzip على الخادم

---

**ملاحظة**: هذا الدليل يغطي جميع جوانب تكامل سند بوت. للحصول على مساعدة إضافية، راجع الوثائق التقنية أو اتصل بفريق الدعم.