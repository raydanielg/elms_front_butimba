"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid, Bar, BarChart } from "recharts"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { KpiGrid, QuickActions, WidgetCard, EmptyState } from "./shared"
import {
  IconUsers, IconSchool, IconUserPlus, IconChartBar, IconClipboardCheck,
  IconCash, IconMessage2, IconBell, IconBook2, IconFileText,
} from "@tabler/icons-react"

export function PrincipalDashboard() {
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
    { title: "Total Students", value: stats?.total_students, icon: <IconUsers className="size-5" />, color: "text-blue-600 bg-blue-50" },
    { title: "Total Tutors", value: stats?.total_tutors, icon: <IconSchool className="size-5" />, color: "text-purple-600 bg-purple-50" },
    { title: "Applications", value: stats?.applications_pending, icon: <IconUserPlus className="size-5" />, color: "text-orange-600 bg-orange-50", subtitle: `${stats?.applications_accepted ?? 0} accepted · ${stats?.applications_rejected ?? 0} rejected` },
    { title: "Pass Rate", value: `${stats?.pass_rate ?? 0}%`, icon: <IconClipboardCheck className="size-5" />, color: "text-green-600 bg-green-50" },
  ]

  const quickActions = [
    { label: "Post Message", href: "/dashboard/announcements", icon: <IconMessage2 className="size-4" /> },
    { label: "Publish Announcement", href: "/dashboard/announcements", icon: <IconBell className="size-4" /> },
    { label: "Academic Report", href: "/dashboard/reports", icon: <IconFileText className="size-4" /> },
    { label: "Finance Report", href: "/dashboard/finance", icon: <IconCash className="size-4" /> },
  ]

  const monthlyTrend = (chartData.monthly_trend as Record<string, unknown>[]) || []
  const monthlyPayments = (chartData.monthly_payments as Record<string, unknown>[]) || []
  const programEnrolment = (chartData.program_enrolment as { name: string; value: number; fill: string }[]) || []
  const academicPerformance = (chartData.academic_performance as { name: string; value: number; fill: string }[]) || []

  return (
    <>
      <KpiGrid cards={kpiCards} loading={loading} />
      <QuickActions actions={quickActions} />

      {/* Finance Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <WidgetCard title="Fee Collection Rate" description="Collected vs Expected">
          <div className="text-2xl font-bold">{stats?.fee_collection_rate ?? 0}%</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Collected: TSh {((stats?.total_collected ?? 0) / 1000).toFixed(0)}k · Outstanding: TSh {((stats?.total_outstanding ?? 0) / 1000).toFixed(0)}k
          </div>
        </WidgetCard>
        <WidgetCard title="Principal's Message" description="Home page message editor">
          <a href="/dashboard/announcements" className="text-sm text-primary hover:underline">Edit message →</a>
        </WidgetCard>
        <WidgetCard title="College Announcements" description="Global announcements">
          <a href="/dashboard/announcements" className="text-sm text-primary hover:underline">Compose →</a>
        </WidgetCard>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WidgetCard title="Enrolment Trend" description="Last 6 months">
          {loading ? <Skeleton className="h-48 w-full" /> : monthlyTrend.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <LineChart data={monthlyTrend} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="enrollments" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconChartBar className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>

        <WidgetCard title="Finance Summary" description="Collected vs Outstanding">
          {loading ? <Skeleton className="h-48 w-full" /> : monthlyPayments.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <BarChart data={monthlyPayments} margin={{ left: 8, right: 8, top: 8, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} className="text-xs" />
                <YAxis tickLine={false} axisLine={false} className="text-xs" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="collected" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="outstanding" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconCash className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WidgetCard title="Enrolment by Program" description="Distribution across programs">
          {loading ? <Skeleton className="h-48 w-full" /> : programEnrolment.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <PieChart>
                <Pie data={programEnrolment} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {programEnrolment.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconBook2 className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>

        <WidgetCard title="Academic Performance" description="Pass vs Fail">
          {loading ? <Skeleton className="h-48 w-full" /> : academicPerformance.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <PieChart>
                <Pie data={academicPerformance} dataKey="value" nameKey="name" outerRadius={75} paddingAngle={2}>
                  {academicPerformance.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconClipboardCheck className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>
      </div>
    </>
  )
}
