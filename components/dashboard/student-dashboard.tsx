"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { KpiGrid, QuickActions, WidgetCard, EmptyState } from "./shared"
import {
  IconBook2, IconClipboardList, IconCheck, IconChartBar, IconVideo,
  IconClipboardCheck, IconCalendarEvent, IconCertificate, IconCash,
  IconAward, IconBell,
} from "@tabler/icons-react"

export function StudentDashboard() {
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
    { title: "Enrolled Courses", value: stats?.enrolled_courses, icon: <IconBook2 className="size-5" />, color: "text-blue-600 bg-blue-50" },
    { title: "Completed", value: stats?.completed_courses, icon: <IconCheck className="size-5" />, color: "text-green-600 bg-green-50" },
    { title: "Pending Assignments", value: stats?.pending_assignments, icon: <IconClipboardList className="size-5" />, color: "text-orange-600 bg-orange-50" },
    { title: "My Submissions", value: stats?.my_submissions, icon: <IconChartBar className="size-5" />, color: "text-purple-600 bg-purple-50" },
  ]

  const quickActions = [
    { label: "Continue Course", href: "/dashboard/my-courses", icon: <IconBook2 className="size-4" /> },
    { label: "Submit Assignment", href: "/dashboard/assignments", icon: <IconClipboardList className="size-4" /> },
    { label: "Join Class", href: "/dashboard/online-classes", icon: <IconVideo className="size-4" /> },
    { label: "View Results", href: "/dashboard/my-results", icon: <IconClipboardCheck className="size-4" /> },
    { label: "My Certificates", href: "/dashboard/certificates", icon: <IconCertificate className="size-4" /> },
    { label: "Check Payments", href: "/dashboard/my-finance", icon: <IconCash className="size-4" /> },
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
        <WidgetCard title="Submissions Trend" description="Last 6 months">
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

        <WidgetCard title="Assignment Status" description="Current breakdown">
          {loading ? <Skeleton className="h-48 w-full" /> : assignmentStatus.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <PieChart>
                <Pie data={assignmentStatus} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {assignmentStatus.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconClipboardList className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>
      </div>

      {/* Course Progress */}
      {courseProgress.length > 0 && !loading && (
        <WidgetCard title="My Course Progress" description="Progress across enrolled courses">
          <div className="space-y-3">
            {courseProgress.map((c) => (
              <div key={c.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.title}</span>
                  <span className="text-muted-foreground">{c.progress}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${c.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </WidgetCard>
      )}

      {/* My Status shortcuts */}
      <div className="grid gap-4 md:grid-cols-3">
        <WidgetCard title="My Payments" description="Payment history & status">
          <a href="/dashboard/my-finance/payments" className="text-sm text-primary hover:underline">View payments →</a>
        </WidgetCard>
        <WidgetCard title="My Debts" description="Outstanding balances">
          <a href="/dashboard/my-finance/debts" className="text-sm text-primary hover:underline">Check debts →</a>
        </WidgetCard>
        <WidgetCard title="My Results" description="Grades & transcripts">
          <a href="/dashboard/my-results" className="text-sm text-primary hover:underline">View results →</a>
        </WidgetCard>
      </div>

      {/* Badges & Certificates */}
      <div className="grid gap-4 md:grid-cols-2">
        <WidgetCard title="My Certificates" description="Earned certificates & awards">
          <a href="/dashboard/certificates" className="text-sm text-primary hover:underline">View certificates →</a>
        </WidgetCard>
        <WidgetCard title="My Badges" description="Digital badges earned">
          <a href="/dashboard/certificates/badges" className="text-sm text-primary hover:underline">View badges →</a>
        </WidgetCard>
      </div>
    </>
  )
}
