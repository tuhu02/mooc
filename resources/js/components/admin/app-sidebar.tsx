"use client"

import * as React from "react"
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
} from "lucide-react"

import { NavMain } from "@/components/admin/nav-main"
import { NavProjects } from "@/components/admin/nav-projects"
import { NavUser } from "@/components/admin/nav-user"
import { TeamSwitcher } from "@/components/admin/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { usePage } from "@inertiajs/react"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { url } = usePage();

  // This is sample data.
  const data = {
    user: {
      name: "shadcn",
      email: "m@example.com",
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "Acme Inc",
        logo: GalleryVerticalEnd,
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "User",
        url: "/admin/users",
        icon: Users,
        isActive: url.startsWith("/admin/users"),
        items: [
          {
            title: "All User",
            url: "/admin/users",
            isActive: url === "/admin/users"
          },
          {
            title: "Add User",
            url: "/admin/users/create",
            isActive: url === "/admin/users/create"
          }
        ],
      },
      {
        title: "Role",
        url: "/admin/roles",
        icon: Shield,
        isActive: url.startsWith("/admin/roles"),
        items: [
          {
            title: "All Roles",
            url: "/admin/roles",
            isActive: url === "/admin/roles"
          },
          {
            title: "Add Roles",
            url: "/admin/roles/create",
            isActive: url === "/admin/roles/create"
          }
        ],
      }
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
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
  )
}
