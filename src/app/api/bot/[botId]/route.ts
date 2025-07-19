import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "غير مصرح" },
        { status: 401 }
      )
    }

    if (!botId) {
      return NextResponse.json(
        { message: "معرف البوت مطلوب" },
        { status: 400 }
      )
    }

    // البحث عن البوت بواسطة ID والتأكد من أنه يخص المستخدم الحالي
    const bot = await prisma.bot.findFirst({
      where: {
        id: botId,
        userId: session.user.id
      },
      include: {
        _count: {
          select: {
            conversations: true,
            qas: true,
            knowledgeSources: true
          }
        }
      }
    })

    if (!bot) {
      return NextResponse.json(
        { message: "البوت غير موجود" },
        { status: 404 }
      )
    }

    return NextResponse.json(bot)
  } catch (error) {
    console.error("Error fetching bot by ID:", error)
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}