"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { HeaderSkeleton, CardSkeleton, FormSkeleton, TableRowSkeleton } from "@/components/ui/skeleton"
import { BookOpen, FileText, Link, Upload, Trash2, Plus, ExternalLink } from "lucide-react"

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
        return <FileText className="w-5 h-5 text-blue-600" />
      case "link":
        return <Link className="w-5 h-5 text-green-600" />
      case "text":
        return <FileText className="w-5 h-5 text-purple-600" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <HeaderSkeleton />
        
        {/* Add Sources Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
        
        {/* Existing Sources Skeleton */}
        <CardSkeleton className="min-h-[400px]" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#6366f1]/5 via-[#8b5cf6]/5 to-[#06b6d4]/5 rounded-[24px] p-8 border border-[#e1e7ef]/50">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] rounded-[12px] flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">مصادر المعرفة</h1>
            <p className="text-[#64748b] text-lg font-medium">أضف المحتوى الذي تريد أن يتعلم منه مساعدك الذكي</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* إضافة مصادر جديدة */}
        <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                إضافة مصدر جديد
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {/* Tabs */}
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                <Button
                  variant={activeTab === "text" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("text")}
                  className="flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  نص مباشر
                </Button>
                <Button
                  variant={activeTab === "link" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("link")}
                  className="flex-1"
                >
                  <Link className="w-4 h-4 mr-2" />
                  رابط
                </Button>
                <Button
                  variant={activeTab === "file" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab("file")}
                  className="flex-1"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  ملف
                </Button>
              </div>

              {/* Text Form */}
              {activeTab === "text" && (
                <form onSubmit={handleSubmitText} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان النص
                    </label>
                    <Input
                      type="text"
                      value={textForm.title}
                      onChange={(e) => setTextForm({ ...textForm, title: e.target.value })}
                      placeholder="مثال: معلومات عن الشركة"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      المحتوى
                    </label>
                    <Textarea
                      value={textForm.content}
                      onChange={(e) => setTextForm({ ...textForm, content: e.target.value })}
                      rows={8}
                      placeholder="اكتب المحتوى الذي تريد أن يتعلم منه البوت..."
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "جاري الإضافة..." : "إضافة النص"}
                  </Button>
                </form>
              )}

              {/* Link Form */}
              {activeTab === "link" && (
                <form onSubmit={handleSubmitLink} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الرابط
                    </label>
                    <Input
                      type="text"
                      value={linkForm.title}
                      onChange={(e) => setLinkForm({ ...linkForm, title: e.target.value })}
                      placeholder="مثال: صفحة الخدمات"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الرابط
                    </label>
                    <Input
                      type="url"
                      value={linkForm.url}
                      onChange={(e) => setLinkForm({ ...linkForm, url: e.target.value })}
                      placeholder="https://example.com/page"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "جاري الإضافة..." : "إضافة الرابط"}
                  </Button>
                </form>
              )}

              {/* File Form */}
              {activeTab === "file" && (
                <form onSubmit={handleSubmitFile} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      عنوان الملف
                    </label>
                    <Input
                      type="text"
                      value={fileForm.title}
                      onChange={(e) => setFileForm({ ...fileForm, title: e.target.value })}
                      placeholder="مثال: دليل المستخدم"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      الملف
                    </label>
                    <Input
                      type="file"
                      onChange={(e) => setFileForm({ ...fileForm, file: e.target.files?.[0] || null })}
                      accept=".txt,.pdf,.doc,.docx,.md"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      الملفات المدعومة: TXT, PDF, DOC, DOCX, MD
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full"
                  >
                    {isSubmitting ? "جاري الرفع..." : "رفع الملف"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

        {/* قائمة المصادر الموجودة */}
        <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                المصادر الموجودة ({knowledgeSources.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {knowledgeSources.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                                  <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                    <ExternalLink className="w-3 h-3" />
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(source.id)}
                          className="flex-shrink-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
      </div>
    </div>
  )
}