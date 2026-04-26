import AppLayout from '@/layouts/member-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, ChevronLeft, Paperclip, X } from 'lucide-react';
import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import VideoPlayer from '@/components/member/video-player';
import AssignmentSubmissionForm from '@/components/member/assignment-submission-form';
import { Props } from '@/types/course-learning';

export default function CourseLearningPage({
    course,
    currentModule,
    navigation,
    isEnrolled,
}: Props) {
    const selectedModule = currentModule ?? null;

    const selectedAttachmentUrl = selectedModule?.attachment
        ? `/storage/${selectedModule.attachment}`
        : null;

    const prevModule = navigation?.previous ?? null;
    const nextModule = navigation?.next ?? null;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Course', href: '/member/courses' },
        { title: course.title, href: `/member/courses/${course.slug}` },
        { title: 'Belajar', href: '' },
    ];

    const [activeAssignment, setActiveAssignment] = useState<{
        id: number;
        title: string;
        submission?: {
            id: number;
            submission_name?: string | null;
            file?: string | null;
        } | null;
    } | null>(null);

    return (
        <>
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title={`${course.title} - Learning`} />

                <div className="flex min-h-screen flex-1 flex-col bg-slate-50">
                    <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-8 pb-24 md:px-6">
                        <div className="min-w-0 flex-1">
                            <div className="px-2 pb-8">
                                <h1 className="mb-6 text-2xl font-bold text-slate-900">
                                    {selectedModule?.title ?? 'Pilih Materi'}
                                </h1>

                                {selectedModule?.video ? (
                                    <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-black shadow-md">
                                        <VideoPlayer
                                            videoUrl={selectedModule.video}
                                            title={selectedModule.title}
                                        />
                                    </div>
                                ) : null}

                                {selectedModule?.thumbnail ? (
                                    <div className="mb-6">
                                        <img
                                            src={`/storage/${selectedModule.thumbnail}`}
                                            alt={selectedModule.title}
                                            className="h-auto w-full max-w-2xl rounded-lg object-cover shadow-md"
                                        />
                                    </div>
                                ) : null}

                                <div className="text-sm leading-7 text-slate-600 md:text-base">
                                    {selectedModule?.description ? (
                                        <div data-color-mode="light">
                                            <MDEditor.Markdown
                                                source={
                                                    selectedModule.description
                                                }
                                                className="bg-transparent!"
                                            />
                                        </div>
                                    ) : (
                                        <p className="text-slate-500">
                                            Materi modul belum tersedia.
                                        </p>
                                    )}
                                </div>

                                {selectedAttachmentUrl && (
                                    <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
                                        <p className="mb-2 text-sm font-medium text-slate-700">
                                            Lampiran Modul
                                        </p>
                                        <a
                                            href={selectedAttachmentUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 text-sm font-medium text-sky-700 underline-offset-2 hover:underline"
                                        >
                                            <Paperclip className="h-4 w-4" />
                                            Buka attachment
                                        </a>
                                    </div>
                                )}

                                {selectedModule?.assignments &&
                                    selectedModule.assignments.length > 0 && (
                                        <div className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-4">
                                            <p className="text-base font-semibold text-slate-900">
                                                Assignment
                                            </p>
                                            {selectedModule.assignments.map(
                                                (assignment: any) => (
                                                    <div
                                                        key={assignment.id}
                                                        onClick={() =>
                                                            setActiveAssignment(
                                                                {
                                                                    id: assignment.id,
                                                                    title: assignment.title,
                                                                    submission:
                                                                        assignment.submission ??
                                                                        null,
                                                                },
                                                            )
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
                                                                    ? 'Sudah dikumpulkan'
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
                        </div>
                    </div>
                </div>
            </AppLayout>

            {activeAssignment !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget)
                            setActiveAssignment(null);
                    }}
                >
                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Kumpulkan Tugas
                                </h2>
                                <p className="text-base font-semibold text-slate-900">
                                    Tugas
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveAssignment(null)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="px-6 py-5">
                            <AssignmentSubmissionForm
                                assignmentId={activeAssignment.id}
                                submission={activeAssignment.submission ?? null}
                                onSuccess={() => setActiveAssignment(null)}
                            />
                        </div>
                    </div>
                </div>
            )}

            <div className="sticky bottom-0 w-full border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                <div className="flex w-full items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
                    {prevModule ? (
                        <Link
                            href={`/member/courses/${course.slug}/modules/${prevModule.sort_order}`}
                            className="flex min-h-12 max-w-65 min-w-35 items-center gap-2 rounded-lg px-3 py-2 text-base text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <ChevronLeft className="h-5 w-5 shrink-0" />
                            <span className="max-w-52.5 truncate font-medium">
                                {prevModule.title}
                            </span>
                        </Link>
                    ) : (
                        <div className="min-w-35" />
                    )}

                    <span className="mx-2 max-w-xs truncate text-center text-base font-semibold text-slate-900 md:mx-4 md:max-w-md md:text-lg">
                        {selectedModule?.title ?? ''}
                    </span>

                    {nextModule ? (
                        nextModule.is_locked ? (
                            <Link
                                href="/login"
                                className="flex min-h-12 max-w-65 min-w-35 items-center justify-end gap-2 rounded-lg px-3 py-2 text-base text-slate-400 transition hover:bg-slate-100"
                            >
                                <span className="max-w-52.5 truncate text-right font-medium">
                                    Login untuk lanjut
                                </span>
                                <ChevronRight className="h-5 w-5 shrink-0" />
                            </Link>
                        ) : (
                            <Link
                                href={`/member/courses/${course.slug}/modules/${nextModule.sort_order}`}
                                className="flex min-h-12 max-w-65 min-w-35 items-center justify-end gap-2 rounded-lg px-3 py-2 text-base text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                <span className="max-w-52.5 truncate text-right font-medium">
                                    {nextModule.title}
                                </span>
                                <ChevronRight className="h-5 w-5 shrink-0" />
                            </Link>
                        )
                    ) : (
                        <div className="min-w-35" />
                    )}
                </div>
            </div>
        </>
    );
}
