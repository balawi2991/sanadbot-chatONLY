import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "AIzaSyCTWpfizB5kXGPgrtFuGgJtngsfjfqNim4")

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

// Function to generate RAG response
async function generateRAGResponse(question: string, bot: any, knowledgeSources: any[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    
    // Prepare context from knowledge sources
    let context = ""
    knowledgeSources.forEach((source, index) => {
      context += `مصدر ${index + 1} (${source.title}):\n${source.content}\n\n`
    })
    
    // Prepare the prompt
    const prompt = `أنت مساعد ذكي اسمك "${bot.name}". شخصيتك: ${bot.personality}

المعلومات المتاحة لديك:
${context}

السؤال: ${question}

تعليمات:
1. أجب على السؤال بناءً على المعلومات المتاحة فقط
2. إذا لم تجد إجابة في المعلومات المتاحة، قل أنك لا تملك معلومات كافية
3. كن مفيداً ومهذباً
4. أجب باللغة العربية
5. لا تذكر أنك تستخدم مصادر معرفية، فقط أجب بشكل طبيعي

الإجابة:`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    return response.text()
  } catch (error) {
    console.error('Error generating RAG response:', error)
    return "عذراً، حدث خطأ أثناء معالجة سؤالك. يرجى المحاولة مرة أخرى."
  }
}

export async function POST(request: NextRequest) {
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
    const bot = await prisma.bot.findUnique({
      where: { id: botId },
      include: {
        qas: {
          where: { isActive: true }
        },
        knowledgeSources: true
      }
    })
    
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
    
    let response = ""
    let responseType = "fallback"
    
    // Step 1: Check for Q&A match
    const matchedQA = findSimilarQA(message, bot.qas)
    if (matchedQA) {
      response = matchedQA.answer
      responseType = "qa"
    } else if (bot.knowledgeSources.length > 0) {
      // Step 2: Use RAG with knowledge sources
      response = await generateRAGResponse(message, bot, bot.knowledgeSources)
      responseType = "rag"
    } else {
      // Step 3: Fallback response
      response = "عذراً، لا أملك معلومات كافية للإجابة على سؤالك. يمكنك التواصل مع فريق الدعم للحصول على مساعدة أكثر تفصيلاً."
      responseType = "fallback"
    }
    
    // Save conversation
    await prisma.conversation.create({
      data: {
        botId: bot.id,
        clientId: clientId || 'anonymous',
        question: message,
        answer: response,
        responseType
      }
    })
    
    return NextResponse.json({
      response,
      responseType,
      botName: bot.name
    })
    
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}