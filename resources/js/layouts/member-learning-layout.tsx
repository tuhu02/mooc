import { AppHeader } from '@/components/member/app-header';
import { AppShell } from '@/components/member/app-shell';
import type { BreadcrumbItem } from '@/types';
import type { ReactNode } from 'react';

type MemberLearningLayoutProps = {
    children: ReactNode;
    sidebar: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export default function MemberLearningLayout({
    children,
    sidebar,
    breadcrumbs,
}: MemberLearningLayoutProps) {
    return (
        <AppShell>
            <AppHeader breadcrumbs={breadcrumbs} />
            <div className="min-h-screen bg-white">
                <div className="mx-auto flex w-full max-w-7xl items-start px-4">
                    <aside className="hidden w-56 shrink-0 py-8 lg:block">
                        <div className="sticky top-28">{sidebar}</div>
                    </aside>
                    <main className="min-w-0 flex-1 px-8 py-8 pb-24">
                        {children}
                    </main>
                </div>
            </div>
        </AppShell>
    );
}
