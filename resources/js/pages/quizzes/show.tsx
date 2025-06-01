import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Head, Link, router, usePage } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Brain, Calculator, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from "sonner"

function MathRendererFunction({ content }: { content: string }) {
    // Convert LaTeX to a more readable format for display
    const formatMath = (text: string) => {
        return text
            .replace(/\$\$([^$]+)\$\$/g, '<div class="math-display">$1</div>')
            .replace(/\$([^$]+)\$/g, '<span class="math-inline">$1</span>')
            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
            .replace(/\\([a-zA-Z]+)/g, '$1')
            .replace(/\{([^}]+)\}/g, '$1');
    };

    return (
        <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{
                __html: formatMath(content)
                    .split('\n')
                    .map((line) => {
                        if (line.startsWith('###')) {
                            return `<h3 class="text-lg font-semibold mt-6 mb-3 text-gray-800">${line.replace('###', '').trim()}</h3>`;
                        }
                        if (line.startsWith('##')) {
                            return `<h2 class="text-xl font-bold mt-8 mb-4 text-gray-900">${line.replace('##', '').trim()}</h2>`;
                        }
                        if (line.startsWith('#')) {
                            return `<h1 class="text-2xl font-bold mt-8 mb-4 text-gray-900">${line.replace('#', '').trim()}</h1>`;
                        }
                        if (line.startsWith('---')) {
                            return '<hr class="my-6 border-gray-300">';
                        }
                        if (line.trim().match(/^\d+\./)) {
                            return `<p class="mb-2 font-medium text-gray-800">${line}</p>`;
                        }
                        if (line.trim() === '') {
                            return '<br>';
                        }
                        return `<p class="mb-3 text-gray-700 leading-relaxed">${line}</p>`;
                    })
                    .join(''),
            }}
        />
    );
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Start Quiz',
        href: `/quizzes/start`,
    },
];

