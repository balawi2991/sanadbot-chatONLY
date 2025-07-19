import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || ""
    const type = searchParams.get("type") || "all"
    
    const skip = (page - 1) * limit

    // Get user's bot
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bot: true }
    })

    if (!user || !user.bot) {
      return NextResponse.json({ 
        conversations: [], 
        pagination: { page, limit, total: 0, pages: 0 } 
      })
    }

    const botId = user.bot.id

    // Build where clause
    const where: any = {
      botId: botId
    }

    if (search) {
      where.OR = [
        { question: { contains: search, mode: "insensitive" } },
        { answer: { contains: search, mode: "insensitive" } }
      ]
    }

    if (type !== "all") {
      where.responseType = type
    }

    // Get total count
    const total = await prisma.conversation.count({ where })
    const pages = Math.ceil(total / limit)

    // Get conversations
    const conversations = await prisma.conversation.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      select: {
        id: true,
        clientId: true,
        question: true,
        answer: true,
        responseType: true,
        createdAt: true
      }
    })

    return NextResponse.json({
      conversations,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })

  } catch (error) {
    console.error("Error fetching conversations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}