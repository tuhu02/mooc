import MemberLearningLayout from '@/layouts/member-learning-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Paperclip, X, Lock, Menu } from 'lucide-react';
import { useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import VideoPlayer from '@/components/member/video-player';
import AssignmentSubmissionForm from '@/components/member/assignment-submission-form';
import { Assignment, Props } from '@/types/course-learning';
import ModuleBottomNavigation from '@/components/member/module-bottom-navigation';

type SubmissionStatus = 'submitted' | 'reviewed' | 'revision_required';

type ActiveAssignment = {
    id: number;
    title: string;
    submission?: {
        id: number;
        submission_name?: string | null;
        file?: string | null;
        feedback?: string | null;
        status?: SubmissionStatus;
        reviewed_at?: string | null;
    } | null;
};

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
        { title: 'Kursus', href: '/member/courses' },
        { title: course.title, href: `/member/courses/${course.slug}` },
        { title: 'Belajar', href: '' },
    ];

    const [activeAssignment, setActiveAssignment] =
        useState<ActiveAssignment | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const getSubmissionLabel = (
        submission?: ActiveAssignment['submission'],
    ) => {
        if (submission?.status === 'reviewed') {
            return 'Sudah dikoreksi';
        }

        if (submission?.status === 'revision_required') {
            return 'Perlu revisi';
        }

        if (submission) {
            return 'Menunggu dikoreksi';
        }

        return 'Belum dikumpulkan';
    };

    const getSubmissionBadgeClass = (
        submission?: ActiveAssignment['submission'],
    ) => {
        if (submission?.status === 'reviewed') {
            return 'bg-emerald-100 text-emerald-700';
        }

        if (submission?.status === 'revision_required') {
            return 'bg-rose-100 text-rose-700';
        }

        if (submission) {
            return 'bg-sky-100 text-sky-700';
        }

        return 'bg-amber-100 text-amber-700';
    };

    const moduleSidebar = (
        <div className="sticky top-32 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
                <h2 className="text-base font-semibold text-slate-900">
                    Daftar Modul
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                    {course.modules_count} modul tersedia
                </p>
            </div>

            <div className="space-y-2">
                {course.modules?.map((module) => {
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
                            className={`group flex items-start gap-3 rounded-lg border px-3 py-3 text-sm transition ${
                                isActive
                                    ? 'border-sky-200 bg-sky-50 text-sky-700'
                                    : module.is_locked
                                      ? 'border-transparent text-slate-400 hover:bg-slate-50'
                                      : 'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                            }`}
                        >
                            {module.thumbnail && (
                                <div
                                    className={`mt-0.5 h-12 w-16 shrink-0 overflow-hidden rounded-lg border ${
                                        isActive
                                            ? 'border-sky-300'
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
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );

    return (
        <>
            <MemberLearningLayout
                breadcrumbs={breadcrumbs}
                sidebar={moduleSidebar}
            >
                <Head title={`${course.title} - Learning`} />

                {/* Mobile Sidebar Overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Mobile Sidebar */}
                <div
                    className={`fixed inset-y-0 left-0 z-40 w-72 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:hidden ${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
                >
                    <div className="sticky top-32 p-4">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="mb-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                        >
                            <X className="h-5 w-5" />
                        </button>
                        {moduleSidebar}
                    </div>
                </div>

                <div className="px-2 pb-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-slate-900">
                            {selectedModule?.title ?? 'Pilih Materi'}
                        </h1>
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                            title="Buka daftar modul"
                        >
                            <Menu className="h-5 w-5" />
                        </button>
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
                                    source={selectedModule.description}
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
                                    (assignment: Assignment) => {
                                        const submission =
                                            assignment.submission ?? null;

                                        return (
                                            <div
                                                key={assignment.id}
                                                title={
                                                    isEnrolled
                                                        ? submission
                                                            ? 'Klik untuk melihat atau memperbarui tugas'
                                                            : 'Klik untuk mengumpulkan tugas'
                                                        : 'Login dan daftar course terlebih dahulu untuk mengumpulkan tugas'
                                                }
                                                onClick={() => {
                                                    if (!isEnrolled) {
                                                        return;
                                                    }

                                                    setActiveAssignment({
                                                        id: assignment.id,
                                                        title: assignment.title,
                                                        submission,
                                                    });
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
                                                            {assignment.title}
                                                        </h3>

                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {isEnrolled
                                                                ? submission
                                                                    ? 'Klik untuk melihat atau memperbarui tugas'
                                                                    : 'Klik untuk mengumpulkan tugas'
                                                                : 'Login dan daftar course terlebih dahulu untuk mengumpulkan tugas'}
                                                        </p>
                                                    </div>

                                                    {isEnrolled ? (
                                                        <span
                                                            className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${getSubmissionBadgeClass(
                                                                submission,
                                                            )}`}
                                                        >
                                                            {getSubmissionLabel(
                                                                submission,
                                                            )}
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex w-fit items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-600">
                                                            Daftar untuk akses
                                                            tugas
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

                                                {submission?.status ===
                                                    'revision_required' && (
                                                    <p className="mt-3 text-sm font-medium text-rose-700">
                                                        Tugas ini perlu
                                                        direvisi. Silakan
                                                        perbaiki dan upload
                                                        ulang.
                                                    </p>
                                                )}

                                                {submission?.status ===
                                                    'reviewed' && (
                                                    <p className="mt-3 text-sm font-medium text-emerald-700">
                                                        Tugas sudah dikoreksi
                                                        oleh admin.
                                                    </p>
                                                )}

                                                {submission?.feedback && (
                                                    <div className="mt-4 rounded-lg border border-sky-200 bg-sky-50 p-4">
                                                        <p className="text-sm font-semibold text-sky-900">
                                                            Feedback Admin
                                                        </p>

                                                        <p className="mt-2 text-sm leading-6 whitespace-pre-line text-sky-800">
                                                            {
                                                                submission.feedback
                                                            }
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    },
                                )}
                            </div>
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
                                <p className="text-base font-semibold text-slate-900">
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

            <ModuleBottomNavigation
                courseSlug={course.slug}
                currentTitle={selectedModule?.title}
                prevModule={prevModule}
                nextModule={nextModule}
            />
        </>
    );
}
