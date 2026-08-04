"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { certificateApi } from "@/lib/services"
import { getUser } from "@/lib/auth"
import type { CertificateIssue } from "@/lib/types"
import { IconCertificate, IconAward, IconFileText, IconQrcode, IconDownload, IconPrinter, IconShare, IconEye } from "@tabler/icons-react"

export default function MyCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateIssue[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    async function fetchCerts() {
      try {
        const res = await certificateApi.myCertificates()
        setCertificates(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchCerts()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "My Certificates" }]}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Certificates & Awards</h1>
          <p className="text-sm text-muted-foreground mt-1">View, download, and verify your earned certificates.</p>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
              <CardContent><Skeleton className="h-24 w-full" /></CardContent>
            </Card>
          ))}
        </div>
      ) : certificates.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <IconCertificate className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No certificates yet — complete your program to earn one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">{cert.template?.name || "Certificate"}</CardTitle>
                    <CardDescription className="mt-1">{cert.template?.type}</CardDescription>
                  </div>
                  <BadgeUI variant={cert.status === "ISSUED" ? "default" : cert.status === "REVOKED" ? "destructive" : "secondary"}>
                    {cert.status}
                  </BadgeUI>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {cert.grade && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Grade</span>
                    <span className="font-medium">{cert.grade}</span>
                  </div>
                )}
                {cert.classification && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Classification</span>
                    <span className="font-medium">{cert.classification}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Issued</span>
                  <span className="font-medium">{new Date(cert.issued_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 rounded-md border bg-muted/50 p-2">
                  <IconQrcode className="size-5 text-muted-foreground" />
                  <code className="text-xs font-mono">{cert.code}</code>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <a href={certificateApi.viewUrl(cert.id)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <IconEye className="size-4" /> View
                    </Button>
                  </a>
                  <a href={certificateApi.downloadUrl(cert.id)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <IconDownload className="size-4" /> PDF
                    </Button>
                  </a>
                  <a href={certificateApi.viewUrl(cert.id)} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <IconPrinter className="size-4" /> Print
                    </Button>
                  </a>
                  <a href={`/verify/${cert.code}`} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5")}>
                    <IconShare className="size-4" /> Verify
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardShell>
  )
}
