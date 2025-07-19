import ChatWidget from '@/components/ChatWidget';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">سند</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                href="/test"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-md font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                🤖 اختبار المساعد
              </Link>
              <Link
                href="/auth/signin"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                إنشاء حساب
              </Link>
            </div>
          </div>
        </div>
      </header>
      {/* المحتوى الرئيسي للصفحة */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6">
            مرحباً بك في <span className="text-blue-600">سند</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            مساعدك الذكي للدردشة والمساعدة. اضغط على الشريط أدناه لبدء المحادثة
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">دردشة ذكية</h3>
              <p className="text-gray-600">تفاعل مع مساعد ذكي يفهم احتياجاتك ويقدم إجابات مفيدة</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">استجابة سريعة</h3>
              <p className="text-gray-600">احصل على إجابات فورية لأسئلتك دون انتظار</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">سهل الاستخدام</h3>
              <p className="text-gray-600">واجهة بسيطة وسهلة للجميع</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* مكون الدردشة */}
      <ChatWidget 
        botId="demo"
        config={{
          name: "مساعد سند الذكي",
          color: "#3B82F6",
          placeholder: "اكتب رسالتك هنا...",
          welcomeMessage: "مرحباً! أنا مساعد سند الذكي. كيف يمكنني مساعدتك اليوم؟",
          personality: "مساعد ذكي مفيد ومهذب يجيب على الأسئلة بطريقة واضحة ومفصلة"
        }}
      />
    </div>
  );
}
