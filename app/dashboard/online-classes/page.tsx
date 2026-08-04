"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { coursesApi } from "@/lib/services"
import { lmsApi } from "@/lib/services"
import type { Course } from "@/lib/types"
import { IconVideo, IconClock } from "@tabler/icons-react"

type OnlineClass = {
  id: string
  course_id: string
  title: string
  platform: string
  meeting_link: string
  scheduled_at: string
  duration_minutes: number
  status: string
  course?: { code: string; title: string }
}

export default function OnlineClassesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [classes, setClasses] = useState<OnlineClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await coursesApi.myCourses()
        const myCourses = res.data.data || []
        setCourses(myCourses)

        const allClasses: OnlineClass[] = []
        for (const c of myCourses) {
          try {
            const cls = await lmsApi.getOnlineClasses(c.id)
            const items = cls.data.data || []
            allClasses.push(...items)
          } catch { }
        }
        setClasses(allClasses)
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const upcoming = classes.filter(c => c.status === "SCHEDULED")
  const live = classes.filter(c => c.status === "LIVE")
  const past = classes.filter(c => c.status === "COMPLETED")

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Online Classes" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Online Classes</h1>
        <p className="text-sm text-muted-foreground mt-1">Join scheduled online classes</p>
      </div>

      {live.length > 0 && (
        <Card className="border-green-500/30 bg-green-500/5">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex size-3 items-center justify-center rounded-full bg-red-500 animate-pulse" />
              <CardTitle className="text-base text-green-600">Live Now</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {live.map(c => (
              <div key={c.id} className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-xs text-muted-foreground">{c.course?.title} · {c.platform}</p>
                </div>
                <Button size="sm" onClick={() => window.open(c.meeting_link, "_blank")}>
                  <IconVideo className="size-4" /> Join Now
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">Upcoming Classes</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {loading ? Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
              <CardContent><Skeleton className="h-10 w-full" /></CardContent>
            </Card>
          )) : upcoming.map(c => (
            <Card key={c.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{c.title}</CardTitle>
                  <Badge variant="outline">{c.platform}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{c.course?.title}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <IconClock className="size-4" />
                  {new Date(c.scheduled_at).toLocaleString()} · {c.duration_minutes} min
                </div>
                <Button size="sm" variant="outline" className="w-full" disabled>
                  Not Started Yet
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {!loading && upcoming.length === 0 && live.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconVideo className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No online classes scheduled</p>
        </div>
      )}
    </DashboardShell>
  )
}
