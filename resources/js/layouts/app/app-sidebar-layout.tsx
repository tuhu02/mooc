import { AppContent } from '@/components/member/app-content';
import { AppShell } from '@/components/member/app-shell';
import { AppSidebar } from '@/components/member/app-sidebar';
import { AppSidebarHeader } from '@/components/member/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
        </AppShell>
    );
}
