import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch all knowledge sources for the user's bot
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "غير مصرح" },
        { status: 401 }
      )
    }

    // First get the user's bot
    const bot = await prisma.bot.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!bot) {
      return NextResponse.json(
        { message: "البوت غير موجود" },
        { status: 404 }
      )
    }

    // Get all knowledge sources for this bot
    const knowledgeSources = await prisma.knowledgeSource.findMany({
      where: {
        botId: bot.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(knowledgeSources)
  } catch (error) {
    console.error("Error fetching knowledge sources:", error)
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}

// POST - Create a new knowledge source
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "غير مصرح" },
        { status: 401 }
      )
    }

    // First get the user's bot
    const bot = await prisma.bot.findUnique({
      where: {
        userId: session.user.id
      }
    })

    if (!bot) {
      return NextResponse.json(
        { message: "البوت غير موجود" },
        { status: 404 }
      )
    }

    const contentType = request.headers.get("content-type")
    
    // Handle file upload
    if (contentType?.includes("multipart/form-data")) {
      const formData = await request.formData()
      const type = formData.get("type") as string
      const title = formData.get("title") as string
      const file = formData.get("file") as File

      if (!type || !title || !file) {
        return NextResponse.json(
          { message: "جميع الحقول مطلوبة" },
          { status: 400 }
        )
      }

      // Read file content
      const fileContent = await file.text()
      
      const knowledgeSource = await prisma.knowledgeSource.create({
        data: {
          botId: bot.id,
          type: "file",
          title,
          content: fileContent,
          filename: file.name,
          filesize: file.size
        }
      })

      return NextResponse.json(knowledgeSource, { status: 201 })
    }
    
    // Handle JSON data (text and link)
    const body = await request.json()
    const { type, title, content, url } = body

    if (!type || !title) {
      return NextResponse.json(
        { message: "النوع والعنوان مطلوبان" },
        { status: 400 }
      )
    }

    let finalContent = ""
    let finalUrl = undefined

    if (type === "text") {
      if (!content) {
        return NextResponse.json(
          { message: "المحتوى مطلوب للنص" },
          { status: 400 }
        )
      }
      finalContent = content
    } else if (type === "link") {
      if (!url) {
        return NextResponse.json(
          { message: "الرابط مطلوب" },
          { status: 400 }
        )
      }
      
      // Fetch content from URL
      try {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error("Failed to fetch URL")
        }
        finalContent = await response.text()
        finalUrl = url
      } catch (error) {
        return NextResponse.json(
          { message: "لا يمكن الوصول إلى الرابط" },
          { status: 400 }
        )
      }
    }

    const knowledgeSource = await prisma.knowledgeSource.create({
      data: {
        botId: bot.id,
        type,
        title,
        content: finalContent,
        url: finalUrl
      }
    })

    return NextResponse.json(knowledgeSource, { status: 201 })
  } catch (error) {
    console.error("Error creating knowledge source:", error)
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}