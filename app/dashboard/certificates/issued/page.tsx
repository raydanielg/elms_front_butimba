"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { certificateApi } from "@/lib/services"
import type { CertificateIssue } from "@/lib/types"
import { IconAward, IconQrcode, IconPrinter, IconDownload, IconEye } from "@tabler/icons-react"

export default function IssuedPage() {
  const [issues, setIssues] = useState<CertificateIssue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchIssues() {
      try {
        const res = await certificateApi.indexIssues()
        setIssues(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchIssues()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Certificates", href: "/dashboard/certificates" }, { title: "Issued" }]}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Issued Certificates</h1>
          <p className="text-sm text-muted-foreground mt-1">All issued certificates — view, revoke, or reissue.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
        </div>
      ) : issues.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <IconAward className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No certificates issued yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {issues.map((issue) => (
            <Card key={issue.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
                    <IconAward className="size-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{issue.user?.full_name || "Unknown"}</p>
                    <p className="text-xs text-muted-foreground">{issue.template?.name} · {issue.template?.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {issue.grade && <span className="text-sm font-medium">{issue.grade}</span>}
                  <div className="flex items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1">
                    <IconQrcode className="size-4 text-muted-foreground" />
                    <code className="text-xs font-mono">{issue.code}</code>
                  </div>
                  <BadgeUI variant={issue.status === "ISSUED" ? "default" : issue.status === "REVOKED" ? "destructive" : "secondary"}>
                    {issue.status}
                  </BadgeUI>
                  <span className="text-xs text-muted-foreground">{new Date(issue.issued_at).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    <a href={certificateApi.viewUrl(issue.id)} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <IconEye className="size-4" />
                      </Button>
                    </a>
                    <a href={certificateApi.downloadUrl(issue.id)} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <IconDownload className="size-4" />
                      </Button>
                    </a>
                    <a href={certificateApi.viewUrl(issue.id)} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm" className="gap-1.5">
                        <IconPrinter className="size-4" />
                      </Button>
                    </a>
                    {issue.status === "ISSUED" && (
                      <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={async () => {
                        const reason = prompt("Revoke reason:")
                        if (reason) {
                          try { await certificateApi.revoke(issue.id, reason); window.location.reload() } catch { }
                        }
                      }}>
                        Revoke
                      </Button>
                    )}
                    {issue.status !== "REISSUED" && (
                      <Button variant="ghost" size="sm" className="gap-1.5" onClick={async () => {
                        try { await certificateApi.reissue(issue.id); window.location.reload() } catch { }
                      }}>
                        Reissue
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
