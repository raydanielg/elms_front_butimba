"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { financeApi } from "@/lib/services"
import { IconCash } from "@tabler/icons-react"

type Debt = {
  id: string
  student_id: string
  amount_due: number
  amount_paid: number
  balance: number
  status: string
  student?: { full_name: string; email: string }
}

export default function DebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await financeApi.getDebts()
        setDebts(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Finance", href: "/dashboard/finance" }, { title: "Debts" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Debts</h1>
        <p className="text-sm text-muted-foreground mt-1">Track outstanding student debts</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Amount Due</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                </TableRow>
              )) : debts.map(d => (
                <TableRow key={d.id}>
                  <TableCell>
                    <p className="font-medium">{d.student?.full_name || "—"}</p>
                    <p className="text-xs text-muted-foreground">{d.student?.email}</p>
                  </TableCell>
                  <TableCell className="font-medium">TSh {d.amount_due?.toLocaleString()}</TableCell>
                  <TableCell>TSh {d.amount_paid?.toLocaleString()}</TableCell>
                  <TableCell className="font-medium text-destructive">TSh {d.balance?.toLocaleString()}</TableCell>
                  <TableCell><Badge variant={d.status === "CLEARED" ? "default" : "destructive"}>{d.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && debts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconCash className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No debts found</p>
        </div>
      )}
    </DashboardShell>
  )
}
