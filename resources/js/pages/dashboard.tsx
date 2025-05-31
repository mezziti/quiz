import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Card, CardContent } from '@/components/ui/card';
import { Head } from '@inertiajs/react';
import { Award, BookOpen, Clock, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function DashboardContent({ totalQuizzes, completedQuizzes, totalQuestions, averageScore }) {
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
            </div>
        </AppLayout>
    );
}
