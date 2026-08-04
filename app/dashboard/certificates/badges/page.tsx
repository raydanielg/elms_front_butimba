"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { badgeApi } from "@/lib/services"
import type { BadgeIssued } from "@/lib/types"
import { IconAward } from "@tabler/icons-react"

export default function MyBadgesPage() {
  const [badges, setBadges] = useState<BadgeIssued[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBadges() {
      try {
        const res = await badgeApi.myBadges()
        setBadges(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchBadges()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Certificates", href: "/dashboard/certificates" }, { title: "My Badges" }]}>
      <h1 className="text-2xl font-bold tracking-tight">My Badges</h1>
      <p className="text-sm text-muted-foreground mt-1">Digital badges you have earned.</p>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}><CardContent className="py-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : badges.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <IconAward className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No badges earned yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
          {badges.map((b) => (
            <Card key={b.id} className="text-center">
              <CardContent className="flex flex-col items-center py-6">
                <div className="flex size-16 items-center justify-center rounded-full bg-amber-50">
                  <IconAward className="size-8 text-amber-600" />
                </div>
                <p className="mt-3 text-sm font-medium">{b.badge?.name || "Badge"}</p>
                <p className="text-xs text-muted-foreground mt-1">{b.badge?.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
