"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { WidgetCard, EmptyState } from "./shared"
import {
  IconBell, IconCalendarEvent, IconMessage2, IconUsers,
} from "@tabler/icons-react"

export function StaffDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const statsRes = await dashboardApi.stats()
        setStats(statsRes.data.data)
      } catch { } finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  return (
    <>
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <WidgetCard title="Announcements" description="Internal announcements">
          <div className="text-2xl font-bold">{stats?.announcements_count ?? 0}</div>
        </WidgetCard>
        <WidgetCard title="Unread Messages" description="Pending conversations">
          <div className="text-2xl font-bold">{stats?.unread_messages ?? 0}</div>
        </WidgetCard>
        <WidgetCard title="Upcoming Events" description="Calendar events">
          <div className="text-2xl font-bold">{stats?.upcoming_events ?? 0}</div>
        </WidgetCard>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 md:grid-cols-3">
        <WidgetCard title="Announcements" description="Read internal announcements">
          <a href="/dashboard/announcements" className="flex items-center gap-2 text-sm text-primary hover:underline">
            <IconBell className="size-4" /> View announcements →
          </a>
        </WidgetCard>
        <WidgetCard title="Calendar" description="View events and schedules">
          <a href="/dashboard/calendar" className="flex items-center gap-2 text-sm text-primary hover:underline">
            <IconCalendarEvent className="size-4" /> View calendar →
          </a>
        </WidgetCard>
        <WidgetCard title="Messages" description="Send and read messages">
          <a href="/dashboard/messages" className="flex items-center gap-2 text-sm text-primary hover:underline">
            <IconMessage2 className="size-4" /> Open messages →
          </a>
        </WidgetCard>
      </div>

      {/* Directory */}
      <WidgetCard title="Staff Directory" description="Contact colleagues">
        <a href="/dashboard/users" className="flex items-center gap-2 text-sm text-primary hover:underline">
          <IconUsers className="size-4" /> View directory →
        </a>
      </WidgetCard>
    </>
  )
}
