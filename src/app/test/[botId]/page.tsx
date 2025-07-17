'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import ChatWidget from '@/components/ChatWidget/ChatWidget'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

interface BotData {
  id: string
  name: string
  color: string
  placeholder: string
  welcome: string
  personality: string
  isActive: boolean
  _count: {
    conversations: number
    qas: number
    knowledgeSources: number
  }
}

const TestBotPage = () => {
  const params = useParams()
  const { data: session } = useSession()
  const [botData, setBotData] = useState<BotData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const botId = params.botId as string

  useEffect(() => {
    if (botId) {
      fetchBotData()
    }
  }, [botId])

  const fetchBotData = async () => {
    try {
      const response = await fetch(`/api/bot/${botId}`)
      if (response.ok) {
        const data = await response.json()
        setBotData(data)
      } else if (response.status === 404) {
        setError('البوت غير موجود')
      } else {
        setError('حدث خطأ في تحميل بيانات البوت')
      }
    } catch (error) {
      console.error('Error fetching bot data:', error)
      setError('حدث خطأ في الاتصال')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البوت...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{error}</h1>
          <p className="text-gray-600 mb-6">تأكد من صحة رابط البوت</p>
          <Link
            href="/dashboard"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
          >
            العودة إلى لوحة التحكم
          </Link>
        </div>
      </div>
    )
  }

  if (!botData) {
    return null
  }

  const config = {
    name: botData.name,
    color: botData.color,
    placeholder: botData.placeholder,
    welcomeMessage: botData.welcome,
    personality: botData.personality
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            اختبار {botData.name}
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            اختبر مساعدك الذكي مع البيانات والإعدادات الخاصة بك
            <br />
            <span className="text-sm text-blue-600 font-semibold">مدعوم بـ Gemini AI و تقنية RAG</span>
          </p>
          
          {/* حالة البوت */}
          <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
            botData.isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            <div className={`w-2 h-2 rounded-full ml-2 ${
              botData.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            {botData.isActive ? 'البوت نشط' : 'البوت غير نشط'}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* إحصائيات البوت */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                <span className="text-xl">📊</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                إحصائيات البوت
              </h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                <div className="text-2xl font-bold text-blue-600 mb-1">{botData._count.conversations}</div>
                <div className="text-sm text-blue-800 font-medium">محادثة</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200">
                <div className="text-2xl font-bold text-green-600 mb-1">{botData._count.qas}</div>
                <div className="text-sm text-green-800 font-medium">سؤال وجواب</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 col-span-2">
                <div className="text-2xl font-bold text-purple-600 mb-1">{botData._count.knowledgeSources}</div>
                <div className="text-sm text-purple-800 font-medium">مصدر معرفة</div>
              </div>
            </div>
          </div>

          {/* معلومات الاختبار */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center ml-3">
                <span className="text-xl">💡</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                نصائح للاختبار
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">اختبر الأسئلة والأجوبة:</h3>
                <p className="text-sm text-blue-700">
                  اطرح الأسئلة التي أضفتها في قسم الأسئلة والأجوبة
                </p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">اختبر مصادر المعرفة:</h3>
                <p className="text-sm text-green-700">
                  اسأل عن المحتوى الموجود في مصادر المعرفة التي أضفتها
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2">اختبر الشخصية:</h3>
                <p className="text-sm text-purple-700">
                  لاحظ كيف يتفاعل البوت وفقاً لوصف الشخصية الذي حددته
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* أزرار التحكم */}
        <div className="mt-8 bg-white rounded-xl shadow-xl p-6 border border-gray-100">
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة إلى لوحة التحكم
            </Link>
            
            <Link
              href="/dashboard/appearance"
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
              </svg>
              تخصيص المظهر
            </Link>
            
            <Link
              href="/dashboard/qa"
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium"
            >
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              إدارة الأسئلة والأجوبة
            </Link>
          </div>
        </div>
      </div>

      {/* المساعد الذكي */}
      <ChatWidget botId={botId} config={config} />
    </div>
  )
}

export default TestBotPage