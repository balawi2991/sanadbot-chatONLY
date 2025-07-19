import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCwhDop1HFDiGBGUPClIW6zIxouOI_Ohdg")

// Function to find similar Q&A
function findSimilarQA(question: string, qas: any[]) {
  const normalizedQuestion = question.toLowerCase().trim()
  
  // First try exact match
  for (const qa of qas) {
    if (qa.question.toLowerCase().trim() === normalizedQuestion) {
      return qa
    }
  }
  
  // Then try partial match
  for (const qa of qas) {
    const qaQuestion = qa.question.toLowerCase()
    if (qaQuestion.includes(normalizedQuestion) || normalizedQuestion.includes(qaQuestion)) {
      return qa
    }
  }
  
  // Finally try keyword matching
  const questionWords = normalizedQuestion.split(' ').filter(word => word.length > 2)
  for (const qa of qas) {
    const qaWords = qa.question.toLowerCase().split(' ')
    const matchCount = questionWords.filter(word => qaWords.some(qaWord => qaWord.includes(word))).length
    if (matchCount >= Math.min(2, questionWords.length)) {
      return qa
    }
  }
  
  return null
}

// Function to generate RAG response with performance monitoring
async function generateRAGResponse(question: string, bot: any, knowledgeSources: any[], conversationHistory: any[] = []) {
  const performanceStart = performance.now()
  console.log('🚀 [Gemini] بدء معالجة الطلب:', new Date().toISOString())
  
  try {
    const setupStart = performance.now()
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    })
    const setupEnd = performance.now()
    console.log('⚙️ [Gemini] إعداد النموذج:', (setupEnd - setupStart).toFixed(2), 'ms')
    
    // Prepare context from knowledge sources
    const contextStart = performance.now()
    let context = ""
    knowledgeSources.forEach((source, index) => {
      context += `مصدر ${index + 1} (${source.title}):\n${source.content}\n\n`
    })
    
    // Prepare conversation history for context
    let historyContext = ""
    if (conversationHistory.length > 0) {
      historyContext = "\n\nسياق المحادثة السابقة:\n"
      conversationHistory.slice(-3).forEach((conv, index) => {
        historyContext += `المستخدم: ${conv.question}\nالمساعد: ${conv.answer}\n\n`
      })
    }
    
    const contextEnd = performance.now()
    console.log('📝 [Gemini] إعداد السياق:', (contextEnd - contextStart).toFixed(2), 'ms')
    console.log('📊 [Gemini] حجم السياق:', context.length + historyContext.length, 'حرف')
    console.log('💬 [Gemini] عدد المحادثات السابقة:', conversationHistory.length)
    
    // Prepare the prompt
    const prompt = `أنت مساعد ذكي اسمك "${bot.name}". شخصيتك: ${bot.personality}

المعلومات المتاحة لديك:
${context}${historyContext}

السؤال الحالي: ${question}

تعليمات:
1. أجب على السؤال بناءً على المعلومات المتاحة والسياق السابق
2. إذا لم تجد إجابة في المعلومات المتاحة، قل أنك لا تملك معلومات كافية
3. كن مفيداً ومهذباً واستخدم السياق السابق إذا كان مناسباً
4. أجب باللغة العربية
5. لا تذكر أنك تستخدم مصادر معرفية، فقط أجب بشكل طبيعي

الإجابة:`
    
    const apiStart = performance.now()
    console.log('🌐 [Gemini] إرسال الطلب إلى API:', new Date().toISOString())
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    
    const apiEnd = performance.now()
    const totalEnd = performance.now()
    
    console.log('✅ [Gemini] استلام الرد من API:', new Date().toISOString())
    console.log('⏱️ [Gemini] زمن API:', (apiEnd - apiStart).toFixed(2), 'ms')
    console.log('⏱️ [Gemini] الزمن الإجمالي:', (totalEnd - performanceStart).toFixed(2), 'ms')
    console.log('📏 [Gemini] طول الرد:', response.text().length, 'حرف')
    
    return response.text()
  } catch (error) {
    const errorEnd = performance.now()
    console.error('❌ [Gemini] خطأ في المعالجة:', error)
    console.log('⏱️ [Gemini] زمن الخطأ:', (errorEnd - performanceStart).toFixed(2), 'ms')
    return "عذراً، حدث خطأ أثناء معالجة سؤالك. يرجى المحاولة مرة أخرى."
  }
}

