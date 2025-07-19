# نظرة شاملة على هيكل النظام - System Architecture Overview

## جدول المحتويات
- [نظرة عامة](#نظرة-عامة)
- [هيكل قاعدة البيانات](#هيكل-قاعدة-البيانات)
- [منطق عمل البوت الأساسي](#منطق-عمل-البوت-الأساسي)
- [منطق عمل البوت المُضمّن](#منطق-عمل-البوت-المُضمّن)
- [تدفق البيانات](#تدفق-البيانات)
- [الأمان وعزل البيانات](#الأمان-وعزل-البيانات)

## نظرة عامة

سند بوت هو نظام SaaS متعدد المستخدمين يوفر مساعد ذكي قابل للتضمين. النظام مبني على:

- **Next.js 15** للواجهة الأمامية والخلفية
- **Prisma ORM** لإدارة قاعدة البيانات
- **PostgreSQL** لقاعدة البيانات الإنتاجية
- **Google Gemini AI** للذكاء الاصطناعي
- **NextAuth.js** للمصادقة والأمان

## هيكل قاعدة البيانات

### الجداول الأساسية

#### 1. جدول المستخدمين (users)
```sql
CREATE TABLE users (
  id          VARCHAR PRIMARY KEY,  -- معرف فريد (cuid)
  email       VARCHAR UNIQUE,       -- البريد الإلكتروني
  name        VARCHAR,              -- اسم المستخدم (اختياري)
  password    VARCHAR,              -- كلمة المرور المشفرة
  created_at  TIMESTAMP,            -- تاريخ الإنشاء
  updated_at  TIMESTAMP             -- تاريخ آخر تحديث
);
```

#### 2. جدول البوتات (bots)
```sql
CREATE TABLE bots (
  id          VARCHAR PRIMARY KEY,  -- معرف البوت
  user_id     VARCHAR UNIQUE,       -- مرجع للمستخدم (علاقة 1:1)
  name        VARCHAR DEFAULT 'مساعد سند',
  color       VARCHAR DEFAULT '#3B82F6',
  logo        VARCHAR,              -- رابط الشعار
  avatar      VARCHAR,              -- رابط الصورة الرمزية
  placeholder VARCHAR DEFAULT 'اكتب رسالتك هنا...',
  welcome     VARCHAR DEFAULT 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
  personality VARCHAR DEFAULT 'أنا مساعد ذكي ومفيد...',
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMP,
  updated_at  TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

#### 3. جدول مصادر المعرفة (knowledge_sources)
```sql
CREATE TABLE knowledge_sources (
  id         VARCHAR PRIMARY KEY,
  bot_id     VARCHAR,              -- مرجع للبوت
  type       VARCHAR,              -- "file", "link", "text"
  title      VARCHAR,              -- عنوان المصدر
  content    TEXT,                 -- المحتوى النصي
  url        VARCHAR,              -- الرابط (للنوع link)
  filename   VARCHAR,              -- اسم الملف (للنوع file)
  filesize   INTEGER,              -- حجم الملف
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE
);
```

#### 4. جدول الأسئلة والأجوبة (qas)
```sql
CREATE TABLE qas (
  id         VARCHAR PRIMARY KEY,
  bot_id     VARCHAR,              -- مرجع للبوت
  question   VARCHAR,              -- السؤال
  answer     TEXT,                 -- الجواب
  is_active  BOOLEAN DEFAULT true, -- حالة التفعيل
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  
  FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE
);
```

#### 5. جدول المحادثات (conversations)
```sql
CREATE TABLE conversations (
  id            VARCHAR PRIMARY KEY,
  bot_id        VARCHAR,           -- مرجع للبوت
  client_id     VARCHAR,           -- معرف العميل المجهول
  question      TEXT,              -- سؤال المستخدم
  answer        TEXT,              -- جواب البوت
  response_type VARCHAR,           -- "qa", "rag", "fallback"
  created_at    TIMESTAMP,
  
  FOREIGN KEY (bot_id) REFERENCES bots(id) ON DELETE CASCADE
);
```

### العلاقات بين الجداول (ERD)

```
users (1) ←→ (1) bots
  ↓
bots (1) ←→ (n) knowledge_sources
  ↓
bots (1) ←→ (n) qas
  ↓
bots (1) ←→ (n) conversations
```

### كيفية حفظ وتحديث البيانات

#### إنشاء مستخدم جديد
```typescript
// عند التسجيل، يتم إنشاء مستخدم وبوت افتراضي
const user = await prisma.user.create({
  data: {
    email,
    name,
    password: hashedPassword,
    bot: {
      create: {
        name: 'مساعد سند',
        color: '#3B82F6',
        // ... باقي الإعدادات الافتراضية
      }
    }
  },
  include: { bot: true }
});
```

#### تحديث تخصيصات البوت
```typescript
// تحديث مظهر البوت
const updatedBot = await prisma.bot.update({
  where: { userId: session.user.id },
  data: {
    name,
    color,
    placeholder,
    welcome,
    personality
  }
});
```

#### إضافة مصدر معرفة
```typescript
const knowledgeSource = await prisma.knowledgeSource.create({
  data: {
    botId,
    type: 'text', // أو 'file' أو 'link'
    title,
    content,
    url: type === 'link' ? url : null,
    filename: type === 'file' ? filename : null
  }
});
```

## منطق عمل البوت الأساسي (داخل المنصة)

### 1. تحميل الإعدادات من agent config

```typescript
// في ChatWidget.tsx
const { data: bot } = useSWR('/api/bot', fetcher);

// تحميل البيانات من API
export async function GET() {
  const session = await getServerSession(authOptions);
  const bot = await prisma.bot.findUnique({
    where: { userId: session.user.id },
    include: {
      knowledgeSources: true,
      qas: { where: { isActive: true } }
    }
  });
  return NextResponse.json(bot);
}
```

### 2. تشغيل البوت عبر ChatWidget.tsx و WidgetBar.tsx

```typescript
// ChatWidget.tsx - المكون الرئيسي
function ChatWidget({ bot }: { bot: Bot }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  
  // تطبيق التخصيصات
  const widgetStyle = {
    '--primary-color': bot.color,
    '--bot-name': bot.name
  } as CSSProperties;
  
  return (
    <div className="chat-widget" style={widgetStyle}>
      {isOpen ? (
        <WidgetExpanded 
          bot={bot}
          messages={messages}
          onSendMessage={handleSendMessage}
        />
      ) : (
        <WidgetBar 
          bot={bot}
          onToggle={() => setIsOpen(true)}
        />
      )}
    </div>
  );
}
```

### 3. إرسال الرسائل عبر RAG أو Gemini

```typescript
// في handleSendMessage
const handleSendMessage = async (message: string) => {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        botId: bot.id,
        clientId: `dashboard-${bot.id}`
      })
    });
    
    const data = await response.json();
    setMessages(prev => [...prev, 
      { text: message, isUser: true },
      { text: data.response, isUser: false }
    ]);
  } catch (error) {
    console.error('خطأ في إرسال الرسالة:', error);
  }
};
```

### 4. استرجاع الردود وتخزين المحادثة

```typescript
// في /api/chat/route.ts
export async function POST(request: Request) {
  const { message, botId, clientId } = await request.json();
  
  // 1. البحث في Q&A أولاً
  const qaMatch = await findSimilarQA(botId, message);
  if (qaMatch) {
    await saveConversation(botId, clientId, message, qaMatch.answer, 'qa');
    return NextResponse.json({ response: qaMatch.answer });
  }
  
  // 2. استخدام RAG مع Gemini
  const ragResponse = await generateRAGResponse(botId, message);
  await saveConversation(botId, clientId, message, ragResponse, 'rag');
  
  return NextResponse.json({ response: ragResponse });
}
```

## منطق عمل البوت المُضمّن (embed)

### 1. تحميل السكربت من widget-generator.ts

```typescript
// /api/widget/[botId]/route.ts
export async function GET(request: Request, { params }: { params: { botId: string } }) {
  // جلب بيانات البوت
  const bot = await prisma.bot.findUnique({
    where: { id: params.botId, isActive: true }
  });
  
  if (!bot) {
    return new Response('البوت غير موجود', { status: 404 });
  }
  
  // توليد كود JavaScript مخصص
  const widgetCode = generateEmbedCode(bot);
  
  return new Response(widgetCode, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'public, max-age=300'
    }
  });
}
```

### 2. قراءة data-bot-id من التضمين

```javascript
// في embed.js
(function() {
  // البحث عن العنصر مع data-bot-id
  const embedElement = document.querySelector('[data-bot-id]');
  const botId = embedElement?.getAttribute('data-bot-id');
  
  if (!botId) {
    console.error('معرف البوت مطلوب');
    return;
  }
  
  // تحميل كود البوت المخصص
  loadBotWidget(botId);
})();
```

### 3. تحميل التخصيص من /api/agents/[id]/theme

```typescript
// /api/agents/[id]/theme/route.ts
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const bot = await prisma.bot.findUnique({
    where: { id: params.id },
    select: {
      name: true,
      color: true,
      logo: true,
      avatar: true,
      placeholder: true,
      welcome: true,
      personality: true
    }
  });
  
  return NextResponse.json(bot);
}
```

### 4. إظهار البوت بنفس السلوك والتخصيص

```javascript
// في الكود المولد
function generateEmbedCode(bot) {
  return `
    (function() {
      const BOT_CONFIG = ${JSON.stringify({
        id: bot.id,
        name: bot.name,
        color: bot.color,
        placeholder: bot.placeholder,
        welcome: bot.welcome,
        personality: bot.personality
      })};
      
      // إنشاء نفس مكونات ChatWidget
      function createWidget() {
        // نفس منطق ChatWidget.tsx لكن في JavaScript خالص
        const widget = document.createElement('div');
        widget.className = 'sanad-chat-widget';
        widget.style.setProperty('--primary-color', BOT_CONFIG.color);
        
        // إضافة الشريط السفلي والنافذة المنبثقة
        createWidgetBar(widget);
        createWidgetModal(widget);
        
        document.body.appendChild(widget);
      }
      
      // نفس منطق إرسال الرسائل
      function sendMessage(message) {
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            botId: BOT_CONFIG.id,
            clientId: 'widget-embed-' + BOT_CONFIG.id
          })
        })
        .then(response => response.json())
        .then(data => displayMessage(data.response));
      }
      
      // تهيئة البوت
      createWidget();
    })();
  `;
}
```

## تدفق البيانات

### في المنصة (Dashboard)
```
User Login → Load Bot Config → Display ChatWidget → Send Message → 
/api/chat → Process (Q&A/RAG) → Save Conversation → Return Response
```

### في التضمين (Embed)
```
Load embed.js → Read data-bot-id → Fetch /api/widget/[botId] → 
Generate Custom Code → Create Widget → Send Message → /api/chat → 
Process & Save → Return Response
```

### معالجة الرسائل
```
Message Input → Check Q&A Database → If Found: Return Q&A Answer
                                   → If Not Found: Use RAG System
                                                  → Fetch Knowledge Sources
                                                  → Generate Context
                                                  → Send to Gemini AI
                                                  → Return AI Response
→ Save Conversation → Display to User
```

## الأمان وعزل البيانات

### عزل البيانات
- كل مستخدم له `userId` فريد
- كل بوت مرتبط بمستخدم واحد فقط
- جميع البيانات (مصادر المعرفة، Q&A، المحادثات) مرتبطة بـ `botId`
- استخدام `ON DELETE CASCADE` لضمان حذف البيانات المرتبطة

### الأمان
```typescript
// التحقق من الملكية قبل الوصول للبيانات
const bot = await prisma.bot.findFirst({
  where: {
    id: botId,
    userId: session.user.id  // التأكد من أن البوت يخص المستخدم الحالي
  }
});

if (!bot) {
  return new Response('غير مصرح', { status: 403 });
}
```

### تشفير البيانات
- كلمات المرور مشفرة باستخدام bcrypt
- الجلسات محمية بـ JWT
- متغيرات البيئة الحساسة محمية
- استخدام HTTPS في الإنتاج

---

**ملاحظة**: هذا التوثيق يوفر فهماً شاملاً لهيكل النظام وآلية عمله، مما يسهل على المطورين الجدد فهم المشروع والمساهمة فيه بفعالية.