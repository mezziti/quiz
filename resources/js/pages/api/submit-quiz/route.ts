import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { quizId, answers, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Get quiz questions
    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_index")

    if (questionsError || !questions) {
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    // Calculate score and create responses
    let score = 0
    const responses = []

    for (const question of questions) {
      const userAnswer = answers[question.id] || ""
      let isCorrect = false

      // Handle different answer types
      if (question.question_type === "multiple_choice_multiple") {
        // For multiple correct answers, compare sorted arrays
        try {
          const correctAnswers = JSON.parse(question.correct_answer)
          const userAnswers = typeof userAnswer === "string" ? JSON.parse(userAnswer) : userAnswer

          if (Array.isArray(correctAnswers) && Array.isArray(userAnswers)) {
            const sortedCorrect = [...correctAnswers].sort()
            const sortedUser = [...userAnswers].sort()
            isCorrect = JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser)
          }
        } catch (error) {
          console.error("Error parsing multiple choice answers:", error)
          isCorrect = false
        }
      } else {
        // For single answers, direct comparison
        isCorrect = userAnswer === question.correct_answer
      }

      if (isCorrect) {
        score += question.points
      }

      responses.push({
        quiz_id: quizId,
        question_id: question.id,
        user_answer: typeof userAnswer === "object" ? JSON.stringify(userAnswer) : userAnswer,
        is_correct: isCorrect,
      })
    }

    // Insert responses
    const { error: responsesError } = await supabase.from("user_responses").insert(responses)

    if (responsesError) {
      return NextResponse.json({ error: "Failed to save responses" }, { status: 500 })
    }

    // Update quiz with score and completion
    const { error: updateError } = await supabase
      .from("quizzes")
      .update({
        score,
        completed: true,
        updated_at: new Date().toISOString(),
      })
      .eq("id", quizId)

    if (updateError) {
      return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 })
    }

    return NextResponse.json({
      score,
      totalQuestions: questions.length,
      results: responses,
    })
  } catch (error) {
    console.error("Quiz submission error:", error)
    return NextResponse.json({ error: "Failed to submit quiz" }, { status: 500 })
  }
}
