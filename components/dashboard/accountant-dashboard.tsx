"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Pie, PieChart, Cell, XAxis, YAxis, CartesianGrid } from "recharts"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { KpiGrid, QuickActions, WidgetCard, EmptyState } from "./shared"
import {
  IconCash, IconClipboardCheck, IconAlertTriangle, IconChartBar,
  IconFileText, IconDownload, IconCoin,
} from "@tabler/icons-react"

export function AccountantDashboard() {
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
    { title: "Total Collected", value: `TSh ${((stats?.total_collected ?? 0) / 1000).toFixed(0)}k`, icon: <IconCash className="size-5" />, color: "text-green-600 bg-green-50" },
    { title: "Pending Verification", value: stats?.pending_verification, icon: <IconClipboardCheck className="size-5" />, color: "text-orange-600 bg-orange-50" },
    { title: "Outstanding Debts", value: `TSh ${((stats?.outstanding_debts ?? 0) / 1000).toFixed(0)}k`, icon: <IconAlertTriangle className="size-5" />, color: "text-red-600 bg-red-50" },
    { title: "Confirmations Today", value: stats?.confirmations_today, icon: <IconCoin className="size-5" />, color: "text-blue-600 bg-blue-50" },
  ]

  const quickActions = [
    { label: "Verify Payment", href: "/dashboard/finance/payments", icon: <IconClipboardCheck className="size-4" /> },
    { label: "Edit Fee Item", href: "/dashboard/finance/fees", icon: <IconCash className="size-4" /> },
    { label: "Record Debt", href: "/dashboard/finance/debts", icon: <IconAlertTriangle className="size-4" /> },
    { label: "Export Report", href: "/dashboard/finance", icon: <IconDownload className="size-4" /> },
  ]

  const monthlyPayments = (chartData.monthly_payments as Record<string, unknown>[]) || []
  const debtAging = (chartData.debt_aging as { name: string; value: number; fill: string }[]) || []

  return (
    <>
      <KpiGrid cards={kpiCards} loading={loading} />
      <QuickActions actions={quickActions} />

      {/* Debtors count */}
      <WidgetCard title="Total Debtors" description="Students with outstanding balance">
        <div className="text-2xl font-bold">{stats?.total_debtors ?? 0}</div>
      </WidgetCard>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <WidgetCard title="Revenue Chart" description="Confirmed vs Pending payments (6 months)">
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
          ) : <EmptyState icon={<IconChartBar className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>

        <WidgetCard title="Debt Aging" description="Outstanding debt by age">
          {loading ? <Skeleton className="h-48 w-full" /> : debtAging.length > 0 ? (
            <ChartContainer config={{}} className="h-48 w-full">
              <PieChart>
                <Pie data={debtAging} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={2}>
                  {debtAging.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
              </PieChart>
            </ChartContainer>
          ) : <EmptyState icon={<IconCash className="size-10 text-muted-foreground/50" />} message="No data available" />}
        </WidgetCard>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        <WidgetCard title="Payments" description="Search payment history">
          <a href="/dashboard/finance/payments" className="text-sm text-primary hover:underline">View payments →</a>
        </WidgetCard>
        <WidgetCard title="Fee Structure" description="Manage fee items per program/mode">
          <a href="/dashboard/finance/fees" className="text-sm text-primary hover:underline">Edit fees →</a>
        </WidgetCard>
        <WidgetCard title="Debtors" description="Students with outstanding balance">
          <a href="/dashboard/finance/debts" className="text-sm text-primary hover:underline">View debtors →</a>
        </WidgetCard>
      </div>
    </>
  )
}
