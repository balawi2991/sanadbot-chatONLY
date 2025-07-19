"use client"

import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Sidebar from "@/components/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
    }
  }, [status, router])

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" })
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#ffffff]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#6366f1]"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="bg-[#F8F9FC] min-h-screen">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        session={session}
        onSignOut={handleSignOut}
      />
      
      {/* Main content */}
      <div className="lg:mr-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <div className="lg:hidden bg-white/80 backdrop-blur-md border-b border-[#e1e7ef]/50 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-[12px] text-[#64748b] hover:text-[#030711] hover:bg-[#f1f5f9] transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#7F56D9] via-[#6944C6] to-[#5B21B6] rounded-[12px] flex items-center justify-center shadow-lg">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="mr-3 text-xl font-bold text-[#1D1F23]">SanadBot</span>
            </div>
          </div>
        </div>
        
        {/* Page content with enhanced spacing */}
        <main className="flex-1 px-6 py-8 lg:px-8 lg:py-10">
          <div className="max-w-7xl mx-auto">
            <div className="ml-4 lg:ml-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}