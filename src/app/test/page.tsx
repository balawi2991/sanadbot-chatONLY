'use client'

import { useState } from 'react'
import ChatWidget from '@/components/ChatWidget'

const TestPage = () => {
  const [config] = useState({
    name: 'مساعد سند الذكي',
    color: '#3B82F6',
    placeholder: 'اكتب رسالتك هنا...',
    welcomeMessage: 'مرحباً! أنا مساعد سند الذكي. كيف يمكنني مساعدتك اليوم؟',
    personality: 'مساعد ذكي مفيد ومهذب يجيب على الأسئلة بطريقة واضحة ومفصلة'
  })

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <span className="text-3xl">🤖</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            اختبار المساعد الذكي
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            اختبر قدرات المساعد الذكي الجديد مع تقنيات الذكاء الاصطناعي المتقدمة
            <br />
            <span className="text-sm text-blue-600 font-semibold">مدعوم بـ Gemini AI و تقنية RAG</span>
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* معلومات الاختبار */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center ml-3">
                <span className="text-xl">💡</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                أسئلة للاختبار
              </h2>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">أسئلة Q&A:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• ما هو سند؟</li>
                  <li>• كيف يعمل المساعد الذكي؟</li>
                  <li>• هل يمكنني تخصيص المساعد؟</li>
                </ul>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">أسئلة RAG:</h3>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• متى تأسست شركة سند؟</li>
                  <li>• ما هي خدمات الشركة؟</li>
                  <li>• أخبرني عن الشركة</li>
                </ul>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">أسئلة عامة:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• مرحبا</li>
                  <li>• كيف حالك؟</li>
                  <li>• ما اسمك؟</li>
                </ul>
              </div>
            </div>
          </div>

          {/* معلومات تقنية */}
          <div className="bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center ml-3">
                <span className="text-xl">⚙️</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">
                المميزات التقنية
              </h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-800">Q&A ذكي</h3>
                  <p className="text-sm text-gray-600">البحث في الأسئلة والأجوبة المحفوظة</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-800">RAG مع Gemini</h3>
                  <p className="text-sm text-gray-600">استخدام مصادر المعرفة مع الذكاء الاصطناعي</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-800">حفظ المحادثات</h3>
                  <p className="text-sm text-gray-600">تسجيل جميع المحادثات في قاعدة البيانات</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 rtl:space-x-reverse">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <h3 className="font-semibold text-gray-800">أمان البيانات</h3>
                  <p className="text-sm text-gray-600">عزل كامل لبيانات كل مستخدم</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* إحصائيات */}
        <div className="mt-8 bg-white rounded-xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center ml-3">
              <span className="text-xl">📊</span>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">
              إحصائيات البوت التجريبي
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-blue-600 mb-1">3</div>
              <div className="text-sm text-blue-800 font-medium">أسئلة وأجوبة</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-green-600 mb-1">2</div>
              <div className="text-sm text-green-800 font-medium">مصادر معرفة</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-purple-600 mb-1">✓</div>
              <div className="text-sm text-purple-800 font-medium">Gemini AI</div>
            </div>
            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-orange-600 mb-1">✓</div>
              <div className="text-sm text-orange-800 font-medium">RAG نشط</div>
            </div>
          </div>
        </div>
      </div>

      {/* المساعد الذكي */}
      <ChatWidget botId="demo" config={config} />
    </div>
  )
}

export default TestPage