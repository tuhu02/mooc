import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import {
    BookOpen,
    TimerIcon,
    Award,
    TrendingUp,
    ChevronRight,
    CheckCircle2,
    PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { Progress } from '@/components/ui/progress';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    const learningCourses = [
        {
            title: 'Advanced React & TypeScript',
            instructor: 'John Doe',
            progress: 65,
            lessons: '16 of 24',
            category: 'Web Development',
        },
        {
            title: 'Laravel REST API Masterclass',
            instructor: 'Jane Smith',
            progress: 40,
            lessons: '7 of 18',
            category: 'Backend Development',
        },
        {
            title: 'UI/UX Design Fundamentals',
            instructor: 'Mike Johnson',
            progress: 90,
            lessons: '14 of 15',
            category: 'Design',
        },
    ];

    const activities = [
        {
            type: 'completed',
            text: 'Completed "State Management in React"',
            subtext: 'Advanced React & TypeScript',
            time: '2 hours ago',
            icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
        },
        {
            type: 'started',
            text: 'Started new lesson',
            subtext: 'Laravel REST API Masterclass',
            time: '5 hours ago',
            icon: <PlayCircle className="h-4 w-4 text-blue-500" />,
        },
        {
            type: 'earned',
            text: 'Earned certificate',
            subtext: 'JavaScript ES6+ Essentials',
            time: '1 day ago',
            icon: <Award className="h-4 w-4 text-yellow-500" />,
        },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-semibold">Welcome back! 👋</h1>
                    <p className="text-sm text-muted-foreground text-slate-500">
                        Continue your learning journey
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                    {/* ... (Kode Stats yang sudah kamu buat tetap di sini) ... */}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Left Column: Continue Learning & Recommended */}
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Continue Learning
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Pick up where you left off
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    View All
                                </Button>
                            </div>

                            <div className="space-y-4">
                                {learningCourses.map((course, i) => (
                                    <div
                                        key={i}
                                        className="group transition-hover flex flex-col gap-3 rounded-xl border p-4 hover:bg-slate-50/50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 p-1 text-center text-[10px] font-bold">
                                                    {course.title}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-medium">
                                                        {course.title}
                                                    </h4>
                                                    <p className="text-xs font-light text-muted-foreground">
                                                        by {course.instructor}
                                                    </p>
                                                </div>
                                            </div>
                                            <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-medium tracking-wider uppercase">
                                                {course.category}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs text-muted-foreground">
                                                <span>
                                                    {course.lessons} lessons
                                                </span>
                                                <span className="font-semibold text-slate-900">
                                                    {course.progress}%
                                                </span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-slate-900 transition-all"
                                                    style={{
                                                        width: `${course.progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-slate-50/30 p-12 text-center">
                            <p className="font-medium text-muted-foreground">
                                Recommended for You section
                            </p>
                            <p className="text-xs text-slate-400">
                                Based on your learning path
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                            <h3 className="mb-1 font-semibold">
                                Recent Activity
                            </h3>
                            <p className="mb-6 text-xs text-muted-foreground">
                                Your learning history
                            </p>

                            <div className="space-y-6">
                                {activities.map((act, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                                            {act.icon}
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-sm leading-none font-medium">
                                                {act.text}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {act.subtext}
                                            </p>
                                            <p className="pt-1 text-[10px] text-slate-400">
                                                {act.time}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold">
                                Quick Actions
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="h-10 justify-between px-4 text-xs font-normal"
                                >
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" /> Browse
                                        All Courses
                                    </div>
                                    <ChevronRight className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-10 justify-between px-4 text-xs font-normal"
                                >
                                    <div className="flex items-center gap-2">
                                        <Award className="h-4 w-4" /> View
                                        Certificates
                                    </div>
                                    <ChevronRight className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-10 justify-between px-4 text-xs font-normal"
                                >
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />{' '}
                                        Learning Progress
                                    </div>
                                    <ChevronRight className="h-3 w-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
