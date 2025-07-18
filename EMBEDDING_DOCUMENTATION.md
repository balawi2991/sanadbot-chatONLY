# توثيق آلية التضمين - Sanad Bot Embedding Documentation

## نظرة عامة
يوفر نظام Sanad Bot آلية تضمين متقدمة تسمح للعملاء بدمج البوت الذكي في مواقعهم الإلكترونية بسهولة، مع ضمان الحصول على نفس التجربة والتصميم الموجود في لوحة التحكم.

## كيفية عمل النظام

### 1. هيكل النظام
```
Embed System
├── embed.js (ملف التضمين الرئيسي)
├── /api/widget/[botId] (API endpoint لتوليد الكود)
├── ChatWidget Components (المكونات الأصلية)
│   ├── ChatWidget.tsx
│   ├── WidgetBar.tsx
│   ├── WidgetExpanded.tsx
│   └── styles.css
└── Test Pages (صفحات الاختبار)
    ├── test-embed.html
    ├── debug-embed.html
    └── simple-test.html
```

### 2. آلية التضمين

#### الخطوة الأولى: تحميل embed.js
```html
<script src="https://yourdomain.com/embed.js" data-bot-id="YOUR_BOT_ID"></script>
```

#### الخطوة الثانية: تحميل كود البوت
- يقوم `embed.js` بقراءة `data-bot-id` من العنصر
- يرسل طلب إلى `/api/widget/[botId]` للحصول على كود البوت المخصص
- يتم تحميل الكود وتشغيله تلقائياً

#### الخطوة الثالثة: إنشاء البوت
- يتم إنشاء الشريط السفلي (Widget Bar)
- يتم تطبيق التخصيصات الخاصة بالعميل
- يتم ربط الأحداث والوظائف

## مكونات النظام

### 1. embed.js
**الوظيفة:** ملف التضمين الرئيسي الذي يحمل البوت

**المسؤوليات:**
- قراءة معرف البوت من `data-bot-id`
- تحميل كود البوت من API
- منع التحميل المتكرر
- معالجة الأخطاء

**الكود:**
```javascript
(function() {
  // منع التحميل المتكرر
  if (window.SanadBotWidgetLoaded || window.SanadBot) {
    console.log('SanadBot widget already loaded');
    return;
  }
  
  // قراءة معرف البوت
  const script = document.currentScript;
  const botId = script.getAttribute('data-bot-id');
  
  // تحميل كود البوت
  fetch(`/api/widget/${botId}`)
    .then(response => response.text())
    .then(code => {
      eval(code);
      window.SanadBotWidgetLoaded = true;
    });
})();
```

### 2. API Endpoint: /api/widget/[botId]
**الوظيفة:** توليد كود JavaScript مخصص لكل عميل

**المدخلات:**
- `botId`: معرف البوت الخاص بالعميل

**المخرجات:**
- كود JavaScript كامل يحتوي على:
  - تكوين البوت (الألوان، الاسم، الرسائل)
  - CSS styles مع التأثيرات البصرية
  - وظائف إنشاء وإدارة البوت
  - API للتحكم الخارجي

**العملية:**
1. التحقق من صحة `botId`
2. جلب بيانات البوت من قاعدة البيانات
3. توليد تكوين البوت
4. إنشاء كود JavaScript مع التخصيصات
5. إرجاع الكود مع headers صحيحة

### 3. تكوين البوت (BOT_CONFIG)
```javascript
const BOT_CONFIG = {
  id: 'client-bot-id',           // معرف البوت
  name: 'اسم المساعد',           // اسم البوت المخصص
  color: '#1e40af',             // اللون الأساسي
  placeholder: 'اسألني شيئاً...', // نص حقل الإدخال
  welcomeMessage: 'مرحباً بك!',  // رسالة الترحيب
  personality: 'ودود ومفيد'      // شخصية البوت
};
```

## التصميم والمكونات البصرية

### 1. الشريط السفلي (Widget Bar)
**المواصفات:**
- العرض: 320px
- الارتفاع: 56px
- الموقع: أسفل الصفحة، في المنتصف
- التأثيرات: توهج متحرك، ظلال

**المكونات:**
- أيقونة الرسالة (يسار)
- حقل الإدخال (وسط)
- زر الإرسال (يمين)

### 2. النافذة المنبثقة (Modal)
**المواصفات:**
- العرض: 384px
- الارتفاع: متغير (حد أقصى 90% من الشاشة)
- الموقع: وسط الشاشة
- التأثيرات: توهج، انيميشن فتح/إغلاق

**المكونات:**
- الهيدر (اسم البوت، حالة الاتصال، زر الإغلاق)
- منطقة المحادثة
- حقل الإدخال السفلي (في وضع التضمين الكامل)

