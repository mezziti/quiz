import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Head, Link } from '@inertiajs/react';
import { Award, BookOpen, Calculator, Clock, Eye, Plus, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function DashboardContent({ quizzes, totalQuizzes, completedQuizzes, totalQuestions, averageScore }) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="mx-auto w-full p-6">
                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
                                    <p className="text-2xl font-bold">{totalQuizzes}</p>
                                </div>
                                <BookOpen className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Completed</p>
                                    <p className="text-2xl font-bold">{completedQuizzes}</p>
                                </div>
                                <Award className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Average Score</p>
                                    <p className="text-2xl font-bold">{Math.floor(averageScore)}%</p>
                                </div>
                                <TrendingUp className="h-8 w-8 text-purple-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Questions Answered</p>
                                    <p className="text-2xl font-bold">{totalQuestions}</p>
                                </div>
                                <Clock className="h-8 w-8 text-orange-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Recent Quizzes */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Recent Quizzes</CardTitle>
                            <Button asChild>
                                <Link href="/quizzes">See All Quizzes</Link>
                            </Button>
                        </div>
                        {/* <CardTitle>Recent Quizzes</CardTitle>
                        <Button asChild>
                            <Link href="/quizzes">See All Quizzes</Link>
                        </Button> */}
                    </CardHeader>
                    <CardContent>
                        {quizzes.length === 0 ? (
                            <div className="py-8 text-center">
                                <Calculator className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900">No quizzes yet</h3>
                                <p className="mb-4 text-gray-600">Start your math journey by creating your first quiz!</p>
                                <Link href="/chat">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Create Your First Quiz
                                    </Button>
                                </Link>
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
                                                {quiz.completed && <Badge className="bg-green-100 text-xs text-green-800">Completed</Badge>}
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
                                                    <Button variant="outline" size="sm" onClick={() => handleReviewClick(quiz.id)}>
                                                        <Eye className="mr-1 h-4 w-4" />
                                                        <span className="hidden sm:inline">Review</span>
                                                    </Button>
                                                </>
                                            ) : (
                                                <Badge variant="outline">In Progress</Badge>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
