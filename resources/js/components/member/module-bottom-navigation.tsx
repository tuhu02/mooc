import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Lock, PartyPopper } from 'lucide-react';
import type { ModuleBottomNavigationProps } from '@/types';

export default function ModuleBottomNavigation({
    courseSlug,
    currentTitle,
    prevModule,
    nextModule,
    basePath = 'courses',
    sidebarOpen = false,
    showCompletionButton = false,
}: ModuleBottomNavigationProps & { showCompletionButton?: boolean }) {
    const prevHref =
        prevModule?.sort_order != null
            ? `/member/${basePath}/${courseSlug}/modules/${prevModule.sort_order}`
            : null;

    const nextHref =
        nextModule?.sort_order != null
            ? `/member/${basePath}/${courseSlug}/modules/${nextModule.sort_order}`
            : null;

    return (
        <div className="fixed right-0 bottom-0 left-0 z-30 border-t border-slate-200 bg-white/95 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="grid w-full grid-cols-[30%_40%_30%] items-center gap-2 px-4 py-3 sm:px-6 md:py-4">
                {/* Prev */}
                <div className="min-w-0">
                    {prevModule && prevHref ? (
                        <Link
                            href={prevHref}
                            className="group flex min-h-12 min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                            <ChevronLeft className="h-4 w-4 shrink-0" />
                            <span className="min-w-0 truncate font-medium">
                                {prevModule.title}
                            </span>
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>

                {/* Current title */}
                <div className="px-2 text-center">
                    <span className="text-sm font-semibold text-slate-900 md:text-base">
                        {currentTitle ?? ''}
                    </span>
                </div>

                {/* Next */}
                <div className="min-w-0">
                    {nextModule && nextHref ? (
                        nextModule.is_locked ? (
                            <Link
                                href="/login"
                                className="flex min-h-12 min-w-0 items-center justify-end gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 opacity-70 transition hover:bg-slate-100"
                            >
                                <span className="min-w-0 truncate text-right font-medium">
                                    {nextModule.title}
                                </span>
                                <Lock className="h-3.5 w-3.5 shrink-0" />
                                <ChevronRight className="h-4 w-4 shrink-0" />
                            </Link>
                        ) : (
                            <Link
                                href={nextHref}
                                className="flex min-h-12 min-w-0 items-center justify-end gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                            >
                                <span className="min-w-0 truncate text-right font-medium">
                                    {nextModule.title}
                                </span>
                                <ChevronRight className="h-4 w-4 shrink-0" />
                            </Link>
                        )
                    ) : showCompletionButton ? (
                        <div className="flex justify-end">
                            <Link
                                href={`/member/courses/${courseSlug}/completion`}
                                className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700"
                            >
                                <PartyPopper className="h-4 w-4 shrink-0" />
                                <span>Selesaikan Kursus Ini</span>
                            </Link>
                        </div>
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </div>
    );
}
