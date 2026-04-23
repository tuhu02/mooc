'use client';

import * as React from 'react';
import {
    BookOpen,
    GalleryVerticalEnd,
    Layers,
    PieChart,
    Shield,
    Users,
    UserCheck,
    UserCog,
} from 'lucide-react';

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
                url: '/admin/dashboard',
                icon: PieChart,
                isActive: url.startsWith('/admin/dashboard'),
            },
        ],

        navMain: [
            {
                title: 'Admins',
                url: '/admin/admins',
                icon: UserCog,
                isActive: url.startsWith('/admin/admins'),
                items: [
                    {
                        title: 'All Admins',
                        url: '/admin/admins',
                        isActive: url === '/admin/admins',
                    },
                    {
                        title: 'Add Admins',
                        url: '/admin/admins/create',
                        isActive: url === '/admin/admins/create',
                    },
                ],
            },
            {
                title: 'Members',
                url: '/admin/members',
                icon: Users,
                isActive: url.startsWith('/admin/members'),
                items: [
                    {
                        title: 'All Members',
                        url: '/admin/members',
                        isActive: url === '/admin/members',
                    },
                    {
                        title: 'Add Member',
                        url: '/admin/members/create',
                        isActive: url === '/admin/members/create',
                    },
                ],
            },
            {
                title: 'Mentors',
                url: '/admin/mentors',
                icon: UserCheck,
                isActive: url.startsWith('/admin/mentors'),
                items: [
                    {
                        title: 'All Mentor',
                        url: '/admin/mentors',
                        isActive: url === '/admin/mentors',
                    },
                    {
                        title: 'Add Mentor',
                        url: '/admin/mentors/create',
                        isActive: url === '/admin/roles/create',
                    },
                ],
            },
            {
                title: 'Category',
                url: '/admin/categories',
                icon: GalleryVerticalEnd,
                isActive: url.startsWith('/admin/categories'),
                items: [
                    {
                        title: 'All Category',
                        url: '/admin/categories',
                        isActive: url === '/admin/categories',
                    },
                    {
                        title: 'Add Category',
                        url: '/admin/categories/create',
                        isActive: url === '/admin/categories/create',
                    },
                ],
            },
            {
                title: 'Courses',
                url: '/admin/courses',
                icon: BookOpen,
                isActive: url.startsWith('/admin/courses'),
                items: [
                    {
                        title: 'All Courses',
                        url: '/admin/courses',
                        isActive: url === '/admin/courses',
                    },
                    {
                        title: 'Add Course',
                        url: '/admin/courses/create',
                        isActive: url === '/admin/courses/create',
                    },
                ],
            },
            {
                title: 'Roles',
                url: '/admin/roles',
                icon: Shield,
                isActive: url.startsWith('/admin/roles'),
                items: [
                    {
                        title: 'All Roles',
                        url: '/admin/roles',
                        isActive: url === '/admin/roles',
                    },
                    {
                        title: 'Add Roles',
                        url: '/admin/roles/create',
                        isActive: url === '/admin/roles/create',
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
