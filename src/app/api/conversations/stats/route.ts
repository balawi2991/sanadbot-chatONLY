import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's bot
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bot: true }
    })

    if (!user || !user.bot) {
      return NextResponse.json({ 
        total: 0,
        qa: 0,
        rag: 0,
        fallback: 0
      })
    }

    const botId = user.bot.id

    // Get conversation stats
    const [total, qa, rag, fallback] = await Promise.all([
      prisma.conversation.count({ where: { botId } }),
      prisma.conversation.count({ where: { botId, responseType: "qa" } }),
      prisma.conversation.count({ where: { botId, responseType: "rag" } }),
      prisma.conversation.count({ where: { botId, responseType: "fallback" } })
    ])

    return NextResponse.json({
      total,
      qa,
      rag,
      fallback
    })

  } catch (error) {
    console.error("Error fetching conversation stats:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}