export default function StartQuiz({ quiz, auth }) {

    const questions = quiz.questions;
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [submitted, setSubmitted] = useState(false);
    const [results, setResults] = useState<any>(quiz.user_responses || null);
    const [analysis, setAnalysis] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [analyzingQuiz, setAnalyzingQuiz] = useState(false);

    const user = auth.user;
    const quizId = quiz.id;
    const props = usePage().props;

    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleAnswerChange = (value: string) => {
        if (!currentQuestion) return;

        setAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: value,
        }));
    };

    const nextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const analyzeQuiz = async (results) => {
        setAnalyzingQuiz(true);
        try {
            console.log(results);
            // Prepare analysis data
            const analysisData = {
                quiz: {
                    topic: quiz.topic,
                    difficulty: quiz.difficulty,
                    score: quiz.score,
                    maxScore: quiz.max_score,
                    percentage: Math.round((quiz.score / quiz.max_score) * 100),
                    language: quiz.language || 'french',
                },
                questions: questions.map((q) => {
                    const response = results.find((r) => r.question_id === q.id);
                    return {
                        question: q.question_text,
                        correctAnswer: q.correct_answer,
                        userAnswer: response?.user_answer || 'No answer',
                        isCorrect: response?.is_correct || false,
                        explanation: q.explanation,
                    };
                }),
            };

            // console.log('Analysis Data:', analysisData);

            // Generate analysis using OpenRouter's DeepSeek V3 API
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer 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`,
                    'HTTP-Referer': 'https://mathquiz-ai.vercel.app',
                    'X-Title': 'MathQuiz AI',
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a math tutor analyzing a student's quiz performance. Provide personalized recommendations to help them improve their math skills.
            
                      IMPORTANT: Respond in ${analysisData.quiz.language} language.
            
                      IMPORTANT: When writing mathematical expressions, use simple text format without LaTeX notation. For example:
                            - Instead of \$$ f(x) = 3x + 2 \$$, write: f(x) = 3x + 2
                            - Instead of \$$ \\frac{a}{b} \$$, write: a/b
                            - Instead of \$$ x^2 \$$, write: x²
                            - Instead of \$$ \\sqrt{x} \$$, write: √x
            
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
                            role: 'user',
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
                      Result: ${q.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      ${q.explanation ? `Explanation: ${q.explanation}` : ''}
                      `,
                          )
                          .join('\n')}
            
                      Please provide detailed analysis and recommendations in ${analysisData.quiz.language}.`,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 2000,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('OpenRouter API error:', errorData);
                return { error: 'Failed to analyze quiz' };
            }

            const aiResponse = await response.json();
            const analysisR = aiResponse.choices[0]?.message?.content;

            if (!analysisR) {
                return { error: 'No analysis received from AI' };
            }

            const data = {
                analysisR,
                quizData: analysisData,
            };
            setAnalysis(data.analysisR);
            router.put(`/quizzes/${quizId}`, {
                _token: props.csrf_token,
                analysis: analysisR,
            });
            toast.success("Analysis completed.")
        } catch (error) {
            console.error('Error analyzing quiz:', error);
        } finally {
            setAnalyzingQuiz(false);
        }
    };

    const submitQuiz = async () => {
        if (!quiz || !user) return;

        setLoading(true);

        try {
            // Calculate score and create responses
            let score = 0;
            const responses = [];

            for (const question of questions) {
                const userAnswer = answers[question.id] || '';
                let isCorrect = false;

                // Handle different answer types
                if (question.question_type === 'multiple_choice_multiple') {
                    // For multiple correct answers, compare sorted arrays
                    try {
                        const correctAnswers = JSON.parse(question.correct_answer);
                        const userAnswers = typeof userAnswer === 'string' ? JSON.parse(userAnswer) : userAnswer;

                        if (Array.isArray(correctAnswers) && Array.isArray(userAnswers)) {
                            const sortedCorrect = [...correctAnswers].sort();
                            const sortedUser = [...userAnswers].sort();
                            isCorrect = JSON.stringify(sortedCorrect) === JSON.stringify(sortedUser);
                        }
                    } catch (error) {
                        console.error('Error parsing multiple choice answers:', error);
                        isCorrect = false;
                    }
                } else {
                    // For single answers, direct comparison
                    isCorrect = userAnswer === question.correct_answer;
                }

                if (isCorrect) {
                    score += question.points;
                }

                responses.push({
                    quiz_id: quizId,
                    question_id: question.id,
                    user_answer: typeof userAnswer === 'object' ? JSON.stringify(userAnswer) : userAnswer,
                    is_correct: isCorrect,
                });
            }

            // console.log('Responses:', responses)
            
            // router.put(`/quizzes/${quizId}`, {
            //     _token: props.csrf_token,
            //     score: score,
            // });
            
            router.post('/user-responses', {
                _token: props.csrf_token,
                responses: JSON.stringify(responses),
                score: score,
            });
            const data = {
                score,
                totalQuestions: questions.length,
                results: responses,
            };
            setResults(data);
            setSubmitted(true);

            // Automatically analyze the quiz
            await analyzeQuiz(data.results);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!quiz || !currentQuestion) {
        return <div>Loading...</div>;
    }

    if (quiz.completed) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Start Quiz" />
                <div className="min-h-screen bg-gray-50 p-4">
                    <div className="mx-auto max-w-4xl space-y-6">
                        {/* Results Card */}
                        <Card>
                            <CardHeader className="text-center">
                                <div className="mb-4 flex items-center justify-center">
                                    <Calculator className="h-12 w-12 text-blue-600" />
                                </div>
                                <CardTitle className="text-2xl">Quiz Completed!</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6 text-center">
                                <div className="text-6xl font-bold text-blue-600">
                                    {quiz.score}/{quiz.max_score}
                                </div>
                                <div className="text-xl text-gray-600">You scored {Math.round((quiz.score / quiz.max_score) * 100)}%</div>

                                <div className="mx-auto grid max-w-md grid-cols-2 gap-4">
                                    <div className="rounded-lg bg-green-50 p-4">
                                        <div className="mb-2 flex items-center justify-center">
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div className="text-2xl font-bold text-green-600">{quiz.score}</div>
                                        <div className="text-sm text-green-600">Correct</div>
                                    </div>
                                    <div className="rounded-lg bg-red-50 p-4">
                                        <div className="mb-2 flex items-center justify-center">
                                            <XCircle className="h-6 w-6 text-red-600" />
                                        </div>
                                        <div className="text-2xl font-bold text-red-600">{quiz.max_score - quiz.score}</div>
                                        <div className="text-sm text-red-600">Incorrect</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* AI Analysis Card */}
                        <Card>
                            <CardHeader>
                                <div className="flex items-center space-x-2">
                                    <Brain className="h-6 w-6 text-purple-600" />
                                    <CardTitle className="text-xl">AI Performance Analysis</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {analyzingQuiz ? (
                                    <div className="flex items-center justify-center py-8">
                                        <Loader2 className="mr-3 h-8 w-8 animate-spin text-purple-600" />
                                        <span className="text-lg">Analyzing your performance...</span>
                                    </div>
                                ) : quiz.analysis ? (
                                    <MathRendererFunction content={quiz.analysis} />
                                ) : (
                                    <div className="py-4 text-center text-gray-500">Analysis not available. Please try again later.</div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                        <Button asChild>
                            <Link href="/quizzes/create" className="w-full">
                                Generate New Quiz
                            </Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/dashboard" className="w-full">
                                View Dashboard
                            </Link>
                        </Button>
                        </div>
                    </div>
                </div>
            </AppLayout>
        );
    }


    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Start Quiz" />
            {/* Progress */}
            <div className="border-b bg-white px-4 py-2">
                <div className="mx-auto max-w-4xl">
                    <Progress value={progress} className="h-2" />
                </div>
            </div>

            {/* Question */}
            <div className="mx-auto w-full p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">{currentQuestion.question_text}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options ? (
                            <RadioGroup value={answers[currentQuestion.id] || ''} onValueChange={handleAnswerChange}>
                                {currentQuestion.options.map((option, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <RadioGroupItem value={option} id={`option-${index}`} />
                                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                                            {option}
                                        </Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        ) : (
                            <Textarea
                                value={answers[currentQuestion.id] || ''}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                placeholder="Enter your answer..."
                                className="min-h-[100px]"
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="mt-6 flex items-center justify-between">
                    <Button variant="outline" onClick={previousQuestion} disabled={currentQuestionIndex === 0}>
                        Previous
                    </Button>

                    <div className="text-sm text-gray-600">
                        {Object.keys(answers).length} of {questions.length} answered
                    </div>

                    {currentQuestionIndex === questions.length - 1 ? (
                        <Button onClick={submitQuiz} disabled={loading || Object.keys(answers).length !== questions.length}>
                            {loading ? 'Submitting...' : 'Submit Quiz'}
                        </Button>
                    ) : (
                        <Button onClick={nextQuestion}>Next</Button>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}
