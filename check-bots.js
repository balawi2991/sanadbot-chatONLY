const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBots() {
  try {
    const bots = await prisma.bot.findMany();
    console.log('البوتات الموجودة:', bots);
    
    if (bots.length > 0) {
      console.log('سيتم استخدام البوت الأول للاختبار:', bots[0].id);
      return bots[0].id;
    } else {
      console.log('لا توجد بوتات في قاعدة البيانات');
      return null;
    }
  } catch (error) {
    console.error('خطأ في التحقق من البوتات:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBots();