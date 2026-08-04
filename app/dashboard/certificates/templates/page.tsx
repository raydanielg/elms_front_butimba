"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { certificateApi } from "@/lib/services"
import type { CertificateTemplate } from "@/lib/types"
import { IconPlus, IconCopy, IconCertificate, IconEdit, IconTrash } from "@tabler/icons-react"

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await certificateApi.listTemplates()
        setTemplates(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchTemplates()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Certificates", href: "/dashboard/certificates" }, { title: "Templates" }]}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Certificate Templates</h1>
          <p className="text-sm text-muted-foreground mt-1">Design and manage reusable certificate templates.</p>
        </div>
        <Button className="gap-1.5">
          <IconPlus className="size-4" /> New Template
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
              <CardContent><Skeleton className="h-20 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      ) : templates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <IconCertificate className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No templates yet. Create your first certificate template.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => (
            <Card key={tpl.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{tpl.name}</CardTitle>
                    <CardDescription className="mt-1">{tpl.type} · {tpl.page_size} {tpl.orientation}</CardDescription>
                  </div>
                  <BadgeUI variant={tpl.is_active ? "default" : "secondary"}>
                    {tpl.is_active ? "Active" : "Inactive"}
                  </BadgeUI>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Trigger</span>
                  <span className="font-medium">{tpl.trigger_type}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Issued</span>
                  <span className="font-medium">{tpl.issues_count ?? 0}</span>
                </div>
                {tpl.requires_fees_cleared && (
                  <BadgeUI variant="outline" className="text-xs">Requires fees cleared</BadgeUI>
                )}
                <div className="flex items-center gap-2 pt-2">
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <IconEdit className="size-4" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1.5" onClick={async () => {
                    try { await certificateApi.duplicateTemplate(tpl.id); window.location.reload() } catch { }
                  }}>
                    <IconCopy className="size-4" /> Duplicate
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={async () => {
                    try { await certificateApi.deleteTemplate(tpl.id); window.location.reload() } catch { }
                  }}>
                    <IconTrash className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
