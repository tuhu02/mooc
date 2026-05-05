import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';

type ModuleNavigationItem = {
    title: string;
    sort_order?: number | null;
    is_preview?: boolean;
    is_locked?: boolean;
};

type ModuleBottomNavigationProps = {
    courseSlug: string;
    currentTitle?: string | null;
    prevModule?: ModuleNavigationItem | null;
    nextModule?: ModuleNavigationItem | null;
};

export default function ModuleBottomNavigation({
    courseSlug,
    currentTitle,
    prevModule,
    nextModule,
}: ModuleBottomNavigationProps) {
    const prevHref =
        prevModule?.sort_order != null
            ? `/member/courses/${courseSlug}/modules/${prevModule.sort_order}`
            : null;

    const nextHref =
        nextModule?.sort_order != null
            ? `/member/courses/${courseSlug}/modules/${nextModule.sort_order}`
            : null;

    return (
        <div className="sticky bottom-0 w-full border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="flex w-full items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
                {prevModule && prevHref ? (
                    <Link
                        href={prevHref}
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
                    {currentTitle ?? ''}
                </span>

                {nextModule && nextHref ? (
                    nextModule.is_locked ? (
                        <Link
                            href="/login"
                            className="flex min-h-12 max-w-65 min-w-35 items-center justify-end gap-2 rounded-lg px-3 py-2 text-base text-slate-400 transition hover:bg-slate-100"
                        >
                            <span className="max-w-52.5 truncate text-right font-medium">
                                {nextModule.title}
                            </span>
                            <Lock className="h-4 w-4 shrink-0" />
                            <ChevronRight className="h-5 w-5 shrink-0" />
                        </Link>
                    ) : (
                        <Link
                            href={nextHref}
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
    );
}
