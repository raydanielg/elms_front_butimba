"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/lib/api"
import { IconUserPlus } from "@tabler/icons-react"

type Application = {
  id: string
  status: string
  applicant?: { full_name: string; email: string }
  program?: { name: string }
  mode: string
  created_at: string
}

export default function PendingApplicationsPage() {
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get("/applications")
        const all = res.data.data || []
        setApps(all.filter((a: Application) => a.status === "PENDING"))
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  async function review(id: string, status: string) {
    try {
      await api.patch(`/applications/${id}/review`, { status })
      setApps(prev => prev.filter(a => a.id !== id))
    } catch { }
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Applications", href: "/dashboard/applications" }, { title: "Pending" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pending Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">Applications awaiting review</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Applicant</TableHead>
                <TableHead>Program</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                </TableRow>
              )) : apps.map(a => (
                <TableRow key={a.id}>
                  <TableCell>
                    <p className="font-medium">{a.applicant?.full_name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{a.applicant?.email}</p>
                  </TableCell>
                  <TableCell>{a.program?.name || "—"}</TableCell>
                  <TableCell><Badge variant="outline">{a.mode}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => review(a.id, "ACCEPTED")}>Accept</Button>
                      <Button size="sm" variant="destructive" onClick={() => review(a.id, "REJECTED")}>Reject</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && apps.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconUserPlus className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No pending applications</p>
        </div>
      )}
    </DashboardShell>
  )
}
