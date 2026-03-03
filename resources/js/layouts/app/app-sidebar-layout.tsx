import { AppContent } from '@/components/user/app-content';
import { AppShell } from '@/components/user/app-shell';
import { AppSidebar } from '@/components/user/app-sidebar';
import { AppSidebarHeader } from '@/components/user/app-sidebar-header';
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