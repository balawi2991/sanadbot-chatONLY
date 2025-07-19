"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { ChatWidgetPreview } from "@/components/ChatWidget"

interface BotData {
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

export default function AppearancePage() {
  const { data: session } = useSession()
  const [botData, setBotData] = useState<BotData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    color: '#3B82F6',
    logo: '',
    avatar: '',
    placeholder: '',
    welcomeMessage: '',
    personality: '',
    isActive: true,
    glowEffect: true
  })
  const [hasChanges, setHasChanges] = useState(false)
  const [originalData, setOriginalData] = useState<any>(null)

  useEffect(() => {
    if (session?.user) {
      fetchBotData()
    }
  }, [session])

  const fetchBotData = async () => {
    try {
      const response = await fetch("/api/bot")
      if (response.ok) {
        const data = await response.json()
        setBotData(data)
        const initialFormData = {
          name: data.name || "",
          color: data.color || "#3B82F6",
          logo: data.logo || "",
          avatar: data.avatar || "",
          placeholder: data.placeholder || "",
          welcomeMessage: data.welcome || "",
          personality: data.personality || "",
          isActive: data.isActive,
          glowEffect: data.glowEffect ?? true
        }
        setFormData(initialFormData)
        setOriginalData(initialFormData)
        setHasChanges(false)
      }
    } catch (error) {
      console.error("Error fetching bot data:", error)
      toast.error("حدث خطأ في تحميل البيانات")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasChanges) {
      toast.info("لا توجد تغييرات للحفظ")
      return
    }
    
    setIsSaving(true)

    try {
      const response = await fetch("/api/bot", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const updatedData = await response.json()
        setBotData(updatedData)
        
        // تحديث البيانات الأصلية
        const newOriginalData = {
          name: updatedData.name || "",
          color: updatedData.color || "#3B82F6",
          logo: updatedData.logo || "",
          avatar: updatedData.avatar || "",
          placeholder: updatedData.placeholder || "",
          welcomeMessage: updatedData.welcome || "",
          personality: updatedData.personality || "",
          isActive: updatedData.isActive
        }
        setOriginalData(newOriginalData)
        setHasChanges(false)
        
        toast.success("✅ تم حفظ التغييرات بنجاح!")
      } else {
        const errorData = await response.json()
        toast.error(errorData.message || "حدث خطأ أثناء حفظ التغييرات")
      }
    } catch (error) {
      console.error("Error updating bot:", error)
      toast.error("❌ حدث خطأ في الاتصال. تأكد من اتصالك بالإنترنت")
    } finally {
      setIsSaving(false)
    }
  }

  // دالة لإعادة تعيين التغييرات
  const handleReset = () => {
    if (originalData) {
      setFormData(originalData)
      setHasChanges(false)
      toast.success("تم إلغاء التغييرات")
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    const newValue = type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    
    setFormData(prev => {
      const newFormData = {
        ...prev,
        [name]: newValue
      }
      
      // تحقق من وجود تغييرات
      const hasChangesNow = originalData && JSON.stringify(newFormData) !== JSON.stringify(originalData)
      setHasChanges(hasChangesNow)
      
      return newFormData
    })
  }

  // دالة لتحديث اللون
  const handleColorChange = (color: string) => {
    setFormData(prev => {
      const newFormData = {
        ...prev,
        color: color
      }
      
      // تحقق من وجود تغييرات
      const hasChangesNow = originalData && JSON.stringify(newFormData) !== JSON.stringify(originalData)
      setHasChanges(hasChangesNow)
      
      return newFormData
    })
  }

  const colorOptions = [
    { name: "أزرق", value: "#3B82F6" },
    { name: "أخضر", value: "#10B981" },
    { name: "بنفسجي", value: "#8B5CF6" },
    { name: "أحمر", value: "#EF4444" },
    { name: "برتقالي", value: "#F59E0B" },
    { name: "وردي", value: "#EC4899" },
    { name: "رمادي", value: "#6B7280" },
    { name: "أسود", value: "#1F2937" },
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="w-full px-4 lg:px-6 xl:px-8">
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900">تخصيص المظهر</h1>
        <p className="mt-2 text-gray-600">قم بتخصيص مظهر وسلوك المساعد الذكي الخاص بك</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 xl:gap-8">
        {/* نموذج التخصيص */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">الإعدادات الأساسية</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                اسم المساعد
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: مساعد العملاء"
                required
              />
            </div>

            <div>
              <label htmlFor="placeholder" className="block text-sm font-medium text-gray-700 mb-2">
                نص المساعدة في حقل الإدخال
              </label>
              <input
                type="text"
                id="placeholder"
                name="placeholder"
                value={formData.placeholder}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="مثال: اكتب رسالتك هنا..."
              />
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor="welcomeMessage" className="block text-sm font-medium text-gray-700 mb-2">
              رسالة الترحيب
            </label>
            <textarea
              id="welcomeMessage"
              name="welcomeMessage"
              value={formData.welcomeMessage}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="مثال: مرحباً! كيف يمكنني مساعدتك اليوم؟"
            />
          </div>

          <div className="mt-6">
            <label htmlFor="personality" className="block text-sm font-medium text-gray-700 mb-2">
              شخصية المساعد
            </label>
            <textarea
              id="personality"
              name="personality"
              value={formData.personality}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="صف شخصية المساعد وطريقة تفاعله مع العملاء..."
            />
          </div>
        </div>

        {/* Appearance Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">إعدادات المظهر</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              اللون الأساسي
            </label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {colorOptions.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleColorChange(color.value)}
                  className={`w-12 h-12 rounded-lg border-2 transition-all ${
                    formData.color === color.value
                      ? "border-gray-900 scale-110 shadow-lg"
                      : "border-gray-300 hover:border-gray-400 hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="mt-3">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-16 h-8 rounded border border-gray-300 cursor-pointer"
              />
              <span className="mr-2 text-sm text-gray-600">أو اختر لوناً مخصصاً</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                رابط الشعار (اختياري)
              </label>
              <input
                type="url"
                id="logo"
                name="logo"
                value={formData.logo}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/logo.png"
              />
            </div>

            <div>
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700 mb-2">
                رابط صورة المساعد (اختياري)
              </label>
              <input
                type="url"
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/avatar.png"
              />
            </div>
          </div>

          {/* Glow Effect Setting */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  تأثير التوهج البصري
                </label>
                <p className="text-sm text-gray-500">
                  تفعيل التأثير المتحرك حول إطار البوت
                </p>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="glowEffect"
                  name="glowEffect"
                  checked={formData.glowEffect}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="glowEffect" className="mr-2 block text-sm text-gray-900">
                  تفعيل التوهج
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">حالة المساعد</h2>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
              تفعيل المساعد الذكي
            </label>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            عند إلغاء التفعيل، لن يظهر المساعد في موقعك الإلكتروني
          </p>
        </div>

            {/* Save Buttons */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 space-x-reverse">
                  {hasChanges && (
                    <div className="flex items-center text-amber-600">
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <span className="text-sm font-medium">لديك تغييرات غير محفوظة</span>
                    </div>
                  )}
                  {!hasChanges && originalData && (
                    <div className="flex items-center text-green-600">
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-medium">جميع التغييرات محفوظة</span>
                    </div>
                  )}
                </div>
                
                <div className="flex space-x-3 space-x-reverse">
                  {hasChanges && (
                    <button
                      type="button"
                      onClick={handleReset}
                      disabled={isSaving}
                      className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center"
                    >
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      إلغاء التغييرات
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isSaving || !hasChanges}
                    className={`px-6 py-2 rounded-md font-medium transition-all flex items-center ${
                      hasChanges
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } disabled:bg-blue-400`}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                        </svg>
                        حفظ التغييرات
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* المعاينة المباشرة - sticky */}
        <div className="lg:col-span-2">
          <div className="sticky top-8">
            <ChatWidgetPreview 
              botId={botData?.id}
              config={{
                name: formData.name || "المساعد الذكي",
                color: formData.color,
                logo: formData.logo,
                avatar: formData.avatar,
                placeholder: formData.placeholder || "اسألني أي شيء...",
                welcomeMessage: formData.welcomeMessage || "مرحباً! كيف يمكنني مساعدتك؟",
                personality: formData.personality,
                glowEffect: formData.glowEffect
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}