import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch a specific QA
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's bot
    const bot = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Find the QA and verify ownership
    const qa = await prisma.qA.findFirst({
      where: {
        id: params.id,
        botId: bot.id
      }
    })

    if (!qa) {
      return NextResponse.json({ error: "QA not found" }, { status: 404 })
    }

    return NextResponse.json(qa)
  } catch (error) {
    console.error("Error fetching QA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PUT - Update a QA
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { question, answer, isActive } = body

    // Get user's bot
    const bot = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Find the QA and verify ownership
    const existingQA = await prisma.qA.findFirst({
      where: {
        id: params.id,
        botId: bot.id
      }
    })

    if (!existingQA) {
      return NextResponse.json({ error: "QA not found" }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (question !== undefined) {
      if (!question?.trim()) {
        return NextResponse.json(
          { error: "Question cannot be empty" },
          { status: 400 }
        )
      }
      updateData.question = question.trim()
    }
    
    if (answer !== undefined) {
      if (!answer?.trim()) {
        return NextResponse.json(
          { error: "Answer cannot be empty" },
          { status: 400 }
        )
      }
      updateData.answer = answer.trim()
    }
    
    if (isActive !== undefined) {
      updateData.isActive = isActive
    }

    // Update the QA
    const updatedQA = await prisma.qA.update({
      where: { id: params.id },
      data: updateData
    })

    return NextResponse.json(updatedQA)
  } catch (error) {
    console.error("Error updating QA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete a QA
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's bot
    const bot = await prisma.bot.findUnique({
      where: { userId: session.user.id }
    })

    if (!bot) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 })
    }

    // Find the QA and verify ownership
    const qa = await prisma.qA.findFirst({
      where: {
        id: params.id,
        botId: bot.id
      }
    })

    if (!qa) {
      return NextResponse.json({ error: "QA not found" }, { status: 404 })
    }

    // Delete the QA
    await prisma.qA.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: "QA deleted successfully" })
  } catch (error) {
    console.error("Error deleting QA:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}