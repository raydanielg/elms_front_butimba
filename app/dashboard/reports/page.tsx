"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { IconBook2, IconUsers, IconClipboardList, IconChartBar, IconCheck, IconClock, IconSchool } from "@tabler/icons-react"

export default function ReportsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await dashboardApi.stats()
        setStats(res.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const reportCards = [
    { title: "Total Users", value: stats?.total_users ?? 0, icon: <IconUsers className="size-5" />, color: "text-blue-600 bg-blue-50" },
    { title: "Total Students", value: stats?.total_students ?? 0, icon: <IconSchool className="size-5" />, color: "text-green-600 bg-green-50" },
    { title: "Total Courses", value: stats?.total_courses ?? 0, icon: <IconBook2 className="size-5" />, color: "text-purple-600 bg-purple-50" },
    { title: "Total Assignments", value: stats?.total_assignments ?? 0, icon: <IconClipboardList className="size-5" />, color: "text-orange-600 bg-orange-50" },
    { title: "Total Submissions", value: stats?.total_submissions ?? 0, icon: <IconChartBar className="size-5" />, color: "text-pink-600 bg-pink-50" },
    { title: "Pending Payments", value: stats?.pending_payments ?? 0, icon: <IconClock className="size-5" />, color: "text-red-600 bg-red-50" },
    { title: "Confirmed Payments", value: stats?.confirmed_payments ?? 0, icon: <IconCheck className="size-5" />, color: "text-emerald-600 bg-emerald-50" },
    { title: "Total Enrollments", value: stats?.total_enrollments ?? 0, icon: <IconUsers className="size-5" />, color: "text-indigo-600 bg-indigo-50" },
  ]

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Reports" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
        <p className="text-sm text-muted-foreground mt-1">System-wide statistics and insights</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="size-8 rounded-lg" />
                </CardHeader>
                <CardContent><Skeleton className="h-8 w-16" /></CardContent>
              </Card>
            ))
          : reportCards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <div className={`flex size-8 items-center justify-center rounded-lg ${card.color}`}>{card.icon}</div>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{card.value}</div></CardContent>
              </Card>
            ))}
      </div>
    </DashboardShell>
  )
}
