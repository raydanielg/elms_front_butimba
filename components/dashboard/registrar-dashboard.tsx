"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, XAxis, YAxis, CartesianGrid } from "recharts"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { KpiGrid, QuickActions, WidgetCard, EmptyState } from "./shared"
import {
  IconUserPlus, IconClipboardCheck, IconUsers, IconBook2, IconSchool,
  IconAlertTriangle, IconChartBar, IconPlus, IconUserCheck, IconClipboardList,
} from "@tabler/icons-react"

export function RegistrarDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [chartData, setChartData] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [statsRes, chartRes] = await Promise.allSettled([dashboardApi.stats(), dashboardApi.charts()])
        if (statsRes.status === "fulfilled") setStats(statsRes.value.data.data)
        if (chartRes.status === "fulfilled") setChartData(chartRes.value.data.data || {})
      } catch { } finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  const kpiCards = [
    { title: "New Applications", value: stats?.new_applications, icon: <IconUserPlus className="size-5" />, color: "text-blue-600 bg-blue-50" },
    { title: "Under Review", value: stats?.under_review, icon: <IconClipboardList className="size-5" />, color: "text-orange-600 bg-orange-50" },
    { title: "Accepted", value: stats?.accepted, icon: <IconClipboardCheck className="size-5" />, color: "text-green-600 bg-green-50" },
    { title: "Enrolled This Term", value: stats?.enrolled_this_term, icon: <IconUsers className="size-5" />, color: "text-purple-600 bg-purple-50" },
  ]

  const quickActions = [
    { label: "Review Application", href: "/dashboard/applications", icon: <IconClipboardList className="size-4" /> },
    { label: "Create Course", href: "/dashboard/courses/new", icon: <IconPlus className="size-4" /> },
    { label: "Enrol Student", href: "/dashboard/users/students", icon: <IconUserCheck className="size-4" /> },
    { label: "Assign Tutor", href: "/dashboard/courses", icon: <IconSchool className="size-4" /> },
    { label: "Create Cohort", href: "/dashboard/applications", icon: <IconUsers className="size-4" /> },
  ]

  const applicantsPerCourse = (chartData.applicants_per_course as { name: string; title: string; value: number }[]) || []
  const monthlyTrend = (chartData.monthly_trend as Record<string, unknown>[]) || []

  return (
    <>
      <KpiGrid cards={kpiCards} loading={loading} />
      <QuickActions actions={quickActions} />

      {/* Alert: Courses without tutor */}
      {(stats?.courses_without_tutor ?? 0) > 0 && !loading && (
        <WidgetCard title="Courses Without Tutor" description="Active courses needing tutor assignment">
          <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3">
            <IconAlertTriangle className="size-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              {stats?.courses_without_tutor} active course(s) have no assigned tutor.
            </span>
            <a href="/dashboard/courses" className="ml-auto text-sm text-primary hover:underline">Assign →</a>
          </div>
        </WidgetCard>
      )}

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WidgetCard title="Applicants per Course" description="Top 10 courses by enrolment">
          {loading ? <Skeleton className="h-48 w-full" /> : applicantsPerCourse.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <BarChart data={applicantsPerCourse} layout="vertical" margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} className="text-xs" width={60} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconChartBar className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>

        <WidgetCard title="Application Trend" description="Submitted vs Accepted (6 months)">
          {loading ? <Skeleton className="h-48 w-full" /> : monthlyTrend.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <BarChart data={monthlyTrend} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="submitted" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Bar dataKey="accepted" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconChartBar className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        <WidgetCard title="Student Records" description="Search and manage students">
          <a href="/dashboard/users/students" className="text-sm text-primary hover:underline">View students →</a>
        </WidgetCard>
        <WidgetCard title="Courses" description="Create and manage courses">
          <a href="/dashboard/courses" className="text-sm text-primary hover:underline">View courses →</a>
        </WidgetCard>
        <WidgetCard title="Applications" description="Review pending applications">
          <a href="/dashboard/applications" className="text-sm text-primary hover:underline">Review applications →</a>
        </WidgetCard>
      </div>
    </>
  )
}
