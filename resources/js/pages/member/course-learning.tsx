import CourseLearningLayout from '@/layouts/course-learning-layout';
import { Head, Link } from '@inertiajs/react';
import { Paperclip, X, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
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

export default function CourseLearningPage({
    course,
    currentModule,
    navigation,
    isEnrolled,
    progress,
}: Props) {
    const selectedModule = currentModule ?? null;

    const hasModuleAttachments = (selectedModule?.attachments?.length ?? 0) > 0;
    const hasLegacyAttachment = Boolean(selectedModule?.attachment);
    const showLegacyAttachmentRow =
        hasLegacyAttachment && !hasModuleAttachments;

    const prevModule = navigation?.previous ?? null;
    const nextModule = navigation?.next ?? null;

    const [activeAssignment, setActiveAssignment] = useState<{
        id: number;
        title: string;
        submission?: Submission | null;
    } | null>(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);

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
                {course.modules?.map((module, index) => {
                    const isActive = selectedModule?.id === module.id;

                    return (
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
                                isActive
                                    ? 'bg-sky-50 text-sky-700'
                                    : module.is_locked
                                      ? 'text-slate-400 hover:bg-slate-50'
                                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                            {/* Thumbnail */}
                            <div
                                className={`relative h-10 w-14 shrink-0 overflow-hidden rounded-md border ${
                                    isActive
                                        ? 'border-sky-200'
                                        : module.is_locked
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
                                        <span className={`text-xs font-semibold ${isActive ? 'text-sky-500' : 'text-slate-400'}`}>
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
                            </div>

                            {/* Title */}
                            <span className="min-w-0 flex-1 truncate font-medium leading-snug">
                                {module.title}
                            </span>
                        </Link>
                    );
                })}
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
                <Head title={`${course.title} - Learning`} />

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
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {selectedModule?.title ?? 'Pilih Materi'}
                                </h1>
                            </div>

                            {selectedModule?.video ? (
                                <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-black shadow-md">
                                    <VideoPlayer
                                        videoUrl={selectedModule.video}
                                        title={selectedModule.title}
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

                            {/* Attachments */}
                            {(hasModuleAttachments ||
                                showLegacyAttachmentRow) && (
                                <div className="mt-6 space-y-3 rounded-lg border border-slate-200 bg-white p-4">
                                    <p className="mb-4 text-sm font-medium text-slate-700">
                                        Lampiran Modul
                                    </p>

                                    <div className="space-y-2">
                                        {showLegacyAttachmentRow &&
                                            selectedModule && (
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
                                                                    ?.split(
                                                                        '/',
                                                                    )
                                                                    .pop() ||
                                                                'Lampiran'}
                                                        </p>
                                                    </div>
                                                </a>
                                            )}

                                        {selectedModule?.attachments?.map(
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
                                                                ).toFixed(2)}{' '}
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

                            {/* Assignments */}
                            {selectedModule?.assignments &&
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
                                                                : 'Login dan daftar course terlebih dahulu untuk mengumpulkan tugas'
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
                                                                ? 'cursor-pointer hover:border-sky-300 hover:bg-sky-50/60 hover:shadow-md'
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
                                                                        : 'Login dan daftar course terlebih dahulu untuk mengumpulkan tugas'}
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
                        </div>
                    </div>

                    {/* Sidebar — Right side */}
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

                {/* Bottom Navigation */}
                <ModuleBottomNavigation
                    courseSlug={course.slug}
                    currentTitle={selectedModule?.title}
                    prevModule={prevModule}
                    nextModule={nextModule}
                    sidebarOpen={sidebarOpen}
                    showCompletionButton={isEnrolled && !nextModule && selectedModule !== null}
                />
            </CourseLearningLayout>

            {/* Assignment Submission Modal */}
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
