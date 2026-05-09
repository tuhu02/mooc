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

            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-8 pb-24 md:px-6">
                    <aside className="hidden w-72 shrink-0 lg:block">
                        {sidebar}
                    </aside>

                    <main className="min-w-0 flex-1">{children}</main>
                </div>
            </div>
        </AppShell>
    );
}
