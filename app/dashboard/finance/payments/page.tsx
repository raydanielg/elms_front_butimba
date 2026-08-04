"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { financeApi } from "@/lib/services"
import { IconCash, IconCheck } from "@tabler/icons-react"

type Payment = {
  id: string
  student_id: string
  fee_item: string
  amount: number
  control_number?: string
  status: string
  student?: { full_name: string; email: string }
  created_at: string
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPayments() }, [])

  async function fetchPayments() {
    try {
      const res = await financeApi.getPayments()
      setPayments(res.data.data || [])
    } catch { } finally { setLoading(false) }
  }

  async function verify(id: string) {
    try {
      await financeApi.verifyPayment(id)
      fetchPayments()
    } catch { }
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Finance", href: "/dashboard/finance" }, { title: "Payments" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
        <p className="text-sm text-muted-foreground mt-1">Verify and manage student payments</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Fee Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Control #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                </TableRow>
              )) : payments.map(p => (
                <TableRow key={p.id}>
                  <TableCell>
                    <p className="font-medium">{p.student?.full_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{p.student?.email}</p>
                  </TableCell>
                  <TableCell>{p.fee_item}</TableCell>
                  <TableCell className="font-medium">TSh {p.amount?.toLocaleString()}</TableCell>
                  <TableCell className="font-mono text-xs">{p.control_number || "—"}</TableCell>
                  <TableCell><Badge variant={p.status === "CONFIRMED" ? "default" : "secondary"}>{p.status}</Badge></TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {p.status === "PENDING" && (
                      <Button size="sm" variant="outline" onClick={() => verify(p.id)}>
                        <IconCheck className="size-3.5" /> Verify
                      </Button>
                    )}
                  </TableCell>
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
