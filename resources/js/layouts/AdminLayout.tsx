import { AppSidebar } from '@/components/admin/app-sidebar';
import { Toaster } from '@/components/ui/sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import { type PropsWithChildren } from 'react';

export default function AdminLayout({ children }: PropsWithChildren) {
    return (
        <SidebarProvider>
            <AppSidebar />
            {children}
        </SidebarProvider>
    );
}
