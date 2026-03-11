import { Head } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { BookOpen, TimerIcon, Award, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <h1 className="text-2xl font-semibold">Welcome Back! 👋</h1>
                <p className="text-sm text-muted-foreground">
                    Continue your learning journey
                </p>
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Course Enrolled
                                </p>
                                <h1 className="py-2 text-4xl font-bold">12</h1>
                                <p className="text-sm text-blue-500">
                                    +2 this month
                                </p>
                            </div>

                            <div className="rounded-xl bg-muted p-3">
                                <BookOpen className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Hours Learned
                                </p>
                                <h1 className="py-2 text-4xl font-bold">
                                    50.5
                                </h1>
                                <p className="text-sm text-blue-500">
                                    +12 this week
                                </p>
                            </div>
                            <div className="rounded-xl bg-muted p-3">
                                <TimerIcon className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Certificates
                                </p>
                                <h1 className="py-2 text-4xl font-bold">5</h1>
                                <p className="text-sm text-blue-500">
                                    2 in progress
                                </p>
                            </div>
                            <div className="rounded-xl bg-muted p-3">
                                <Award className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">
                                    Completion Rate
                                </p>
                                <h1 className="py-2 text-4xl font-bold">80%</h1>
                                <p className="text-sm text-blue-500">
                                    +5% from last month
                                </p>
                            </div>
                            <div className="rounded-xl bg-muted p-3">
                                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 flex flex-col gap-6">
                            <div className="card flex w-full justify-between p-4">
                                <div>
                                    <h3 className="font-semibold">
                                        Continue Learning
                                    </h3>
                                    <p className='text-muted-foreground text-sm pt-2'>Pick up where you left off</p>
                                </div>
                                <Button className="border border-gray-200 bg-white text-black hover:bg-white">
                                    View All
                                </Button>
                            </div>

                            <div className="card">Recommended For You</div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="card">Recent Activity</div>
                            <div className="card">Quick Actions</div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
