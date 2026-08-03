"use client"

import * as React from "react"
import Image from "next/image"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  IconLayoutDashboard,
  IconBook2,
  IconSchool,
  IconClipboardList,
  IconBell,
  IconSettings,
  IconUsers,
  IconChartBar,
} from "@tabler/icons-react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <IconLayoutDashboard />,
      isActive: true,
      items: [
        { title: "Overview", url: "/dashboard" },
        { title: "Statistics", url: "/dashboard/stats" },
      ],
    },
    {
      title: "Courses",
      url: "/dashboard/courses",
      icon: <IconBook2 />,
      items: [
        { title: "All Courses", url: "/dashboard/courses" },
        { title: "My Courses", url: "/dashboard/my-courses" },
        { title: "Browse", url: "/dashboard/courses/browse" },
      ],
    },
    {
      title: "Assignments",
      url: "/dashboard/assignments",
      icon: <IconClipboardList />,
      items: [
        { title: "Pending", url: "/dashboard/assignments" },
        { title: "Submitted", url: "/dashboard/assignments/submitted" },
        { title: "Graded", url: "/dashboard/assignments/graded" },
      ],
    },
    {
      title: "Announcements",
      url: "/dashboard/announcements",
      icon: <IconBell />,
      items: [
        { title: "All", url: "/dashboard/announcements" },
        { title: "Pinned", url: "/dashboard/announcements/pinned" },
      ],
    },
    {
      title: "Users",
      url: "/dashboard/users",
      icon: <IconUsers />,
      items: [
        { title: "Students", url: "/dashboard/users/students" },
        { title: "Lecturers", url: "/dashboard/users/lecturers" },
      ],
    },
    {
      title: "Settings",
      url: "/dashboard/settings",
      icon: <IconSettings />,
      items: [
        { title: "Profile", url: "/dashboard/settings/profile" },
        { title: "Password", url: "/dashboard/settings/password" },
      ],
    },
  ],
  projects: [
    {
      name: "My Courses",
      url: "/dashboard/my-courses",
      icon: <IconSchool />,
    },
    {
      name: "Reports",
      url: "/dashboard/reports",
      icon: <IconChartBar />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2.5 px-2 py-1.5">
          <Image
            src="/logo/butimbalogo-removebg-preview.png"
            alt="Butimba"
            width={32}
            height={32}
            className="object-contain"
            style={{ width: "auto", height: "32px" }}
            priority
          />
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-bold tracking-tight">ELMS</span>
            <span className="text-[10px] text-muted-foreground">Butimba Teachers College</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
