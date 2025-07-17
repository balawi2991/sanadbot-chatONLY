# 🏗️ هيكل وبنية المشروع

هذا الملف يوضح البنية التقنية والمعمارية لمشروع سند.

## 📊 نظرة عامة على البنية

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   المستخدم      │    │   ChatWidget    │    │  External Bot   │
│   Dashboard     │    │   Component     │    │   Integration   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴─────────────┐
                    │      Next.js App         │
                    │   (Frontend + Backend)   │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │      API Routes          │
                    │  /api/auth, /api/chat    │
                    │  /api/bot, /api/qas      │
                    └─────────────┬─────────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │    Business Logic        │
                    │   (Services & Utils)     │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
┌─────────┴─────────┐   ┌─────────┴─────────┐   ┌─────────┴─────────┐
│   Database        │   │   Gemini AI       │   │   File System    │
│   (PostgreSQL)    │   │   Integration     │   │   (Uploads)       │
└───────────────────┘   └───────────────────┘   └───────────────────┘
```

## 🎯 المبادئ المعمارية

### 1. **فصل الاهتمامات (Separation of Concerns)**
- **Frontend**: React components للواجهة
- **Backend**: API routes للمنطق
- **Database**: Prisma ORM لإدارة البيانات
- **AI**: منطق منفصل للذكاء الاصطناعي

### 2. **الأمان أولاً (Security First)**
- مصادقة قوية مع NextAuth.js
- عزل البيانات بين المستخدمين
- تشفير كلمات المرور
- حماية من CSRF و XSS

### 3. **قابلية التوسع (Scalability)**
- بنية modular قابلة للتوسع
- استخدام React Server Components
- تحسين الاستعلامات
- دعم التخزين المؤقت

### 4. **تجربة المستخدم (User Experience)**
- واجهة سريعة الاستجابة
- تحديثات فورية
- رسائل خطأ واضحة
- دعم الأجهزة المحمولة

## 📁 هيكل المجلدات

```
sanad-bot/
├── 📁 src/
│   ├── 📁 app/                    # Next.js App Router
│   │   ├── 📁 api/               # API Routes
│   │   │   ├── 📁 auth/          # المصادقة
│   │   │   ├── 📁 bot/           # إدارة البوت
│   │   │   ├── 📁 chat/          # المحادثة
│   │   │   ├── 📁 qas/           # الأسئلة والأجوبة
│   │   │   └── 📁 knowledge-sources/ # مصادر المعرفة
│   │   ├── 📁 dashboard/         # لوحة التحكم
│   │   │   ├── 📁 appearance/    # صفحة المظهر
│   │   │   ├── 📁 training/      # صفحة التدريب
│   │   │   └── 📁 qa/           # صفحة الأسئلة
│   │   ├── 📁 test/             # صفحة اختبار البوت
│   │   ├── 📁 auth/             # صفحات المصادقة
│   │   └── 📄 layout.tsx        # التخطيط الرئيسي
│   ├── 📁 components/            # مكونات React
│   │   ├── 📁 ui/               # مكونات الواجهة
│   │   ├── 📁 dashboard/        # مكونات لوحة التحكم
│   │   └── 📁 chat/             # مكونات المحادثة
│   ├── 📁 lib/                  # المكتبات والأدوات
│   │   ├── 📄 auth.ts           # إعدادات المصادقة
│   │   ├── 📄 db.ts             # اتصال قاعدة البيانات
│   │   ├── 📄 gemini.ts         # تكامل Gemini AI
│   │   └── 📄 utils.ts          # أدوات مساعدة
│   └── 📁 types/                # تعريفات TypeScript
├── 📁 prisma/                   # إعدادات قاعدة البيانات
│   ├── 📄 schema.prisma         # مخطط قاعدة البيانات
│   ├── 📄 seed.ts              # بيانات تجريبية
│   └── 📁 migrations/          # ملفات الترحيل
├── 📁 public/                   # الملفات العامة
├── 📁 uploads/                  # ملفات المستخدمين
└── 📄 package.json             # تبعيات المشروع
```

## 🔄 تدفق البيانات

### 1. **تدفق المصادقة**
```
User Login → NextAuth.js → Database → Session → Protected Routes
```

### 2. **تدفق المحادثة**
```
User Message → API Route → Search Q&A → RAG + Gemini → Response → Save to DB
```

### 3. **تدفق إدارة البيانات**
```
User Input → Form Validation → API Route → Prisma → Database → UI Update
```

## 🧩 المكونات الأساسية

### 1. **Frontend Components**

#### ChatWidget
```typescript
// المكون الرئيسي للمحادثة
interface ChatWidgetProps {
  botId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  welcomeMessage?: string;
  placeholderText?: string;
}
```

#### Dashboard Layout
```typescript
// تخطيط لوحة التحكم
interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}
```

### 2. **Backend Services**

#### Authentication Service
```typescript
// خدمة المصادقة
class AuthService {
  async signUp(userData: SignUpData): Promise<User>
  async signIn(credentials: Credentials): Promise<Session>
  async getSession(): Promise<Session | null>
}
```

#### Chat Service
```typescript
// خدمة المحادثة
class ChatService {
  async processMessage(message: string, botId: string): Promise<ChatResponse>
  async searchQA(query: string, botId: string): Promise<QA | null>
  async generateRAGResponse(query: string, context: string): Promise<string>
}
```

#### Bot Service
```typescript
// خدمة إدارة البوت
class BotService {
  async getBotByUserId(userId: string): Promise<Bot>
  async updateBot(botId: string, data: BotUpdateData): Promise<Bot>
  async getBotStats(botId: string): Promise<BotStats>
}
```

## 🗄️ نموذج قاعدة البيانات

### العلاقات الأساسية
```
User (1) ──── (1) Bot
  │
  └── (1:N) Conversation

