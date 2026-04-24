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

                    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                        {previewModules.length > 0 ? (
                            <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                            >
                                {previewModules.map((module) => (
                                    <AccordionItem
                                        key={module.id}
                                        value={`module-${module.id}`}
                                        className="border-b border-slate-100 px-5"
                                    >
                                        <AccordionTrigger className="py-4 hover:no-underline">
                                            <div className="flex w-full items-center justify-between pr-4">
                                                <div className="flex items-center gap-3 text-left">
                                                    <span className="text-sm font-medium text-slate-700">
                                                        {module.sort_order}.{' '}
                                                        {module.title}
                                                    </span>
                                                </div>
                                            </div>
                                        </AccordionTrigger>

                                        <AccordionContent className="pb-5">
                                            <div className="space-y-4 pl-0 md:pl-11">
                                                {module.video ? (
                                                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-black shadow-sm">
                                                        <VideoPlayer
                                                            videoUrl={
                                                                module.video
                                                            }
                                                            thumbnail={
                                                                module.thumbnail
                                                            }
                                                            title={module.title}
                                                        />
                                                    </div>
                                                ) : module.thumbnail ? (
                                                    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                                        <img
                                                            src={`/storage/${module.thumbnail}`}
                                                            alt={module.title}
                                                            className="h-auto max-h-90 w-full object-cover"
                                                        />
                                                    </div>
                                                ) : null}

                                                <div className="text-sm leading-7 text-slate-600 md:text-base">
                                                    {module.description ? (
                                                        <div data-color-mode="light">
                                                            <MDEditor.Markdown
                                                                source={
                                                                    module.description
                                                                }
                                                                className="bg-transparent!"
                                                            />
                                                        </div>
                                                    ) : (
                                                        <p className="text-slate-500">
                                                            Modul preview ini
                                                            bisa diakses untuk
                                                            melihat gambaran
                                                            materi sebelum
                                                            mendaftar penuh.
                                                        </p>
                                                    )}
                                                </div>

                                                {module.attachment && (
                                                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                                                        <p className="mb-2 text-sm font-medium text-slate-700">
                                                            Attachment Modul
                                                        </p>
                                                        <a
                                                            href={`/storage/${module.attachment}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 underline-offset-2 hover:underline"
                                                        >
                                                            <Paperclip className="h-4 w-4" />
                                                            Buka attachment
                                                        </a>
                                                    </div>
                                                )}

                                                {module.assignments &&
                                                    module.assignments.length >
                                                        0 && (
                                                        <div className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                                                            <p className="text-base font-semibold text-slate-900">
                                                                Assignment
                                                            </p>

                                                            {module.assignments.map(
                                                                (
                                                                    assignment: PreviewAssignment,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            assignment.id
                                                                        }
                                                                        className="rounded-xl border border-slate-200 bg-slate-50/60 p-4"
                                                                    >
                                                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                                            <div>
                                                                                <h3 className="font-semibold text-slate-900">
                                                                                    {
                                                                                        assignment.title
                                                                                    }
                                                                                </h3>
                                                                            </div>

                                                                            <span
                                                                                className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${
                                                                                    assignment.submission
                                                                                        ? 'bg-emerald-100 text-emerald-700'
                                                                                        : 'bg-amber-100 text-amber-700'
                                                                                }`}
                                                                            >
                                                                                {assignment.submission
                                                                                    ? 'Turned in'
                                                                                    : 'Belum dikumpulkan'}
                                                                            </span>
                                                                        </div>

                                                                        {assignment.description && (
                                                                            <div
                                                                                className="mt-2 text-sm text-slate-600"
                                                                                data-color-mode="light"
                                                                            >
                                                                                <MDEditor.Markdown
                                                                                    source={
                                                                                        assignment.description
                                                                                    }
                                                                                    className="bg-transparent!"
                                                                                />
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    )}
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        ) : (
                            <div className="flex flex-col items-center gap-2 px-5 py-8 text-center">
                                <BookOpen className="h-8 w-8 text-slate-300" />
                                <p className="text-sm text-slate-500">
                                    Belum ada modul preview tersedia.
                                </p>
                            </div>
                        )}

                        {lockedCount > 0 && (
                            <div
                                className={`flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-5 py-4`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                        <Lock className="h-4 w-4 text-slate-400" />
                                    </div>
                                    <span className="text-sm text-slate-500">
                                        + {lockedCount} modul lainnya
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
