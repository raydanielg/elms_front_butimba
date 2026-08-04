"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { certificateApi } from "@/lib/services"
import type { CertificateTemplate, Award } from "@/lib/types"
import { IconCertificate, IconUsers, IconAward } from "@tabler/icons-react"

export default function IssueCenterPage() {
  const [templates, setTemplates] = useState<CertificateTemplate[]>([])
  const [awards, setAwards] = useState<Award[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string>("")
  const [userId, setUserId] = useState<string>("")
  const [result, setResult] = useState<string>("")

  useEffect(() => {
    async function fetch() {
      try {
        const [tplRes, awardRes] = await Promise.all([
          certificateApi.listTemplates({ active_only: true }),
          certificateApi.listAwards(),
        ])
        setTemplates(tplRes.data.data || [])
        setAwards(awardRes.data.data || [])
      } catch { }
    }
    fetch()
  }, [])

  async function handleIssue() {
    if (!selectedTemplate || !userId) return
    try {
      const res = await certificateApi.issue({ template_id: selectedTemplate, user_id: userId })
      setResult(`Certificate issued! Code: ${res.data.data.code}`)
    } catch (err: unknown) {
      const error = err as { response?: { data?: { error?: { message?: string } } } }
      setResult(error?.response?.data?.error?.message || "Failed to issue certificate")
    }
  }

  async function handleBulkIssue(programId: string) {
    if (!selectedTemplate || !programId) return
    try {
      const res = await certificateApi.bulkIssue({ template_id: selectedTemplate, program_id: programId })
      const data = res.data.data as Record<string, unknown>
      setResult(`Bulk issue complete: ${data.total_issued} issued, ${data.total_skipped} skipped`)
    } catch {
      setResult("Bulk issue failed")
    }
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Certificates", href: "/dashboard/certificates" }, { title: "Issue Center" }]}>
      <h1 className="text-2xl font-bold tracking-tight">Issue Center</h1>
      <p className="text-sm text-muted-foreground mt-1">Issue certificates individually or in bulk.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Single Issue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <IconCertificate className="size-5" /> Single Issue
            </CardTitle>
            <CardDescription>Issue a certificate to one person</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium">Template</label>
              <select
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">Select a template...</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.name} ({t.type})</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">User ID</label>
              <input
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter user UUID"
              />
            </div>
            <Button onClick={handleIssue} disabled={!selectedTemplate || !userId}>
              Issue Certificate
            </Button>
            {result && (
              <div className="rounded-md border bg-muted/50 p-3 text-sm">{result}</div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Issue */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <IconUsers className="size-5" /> Bulk Issue
            </CardTitle>
            <CardDescription>Issue to an entire program or cohort</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm font-medium">Template</label>
              <select
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
              >
                <option value="">Select a template...</option>
                {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Program ID</label>
              <input
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Enter program UUID for bulk issue"
                onBlur={(e) => e.target.value && handleBulkIssue(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">Eligibility will be checked for each user. Only eligible users will receive certificates.</p>
          </CardContent>
        </Card>
      </div>

      {/* Awards */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <IconAward className="size-5" /> Awards
          </CardTitle>
          <CardDescription>Merit-based certificate awards</CardDescription>
        </CardHeader>
        <CardContent>
          {awards.length === 0 ? (
            <p className="text-sm text-muted-foreground">No awards configured.</p>
          ) : (
            <div className="space-y-2">
              {awards.map((award) => (
                <div key={award.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{award.name}</p>
                    <p className="text-xs text-muted-foreground">{award.description}</p>
                  </div>
                  <BadgeUI variant="outline">{award.is_active ? "Active" : "Inactive"}</BadgeUI>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
