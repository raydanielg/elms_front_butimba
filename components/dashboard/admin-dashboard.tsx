"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { KpiGrid, QuickActions, WidgetCard, EmptyState } from "./shared"
import {
  IconUsers, IconBook2, IconUserPlus, IconChartBar,
  IconDatabase, IconCash,
  IconBooks, IconHistory, IconSettings, IconPlus,
} from "@tabler/icons-react"

export function AdminDashboard() {
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
    { title: "Total Users", value: stats?.total_users, icon: <IconUsers className="size-5" />, color: "text-blue-600 bg-blue-50", subtitle: `${stats?.total_students ?? 0} students · ${stats?.total_tutors ?? 0} tutors · ${stats?.total_staff ?? 0} staff` },
    { title: "Programs & Courses", value: `${stats?.total_programs ?? 0} / ${stats?.total_courses ?? 0}`, icon: <IconBooks className="size-5" />, color: "text-purple-600 bg-purple-50", subtitle: `${stats?.active_courses ?? 0} active` },
    { title: "Active Enrolments", value: stats?.total_enrollments, icon: <IconChartBar className="size-5" />, color: "text-orange-600 bg-orange-50" },
    { title: "Pending Applications", value: stats?.pending_applications, icon: <IconUserPlus className="size-5" />, color: "text-red-600 bg-red-50" },
  ]

  const quickActions = [
    { label: "Create User", href: "/dashboard/users", icon: <IconUserPlus className="size-4" /> },
    { label: "Create Course", href: "/dashboard/courses/new", icon: <IconPlus className="size-4" /> },
    { label: "Assign Roles", href: "/dashboard/users", icon: <IconUsers className="size-4" /> },
    { label: "Run Backup", href: "/dashboard/settings", icon: <IconDatabase className="size-4" /> },
    { label: "View Logs", href: "/dashboard/audit-logs", icon: <IconHistory className="size-4" /> },
    { label: "Site Config", href: "/dashboard/settings", icon: <IconSettings className="size-4" /> },
  ]

  const monthlyTrend = (chartData.monthly_trend as Record<string, unknown>[]) || []
  const monthlyPayments = (chartData.monthly_payments as Record<string, unknown>[]) || []
  const userDistribution = (chartData.user_distribution as { name: string; value: number; fill: string }[]) || []
  const courseStatus = (chartData.course_status as { name: string; value: number; fill: string }[]) || []

  return (
    <>
      <KpiGrid cards={kpiCards} loading={loading} />
      <QuickActions actions={quickActions} />

      {/* Storage & System Health */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <WidgetCard title="Storage Used" description="Content-addressed files">
          <div className="text-2xl font-bold">{((stats?.storage_used ?? 0) / 1024).toFixed(1)} GB</div>
        </WidgetCard>
        <WidgetCard title="System Health" description="Scheduled tasks & jobs">
          <div className="flex items-center gap-2">
            <span className={`size-2.5 rounded-full ${stats?.failed_jobs ? "bg-red-500" : "bg-green-500"}`} />
            <span className="text-sm font-medium">{stats?.failed_jobs ? `${stats.failed_jobs} failed jobs` : "All OK"}</span>
          </div>
        </WidgetCard>
        <WidgetCard title="Pending Payments" description="Awaiting verification">
          <div className="text-2xl font-bold">{stats?.pending_payments ?? 0}</div>
        </WidgetCard>
        <WidgetCard title="Confirmed Payments" description="All time">
          <div className="text-2xl font-bold">{stats?.confirmed_payments ?? 0}</div>
        </WidgetCard>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WidgetCard title="Enrollments & Submissions" description="Last 6 months" >
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

        <WidgetCard title="User Distribution" description="By role">
          {loading ? <Skeleton className="h-48 w-full" /> : userDistribution.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <PieChart>
                <Pie data={userDistribution} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {userDistribution.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconUsers className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>
      </div>

      {/* Payments + Course Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WidgetCard title="Payments Overview" description="Confirmed vs Pending (6 months)">
          {loading ? <Skeleton className="h-48 w-full" /> : monthlyPayments.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <BarChart data={monthlyPayments} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="confirmed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconCash className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>

        <WidgetCard title="Course Status" description="Active vs Inactive">
          {loading ? <Skeleton className="h-48 w-full" /> : courseStatus.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <PieChart>
                <Pie data={courseStatus} dataKey="value" nameKey="name" outerRadius={75} paddingAngle={2}>
                  {courseStatus.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconBook2 className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>
      </div>
    </>
  )
}
