"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { certificateApi } from "@/lib/services"
import type { Award } from "@/lib/types"
import { IconAward, IconPlus } from "@tabler/icons-react"

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAwards() {
      try {
        const res = await certificateApi.listAwards()
        setAwards(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchAwards()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Certificates", href: "/dashboard/certificates" }, { title: "Awards" }]}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Awards</h1>
          <p className="text-sm text-muted-foreground mt-1">Merit-based awards catalogue for certificate issuance.</p>
        </div>
        <Button className="gap-1.5">
          <IconPlus className="size-4" /> New Award
        </Button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
        </div>
      ) : awards.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <IconAward className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No awards configured yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {awards.map((award) => (
            <Card key={award.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-amber-50">
                    <IconAward className="size-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{award.name}</p>
                    <p className="text-xs text-muted-foreground">{award.description}</p>
                  </div>
                </div>
                <BadgeUI variant={award.is_active ? "default" : "secondary"}>
                  {award.is_active ? "Active" : "Inactive"}
                </BadgeUI>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
