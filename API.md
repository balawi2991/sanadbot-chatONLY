# 📡 توثيق واجهات برمجة التطبيقات (API)

هذا الملف يوثق جميع نقاط النهاية (endpoints) المتاحة في مشروع سند.

## 🔐 المصادقة

جميع APIs تتطلب مصادقة باستثناء:
- `/api/auth/*` - نقاط المصادقة
- `/api/chat` - المحادثة العامة (للبوتات المدمجة)

### رؤوس المطلوبة
```http
Authorization: Bearer <session-token>
Content-Type: application/json
```

## 🤖 إدارة البوت

### GET `/api/bot`
جلب معلومات البوت الخاص بالمستخدم المسجل.

**الاستجابة:**
```json
{
  "id": "bot-id",
  "name": "اسم البوت",
  "primaryColor": "#3B82F6",
  "secondaryColor": "#EFF6FF",
  "placeholderText": "اكتب رسالتك هنا...",
  "welcomeMessage": "مرحباً! كيف يمكنني مساعدتك؟",
  "personality": "ودود ومفيد",
  "fallbackMessage": "عذراً، لا أستطيع الإجابة على هذا السؤال."
}
```

### PUT `/api/bot`
تحديث إعدادات البوت.

**الطلب:**
```json
{
  "name": "اسم البوت الجديد",
  "primaryColor": "#10B981",
  "secondaryColor": "#ECFDF5",
  "placeholderText": "اسأل أي شيء...",
  "welcomeMessage": "أهلاً وسهلاً!",
  "personality": "خبير ومتخصص",
  "fallbackMessage": "سأحاول مساعدتك بطريقة أخرى."
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم تحديث البوت بنجاح"
}
```

## 💬 المحادثة

### POST `/api/chat`
إرسال رسالة للمساعد الذكي.

**الطلب:**
```json
{
  "message": "ما هو سند؟",
  "botId": "bot-id" // اختياري للبوتات المدمجة
}
```

**الاستجابة:**
```json
{
  "response": "سند هو منصة لإنشاء مساعدين أذكياء...",
  "source": "qa" // qa, rag, fallback
}
```

### آلية عمل المحادثة
1. **البحث في Q&A**: البحث عن إجابة محفوظة مسبقاً
2. **تفعيل RAG**: استخدام مصادر المعرفة مع Gemini AI
3. **الرد الاحتياطي**: رسالة افتراضية

## ❓ الأسئلة والأجوبة

### GET `/api/qas`
جلب جميع الأسئلة والأجوبة.

**الاستجابة:**
```json
[
  {
    "id": "qa-id",
    "question": "ما هو سند؟",
    "answer": "سند هو منصة ذكية...",
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST `/api/qas`
إضافة سؤال وجواب جديد.

**الطلب:**
```json
{
  "question": "كيف أستخدم سند؟",
  "answer": "يمكنك البدء بإنشاء حساب..."
}
```

### PUT `/api/qas/[id]`
تحديث سؤال وجواب موجود.

**الطلب:**
```json
{
  "question": "السؤال المحدث",
  "answer": "الجواب المحدث",
  "isActive": true
}
```

### DELETE `/api/qas/[id]`
حذف سؤال وجواب.

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم حذف السؤال بنجاح"
}
```

## 📚 مصادر المعرفة

### GET `/api/knowledge-sources`
جلب جميع مصادر المعرفة.

**الاستجابة:**
```json
[
  {
    "id": "source-id",
    "type": "text", // text, link, file
    "title": "عن الشركة",
    "content": "محتوى النص...",
    "url": null,
    "fileName": null,
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

### POST `/api/knowledge-sources`
إضافة مصدر معرفة جديد.

**للنص:**
```json
{
  "type": "text",
  "title": "معلومات الشركة",
  "content": "تأسست الشركة في..."
}
```

**للرابط:**
```json
{
  "type": "link",
  "title": "موقع الشركة",
  "url": "https://example.com"
}
```

**للملف:**
```json
{
  "type": "file",
  "title": "دليل المستخدم",
  "fileName": "user-guide.pdf",
  "content": "محتوى الملف المستخرج..."
}
```

### DELETE `/api/knowledge-sources/[id]`
حذف مصدر معرفة.

## 🔒 المصادقة

### POST `/api/auth/register`
تسجيل مستخدم جديد.

**الطلب:**
```json
{
  "name": "أحمد محمد",
  "email": "ahmed@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "تم إنشاء الحساب بنجاح",
  "user": {
    "id": "user-id",
    "name": "أحمد محمد",
    "email": "ahmed@example.com"
  }
}
```

### POST `/api/auth/signin`
تسجيل الدخول (يتم عبر NextAuth.js).

### POST `/api/auth/signout`
تسجيل الخروج (يتم عبر NextAuth.js).

## 📊 الإحصائيات

### GET `/api/stats`
جلب إحصائيات البوت.

**الاستجابة:**
```json
{
  "conversations": 150,
  "qas": 25,
  "knowledgeSources": 10,
  "lastActivity": "2024-01-01T12:00:00Z"
}
```

## 🗨️ المحادثات

### GET `/api/conversations`
جلب سجل المحادثات.

**المعاملات:**
- `page`: رقم الصفحة (افتراضي: 1)
- `limit`: عدد النتائج (افتراضي: 20)

**الاستجابة:**
```json
{
  "conversations": [
    {
      "id": "conv-id",
      "userMessage": "ما هو سند؟",
      "botResponse": "سند هو منصة...",
      "source": "qa",
      "createdAt": "2024-01-01T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## 🚨 رموز الأخطاء

| الرمز | الوصف | المعنى |
|-------|--------|--------|
| 200 | OK | نجح الطلب |
| 201 | Created | تم إنشاء المورد |
| 400 | Bad Request | طلب غير صحيح |
| 401 | Unauthorized | غير مصرح |
| 403 | Forbidden | ممنوع |
| 404 | Not Found | غير موجود |
| 500 | Internal Server Error | خطأ في الخادم |

## 📝 أمثلة الاستخدام

### JavaScript/TypeScript
```typescript
// جلب معلومات البوت
const response = await fetch('/api/bot', {
  headers: {
    'Authorization': `Bearer ${sessionToken}`,
    'Content-Type': 'application/json'
  }
});
const bot = await response.json();

// إرسال رسالة
const chatResponse = await fetch('/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    message: 'مرحباً',
    botId: 'bot-id'
  })
});
const result = await chatResponse.json();
```

### cURL
```bash
# جلب الأسئلة والأجوبة
curl -X GET "http://localhost:3002/api/qas" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json"

# إضافة سؤال جديد
curl -X POST "http://localhost:3002/api/qas" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "question": "ما هو سند؟",
    "answer": "سند هو منصة ذكية"
  }'
```

## 🔄 معدل الطلبات

- **المصادقة**: 5 طلبات/دقيقة
- **المحادثة**: 30 طلب/دقيقة
- **إدارة البيانات**: 60 طلب/دقيقة
- **الإحصائيات**: 10 طلبات/دقيقة

## 🌐 CORS

المجالات المسموحة:
- `http://localhost:3002` (التطوير)
- `https://yourdomain.com` (الإنتاج)

## 📱 دعم الأجهزة المحمولة

جميع APIs تدعم الأجهزة المحمولة وتستجيب بتنسيق JSON متوافق.

---

**للمزيد من المساعدة، راجع [التوثيق الكامل](README.md) أو [دليل المساهمة](CONTRIBUTING.md)**