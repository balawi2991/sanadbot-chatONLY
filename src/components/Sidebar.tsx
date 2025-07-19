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
        className={`fixed inset-y-0 right-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:transform-none lg:fixed lg:inset-y-0 lg:right-0 lg:z-30 border-l border-[#e1e7ef] h-screen ${
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-screen">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-[#e1e7ef]">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-[#5048e5] via-[#271ed2] to-[#2019ae] rounded-[12px] flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <span className="mr-3 text-xl font-bold text-[#030711]">SanadBot</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 rounded-[10px] text-[#64748b] hover:text-[#030711] hover:bg-[#f1f5f9] transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-4 py-3 text-base font-medium rounded-[10px] transition-all duration-200 relative ${
                    isActive
                      ? "bg-[#6366f1]/8 text-[#6366f1]"
                      : "text-[#64748b] hover:text-[#030711] hover:bg-[#f8fafc]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {isActive && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0.5 h-7 bg-[#6366f1] rounded-full" />
                  )}
                  <item.icon className={`w-6 h-6 ml-3 transition-colors duration-200 ${
                    isActive ? "text-[#6366f1]" : "text-[#64748b] group-hover:text-[#030711]"
                  }`} />
                  <span className="transition-colors duration-200">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Profile Section */}
          <div className="p-4 border-t border-[#e1e7ef] relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="w-full flex items-center justify-between p-3 rounded-[12px] hover:bg-[#f1f5f9] transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gradient-to-br from-[#6366f1]/10 to-[#8b5cf6]/10 rounded-full flex items-center justify-center border border-[#6366f1]/20">
                  <span className="text-sm font-medium text-[#6366f1]">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <div className="mr-3 text-right">
                  <p className="text-sm font-medium text-[#030711] truncate max-w-[120px]">
                    {session?.user?.name || 'المستخدم'}
                  </p>
                  <p className="text-xs text-[#64748b]">الإصدار 1.0</p>
                </div>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#64748b] transition-transform duration-200 ${
                profileDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            {/* Dropdown Menu */}
            {profileDropdownOpen && (
              <div className="absolute bottom-full left-4 right-4 mb-2 bg-white rounded-[12px] shadow-lg border border-[#e1e7ef] py-2 z-50">
                <button
                  onClick={() => {
                    onSignOut()
                    setProfileDropdownOpen(false)
                  }}
                  className="w-full flex items-center px-4 py-3 text-sm text-[#ef4444] hover:bg-[#fef2f2] transition-all duration-200"
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