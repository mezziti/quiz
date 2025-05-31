import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Empty',
        href: '/empty',
    },
];

export default function Empty() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Empty'," />
            <div className="mx-auto max-w-6xl p-6">
                <h1 className="text-2xl font-bold">Empty Page</h1>
                <p className="mt-4 text-gray-600">
                    This is an empty page. You can use it as a starting point for your own content.
                </p>
            </div>
        </AppLayout>
    );
}
