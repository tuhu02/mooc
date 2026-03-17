'use client';

import * as React from 'react';
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Command,
    Frame,
    GalleryVerticalEnd,
    Map,
    PieChart,
    Settings2,
    Shield,
    SquareTerminal,
    Users,
    UserCheck,
} from 'lucide-react';

import { NavMain } from '@/components/admin/nav-main';
import { NavProjects } from '@/components/admin/nav-projects';
import { NavUser } from '@/components/admin/nav-user';
import { TeamSwitcher } from '@/components/admin/team-switcher';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from '@/components/ui/sidebar';
import { usePage } from '@inertiajs/react';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { url } = usePage();

    // This is sample data.
    const data = {
        user: {
            name: 'shadcn',
            email: 'm@example.com',
            avatar: '/avatars/shadcn.jpg',
        },
        teams: [
            {
                name: 'Acme Inc',
                logo: GalleryVerticalEnd,
                plan: 'Enterprise',
            },
            {
                name: 'Acme Corp.',
                logo: AudioWaveform,
                plan: 'Startup',
            },
            {
                name: 'Evil Corp.',
                logo: Command,
                plan: 'Free',
            },
        ],
        navMain: [
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
        projects: [
            {
                name: 'Design Engineering',
                url: '#',
                icon: Frame,
            },
            {
                name: 'Sales & Marketing',
                url: '#',
                icon: PieChart,
            },
            {
                name: 'Travel',
                url: '#',
                icon: Map,
            },
        ],
    };

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams} />
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
