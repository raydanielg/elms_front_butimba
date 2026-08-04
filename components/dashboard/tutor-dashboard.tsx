"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { KpiGrid, QuickActions, WidgetCard, EmptyState } from "./shared"
import {
  IconBook2, IconUsers, IconClipboardList, IconClock, IconVideo,
  IconChartBar, IconPlus, IconBell, IconClipboardCheck, IconCalendarEvent,
} from "@tabler/icons-react"

export function TutorDashboard() {
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
    { title: "My Courses", value: stats?.teaching_courses, icon: <IconBook2 className="size-5" />, color: "text-blue-600 bg-blue-50" },
    { title: "Students Taught", value: stats?.students_taught, icon: <IconUsers className="size-5" />, color: "text-green-600 bg-green-50" },
    { title: "Pending Grading", value: stats?.pending_submissions, icon: <IconClock className="size-5" />, color: "text-red-600 bg-red-50" },
    { title: "Upcoming Classes", value: stats?.upcoming_classes, icon: <IconVideo className="size-5" />, color: "text-purple-600 bg-purple-50" },
  ]

  const quickActions = [
    { label: "Add Topic/Material", href: "/dashboard/my-courses", icon: <IconPlus className="size-4" /> },
    { label: "Create Assignment", href: "/dashboard/assignments", icon: <IconClipboardList className="size-4" /> },
    { label: "Grade", href: "/dashboard/assignments/submitted", icon: <IconClipboardCheck className="size-4" /> },
    { label: "Schedule Class", href: "/dashboard/online-classes", icon: <IconVideo className="size-4" /> },
    { label: "Post Announcement", href: "/dashboard/announcements", icon: <IconBell className="size-4" /> },
  ]

  const monthlyTrend = (chartData.monthly_trend as Record<string, unknown>[]) || []
  const assignmentStatus = (chartData.assignment_status as { name: string; value: number; fill: string }[]) || []
  const courseProgress = (chartData.course_progress as { name: string; title: string; progress: number }[]) || []

  return (
    <>
      <KpiGrid cards={kpiCards} loading={loading} />
      <QuickActions actions={quickActions} />

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WidgetCard title="Submissions & Grading" description="Last 6 months">
          {loading ? <Skeleton className="h-48 w-full" /> : monthlyTrend.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <LineChart data={monthlyTrend} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                {Object.keys(monthlyTrend[0] || {}).filter(k => k !== "month").map((key, i) => (
                  <Line key={key} type="monotone" dataKey={key} stroke={i === 0 ? "#3b82f6" : "#10b981"} strokeWidth={2} dot={{ r: 3 }} />
                ))}
              </LineChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconChartBar className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>

        <WidgetCard title="Grading Status" description="Graded vs Pending">
          {loading ? <Skeleton className="h-48 w-full" /> : assignmentStatus.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <PieChart>
                <Pie data={assignmentStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {assignmentStatus.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconClipboardCheck className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>
      </div>

      {/* Students per Course */}
      {courseProgress.length > 0 && !loading && (
        <WidgetCard title="Students per Course" description="Enrollment count by course">
          <div className="space-y-3">
            {courseProgress.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.title}</span>
                  <span className="text-muted-foreground">{c.progress} students</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${Math.min(c.progress * 10, 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      )}

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        <WidgetCard title="My Courses" description="Quick open courses">
          <a href="/dashboard/my-courses" className="text-sm text-primary hover:underline">View courses →</a>
        </WidgetCard>
        <WidgetCard title="Grading Queue" description="Submissions awaiting marks">
          <a href="/dashboard/assignments/submitted" className="text-sm text-primary hover:underline">Grade now →</a>
        </WidgetCard>
        <WidgetCard title="Calendar" description="Upcoming deadlines & classes">
          <a href="/dashboard/calendar" className="text-sm text-primary hover:underline">View calendar →</a>
        </WidgetCard>
      </div>
    </>
  )
}
