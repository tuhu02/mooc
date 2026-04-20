import AppLayout from '@/layouts/member-layout';
import type { BreadcrumbItem, Course, Module } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, ChevronLeft, Paperclip } from 'lucide-react';
import { useState, useMemo } from 'react';
import MDEditor from '@uiw/react-md-editor';

type ModuleGroup = {
    id: number;
    title: string;
    modules: Module[];
};

type CourseWithModules = Course & {
    module_groups?: ModuleGroup[];
    modules?: Module[];
};

type Props = {
    course: CourseWithModules;
};

export default function CourseLearningPage({ course }: Props) {
    const allModules = useMemo(() => {
        if (course.module_groups?.length) {
            return course.module_groups.flatMap((g) => g.modules);
        }
        return course.modules ?? [];
    }, [course]);

    const [selectedModuleId, setSelectedModuleId] = useState<number | null>(
        allModules[0]?.id ?? null,
    );

    const selectedModule =
        allModules.find((m) => m.id === selectedModuleId) ?? null;
    const selectedAttachmentUrl = selectedModule?.attachment
        ? selectedModule.attachment.startsWith('http')
            ? selectedModule.attachment
            : `/storage/${selectedModule.attachment}`
        : null;
    const currentIndex = allModules.findIndex((m) => m.id === selectedModuleId);
    const prevModule = currentIndex > 0 ? allModules[currentIndex - 1] : null;
    const nextModule =
        currentIndex < allModules.length - 1
            ? allModules[currentIndex + 1]
            : null;

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Course', href: '/member/courses' },
        { title: course.title, href: `/member/courses/${course.slug}` },
        { title: 'Belajar', href: '' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`${course.title} - Learning`} />
            <div className="flex min-h-screen flex-1 flex-col bg-slate-50">
                <div className="mx-auto flex w-full max-w-7xl flex-1 gap-6 px-4 py-8 md:px-6">
                    <div className="min-w-0 flex-1">
                        <div className="px-2">
                            <h1 className="mb-6 text-2xl font-bold text-slate-900">
                                {selectedModule?.title ?? 'Pilih Materi'}
                            </h1>

                            {selectedModule?.thumbnail && (
                                <div className="mb-6">
                                    <img
                                        src={`/storage/${selectedModule.thumbnail}`}
                                        alt={selectedModule.title}
                                        className="h-auto w-full max-w-2xl rounded-lg object-cover shadow-md"
                                    />
                                </div>
                            )}

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
                                        Pilih modul pada daftar di samping untuk
                                        membaca materi pembelajaran.
                                    </p>
                                )}
                            </div>

                            {selectedAttachmentUrl && (
                                <div className="mt-6 rounded-lg border border-slate-200 bg-white p-4">
                                    <p className="mb-2 text-sm font-medium text-slate-700">
                                        Attachment Modul
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

                            <div className="fixed right-0 bottom-0 left-0 border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
                                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
                                    {prevModule ? (
                                        <button
                                            onClick={() =>
                                                setSelectedModuleId(
                                                    prevModule.id,
                                                )
                                            }
                                            className="flex min-h-12 max-w-65 min-w-35 items-center gap-2 rounded-lg px-3 py-2 text-base text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                        >
                                            <ChevronLeft className="h-5 w-5 shrink-0" />
                                            <span className="max-w-52.5 truncate font-medium">
                                                {prevModule.title}
                                            </span>
                                        </button>
                                    ) : (
                                        <div className="min-w-35" />
                                    )}

                                    <span className="mx-2 max-w-xs truncate text-center text-base font-semibold text-slate-900 md:mx-4 md:max-w-md md:text-lg">
                                        {selectedModule?.title ?? ''}
                                    </span>

                                    {nextModule ? (
                                        <button
                                            onClick={() =>
                                                setSelectedModuleId(
                                                    nextModule.id,
                                                )
                                            }
                                            className="flex min-h-12 max-w-65 min-w-35 items-center justify-end gap-2 rounded-lg px-3 py-2 text-base text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                                        >
                                            <span className="max-w-52.5 truncate text-right font-medium">
                                                {nextModule.title}
                                            </span>
                                            <ChevronRight className="h-5 w-5 shrink-0" />
                                        </button>
                                    ) : (
                                        <div className="min-w-35" />
                                    )}
                                </div>
                            </div>

                            <div className="pb-28 md:pb-32" />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
