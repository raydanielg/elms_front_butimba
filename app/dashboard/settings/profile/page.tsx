"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { ProfileSettings } from "@/components/settings/profile-settings"

export default function ProfileSettingsPage() {
  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Settings", href: "/dashboard/settings" }, { title: "Profile" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Update your personal information</p>
      </div>
      <div className="max-w-2xl">
        <ProfileSettings />
      </div>
    </DashboardShell>
  )
}