export async function POST(request: NextRequest) {
  const requestStart = performance.now()
  console.log('🎯 [Chat API] بدء معالجة الطلب:', new Date().toISOString())
  
  try {
    const { message, botId, clientId } = await request.json()
    
    if (!message?.trim()) {
      return NextResponse.json(
        { error: "الرسالة مطلوبة" },
        { status: 400 }
      )
    }
    
    if (!botId) {
      return NextResponse.json(
        { error: "معرف البوت مطلوب" },
        { status: 400 }
      )
    }
    
    // Get bot with related data
    const dbStart = performance.now()
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: {
        qas: {
          where: { isActive: true }
        },
        knowledgeSources: true
      }
    })
    const dbEnd = performance.now()
    console.log('🗄️ [Database] جلب بيانات البوت:', (dbEnd - dbStart).toFixed(2), 'ms')
    
    if (!bot) {
      return NextResponse.json(
        { error: "البوت غير موجود" },
        { status: 404 }
      )
    }
    
    if (!bot.isActive) {
      return NextResponse.json(
        { error: "البوت غير مفعل" },
        { status: 403 }
      )
    }
    
    // Get conversation history for context
    const historyStart = performance.now()
    const conversationHistory = await prisma.conversation.findMany({
      where: {
        botId: bot.id,
        clientId: clientId || 'anonymous'
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5 // آخر 5 محادثات للسياق
    })
    const historyEnd = performance.now()
    console.log('📚 [Database] جلب سياق المحادثة:', (historyEnd - historyStart).toFixed(2), 'ms')
    console.log('💬 [Context] عدد المحادثات السابقة:', conversationHistory.length)
    
    let response = ""
    let responseType = "fallback"
    
    // Step 1: Check for Q&A match
    const qaStart = performance.now()
    const matchedQA = findSimilarQA(message, bot.qas)
    const qaEnd = performance.now()
    console.log('🔍 [Q&A Search] البحث في الأسئلة:', (qaEnd - qaStart).toFixed(2), 'ms')
    
    if (matchedQA) {
      console.log('✅ [Q&A] تم العثور على إجابة مطابقة')
      response = matchedQA.answer
      responseType = "qa"
    } else if (bot.knowledgeSources.length > 0) {
      console.log('🤖 [RAG] استخدام Gemini مع مصادر المعرفة')
      // Step 2: Use RAG with knowledge sources and conversation history
      response = await generateRAGResponse(message, bot, bot.knowledgeSources, conversationHistory.reverse())
      responseType = "rag"
    } else {
      console.log('⚠️ [Fallback] لا توجد مصادر معرفة متاحة')
      // Step 3: Fallback response
      response = "عذراً، لا أملك معلومات كافية للإجابة على سؤالك. يمكنك التواصل مع فريق الدعم للحصول على مساعدة أكثر تفصيلاً."
      responseType = "fallback"
    }
    
    // Save conversation using new session system
    const saveStart = performance.now()
    
    // Find or create conversation session
    let conversationSession = await prisma.conversationSession.findFirst({
      where: {
        botId: bot.id,
        clientId: clientId || 'anonymous'
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    
    // Create new session if none exists or if last session is older than 1 hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    if (!conversationSession || conversationSession.updatedAt < oneHourAgo) {
      conversationSession = await prisma.conversationSession.create({
        data: {
          botId: bot.id,
          clientId: clientId || 'anonymous',
          title: message.slice(0, 50) + (message.length > 50 ? '...' : '')
        }
      })
    }
    
    // Save user message
    await prisma.message.create({
      data: {
        conversationSessionId: conversationSession.id,
        sender: 'user',
        content: message
      }
    })
    
    // Save bot response
    await prisma.message.create({
      data: {
        conversationSessionId: conversationSession.id,
        sender: 'bot',
        content: response,
        responseType
      }
    })
    
    // Update session timestamp
    await prisma.conversationSession.update({
      where: { id: conversationSession.id },
      data: { updatedAt: new Date() }
    })
    
    // Also save to old conversation table for backward compatibility
    await prisma.conversation.create({
      data: {
        botId: bot.id,
        clientId: clientId || 'anonymous',
        question: message,
        answer: response,
        responseType
      }
    })
    
    const saveEnd = performance.now()
    console.log('💾 [Database] حفظ المحادثة:', (saveEnd - saveStart).toFixed(2), 'ms')
    
    const requestEnd = performance.now()
    console.log('🏁 [Chat API] انتهاء معالجة الطلب:', (requestEnd - requestStart).toFixed(2), 'ms')
    console.log('📊 [Summary] نوع الاستجابة:', responseType)
    
    return NextResponse.json({
      response,
      responseType,
      botName: bot.name,
      performance: {
        total: (requestEnd - requestStart).toFixed(2),
        database: (dbEnd - dbStart + historyEnd - historyStart + saveEnd - saveStart).toFixed(2),
        processing: responseType === 'rag' ? 'measured_in_generateRAGResponse' : (qaEnd - qaStart).toFixed(2)
      }
    })
    
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}