"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { certificateApi } from "@/lib/services"
import type { CertificateTemplate } from "@/lib/types"
import { IconCopy, IconCertificate, IconEye, IconTrash } from "@tabler/icons-react"

const TYPE_COLORS: Record<string, string> = {
  COMPLETION: "#1a365d",
  AWARD: "#c8861a",
  PARTICIPATION: "#2d6a4f",
  TRANSCRIPT: "#6b46c1",
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [previewId, setPreviewId] = useState<string | null>(null)

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
          <p className="text-sm text-muted-foreground mt-1">Choose from pre-designed templates or create your own.</p>
        </div>
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
            <p className="mt-4 text-sm text-muted-foreground">No templates yet. Run the seeder or create your first template.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((tpl) => {
            const color = TYPE_COLORS[tpl.type] || "#1a365d"
            return (
              <Card key={tpl.id} className="hover:shadow-md transition-shadow overflow-hidden">
                <div className="h-2" style={{ background: color }} />
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
                    <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setPreviewId(previewId === tpl.id ? null : tpl.id)}>
                      <IconEye className="size-4" /> {previewId === tpl.id ? "Hide" : "Preview"}
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5" onClick={async () => {
                      try { await certificateApi.duplicateTemplate(tpl.id); window.location.reload() } catch { }
                    }}>
                      <IconCopy className="size-4" /> Duplicate
                    </Button>
                    <Button variant="ghost" size="sm" className="gap-1.5 text-destructive" onClick={async () => {
                      if (confirm("Delete this template?")) {
                        try { await certificateApi.deleteTemplate(tpl.id); window.location.reload() } catch { }
                      }
                    }}>
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                  {previewId === tpl.id && (
                    <div className="mt-3 rounded-lg border bg-muted/30 p-3">
                      <MiniPreview template={tpl} />
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </DashboardShell>
  )
}

function MiniPreview({ template }: { template: CertificateTemplate }) {
  const page = template.pages?.[0]
  if (!page) return <p className="text-xs text-muted-foreground">No pages</p>

  const isLandscape = template.orientation === "LANDSCAPE"
  const previewW = isLandscape ? 280 : 198
  const previewH = isLandscape ? 198 : 280
  const scaleX = previewW / (page.width || 842)
  const scaleY = previewH / (page.height || 595)
  const color = TYPE_COLORS[template.type] || "#1a365d"

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative bg-white border-2 shadow-sm overflow-hidden"
        style={{ width: previewW, height: previewH, borderColor: color }}
      >
        <div className="absolute inset-1 border" style={{ borderColor: "#c8861a" }} />
        <div className="absolute top-0.5 left-0.5 w-3 h-3 border-l-2 border-t-2" style={{ borderColor: color }} />
        <div className="absolute top-0.5 right-0.5 w-3 h-3 border-r-2 border-t-2" style={{ borderColor: color }} />
        <div className="absolute bottom-0.5 left-0.5 w-3 h-3 border-l-2 border-b-2" style={{ borderColor: color }} />
        <div className="absolute bottom-0.5 right-0.5 w-3 h-3 border-r-2 border-b-2" style={{ borderColor: color }} />
        {page.elements?.map((el) => {
          const text = resolveText(el.element_type, el.data?.text as string | undefined)
          if (!text && el.element_type !== "qr_code") return null
          const x = (el.pos_x || 0) * scaleX
          const y = (el.pos_y || 0) * scaleY
          const fs = Math.max(4, (el.font_size || 14) * Math.min(scaleX, scaleY))
          if (el.element_type === "qr_code") {
            return <div key={el.id} className="absolute bg-muted" style={{ left: x - 15, top: y, width: 30, height: 30 }} />
          }
          return (
            <div
              key={el.id}
              className="absolute whitespace-nowrap"
              style={{
                left: x,
                top: y,
                transform: "translateX(-50%)",
                fontSize: fs,
                fontFamily: el.font || "Georgia",
                color: el.colour || "#333",
                textAlign: (el.align || "CENTER").toLowerCase() as "left" | "center" | "right",
                zIndex: el.z_index || 1,
              }}
            >
              {text}
            </div>
          )
        })}
      </div>
      <p className="text-[10px] text-muted-foreground">Live preview · {page.elements?.length || 0} elements</p>
    </div>
  )
}

function resolveText(type: string, staticText?: string): string {
  switch (type) {
    case "static_text": return staticText || ""
    case "recipient_name": return "John Doe"
    case "program_name": return "Diploma in Education"
    case "course_name": return "Course Name"
    case "grade": return "B+"
    case "date": return "January 15, 2026"
    case "verification_code": return "BTC-XXXX-XXXX"
    case "serial_number": return "Serial No: 0001"
    case "qr_code": return "QR"
    default: return ""
  }
}
