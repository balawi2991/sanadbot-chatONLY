const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany();
    console.log('المستخدمون الموجودون:', users);
    
    if (users.length > 0) {
      console.log('سيتم استخدام المستخدم الأول:', users[0].id);
      return users[0].id;
    } else {
      console.log('لا يوجد مستخدمون في قاعدة البيانات');
      return null;
    }
  } catch (error) {
    console.error('خطأ في التحقق من المستخدمين:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();