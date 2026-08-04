"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { financeApi } from "@/lib/services"
import { IconClipboardCheck } from "@tabler/icons-react"

type Result = {
  id: string
  course_id: string
  ca_marks: number
  exam_marks: number
  total_marks: number
  grade: string
  status: string
  course?: { code: string; title: string }
}

export default function MyResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await financeApi.myResults()
        setResults(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  const gradeColor = (g: string) => {
    if (g?.startsWith("A")) return "default"
    if (g?.startsWith("B")) return "default"
    if (g?.startsWith("C")) return "secondary"
    return "destructive"
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "My Results" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Results</h1>
        <p className="text-sm text-muted-foreground mt-1">View your academic results</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>CA Marks</TableHead>
                <TableHead>Exam Marks</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              )) : results.map(r => (
                <TableRow key={r.id}>
                  <TableCell>
                    <p className="font-medium">{r.course?.title || "—"}</p>
                    <p className="text-xs text-muted-foreground">{r.course?.code}</p>
                  </TableCell>
                  <TableCell>{r.ca_marks ?? "—"}</TableCell>
                  <TableCell>{r.exam_marks ?? "—"}</TableCell>
                  <TableCell className="font-medium">{r.total_marks ?? "—"}</TableCell>
                  <TableCell><Badge variant={gradeColor(r.grade)}>{r.grade || "—"}</Badge></TableCell>
                  <TableCell><Badge variant={r.status === "PASS" ? "default" : "destructive"}>{r.status}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconClipboardCheck className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No results available yet</p>
        </div>
      )}
    </DashboardShell>
  )
}
