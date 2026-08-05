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
import { getUser } from "@/lib/auth"
import {
  IconLayoutDashboard,
  IconBook2,
  IconSchool,
  IconClipboardList,
  IconBell,
  IconSettings,
  IconUsers,
  IconChartBar,
  IconCash,
  IconFileText,
  IconClipboardCheck,
  IconHistory,
  IconBuildingBank,
  IconBooks,
  IconVideo,
  IconUserPlus,
  IconAward,
  IconCalendarEvent,
  IconMessage2,
  IconCertificate,
  IconQuestionMark,
} from "@tabler/icons-react"

type NavItem = {
  title: string
  url: string
  icon: React.ReactNode
  isActive?: boolean
  items?: { title: string; url: string }[]
}

type QuickItem = {
  name: string
  url: string
  icon: React.ReactNode
}

function getAdminNav(): { navMain: NavItem[]; projects: QuickItem[] } {
  return {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: <IconLayoutDashboard />,
        isActive: true,
        items: [
          { title: "Overview", url: "/dashboard" },
          { title: "Statistics", url: "/dashboard/stats" },
          { title: "Reports", url: "/dashboard/reports" },
        ],
      },
      {
        title: "Courses",
        url: "/dashboard/courses",
        icon: <IconBook2 />,
        items: [
          { title: "All Courses", url: "/dashboard/courses" },
          { title: "Create Course", url: "/dashboard/courses/new" },
        ],
      },
      {
        title: "Academic",
        url: "/dashboard/programs",
        icon: <IconBooks />,
        items: [
          { title: "Programs", url: "/dashboard/programs" },
          { title: "Subjects", url: "/dashboard/subjects" },
          { title: "Departments", url: "/dashboard/departments" },
        ],
      },
      {
        title: "Users",
        url: "/dashboard/users",
        icon: <IconUsers />,
        items: [
          { title: "All Users", url: "/dashboard/users" },
          { title: "Students", url: "/dashboard/users/students" },
          { title: "Lecturers", url: "/dashboard/users/lecturers" },
        ],
      },
      {
        title: "Applications",
        url: "/dashboard/applications",
        icon: <IconUserPlus />,
        items: [
          { title: "All Applications", url: "/dashboard/applications" },
          { title: "Pending Review", url: "/dashboard/applications/pending" },
        ],
      },
      {
        title: "Finance",
        url: "/dashboard/finance",
        icon: <IconCash />,
        items: [
          { title: "Fee Structures", url: "/dashboard/finance/fees" },
          { title: "Payments", url: "/dashboard/finance/payments" },
          { title: "Debts", url: "/dashboard/finance/debts" },
        ],
      },
      {
        title: "Certificates",
        url: "/dashboard/certificates",
        icon: <IconCertificate />,
        items: [
          { title: "Templates", url: "/dashboard/certificates/templates" },
          { title: "Issue Center", url: "/dashboard/certificates/issue" },
          { title: "Issued", url: "/dashboard/certificates/issued" },
          { title: "Awards", url: "/dashboard/certificates/awards" },
          { title: "Transcripts", url: "/dashboard/certificates/transcripts" },
        ],
      },
      {
        title: "Messaging",
        url: "/dashboard/messages",
        icon: <IconMessage2 />,
      },
      {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: <IconCalendarEvent />,
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
        title: "Audit Logs",
        url: "/dashboard/audit-logs",
        icon: <IconHistory />,
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
      { name: "Reports", url: "/dashboard/reports", icon: <IconChartBar /> },
      { name: "News & Events", url: "/dashboard/news", icon: <IconFileText /> },
    ],
  }
}

