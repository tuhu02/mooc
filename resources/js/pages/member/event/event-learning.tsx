import MemberLearningLayout from '@/layouts/member-learning-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Paperclip, X, Lock, CalendarClock } from 'lucide-react';
import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import VideoPlayer from '@/components/member/video-player';
import AssignmentSubmissionForm from '@/components/member/assignment-submission-form';
import { memberAssignmentStatusPresentation } from '@/lib/member-assignment-status';
import type { CourseLearningAssignment as Assignment, CourseLearningPageProps as Props, CourseLearningSubmission as Submission } from '@/types';
import ModuleBottomNavigation from '@/components/member/module-bottom-navigation';

function assignmentCardHint(submission: Submission | null | undefined): string {
    if (!submission) {
        return 'Klik untuk mengumpulkan tugas';
    }

    switch (submission.status ?? 'submitted') {
        case 'reviewed':
            return 'Klik untuk melihat tugas';
        case 'revision_required':
            return 'Klik untuk mengunggah revisi';
        default:
            return 'Klik untuk melihat atau mengganti berkas';
    }
}

function formatDateTime(dateStr?: string | null) {
    if (!dateStr) return null;

    return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function EventLearningPage({
    course,
    currentModule,
    navigation,
    isEnrolled,
    emptyState,
}: Props) {
    const selectedModule = currentModule ?? null;

    const hasModuleAttachments = (selectedModule?.attachments?.length ?? 0) > 0;
    const hasLegacyAttachment = Boolean(selectedModule?.attachment);
    const showLegacyAttachmentRow =
        hasLegacyAttachment && !hasModuleAttachments;

    const prevModule = navigation?.previous ?? null;
    const nextModule = navigation?.next ?? null;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Event', href: '/member/events' },
        { title: course.title, href: `/member/events/${course.slug}` },
        { title: 'Belajar', href: '' },
    ];

    const [activeAssignment, setActiveAssignment] = useState<{
        id: number;
        title: string;
        submission?: Submission | null;
    } | null>(null);

    const moduleSidebar = (
        <div className="rounded-xl">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Daftar Sesi Hari Ini
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                    {course.modules?.length ?? 0} sesi dijadwalkan hari ini
                </p>
            </div>

            <div className="space-y-2">
                {course.modules && course.modules.length > 0 ? (
                    course.modules.map((module) => {
                        const isActive = selectedModule?.id === module.id;
                        const availableAtLabel = formatDateTime(
                            module.available_at,
                        );

                        return (
                            <Link
                                key={module.id}
                                href={
                                    module.is_locked
                                        ? '#'
                                        : `/member/events/${course.slug}/modules/${module.sort_order}`
                                }
                                onClick={(e) => {
                                    if (module.is_locked) {
                                        e.preventDefault();
                                    }
                                }}
                                title={
                                    module.is_locked
                                        ? 'Sesi ini belum tersedia'
                                        : module.title
                                }
                                className={`group flex items-start gap-3 rounded-lg border px-3 py-3 text-sm transition ${
                                    isActive
                                        ? 'border-violet-200 bg-violet-50 text-violet-700'
                                        : module.is_locked
                                          ? 'cursor-not-allowed border-transparent text-slate-400 hover:bg-slate-50'
                                          : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                }`}
                            >
                                {module.thumbnail && (
                                    <div
                                        className={`mt-0.5 h-12 w-16 shrink-0 overflow-hidden rounded-lg border ${
                                            isActive
                                                ? 'border-violet-300'
                                                : module.is_locked
                                                  ? 'border-slate-200 opacity-60'
                                                  : 'border-slate-200'
                                        }`}
                                    >
                                        <img
                                            src={`/storage/${module.thumbnail}`}
                                            alt={module.title}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate font-medium">
                                            {module.title}
                                        </span>

                                        {module.is_locked && (
                                            <Lock className="h-3.5 w-3.5 shrink-0" />
                                        )}
                                    </div>

                                    {module.duration && (
                                        <p className="mt-1 text-xs text-slate-400">
                                            {module.duration} - Menit
                                        </p>
                                    )}

                                    {module.is_locked && availableAtLabel && (
                                        <p className="mt-1 text-xs text-violet-500">
                                            Tersedia: {availableAtLabel}
                                        </p>
                                    )}
                                </div>
                            </Link>
                        );
                    })
                ) : (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                        Belum ada sesi hari ini.
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            <MemberLearningLayout
                breadcrumbs={breadcrumbs}
                sidebar={moduleSidebar}
                footer={
                    selectedModule ? (
                        <ModuleBottomNavigation
                            courseSlug={course.slug}
                            currentTitle={selectedModule.title}
                            prevModule={prevModule}
                            nextModule={nextModule}
                            basePath="events"
                        />
                    ) : null
                }
            >
                <Head title={`${course.title} - Sesi`} />

                <div className="w-full max-w-none">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {selectedModule?.title ?? 'Sesi Belum Tersedia'}
                        </h1>
                    </div>

                    {!selectedModule ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-600">
                                <CalendarClock className="h-7 w-7" />
                            </div>

                            <h2 className="mt-4 text-lg font-semibold text-slate-900">
                                Segera Hadir
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                                {emptyState ??
                                    'Sesi belum tersedia. Silakan cek kembali sesuai jadwal event.'}
                            </p>

                            <Link
                                href={`/member/events/${course.slug}`}
                                className="mt-5 inline-flex rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700"
                            >
                                Kembali ke Detail Event
                            </Link>
                        </div>
                    ) : (
                        <>
                            {selectedModule.video ? (
                                <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-black shadow-md">
                                    <VideoPlayer
                                        videoUrl={selectedModule.video}
                                        title={selectedModule.title}
                                    />
                                </div>
                            ) : null}

                            <div className="text-sm leading-7 text-slate-600 md:text-base">
                                {selectedModule.description ? (
                                    <div data-color-mode="light">
                                        <MDEditor.Markdown
                                            source={selectedModule.description}
                                            className="bg-transparent!"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-slate-500">
                                        Materi sesi belum tersedia.
                                    </p>
                                )}
                            </div>

                            {(hasModuleAttachments ||
                                showLegacyAttachmentRow) && (
                                <div className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                                    <p className="mb-4 text-sm font-medium text-slate-700">
                                        Lampiran Sesi
                                    </p>

                                    <div className="space-y-2">
                                        {showLegacyAttachmentRow && (
                                            <a
                                                key="legacy-attachment"
                                                href={`/storage/${selectedModule.attachment}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="flex items-center gap-2 rounded-md bg-slate-50 p-3 transition hover:bg-slate-100"
                                            >
                                                <Paperclip className="h-4 w-4 shrink-0 text-slate-600" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm font-medium text-slate-700">
                                                        {selectedModule.attachment_name?.trim() ||
                                                            selectedModule.attachment
                                                                ?.split('/')
                                                                .pop() ||
                                                            'Lampiran'}
                                                    </p>
                                                </div>
                                            </a>
                                        )}

                                        {selectedModule.attachments?.map(
                                            (att) => (
                                                <a
                                                    key={att.id}
                                                    href={`/storage/${att.file_path}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 rounded-md bg-slate-50 p-3 transition hover:bg-slate-100"
                                                >
                                                    <Paperclip className="h-4 w-4 shrink-0 text-slate-600" />
                                                    <div className="min-w-0 flex-1">
                                                        <p className="truncate text-sm font-medium text-slate-700">
                                                            {att.file_name}
                                                        </p>

                                                        {att.file_size ? (
                                                            <p className="text-xs text-slate-500">
                                                                {(
                                                                    att.file_size /
                                                                    1024 /
                                                                    1024
                                                                ).toFixed(
                                                                    2,
                                                                )}{' '}
                                                                MB
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                </a>
                                            ),
                                        )}
                                    </div>
                                </div>
                            )}

                            {selectedModule.assignments &&
                                selectedModule.assignments.length > 0 && (
                                    <div className="mt-6 space-y-4 rounded-lg border border-slate-200 bg-white p-4">
                                        <p className="text-base font-semibold text-slate-900">
                                            Assignment
                                        </p>

                                        {selectedModule.assignments.map(
                                            (assignment: Assignment) => {
                                                const statusPill =
                                                    memberAssignmentStatusPresentation(
                                                        assignment.submission,
                                                    );

                                                return (
                                                    <div
                                                        key={assignment.id}
                                                        title={
                                                            isEnrolled
                                                                ? assignmentCardHint(
                                                                      assignment.submission,
                                                                  )
                                                                : 'Login dan daftar event terlebih dahulu untuk mengumpulkan tugas'
                                                        }
                                                        onClick={() => {
                                                            if (!isEnrolled)
                                                                return;

                                                            setActiveAssignment(
                                                                {
                                                                    id: assignment.id,
                                                                    title: assignment.title,
                                                                    submission:
                                                                        assignment.submission ??
                                                                        null,
                                                                },
                                                            );
                                                        }}
                                                        className={`rounded-xl border border-slate-200 bg-slate-50/60 p-4 transition ${
                                                            isEnrolled
                                                                ? 'cursor-pointer hover:border-violet-300 hover:bg-violet-50/60 hover:shadow-md'
                                                                : 'cursor-not-allowed opacity-90'
                                                        }`}
                                                    >
                                                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                                                            <div>
                                                                <h3 className="font-semibold text-slate-900">
                                                                    {
                                                                        assignment.title
                                                                    }
                                                                </h3>

                                                                <p className="mt-1 text-xs text-slate-500">
                                                                    {isEnrolled
                                                                        ? assignmentCardHint(
                                                                              assignment.submission,
                                                                          )
                                                                        : 'Login dan daftar event terlebih dahulu untuk mengumpulkan tugas'}
                                                                </p>
                                                            </div>

                                                            {isEnrolled ? (
                                                                <span
                                                                    className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${statusPill.pillClassName}`}
                                                                >
                                                                    {
                                                                        statusPill.label
                                                                    }
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex w-fit items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                                                                    Daftar untuk
                                                                    akses tugas
                                                                </span>
                                                            )}
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
                                                );
                                            },
                                        )}
                                    </div>
                                )}
                        </>
                    )}
                </div>
            </MemberLearningLayout>

            {activeAssignment !== null && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) {
                            setActiveAssignment(null);
                        }
                    }}
                >
                    <div className="w-full max-w-lg rounded-xl bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Kumpulkan Tugas
                                </h2>

                                <p className="mt-0.5 text-sm font-medium text-slate-800">
                                    {activeAssignment.title}
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
        </>
    );
}
