"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ChatWidget from "@/components/ChatWidget"

interface BotConfig {
  id: string
  name: string
  color: string
  logo?: string
  avatar?: string
  placeholder: string
  welcomeMessage: string
  personality: string
  isActive: boolean
}

export default function EmbedPage() {
  const params = useParams()
  const botId = params.botId as string
  const [botConfig, setBotConfig] = useState<BotConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (botId) {
      fetchBotConfig()
    }
  }, [botId])

  // إضافة مستمع لإرسال رسالة الإغلاق للصفحة الأساسية
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        window.parent.postMessage('sanadbot-close', '*');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const fetchBotConfig = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bot/${botId}`)
      
      if (!response.ok) {
        throw new Error("Bot not found")
      }
      
      const data = await response.json()
      setBotConfig(data)
    } catch (error) {
      console.error("Error fetching bot config:", error)
      setError("فشل في تحميل البوت")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !botConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">البوت غير متاح</h2>
          <p className="text-gray-600">{error || "البوت المطلوب غير موجود أو غير نشط"}</p>
        </div>
      </div>
    )
  }

  if (!botConfig.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">البوت غير نشط</h2>
          <p className="text-gray-600">هذا البوت غير نشط حالياً</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* زر الإغلاق للتضمين - مخفي بشكل افتراضي */}
      <button
        onClick={() => window.parent.postMessage('sanadbot-close', '*')}
        className="fixed top-4 right-4 z-[999999] w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors opacity-0 hover:opacity-100"
        title="إغلاق"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      {/* استخدام نفس مكون ChatWidget الأصلي بدون تعديل */}
      <ChatWidget 
        config={{
          name: botConfig.name,
          color: botConfig.color,
          logo: botConfig.logo,
          avatar: botConfig.avatar,
          placeholder: botConfig.placeholder,
          welcomeMessage: botConfig.welcomeMessage,
          personality: botConfig.personality
        }}
        botId={botConfig.id}
      />
    </div>
  )
}