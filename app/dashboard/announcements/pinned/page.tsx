"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { lmsApi } from "@/lib/services"
import type { Announcement } from "@/lib/types"
import { IconBell, IconPin } from "@tabler/icons-react"

export default function PinnedAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const res = await lmsApi.getAnnouncements()
        const all = res.data.data || []
        setAnnouncements(all.filter((a: Announcement) => a.is_pinned))
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchAnnouncements()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Announcements", href: "/dashboard/announcements" }, { title: "Pinned" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pinned Announcements</h1>
        <p className="text-sm text-muted-foreground mt-1">Important announcements pinned by staff</p>
      </div>

      <div className="space-y-4">
        {loading
          ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/3" /></CardHeader>
                <CardContent><Skeleton className="h-16 w-full" /></CardContent>
              </Card>
            ))
          : announcements.map((ann) => (
              <Card key={ann.id} className="border-primary/30">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <IconPin className="size-4 text-primary" />
                      <CardTitle className="text-base">{ann.title}</CardTitle>
                    </div>
                    <Badge variant={ann.scope === "GLOBAL" ? "default" : "secondary"}>{ann.scope}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {ann.creator?.full_name || "Unknown"} · {new Date(ann.created_at || "").toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ann.body}</p>
                </CardContent>
              </Card>
            ))}
      </div>

      {!loading && announcements.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconBell className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No pinned announcements</p>
        </div>
      )}
    </DashboardShell>
  )
}
