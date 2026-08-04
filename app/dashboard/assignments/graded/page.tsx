"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { IconClipboardList } from "@tabler/icons-react"

export default function GradedAssignmentsPage() {
  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Assignments", href: "/dashboard/assignments" }, { title: "Graded" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Graded Assignments</h1>
        <p className="text-sm text-muted-foreground mt-1">Assignments that have been graded</p>
      </div>
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <IconClipboardList className="size-12 text-muted-foreground/50" />
        <p className="mt-4 text-sm text-muted-foreground">No graded assignments yet</p>
      </div>
    </DashboardShell>
  )
}
