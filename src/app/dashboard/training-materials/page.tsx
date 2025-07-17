"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"

interface KnowledgeSource {
  id: string
  type: "file" | "link" | "text"
  title: string
  content: string
  url?: string
  filename?: string
  filesize?: number
  createdAt: string
  updatedAt: string
}

export default function TrainingMaterials() {
  const { data: session } = useSession()
  const [knowledgeSources, setKnowledgeSources] = useState<KnowledgeSource[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"file" | "link" | "text">("text")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form states
  const [textForm, setTextForm] = useState({ title: "", content: "" })
  const [linkForm, setLinkForm] = useState({ title: "", url: "" })
  const [fileForm, setFileForm] = useState({ title: "", file: null as File | null })

  useEffect(() => {
    if (session?.user) {
      fetchKnowledgeSources()
    }
  }, [session])

  const fetchKnowledgeSources = async () => {
    try {
      const response = await fetch("/api/knowledge-sources")
      if (response.ok) {
        const data = await response.json()
        setKnowledgeSources(data)
      }
    } catch (error) {
      console.error("Error fetching knowledge sources:", error)
      toast.error("حدث خطأ في تحميل المصادر")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitText = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!textForm.title.trim() || !textForm.content.trim()) {
      toast.error("يرجى ملء جميع الحقول")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/knowledge-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "text",
          title: textForm.title,
          content: textForm.content
        })
      })

      if (response.ok) {
        toast.success("تم إضافة النص بنجاح")
        setTextForm({ title: "", content: "" })
        fetchKnowledgeSources()
      } else {
        toast.error("حدث خطأ في إضافة النص")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!linkForm.title.trim() || !linkForm.url.trim()) {
      toast.error("يرجى ملء جميع الحقول")
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/knowledge-sources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "link",
          title: linkForm.title,
          url: linkForm.url
        })
      })

      if (response.ok) {
        toast.success("تم إضافة الرابط بنجاح")
        setLinkForm({ title: "", url: "" })
        fetchKnowledgeSources()
      } else {
        toast.error("حدث خطأ في إضافة الرابط")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitFile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fileForm.title.trim() || !fileForm.file) {
      toast.error("يرجى ملء جميع الحقول واختيار ملف")
      return
    }

    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append("type", "file")
      formData.append("title", fileForm.title)
      formData.append("file", fileForm.file)

      const response = await fetch("/api/knowledge-sources", {
        method: "POST",
        body: formData
      })

      if (response.ok) {
        toast.success("تم رفع الملف بنجاح")
        setFileForm({ title: "", file: null })
        fetchKnowledgeSources()
      } else {
        toast.error("حدث خطأ في رفع الملف")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المصدر؟")) return

    try {
      const response = await fetch(`/api/knowledge-sources/${id}`, {
        method: "DELETE"
      })

      if (response.ok) {
        toast.success("تم حذف المصدر بنجاح")
        fetchKnowledgeSources()
      } else {
        toast.error("حدث خطأ في حذف المصدر")
      }
    } catch (error) {
      toast.error("حدث خطأ في الاتصال")
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "file":
        return (
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        )
      case "link":
        return (
          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )
      case "text":
        return (
          <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
        )
      default:
        return null
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
          <h1 className="text-3xl font-bold text-gray-900">مصادر المعرفة</h1>
          <p className="mt-2 text-gray-600">
            أضف المحتوى الذي تريد أن يتعلم منه مساعدك الذكي
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* إضافة مصادر جديدة */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">إضافة مصدر جديد</h2>
              
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                <button
                  onClick={() => setActiveTab("text")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "text"
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  نص مباشر
                </button>
                <button
                  onClick={() => setActiveTab("link")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "link"
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  رابط
                </button>
                <button
                  onClick={() => setActiveTab("file")}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "file"
                      ? "bg-white text-blue-600 shadow"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  ملف
                </button>
              </div>

              {/* Text Form */}
              {activeTab === "text" && (
                <form onSubmit={handleSubmitText} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان النص
                    </label>
                    <input
                      type="text"
                      value={textForm.title}
                      onChange={(e) => setTextForm({ ...textForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: معلومات عن الشركة"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المحتوى
                    </label>
                    <textarea
                      value={textForm.content}
                      onChange={(e) => setTextForm({ ...textForm, content: e.target.value })}
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="اكتب المحتوى الذي تريد أن يتعلم منه البوت..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    {isSubmitting ? "جاري الإضافة..." : "إضافة النص"}
                  </button>
                </form>
              )}

              {/* Link Form */}
              {activeTab === "link" && (
                <form onSubmit={handleSubmitLink} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الرابط
                    </label>
                    <input
                      type="text"
                      value={linkForm.title}
                      onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: صفحة الخدمات"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرابط
                    </label>
                    <input
                      type="url"
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/page"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    {isSubmitting ? "جاري الإضافة..." : "إضافة الرابط"}
                  </button>
                </form>
              )}

              {/* File Form */}
              {activeTab === "file" && (
                <form onSubmit={handleSubmitFile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الملف
                    </label>
                    <input
                      type="text"
                      value={fileForm.title}
                      onChange={(e) => setFileForm({ ...fileForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="مثال: دليل المستخدم"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الملف
                    </label>
                    <input
                      type="file"
                      onChange={(e) => setFileForm({ ...fileForm, file: e.target.files?.[0] || null })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      accept=".txt,.pdf,.doc,.docx,.md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      الملفات المدعومة: TXT, PDF, DOC, DOCX, MD
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-2 px-4 rounded-md font-medium transition-colors"
                  >
                    {isSubmitting ? "جاري الرفع..." : "رفع الملف"}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* قائمة المصادر الموجودة */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                المصادر الموجودة ({knowledgeSources.length})
              </h2>
              
              {knowledgeSources.length === 0 ? (
                <div className="text-center py-8">
                  <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-gray-500">لا توجد مصادر معرفة بعد</p>
                  <p className="text-sm text-gray-400 mt-1">
                    ابدأ بإضافة محتوى ليتعلم منه مساعدك الذكي
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {knowledgeSources.map((source) => (
                    <div key={source.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1">
                            {getTypeIcon(source.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {source.title}
                            </h3>
                            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                              <span className="capitalize">{source.type}</span>
                              {source.type === "file" && source.filesize && (
                                <>
                                  <span>•</span>
                                  <span>{formatFileSize(source.filesize)}</span>
                                </>
                              )}
                              {source.type === "link" && source.url && (
                                <>
                                  <span>•</span>
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                    فتح الرابط
                                  </a>
                                </>
                              )}
                            </div>
                            {source.type === "text" && (
                              <p className="mt-2 text-xs text-gray-600 line-clamp-2">
                                {source.content.substring(0, 100)}...
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(source.id)}
                          className="flex-shrink-0 text-red-600 hover:text-red-800 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}