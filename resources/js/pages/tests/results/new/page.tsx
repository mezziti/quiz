import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, CheckCircle, XCircle, AlertCircle, ArrowRight, BookMarked } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function TestResultsPage() {
  const testResults = {
    score: 75,
    totalQuestions: 12,
    correctAnswers: 9,
    incorrectAnswers: 3,
    date: "May 23, 2025",
    duration: "28 minutes",
    topicBreakdown: [
      { topic: "Fractions", score: 67, questions: 3, correct: 2 },
      { topic: "Algebra", score: 80, questions: 5, correct: 4 },
      { topic: "Geometry", score: 100, questions: 2, correct: 2 },
      { topic: "Decimals", score: 50, questions: 2, correct: 1 },
    ],
    questions: [
      {
        id: 1,
        question: "Calculate: ⅔ + ½ = ?",
        userAnswer: "7/6",
        correctAnswer: "7/6",
        isCorrect: true,
        topic: "Fractions",
      },
      {
        id: 2,
        question: "Solve for x: 2x + 5 = 11",
        userAnswer: "x = 3",
        correctAnswer: "x = 3",
        isCorrect: true,
        topic: "Algebra",
      },
      {
        id: 3,
        question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
        userAnswer: "40 cm²",
        correctAnswer: "40 cm²",
        isCorrect: true,
        topic: "Geometry",
      },
      {
        id: 4,
        question: "Which of the following is equivalent to 0.75?",
        userAnswer: "3/4",
        correctAnswer: "3/4",
        isCorrect: true,
        topic: "Decimals",
      },
      {
        id: 5,
        question: "If 30% of a number is 45, what is the number?",
        userAnswer: "135",
        correctAnswer: "150",
        isCorrect: false,
        topic: "Algebra",
        errorAnalysis: "Calculation error: Divided by 0.3 instead of multiplying by 100/30.",
      },
      {
        id: 6,
        question: "Simplify the expression: 3(2x - 4) + 5",
        userAnswer: "6x - 7",
        correctAnswer: "6x - 7",
        isCorrect: true,
        topic: "Algebra",
      },
      {
        id: 7,
        question: "What is the perimeter of a square with sides of length 9 cm?",
        userAnswer: "36 cm",
        correctAnswer: "36 cm",
        isCorrect: true,
        topic: "Geometry",
      },
      {
        id: 8,
        question: "Convert the fraction 5/8 to a decimal.",
        userAnswer: "0.58",
        correctAnswer: "0.625",
        isCorrect: false,
        topic: "Decimals",
        errorAnalysis:
          "Conceptual error: Confused fraction-to-decimal conversion with writing the numerator and denominator as a decimal.",
      },
      {
        id: 9,
        question: "Find the value of y in the equation: 3y - 7 = 14",
        userAnswer: "7",
        correctAnswer: "7",
        isCorrect: true,
        topic: "Algebra",
      },
      {
        id: 10,
        question:
          "A recipe calls for 2¾ cups of flour. If you want to make 1½ batches of the recipe, how many cups of flour will you need?",
        userAnswer: "4 cups",
        correctAnswer: "4 1/8 cups",
        isCorrect: false,
        topic: "Fractions",
        errorAnalysis: "Calculation error: Correctly multiplied 2¾ by 1½ but made an error in the final calculation.",
      },
      {
        id: 11,
        question: "Which of the following angles is obtuse?",
        userAnswer: "120°",
        correctAnswer: "120°",
        isCorrect: true,
        topic: "Geometry",
      },
      {
        id: 12,
        question: "Factor the expression: x² - 9",
        userAnswer: "(x + 3)(x - 3)",
        correctAnswer: "(x + 3)(x - 3)",
        isCorrect: true,
        topic: "Algebra",
      },
    ],
    weaknesses: [
      {
        area: "Fraction Operations",
        description:
          "You had difficulty with multiplying mixed numbers and calculating with fractions in word problems.",
        recommendedResources: [
          {
            title: "Mixed Number Multiplication",
            type: "video",
            duration: "8 min",
            link: "/resources/fractions/mixed-numbers",
          },
          {
            title: "Fraction Word Problems",
            type: "practice",
            questions: 10,
            link: "/practice/fractions/word-problems",
          },
        ],
      },
      {
        area: "Decimal Conversion",
        description: "You struggled with converting fractions to decimals accurately.",
        recommendedResources: [
          {
            title: "Fraction to Decimal Conversion",
            type: "video",
            duration: "5 min",
            link: "/resources/decimals/conversion",
          },
          { title: "Conversion Practice", type: "practice", questions: 15, link: "/practice/decimals/conversion" },
        ],
      },
      {
        area: "Percentage Calculations",
        description:
          "You had difficulty with reverse percentage calculations (finding the whole when given the percentage).",
        recommendedResources: [
          { title: "Reverse Percentages", type: "video", duration: "12 min", link: "/resources/percentages/reverse" },
          { title: "Percentage Problems", type: "practice", questions: 8, link: "/practice/percentages/problems" },
        ],
      },
    ],
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-emerald-500" />
              <span className="hidden font-bold sm:inline-block">MathMentor</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
              <Link href="/tests" className="text-foreground transition-colors hover:text-foreground/80">
                Tests
              </Link>
              <Link href="/progress" className="transition-colors hover:text-foreground/80">
                Progress
              </Link>
              <Link href="/resources" className="transition-colors hover:text-foreground/80">
                Resources
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <Button asChild variant="outline" className="ml-auto hidden md:flex">
                <Link href="/profile">Student Profile</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-8 lg:py-10">
        <div className="container">
          <div className="flex flex-col gap-4 md:gap-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold tracking-tight">Test Results</h1>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/recommendations">View Recommendations</Link>
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testResults.score}%</div>
                  <Progress value={testResults.score} className="mt-2 h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {testResults.correctAnswers} correct out of {testResults.totalQuestions} questions
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Test Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{testResults.date}</div>
                  <p className="mt-2 text-xs text-muted-foreground">Completed in {testResults.duration}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Strongest Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Geometry</div>
                  <Progress value={100} className="mt-2 h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">100% accuracy (2/2 correct)</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Focus Area</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">Decimals</div>
                  <Progress value={50} className="mt-2 h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">50% accuracy (1/2 correct)</p>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="summary" className="space-y-4">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="questions">Questions</TabsTrigger>
                <TabsTrigger value="analysis">Analysis</TabsTrigger>
                <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
              </TabsList>
              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Topic Breakdown</CardTitle>
                    <CardDescription>Your performance across different math topics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testResults.topicBreakdown.map((topic) => (
                        <div key={topic.topic} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <div className="font-medium">{topic.topic}</div>
                            <div>
                              {topic.score}% ({topic.correct}/{topic.questions})
                            </div>
                          </div>
                          <Progress value={topic.score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Areas for Improvement</CardTitle>
                    <CardDescription>Based on your test performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {testResults.weaknesses.map((weakness, index) => (
                        <div key={index} className="space-y-2">
                          <h3 className="font-medium">{weakness.area}</h3>
                          <p className="text-sm text-muted-foreground">{weakness.description}</p>
                          <div className="grid gap-2 sm:grid-cols-2">
                            {weakness.recommendedResources.map((resource, idx) => (
                              <Card key={idx} className="overflow-hidden">
                                <div className="flex items-center gap-4 p-4">
                                  <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-800/20">
                                    {resource.type === "video" ? (
                                      <BookOpen className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                      <BookMarked className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    )}
                                  </div>
                                  <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none">{resource.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {resource.type === "video"
                                        ? `Video • ${resource.duration}`
                                        : `Practice • ${resource.questions} questions`}
                                    </p>
                                  </div>
                                  <Button asChild size="sm" variant="ghost" className="h-8 w-8 p-0">
                                    <Link href={resource.link}>
                                      <ArrowRight className="h-4 w-4" />
                                      <span className="sr-only">View resource</span>
                                    </Link>
                                  </Button>
                                </div>
                              </Card>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/recommendations">
                        View All Recommendations
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
              <TabsContent value="questions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Test Questions</CardTitle>
                    <CardDescription>Review your answers and see correct solutions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {testResults.questions.map((question) => (
                        <div key={question.id} className="space-y-2">
                          <div className="flex items-start gap-2">
                            {question.isCorrect ? (
                              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            )}
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">Question {question.id}</h3>
                                <span className="text-xs text-muted-foreground">{question.topic}</span>
                              </div>
                              <p>{question.question}</p>
                              <div className="grid gap-1 text-sm">
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Your answer:</span>
                                  <span className={question.isCorrect ? "text-emerald-600" : "text-red-600"}>
                                    {question.userAnswer}
                                  </span>
                                </div>
                                {!question.isCorrect && (
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Correct answer:</span>
                                    <span className="text-emerald-600">{question.correctAnswer}</span>
                                  </div>
                                )}
                                {!question.isCorrect && question.errorAnalysis && (
                                  <div className="mt-2 rounded-md bg-amber-50 p-3 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400">
                                    <div className="flex items-start gap-2">
                                      <AlertCircle className="h-4 w-4 mt-0.5" />
                                      <p className="text-xs">{question.errorAnalysis}</p>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          {question.id < testResults.questions.length && <Separator className="mt-4" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="analysis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Diagnostic Analysis</CardTitle>
                    <CardDescription>AI-powered insights into your math skills</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Strengths</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>
                            Strong understanding of geometric concepts, particularly area and perimeter calculations.
                          </li>
                          <li>Good grasp of basic algebraic equations and expressions.</li>
                          <li>Solid arithmetic skills with whole numbers.</li>
                          <li>Able to factor quadratic expressions correctly.</li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Areas for Improvement</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>
                            <span className="font-medium">Fraction Operations:</span> You had difficulty with
                            multiplying mixed numbers and working with fractions in word problems.
                          </li>
                          <li>
                            <span className="font-medium">Decimal Conversion:</span> You struggled with converting
                            fractions to decimals accurately.
                          </li>
                          <li>
                            <span className="font-medium">Percentage Calculations:</span> You had difficulty with
                            reverse percentage calculations.
                          </li>
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <h3 className="font-medium">Error Patterns</h3>
                        <div className="space-y-4">
                          <div className="rounded-md border p-4">
                            <div className="font-medium mb-2">Calculation Errors</div>
                            <p className="text-sm text-muted-foreground mb-2">
                              You made calculation errors in 2 questions, particularly when working with fractions and
                              percentages.
                            </p>
                            <div className="text-sm space-y-2">
                              <div>
                                <span className="font-medium">Example:</span> In question 5, you calculated 45 ÷ 0.3 =
                                135 instead of 45 ÷ 0.3 = 150.
                              </div>
                              <div>
                                <span className="font-medium">Recommendation:</span> Practice step-by-step calculations
                                and double-check your work.
                              </div>
                            </div>
                          </div>
                          <div className="rounded-md border p-4">
                            <div className="font-medium mb-2">Conceptual Misunderstandings</div>
                            <p className="text-sm text-muted-foreground mb-2">
                              You showed some conceptual misunderstandings in fraction-to-decimal conversion.
                            </p>
                            <div className="text-sm space-y-2">
                              <div>
                                <span className="font-medium">Example:</span> In question 8, you wrote 5/8 as 0.58
                                instead of dividing 5 by 8 to get 0.625.
                              </div>
                              <div>
                                <span className="font-medium">Recommendation:</span> Review the process of converting
                                fractions to decimals by division.
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="recommendations" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Personalized Learning Plan</CardTitle>
                    <CardDescription>Recommended resources based on your test results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {testResults.weaknesses.map((weakness, index) => (
                        <div key={index} className="space-y-4">
                          <div className="flex items-center gap-2">
                            <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-800/20">
                              <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <h3 className="font-medium text-lg">{weakness.area}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">{weakness.description}</p>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {weakness.recommendedResources.map((resource, idx) => (
                              <Card key={idx}>
                                <CardHeader className="pb-2">
                                  <CardTitle className="text-base">{resource.title}</CardTitle>
                                  <CardDescription>
                                    {resource.type === "video"
                                      ? `Video Lesson • ${resource.duration}`
                                      : `Practice Set • ${resource.questions} questions`}
                                  </CardDescription>
                                </CardHeader>
                                <CardContent className="pb-2">
                                  <p className="text-sm text-muted-foreground">
                                    {resource.type === "video"
                                      ? "Watch this video to understand key concepts and see step-by-step examples."
                                      : "Complete these practice problems to reinforce your understanding and build skills."}
                                  </p>
                                </CardContent>
                                <CardFooter>
                                  <Button asChild className="w-full">
                                    <Link href={resource.link}>
                                      {resource.type === "video" ? "Watch Lesson" : "Start Practice"}
                                    </Link>
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                          {index < testResults.weaknesses.length - 1 && <Separator className="my-2" />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col gap-4">
                    <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                      <Link href="/recommendations">Start Learning Plan</Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                      <Link href="/tests/new">Take Another Test</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="w-full border-t py-6">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 MathMentor. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
