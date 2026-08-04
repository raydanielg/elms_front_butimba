"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IconCash } from "@tabler/icons-react"

export default function FinancePage() {
  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Finance" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage fees, payments, and debts</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Fee Structures</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><IconCash className="size-5" /></div>
          </CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">Manage fee structures for all programs</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payments</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 text-green-600"><IconCash className="size-5" /></div>
          </CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">Verify and track student payments</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Debts</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600"><IconCash className="size-5" /></div>
          </CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">Track outstanding student debts</p></CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
