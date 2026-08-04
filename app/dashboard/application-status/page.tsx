"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { applicantApi } from "@/lib/services"
import { clearAuth } from "@/lib/auth"
import { AlertCircle, Upload, FileText, CheckCircle2, XCircle, Clock, RefreshCw } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { IconLogout, IconArrowLeft } from "@tabler/icons-react"

type Application = {
  id: string
  status: string
  mode: string
  pay_slip_url?: string
  created_at: string
  program?: { name: string; code: string }
  form_data?: Record<string, unknown>
}

export default function ApplicationStatusPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadingFor, setUploadingFor] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  async function fetchApplications() {
    setLoading(true)
    try {
      const res = await applicantApi.myApplications()
      setApplications(res.data.data || [])
    } catch {
      setError("Failed to load applications.")
    } finally {
      setLoading(false)
    }
  }

  async function handleUploadPaySlip(e: React.ChangeEvent<HTMLInputElement>, appId: string) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadingFor(appId)
    setError(null)

    try {
      const uploadRes = await applicantApi.uploadPaySlip(file)
      const fileId = uploadRes.data?.data?.id || null
      if (fileId) {
        await applicantApi.updatePaySlip(appId, fileId)
        fetchApplications()
      }
    } catch {
      setError("Failed to upload pay slip. Please try again.")
    } finally {
      setUploading(false)
      setUploadingFor(null)
    }
  }

  function statusConfig(status: string) {
    switch (status) {
      case "ACCEPTED":
        return { icon: <CheckCircle2 className="size-6 text-primary" />, label: "Approved", variant: "default" as const, color: "text-primary bg-primary/5" }
      case "REJECTED":
        return { icon: <XCircle className="size-6 text-destructive" />, label: "Rejected", variant: "destructive" as const, color: "text-destructive bg-destructive/5" }
      case "SUBMITTED":
        return { icon: <Clock className="size-6 text-muted-foreground" />, label: "Under Review", variant: "secondary" as const, color: "text-muted-foreground bg-muted" }
      case "UNDER_REVIEW":
        return { icon: <Clock className="size-6 text-muted-foreground" />, label: "Under Review", variant: "secondary" as const, color: "text-muted-foreground bg-muted" }
      default:
        return { icon: <Clock className="size-6 text-muted-foreground" />, label: status, variant: "outline" as const, color: "text-muted-foreground bg-muted" }
    }
  }

  function handleLogout() {
    clearAuth()
    window.location.href = "/auth"
  }

  return (
    <div className="min-h-screen bg-muted/30 bg-wave-pattern">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur dark:bg-card/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Image
              src="/logo/butimbalogo-removebg-preview.png"
              alt="Butimba"
              width={36}
              height={36}
              className="object-contain"
              style={{ width: "auto", height: "36px" }}
              priority
            />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">ELMS</span>
              <span className="text-[10px] text-muted-foreground">Butimba Teachers College</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary dark:text-primary">
              <IconArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to Dashboard</span>
            </Link>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <IconLogout className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 dark:from-primary dark:to-primary/80">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">My Application Status</h1>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-primary-foreground/70">
            <Link href="/dashboard" className="hover:underline">Home</Link>
            <span>/</span>
            <Link href="/dashboard" className="hover:underline">Admissions</Link>
            <span>/</span>
            <span className="font-medium">Track Application</span>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-6">
            <h2 className="mb-2 inline-block border-b-2 border-primary pb-2 text-2xl font-bold text-primary dark:text-primary-foreground">
              Application Status
            </h2>
            <p className="text-sm text-muted-foreground">Track your application progress and upload payment slips</p>
          </div>

          {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="size-4 shrink-0 translate-y-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* No applications */}
      {!loading && applications.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Clock className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">You haven&apos;t submitted any applications yet.</p>
            <Link href="/dashboard/apply" className="mt-4">
              <Button>Apply Now</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Applications list */}
      {loading ? (
        <Card>
          <CardContent className="p-6 space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {applications.map(app => {
            const cfg = statusConfig(app.status)
            return (
              <Card key={app.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Application: {app.program?.name || "Programme"}</CardTitle>
                    <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Status banner */}
                  <div className={`flex items-center gap-3 rounded-lg p-4 ${cfg.color}`}>
                    {cfg.icon}
                    <div>
                      <p className="text-sm font-semibold">
                        {app.status === "ACCEPTED" && "Congratulations! Your application has been approved."}
                        {app.status === "REJECTED" && "Your application was not successful. You may reapply."}
                        {(app.status === "SUBMITTED" || app.status === "UNDER_REVIEW") && "Your application is under review. Expected timeline: 3-5 business days."}
                      </p>
                      <p className="text-xs mt-0.5 opacity-80">
                        Mode: {app.mode} · Submitted: {new Date(app.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Form data summary */}
                  {app.form_data && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Full Name</p>
                        <p className="font-medium">{(app.form_data.full_name as string) || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Gender</p>
                        <p className="font-medium">{(app.form_data.gender as string) || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Phone</p>
                        <p className="font-medium">{(app.form_data.phone as string) || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase">Region</p>
                        <p className="font-medium">{(app.form_data.region as string) || "—"}</p>
                      </div>
                    </div>
                  )}

                  {/* Pay slip section */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium mb-2">Application Fee Payment</p>
                    {app.pay_slip_url ? (
                      <div className="flex items-center gap-2 text-sm text-primary">
                        <FileText className="size-4" />
                        <span>Pay slip uploaded</span>
                        <a href={app.pay_slip_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                          View
                        </a>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground">No pay slip uploaded yet. Application fee: TSh 5,000/=</p>
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <div className="flex items-center gap-2 rounded-lg border border-dashed border-input px-4 py-2.5 hover:bg-muted/50 transition-colors">
                            <Upload className="size-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {uploading && uploadingFor === app.id ? "Uploading..." : "Upload Pay Slip"}
                            </span>
                          </div>
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={e => handleUploadPaySlip(e, app.id)}
                            disabled={uploading}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Next steps */}
                  {app.status === "ACCEPTED" && (
                    <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
                      <p className="text-sm font-medium text-primary">Your application has been approved!</p>
                      <p className="text-sm text-primary">Pay the admission fee to activate your student login.</p>
                      <Link href="/dashboard/my-finance" className="inline-block mt-3">
                        <Button size="sm">Pay Admission Fee</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Refresh button */}
      {!loading && applications.length > 0 && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={fetchApplications}>
            <RefreshCw className="size-4" />
            Refresh Status
          </Button>
        </div>
      )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 dark:border-border dark:bg-card">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-muted-foreground sm:px-6">
          &copy; {new Date().getFullYear()} Butimba Teachers College. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
