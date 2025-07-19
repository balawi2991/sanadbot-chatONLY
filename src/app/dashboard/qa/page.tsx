"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { HeaderSkeleton, CardSkeleton, FormSkeleton, TableRowSkeleton } from '@/components/ui/skeleton'
import { HelpCircle, Plus, Edit, Trash2, ToggleLeft, ToggleRight, Info, CheckCircle, X } from 'lucide-react'

interface QA {
  id: string
  question: string
  answer: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function QAPage() {
  const { data: session } = useSession()
  const [qas, setQas] = useState<QA[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    isActive: true
  })

  useEffect(() => {
    if (session?.user) {
      fetchQAs()
    }
  }, [session])

  const fetchQAs = async () => {
    try {
      const response = await fetch("/api/qas")
      if (response.ok) {
        const data = await response.json()
        setQas(data)
      }
    } catch (error) {
      console.error("Error fetching QAs:", error)
      toast.error("حدث خطأ في تحميل الأسئلة والأجوبة")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error("يرجى ملء جميع الحقول")
      return
    }

    setIsSubmitting(true)
    try {
      const url = editingId ? `/api/qas/${editingId}` : "/api/qas"
      const method = editingId ? "PUT" : "POST"
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(editingId ? "تم تحديث السؤال بنجاح" : "تم إضافة السؤال بنجاح")
        setFormData({ question: "", answer: "", isActive: true })
        setEditingId(null)
        fetchQAs()
      } else {
        toast.error("حدث خطأ في حفظ السؤال")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (qa: QA) => {
    setFormData({
      question: qa.question,
      answer: qa.answer,
      isActive: qa.isActive
    })
    setEditingId(qa.id)
  }

  const handleCancelEdit = () => {
    setFormData({ question: "", answer: "", isActive: true })
    setEditingId(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا السؤال؟")) return

    try {
      const response = await fetch(`/api/qas/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("تم حذف السؤال بنجاح")
        fetchQAs()
      } else {
        toast.error("حدث خطأ في حذف السؤال")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
    }
  }

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/qas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !isActive })
      })

      if (response.ok) {
        toast.success(isActive ? "تم إلغاء تفعيل السؤال" : "تم تفعيل السؤال")
        fetchQAs()
      } else {
        toast.error("حدث خطأ في تحديث حالة السؤال")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <HeaderSkeleton />
        
        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CardSkeleton className="lg:col-span-1" />
          <CardSkeleton className="lg:col-span-2 min-h-[500px]" />
        </div>
        
        {/* Additional Info Skeleton */}
        <CardSkeleton />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-[#6366f1]/5 via-[#8b5cf6]/5 to-[#06b6d4]/5 rounded-[24px] p-8 border border-[#e1e7ef]/50">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-[12px] flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">الأسئلة والأجوبة</h1>
                <p className="text-[#64748b] text-lg font-medium">أضف أسئلة وأجوبة محددة مسبقاً للرد السريع دون استخدام الذكاء الاصطناعي</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* نموذج إضافة/تعديل */}
            <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {editingId ? <Edit className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingId ? "تعديل السؤال" : "إضافة سؤال جديد"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="السؤال"
                  type="text"
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="مثال: ما هي ساعات العمل؟"
                  required
                />
                
                <Textarea
                  label="الإجابة"
                  value={formData.answer}
                  onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                  rows={6}
                  placeholder="اكتب الإجابة المحددة لهذا السؤال..."
                  required
                />

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="mr-2 block text-sm text-gray-900">
                    نشط (سيتم استخدامه في الردود)
                  </label>
                </div>

                <div className="flex space-x-3 space-x-reverse">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "جاري الحفظ..." : (editingId ? "تحديث السؤال" : "إضافة السؤال")}
                  </Button>
                  {editingId && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                    >
                      <X className="w-4 h-4 ml-1" />
                      إلغاء
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

            {/* قائمة الأسئلة والأجوبة */}
            <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                الأسئلة الموجودة ({qas.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {qas.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-gray-500">لا توجد أسئلة وأجوبة بعد</p>
                  <p className="text-sm text-gray-400 mt-1">
                    ابدأ بإضافة أسئلة شائعة وأجوبتها
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {qas.map((qa) => (
                    <div key={qa.id} className={`border rounded-lg p-4 ${
                      qa.isActive ? 'border-gray-200 bg-white' : 'border-gray-100 bg-gray-50'
                    }`}>
                      <div className="flex items-start justify-between mb-3">
                        <Badge variant={qa.isActive ? 'success' : 'secondary'}>
                          {qa.isActive ? 'نشط' : 'غير نشط'}
                        </Badge>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(qa.id, qa.isActive)}
                            title={qa.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                          >
                            {qa.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(qa)}
                            title="تعديل"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(qa.id)}
                            title="حذف"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">السؤال:</p>
                          <p className={`text-sm ${
                            qa.isActive ? 'text-gray-700' : 'text-gray-500'
                          }`}>
                            {qa.question}
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium text-gray-900 mb-1">الإجابة:</p>
                          <p className={`text-sm ${
                            qa.isActive ? 'text-gray-700' : 'text-gray-500'
                          } line-clamp-3`}>
                            {qa.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

            {/* معلومات إضافية */}
            <Card className="mt-8 bg-gradient-to-r from-[#06b6d4]/5 to-[#3b82f6]/5 border-[#06b6d4]/20 hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#0891b2]">
                  <Info className="w-5 h-5" />
                  كيف تعمل ميزة الأسئلة والأجوبة؟
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-[#0e7490] space-y-2">
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    عندما يسأل المستخدم سؤالاً، سيبحث النظام أولاً في قاعدة الأسئلة والأجوبة المحددة مسبقاً
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    إذا وُجد تطابق، سيتم عرض الإجابة المحددة مسبقاً
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    إذا لم يوجد تطابق، سيتم استخدام الذكاء الاصطناعي للإجابة
                  </p>
                  <p className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    يمكنك تفعيل أو إلغاء تفعيل أي سؤال وجواب حسب الحاجة
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}