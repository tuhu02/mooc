import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/member-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes/member';
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

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface Course {
    id: number;
    title: string;
    slug: string;
    thumbnail: string;
    mentor: string;
    progress: number;
    lessons: string;
    category: string;
}

interface Activity {
    type: string;
    text: string;
    subtext: string;
    time: string;
    icon: string;
}

interface Stat {
    label: string;
    value: string | number;
    icon: string;
    color: string;
}

interface Props {
    learningCourses: Course[];
    activities: Activity[];
    stats: Stat[];
}

const iconMap: Record<string, React.ReactNode> = {
    CheckCircle2: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    PlayCircle: <PlayCircle className="h-4 w-4 text-blue-500" />,
    Award: <Award className="h-4 w-4 text-yellow-500" />,
};

export default function Dashboard({
    learningCourses,
    activities,
    stats,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Selamat datang kembali! 👋
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Lanjutkan perjalanan belajarmu
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-4">
                    {stats.map((stat, i) => (
                        <div
                            key={i}
                            className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm"
                        >
                            <div
                                className={`mb-4 w-fit rounded-lg ${stat.color} p-3`}
                            >
                                {stat.icon === 'BookOpen' && (
                                    <BookOpen className="h-5 w-5 text-slate-600" />
                                )}
                                {stat.icon === 'CheckCircle2' && (
                                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                                )}
                                {stat.icon === 'TimerIcon' && (
                                    <TimerIcon className="h-5 w-5 text-purple-600" />
                                )}
                                {stat.icon === 'TrendingUp' && (
                                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="flex flex-col gap-6 lg:col-span-2">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                            <div className="mb-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Lanjut Belajar
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        Lanjutkan dari materi terakhir yang kamu
                                        pelajari
                                    </p>
                                </div>
                                <Button variant="outline" size="sm">
                                    Lihat Semua
                                </Button>
                            </div>

                            {learningCourses.length > 0 ? (
                                <div className="space-y-4">
                                    {learningCourses.map((course) => (
                                        <div
                                            key={course.id}
                                            className="group transition-hover flex flex-col gap-3 rounded-xl border p-4 hover:bg-slate-50/50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg bg-slate-100 p-1 text-center text-[10px] font-bold">
                                                        {course.thumbnail && (
                                                            <img
                                                                src={
                                                                    course.thumbnail
                                                                }
                                                                alt={
                                                                    course.title
                                                                }
                                                                className="h-full w-full object-cover"
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-medium">
                                                            {course.title}
                                                        </h4>
                                                        <p className="text-xs font-light text-muted-foreground">
                                                            oleh {course.mentor}
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
                                                        {course.lessons} materi
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
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-slate-50/30 p-12 text-center">
                                    <p className="font-medium text-muted-foreground">
                                        Belum ada kursus yang diikuti
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Jelajahi kursus yang tersedia dan daftar
                                        untuk mulai belajar
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-6">
                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                            <h3 className="mb-1 font-semibold">
                                Aktivitas Terbaru
                            </h3>
                            <p className="mb-6 text-xs text-muted-foreground">
                                Riwayat belajarmu
                            </p>

                            {activities.length > 0 ? (
                                <div className="space-y-6">
                                    {activities.map((act, i) => (
                                        <div key={i} className="flex gap-4">
                                            <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                                                {iconMap[act.icon] || (
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                )}
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
                            ) : (
                                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-slate-50/30 p-8 text-center">
                                    <p className="text-xs text-slate-400">
                                        Belum ada aktivitas. Mulai belajar
                                        sekarang!
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="rounded-2xl border border-sidebar-border/70 bg-white p-6 shadow-sm">
                            <h3 className="mb-4 text-sm font-semibold">
                                Aksi Cepat
                            </h3>
                            <div className="flex flex-col gap-2">
                                <Button
                                    variant="outline"
                                    className="h-10 justify-between px-4 text-xs font-normal"
                                >
                                    <div className="flex items-center gap-2">
                                        <BookOpen className="h-4 w-4" />
                                        Jelajahi Semua Kursus
                                    </div>
                                    <ChevronRight className="h-3 w-3" />
                                </Button>
                                <Button
                                    variant="outline"
                                    className="h-10 justify-between px-4 text-xs font-normal"
                                >
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4" />
                                        Progress Belajar
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
