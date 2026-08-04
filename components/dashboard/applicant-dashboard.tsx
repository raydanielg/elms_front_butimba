"use client"

import { useEffect, useState } from "react"
import { applicantApi } from "@/lib/services"
import { getUser, clearAuth } from "@/lib/auth"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  IconClipboardCheck, IconUpload, IconCheck, IconClock, IconX,
  IconArrowRight, IconPhone, IconMapPin, IconSchool, IconCash,
  IconCalendarEvent, IconFileText, IconLogout, IconUser,
} from "@tabler/icons-react"

type Application = {
  id: string
  status: string
  mode: string
  pay_slip_url?: string
  created_at: string
  program?: { name: string; code: string }
}

export function ApplicantDashboard() {
  const user = getUser()
  const [apps, setApps] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchApps() {
      try {
        const res = await applicantApi.myApplications()
        setApps(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchApps()
  }, [])

  const hasSubmitted = apps.length > 0
  const latestApp = apps[0]
  const status = latestApp?.status || "NOT_SUBMITTED"

  function handleLogout() {
    clearAuth()
    window.location.href = "/auth"
  }

  const checklist = [
    { label: "Application Form", done: hasSubmitted, icon: <IconClipboardCheck className="size-5" /> },
    { label: "Pay Slip Uploaded", done: !!latestApp?.pay_slip_url, icon: <IconUpload className="size-5" /> },
    { label: "Application Approved", done: status === "ACCEPTED", icon: <IconCheck className="size-5" /> },
  ]

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
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <IconUser className="size-4" />
              <span className="font-medium">{user?.full_name}</span>
              <Badge variant="outline" className="capitalize">Applicant</Badge>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
              <IconLogout className="size-4" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary/80 py-12 dark:from-primary dark:to-primary/80">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6">
          <h1 className="text-2xl font-bold uppercase tracking-wide text-white sm:text-3xl">
            {hasSubmitted ? "Application Status" : "Welcome to Admissions"}
          </h1>
          <p className="mt-2 text-sm text-primary-foreground/80">
            {hasSubmitted
              ? "Track your application progress below"
              : "Complete your application to join Butimba Teachers College"}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-primary-foreground/70">
            <Link href="/dashboard" className="hover:underline">Home</Link>
            <span>/</span>
            <span className="font-medium">Admissions</span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Left: Main Content */}
            <div className="flex-1 space-y-6">
              {loading ? (
                <Card>
                  <CardContent className="p-8 space-y-4">
                    <Skeleton className="h-8 w-64" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-32 w-full" />
                  </CardContent>
                </Card>
              ) : hasSubmitted ? (
                <>
                  {/* Application Status Card */}
                  <Card className="overflow-hidden border-border shadow-sm">
                    {/* Status Alert Bar */}
                    <div className={`px-6 py-3 border-b flex items-center gap-2 ${
                      status === "ACCEPTED" ? "bg-primary/5 border-primary/20 dark:bg-primary/10 dark:border-primary/30"
                      : status === "REJECTED" ? "bg-destructive/5 border-destructive/20 dark:bg-destructive/10 dark:border-destructive/30"
                      : "bg-muted border-border dark:bg-muted/30 dark:border-border"
                    }`}>
                      <span className={`size-2 rounded-full animate-pulse ${
                        status === "ACCEPTED" ? "bg-primary"
                        : status === "REJECTED" ? "bg-destructive"
                        : "bg-muted-foreground"
                      }`} />
                      <p className={`text-[11px] font-bold uppercase tracking-wider ${
                        status === "ACCEPTED" ? "text-primary dark:text-primary"
                        : status === "REJECTED" ? "text-destructive dark:text-destructive"
                        : "text-muted-foreground dark:text-muted-foreground"
                      }`}>
                        {status === "ACCEPTED" && "Application Approved"}
                        {status === "REJECTED" && "Application Rejected"}
                        {(status === "SUBMITTED" || status === "UNDER_REVIEW") && "Application Under Review"}
                      </p>
                    </div>

                    <CardContent className="p-8 sm:p-10">
                      <h2 className="mb-6 inline-block border-b-2 border-primary pb-2 text-xl font-bold text-primary dark:text-primary-foreground">
                        Application Details
                      </h2>

                      {/* Status Banner */}
                      <div className={`mb-8 flex items-center gap-4 rounded-lg p-5 ${
                        status === "ACCEPTED" ? "bg-primary/5 dark:bg-primary/10"
                        : status === "REJECTED" ? "bg-destructive/5 dark:bg-destructive/10"
                        : "bg-muted dark:bg-muted"
                      }`}>
                        {status === "ACCEPTED" ? (
                          <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/20">
                            <IconCheck className="size-7 text-primary" />
                          </div>
                        ) : status === "REJECTED" ? (
                          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10 dark:bg-destructive/20">
                            <IconX className="size-7 text-destructive" />
                          </div>
                        ) : (
                          <div className="flex size-14 items-center justify-center rounded-full bg-muted/50 dark:bg-muted/50">
                            <IconClock className="size-7 text-muted-foreground" />
                          </div>
                        )}
                        <div>
                          <p className="text-base font-bold">
                            {status === "ACCEPTED" && "Congratulations! Your application has been approved."}
                            {status === "REJECTED" && "Your application was not successful."}
                            {(status === "SUBMITTED" || status === "UNDER_REVIEW") && "Your application is under review."}
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {status === "ACCEPTED" && "Pay the admission fee to activate your student account."}
                            {status === "REJECTED" && "You may reapply for a different programme."}
                            {(status === "SUBMITTED" || status === "UNDER_REVIEW") && "Expected timeline: 3-5 business days. You will be notified by email."}
                          </p>
                        </div>
                      </div>

                      {/* Application Info Grid */}
                      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border border-border bg-muted/30 p-4 dark:border-border dark:bg-muted/30">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Programme</p>
                          <p className="mt-1 text-sm font-bold text-primary dark:text-primary-foreground">
                            {latestApp?.program?.name || "—"}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-4 dark:border-border dark:bg-muted/30">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Study Mode</p>
                          <p className="mt-1 text-sm font-bold text-primary dark:text-primary-foreground">
                            {latestApp?.mode === "ODL" ? "Open & Distance Learning" : latestApp?.mode === "DAY" ? "Day" : latestApp?.mode === "BRD" ? "Boarding" : "—"}
                          </p>
                        </div>
                        <div className="rounded-lg border border-border bg-muted/30 p-4 dark:border-border dark:bg-muted/30">
                          <p className="text-[10px] font-bold uppercase text-muted-foreground">Submitted On</p>
                          <p className="mt-1 text-sm font-bold text-primary dark:text-primary-foreground">
                            {latestApp?.created_at ? new Date(latestApp.created_at).toLocaleDateString() : "—"}
                          </p>
                        </div>
                      </div>

                      {/* Checklist */}
                      <div className="mb-8">
                        <h3 className="mb-4 inline-block border-b-2 border-primary pb-2 text-xs font-extrabold uppercase tracking-widest text-primary dark:text-primary/80">
                          Application Checklist
                        </h3>
                        <div className="space-y-2">
                          {checklist.map((item) => (
                            <div key={item.label} className="flex items-center gap-3 rounded-lg border border-border p-3 dark:border-border">
                              <div className={`flex size-9 items-center justify-center rounded-lg ${item.done ? "bg-primary/5 dark:bg-primary/10" : "bg-muted"}`}>
                                {item.done ? <IconCheck className="size-5 text-primary" /> : item.icon}
                              </div>
                              <span className={`text-sm font-medium ${item.done ? "text-muted-foreground line-through" : ""}`}>
                                {item.label}
                              </span>
                              {item.done && <span className="ml-auto text-xs font-bold text-primary">Done</span>}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:justify-center">
                        {status === "ACCEPTED" ? (
                          <Link href="/dashboard/my-finance">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg transition-all">
                              Pay Admission Fee
                              <IconArrowRight className="size-4" />
                            </Button>
                          </Link>
                        ) : status === "REJECTED" ? (
                          <Link href="/dashboard/apply">
                            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg transition-all">
                              Reapply Now
                              <IconArrowRight className="size-4" />
                            </Button>
                          </Link>
                        ) : (
                          <Link href="/dashboard/application-status">
                            <Button size="lg" variant="outline" className="border-2 border-primary text-primary hover:bg-primary/90 font-bold shadow-sm transition-all dark:border-primary dark:text-primary dark:hover:bg-primary/10">
                              <IconFileText className="size-4" />
                              View Full Status
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <>
                  {/* No Application Yet - Show Admissions Info */}
                  <Card className="overflow-hidden border-border shadow-sm">
                    {/* Deadline Alert Bar */}
                    <div className="flex items-center gap-2 border-b border-destructive/20 bg-destructive/5 px-6 py-3 dark:bg-destructive/10 dark:border-destructive/30">
                      <span className="size-2 animate-pulse rounded-full bg-destructive" />
                      <p className="text-[11px] font-bold uppercase tracking-wider text-destructive dark:text-destructive">
                        Deadline: 10th August 2026 / Mwisho: 10 Agosti 2026
                      </p>
                    </div>

                    <CardContent className="p-8 sm:p-10">
                      <h2 className="mb-6 inline-block border-b border-border pb-6 text-xl font-bold uppercase leading-tight text-primary dark:text-primary-foreground">
                        Nafasi za Masomo ya Stashahada ya Ualimu wa Elimu ya Msingi kwa Njia ya Masafa (2026/2027)
                      </h2>

                      {/* Introduction */}
                      <div className="mb-10">
                        <h3 className="mb-4 inline-block border-b-2 border-primary pb-2 text-xs font-extrabold uppercase tracking-widest text-primary dark:text-primary/80">
                          Introduction / Utangulizi
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          Chuo kinatangaza nafasi za Mafunzo ya Ualimu ya Stashahada ya Ualimu Elimu ya Msingi kwa Njia ya Masafa kwa muda wa miaka mitatu (03) kwa Walimu waliohitimu Mafunzo ya Ualimu Ngazi ya Astashahada (Cheti cha Daraja la III A) ya Ualimu wa Elimu ya Awali au Msingi.
                        </p>
                      </div>

                      {/* Details Grid */}
                      <div className="mb-10 grid grid-cols-1 gap-8 md:grid-cols-2">
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-primary dark:text-primary/80">
                            <IconMapPin className="size-4 text-primary" />
                            Service Area / Eneo la Huduma
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Mikoa ya <span className="font-bold">Mwanza, Geita na Simiyu</span>.
                          </p>
                        </div>
                        <div className="space-y-3">
                          <h4 className="flex items-center gap-2 text-xs font-bold uppercase text-primary dark:text-primary/80">
                            <IconSchool className="size-4 text-primary" />
                            Delivery / Uendeshaji
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            Vipindi vya ana kwa ana na teknolojia ya kidijitali (Hybrid).
                          </p>
                        </div>
                      </div>

                      {/* Payment Box */}
                      <div className="mb-10 rounded-lg border border-primary/20 bg-primary/5 p-6 dark:border-primary/30 dark:bg-primary/10">
                        <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase text-primary dark:text-primary">
                          <IconCash className="size-4 text-primary" />
                          Fees &amp; Instructions / Maelekezo ya Ada
                        </h3>
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2 text-sm">
                            <p className="font-medium text-muted-foreground">
                              Application Fee: <span className="font-bold text-primary dark:text-primary/80">5,000/=</span>
                            </p>
                            <div className="rounded border border-primary/20 bg-card p-3 text-[13px] dark:bg-card dark:border-primary/30">
                              <p className="mb-1 font-bold text-primary dark:text-primary">NMB BANK</p>
                              <p className="text-muted-foreground">Acc Name: <span className="font-bold">Butimba Teachers Training College</span></p>
                              <p className="text-muted-foreground">Acc No: <span className="font-bold">31101200023</span></p>
                            </div>
                          </div>
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between border-b border-primary/20 pb-2 dark:border-primary/30">
                              <span className="text-muted-foreground">Tuition Fee / Ada ya Mafunzo</span>
                              <span className="font-bold text-primary dark:text-primary/80">450,000/=</span>
                            </div>
                            <div className="flex justify-between border-b border-primary/20 pb-2 dark:border-primary/30">
                              <span className="text-muted-foreground">Contributions / Michango</span>
                              <span className="font-bold text-primary dark:text-primary/80">150,000/=</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Reporting Dates */}
                      <div className="mb-10">
                        <h3 className="mb-6 inline-block border-b-2 border-primary pb-2 text-xs font-extrabold uppercase tracking-widest text-primary dark:text-primary/80">
                          Reporting Dates / Tarehe za Kuripoti
                        </h3>
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <div className="flex-1 rounded border border-border bg-muted/30 p-4 text-center dark:border-border dark:bg-muted/30">
                            <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">Start / Kuanza</p>
                            <p className="text-base font-bold text-primary dark:text-primary/80">17 August, 2026</p>
                          </div>
                          <div className="flex-1 rounded border border-border bg-muted/30 p-4 text-center dark:border-border dark:bg-muted/30">
                            <p className="mb-1 text-[10px] font-bold uppercase text-muted-foreground">Deadline / Mwisho</p>
                            <p className="text-base font-bold text-destructive dark:text-destructive">30 August, 2026</p>
                          </div>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row">
                        <Link href="/dashboard/apply">
                          <Button size="lg" className="bg-primary px-10 py-3.5 text-base font-bold text-white shadow-lg transition-all hover:bg-primary/90 group">
                            Apply for this Programme
                            <IconArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>

            {/* Right: Sidebar */}
            <div className="w-full space-y-6 lg:w-80">
              {/* Quick Contact */}
              <div className="rounded-lg border border-border bg-muted/30 p-6 shadow-sm dark:border-border dark:bg-muted/30">
                <h3 className="mb-4 border-b border-border pb-2 font-bold text-primary dark:border-border dark:text-primary/80">
                  Need Help? / Msaada?
                </h3>
                <div className="space-y-4">
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    Call the Registrar&apos;s office for admission support.
                  </p>
                  <div className="space-y-3">
                    <a href="tel:0689363690" className="flex items-center gap-3 text-sm font-bold text-foreground transition-colors hover:text-primary dark:text-muted-foreground dark:hover:text-primary/80">
                      <IconPhone className="size-4 text-primary" />
                      <span>0689 363 690</span>
                    </a>
                    <a href="tel:0653144677" className="flex items-center gap-3 text-sm font-bold text-foreground transition-colors hover:text-primary dark:text-muted-foreground dark:hover:text-primary/80">
                      <IconPhone className="size-4 text-primary" />
                      <span>0653 144 677</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Track Application */}
              <div className="rounded-lg border-2 border-primary/20 bg-card p-6 shadow-sm dark:border-primary dark:bg-card">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                    <IconFileText className="size-5" />
                  </div>
                  <h4 className="font-bold text-primary dark:text-primary/80">Track Application</h4>
                </div>
                <p className="mb-4 text-[13px] leading-relaxed text-muted-foreground">
                  Already applied? Check your application status and upload payment slips.
                </p>
                <Link href="/dashboard/application-status" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary transition-colors hover:text-primary dark:text-primary dark:hover:text-primary/80">
                  Track Now <IconArrowRight className="size-3" />
                </Link>
              </div>

              {/* OAS Portal Card */}
              <div className="rounded-lg bg-primary p-6 text-white shadow-lg dark:bg-primary/10">
                <h4 className="mb-3 text-lg font-bold">Online Application</h4>
                <p className="mb-4 text-[13px] leading-relaxed text-primary-foreground/80">
                  Register for an account on our OAS platform to start your journey.
                </p>
                <Link href="/dashboard/apply" className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-primary-foreground transition-colors hover:text-primary-foreground/80">
                  Go to Portal <IconArrowRight className="size-3" />
                </Link>
              </div>

              {/* Important Dates */}
              <div className="rounded-lg border border-border bg-card p-6 shadow-sm dark:border-border dark:bg-card">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary">
                    <IconCalendarEvent className="size-5" />
                  </div>
                  <h4 className="font-bold text-primary dark:text-primary/80">Important Dates</h4>
                </div>
                <div className="space-y-3 text-[13px]">
                  <div className="flex justify-between border-b border-border pb-2 dark:border-border">
                    <span className="text-muted-foreground">Application Deadline</span>
                    <span className="font-bold text-destructive dark:text-destructive">10 Aug 2026</span>
                  </div>
                  <div className="flex justify-between border-b border-border pb-2 dark:border-border">
                    <span className="text-muted-foreground">Reporting Start</span>
                    <span className="font-bold text-primary dark:text-primary/80">17 Aug 2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Reporting End</span>
                    <span className="font-bold text-primary dark:text-primary/80">30 Aug 2026</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
