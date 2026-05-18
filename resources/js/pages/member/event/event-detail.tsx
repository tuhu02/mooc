import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/member-layout';
import type { BreadcrumbItem, EventDetailProps } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    CalendarClock,
    CheckCircle2,
    Clock3,
    Lock,
    PlayCircle,
    Radio,
    Users,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Event', href: '/member/events' },
    { title: 'Detail', href: '' },
];

const levelLabel: Record<'Beginner' | 'Intermediate' | 'Advanced', string> = {
    Beginner: 'Pemula',
    Intermediate: 'Menengah',
    Advanced: 'Mahir',
};

function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function EventDetailPage({
    course,
    isEnrolled = false,
}: EventDetailProps) {
    const modules = course.modules ?? [];
    const now = new Date();

    const availableModules = modules.filter(
        (module) => module.available_at && new Date(module.available_at) <= now,
    );

    const firstAvailableModule = [...availableModules].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    )[0];

    const handleEnroll = () => {
        router.post(`/member/events/${course.slug}/enroll`);
    };

    const handleStartLearning = () => {
        if (firstAvailableModule) {
            router.visit(
                `/member/events/${course.slug}/modules/${firstAvailableModule.sort_order}`,
            );

            return;
        }

        router.visit(`/member/events/${course.slug}/modules`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />

            <div className="flex flex-1 flex-col overflow-x-hidden">
                <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
                    <div className="relative left-1/2 w-screen -translate-x-1/2 bg-linear-to-r from-violet-600 to-indigo-600 py-2 text-center text-xs font-semibold tracking-widest text-white uppercase">
                        <Radio className="mr-2 inline-block h-3.5 w-3.5 animate-pulse" />
                        Live Event Series
                    </div>

                    <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.7fr_1fr] lg:py-14">
                        <div className="flex flex-col gap-4">
                            <div className="relative overflow-hidden rounded-2xl">
                                <img
                                    src={
                                        course.thumbnail
                                            ? `/storage/${course.thumbnail}`
                                            : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1200&auto=format&fit=crop'
                                    }
                                    alt={course.title}
                                    className="aspect-video w-full object-cover"
                                />

                                <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white shadow">
                                    <Radio className="h-3 w-3 animate-pulse" />
                                    Event
                                </span>
                            </div>

                            <div className="space-y-3">
                                <h1 className="text-2xl leading-tight font-bold text-slate-900 md:text-3xl">
                                    {course.title}
                                </h1>

                                <div className="flex flex-wrap items-center gap-2">
                                    {course.categories?.map((category) => (
                                        <Badge
                                            key={category.id}
                                            variant="secondary"
                                        >
                                            {category.name}
                                        </Badge>
                                    ))}
                                </div>

                                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                                    {course.level && (
                                        <span className="inline-flex items-center gap-1">
                                            <CheckCircle2 className="h-4 w-4 text-violet-600" />
                                            Level: {levelLabel[course.level]}
                                        </span>
                                    )}

                                    <span className="inline-flex items-center gap-1">
                                        <Clock3 className="h-4 w-4 text-slate-500" />
                                        {course.modules_count ?? modules.length}{' '}
                                        Sesi
                                    </span>

                                    <span className="inline-flex items-center gap-1">
                                        <Users className="h-4 w-4 text-slate-500" />
                                        {(
                                            course.members_count ?? 0
                                        ).toLocaleString('id-ID')}{' '}
                                        Peserta
                                    </span>
                                </div>

                                <p className="text-sm leading-7 text-slate-700 md:text-base">
                                    {course.description ||
                                        'Event live ini dirancang untuk memberikan pengalaman belajar langsung bersama mentor berpengalaman.'}
                                </p>
                            </div>
                        </div>

                        <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-lg font-bold text-slate-900">
                                {isEnrolled ? 'Ikuti Sesi' : 'Daftar Event'}
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                {isEnrolled
                                    ? 'Akses sesi yang sudah tersedia dan pantau jadwal sesi berikutnya.'
                                    : 'Daftar sekarang untuk mengikuti semua sesi live event ini.'}
                            </p>

                            <div className="mt-5 space-y-3">
                                {isEnrolled ? (
                                    <Button
                                        onClick={handleStartLearning}
                                        className="w-full bg-violet-600 text-white hover:bg-violet-700"
                                    >
                                        {firstAvailableModule
                                            ? 'Mulai Sesi'
                                            : 'Lihat Jadwal Sesi'}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleEnroll}
                                        className="w-full bg-violet-600 text-white hover:bg-violet-700"
                                    >
                                        Daftar Sekarang
                                    </Button>
                                )}

                                <Link href="/member/events" className="block">
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        Kembali ke Daftar Event
                                    </Button>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">
                            Jadwal Sesi
                        </h2>

                        <span className="text-sm text-slate-500">
                            {course.modules_count ?? modules.length} sesi
                            tersedia
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100 rounded-2xl ring-1 ring-slate-100">
                        {modules
                            .sort(
                                (a, b) =>
                                    (a.sort_order ?? 0) - (b.sort_order ?? 0),
                            )
                            .map((module) => {
                                const moduleDate = module.available_at
                                    ? new Date(module.available_at)
                                    : null;

                                const isScheduled =
                                    moduleDate !== null && moduleDate > now;

                                const isAvailable =
                                    moduleDate !== null && moduleDate <= now;

                                const isLocked = !isEnrolled || !isAvailable;

                                const availableAtText = module.available_at
                                    ? formatDate(module.available_at)
                                    : 'Jadwal belum ditentukan';

                                return (
                                    <Link
                                        key={module.id}
                                        href={
                                            isLocked
                                                ? '#'
                                                : `/member/events/${course.slug}/modules/${module.sort_order}`
                                        }
                                        onClick={(e) => {
                                            if (isLocked) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className={`flex items-center justify-between gap-4 px-5 py-4 transition first:rounded-t-2xl last:rounded-b-2xl ${
                                            isLocked
                                                ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                                                : 'hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            {isScheduled ? (
                                                <CalendarClock className="h-5 w-5 shrink-0 text-violet-400" />
                                            ) : isLocked ? (
                                                <Lock className="h-5 w-5 shrink-0 text-slate-400" />
                                            ) : (
                                                <PlayCircle className="h-5 w-5 shrink-0 text-violet-600" />
                                            )}

                                            <div className="flex min-w-0 flex-col">
                                                <span className="truncate text-sm font-medium">
                                                    {module.sort_order}.{' '}
                                                    {module.title}
                                                </span>

                                                <span
                                                    className={`mt-0.5 text-xs ${
                                                        isScheduled
                                                            ? 'text-violet-500'
                                                            : isAvailable
                                                              ? 'text-emerald-600'
                                                              : 'text-slate-400'
                                                    }`}
                                                >
                                                    {isScheduled
                                                        ? `Tersedia: ${availableAtText}`
                                                        : isAvailable
                                                          ? `Dibuka: ${availableAtText}`
                                                          : availableAtText}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="shrink-0">
                                            {isScheduled ? (
                                                <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                                                    {availableAtText}
                                                </Badge>
                                            ) : isLocked ? (
                                                <Badge variant="secondary">
                                                    {availableAtText}
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                                                    {availableAtText}
                                                </Badge>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