function getStudentNav(): { navMain: NavItem[]; projects: QuickItem[] } {
  return {
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
        title: "My Courses",
        url: "/dashboard/my-courses",
        icon: <IconBook2 />,
        items: [
          { title: "Enrolled Courses", url: "/dashboard/my-courses" },
          { title: "Browse Courses", url: "/dashboard/courses/browse" },
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
        title: "Online Classes",
        url: "/dashboard/online-classes",
        icon: <IconVideo />,
      },
      {
        title: "My Certificates",
        url: "/dashboard/certificates",
        icon: <IconCertificate />,
        items: [
          { title: "My Certificates", url: "/dashboard/certificates" },
          { title: "My Badges", url: "/dashboard/certificates/badges" },
          { title: "Transcript", url: "/dashboard/certificates/transcript" },
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
        title: "Messaging",
        url: "/dashboard/messages",
        icon: <IconMessage2 />,
      },
      {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: <IconCalendarEvent />,
      },
      {
        title: "Finance",
        url: "/dashboard/my-finance",
        icon: <IconCash />,
        items: [
          { title: "My Payments", url: "/dashboard/my-finance/payments" },
          { title: "My Debts", url: "/dashboard/my-finance/debts" },
        ],
      },
      {
        title: "Results",
        url: "/dashboard/my-results",
        icon: <IconClipboardCheck />,
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
      { name: "My Courses", url: "/dashboard/my-courses", icon: <IconSchool /> },
      { name: "My Results", url: "/dashboard/my-results", icon: <IconClipboardCheck /> },
    ],
  }
}

function getTutorNav(): { navMain: NavItem[]; projects: QuickItem[] } {
  return {
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
        title: "My Courses",
        url: "/dashboard/my-courses",
        icon: <IconBook2 />,
        items: [
          { title: "Teaching", url: "/dashboard/my-courses" },
          { title: "All Courses", url: "/dashboard/courses" },
        ],
      },
      {
        title: "Assignments",
        url: "/dashboard/assignments",
        icon: <IconClipboardList />,
        items: [
          { title: "All Assignments", url: "/dashboard/assignments" },
          { title: "Submissions", url: "/dashboard/assignments/submitted" },
          { title: "Graded", url: "/dashboard/assignments/graded" },
        ],
      },
      {
        title: "Online Classes",
        url: "/dashboard/online-classes",
        icon: <IconVideo />,
      },
      {
        title: "Question Bank",
        url: "/dashboard/question-bank",
        icon: <IconQuestionMark />,
        items: [
          { title: "Categories", url: "/dashboard/question-bank" },
          { title: "Questions", url: "/dashboard/question-bank/questions" },
        ],
      },
      {
        title: "Gradebook",
        url: "/dashboard/gradebook",
        icon: <IconChartBar />,
      },
      {
        title: "Certificates",
        url: "/dashboard/certificates",
        icon: <IconCertificate />,
        items: [
          { title: "Templates", url: "/dashboard/certificates/templates" },
          { title: "Issue Center", url: "/dashboard/certificates/issue" },
          { title: "Issued", url: "/dashboard/certificates/issued" },
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
        title: "Messaging",
        url: "/dashboard/messages",
        icon: <IconMessage2 />,
      },
      {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: <IconCalendarEvent />,
      },
      {
        title: "Results",
        url: "/dashboard/results",
        icon: <IconClipboardCheck />,
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
      { name: "My Courses", url: "/dashboard/my-courses", icon: <IconSchool /> },
      { name: "Reports", url: "/dashboard/reports", icon: <IconChartBar /> },
    ],
  }
}

function getDefaultNav(): { navMain: NavItem[]; projects: QuickItem[] } {
  return {
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
      { name: "My Courses", url: "/dashboard/my-courses", icon: <IconSchool /> },
    ],
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const user = getUser()
  const role = user?.role || "STUDENT"

  const { navMain, projects } = React.useMemo(() => {
    switch (role) {
      case "SUPER_ADMIN":
      case "PRINCIPAL":
      case "REGISTRAR":
      case "ACCOUNTANT":
        return getAdminNav()
      case "TUTOR":
        return getTutorNav()
      case "STUDENT":
        return getStudentNav()
      default:
        return getDefaultNav()
    }
  }, [role])

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
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
