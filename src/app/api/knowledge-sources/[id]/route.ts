import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// DELETE - Delete a specific knowledge source
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "غير مصرح" },
        { status: 401 }
      )
    }

    const { id } = params

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

    // Check if the knowledge source exists and belongs to this bot
    const knowledgeSource = await prisma.knowledgeSource.findFirst({
      where: {
        id,
        botId: bot.id
      }
    })

    if (!knowledgeSource) {
      return NextResponse.json(
        { message: "المصدر غير موجود" },
        { status: 404 }
      )
    }

    // Delete the knowledge source
    await prisma.knowledgeSource.delete({
      where: {
        id
      }
    })

    return NextResponse.json(
      { message: "تم حذف المصدر بنجاح" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error deleting knowledge source:", error)
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}

// GET - Get a specific knowledge source
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "غير مصرح" },
        { status: 401 }
      )
    }

    const { id } = params

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

    // Get the knowledge source
    const knowledgeSource = await prisma.knowledgeSource.findFirst({
      where: {
        id,
        botId: bot.id
      }
    })

    if (!knowledgeSource) {
      return NextResponse.json(
        { message: "المصدر غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json(knowledgeSource)
  } catch (error) {
    console.error("Error fetching knowledge source:", error)
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}