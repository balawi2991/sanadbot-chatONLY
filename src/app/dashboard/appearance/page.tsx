"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { ChatWidgetPreview } from "@/components/ChatWidget"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { HeaderSkeleton, CardSkeleton, FormSkeleton } from "@/components/ui/skeleton"
import { Palette, Save, RotateCcw, Settings, Eye, Sparkles } from "lucide-react"

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
      <div className="space-y-8">
        {/* Header Skeleton */}
        <HeaderSkeleton />
        
        {/* Settings Cards Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <CardSkeleton />
            <CardSkeleton />
          </div>
          <CardSkeleton />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#6366f1]/5 via-[#8b5cf6]/5 to-[#06b6d4]/5 rounded-[24px] p-8 border border-[#e1e7ef]/50">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-[12px] flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">تخصيص المظهر</h1>
            <p className="text-[#64748b] text-lg font-medium">قم بتخصيص مظهر وسلوك المساعد الذكي الخاص بك</p>
          </div>
        </div>
        {hasChanges && (
          <Badge variant="warning" className="mt-2">
            <Sparkles className="w-4 h-4 ml-1" />
            يوجد تغييرات غير محفوظة
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* نموذج التخصيص */}
        <div className="lg:col-span-3 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Settings */}
        <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              الإعدادات الأساسية
            </CardTitle>
            <CardDescription>
              قم بتعديل الاسم والرسائل الأساسية للمساعد
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="اسم المساعد"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="مثال: مساعد العملاء"
              required
            />

            <Input
              label="نص المساعدة في حقل الإدخال"
              name="placeholder"
              value={formData.placeholder}
              onChange={handleInputChange}
              placeholder="مثال: اكتب رسالتك هنا..."
            />
          </div>

          <Textarea
            label="رسالة الترحيب"
            name="welcomeMessage"
            value={formData.welcomeMessage}
            onChange={handleInputChange}
            rows={3}
            placeholder="مثال: مرحباً! كيف يمكنني مساعدتك اليوم؟"
          />

          <Textarea
            label="شخصية المساعد"
            name="personality"
            value={formData.personality}
            onChange={handleInputChange}
            rows={4}
            placeholder="صف شخصية المساعد وطريقة تفاعله مع العملاء..."
          />
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              إعدادات المظهر
            </CardTitle>
            <CardDescription>
              قم بتخصيص الألوان والشعارات والمظهر العام
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          
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
            <Input
              label="رابط الشعار (اختياري)"
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleInputChange}
              placeholder="https://example.com/logo.png"
            />

            <Input
              label="رابط صورة المساعد (اختياري)"
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleInputChange}
              placeholder="https://example.com/avatar.png"
            />
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
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              حالة المساعد
            </CardTitle>
            <CardDescription>
              تحكم في تفعيل وإلغاء تفعيل المساعد الذكي
            </CardDescription>
          </CardHeader>
          <CardContent>
          
          <div className="flex items-center justify-between">
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
            <Badge variant={formData.isActive ? 'success' : 'destructive'}>
              {formData.isActive ? 'نشط' : 'غير نشط'}
            </Badge>
          </div>
          <p className="mt-2 text-sm text-gray-600">
            عند إلغاء التفعيل، لن يظهر المساعد في موقعك الإلكتروني
          </p>
          </CardContent>
        </Card>

            {/* Save Buttons */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 space-x-reverse">
                    {hasChanges && (
                      <Badge variant="warning" className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        لديك تغييرات غير محفوظة
                      </Badge>
                    )}
                    {!hasChanges && originalData && (
                      <Badge variant="success" className="flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        جميع التغييرات محفوظة
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex space-x-3 space-x-reverse">
                    {hasChanges && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={handleReset}
                        disabled={isSaving}
                      >
                        <RotateCcw className="w-4 h-4 ml-2" />
                        إلغاء التغييرات
                      </Button>
                    )}
                    
                    <Button
                      type="submit"
                      disabled={isSaving || !hasChanges}
                      variant={hasChanges ? 'default' : 'secondary'}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin w-4 h-4 ml-2 border-2 border-white border-t-transparent rounded-full"></div>
                          جاري الحفظ...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 ml-2" />
                          حفظ التغييرات
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
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