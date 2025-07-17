import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedTestUser() {
  try {
    console.log('🌱 إنشاء مستخدم تجريبي...')
    
    // إنشاء مستخدم تجريبي
    const hashedPassword = await bcrypt.hash('test123', 10)
    
    const testUser = await prisma.user.upsert({
      where: { email: 'test@example.com' },
      update: {},
      create: {
        name: 'مستخدم تجريبي',
        email: 'test@example.com',
        password: hashedPassword
      }
    })
    
    console.log('✅ تم إنشاء المستخدم التجريبي:', testUser.email)
    
    // إنشاء بوت للمستخدم التجريبي
    const testBot = await prisma.bot.upsert({
      where: { userId: testUser.id },
      update: {},
      create: {
        userId: testUser.id,
        name: 'مساعد الشركة الذكي',
        color: '#10B981',
        placeholder: 'اسأل عن خدمات الشركة...',
        welcome: 'مرحباً! أنا مساعد الشركة الذكي. كيف يمكنني مساعدتك اليوم؟',
        personality: 'أنت مساعد ذكي ومفيد لشركة تقنية. تتميز بالمهنية والود في التعامل مع العملاء. تقدم معلومات دقيقة ومفيدة عن خدمات الشركة.',
        isActive: true
      }
    })
    
    console.log('✅ تم إنشاء البوت:', testBot.name)
    
    // إضافة أسئلة وأجوبة للبوت التجريبي
    const testQAs = [
      {
        question: 'ما هي خدمات الشركة؟',
        answer: 'نحن نقدم خدمات تطوير المواقع الإلكترونية، تطبيقات الهاتف المحمول، والحلول التقنية المتقدمة للشركات.',
        isActive: true
      },
      {
        question: 'كيف يمكنني التواصل معكم؟',
        answer: 'يمكنك التواصل معنا عبر البريد الإلكتروني: info@company.com أو الهاتف: +966123456789',
        isActive: true
      },
      {
        question: 'ما هي أوقات العمل؟',
        answer: 'نعمل من الأحد إلى الخميس من الساعة 9 صباحاً حتى 6 مساءً بتوقيت الرياض.',
        isActive: true
      },
      {
        question: 'هل تقدمون خدمات الصيانة؟',
        answer: 'نعم، نقدم خدمات الصيانة والدعم التقني لجميع مشاريعنا مع ضمان لمدة سنة كاملة.',
        isActive: true
      }
    ]
    
    for (const qa of testQAs) {
      await prisma.qA.create({
        data: {
          ...qa,
          botId: testBot.id
        }
      })
    }
    
    console.log('✅ تم إضافة', testQAs.length, 'أسئلة وأجوبة')
    
    // إضافة مصادر معرفة للبوت التجريبي
    const knowledgeSources = [
      {
        title: 'معلومات الشركة',
        content: `شركة التقنيات المتقدمة هي شركة رائدة في مجال تطوير الحلول التقنية.
        
خدماتنا:
        - تطوير المواقع الإلكترونية
        - تطبيقات الهاتف المحمول
        - أنظمة إدارة المحتوى
        - التجارة الإلكترونية
        - الذكاء الاصطناعي
        
رؤيتنا: أن نكون الشريك التقني الأول للشركات في المنطقة.
        
مهمتنا: تقديم حلول تقنية مبتكرة تساعد عملاءنا على تحقيق أهدافهم.`,
        type: 'text',
        url: null
      },
      {
        title: 'سياسة الخصوصية',
        content: `نحن نحترم خصوصية عملائنا ونلتزم بحماية بياناتهم الشخصية.
        
ما نجمعه:
        - المعلومات الأساسية للتواصل
        - بيانات استخدام الموقع
        - معلومات المشاريع
        
كيف نستخدمها:
        - تحسين خدماتنا
        - التواصل مع العملاء
        - تطوير حلول مخصصة
        
نحن لا نشارك بياناتك مع أطراف ثالثة دون موافقتك الصريحة.`,
        type: 'text',
        url: null
      }
    ]
    
    for (const source of knowledgeSources) {
      await prisma.knowledgeSource.create({
        data: {
          ...source,
          botId: testBot.id
        }
      })
    }
    
    console.log('✅ تم إضافة', knowledgeSources.length, 'مصادر معرفة')
    
    console.log('\n🎉 تم إنشاء المستخدم التجريبي بنجاح!')
    console.log('📧 البريد الإلكتروني: test@example.com')
    console.log('🔑 كلمة المرور: test123')
    console.log('🤖 معرف البوت:', testBot.id)
    console.log('🔗 رابط الاختبار: http://localhost:3002/test/' + testBot.id)
    
  } catch (error) {
    console.error('❌ خطأ في إنشاء المستخدم التجريبي:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedTestUser()