"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Session } from "next-auth"
import { 
  LayoutDashboard, 
  Palette, 
  BookOpen, 
  HelpCircle, 
  MessageSquare, 
  BarChart3, 
  Settings,
  ChevronDown,
  LogOut
} from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  session: Session | null
  onSignOut: () => void
}

const navigation = [
  {
    name: "لوحة التحكم",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "تخصيص المظهر",
    href: "/dashboard/appearance",
    icon: Palette,
  },
  {
    name: "مصادر المعرفة",
    href: "/dashboard/training-materials",
    icon: BookOpen,
  },
  {
    name: "الأسئلة والأجوبة",
    href: "/dashboard/qa",
    icon: HelpCircle,
  },
  {
    name: "المحادثات",
    href: "/dashboard/conversations",
    icon: MessageSquare,
  },
  {
    name: "التحليلات",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "الإعدادات",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function Sidebar({ isOpen, setIsOpen, session, onSignOut }: SidebarProps) {
  const pathname = usePathname()
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity lg:hidden z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 z-30 w-64 bg-white/95 backdrop-blur-xl shadow-2xl transform transition-all duration-300 ease-in-out lg:transform-none lg:fixed lg:inset-y-0 lg:right-0 lg:z-30 border-l border-[#E5E7EB]/30 h-screen ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-screen">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-[#E5E7EB]/30 bg-white/60 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="w-9 h-9 bg-gradient-to-br from-[#7F56D9] via-[#6944C6] to-[#5B21B6] rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="mr-3 text-lg font-bold text-[#1D1F23]">SanadBot</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-[#6B7280] hover:text-[#1D1F23] hover:bg-[#F3F4F6] transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-3 text-sm font-medium rounded-xl transition-all duration-200 relative ${
                    isActive
                      ? "bg-[#7F56D9]/8 text-[#7F56D9] border-r-2 border-[#7F56D9]"
                      : "text-[#64748B] hover:text-[#1E293B] hover:bg-[#F8FAFC]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className={`w-4 h-4 ml-3 transition-colors duration-200 ${
                    isActive ? "text-[#7F56D9]" : "text-[#64748B] group-hover:text-[#1E293B]"
                  }`} />
                  <span className="transition-colors duration-200 font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-[#E5E7EB]/30 bg-white/40 backdrop-blur-sm relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/70 transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#7F56D9]/12 to-[#6944C6]/12 rounded-lg flex items-center justify-center border border-[#7F56D9]/15">
                  <span className="text-sm font-semibold text-[#7F56D9]">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="mr-3 text-right">
                  <p className="text-sm font-semibold text-[#1E293B] truncate max-w-[100px]">
                    {session?.user?.name || 'المستخدم'}
                  </p>
                  <p className="text-xs text-[#64748B] font-medium">الإصدار 1.0</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#64748B] transition-transform duration-200 ${
                profileDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-[#E5E7EB]/40 py-1 z-50">
                <button
                  onClick={() => {
                    onSignOut()
                    setProfileDropdownOpen(false)
                  }}
                  className="w-full flex items-center px-3 py-2.5 text-sm text-[#EF4444] hover:bg-[#FEF2F2] transition-all duration-200 rounded-lg mx-1 font-medium"
                >
                  <LogOut className="w-4 h-4 ml-3" />
                  تسجيل الخروج
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}