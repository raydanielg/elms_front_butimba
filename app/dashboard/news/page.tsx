"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"
import { IconFileText } from "@tabler/icons-react"

type NewsEvent = {
  id: string
  title: string
  body: string
  type: string
  image_url?: string
  created_at: string
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get("/news")
        setNews(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "News & Events" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">News & Events</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage college news and events</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-16 w-full" /></CardContent>
          </Card>
        )) : news.map(n => (
          <Card key={n.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-base">{n.title}</CardTitle>
                <Badge variant="outline">{n.type}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{new Date(n.created_at).toLocaleDateString()}</p>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">{n.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && news.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconFileText className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No news or events found</p>
        </div>
      )}
    </DashboardShell>
  )
}
