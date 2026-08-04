"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IconCash } from "@tabler/icons-react"

export default function MyFinancePage() {
  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Finance" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Finance</h1>
        <p className="text-sm text-muted-foreground mt-1">View your payments and debts</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Payments</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 text-green-600"><IconCash className="size-5" /></div>
          </CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">View your payment history and status</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">My Debts</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600"><IconCash className="size-5" /></div>
          </CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">Check your outstanding balances</p></CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
