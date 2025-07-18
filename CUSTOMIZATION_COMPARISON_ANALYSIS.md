# تحليل مقارنة التخصيصات بين نظام المعاينة ونظام التضمين

## المشكلة المحددة
البوت المُضمن لا يعكس بدقة التخصيصات المحددة في لوحة التحكم مقارنة بنسخة المعاينة.

## تحليل مصادر البيانات

### 1. نظام المعاينة (صفحة الاختبار)
**المسار:** `/test/[botId]`
**API Endpoint:** `/api/bot/[botId]`
**الملف:** `src/app/api/bot/[botId]/route.ts`

```typescript
// البيانات المُرجعة من API المعاينة
return NextResponse.json({
  id: bot.id,
  name: bot.name,
  color: bot.color,
  logo: bot.logo,
  avatar: bot.avatar,
  placeholder: bot.placeholder,
  welcomeMessage: bot.welcome,  // ⚠️ تحويل من welcome إلى welcomeMessage
  personality: bot.personality,
  isActive: bot.isActive,
  _count: bot._count
})
```

### 2. نظام التضمين
**API Endpoint:** `/api/widget/[botId]`
**الملف:** `src/lib/widget-core.ts`

```typescript
// البيانات المُرجعة من widget-core
const config: BotConfig = {
  id: bot.id,
  name: bot.name,
  color: bot.color,
  logo: bot.logo,
  avatar: bot.avatar,
  placeholder: bot.placeholder,
  welcomeMessage: bot.welcome,  // ⚠️ نفس التحويل
  personality: bot.personality,
  isActive: bot.isActive
}
```

## مقارنة الخصائص

| الخاصية | قاعدة البيانات | API المعاينة | API التضمين | التطابق |
|---------|----------------|---------------|-------------|----------|
| الاسم | `bot.name` | `bot.name` | `bot.name` | ✅ |
| اللون | `bot.color` | `bot.color` | `bot.color` | ✅ |
| الشعار | `bot.logo` | `bot.logo` | `bot.logo` | ✅ |
| الصورة الرمزية | `bot.avatar` | `bot.avatar` | `bot.avatar` | ✅ |
| نص الإدخال | `bot.placeholder` | `bot.placeholder` | `bot.placeholder` | ✅ |
| الرسالة الترحيبية | `bot.welcome` | `bot.welcome` → `welcomeMessage` | `bot.welcome` → `welcomeMessage` | ✅ |
| وصف الشخصية | `bot.personality` | `bot.personality` | `bot.personality` | ✅ |

## تحليل widget-generator.ts

```typescript
// في generateWidgetScript
const config = {
  id: bot.id,
  name: bot.name,
  color: bot.color,
  logo: bot.logo,
  avatar: bot.avatar,
  placeholder: bot.placeholder,
  welcomeMessage: bot.welcomeMessage,  // ✅ يستخدم البيانات المحولة
  personality: bot.personality
}
```

## النتيجة الأولية
**✅ البيانات متطابقة نظرياً** - كلا النظامين يحصلان على نفس البيانات من قاعدة البيانات.

## الخطوات التالية للتحقق
1. فحص كيفية استخدام البيانات في الواجهة
2. التحقق من القيم الافتراضية المستخدمة
3. فحص أي تحويلات إضافية في العرض
4. اختبار عملي للمقارنة

## ملاحظات مهمة
- كلا النظامين يستخدمان نفس قاعدة البيانات
- التحويل من `welcome` إلى `welcomeMessage` يحدث في كلا النظامين
- لا توجد اختلافات واضحة في مصدر البيانات

**الاستنتاج:** المشكلة قد تكون في طريقة عرض أو استخدام البيانات وليس في مصدرها.