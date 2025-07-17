"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">الأسئلة والأجوبة</h1>
          <p className="mt-2 text-gray-600">
            أضف أسئلة وأجوبة محددة مسبقاً للرد السريع دون استخدام الذكاء الاصطناعي
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* نموذج إضافة/تعديل */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                {editingId ? "تعديل السؤال" : "إضافة سؤال جديد"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    السؤال
                  </label>
                  <input
                    type="text"
                    value={formData.question}
                    onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="مثال: ما هي ساعات العمل؟"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    الإجابة
                  </label>
                  <textarea
                    value={formData.answer}
                    onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="اكتب الإجابة المحددة لهذا السؤال..."
                    required
                  />
                </div>

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
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    {isSubmitting ? "جاري الحفظ..." : (editingId ? "تحديث السؤال" : "إضافة السؤال")}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      إلغاء
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* قائمة الأسئلة والأجوبة */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                الأسئلة الموجودة ({qas.length})
              </h2>
              
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
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <div className={`w-3 h-3 rounded-full ${
                            qa.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}></div>
                          <span className={`text-xs font-medium ${
                            qa.isActive ? 'text-green-700' : 'text-gray-500'
                          }`}>
                            {qa.isActive ? 'نشط' : 'غير نشط'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1 space-x-reverse">
                          <button
                            onClick={() => handleToggleActive(qa.id, qa.isActive)}
                            className={`p-1 rounded transition-colors ${
                              qa.isActive 
                                ? 'text-yellow-600 hover:bg-yellow-50' 
                                : 'text-green-600 hover:bg-green-50'
                            }`}
                            title={qa.isActive ? 'إلغاء التفعيل' : 'تفعيل'}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {qa.isActive ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              )}
                            </svg>
                          </button>
                          <button
                            onClick={() => handleEdit(qa)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="تعديل"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(qa.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="حذف"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
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
            </div>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <svg className="w-6 h-6 text-blue-600 mt-1 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-medium text-blue-900 mb-2">كيف تعمل الأسئلة والأجوبة؟</h3>
              <div className="text-blue-800 space-y-2">
                <p>• عندما يطرح زائر سؤالاً مطابقاً أو مشابهاً لأحد الأسئلة المحفوظة، سيتم الرد بالإجابة المحددة مسبقاً</p>
                <p>• هذا يضمن ردوداً سريعة ودقيقة دون الحاجة لاستخدام الذكاء الاصطناعي</p>
                <p>• يمكنك تفعيل أو إلغاء تفعيل أي سؤال حسب الحاجة</p>
                <p>• الأسئلة غير النشطة لن تظهر في ردود البوت</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}