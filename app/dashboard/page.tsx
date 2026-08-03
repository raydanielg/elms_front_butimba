"use client"

import { useEffect, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { dashboardApi } from "@/lib/services"
import { getUser } from "@/lib/auth"
import type { DashboardStats } from "@/lib/types"
import {
  IconBook2,
  IconUsers,
  IconClipboardList,
  IconChartBar,
  IconSchool,
  IconCheck,
  IconClock,
} from "@tabler/icons-react"

export default function Page() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await dashboardApi.stats()
        setStats(res.data)
      } catch {
        // use empty stats
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    {
      title: "Total Courses",
      value: stats?.total_courses ?? 0,
      icon: <IconBook2 className="size-5" />,
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Total Students",
      value: stats?.total_students ?? 0,
      icon: <IconUsers className="size-5" />,
      color: "text-green-600 bg-green-50",
    },
    {
      title: "Assignments",
      value: stats?.total_assignments ?? 0,
      icon: <IconClipboardList className="size-5" />,
      color: "text-orange-600 bg-orange-50",
    },
    {
      title: "Submissions",
      value: stats?.total_submissions ?? 0,
      icon: <IconChartBar className="size-5" />,
      color: "text-purple-600 bg-purple-50",
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-vertical:h-4 data-vertical:self-auto"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Welcome */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Welcome back, {user?.name?.split(" ")[0] || "User"} 👋
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Here&apos;s what&apos;s happening at Butimba Teachers College today.
              </p>
            </div>
            <Badge variant="secondary" className="capitalize">
              {user?.role || "student"}
            </Badge>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="size-8 rounded-lg" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16" />
                    </CardContent>
                  </Card>
                ))
              : statCards.map((card) => (
                  <Card key={card.title}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        {card.title}
                      </CardTitle>
                      <div className={`flex size-8 items-center justify-center rounded-lg ${card.color}`}>
                        {card.icon}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Recent Courses */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription>Your latest courses and assignments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Skeleton className="size-10 rounded-lg" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="space-y-3">
                    {[
                      { title: "English Language Teaching Methods", type: "Course", icon: <IconSchool className="size-5 text-blue-600" />, status: "In Progress" },
                      { title: "Mathematics for Primary Teachers", type: "Course", icon: <IconBook2 className="size-5 text-green-600" />, status: "Enrolled" },
                      { title: "Assignment: Lesson Plan Submission", type: "Assignment", icon: <IconClipboardList className="size-5 text-orange-600" />, status: "Pending" },
                      { title: "Science Teaching Strategies", type: "Course", icon: <IconSchool className="size-5 text-purple-600" />, status: "Completed" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 transition-colors">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                          {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{item.type}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="text-base">Quick Stats</CardTitle>
                <CardDescription>Your progress at a glance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-2 w-full" />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <IconSchool className="size-4" />
                          Enrolled Courses
                        </span>
                        <span className="font-medium">{stats?.enrolled_courses ?? 0}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-primary" style={{ width: "65%" }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <IconCheck className="size-4" />
                          Completed
                        </span>
                        <span className="font-medium">{stats?.completed_courses ?? 0}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-green-500" style={{ width: "40%" }} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <IconClock className="size-4" />
                          Pending Assignments
                        </span>
                        <span className="font-medium">{stats?.pending_assignments ?? 0}</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div className="h-full rounded-full bg-orange-500" style={{ width: "25%" }} />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
