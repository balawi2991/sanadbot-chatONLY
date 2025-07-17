import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    // Validate input
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "جميع الحقول مطلوبة" },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: "المستخدم موجود بالفعل" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      }
    })

    // Create default bot for the user
    await prisma.bot.create({
      data: {
        userId: user.id,
        name: "مساعد سند",
        color: "#3B82F6",
        placeholder: "اكتب رسالتك هنا...",
        welcome: "مرحباً! كيف يمكنني مساعدتك اليوم؟",
        personality: "أنا مساعد ذكي ومفيد، أجيب على الأسئلة بطريقة ودودة ومهنية."
      }
    })

    return NextResponse.json(
      { message: "تم إنشاء الحساب بنجاح" },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { message: "حدث خطأ في الخادم" },
      { status: 500 }
    )
  }
}