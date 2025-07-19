"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { HeaderSkeleton, StatCardSkeleton, CardSkeleton } from "@/components/ui/skeleton"
import { MessageSquare, FileText, Database, Settings, Palette, HelpCircle, BarChart3, Copy, TestTube, Zap, BookOpen } from "lucide-react"

interface BotData {
  id: string
  name: string
  color: string
  isActive: boolean
  _count: {
    conversations: number
    qas: number
    knowledgeSources: number
  }
}

export default function Dashboard() {
  const { data: session } = useSession()
  const [botData, setBotData] = useState<BotData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
      }
    } catch (error) {
      console.error("Error fetching bot data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <HeaderSkeleton />
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        
        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        
        {/* Test Bot Skeleton */}
        <CardSkeleton />
      </div>
    )
  }

  const embedCode = botData ? `<script src="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/embed.js" data-bot-id="${botData.id}"></script>` : ""

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#6366f1]/5 via-[#8b5cf6]/5 to-[#06b6d4]/5 rounded-[24px] p-8 border border-[#e1e7ef]/50">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent mb-2">
              مرحباً، {session?.user?.name || 'المستخدم'}
            </h1>
            <p className="text-[#64748b] text-lg font-medium">
              إليك نظرة عامة على أداء مساعدك الذكي اليوم
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-gradient-to-br from-[#6366f1] via-[#8b5cf6] to-[#06b6d4] rounded-full flex items-center justify-center shadow-lg glow-effect">
              <Zap className="w-10 h-10 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-[12px] border border-[#6366f1]/20">
                  <MessageSquare className="w-6 h-6 text-[#6366f1]" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-[#64748b]">المحادثات</p>
                  <p className="text-2xl font-bold text-[#030711]">{botData?._count?.conversations || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#10b981]/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 rounded-[12px] border border-[#10b981]/20">
                  <HelpCircle className="w-6 h-6 text-[#10b981]" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-[#64748b]">الأسئلة والأجوبة</p>
                  <p className="text-2xl font-bold text-[#030711]">{botData?._count?.qas || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#8b5cf6]/20">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#8b5cf6]/10 to-[#7c3aed]/10 rounded-[12px] border border-[#8b5cf6]/20">
                  <Database className="w-6 h-6 text-[#8b5cf6]" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-[#64748b]">مصادر المعرفة</p>
                  <p className="text-2xl font-bold text-[#030711]">{botData?._count?.knowledgeSources || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 ${botData?.isActive ? 'hover:border-[#10b981]/20' : 'hover:border-[#ef4444]/20'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-[12px] border ${botData?.isActive ? 'bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 border-[#10b981]/20' : 'bg-gradient-to-br from-[#ef4444]/10 to-[#dc2626]/10 border-[#ef4444]/20'}`}>
                    <Settings className={`w-6 h-6 ${botData?.isActive ? 'text-[#10b981]' : 'text-[#ef4444]'}`} />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-[#64748b]">حالة البوت</p>
                    <p className={`text-lg font-bold ${botData?.isActive ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                      {botData?.isActive ? 'نشط' : 'غير نشط'}
                    </p>
                  </div>
                </div>
                <Badge variant={botData?.isActive ? 'success' : 'destructive'}>
                  {botData?.isActive ? 'متاح' : 'متوقف'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Embed Code */}
          <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Copy className="w-5 h-5" />
                كود التضمين
              </CardTitle>
              <CardDescription>
                انسخ هذا الكود وألصقه في موقعك الإلكتروني لإضافة المساعد الذكي
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-[#f1f5f9] p-4 rounded-[12px] mb-4 border border-[#e1e7ef]/50">
                <code className="text-sm text-[#030711] break-all font-mono">{embedCode}</code>
              </div>
              <Button
                onClick={() => navigator.clipboard.writeText(embedCode)}
                className="w-full"
              >
                <Copy className="w-4 h-4 ml-2" />
                نسخ الكود
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                إجراءات سريعة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link
                  href="/dashboard/appearance"
                  className="flex items-center p-4 border border-[#e1e7ef]/50 rounded-[12px] hover:bg-[#f1f5f9] hover:border-[#6366f1]/20 transition-all duration-200 group"
                >
                  <div className="p-3 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-[12px] border border-[#6366f1]/20 ml-4">
                    <Palette className="w-5 h-5 text-[#6366f1]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#030711] group-hover:text-[#6366f1] transition-colors">تخصيص المظهر</h3>
                    <p className="text-sm text-[#64748b]">غير اسم البوت، الألوان، والرسائل</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/training-materials"
                  className="flex items-center p-4 border border-[#e1e7ef]/50 rounded-[12px] hover:bg-[#f1f5f9] hover:border-[#10b981]/20 transition-all duration-200 group"
                >
                  <div className="p-3 bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 rounded-[12px] border border-[#10b981]/20 ml-4">
                    <FileText className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#030711] group-hover:text-[#10b981] transition-colors">مصادر المعرفة</h3>
                    <p className="text-sm text-[#64748b]">أضف ملفات، روابط، أو نصوص</p>
                  </div>
                </Link>

                <Link
                  href="/dashboard/qa"
                  className="flex items-center p-4 border border-[#e1e7ef]/50 rounded-[12px] hover:bg-[#f1f5f9] hover:border-[#8b5cf6]/20 transition-all duration-200 group"
                >
                  <div className="p-3 bg-gradient-to-br from-[#8b5cf6]/10 to-[#7c3aed]/10 rounded-[12px] border border-[#8b5cf6]/20 ml-4">
                    <HelpCircle className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#030711] group-hover:text-[#8b5cf6] transition-colors">الأسئلة والأجوبة</h3>
                    <p className="text-sm text-[#64748b]">أضف أسئلة وأجوبة محددة</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
      </div>

      {/* Test Bot */}
      <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#06b6d4]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            اختبر مساعدك الذكي
          </CardTitle>
          <CardDescription>
            جرب المساعد الذكي الخاص بك قبل نشره على موقعك
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href={`/test/${botData?.id}`}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] hover:from-[#0891b2] hover:to-[#2563eb] text-white rounded-[12px] font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <BarChart3 className="w-5 h-5 ml-2" />
            اختبر الآن
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}