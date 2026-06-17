import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/member-layout';
import type { BreadcrumbItem } from '@/types';
import { BookOpen, CheckCircle2 } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/member/dashboard' },
    { title: 'Kursus Saya', href: '/member/my-courses' },
];

interface Course {
    id: number;
    title: string;
    slug: string;
    thumbnail: string | null;
    mentor: string;
    category: string;
    progress: number;
    lessons: string;
    completed: boolean;
}

interface Props {
    courses: Course[];
}

export default function MyCourses({ courses }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kursus Saya" />

            <div className="flex flex-1 flex-col gap-6 p-4 md:p-8">
                <div>
                    <h1 className="text-2xl font-semibold">Kursus Saya</h1>
                    <p className="text-sm text-muted-foreground">
                        Semua kursus yang kamu ikuti
                    </p>
                </div>

                {courses.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {courses.map((course) => (
                            <Link
                                key={course.id}
                                href={`/member/courses/${course.slug}`}
                                className="group flex flex-col overflow-hidden rounded-2xl border border-sidebar-border/70 bg-white shadow-sm transition-shadow hover:shadow-md"
                            >
                                {/* Thumbnail */}
                                <div className="h-40 w-full overflow-hidden bg-slate-100">
                                    {course.thumbnail ? (
                                        <img
                                            src={course.thumbnail}
                                            alt={course.title}
                                            className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex h-full items-center justify-center">
                                            <BookOpen className="h-10 w-10 text-slate-300" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex flex-col gap-3 p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h3 className="text-sm leading-snug font-semibold">
                                            {course.title}
                                        </h3>
                                        {course.completed && (
                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                                        )}
                                    </div>

                                    <p className="text-xs text-muted-foreground">
                                        oleh {course.mentor}
                                    </p>

                                    <span className="w-fit rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium tracking-wider uppercase">
                                        {course.category}
                                    </span>

                                    {/* Progress */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between text-xs text-muted-foreground">
                                            <span>{course.lessons} materi</span>
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
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sidebar-border/70 bg-slate-50/30 p-16 text-center">
                        <BookOpen className="mb-3 h-10 w-10 text-slate-300" />
                        <p className="font-medium text-muted-foreground">
                            Belum ada kursus yang diikuti
                        </p>
                        <p className="mt-1 text-xs text-slate-400">
                            Jelajahi kursus yang tersedia dan daftar untuk mulai
                            belajar
                        </p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