Bot (1) ──── (N) QA
  │
  ├── (N) KnowledgeSource
  │
  └── (N) Conversation
```

### الجداول الرئيسية

#### User
```sql
CREATE TABLE "User" (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

#### Bot
```sql
CREATE TABLE "Bot" (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL REFERENCES "User"(id),
  name TEXT NOT NULL,
  primaryColor TEXT DEFAULT '#3B82F6',
  secondaryColor TEXT DEFAULT '#EFF6FF',
  welcomeMessage TEXT,
  placeholderText TEXT,
  personality TEXT,
  fallbackMessage TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);
```

## 🤖 تكامل الذكاء الاصطناعي

### 1. **معالجة الرسائل**
```typescript
// خوارزمية معالجة الرسائل
async function processMessage(message: string, botId: string) {
  // 1. البحث في Q&A
  const qaResult = await searchQA(message, botId);
  if (qaResult) {
    return { response: qaResult.answer, source: 'qa' };
  }
  
  // 2. استخدام RAG + Gemini
  const context = await getRelevantContext(message, botId);
  if (context) {
    const response = await generateRAGResponse(message, context);
    return { response, source: 'rag' };
  }
  
  // 3. الرد الاحتياطي
  const bot = await getBotById(botId);
  return { response: bot.fallbackMessage, source: 'fallback' };
}
```

### 2. **RAG Implementation**
```typescript
// تنفيذ RAG (Retrieval-Augmented Generation)
class RAGService {
  async getRelevantContext(query: string, botId: string): Promise<string> {
    // جلب مصادر المعرفة ذات الصلة
    const sources = await this.searchKnowledgeSources(query, botId);
    
    // دمج المحتوى
    return sources.map(s => s.content).join('\n\n');
  }
  
  async generateResponse(query: string, context: string): Promise<string> {
    const prompt = this.buildPrompt(query, context);
    return await this.geminiService.generate(prompt);
  }
}
```

## 🔒 الأمان والحماية

### 1. **طبقات الأمان**
```
┌─────────────────────────────────────┐
│           User Interface            │
├─────────────────────────────────────┤
│         Input Validation            │
├─────────────────────────────────────┤
│         Authentication              │
├─────────────────────────────────────┤
│         Authorization               │
├─────────────────────────────────────┤
│         Data Isolation              │
├─────────────────────────────────────┤
│         Database Security           │
└─────────────────────────────────────┘
```

### 2. **تنفيذ الأمان**
```typescript
// middleware للحماية
export async function authMiddleware(req: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.redirect('/auth/signin');
  }
  
  // التحقق من الصلاحيات
  const hasAccess = await checkUserAccess(session.user.id, req.url);
  if (!hasAccess) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  
  return NextResponse.next();
}
```

## 📱 الاستجابة والأجهزة المحمولة

### 1. **نقاط التوقف (Breakpoints)**
```css
/* Tailwind CSS Breakpoints */
sm: 640px   /* الهواتف الكبيرة */
md: 768px   /* الأجهزة اللوحية */
lg: 1024px  /* أجهزة الكمبيوتر الصغيرة */
xl: 1280px  /* أجهزة الكمبيوتر الكبيرة */
2xl: 1536px /* الشاشات الكبيرة جداً */
```

### 2. **تصميم متجاوب**
```typescript
// مكون متجاوب
function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="
      grid 
      grid-cols-1 
      md:grid-cols-2 
      lg:grid-cols-3 
      gap-4 
      p-4
    ">
      {children}
    </div>
  );
}
```

## ⚡ تحسين الأداء

### 1. **استراتيجيات التحسين**
- **Code Splitting**: تقسيم الكود لتحميل أسرع
- **Lazy Loading**: تحميل المكونات عند الحاجة
- **Caching**: تخزين مؤقت للبيانات
- **Database Indexing**: فهرسة قاعدة البيانات

### 2. **تنفيذ التحسين**
```typescript
// Lazy loading للمكونات
const ChatWidget = lazy(() => import('./components/ChatWidget'));

// React Query للتخزين المؤقت
const { data: bot, isLoading } = useQuery({
  queryKey: ['bot', botId],
  queryFn: () => fetchBot(botId),
  staleTime: 5 * 60 * 1000, // 5 دقائق
});
```

## 🔄 إدارة الحالة

### 1. **استراتيجية إدارة الحالة**
```
┌─────────────────┐
│   Server State  │ ← React Query/SWR
├─────────────────┤
│   Client State  │ ← React useState/useReducer
├─────────────────┤
│   URL State     │ ← Next.js Router
├─────────────────┤
│   Form State    │ ← React Hook Form
└─────────────────┘
```

### 2. **تنفيذ إدارة الحالة**
```typescript
// Context للحالة العامة
const AppContext = createContext<AppState | null>(null);

// Hook مخصص للحالة
function useAppState() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
}
```

## 🧪 الاختبار

### 1. **استراتيجية الاختبار**
```
┌─────────────────┐
│   E2E Tests     │ ← Playwright/Cypress
├─────────────────┤
│ Integration     │ ← Jest + Testing Library
├─────────────────┤
│   Unit Tests    │ ← Jest + React Testing Library
├─────────────────┤
│   Type Safety   │ ← TypeScript
└─────────────────┘
```

### 2. **أمثلة الاختبار**
```typescript
// اختبار وحدة
describe('ChatService', () => {
  it('should process message correctly', async () => {
    const result = await chatService.processMessage('مرحباً', 'bot-id');
    expect(result.response).toBeDefined();
    expect(result.source).toBeOneOf(['qa', 'rag', 'fallback']);
  });
});

// اختبار تكامل
describe('Chat API', () => {
  it('should return valid response', async () => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: 'test', botId: 'test-bot' })
    });
    
    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data.response).toBeDefined();
  });
});
```

## 📈 المراقبة والتحليل

### 1. **مؤشرات الأداء الرئيسية**
- **Response Time**: زمن الاستجابة
- **Error Rate**: معدل الأخطاء
- **User Engagement**: تفاعل المستخدمين
- **Conversion Rate**: معدل التحويل

### 2. **أدوات المراقبة**
```typescript
// تتبع الأحداث
function trackEvent(event: string, properties?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, properties);
  }
}

// مراقبة الأخطاء
function logError(error: Error, context?: string) {
  console.error(`[${context}]`, error);
  
  // إرسال للخدمة المراقبة
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket, etc.
  }
}
```

## 🚀 التطوير المستقبلي

### 1. **الميزات المخططة**
- **Multi-language Support**: دعم لغات متعددة
- **Advanced Analytics**: تحليلات متقدمة
- **API Integrations**: تكاملات API خارجية
- **Mobile App**: تطبيق محمول

### 2. **التحسينات التقنية**
- **Microservices**: تحويل لخدمات مصغرة
- **GraphQL**: استخدام GraphQL
- **Real-time**: تحديثات فورية
- **Edge Computing**: حوسبة الحافة

---

**للمزيد من التفاصيل التقنية، راجع:**
- [دليل التطوير](CONTRIBUTING.md)
- [توثيق API](API.md)
- [دليل النشر](DEPLOYMENT.md)