### 3. التأثيرات البصرية
```css
/* توهج متحرك */
@keyframes border-flow {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* نبضة التوهج */
@keyframes glow-pulse {
  0%, 100% { filter: blur(3px) brightness(1); }
  50% { filter: blur(4px) brightness(1.2); }
}

/* مؤشر الكتابة */
@keyframes typing-dots {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
}
```

## ضمان البيانات الخاصة بالعميل

### 1. معرف العميل
كل طلب يتضمن:
```javascript
{
  botId: BOT_CONFIG.id,                    // معرف البوت
  clientId: 'widget-embed-' + BOT_CONFIG.id, // معرف فريد
  agentId: BOT_CONFIG.id                   // معرف الوكيل
}
```

### 2. عزل البيانات
- كل عميل له `botId` فريد
- البيانات محفوظة منفصلة في قاعدة البيانات
- لا توجد مشاركة للبيانات بين العملاء
- التخصيصات مرتبطة بـ `botId`

### 3. API الآمن
- التحقق من صحة `botId` قبل الوصول للبيانات
- استخدام CORS headers مناسبة
- تشفير البيانات الحساسة

## API للتحكم الخارجي

### window.SanadBot
```javascript
window.SanadBot = {
  sendMessage: function(),      // إرسال رسالة
  openModal: function(),        // فتح النافذة
  closeModal: function(),       // إغلاق النافذة
  toggleModal: function(),      // تبديل النافذة
  isOpen: function(),          // حالة النافذة
  handleKeyPress: function(),   // معالجة المفاتيح
  updateInput: function()       // تحديث الإدخال
};
```

## الاستخدام والتطبيق

### 1. التضمين الأساسي
```html
<!DOCTYPE html>
<html>
<head>
    <title>موقع العميل</title>
</head>
<body>
    <!-- محتوى الموقع -->
    
    <!-- تضمين البوت -->
    <script src="https://yourdomain.com/embed.js" data-bot-id="demo"></script>
</body>
</html>
```

### 2. التحكم البرمجي
```javascript
// فتح البوت برمجياً
if (window.SanadBot) {
  window.SanadBot.openModal();
}

// إرسال رسالة برمجياً
if (window.SanadBot) {
  window.SanadBot.updateInput('مرحباً');
  window.SanadBot.sendMessage();
}

// التحقق من حالة البوت
if (window.SanadBot && window.SanadBot.isOpen()) {
  console.log('البوت مفتوح');
}
```

## الصيانة والتطوير

### 1. إضافة ميزات جديدة
1. تحديث المكونات الأصلية في `/components/ChatWidget/`
2. تحديث كود التوليد في `/api/widget/[botId]/route.ts`
3. اختبار التغييرات في صفحات الاختبار
4. تحديث التوثيق

### 2. إصلاح الأخطاء
1. فحص console logs في المتصفح
2. التحقق من API responses
3. مراجعة تكوين البوت
4. اختبار في بيئات مختلفة

### 3. تحسين الأداء
- تقليل حجم الكود المولد
- استخدام CDN للملفات الثابتة
- تحسين CSS animations
- ضغط الاستجابات

## الحدود والقيود

### 1. القيود التقنية
- يتطلب JavaScript مفعل
- يعمل على المتصفحات الحديثة فقط
- حجم الكود المولد محدود
- عدد الطلبات محدود لمنع الإساءة

### 2. القيود الأمنية
- CORS محدود للنطاقات المصرح بها
- التحقق من صحة جميع المدخلات
- منع XSS attacks
- تشفير البيانات الحساسة

### 3. قيود التخصيص
- الألوان محدودة بنظام الألوان المدعوم
- الخطوط محدودة بالخطوط المتاحة
- حجم الرسائل محدود
- عدد الرسائل في الجلسة محدود

## استكشاف الأخطاء

### 1. البوت لا يظهر
```javascript
// التحقق من تحميل الكود
console.log('SanadBot loaded:', !!window.SanadBot);

// التحقق من معرف البوت
const script = document.querySelector('script[data-bot-id]');
console.log('Bot ID:', script?.getAttribute('data-bot-id'));

// التحقق من الأخطاء
console.log('Errors:', window.SanadBotErrors);
```

### 2. التصميم غير صحيح
- التحقق من تحميل CSS
- مراجعة تكوين الألوان
- فحص تضارب الأنماط
- التحقق من دعم المتصفح

### 3. البيانات غير صحيحة
- التحقق من `botId`
- مراجعة API responses
- فحص قاعدة البيانات
- التحقق من الصلاحيات

## الخلاصة

نظام التضمين في Sanad Bot مصمم لضمان:
- **التطابق الكامل** مع التصميم الأصلي
- **البيانات الخاصة** لكل عميل
- **الأمان والموثوقية**
- **سهولة الاستخدام والصيانة**

يمكن للمطورين الاعتماد على هذا التوثيق لفهم النظام وتطويره وصيانته بفعالية.