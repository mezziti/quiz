import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { ChatMessage } from '@/types/quiz';
import { Head, useForm } from '@inertiajs/react';
import { Bot, Loader2, Sparkles, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { quizTestData } from './quizTest';

const difficulties = [
    { value: '1eme annees college', label: '1AC' },
    { value: '2eme annees college', label: '2AC' },
    { value: '3eme annees college', label: '3AC' },
];

const languages = [
    { value: 'french', label: 'Français' },
    { value: 'english', label: 'English' },
    { value: 'arabic', label: 'العربية' },
];

const questionCounts = [3, 5, 10, 15, 20];

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Quiz',
        href: '/quizzes/create',
    },
];

export default function CreateQuiz() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showQuizForm, setShowQuizForm] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState('les equations');
    const [selectedDifficulty, setSelectedDifficulty] = useState('3eme annees college');
    const [selectedQuestionCount, setSelectedQuestionCount] = useState(3);
    const [selectedLanguage, setSelectedLanguage] = useState('french');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { data, setData, post } = useForm({
        title: quizTestData.title,
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        questions: quizTestData.questions,
    });

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const generateQuiz = async (NextResponse, topic: string, difficulty: string, questionCount: number, language: string) => {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer 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`,
                },
                body: JSON.stringify({
                    model: 'deepseek/deepseek-chat',
                    messages: [
                        {
                            role: 'system',
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
                            role: 'user',
                            content: `Create a ${questionCount}-question quiz on ${topic} for ${difficulty} level students in ${language}. Use simple mathematical notation without LaTeX commands.`,
                        },
                    ],
                    temperature: 0.7,
                    max_tokens: 4000,
                }),
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('OpenRouter API error:', errorData);
                return NextResponse.json({ error: 'Failed to generate quiz with AI' }, { status: 500 });
            }

            const aiResponse = await response.json();
            const content = aiResponse.choices[0]?.message?.content;

            if (!content) {
                return NextResponse.json({ error: 'No content received from AI' }, { status: 500 });
            }

            // Parse the JSON response with better error handling
            let quizData;
            try {
                // Clean the content more thoroughly
                let cleanContent = content
                    .replace(/```json\n?/g, '')
                    .replace(/```\n?/g, '')
                    .trim();

                // Handle common LaTeX escaping issues
                cleanContent = cleanContent
                    .replace(/\\\\([(){}])/g, '\\$1') // Fix double-escaped parentheses and braces
                    .replace(/\\([(){}])/g, '$1') // Remove single backslashes before parentheses and braces
                    .replace(/\\\\/g, '\\') // Fix double backslashes
                    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)') // Convert fractions
                    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)') // Convert square roots
                    .replace(/\\\(/g, '') // Remove LaTeX inline math start
                    .replace(/\\\)/g, '') // Remove LaTeX inline math end
                    .replace(/\\\[/g, '') // Remove LaTeX display math start
                    .replace(/\\\]/g, ''); // Remove LaTeX display math end

                quizData = JSON.parse(cleanContent);
            } catch (parseError) {
                console.error('Failed to parse AI response:', content);
                console.error('Parse error:', parseError);

                // Try to extract JSON from the content if it's wrapped in other text
                try {
                    const jsonMatch = content.match(/\{[\s\S]*\}/);
                    if (jsonMatch) {
                        let extractedJson = jsonMatch[0];
                        // Apply the same cleaning to extracted JSON
                        extractedJson = extractedJson
                            .replace(/\\\\([(){}])/g, '\\$1')
                            .replace(/\\([(){}])/g, '$1')
                            .replace(/\\\\/g, '\\')
                            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
                            .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
                            .replace(/\\\(/g, '')
                            .replace(/\\\)/g, '')
                            .replace(/\\\[/g, '')
                            .replace(/\\\]/g, '');

                        quizData = JSON.parse(extractedJson);
                    } else {
                        throw new Error('No valid JSON found in response');
                    }
                } catch (secondParseError) {
                    return NextResponse.json({ error: 'Invalid response format from AI' }, { status: 500 });
                }
            }

            // Validate the quiz data structure
            if (!quizData.title || !quizData.questions || !Array.isArray(quizData.questions)) {
                console.error('Invalid quiz data structure:', quizData);
                return NextResponse.json({ error: 'Invalid quiz structure from AI' }, { status: 500 });
            }

            // Clean up any remaining LaTeX in the parsed data
            const cleanQuizData = {
                ...quizData,
                questions: quizData.questions.map((q: any) => ({
                    ...q,
                    question_text: q.question_text
                        ?.replace(/\\\(/g, '')
                        .replace(/\\\)/g, '')
                        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
                        .replace(/\\sqrt\{([^}]+)\}/g, '√($1)'),
                    options: q.options?.map((opt: string) =>
                        opt
                            ?.replace(/\\\(/g, '')
                            .replace(/\\\)/g, '')
                            .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
                            .replace(/\\sqrt\{([^}]+)\}/g, '√($1)'),
                    ),
                    correct_answer: q.correct_answer
                        ?.replace(/\\\(/g, '')
                        .replace(/\\\)/g, '')
                        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
                        .replace(/\\sqrt\{([^}]+)\}/g, '√($1)'),
                    explanation: q.explanation
                        ?.replace(/\\\(/g, '')
                        .replace(/\\\)/g, '')
                        .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
                        .replace(/\\sqrt\{([^}]+)\}/g, '√($1)'),
                })),
            };

            setData('title', cleanQuizData.title);
            setData('topic', topic);
            setData('difficulty', difficulty);
            setData('questions', cleanQuizData.questions);

            return {
                quiz: cleanQuizData,
                questions: cleanQuizData.questions,
            };
        } catch (error) {
            console.error('Error generating quiz:', error);
            throw error;
        }
    };

    const handleQuizFormSubmit = async () => {
        if (!selectedTopic.trim() || !selectedDifficulty) return;

        setLoading(true);
        setShowQuizForm(false);

        const languageLabel = languages.find((l) => l.value === selectedLanguage)?.label || 'French';

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: `Create a ${selectedQuestionCount}-question quiz on ${selectedTopic} for ${selectedDifficulty} level in ${languageLabel}`,
            timestamp: new Date(),
        };

        setMessages([userMessage]);

        try {
            const { quiz, questions } = await generateQuiz({}, selectedTopic, selectedDifficulty, selectedQuestionCount, selectedLanguage);

            const assistantMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Perfect! I've created a ${selectedQuestionCount}-question ${selectedDifficulty} level quiz on ${selectedTopic} in ${languageLabel}. Click the button below to start your quiz!`,
                timestamp: new Date(),
                quiz,
                questions,
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error: any) {
            const errorMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `Sorry, I encountered an error: ${error.message}. Please try again.`,
                timestamp: new Date(),
            };

            setMessages([userMessage, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleChatSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || loading) return;

        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');

        const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "I'd be happy to help! Please use the quiz form above to create a new quiz, or check your dashboard to review previous quizzes.",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);
    };

    const resetForm = () => {
        setShowQuizForm(true);
        setMessages([]);
        setSelectedTopic('');
        setSelectedDifficulty('');
        setSelectedQuestionCount(3);
        setSelectedLanguage('french');
    };

    const submit = (e) => {
        e.preventDefault();
        post(route('quizzes.store'), data);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Quiz" />
            <div className="mx-auto w-full p-6">
                <div className="mx-auto max-w-4xl p-4">
                    {/* Quiz Creation Form */}
                    {showQuizForm && (
                        <div className="mb-6">
                            <div className="text-center">
                                <div className="mb-2 flex items-center justify-center space-x-2">
                                    <Sparkles className="h-6 w-6 text-blue-600" />
                                    <div className="text-2xl font-bold text-blue-600">QuizAI</div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="text-center">
                                    <p className="mb-6 text-lg text-gray-700">I want to take a quiz on</p>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="topic">Topic</Label>
                                        <Input
                                            id="topic"
                                            value={selectedTopic}
                                            onChange={(e) => setSelectedTopic(e.target.value)}
                                            placeholder="e.g., Algebra, Calculus, Geometry, Statistics..."
                                            className="text-lg"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="difficulty">Difficulty Level</Label>
                                            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select level" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {difficulties.map((diff) => (
                                                        <SelectItem key={diff.value} value={diff.value}>
                                                            {diff.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="language">Language</Label>
                                            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {languages.map((lang) => (
                                                        <SelectItem key={lang.value} value={lang.value}>
                                                            {lang.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="questions">Questions</Label>
                                            <Select
                                                value={selectedQuestionCount.toString()}
                                                onValueChange={(value) => setSelectedQuestionCount(Number.parseInt(value))}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {questionCounts.map((count) => (
                                                        <SelectItem key={count} value={count.toString()}>
                                                            {count} questions
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 text-center">
                                    <Button
                                        onClick={handleQuizFormSubmit}
                                        disabled={!selectedTopic.trim() || !selectedDifficulty || loading}
                                        className="hover: w-full px-8 py-3 text-lg text-white sm:w-auto"
                                        size="lg"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating Quiz...
                                            </>
                                        ) : (
                                            'Start Quiz'
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Chat Messages */}
                    {messages.length > 0 && (
                        <div className="mb-6 space-y-4">
                            {messages.map((message) => (
                                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex max-w-3xl space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                                        <div
                                            className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                                                message.role === 'user' ? 'bg-sky-600' : 'bg-gray-600'
                                            }`}
                                        >
                                            {message.role === 'user' ? (
                                                <User className="h-4 w-4 text-white" />
                                            ) : (
                                                <Bot className="h-4 w-4 text-white" />
                                            )}
                                        </div>
                                        <Card className={`${message.role === 'user' ? 'bg-sky-600 text-white' : 'bg-white'}`}>
                                            <CardContent className="p-4">
                                                <div className="whitespace-pre-wrap">{message.content}</div>

                                                {message.quiz && message.questions && (
                                                    <div className="mt-4 rounded-lg bg-gray-50 p-4">
                                                        <div className="mb-3 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                                            <h3 className="font-semibold text-gray-900">{message.quiz.title}</h3>
                                                            <div className="flex flex-wrap gap-2">
                                                                <Badge variant="secondary">{message.quiz.topic}</Badge>
                                                                <Badge variant="outline">{message.quiz.difficulty}</Badge>
                                                            </div>
                                                        </div>
                                                        <p className="mb-3 text-sm text-gray-600">
                                                            {message.quiz.total_questions} questions • {message.quiz.max_score} points
                                                        </p>
                                                        <div className="space-y-2">
                                                            <form onSubmit={submit}>
                                                                <Button className="w-full">Start Quiz</Button>
                                                            </form>
                                                            <Button variant="outline" onClick={resetForm} className="w-full">
                                                                Create Another Quiz
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            ))}

                            <div ref={messagesEndRef} />
                        </div>
                    )}

                    {/* Chat Input (only show if quiz form is hidden) */}
                    {!showQuizForm && messages.length == 1 && <Loader2 className="mr-3 h-8 w-8 animate-spin text-blue-600" />}
                </div>
            </div>
        </AppLayout>
    );
}
