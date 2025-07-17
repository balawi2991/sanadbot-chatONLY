import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params

    if (!botId) {
      return NextResponse.json(
        { error: 'معرف البوت مطلوب' },
        { status: 400 }
      )
    }

    // البحث عن البوت بمعرف البوت
    const bot = await prisma.bot.findUnique({
      where: {
        id: botId
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
        { error: 'البوت غير موجود' },
        { status: 404 }
      )
    }

    // إرجاع بيانات البوت
    return NextResponse.json({
      id: bot.id,
      name: bot.name,
      color: bot.color,
      placeholder: bot.placeholder,
      welcome: bot.welcome,
      personality: bot.personality,
      isActive: bot.isActive,
      _count: bot._count
    })

  } catch (error) {
    console.error('Error fetching bot:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في الخادم' },
      { status: 500 }
    )
  }
}