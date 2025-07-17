# 🤝 دليل المساهمة في مشروع سند

نرحب بمساهماتكم في تطوير مشروع سند! هذا الدليل سيساعدكم على فهم كيفية المساهمة بفعالية.

## 📋 جدول المحتويات

- [أنواع المساهمات](#أنواع-المساهمات)
- [إعداد بيئة التطوير](#إعداد-بيئة-التطوير)
- [عملية المساهمة](#عملية-المساهمة)
- [معايير الكود](#معايير-الكود)
- [إرشادات الكوميت](#إرشادات-الكوميت)
- [اختبار التغييرات](#اختبار-التغييرات)

## 🎯 أنواع المساهمات

### 🐛 تقرير الأخطاء
- استخدم قالب Issue المخصص للأخطاء
- قدم وصفاً واضحاً للمشكلة
- أرفق لقطات شاشة إن أمكن
- اذكر خطوات إعادة إنتاج المشكلة

### ✨ طلب ميزات جديدة
- اشرح الحاجة للميزة
- قدم أمثلة على الاستخدام
- ناقش التأثير على المستخدمين

### 🔧 إصلاح الأخطاء
- ابحث عن Issues المفتوحة
- اربط PR بالـ Issue المقابل
- اختبر الإصلاح بدقة

### 🚀 إضافة ميزات
- ناقش الميزة أولاً في Issue
- اتبع التصميم الحالي
- أضف التوثيق المناسب

## 🛠️ إعداد بيئة التطوير

### المتطلبات
- Node.js 18+
- Git
- محرر نصوص (VS Code مُوصى به)

### خطوات الإعداد

1. **Fork المشروع**
```bash
# انقر على Fork في GitHub
# ثم استنسخ نسختك
git clone https://github.com/YOUR_USERNAME/sanad-bot.git
cd sanad-bot
```

2. **إضافة المستودع الأصلي**
```bash
git remote add upstream https://github.com/ORIGINAL_OWNER/sanad-bot.git
```

3. **تثبيت التبعيات**
```bash
npm install
```

4. **إعداد البيئة**
```bash
cp .env.example .env.local
# عدّل المتغيرات حسب الحاجة
```

5. **إعداد قاعدة البيانات**
```bash
npx prisma migrate dev
npx tsx scripts/seed-demo.ts
```

## 🔄 عملية المساهمة

### 1. إنشاء فرع جديد
```bash
# تحديث الفرع الرئيسي
git checkout main
git pull upstream main

# إنشاء فرع جديد
git checkout -b feature/your-feature-name
# أو
git checkout -b fix/bug-description
```

### 2. تنفيذ التغييرات
- اكتب كود نظيف ومفهوم
- اتبع معايير المشروع
- أضف تعليقات عند الحاجة

### 3. اختبار التغييرات
```bash
# تشغيل التطبيق
npm run dev

# فحص الكود
npm run lint

# بناء المشروع
npm run build
```

### 4. رفع التغييرات
```bash
git add .
git commit -m "type: description"
git push origin your-branch-name
```

### 5. إنشاء Pull Request
- اذهب إلى GitHub
- انقر على "New Pull Request"
- املأ القالب المطلوب
- اربط بالـ Issues ذات الصلة

## 📝 معايير الكود

### TypeScript
- استخدم TypeScript في جميع الملفات
- عرّف الأنواع بوضوح
- تجنب `any` قدر الإمكان

### React
- استخدم Functional Components
- استخدم Hooks بدلاً من Class Components
- اتبع نمط تسمية PascalCase للمكونات

### التنسيق
```typescript
// ✅ جيد
interface UserProps {
  id: string;
  name: string;
  email: string;
}

const UserCard: React.FC<UserProps> = ({ id, name, email }) => {
  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{email}</p>
    </div>
  );
};

// ❌ سيء
const usercard = (props: any) => {
  return <div><h3>{props.name}</h3><p>{props.email}</p></div>
}
```

### CSS/Tailwind
- استخدم Tailwind CSS للتنسيق
- اتبع نظام التصميم الموجود
- استخدم متغيرات CSS للألوان

## 📋 إرشادات الكوميت

### تنسيق الرسائل
```
type(scope): description

[optional body]

[optional footer]
```

### أنواع الكوميت
- `feat`: ميزة جديدة
- `fix`: إصلاح خطأ
- `docs`: تحديث التوثيق
- `style`: تغييرات التنسيق
- `refactor`: إعادة هيكلة الكود
- `test`: إضافة أو تحديث الاختبارات
- `chore`: مهام صيانة

### أمثلة
```bash
feat(chat): add message history feature
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
style(dashboard): improve responsive design
```

## 🧪 اختبار التغييرات

### اختبارات يدوية
1. **تسجيل الدخول والخروج**
2. **إنشاء وتعديل البوت**
3. **إضافة مصادر المعرفة**
4. **اختبار المحادثة**
5. **التنقل بين الصفحات**

### اختبار المتصفحات
- Chrome (أحدث إصدار)
- Firefox (أحدث إصدار)
- Safari (إن أمكن)
- Edge (أحدث إصدار)

### اختبار الاستجابة
- الهاتف المحمول (320px+)
- الجهاز اللوحي (768px+)
- سطح المكتب (1024px+)

## 🔍 مراجعة الكود

### ما نبحث عنه
- **الوظائف**: هل يعمل الكود كما هو متوقع؟
- **الأداء**: هل هناك تحسينات ممكنة؟
- **الأمان**: هل هناك ثغرات أمنية؟
- **القابلية للقراءة**: هل الكود واضح ومفهوم؟
- **التوافق**: هل يتبع معايير المشروع؟

### عملية المراجعة
1. مراجعة تلقائية (CI/CD)
2. مراجعة من المطورين
3. اختبار الوظائف
4. موافقة نهائية

## 🎉 بعد الموافقة

### دمج التغييرات
- سيتم دمج PR بعد الموافقة
- احذف الفرع المحلي والبعيد
- حدّث فرعك الرئيسي

```bash
# بعد الدمج
git checkout main
git pull upstream main
git branch -d your-branch-name
git push origin --delete your-branch-name
```

## 📞 الحصول على المساعدة

- **GitHub Issues**: للأسئلة التقنية
- **GitHub Discussions**: للنقاشات العامة
- **Discord**: للدردشة المباشرة (إن وُجد)

## 🙏 شكراً لكم

كل مساهمة، مهما كانت صغيرة، تساعد في تحسين مشروع سند. نقدر وقتكم وجهدكم!

---

**معاً نبني مستقبل المساعدين الأذكياء** 🚀