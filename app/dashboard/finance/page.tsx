"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { financeApi } from "@/lib/services"
import { IconCash, IconArrowRight, IconCheck, IconAlertTriangle, IconFileText } from "@tabler/icons-react"

type Payment = { id: string; fee_item: string; amount: number; control_number?: string; status: string; student?: { full_name: string }; created_at: string }
type Debt = { id: string; amount_due: number; amount_paid: number; balance: number; status: string; student?: { full_name: string }; fee_item?: string }
type Fee = { id: string; item: string; amount: number; mode: string; academic_year: string; program?: { name: string } }

export default function FinancePage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [debts, setDebts] = useState<Debt[]>([])
  const [fees, setFees] = useState<Fee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const [payRes, debtRes, feeRes] = await Promise.allSettled([
          financeApi.getPayments(),
          financeApi.getDebts(),
          financeApi.getFees(),
        ])
        if (payRes.status === "fulfilled") setPayments(payRes.value.data.data || [])
        if (debtRes.status === "fulfilled") setDebts(debtRes.value.data.data || [])
        if (feeRes.status === "fulfilled") setFees(feeRes.value.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const totalCollected = payments.filter(p => p.status === "CONFIRMED").reduce((s, p) => s + (p.amount || 0), 0)
  const totalOutstanding = debts.reduce((s, d) => s + (d.balance || 0), 0)
  const pendingPayments = payments.filter(p => p.status !== "CONFIRMED").length

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Finance" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage fees, payments, and debts</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Collected</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-green-50 text-green-600"><IconCheck className="size-5" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-28" /> : <p className="text-2xl font-bold text-green-600">TSh {totalCollected.toLocaleString()}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding Debts</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-red-50 text-red-600"><IconAlertTriangle className="size-5" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-28" /> : <p className="text-2xl font-bold text-red-600">TSh {totalOutstanding.toLocaleString()}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Payments</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-lg bg-orange-50 text-orange-600"><IconCash className="size-5" /></div>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-7 w-16" /> : <p className="text-2xl font-bold">{pendingPayments}</p>}
          </CardContent>
        </Card>
      </div>

      {/* Fee Structures */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Fee Structures</CardTitle>
            <Link href="/dashboard/finance/fees">
              <Button variant="ghost" size="sm" className="gap-1">View all <IconArrowRight className="size-3.5" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />) :
           fees.slice(0, 5).map(f => (
            <div key={f.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{f.item}</p>
                <p className="text-xs text-muted-foreground">{f.program?.name || "—"} · {f.mode} · {f.academic_year}</p>
              </div>
              <span className="text-sm font-medium">TSh {f.amount?.toLocaleString()}</span>
            </div>
          ))}
          {!loading && fees.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No fee structures yet</p>}
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Recent Payments</CardTitle>
            <Link href="/dashboard/finance/payments">
              <Button variant="ghost" size="sm" className="gap-1">View all <IconArrowRight className="size-3.5" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />) :
           payments.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{p.student?.full_name || "Student"}</p>
                <p className="text-xs text-muted-foreground">{p.fee_item} · {p.control_number || "—"}</p>
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

      {/* Outstanding Debts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Outstanding Debts</CardTitle>
            <Link href="/dashboard/finance/debts">
              <Button variant="ghost" size="sm" className="gap-1">View all <IconArrowRight className="size-3.5" /></Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />) :
           debts.slice(0, 5).map(d => (
            <div key={d.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="text-sm font-medium">{d.student?.full_name || "Student"}</p>
                <p className="text-xs text-muted-foreground">{d.fee_item || "Fee Item"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-red-600">TSh {d.balance?.toLocaleString()}</span>
                <Badge variant={d.status === "CLEARED" ? "default" : "destructive"}>{d.status}</Badge>
              </div>
            </div>
          ))}
          {!loading && debts.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No outstanding debts</p>}
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
