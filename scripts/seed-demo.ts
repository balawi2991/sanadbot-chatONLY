import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      id: 'demo-user',
      email: 'demo@example.com',
      name: 'Demo User',
      password: 'demo-password'
    }
  })

  // Create demo bot
  const demoBot = await prisma.bot.upsert({
    where: { id: 'demo' },
    update: {},
    create: {
      id: 'demo',
      userId: demoUser.id,
      name: 'مساعد سند الذكي',
      placeholder: 'اكتب رسالتك هنا...',
      welcome: 'مرحباً! أنا مساعد سند الذكي. كيف يمكنني مساعدتك اليوم؟',
      personality: 'مساعد ذكي مفيد ومهذب يجيب على الأسئلة بطريقة واضحة ومفصلة',
      color: '#3B82F6',
      isActive: true
    }
  })

  // Create demo Q&As
  await prisma.qA.createMany({
    data: [
      {
        botId: demoBot.id,
        question: 'ما هو سند؟',
        answer: 'سند هو منصة ذكية لإنشاء مساعدين افتراضيين يمكنهم الإجابة على أسئلة العملاء بشكل تلقائي باستخدام الذكاء الاصطناعي.',
        isActive: true
      },
      {
        botId: demoBot.id,
        question: 'كيف يعمل المساعد الذكي؟',
        answer: 'يعمل المساعد الذكي من خلال تحليل أسئلة العملاء والبحث في قاعدة المعرفة المتاحة لتقديم إجابات دقيقة ومفيدة.',
        isActive: true
      },
      {
        botId: demoBot.id,
        question: 'هل يمكنني تخصيص المساعد؟',
        answer: 'نعم، يمكنك تخصيص شكل ولون وشخصية المساعد الذكي ليتناسب مع هوية علامتك التجارية.',
        isActive: true
      }
    ],
    skipDuplicates: true
  })

  // Create demo knowledge sources
  await prisma.knowledgeSource.createMany({
    data: [
      {
        botId: demoBot.id,
        type: 'text',
        title: 'معلومات عن الشركة',
        content: 'شركة سند هي شركة تقنية متخصصة في تطوير حلول الذكاء الاصطناعي للأعمال. تأسست الشركة في عام 2023 وتهدف إلى تسهيل التواصل بين الشركات وعملائها من خلال المساعدين الأذكياء.'
      },
      {
        botId: demoBot.id,
        type: 'text',
        title: 'خدماتنا',
        content: 'نقدم خدمات متنوعة تشمل: إنشاء مساعدين أذكياء مخصصين، تدريب النماذج على بيانات العملاء، تكامل المساعدين مع المواقع والتطبيقات، دعم فني متواصل، وتحليلات مفصلة لأداء المساعد.'
      }
    ],
    skipDuplicates: true
  })

  console.log('Demo data seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })