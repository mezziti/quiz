import { useState } from "react"
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, ArrowLeft, ArrowRight, Clock, HelpCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
// import { useRouter } from "next/navigation"

export default function NewTestPage() {
  // const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [timeRemaining, setTimeRemaining] = useState(30 * 60) // 30 minutes in seconds

  const questions = [
    {
      id: 1,
      type: "multiple-choice",
      question: "Calculate: ⅔ + ½ = ?",
      options: ["7/6", "1/6", "1 1/6", "2/3"],
      correctAnswer: "7/6",
    },
    {
      id: 2,
      type: "multiple-choice",
      question: "Solve for x: 2x + 5 = 11",
      options: ["x = 3", "x = 8", "x = 6", "x = 2"],
      correctAnswer: "x = 3",
    },
    {
      id: 3,
      type: "short-answer",
      question: "What is the area of a rectangle with length 8 cm and width 5 cm?",
      correctAnswer: "40 cm²",
    },
    {
      id: 4,
      type: "multiple-choice",
      question: "Which of the following is equivalent to 0.75?",
      options: ["3/4", "7/10", "3/5", "7/8"],
      correctAnswer: "3/4",
    },
    {
      id: 5,
      type: "multiple-choice",
      question: "If 30% of a number is 45, what is the number?",
      options: ["135", "150", "1,350", "15"],
      correctAnswer: "150",
    },
    {
      id: 6,
      type: "short-answer",
      question: "Simplify the expression: 3(2x - 4) + 5",
      correctAnswer: "6x - 7",
    },
    {
      id: 7,
      type: "multiple-choice",
      question: "What is the perimeter of a square with sides of length 9 cm?",
      options: ["36 cm", "81 cm", "18 cm", "27 cm"],
      correctAnswer: "36 cm",
    },
    {
      id: 8,
      type: "multiple-choice",
      question: "Convert the fraction 5/8 to a decimal.",
      options: ["0.625", "0.825", "0.58", "0.125"],
      correctAnswer: "0.625",
    },
    {
      id: 9,
      type: "short-answer",
      question: "Find the value of y in the equation: 3y - 7 = 14",
      correctAnswer: "7",
    },
    {
      id: 10,
      type: "problem-solving",
      question:
        "A recipe calls for 2¾ cups of flour. If you want to make 1½ batches of the recipe, how many cups of flour will you need?",
      correctAnswer: "4 1/8 cups",
    },
    {
      id: 11,
      type: "multiple-choice",
      question: "Which of the following angles is obtuse?",
      options: ["45°", "90°", "120°", "30°"],
      correctAnswer: "120°",
    },
    {
      id: 12,
      type: "short-answer",
      question: "Factor the expression: x² - 9",
      correctAnswer: "(x + 3)(x - 3)",
    },
  ]

  const handleAnswerChange = (value: string) => {
    setAnswers({
      ...answers,
      [currentQuestion]: value,
    })
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleSubmit = () => {
    // In a real app, we would submit the answers for analysis
    // router.push("/tests/results/new")
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100

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
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md bg-muted px-3 py-1 text-sm">
                <Clock className="mr-1 h-4 w-4 text-muted-foreground" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex items-center rounded-md bg-muted px-3 py-1 text-sm">
                <span>
                  Question {currentQuestion + 1} of {questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 py-6 md:py-8 lg:py-10">
        <div className="container max-w-4xl">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold tracking-tight">Grade 8 Math Diagnostic Test</h1>
            <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
              Submit Test
            </Button>
          </div>
          <Progress value={progress} className="h-2 mb-6" />
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Question {currentQuestion + 1}</CardTitle>
                <div className="text-sm text-muted-foreground">
                  {currentQ.type === "multiple-choice"
                    ? "Multiple Choice"
                    : currentQ.type === "short-answer"
                      ? "Short Answer"
                      : "Problem Solving"}
                </div>
              </div>
              <Separator />
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-lg font-medium">{currentQ.question}</div>
                {currentQ.type === "multiple-choice" ? (
                  <RadioGroup
                    value={answers[currentQuestion] || ""}
                    onValueChange={handleAnswerChange}
                    className="space-y-3"
                  >
                    {currentQ.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-2 rounded-md border p-3 hover:bg-muted">
                        <RadioGroupItem value={option} id={`option-${index}`} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : currentQ.type === "short-answer" ? (
                  <div className="space-y-2">
                    <Label htmlFor="short-answer">Your Answer</Label>
                    <Input
                      id="short-answer"
                      value={answers[currentQuestion] || ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Type your answer here..."
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="problem-solving">Your Solution</Label>
                    <Textarea
                      id="problem-solving"
                      value={answers[currentQuestion] || ""}
                      onChange={(e) => handleAnswerChange(e.target.value)}
                      placeholder="Show your work and write your answer..."
                      className="min-h-[150px]"
                    />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <div className="flex items-center">
                <Button variant="ghost" size="icon" className="rounded-full" asChild>
                  <Link href="#help">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Help</span>
                  </Link>
                </Button>
              </div>
              {currentQuestion < questions.length - 1 ? (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="bg-emerald-600 hover:bg-emerald-700">
                  Finish Test
                </Button>
              )}
            </CardFooter>
          </Card>
          <div className="flex flex-wrap gap-2">
            {questions.map((_, index) => (
              <Button
                key={index}
                variant={index === currentQuestion ? "default" : answers[index] ? "outline" : "ghost"}
                size="icon"
                className={`h-8 w-8 rounded-full ${
                  index === currentQuestion
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : answers[index]
                      ? "border-emerald-600 text-emerald-600"
                      : ""
                }`}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
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
