import { NextRequest, NextResponse } from 'next/server'
import { widgetCore } from '@/lib/widget-core'

/**
 * API endpoint مخصص لجلب تخصيصات المظهر فقط
 * يوفر استجابة سريعة وخفيفة للتحديثات الفورية
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: botId } = await params

    if (!botId) {
      return NextResponse.json(
        { error: 'Bot ID is required' },
        { status: 400 }
      )
    }

    // تحميل إعدادات البوت بدون كاش للحصول على أحدث البيانات
    const botConfig = await widgetCore.loadBotConfig(botId, false)

    if (!botConfig) {
      return NextResponse.json(
        { error: 'Bot not found or inactive' },
        { status: 404 }
      )
    }

    // إرجاع بيانات التخصيص فقط (خفيفة وسريعة)
    const themeData = {
      id: botConfig.id,
      name: botConfig.name,
      color: botConfig.color,
      placeholder: botConfig.placeholder,
      welcomeMessage: botConfig.welcomeMessage,
      avatar: botConfig.avatar,
      logo: botConfig.logo
    }

    // إنشاء ETag فريد لضمان التحديث الفوري
    const timestamp = Date.now()
    const etag = `"theme-${botConfig.id}-${timestamp}"`

    return NextResponse.json(themeData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        // منع التخزين المؤقت بشكل صارم
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0, private',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'ETag': etag,
        // منع التخزين في CDN والبروكسي
        'Surrogate-Control': 'no-store',
        'Vary': 'Accept-Encoding'
      }
    })

  } catch (error) {
    console.error('Error fetching bot theme:', error)
    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  })
}