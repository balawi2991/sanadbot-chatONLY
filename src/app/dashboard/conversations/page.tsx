'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { HeaderSkeleton, StatCardSkeleton, CardSkeleton, TableRowSkeleton } from '@/components/ui/skeleton'
import { MessageSquare, CheckCircle, Lightbulb, AlertTriangle, Search, ChevronLeft, ChevronRight } from 'lucide-react'

// Types
interface MessageType {
  id: string
  type: 'user' | 'bot'
  content: string
  responseType?: string
  timestamp: Date
}

interface ConversationSessionType {
  id: string
  clientId: string
  title: string
  messageCount: number
  lastMessage: string
  lastMessageTime: string
  createdAt: string
  updatedAt: string
  messages: MessageType[]
  // Computed fields for UI
  visitorName: string
}

// Legacy type for backward compatibility
interface ConversationType {
  id: string
  clientId: string
  question: string
  answer: string
  responseType: 'qa' | 'rag' | 'fallback'
  createdAt: string
  // Computed fields for UI
  visitorName: string
  messages: MessageType[]
  lastMessage: string
}

interface ConversationStats {
  total: number
  qa: number
  rag: number
  fallback: number
}

export default function ConversationsPage() {
  const { data: session, status } = useSession()
  const [conversationSessions, setConversationSessions] = useState<ConversationSessionType[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ConversationSessionType | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [stats, setStats] = useState<ConversationStats>({ total: 0, qa: 0, rag: 0, fallback: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch conversation sessions from API
  const fetchConversations = async () => {
    if (status !== 'authenticated') return
    
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm
      })
      
      const response = await fetch(`/api/conversation-sessions?${params}`)
      if (!response.ok) throw new Error('Failed to fetch conversation sessions')
      
      const data = await response.json()
      
      setConversationSessions(data.conversationSessions)
      setTotalPages(data.pagination.pages)
      
    } catch (error) {
      console.error('Error fetching conversation sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch conversation stats
  const fetchStats = async () => {
    if (status !== 'authenticated') return
    
    try {
      const response = await fetch('/api/conversation-sessions?limit=1000') // Get all for stats
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const data = await response.json()
      const sessions = data.conversationSessions
      
      // Calculate stats from messages in sessions
      let totalMessages = 0
      let qaCount = 0
      let ragCount = 0
      let fallbackCount = 0
      
      sessions.forEach((session: any) => {
        session.messages.forEach((message: any) => {
          if (message.type === 'bot') {
            totalMessages++
            if (message.responseType === 'qa') qaCount++
            else if (message.responseType === 'rag') ragCount++
            else if (message.responseType === 'fallback') fallbackCount++
          }
        })
      })
      
      const stats = {
        total: sessions.length,
        qa: qaCount,
        rag: ragCount,
        fallback: fallbackCount
      }
      
      setStats(stats)
      
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations()
      fetchStats()
    }
  }, [status, currentPage, searchTerm])

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (status === 'authenticated') {
        setCurrentPage(1) // Reset to first page on search
        fetchConversations()
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Helper functions
  const formatTime = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) {
      return 'وقت غير صالح'
    }
    return dateObj.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date: Date | string) => {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) {
      return 'تاريخ غير صالح'
    }
    return dateObj.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength ? message.substring(0, maxLength) + '...' : message
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search logic is handled by fetchConversations
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <div className="space-y-8">
        {/* Header Skeleton */}
        <HeaderSkeleton />
        
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        
        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <CardSkeleton className="lg:col-span-1 min-h-[600px]" />
          <CardSkeleton className="lg:col-span-2 min-h-[600px]" />
        </div>
      </div>
    )
  }

  // Show unauthorized state
  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">يجب تسجيل الدخول لعرض المحادثات</p>
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
            <MessageSquare className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] bg-clip-text text-transparent">المحادثات</h1>
            <p className="text-[#64748b] text-lg font-medium">إدارة ومراجعة جميع المحادثات مع الزوار</p>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-[12px] border border-[#6366f1]/20">
                  <MessageSquare className="w-6 h-6 text-[#6366f1]" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-[#64748b]">إجمالي المحادثات</p>
                  <p className="text-2xl font-bold text-[#030711]">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#10b981]/20">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#10b981]/10 to-[#059669]/10 rounded-[12px] border border-[#10b981]/20">
                  <CheckCircle className="w-6 h-6 text-[#10b981]" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-[#64748b]">أسئلة وأجوبة</p>
                  <p className="text-2xl font-bold text-[#030711]">{stats.qa}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#8b5cf6]/20">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#8b5cf6]/10 to-[#7c3aed]/10 rounded-[12px] border border-[#8b5cf6]/20">
                  <Lightbulb className="w-6 h-6 text-[#8b5cf6]" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-[#64748b]">ذكاء اصطناعي</p>
                  <p className="text-2xl font-bold text-[#030711]">{stats.rag}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#ef4444]/20">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-[#ef4444]/10 to-[#dc2626]/10 rounded-[12px] border border-[#ef4444]/20">
                  <AlertTriangle className="w-6 h-6 text-[#ef4444]" />
                </div>
                <div className="mr-4">
                  <p className="text-sm font-medium text-[#64748b]">ردود احتياطية</p>
                  <p className="text-2xl font-bold text-[#030711]">{stats.fallback}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[600px]">
        {/* Right Column - Conversations List */}
        <Card className="lg:col-span-1 overflow-hidden hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
          {/* Search and Filters - Above Conversations List */}
          <CardHeader className="bg-gray-50">
            <CardTitle className="text-lg">قائمة المحادثات</CardTitle>
            <form onSubmit={handleSearch} className="space-y-3 mt-3">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="البحث في المحادثات أو أسماء الزوار..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

            </form>
            <p className="text-xs text-gray-600 mt-2">{conversationSessions.length} محادثة</p>
          </CardHeader>
          
          <div className="overflow-y-auto h-full">
            {conversationSessions.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد محادثات</h3>
                <p className="mt-1 text-sm text-gray-500">لم يتم العثور على أي محادثات تطابق البحث.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversationSessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => setSelectedConversation(session)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedConversation?.id === session.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {session.visitorName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(session.createdAt)}
                          </span>
                        </div>
                        <h4 className="text-sm font-medium text-gray-800 truncate mb-1">
                          {session.title}
                        </h4>
                        <p className="text-sm text-gray-600 truncate">
                          {truncateMessage(session.lastMessage)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(session.lastMessageTime)}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {session.messageCount} رسالة
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    صفحة {currentPage} من {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronRight className="w-4 h-4 ml-1" />
                      السابق
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      التالي
                      <ChevronLeft className="w-4 h-4 mr-1" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>
        
        {/* Left Column - Conversation Details */}
        <Card className="lg:col-span-2 overflow-hidden hover:shadow-lg transition-all duration-300 border-[#e1e7ef]/50 hover:border-[#6366f1]/20">
          {selectedConversation ? (
            <div className="h-full flex flex-col">
              {/* Conversation Header */}
              <CardHeader className="bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      محادثة مع {selectedConversation.visitorName}
                    </CardTitle>
                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                      {selectedConversation.title}
                    </h4>
                    <CardDescription>
                      {formatDate(selectedConversation.createdAt)} - {selectedConversation.messageCount} رسالة
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">
                    جلسة محادثة
                  </Badge>
                </div>
              </CardHeader>
              
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedConversation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className={`text-xs ${
                          message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                        {message.type === 'bot' && message.responseType && (
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            message.responseType === 'qa'
                              ? 'bg-green-200 text-green-800'
                              : message.responseType === 'rag'
                              ? 'bg-blue-200 text-blue-800'
                              : 'bg-gray-200 text-gray-800'
                          }`}>
                            {message.responseType === 'qa' ? 'Q&A' :
                             message.responseType === 'rag' ? 'AI' : 'Default'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              

            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8">
              <div className="text-center">
                <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">اختر محادثة لعرضها</h3>
                <p className="mt-2 text-sm text-gray-500">
                  اختر محادثة من القائمة على اليمين لعرض تفاصيلها والرسائل المتبادلة.
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}