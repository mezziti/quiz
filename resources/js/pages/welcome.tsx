import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Award, BarChart2, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between mx-auto px-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-emerald-500" />
              <span className="font-bold">MathMentor</span>
            </Link>
            <nav className="ml-6 flex items-center space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
              <Link href="/tests" className="transition-colors hover:text-foreground/80">
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
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-emerald-50 to-white dark:from-emerald-950/30 dark:to-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
              <div className="flex flex-col items-center lg:items-start space-y-4 max-w-2xl">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Master Math with Personalized Learning
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Take diagnostic tests, identify your strengths and weaknesses, and get personalized recommendations
                    to improve your math skills.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/tests/new">Start New Test</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/dashboard">View Dashboard</Link>
                  </Button>
                </div>
              </div>
              <img
                src="https://kzmopvzca31tl1n29yzd.lite.vusercontent.net/placeholder.svg?height=550&width=800"
                width={550}
                height={550}
                alt="Hero Image"
                className="mt-8 lg:mt-0 mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:w-auto"
              />
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Our platform uses AI to identify your math strengths and weaknesses, then provides personalized
                  recommendations.
                </p>
              </div>
            </div>
            <div className="mt-12 grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <Card className="w-full max-w-sm mx-auto">
                <CardHeader className="items-center text-center pb-2">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-800/20">
                    <BookOpen className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle>Take a Test</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Complete a 10-15 question diagnostic test covering key math concepts for your grade level.
                  </p>
                </CardContent>
              </Card>
              <Card className="w-full max-w-sm mx-auto">
                <CardHeader className="items-center text-center pb-2">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-800/20">
                    <BarChart2 className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle>Get Analysis</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Our AI analyzes your answers to identify patterns, strengths, and areas that need improvement.
                  </p>
                </CardContent>
              </Card>
              <Card className="w-full max-w-sm mx-auto sm:col-span-2 lg:col-span-1">
                <CardHeader className="items-center text-center pb-2">
                  <div className="mb-2 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-800/20">
                    <Award className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <CardTitle>Improve Skills</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Follow personalized recommendations and practice exercises to strengthen your math skills.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Designed to help middle school students master math concepts with personalized learning.
                </p>
              </div>
            </div>
            <div className="mt-12 grid justify-center gap-6 sm:grid-cols-2">
              <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                  <CardTitle>Personalized Diagnostic Tests</CardTitle>
                  <CardDescription>Grade-appropriate math quizzes with mixed question types</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Multiple-choice questions</li>
                    <li>Short answer problems</li>
                    <li>Complex problem-solving</li>
                    <li>Covers fractions, decimals, algebra, geometry, and arithmetic</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                  <CardTitle>AI-Powered Analysis</CardTitle>
                  <CardDescription>Detailed evaluation of your math skills</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Identifies computational mistakes</li>
                    <li>Detects conceptual gaps</li>
                    <li>Generates comprehensive diagnostic reports</li>
                    <li>Determines proficiency levels across topics</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                  <CardTitle>Targeted Recommendations</CardTitle>
                  <CardDescription>Personalized learning resources</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Suggested lessons for weak areas</li>
                    <li>Curated video tutorials</li>
                    <li>Interactive practice exercises</li>
                    <li>Step-by-step problem walkthroughs</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="w-full max-w-md mx-auto">
                <CardHeader className="text-center">
                  <CardTitle>Progress Tracking</CardTitle>
                  <CardDescription>Monitor improvement over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Save test results and analysis</li>
                    <li>Track improvement in specific skill areas</li>
                    <li>Visualize progress with charts and graphs</li>
                    <li>Set and monitor learning goals</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center">
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to Improve Your Math Skills?
                </h2>
                <p className="text-muted-foreground md:text-xl/relaxed">
                  Start your personalized learning journey today.
                </p>
              </div>
              <div className="mt-6 flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/tests/new">Take a Diagnostic Test</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t">
        <div className="container mx-auto flex flex-col items-center justify-center gap-4 py-6 md:flex-row md:gap-8">
          <p className="text-sm text-muted-foreground">
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
