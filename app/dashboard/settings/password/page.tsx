"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { PasswordSettings } from "@/components/settings/password-settings"

export default function PasswordSettingsPage() {
  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Settings", href: "/dashboard/settings" }, { title: "Password" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Password Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Change your account password</p>
      </div>
      <div className="max-w-2xl">
        <PasswordSettings />
      </div>
    </DashboardShell>
  )
}
