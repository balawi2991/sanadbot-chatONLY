const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestBot() {
  try {
    const testBot = await prisma.bot.create({
      data: {
        id: 'test-bot-embed',
        name: 'بوت الاختبار',
        color: '#667eea',
        logo: null,
        avatar: null,
        placeholder: 'اسألني أي شيء للاختبار...',
        welcome: 'مرحباً! أنا بوت اختبار للتضمين المباشر. كيف يمكنني مساعدتك؟',
        personality: 'أنت مساعد ذكي ومفيد للاختبار.',
        isActive: true,
        userId: 'cmd6wlof00000vprkl8fiflo5' // المستخدم الأول الموجود
      }
    });
    
    console.log('تم إنشاء بوت الاختبار بنجاح:', testBot);
  } catch (error) {
    console.error('خطأ في إنشاء بوت الاختبار:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestBot();