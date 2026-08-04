"use client"

import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { WidgetCard, StatusBadge, EmptyState } from "./shared"
import {
  IconClipboardCheck, IconUpload, IconFileText, IconBell,
  IconMessage2, IconUserPlus, IconCheck, IconClock, IconX,
} from "@tabler/icons-react"

export function ApplicantDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const statsRes = await dashboardApi.stats()
        setStats(statsRes.data.data)
      } catch { } finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  if (loading) {
    return <Skeleton className="h-64 w-full" />
  }

  const status = stats?.application_status || "NOT_SUBMITTED"
  const checklist = [
    { label: "Application Form", done: status !== "NOT_SUBMITTED", icon: <IconClipboardCheck className="size-5" /> },
    { label: "Pay Slip Uploaded", done: !!stats?.has_pay_slip, icon: <IconUpload className="size-5" /> },
    { label: "Fee Confirmed", done: status === "ACCEPTED", icon: <IconCheck className="size-5" /> },
  ]

  return (
    <>
      {/* Status Card */}
      <WidgetCard title="Application Status" description="Your current application">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              {status === "ACCEPTED" ? (
                <div className="flex size-12 items-center justify-center rounded-full bg-green-50">
                  <IconCheck className="size-6 text-green-600" />
                </div>
              ) : status === "REJECTED" ? (
                <div className="flex size-12 items-center justify-center rounded-full bg-red-50">
                  <IconX className="size-6 text-red-600" />
                </div>
              ) : (
                <div className="flex size-12 items-center justify-center rounded-full bg-orange-50">
                  <IconClock className="size-6 text-orange-600" />
                </div>
              )}
              <div>
                <p className="text-lg font-bold">{status.replace(/_/g, " ")}</p>
                <p className="text-sm text-muted-foreground">
                  {stats?.program_applied ? `Program: ${stats.program_applied}` : "No program selected"}
                  {stats?.mode_applied ? ` · Mode: ${stats.mode_applied}` : ""}
                </p>
              </div>
            </div>
          </div>
          <StatusBadge status={status} />
        </div>
      </WidgetCard>

      {/* Application Checklist */}
      <WidgetCard title="Application Checklist" description="Complete each step">
        <div className="space-y-2">
          {checklist.map((item) => (
            <div key={item.label} className="flex items-center gap-3 rounded-lg border p-3">
              <div className={`flex size-9 items-center justify-center rounded-lg ${item.done ? "bg-green-50" : "bg-muted"}`}>
                {item.done ? <IconCheck className="size-5 text-green-600" /> : item.icon}
              </div>
              <span className={`text-sm font-medium ${item.done ? "text-muted-foreground line-through" : ""}`}>{item.label}</span>
              {item.done && <span className="ml-auto text-xs text-green-600">Done</span>}
            </div>
          ))}
        </div>
      </WidgetCard>

      {/* Next Steps */}
      <WidgetCard title="Next Steps" description="What to do next">
        {status === "ACCEPTED" ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <p className="text-sm font-medium text-green-700">Congratulations! Your application has been accepted.</p>
            <p className="mt-1 text-sm text-green-600">Pay the admission fee to activate your student login.</p>
            <a href="/dashboard/my-finance" className="mt-2 inline-block text-sm text-primary hover:underline">Pay now →</a>
          </div>
        ) : status === "REJECTED" ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-sm font-medium text-red-700">Your application was not successful.</p>
            <p className="mt-1 text-sm text-red-600">You may reapply for a different program.</p>
            <a href="/dashboard/applications" className="mt-2 inline-block text-sm text-primary hover:underline">Reapply →</a>
          </div>
        ) : status === "SUBMITTED" || status === "UNDER_REVIEW" ? (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
            <p className="text-sm font-medium text-orange-700">Your application is under review.</p>
            <p className="mt-1 text-sm text-orange-600">Expected timeline: 3-5 business days. You will be notified by email.</p>
          </div>
        ) : (
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm font-medium text-blue-700">Complete your application to get started.</p>
            <a href="/dashboard/applications" className="mt-2 inline-block text-sm text-primary hover:underline">Start application →</a>
          </div>
        )}
      </WidgetCard>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <WidgetCard title="Notifications" description="Status updates">
          <a href="/dashboard/announcements" className="text-sm text-primary hover:underline">View notifications →</a>
        </WidgetCard>
        <WidgetCard title="Contact Admissions" description="Questions about your application">
          <a href="/dashboard/messages" className="text-sm text-primary hover:underline">Send message →</a>
        </WidgetCard>
      </div>
    </>
  )
}
