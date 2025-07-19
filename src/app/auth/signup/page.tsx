"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SignUp() {
  const router = useRouter()

  useEffect(() => {
    // إعادة توجيه إلى الصفحة الموحدة الجديدة مع تبويب التسجيل
    router.replace("/auth?tab=signup")
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600" style={{ fontFamily: 'Almarai, sans-serif' }}>جاري التحويل...</p>
      </div>
    </div>
  )
}