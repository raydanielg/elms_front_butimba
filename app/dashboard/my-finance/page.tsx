"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { financeApi } from "@/lib/services"
import { IconCash, IconArrowRight, IconCheck, IconAlertTriangle } from "@tabler/icons-react"

type Payment = { id: string; fee_item: string; amount: number; control_number?: string; status: string; created_at: string }
type Debt = { id: string; amount_due: number; amount_paid: number; balance: number; status: string; fee_item?: string }

export default function MyFinancePage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const [payRes, debtRes] = await Promise.allSettled([financeApi.myPayments(), financeApi.myDebts()])
        if (payRes.status === "fulfilled") setPayments(payRes.value.data.data || [])
        if (debtRes.status === "fulfilled") setDebts(debtRes.value.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const totalPaid = payments.filter(p => p.status === "CONFIRMED").reduce((s, p) => s + (p.amount || 0), 0)
  const totalDebt = debts.reduce((s, d) => s + (d.balance || 0), 0)

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Finance" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Finance</h1>
        <p className="text-sm text-muted-foreground mt-1">View your payments and debts</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 text-green-600"><IconCheck className="size-5" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-28" /> : <p className="text-2xl font-bold text-green-600">TSh {totalPaid.toLocaleString()}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Debts</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600"><IconAlertTriangle className="size-5" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-28" /> : <p className={`text-2xl font-bold ${totalDebt > 0 ? "text-red-600" : "text-green-600"}`}>TSh {totalDebt.toLocaleString()}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Payments Count</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600"><IconCash className="size-5" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-16" /> : <p className="text-2xl font-bold">{payments.length}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Recent payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Payments</CardTitle>
            <Link href="/dashboard/my-finance/payments">
              <Button variant="ghost" size="sm" className="gap-1">View all <IconArrowRight className="size-3.5" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />) :
           payments.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{p.fee_item}</p>
                <p className="text-xs text-muted-foreground">{p.control_number || "—"} · {new Date(p.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">TSh {p.amount?.toLocaleString()}</span>
                <Badge variant={p.status === "CONFIRMED" ? "default" : "secondary"}>{p.status}</Badge>
              </div>
            </div>
          ))}
          {!loading && payments.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No payments yet</p>}
        </CardContent>
      </Card>

      {/* Debts summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Outstanding Debts</CardTitle>
            <Link href="/dashboard/my-finance/debts">
              <Button variant="ghost" size="sm" className="gap-1">View all <IconArrowRight className="size-3.5" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />) :
           debts.slice(0, 5).map(d => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{d.fee_item || "Fee Item"}</p>
                <p className="text-xs text-muted-foreground">Due: TSh {d.amount_due?.toLocaleString()}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-red-600">TSh {d.balance?.toLocaleString()}</span>
                <Badge variant={d.status === "CLEARED" ? "default" : "destructive"}>{d.status}</Badge>
              </div>
            </div>
          ))}
          {!loading && debts.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No outstanding debts — you&apos;re all clear!</p>}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
