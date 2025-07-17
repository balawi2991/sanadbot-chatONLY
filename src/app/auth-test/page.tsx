"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function AuthTest() {
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("123456")
  const [name, setName] = useState("مستخدم تجريبي")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()

  const handleRegister = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("✅ تم إنشاء الحساب بنجاح!")
      } else {
        setMessage(`❌ خطأ في التسجيل: ${data.message}`)
      }
    } catch (error) {
      setMessage("❌ خطأ في الشبكة")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setMessage("❌ خطأ في تسجيل الدخول")
      } else {
        setMessage("✅ تم تسجيل الدخول بنجاح!")
        setTimeout(() => {
          router.push("/dashboard")
        }, 1000)
      }
    } catch (error) {
      setMessage("❌ خطأ في الشبكة")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
            🧪 اختبار المصادقة
          </h1>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الاسم
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={handleRegister}
                disabled={isLoading}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {isLoading ? "جاري التسجيل..." : "إنشاء حساب"}
              </button>
              
              <button
                onClick={handleSignIn}
                disabled={isLoading}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? "جاري الدخول..." : "تسجيل الدخول"}
              </button>
            </div>
            
            {message && (
              <div className={`p-4 rounded-md text-center ${
                message.includes("✅") 
                  ? "bg-green-50 text-green-800 border border-green-200" 
                  : "bg-red-50 text-red-800 border border-red-200"
              }`}>
                {message}
              </div>
            )}
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">📋 تعليمات الاختبار:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>1. اضغط "إنشاء حساب" لإنشاء حساب جديد</li>
                <li>2. اضغط "تسجيل الدخول" لتسجيل الدخول</li>
                <li>3. إذا نجح تسجيل الدخول، ستتم إعادة توجيهك للوحة التحكم</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}