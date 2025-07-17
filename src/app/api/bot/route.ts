import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "غير مصرح" },
        { status: 401 }
      )
    }

    const bot = await prisma.bot.findUnique({
      where: {
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
    console.error("Error fetching bot:", error)
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "غير مصرح" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const { name, color, logo, avatar, placeholder, welcomeMessage, personality, isActive } = data

    const bot = await prisma.bot.update({
      where: {
        userId: session.user.id
      },
      data: {
        ...(name && { name }),
        ...(color && { color }),
        ...(logo !== undefined && { logo }),
        ...(avatar !== undefined && { avatar }),
        ...(placeholder && { placeholder }),
        ...(welcomeMessage && { welcome: welcomeMessage }),
        ...(personality && { personality }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(bot)
  } catch (error) {
    console.error("Error updating bot:", error)
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}