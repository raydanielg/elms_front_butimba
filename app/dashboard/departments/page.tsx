"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import api from "@/lib/api"
import type { Department } from "@/lib/types"
import { IconBuildingBank } from "@tabler/icons-react"

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      try {
        const res = await api.get("/departments")
        setDepartments(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetch()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Academic", href: "/dashboard/programs" }, { title: "Departments" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Departments</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage academic departments</p>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>HOD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                </TableRow>
              )) : departments.map(d => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono font-medium">{d.code}</TableCell>
                  <TableCell>{d.name}</TableCell>
                  <TableCell className="text-muted-foreground">{d.hod_id || "Not assigned"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && departments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconBuildingBank className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No departments found</p>
        </div>
      )}
    </DashboardShell>
  )
}
