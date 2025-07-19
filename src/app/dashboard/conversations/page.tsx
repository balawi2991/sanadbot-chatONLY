'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

// Types
interface MessageType {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
}

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
  const [conversations, setConversations] = useState<ConversationType[]>([])
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'qa' | 'rag' | 'fallback'>('all')
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all')
  const [stats, setStats] = useState<ConversationStats>({ total: 0, qa: 0, rag: 0, fallback: 0 })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch conversations from API
  const fetchConversations = async () => {
    if (status !== 'authenticated') return
    
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        type: filterType
      })
      
      const response = await fetch(`/api/conversations?${params}`)
      if (!response.ok) throw new Error('Failed to fetch conversations')
      
      const data = await response.json()
      
      // Transform API data to match UI structure
      const transformedConversations: ConversationType[] = data.conversations.map((conv: any) => ({
        id: conv.id,
        clientId: conv.clientId,
        question: conv.question,
        answer: conv.answer,
        responseType: conv.responseType,
        createdAt: conv.createdAt,
        // Computed fields for UI
        visitorName: conv.clientId === 'anonymous' ? 'زائر مجهول' : `زائر ${conv.clientId.slice(-4)}`,
        lastMessage: conv.question,
        messages: [
          {
            id: `${conv.id}-q`,
            type: 'user' as const,
            content: conv.question,
            timestamp: new Date(conv.createdAt)
          },
          {
            id: `${conv.id}-a`,
            type: 'bot' as const,
            content: conv.answer,
            timestamp: new Date(new Date(conv.createdAt).getTime() + 30000) // Add 30 seconds
          }
        ]
      }))
      
      setConversations(transformedConversations)
      setTotalPages(data.pagination.pages)
      
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch conversation stats
  const fetchStats = async () => {
    if (status !== 'authenticated') return
    
    try {
      const response = await fetch('/api/conversations/stats')
      if (!response.ok) throw new Error('Failed to fetch stats')
      
      const data = await response.json()
      setStats(data)
      
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchConversations()
      fetchStats()
    }
  }, [status, currentPage, searchTerm, filterType])

  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (status === 'authenticated') {
        setCurrentPage(1) // Reset to first page on search
        fetchConversations()
      }
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [searchTerm, filterType])

  // Helper functions
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ar-SA', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ar-SA', {
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

  // Filter handler
  const handleFilterChange = (type: 'all' | 'qa' | 'rag' | 'fallback') => {
    setFilterType(type)
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Show loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل المحادثات...</p>
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
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">المحادثات</h1>
        <p className="text-gray-600">إدارة ومراجعة جميع المحادثات مع الزوار</p>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">إجمالي المحادثات</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">أسئلة وأجوبة</p>
                <p className="text-2xl font-bold text-gray-900">{stats.qa}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">ذكاء اصطناعي</p>
                <p className="text-2xl font-bold text-gray-900">{stats.rag}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="mr-4">
                <p className="text-sm font-medium text-gray-600">ردود احتياطية</p>
                <p className="text-2xl font-bold text-gray-900">{stats.fallback}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        {/* Right Column - Conversations List */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow overflow-hidden">
          {/* Search and Filters - Above Conversations List */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">قائمة المحادثات</h2>
            <form onSubmit={handleSearch} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="البحث في المحادثات أو أسماء الزوار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="qa">أسئلة وأجوبة</option>
                  <option value="rag">ذكاء اصطناعي</option>
                  <option value="fallback">ردود احتياطية</option>
                </select>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">جميع التواريخ</option>
                  <option value="today">اليوم</option>
                  <option value="week">هذا الأسبوع</option>
                  <option value="month">هذا الشهر</option>
                </select>
              </div>
            </form>
            <p className="text-xs text-gray-600 mt-2">{conversations.length} محادثة</p>
          </div>
          
          <div className="overflow-y-auto h-full">
            {conversations.length === 0 ? (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">لا توجد محادثات</h3>
                <p className="mt-1 text-sm text-gray-500">لم يتم العثور على أي محادثات تطابق البحث.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
                      selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {conversation.visitorName}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {formatDate(new Date(conversation.createdAt))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {truncateMessage(conversation.lastMessage)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(new Date(conversation.createdAt))}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {conversation.messages.length} رسالة
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
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      السابق
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                    >
                      التالي
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Left Column - Conversation Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
          {selectedConversation ? (
            <div className="h-full flex flex-col">
              {/* Conversation Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      محادثة مع {selectedConversation.visitorName}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {formatDate(new Date(selectedConversation.createdAt))} - {selectedConversation.messages.length} رسالة
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    selectedConversation.responseType === 'qa' ? 'bg-green-100 text-green-800' :
                    selectedConversation.responseType === 'rag' ? 'bg-purple-100 text-purple-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedConversation.responseType === 'qa' ? 'أسئلة وأجوبة' :
                     selectedConversation.responseType === 'rag' ? 'ذكاء اصطناعي' :
                     'رد احتياطي'}
                  </span>
                </div>
              </div>
              
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
                      <p className={`text-xs mt-2 ${
                        message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
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
        </div>
      </div>
    </div>
  )
}