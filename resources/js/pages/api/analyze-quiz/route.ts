import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { quizId, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "OpenRouter API key not configured" }, { status: 500 })
    }

    const supabase = createServerClient()

    // Get quiz details with questions and user responses
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .select("*")
      .eq("id", quizId)
      .eq("user_id", userId)
      .single()

    if (quizError || !quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
    }

    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .select("*")
      .eq("quiz_id", quizId)
      .order("order_index")

    if (questionsError) {
      return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 })
    }

    const { data: responses, error: responsesError } = await supabase
      .from("user_responses")
      .select("*")
      .eq("quiz_id", quizId)

    if (responsesError) {
      return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
    }

    // Prepare analysis data
    const analysisData = {
      quiz: {
        topic: quiz.topic,
        difficulty: quiz.difficulty,
        score: quiz.score,
        maxScore: quiz.max_score,
        percentage: Math.round((quiz.score / quiz.max_score) * 100),
        language: quiz.language || "french",
      },
      questions: questions.map((q) => {
        const response = responses.find((r) => r.question_id === q.id)
        return {
          question: q.question_text,
          correctAnswer: q.correct_answer,
          userAnswer: response?.user_answer || "No answer",
          isCorrect: response?.is_correct || false,
          explanation: q.explanation,
        }
      }),
    }

    // Generate analysis using OpenRouter's DeepSeek V3 API
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://mathquiz-ai.vercel.app",
        "X-Title": "MathQuiz AI",
      },
      body: JSON.stringify({
        model: "deepseek/deepseek-chat",
        messages: [
          {
            role: "system",
            content: `You are a math tutor analyzing a student's quiz performance. Provide personalized recommendations to help them improve their math skills.

IMPORTANT: Respond in ${analysisData.quiz.language} language.

For mathematical formulas, use LaTeX notation wrapped in double dollar signs ($$formula$$) for display math or single dollar signs ($formula$) for inline math.

Examples:
- For fractions: $\\frac{y_B - y_A}{x_B - x_A}$
- For functions: $f(x) = ax + b$
- For equations: $f(4) = 10$

Analyze the quiz results and provide:
1. Overall performance summary
2. Specific areas of strength
3. Areas that need improvement (if any)
4. Detailed recommendations for each weak area (if any)
5. Suggested study topics and resources
6. Encouragement and next steps

Be constructive, encouraging, and specific in your feedback. Format your response with clear headings and use mathematical notation properly.`,
          },
          {
            role: "user",
            content: `Please analyze this quiz performance:

Topic: ${analysisData.quiz.topic}
Difficulty: ${analysisData.quiz.difficulty}
Score: ${analysisData.quiz.score}/${analysisData.quiz.maxScore} (${analysisData.quiz.percentage}%)

Question Analysis:
${analysisData.questions
  .map(
    (q, i) => `
Question ${i + 1}: ${q.question}
Correct Answer: ${q.correctAnswer}
Student Answer: ${q.userAnswer}
Result: ${q.isCorrect ? "✓ Correct" : "✗ Incorrect"}
${q.explanation ? `Explanation: ${q.explanation}` : ""}
`,
  )
  .join("\n")}

Please provide detailed analysis and recommendations in ${analysisData.quiz.language}.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenRouter API error:", errorData)
      return NextResponse.json({ error: "Failed to analyze quiz" }, { status: 500 })
    }

    const aiResponse = await response.json()
    const analysis = aiResponse.choices[0]?.message?.content

    if (!analysis) {
      return NextResponse.json({ error: "No analysis received from AI" }, { status: 500 })
    }

    return NextResponse.json({
      analysis,
      quizData: analysisData,
    })
  } catch (error) {
    console.error("Quiz analysis error:", error)
    return NextResponse.json({ error: "Failed to analyze quiz" }, { status: 500 })
  }
}
