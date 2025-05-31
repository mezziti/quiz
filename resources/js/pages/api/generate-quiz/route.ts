
export async function GenerateQuize(topic, difficulty, questionCount, language = "french") {
  try {
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
            content: `You are a math teacher creating educational quizzes in ${language}. Generate exactly ${questionCount} math questions about ${topic} at ${difficulty} level. 

IMPORTANT: When writing mathematical expressions, use simple text format without LaTeX notation. For example:
- Instead of \$$ f(x) = 3x + 2 \$$, write: f(x) = 3x + 2
- Instead of \$$ \\frac{a}{b} \$$, write: a/b
- Instead of \$$ x^2 \$$, write: x²
- Instead of \$$ \\sqrt{x} \$$, write: √x

Format your response as a JSON object with this structure:
{
"title": "Quiz title in ${language}",
"questions": [
  {
    "question_text": "The question text in ${language} (use simple math notation)",
    "question_type": "multiple_choice" or "problem_solving",
    "options": ["A", "B", "C", "D"] (only for multiple_choice, use simple math notation),
    "correct_answer": "The correct answer in ${language} (use simple math notation)",
    "explanation": "Explanation of the solution in ${language} (use simple math notation)",
    "points": 1
  }
]
}

Make sure all questions are mathematically accurate and educational. Use simple mathematical notation without backslashes or LaTeX commands. Return ONLY the JSON object, no additional text.`,
          },
          {
            role: "user",
            content: `Create a ${questionCount}-question quiz on ${topic} for ${difficulty} level students in ${language}. Use simple mathematical notation without LaTeX commands.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenRouter API error:", errorData)
      return NextResponse.json({ error: "Failed to generate quiz with AI" }, { status: 500 })
    }

    const aiResponse = await response.json()
    const content = aiResponse.choices[0]?.message?.content

    if (!content) {
      return NextResponse.json({ error: "No content received from AI" }, { status: 500 })
    }

    // Parse the JSON response with better error handling
    let quizData
    try {
      // Clean the content more thoroughly
      let cleanContent = content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim()

      // Handle common LaTeX escaping issues
      cleanContent = cleanContent
        .replace(/\\\\([(){}])/g, "\\$1") // Fix double-escaped parentheses and braces
        .replace(/\\([(){}])/g, "$1") // Remove single backslashes before parentheses and braces
        .replace(/\\\\/g, "\\") // Fix double backslashes
        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)") // Convert fractions
        .replace(/\\sqrt\{([^}]+)\}/g, "√($1)") // Convert square roots
        .replace(/\\\(/g, "") // Remove LaTeX inline math start
        .replace(/\\\)/g, "") // Remove LaTeX inline math end
        .replace(/\\\[/g, "") // Remove LaTeX display math start
        .replace(/\\\]/g, "") // Remove LaTeX display math end

      quizData = JSON.parse(cleanContent)
    } catch (parseError) {
      console.error("Failed to parse AI response:", content)
      console.error("Parse error:", parseError)

      // Try to extract JSON from the content if it's wrapped in other text
      try {
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          let extractedJson = jsonMatch[0]
          // Apply the same cleaning to extracted JSON
          extractedJson = extractedJson
            .replace(/\\\\([(){}])/g, "\\$1")
            .replace(/\\([(){}])/g, "$1")
            .replace(/\\\\/g, "\\")
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
            .replace(/\\sqrt\{([^}]+)\}/g, "√($1)")
            .replace(/\\\(/g, "")
            .replace(/\\\)/g, "")
            .replace(/\\\[/g, "")
            .replace(/\\\]/g, "")

          quizData = JSON.parse(extractedJson)
        } else {
          throw new Error("No valid JSON found in response")
        }
      } catch (secondParseError) {
        return NextResponse.json({ error: "Invalid response format from AI" }, { status: 500 })
      }
    }

    // Validate the quiz data structure
    if (!quizData.title || !quizData.questions || !Array.isArray(quizData.questions)) {
      console.error("Invalid quiz data structure:", quizData)
      return NextResponse.json({ error: "Invalid quiz structure from AI" }, { status: 500 })
    }

    // Clean up any remaining LaTeX in the parsed data
    const cleanQuizData = {
      ...quizData,
      questions: quizData.questions.map((q: any) => ({
        ...q,
        question_text: q.question_text
          ?.replace(/\\\(/g, "")
          .replace(/\\\)/g, "")
          .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
          .replace(/\\sqrt\{([^}]+)\}/g, "√($1)"),
        options: q.options?.map((opt: string) =>
          opt
            ?.replace(/\\\(/g, "")
            .replace(/\\\)/g, "")
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
            .replace(/\\sqrt\{([^}]+)\}/g, "√($1)"),
        ),
        correct_answer: q.correct_answer
          ?.replace(/\\\(/g, "")
          .replace(/\\\)/g, "")
          .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
          .replace(/\\sqrt\{([^}]+)\}/g, "√($1)"),
        explanation: q.explanation
          ?.replace(/\\\(/g, "")
          .replace(/\\\)/g, "")
          .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, "($1)/($2)")
          .replace(/\\sqrt\{([^}]+)\}/g, "√($1)"),
      })),
    }

    const supabase = createServerClient()

    // Create quiz in database with language
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({
        user_id: userId,
        title: cleanQuizData.title,
        topic,
        difficulty,
        total_questions: questionCount,
        max_score: cleanQuizData.questions.length,
        language, // Store the language
      })
      .select()
      .single()

    if (quizError) {
      console.error("Quiz creation error:", quizError)
      return NextResponse.json({ error: "Failed to create quiz" }, { status: 500 })
    }

    // Create questions in database
    const questionsToInsert = cleanQuizData.questions.map((q: any, index: number) => ({
      quiz_id: quiz.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options || null,
      correct_answer: q.correct_answer,
      explanation: q.explanation,
      points: q.points || 1,
      order_index: index,
    }))

    const { data: questions, error: questionsError } = await supabase
      .from("questions")
      .insert(questionsToInsert)
      .select()

    if (questionsError) {
      console.error("Questions creation error:", questionsError)
      return NextResponse.json({ error: "Failed to create questions" }, { status: 500 })
    }

    return NextResponse.json({
      quiz,
      questions,
    })
  } catch (error) {
    console.error("Quiz generation error:", error)
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 })
  }
}
