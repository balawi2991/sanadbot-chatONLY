import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all QAs for the user's bot
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's bot
    const bot = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Fetch all QAs for this bot
    const qas = await prisma.qA.findMany({
      where: { botId: bot.id },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(qas)
  } catch (error) {
    console.error("Error fetching QAs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create a new QA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { question, answer, isActive = true } = await request.json()

    if (!question?.trim() || !answer?.trim()) {
      return NextResponse.json(
        { error: "Question and answer are required" },
        { status: 400 }
      )
    }

    // Get user's bot
    const bot = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Create new QA
    const qa = await prisma.qA.create({
      data: {
        question: question.trim(),
        answer: answer.trim(),
        isActive,
        botId: bot.id
      }
    })

    return NextResponse.json(qa, { status: 201 })
  } catch (error) {
    console.error("Error creating QA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}