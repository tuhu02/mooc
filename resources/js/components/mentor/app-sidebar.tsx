'use client';

import * as React from 'react';
import { PieChart, Book } from 'lucide-react';

import { NavMain } from '@/components/admin/nav-main';
import { NavUser } from '@/components/admin/nav-user';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';
import AppLogoIcon from '../member/app-logo-icon';
import { Nav } from './nav';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { url, props: pageProps } = usePage();
    const user = pageProps.auth?.user;

    const data = {
        user: {
            name: user.name,
            email: user.email,
            avatar: '/avatars/shadcn.jpg',
        },

        nav: [
            {
                title: 'Dashboard',
                url: '/mentor/dashboard',
                icon: PieChart,
                isActive: url.startsWith('/mentor/dashboard'),
            },
        ],

        navMain: [
            {
                title: 'Course',
                url: '/course',
                icon: Book,
                isActive: url.startsWith('/course'),
                items: [
                    {
                        title: 'All Course',
                        url: '/admin/admins',
                        isActive: url === '/admin/admins',
                    },
                ],
            },
        ],
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <div className="flex items-center gap-2 py-2 pl-2">
                    <AppLogoIcon className="h-5 w-5" />
                    <span className="font-semibold">MOOC</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <Nav items={data.nav}></Nav>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
