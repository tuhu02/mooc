import { AppHeader } from '@/components/member/app-header';
import { AppShell } from '@/components/member/app-shell';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem } from '@/types';
import type { ReactNode } from 'react';

type MemberLearningLayoutProps = {
    children: ReactNode;
    sidebar: ReactNode;
    footer?: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export default function MemberLearningLayout({
    children,
    sidebar,
    footer,
    breadcrumbs = [],
}: MemberLearningLayoutProps) {
    const showBreadcrumbBar = breadcrumbs.length > 1;

    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />

            <div className="min-h-screen bg-white">
                <div className="flex w-full items-stretch">
                    <aside
                        className={cn(
                            'hidden shrink-0 border-r border-slate-200 bg-white lg:fixed lg:z-30 lg:flex lg:w-72 lg:flex-col lg:overflow-y-auto lg:px-4 lg:py-8',
                            showBreadcrumbBar ? 'lg:top-28' : 'lg:top-16',
                            showBreadcrumbBar
                                ? 'lg:h-[calc(100dvh-7rem)]'
                                : 'lg:h-[calc(100dvh-4rem)]',
                        )}
                    >
                        {sidebar}
                    </aside>

                    <main
                        className={cn(
                            'flex min-w-0 flex-1 flex-col',
                            'lg:ml-72',
                        )}
                    >
                        <div className="w-full flex-1 px-4 py-8 pb-24 sm:px-6 lg:px-8">
                            {children}
                        </div>
                        {footer}
                    </main>
                </div>
            </div>
        </AppShell>
    );
}
