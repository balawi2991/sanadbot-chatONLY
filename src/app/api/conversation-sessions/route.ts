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
    
    const skip = (page - 1) * limit

    // Get user's bot
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bot: true }
    })

    if (!user || !user.bot) {
      return NextResponse.json({ 
        conversationSessions: [], 
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
        { title: { contains: search, mode: "insensitive" } },
        { 
          messages: {
            some: {
              content: { contains: search, mode: "insensitive" }
            }
          }
        }
      ]
    }

    // Get total count
    const total = await prisma.conversationSession.count({ where })
    const pages = Math.ceil(total / limit)

    // Get conversation sessions with their messages
    const conversationSessions = await prisma.conversationSession.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          select: {
            id: true,
            sender: true,
            content: true,
            responseType: true,
            createdAt: true
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      }
    })

    // Transform data for UI
    const transformedSessions = conversationSessions.map(session => {
      const lastMessage = session.messages[session.messages.length - 1]
      const firstUserMessage = session.messages.find(msg => msg.sender === 'user')
      
      return {
        id: session.id,
        clientId: session.clientId,
        title: session.title || (firstUserMessage?.content.slice(0, 50) + '...' || 'محادثة جديدة'),
        messageCount: session._count.messages,
        lastMessage: lastMessage?.content || '',
        lastMessageTime: lastMessage?.createdAt || session.createdAt,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messages: session.messages.map(msg => ({
          id: msg.id,
          type: msg.sender as 'user' | 'bot',
          content: msg.content,
          responseType: msg.responseType,
          timestamp: msg.createdAt
        })),
        // Computed fields for UI compatibility
        visitorName: session.clientId === 'anonymous' ? 'زائر مجهول' : `زائر ${session.clientId.slice(-4)}`
      }
    })

    return NextResponse.json({
      conversationSessions: transformedSessions,
      pagination: {
        page,
        limit,
        total,
        pages
      }
    })

  } catch (error) {
    console.error("Error fetching conversation sessions:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Create a new conversation session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { botId, clientId, title } = await request.json()

    if (!botId || !clientId) {
      return NextResponse.json(
        { error: "botId and clientId are required" },
        { status: 400 }
      )
    }

    // Verify bot ownership
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { bot: true }
    })

    if (!user || !user.bot || user.bot.id !== botId) {
      return NextResponse.json(
        { error: "Bot not found or unauthorized" },
        { status: 404 }
      )
    }

    // Create new conversation session
    const conversationSession = await prisma.conversationSession.create({
      data: {
        botId,
        clientId,
        title: title || null
      }
    })

    return NextResponse.json(conversationSession)

  } catch (error) {
    console.error("Error creating conversation session:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}