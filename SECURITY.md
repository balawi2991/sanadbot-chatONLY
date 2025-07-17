# 🔒 سياسة الأمان

## الإصدارات المدعومة

نحن ندعم الإصدارات التالية بتحديثات الأمان:

| الإصدار | مدعوم          |
| ------- | ------------- |
| 1.0.x   | ✅ مدعوم      |
| < 1.0   | ❌ غير مدعوم  |

## الإبلاغ عن الثغرات الأمنية

### 🚨 كيفية الإبلاغ

إذا اكتشفت ثغرة أمنية، يرجى **عدم** إنشاء Issue عام. بدلاً من ذلك:

1. **أرسل بريد إلكتروني إلى**: security@sanad.ai
2. **أو استخدم**: GitHub Security Advisories (مفضل)
3. **أو تواصل مباشرة**: عبر الرسائل الخاصة

### 📋 معلومات مطلوبة

يرجى تضمين المعلومات التالية في تقريرك:

- **وصف الثغرة**: شرح واضح للمشكلة
- **خطوات الإعادة**: كيفية إعادة إنتاج المشكلة
- **التأثير المحتمل**: ما يمكن أن يحدث إذا تم استغلال الثغرة
- **البيئة**: نظام التشغيل، المتصفح، الإصدار
- **لقطات الشاشة**: إن أمكن

### ⏱️ زمن الاستجابة

- **الاستلام**: خلال 24 ساعة
- **التقييم الأولي**: خلال 72 ساعة
- **الإصلاح**: حسب شدة المشكلة (1-30 يوم)
- **الإفصاح**: بعد الإصلاح والاختبار

## 🛡️ الممارسات الأمنية

### حماية البيانات

#### تشفير كلمات المرور
```typescript
// استخدام bcrypt لتشفير كلمات المرور
import bcrypt from 'bcryptjs';

const hashedPassword = await bcrypt.hash(password, 12);
```

#### عزل البيانات
- كل مستخدم له بياناته المنفصلة
- فلترة الاستعلامات حسب معرف المستخدم
- عدم تسريب بيانات المستخدمين الآخرين

#### الجلسات الآمنة
```typescript
// استخدام NextAuth.js مع JWT
export default NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 يوم
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
});
```

### التحقق من المدخلات

#### تنظيف البيانات
```typescript
// تنظيف وتحقق من المدخلات
const sanitizedInput = input.trim().slice(0, 1000);
if (!sanitizedInput) {
  throw new Error('Invalid input');
}
```

#### التحقق من الصلاحيات
```typescript
// التأكد من أن المستخدم يملك الصلاحية
const bot = await prisma.bot.findFirst({
  where: {
    id: botId,
    userId: session.user.id, // مهم!
  },
});

if (!bot) {
  throw new Error('Unauthorized');
}
```

### حماية API

#### معدل الطلبات
```typescript
// تحديد عدد الطلبات لمنع إساءة الاستخدام
const rateLimiter = {
  windowMs: 15 * 60 * 1000, // 15 دقيقة
  max: 100, // 100 طلب كحد أقصى
};
```

#### التحقق من المصادقة
```typescript
// التأكد من تسجيل الدخول
const session = await getServerSession(authOptions);
if (!session) {
  return NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401 }
  );
}
```

### متغيرات البيئة الآمنة

#### المتغيرات الحساسة
```env
# يجب أن تكون قوية ومعقدة
NEXTAUTH_SECRET="very-long-random-string-here"
GEMINI_API_KEY="keep-this-secret"
DATABASE_URL="postgresql://user:pass@host/db"
```

#### عدم تسريب المفاتيح
- لا تضع المفاتيح في الكود
- استخدم متغيرات البيئة دائماً
- لا ترفع ملف `.env.local` إلى Git

## 🔍 فحص الأمان

### أدوات الفحص

```bash
# فحص التبعيات للثغرات
npm audit

# إصلاح الثغرات التلقائية
npm audit fix

# فحص الكود
npm run lint
```

### فحص دوري
- فحص التبعيات شهرياً
- مراجعة الكود للممارسات الأمنية
- اختبار الاختراق الأساسي
- تحديث التبعيات بانتظام

## 🚫 ما يجب تجنبه

### مخاطر شائعة

❌ **تسريب المعلومات الحساسة**
```typescript
// خطأ: تسريب معلومات المستخدم
return { user: fullUserObject };

// صحيح: إرجاع المعلومات الضرورية فقط
return { user: { id: user.id, name: user.name } };
```

❌ **SQL Injection**
```typescript
// خطأ: استعلام مباشر
const query = `SELECT * FROM users WHERE id = ${userId}`;

// صحيح: استخدام Prisma ORM
const user = await prisma.user.findUnique({ where: { id: userId } });
```

❌ **XSS (Cross-Site Scripting)**
```typescript
// خطأ: عرض HTML مباشر
dangerouslySetInnerHTML={{ __html: userInput }}

// صحيح: تنظيف المحتوى
{sanitizeHtml(userInput)}
```

❌ **CSRF (Cross-Site Request Forgery)**
```typescript
// خطأ: عدم التحقق من المصدر
if (req.method === 'POST') {
  // تنفيذ العملية مباشرة
}

// صحيح: التحقق من الجلسة والصلاحيات
if (req.method === 'POST' && session && isAuthorized) {
  // تنفيذ العملية
}
```

## 📚 موارد إضافية

### دلائل الأمان
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Prisma Security](https://www.prisma.io/docs/concepts/components/prisma-client/working-with-prismaclient/connection-management#security)

### أدوات مفيدة
- [Snyk](https://snyk.io/) - فحص الثغرات
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - فحص التبعيات
- [ESLint Security](https://github.com/nodesecurity/eslint-plugin-security) - قواعد الأمان

## 🏆 برنامج المكافآت

حالياً لا يوجد برنامج مكافآت رسمي، لكننا نقدر جهود الباحثين الأمنيين ونعترف بمساهماتهم في:

- ملف الشكر والتقدير
- صفحة المساهمين
- الإشارة في ملاحظات الإصدار

---

**الأمان مسؤولية الجميع. شكراً لمساعدتنا في الحفاظ على أمان سند!** 🛡️