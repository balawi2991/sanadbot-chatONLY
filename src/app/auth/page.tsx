"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import * as Tabs from "@radix-ui/react-tabs"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("signin")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const router = useRouter()

  // تحديد التبويب النشط من URL
  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab === 'signup') {
      setActiveTab('signup')
    }
  }, [searchParams])

  // Sign In State
  const [signInData, setSignInData] = useState({
    email: "",
    password: ""
  })
  const [signInLoading, setSignInLoading] = useState(false)
  const [signInError, setSignInError] = useState("")

  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [signUpLoading, setSignUpLoading] = useState(false)
  const [signUpError, setSignUpError] = useState("")
  const [signUpSuccess, setSignUpSuccess] = useState(false)

  // Sign In Handler
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignInLoading(true)
    setSignInError("")

    try {
      const result = await signIn("credentials", {
        email: signInData.email,
        password: signInData.password,
        redirect: false,
      })

      if (result?.error) {
        setSignInError("بيانات الدخول غير صحيحة")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      setSignInError("حدث خطأ أثناء تسجيل الدخول")
    } finally {
      setSignInLoading(false)
    }
  }

  // Sign Up Handler
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setSignUpLoading(true)
    setSignUpError("")

    if (signUpData.password !== signUpData.confirmPassword) {
      setSignUpError("كلمات المرور غير متطابقة")
      setSignUpLoading(false)
      return
    }

    if (signUpData.password.length < 6) {
      setSignUpError("كلمة المرور يجب أن تكون 6 أحرف على الأقل")
      setSignUpLoading(false)
      return
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: signUpData.name,
          email: signUpData.email,
          password: signUpData.password,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSignUpSuccess(true)
        setTimeout(() => {
          setActiveTab("signin")
          setSignUpSuccess(false)
        }, 2000)
      } else {
        setSignUpError(data.message || "حدث خطأ أثناء إنشاء الحساب")
      }
    } catch (error) {
      setSignUpError("حدث خطأ أثناء إنشاء الحساب")
    } finally {
      setSignUpLoading(false)
    }
  }

  if (signUpSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100" dir="rtl">
        <div className="container max-w-md mx-auto p-6 rounded-xl shadow-md bg-white border border-gray-200">
          <div className="text-center">
            <div className="text-green-600 mb-4">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-center" style={{ fontFamily: 'Almarai, sans-serif' }}>
              تم إنشاء الحساب بنجاح!
            </h2>
            <p className="text-sm text-gray-600">سيتم توجيهك إلى تسجيل الدخول...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-100" dir="rtl">
      <div className="container max-w-md mx-auto p-6 rounded-xl shadow-md bg-white border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Almarai, sans-serif' }}>
            🤖 سند - المساعد الذكي
          </h1>
          <p className="text-sm text-gray-600">منصة إنشاء المساعدين الأذكياء</p>
        </div>

        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="w-full">
          <Tabs.List className="grid w-full grid-cols-2 mb-6 bg-gray-100 rounded-[10px] p-1">
            <Tabs.Trigger 
              value="signin" 
              className="px-4 py-2 text-sm font-medium rounded-[8px] transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 text-gray-600"
            >
              تسجيل الدخول
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="signup" 
              className="px-4 py-2 text-sm font-medium rounded-[8px] transition-all duration-200 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-indigo-600 text-gray-600"
            >
              إنشاء حساب
            </Tabs.Trigger>
          </Tabs.List>

          {/* Sign In Tab */}
          <Tabs.Content value="signin" className="space-y-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    required
                    dir="rtl"
                    value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    className="w-full rounded-[10px] border border-gray-300 pr-10 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    dir="rtl"
                    value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="w-full rounded-[10px] border border-gray-300 pr-10 pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                    placeholder="أدخل كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {signInError && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-[10px]">
                  {signInError}
                </div>
              )}

              <button
                type="submit"
                disabled={signInLoading}
                className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white font-medium py-2 px-4 rounded-[10px] transition-opacity duration-150 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signInLoading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </button>

              <div className="text-center">
                <button type="button" className="text-sm text-gray-500 hover:underline">
                  نسيت كلمة المرور؟
                </button>
              </div>
            </form>
          </Tabs.Content>

          {/* Sign Up Tab */}
          <Tabs.Content value="signup" className="space-y-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  الاسم الكامل
                </label>
                <div className="relative">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    required
                    dir="rtl"
                    value={signUpData.name}
                    onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                    className="w-full rounded-[10px] border border-gray-300 pr-10 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="email"
                    required
                    dir="rtl"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="w-full rounded-[10px] border border-gray-300 pr-10 pl-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    dir="rtl"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="w-full rounded-[10px] border border-gray-300 pr-10 pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                    placeholder="أدخل كلمة المرور (6 أحرف على الأقل)"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  تأكيد كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    dir="rtl"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData({ ...signUpData, confirmPassword: e.target.value })}
                    className="w-full rounded-[10px] border border-gray-300 pr-10 pl-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-right"
                    placeholder="أعد إدخال كلمة المرور"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {signUpError && (
                <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded-[10px]">
                  {signUpError}
                </div>
              )}

              <button
                type="submit"
                disabled={signUpLoading}
                className="w-full bg-gradient-to-r from-indigo-500 via-indigo-600 to-indigo-700 text-white font-medium py-2 px-4 rounded-[10px] transition-opacity duration-150 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {signUpLoading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </button>
            </form>
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  )
}