import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ModuleBottomNavigationProps } from '@/types/course-modules';

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
        <div
            className={cn(
                'fixed right-0 bottom-0 left-0 border-t border-border bg-background/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm',
                'lg:left-72',
            )}
        >
            <div className="mx-auto grid w-full max-w-none grid-cols-[30%_40%_30%] items-center gap-2 px-4 py-3 sm:px-6 md:px-8 md:py-4">
                <div className="min-w-0">
                    {prevModule && prevHref ? (
                        <Link
                            href={prevHref}
                            className="flex min-h-12 min-w-0 items-center gap-2 rounded-lg px-3 py-2 text-base text-muted-foreground transition hover:bg-accent hover:text-foreground"
                        >
                            <ChevronLeft className="h-5 w-5 shrink-0" />
                            <span className="min-w-0 truncate font-medium">
                                {prevModule.title}
                            </span>
                        </Link>
                    ) : (
                        <div />
                    )}
                </div>

                <div className="min-w-0 px-2 text-center">
                    <span className="block truncate text-base font-semibold text-foreground md:text-lg">
                        {currentTitle ?? ''}
                    </span>
                </div>

                <div className="min-w-0">
                    {nextModule && nextHref ? (
                        nextModule.is_locked ? (
                            <Link
                                href="/login"
                                className="flex min-h-12 min-w-0 items-center justify-end gap-2 rounded-lg px-3 py-2 text-base text-muted-foreground opacity-70 transition hover:bg-accent"
                            >
                                <span className="min-w-0 truncate text-right font-medium">
                                    {nextModule.title}
                                </span>
                                <Lock className="h-4 w-4 shrink-0" />
                                <ChevronRight className="h-5 w-5 shrink-0" />
                            </Link>
                        ) : (
                            <Link
                                href={nextHref}
                                className="flex min-h-12 min-w-0 items-center justify-end gap-2 rounded-lg px-3 py-2 text-base text-muted-foreground transition hover:bg-accent hover:text-foreground"
                            >
                                <span className="min-w-0 truncate text-right font-medium">
                                    {nextModule.title}
                                </span>
                                <ChevronRight className="h-5 w-5 shrink-0" />
                            </Link>
                        )
                    ) : (
                        <div />
                    )}
                </div>
            </div>
        </div>
    );
}
