import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/member-layout';
import type { BreadcrumbItem, Course, Module } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    BookOpen,
    CheckCircle2,
    Clock3,
    Lock,
    Paperclip,
    PlayCircle,
    Users,
} from 'lucide-react';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import MDEditor from '@uiw/react-md-editor';
import VideoPlayer from '@/components/member/video-player';

type PreviewAssignment = {
    id: number;
    title: string;
    description?: string | null;
    submission?: unknown;
};

type PreviewModule = Omit<Module, 'assignments'> & {
    is_preview: boolean;
    video?: string | null;
    thumbnail?: string | null;
    description?: string | null;
    attachment?: string | null;
    assignments?: PreviewAssignment[];
};

type CourseDetail = Course & {
    modules?: PreviewModule[];
};

type Props = {
    course: CourseDetail;
    isEnrolled?: boolean;
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Course', href: '/member/courses' },
    { title: 'Detail', href: '' },
];

const levelLabel: Record<'Beginner' | 'Intermediate' | 'Advanced', string> = {
    Beginner: 'Pemula',
    Intermediate: 'Menengah',
    Advanced: 'Mahir',
};

export default function CourseDetailPage({
    course,
    isEnrolled = false,
}: Props) {
    const modules = course.modules ?? [];
    const previewModules = modules.filter((module) => module.is_preview);
    const lockedCount = (course.modules_count ?? 0) - previewModules.length;

    const handleEnroll = () => {
        router.post(`/member/courses/${course.slug}/enroll`);
    };

    const firstPreviewModule = [...previewModules].sort(
        (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0),
    )[0];

    const handleStartLearning = () => {
        if (!firstPreviewModule) return;

        router.visit(
            `/member/courses/${course.slug}/modules/${firstPreviewModule.sort_order}`,
        );
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={course.title} />

            <div className="flex flex-1 flex-col overflow-x-hidden">
                <section className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            backgroundImage:
                                'radial-gradient(circle at 20% 30%, rgba(15, 118, 110, 0.12) 0, transparent 45%), radial-gradient(circle at 80% 35%, rgba(2, 132, 199, 0.1) 0, transparent 45%)',
                        }}
                    />

                    <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 py-10 md:px-6 lg:grid-cols-[1.7fr_1fr] lg:py-14">
                        <div className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
                                <img
                                    src={
                                        course.thumbnail
                                            ? `/storage/${course.thumbnail}`
                                            : 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop'
                                    }
                                    alt={course.title}
                                    className="h-full min-h-44 w-full rounded-xl object-cover"
                                />
                                <div className="space-y-3">
                                    <h1 className="text-2xl leading-tight font-bold text-slate-900 md:text-4xl">
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
                                                <CheckCircle2 className="h-4 w-4 text-sky-600" />
                                                Level:{' '}
                                                {levelLabel[course.level]}
                                            </span>
                                        )}
                                        <span className="inline-flex items-center gap-1">
                                            <Clock3 className="h-4 w-4 text-slate-500" />
                                            {course.modules_count ??
                                                modules.length}{' '}
                                            Modul
                                        </span>
                                        <span className="inline-flex items-center gap-1">
                                            <Users className="h-4 w-4 text-slate-500" />
                                            {(
                                                course.members_count ?? 0
                                            ).toLocaleString('id-ID')}{' '}
                                            Siswa
                                        </span>
                                    </div>
                                    <p className="line-clamp-4 text-sm leading-7 text-slate-700 md:text-base">
                                        {course.description ||
                                            'Kursus ini dirancang untuk membangun fondasi yang kuat sekaligus praktik nyata agar siap terjun ke dunia kerja.'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                            <h2 className="text-lg font-bold text-slate-900">
                                {isEnrolled
                                    ? 'Lanjutkan Belajar'
                                    : 'Mulai Belajar'}
                            </h2>
                            <p className="mt-2 text-sm text-slate-600">
                                {isEnrolled
                                    ? 'Buka modul pembelajaran dan tingkatkan skill Anda.'
                                    : 'Daftar sekarang untuk mengakses semua modul pembelajaran.'}
                            </p>
                            <div className="mt-5 space-y-3">
                                {isEnrolled ? (
                                    <Button
                                        onClick={handleStartLearning}
                                        className="w-full bg-slate-800 text-white hover:bg-slate-700"
                                    >
                                        Mulai Pembelajaran
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handleEnroll}
                                        className="w-full bg-emerald-600 text-white hover:bg-emerald-700"
                                    >
                                        Daftar Sekarang
                                    </Button>
                                )}
                                <Link href="/member/courses" className="block">
                                    <Button
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        Kembali ke Daftar Kelas
                                    </Button>
                                </Link>
                            </div>
                        </aside>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-6xl px-4 py-10 md:px-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900">
                            Pratinjau Kursus
                        </h2>
                        <span className="text-sm text-slate-500">
                            {course.modules_count ?? modules.length} modul
                            tersedia
                        </span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {modules
                            .sort(
                                (a, b) =>
                                    (a.sort_order ?? 0) - (b.sort_order ?? 0),
                            )
                            .map((module) => {
                                const isLocked =
                                    !isEnrolled && !module.is_preview;

                                return (
                                    <Link
                                        key={module.id}
                                        href={
                                            isLocked
                                                ? '#'
                                                : `/member/courses/${course.slug}/modules/${module.sort_order}`
                                        }
                                        onClick={(e) => {
                                            if (isLocked) {
                                                e.preventDefault();
                                            }
                                        }}
                                        className={`flex items-center justify-between px-5 py-4 transition ${
                                            isLocked
                                                ? 'cursor-not-allowed bg-slate-50 text-slate-400'
                                                : 'hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            {isLocked ? (
                                                <Lock className="h-5 w-5 text-slate-400" />
                                            ) : (
                                                <PlayCircle className="h-5 w-5 text-sky-600" />
                                            )}

                                            <span className="text-sm font-medium">
                                                {module.sort_order}.{' '}
                                                {module.title}
                                            </span>
                                        </div>

                                        {isLocked && (
                                            <Badge variant="secondary">
                                                Terkunci
                                            </Badge>
                                        )}
                                    </Link>
                                );
                            })}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
