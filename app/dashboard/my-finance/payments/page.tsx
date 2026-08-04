"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { financeApi } from "@/lib/services"
import { IconCash } from "@tabler/icons-react"

type Payment = {
  id: string
  fee_item: string
  amount: number
  control_number?: string
  status: string
  created_at: string
}

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await financeApi.myPayments()
        setPayments(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Finance", href: "/dashboard/my-finance" }, { title: "My Payments" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Your payment history</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fee Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Control #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                </TableRow>
              )) : payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{p.fee_item}</TableCell>
                  <TableCell>TSh {p.amount?.toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-xs">{p.control_number || "—"}</TableCell>
                  <TableCell><Badge variant={p.status === "CONFIRMED" ? "default" : "secondary"}>{p.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && payments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconCash className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No payments found</p>
        </div>
      )}
    </DashboardShell>
  )
}
