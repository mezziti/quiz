import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DashboardStats, Profile, Quiz } from '@/types/quiz';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Calculator, CheckCircle, Eye, Plus, XCircle } from 'lucide-react';
import renderMathInElement from 'katex/contrib/auto-render';
import 'katex/dist/katex.min.css';
import { useEffect } from 'react';

interface DashboardContentProps {
    auth: {
        user: {
            id: string;
        };
        profile: Profile;
    };
    initialQuizzes?: Quiz[];
    initialStats?: DashboardStats;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Quizzes',
        href: '/quizzes',
    },
];

export default function Quizzes({ quizzes }) {
    const props = usePage().props;

    const submitDeleteQuiz = (quizId: string) => (e: React.FormEvent) => {
        e.preventDefault();
        router.delete(`/quizzes/${quizId}`, {
            _token: props.csrf_token,
        });
    };
    useEffect(() => {
  renderMathInElement(document.body, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$', right: '$', display: false },
    ],
  });
}, []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Quizzes" />

            <div className="mx-auto w-full p-6">
                <div className="flex justify-between">
                    <h1 className="mb-6 text-2xl font-bold">Your Quizzes</h1>

                    <Button asChild>
                        <Link href={route('quizzes.create')}>Create New Quiz</Link>
                    </Button>
                </div>
                {quizzes.length === 0 ? (
                    <div className="py-8 text-center">
                        <Calculator className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                        <h3 className="mb-2 text-lg font-medium text-gray-900">No quizzes yet</h3>
                        <p className="mb-4 text-gray-600">Start your math journey by creating your first quiz!</p>

                        <Button asChild>
                            <Link href="/quizzes/create">
                                <Plus className="mr-2 h-4 w-4" />
                                Create Your First Quiz
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {quizzes.map((quiz) => (
                            <div
                                key={quiz.id}
                                className="flex flex-col justify-between gap-4 rounded-lg border p-4 hover:bg-gray-50 sm:flex-row sm:items-center"
                            >
                                <div className="min-w-0 flex-1">
                                    <div className="mb-2 flex flex-wrap items-center gap-2">
                                        <h3 className="truncate font-medium">{quiz.title}</h3>
                                        <Badge variant="secondary" className="text-xs">
                                            {quiz.topic}
                                        </Badge>
                                        <Badge variant="outline" className="text-xs">
                                            {quiz.difficulty}
                                        </Badge>
                                        {quiz.completed ? (
                                            <Badge className="bg-green-100 text-xs text-green-800">Completed</Badge>
                                        ) : (
                                            <Badge variant="outline">In Progress</Badge>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                        <span>{quiz.total_questions} questions</span>
                                        {quiz.completed && (
                                            <span>
                                                Score: {quiz.score}/{quiz.max_score}
                                            </span>
                                        )}
                                        <span className="hidden sm:inline">{new Date(quiz.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between gap-2 sm:justify-end">
                                    {quiz.completed ? (
                                        <>
                                            <span className="text-sm font-medium text-green-600">
                                                {Math.round((quiz.score / quiz.max_score) * 100)}%
                                            </span>
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        Review
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>{quiz.title} - Review</DialogTitle>
                                                    </DialogHeader>
                                                    {
                                                        <div className="space-y-6">
                                                            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
                                                                <div>
                                                                    <p className="font-semibold">Final Score</p>
                                                                    <p className="text-2xl font-bold text-blue-600">
                                                                        {quiz.score}/{quiz.max_score}
                                                                    </p>
                                                                </div>
                                                                <div className="text-right">
                                                                    <p className="text-sm text-gray-600">Percentage</p>
                                                                    <p className="text-xl font-bold">
                                                                        {Math.round((quiz.score / quiz.max_score) * 100)}%
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            <div className="space-y-4">
                                                                {quiz.questions.map((question, index) => {
                                                                    const userResponse = quiz.user_responses[index];
                                                                    return (
                                                                        <Card key={question.id}>
                                                                            <CardContent className="p-4">
                                                                                <div className="flex items-start space-x-3">
                                                                                    <div className="flex-shrink-0">
                                                                                        {userResponse?.is_correct ? (
                                                                                            <CheckCircle className="mt-1 h-5 w-5 text-green-600" />
                                                                                        ) : (
                                                                                            <XCircle className="mt-1 h-5 w-5 text-red-600" />
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <h4 className="mb-2 font-medium">
                                                                                            Question {index + 1}: {question.question_text}
                                                                                        </h4>

                                                                                        {question.options && (
                                                                                            <div className="mb-2">
                                                                                                <p className="mb-1 text-sm text-gray-600">Options:</p>
                                                                                                <ul className="list-inside list-disc space-y-1 text-sm">
                                                                                                    {question.options.map((option, i) => (
                                                                                                        <li
                                                                                                            key={i}
                                                                                                            className={
                                                                                                                option === question.correct_answer
                                                                                                                    ? 'font-medium text-green-600'
                                                                                                                    : ''
                                                                                                            }
                                                                                                        >
                                                                                                            {option}
                                                                                                        </li>
                                                                                                    ))}
                                                                                                </ul>
                                                                                            </div>
                                                                                        )}

                                                                                        <div className="grid gap-4 text-sm md:grid-cols-2">
                                                                                            <div>
                                                                                                <p className="font-medium text-gray-700">
                                                                                                    Your Answer:
                                                                                                </p>
                                                                                                <p
                                                                                                    className={
                                                                                                        userResponse?.is_correct
                                                                                                            ? 'text-green-600'
                                                                                                            : 'text-red-600'
                                                                                                    }
                                                                                                >
                                                                                                    {userResponse?.user_answer || 'No answer'}
                                                                                                </p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="font-medium text-gray-700">
                                                                                                    Correct Answer:
                                                                                                </p>
                                                                                                <p className="text-green-600">
                                                                                                    {question.correct_answer}
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>

                                                                                        {question.explanation && (
                                                                                            <div className="mt-3 rounded-lg bg-blue-50 p-3">
                                                                                                <p className="mb-1 font-medium text-blue-800">
                                                                                                    Explanation:
                                                                                                </p>
                                                                                                <p className="text-sm text-blue-700">
                                                                                                    {question.explanation}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    }
                                                </DialogContent>
                                            </Dialog>
                                        </>
                                    ) : (
                                        <Button asChild size="sm">
                                            <Link href={`/quizzes/${quiz.id}`}>Attempt</Link>
                                        </Button>
                                    )}
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="destructive" size="sm">
                                                Delete
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent>
                                            <DialogHeader>
                                                <DialogTitle>Delete Quiz</DialogTitle>
                                            </DialogHeader>
                                            <p className="mb-4">Are you sure you want to delete this quiz? This action cannot be undone.</p>
                                            <form onSubmit={submitDeleteQuiz(quiz.id)}>
                                                <Button type="submit" variant="destructive" className="w-full">
                                                    Confirm Delete
                                                </Button>
                                            </form>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
