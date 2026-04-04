import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import type { AppLayoutProps } from '@/types';
import RealtimeEmailChangedListener from '@/components/ui/realtime-email-changed-listener';

export default function MemberLayout({
    children,
    breadcrumbs,
    ...props
}: AppLayoutProps) {
    return (
        <>
            <RealtimeEmailChangedListener />
            <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
                {children}
            </AppLayoutTemplate>
        </>
    );
}
