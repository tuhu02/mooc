import CourseLearningLayout from '@/layouts/course-learning-layout';
import { Head, Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Lock, Trophy, Star, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { CourseLearningCourseWithModules, CourseLearningModule, LearningProgress } from '@/types';

type CourseCompletionProps = {
    course: CourseLearningCourseWithModules;
    progress: LearningProgress;
};

export default function CourseCompletionPage({ course, progress }: CourseCompletionProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const allModules: CourseLearningModule[] = course.modules ?? [];

    const moduleSidebar = (
        <div className="flex h-full flex-col">
            {/* Header */}
            <div className="border-b border-slate-100 px-4 py-4">
                <p className="text-md font-semibold text-muted-foreground">
                    Daftar Modul
                </p>
                {/* Progress bar */}
                <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                            {progress.completed}/{progress.total} selesai
                        </span>
                        <span className="text-xs font-semibold text-sky-600">
                            {progress.percentage}%
                        </span>
                    </div>
                    <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                            className="h-full rounded-full bg-sky-500 transition-all duration-500"
                            style={{ width: `${progress.percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Module list */}
            <div className="flex-1 overflow-y-auto py-2">
                {allModules.map((module, index) => (
                    <Link
                        key={module.id}
                        href={
                            module.is_locked
                                ? '/login'
                                : `/member/courses/${course.slug}/modules/${module.sort_order}`
                        }
                        title={
                            module.is_locked
                                ? 'Login atau daftar course untuk membuka modul ini'
                                : module.title
                        }
                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                            module.is_locked
                                ? 'text-slate-400 hover:bg-slate-50'
                                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                    >
                        {/* Thumbnail */}
                        <div
                            className={`relative h-10 w-14 shrink-0 overflow-hidden rounded-md border ${
                                module.is_locked
                                    ? 'border-slate-200 opacity-50'
                                    : 'border-slate-200'
                            }`}
                        >
                            {module.thumbnail ? (
                                <img
                                    src={`/storage/${module.thumbnail}`}
                                    alt={module.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center bg-slate-100">
                                    <span className="text-xs font-semibold text-slate-400">
                                        {index + 1}
                                    </span>
                                </div>
                            )}
                            {/* Lock overlay */}
                            {module.is_locked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/60">
                                    <Lock className="h-3.5 w-3.5 text-slate-500" />
                                </div>
                            )}
                            {/* Completed checkmark */}
                            {!module.is_locked && (
                                <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <span className="min-w-0 flex-1 truncate font-medium leading-snug">
                            {module.title}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    );

    return (
        <>
            <CourseLearningLayout
                courseTitle={course.title}
                courseSlug={course.slug}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            >
                <Head title={`${course.title} - Selesai!`} />

                <div className="relative flex w-full min-h-[calc(100dvh-4rem)]">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className={`fixed top-20 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition-all duration-300 hover:bg-slate-700 ${
                            sidebarOpen ? 'left-[296px]' : 'left-4'
                        }`}
                        title={sidebarOpen ? 'Tutup daftar modul' : 'Buka daftar modul'}
                    >
                        {sidebarOpen ? (
                            <ChevronLeft className="h-5 w-5" />
                        ) : (
                            <ChevronRight className="h-5 w-5" />
                        )}
                    </button>

                    <div
                        className={`flex flex-1 justify-center transition-all duration-300 ${
                            sidebarOpen ? 'lg:ml-72' : ''
                        }`}
                    >
                        <div className="w-full max-w-4xl px-4 pb-28 pt-8 sm:px-8">
                            {/* Completion Hero */}
                            <div className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-700 p-8 text-white shadow-xl sm:p-12">
                                {/* Decorative circles */}
                                <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
                                <div className="pointer-events-none absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-white/10" />
                                <div className="pointer-events-none absolute bottom-8 right-12 h-24 w-24 rounded-full bg-white/5" />

                                <div className="relative z-10 flex flex-col items-center text-center">
                                    {/* Trophy Icon */}
                                    <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-white/20 shadow-inner backdrop-blur-sm ring-4 ring-white/30">
                                        <Trophy className="h-12 w-12 text-yellow-300 drop-shadow-md" />
                                    </div>

                                    {/* Stars */}
                                    <div className="mb-4 flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-5 w-5 fill-yellow-300 text-yellow-300 drop-shadow"
                                                style={{ animationDelay: `${i * 0.1}s` }}
                                            />
                                        ))}
                                    </div>

                                    <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-sky-100">
                                        Selamat! 🎉
                                    </p>
                                    <h1 className="mb-3 text-3xl font-extrabold leading-tight sm:text-4xl">
                                        Kamu Telah Menyelesaikan
                                    </h1>
                                    <p className="mb-1 text-xl font-semibold text-sky-100 sm:text-2xl">
                                        {course.title}
                                    </p>
                                    <p className="mt-3 max-w-md text-sm leading-relaxed text-sky-100/80">
                                        Luar biasa! Kamu berhasil menuntaskan semua modul dalam kursus ini.
                                        Teruslah belajar dan kembangkan keahlianmu!
                                    </p>
                                </div>
                            </div>

                            {/* Stats Cards */}
                            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                                <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {progress.completed}
                                    </p>
                                    <p className="text-center text-xs text-slate-500">
                                        Modul Selesai
                                    </p>
                                </div>

                                <div className="flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-50">
                                        <BookOpen className="h-5 w-5 text-sky-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {progress.total}
                                    </p>
                                    <p className="text-center text-xs text-slate-500">
                                        Total Modul
                                    </p>
                                </div>

                                <div className="col-span-2 flex flex-col items-center gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:col-span-1">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-50">
                                        <Trophy className="h-5 w-5 text-yellow-500" />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">
                                        {progress.percentage}%
                                    </p>
                                    <p className="text-center text-xs text-slate-500">
                                        Progres Kursus
                                    </p>
                                </div>
                            </div>

                            {/* Progress Bar full */}
                            <div className="mb-8 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                                <div className="mb-3 flex items-center justify-between">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Progres Keseluruhan
                                    </p>
                                    <span className="text-sm font-bold text-emerald-600">
                                        {progress.percentage}%
                                    </span>
                                </div>
                                <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-700"
                                        style={{ width: `${progress.percentage}%` }}
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-3 sm:flex-row">
                                <Link
                                    href={`/member/courses/${course.slug}`}
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                                >
                                    Kembali ke Detail Kursus
                                </Link>
                                <Link
                                    href="/member/courses"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                                >
                                    Jelajahi Kursus Lainnya
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar — Left side */}
                    <aside
                        className={`fixed top-16 left-0 bottom-0 z-20 w-72 overflow-hidden border-r border-slate-200 bg-white transition-transform duration-300 ${
                            sidebarOpen
                                ? 'translate-x-0'
                                : '-translate-x-full'
                        }`}
                    >
                        {moduleSidebar}
                    </aside>
                </div>

                {/* Bottom bar */}
                <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-slate-200 bg-white/95 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                    <div className="flex w-full items-center justify-center px-4 py-3 sm:px-6 md:py-4">
                        <span className="text-sm font-semibold text-emerald-600">
                            🎉 Kursus selesai — Semua modul berhasil dituntaskan!
                        </span>
                    </div>
                </div>
            </CourseLearningLayout>
        </>
    );
}
