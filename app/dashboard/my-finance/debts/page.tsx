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
  amount_due: number
  amount_paid: number
  balance: number
  status: string
}

export default function MyDebtsPage() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await financeApi.myDebts()
        setDebts(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const totalBalance = debts.reduce((sum, d) => sum + (d.balance || 0), 0)

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Finance", href: "/dashboard/my-finance" }, { title: "My Debts" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Debts</h1>
        <p className="text-sm text-muted-foreground mt-1">Your outstanding debts</p>
      </div>

      {totalBalance > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Outstanding Balance</p>
              <p className="text-2xl font-bold text-destructive">TSh {totalBalance.toLocaleString()}</p>
            </div>
            <IconCash className="size-10 text-destructive/50" />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount Due</TableHead>
                <TableHead>Amount Paid</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 2 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                </TableRow>
              )) : debts.map(d => (
                <TableRow key={d.id}>
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
          <p className="mt-4 text-sm text-muted-foreground">No debts found — you're all clear!</p>
        </div>
      )}
    </DashboardShell>
  )
}
