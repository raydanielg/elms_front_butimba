"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { financeApi } from "@/lib/services"
import { IconCash } from "@tabler/icons-react"

type Fee = {
  id: string
  program_id: string
  mode: string
  item: string
  amount: number
  academic_year: string
  program?: { name: string }
}

export default function FeesPage() {
  const [fees, setFees] = useState<Fee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await financeApi.getFees()
        setFees(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Finance", href: "/dashboard/finance" }, { title: "Fee Structures" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Fee Structures</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage tuition and other fees</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Year</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                </TableRow>
              )) : fees.map(f => (
                <TableRow key={f.id}>
                  <TableCell>{f.program?.name || "—"}</TableCell>
                  <TableCell><Badge variant="outline">{f.mode}</Badge></TableCell>
                  <TableCell>{f.item}</TableCell>
                  <TableCell className="font-medium">TSh {f.amount?.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{f.academic_year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && fees.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconCash className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No fee structures found</p>
        </div>
      )}
    </DashboardShell>
  )
}
