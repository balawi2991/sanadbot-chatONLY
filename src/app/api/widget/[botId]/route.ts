import { NextRequest, NextResponse } from 'next/server'
import { widgetCore } from '@/lib/widget-core'
import { generateWidgetScript } from '@/lib/widget-generator'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params

    if (!botId) {
      return new NextResponse(
        'console.error("SanadBot: Bot ID is required");',
        {
          status: 400,
          headers: {
            'Content-Type': 'application/javascript',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      )
    }

    // تحميل إعدادات البوت باستخدام النظام المركزي (بدون كاش للحصول على أحدث البيانات)
    const botConfig = await widgetCore.loadBotConfig(botId, false)

    if (!botConfig) {
      return new NextResponse(
        'console.error("SanadBot: Bot not found or inactive");',
        {
          status: 404,
          headers: {
            'Content-Type': 'application/javascript',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET',
            'Access-Control-Allow-Headers': 'Content-Type'
          }
        }
      )
    }

    // إنشاء JavaScript bundle للبوت باستخدام المولد الموحد
    const apiBaseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3002'
    const widgetScript = generateWidgetScript(botConfig, apiBaseUrl)

    // إنشاء ETag فريد لضمان التحديث الفوري
    const timestamp = Date.now()
    const etag = `"${botConfig.id}-${timestamp}"`

    return new NextResponse(widgetScript, {
      status: 200,
      headers: {
        'Content-Type': 'application/javascript',
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
    console.error('Error generating widget:', error)
    return new NextResponse(
      'console.error("SanadBot: Server error");',
      {
        status: 500,
        headers: {
          'Content-Type': 'application/javascript',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    )
  }
}

// تم نقل دالة generateWidgetScript إلى ملف منفصل: /lib/widget-generator.ts

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