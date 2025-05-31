import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const quizId = params.id
    const url = new URL(request.url)
    const userId = url.searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Get quiz details
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .eq("user_id", userId)
      .single()

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    // Get questions with user responses
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select(`
        *,
        user_responses!inner(*)
      `)
      .eq("quiz_id", quizId)
      .order("order_index")

    if (questionsError) {
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    return NextResponse.json({
      quiz,
      questions,
    })
  } catch (error) {
    console.error("Quiz details error:", error)
    return NextResponse.json({ error: "Failed to fetch quiz details" }, { status: 500 })
  }
}
