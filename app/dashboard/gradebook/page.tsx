"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { gradebookApi } from "@/lib/services"
import { getUser } from "@/lib/auth"
import type { StudentGrade } from "@/lib/types"
import { IconChartBar, IconDownload } from "@tabler/icons-react"

export default function GradebookPage() {
  const [grades, setGrades] = useState<StudentGrade[]>([])
  const [loading, setLoading] = useState(true)
  const user = getUser()
  const isStudent = user?.role === "STUDENT"

  // For students, show their grades across courses (simplified — uses first course for demo)
  // For tutors/admins, would need course selection
  const [courseId, setCourseId] = useState("")

  useEffect(() => {
    async function fetchGrades() {
      if (!courseId) return
      try {
        if (isStudent) {
          const res = await gradebookApi.myGrades(courseId)
          setGrades(res.data.data || [])
        }
      } catch { } finally { setLoading(false) }
    }
    if (courseId) fetchGrades()
    else setLoading(false)
  }, [courseId, isStudent])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Gradebook" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gradebook</h1>
        {!isStudent && courseId && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={async () => {
            try { await gradebookApi.exportCsv(courseId) } catch { }
          }}>
            <IconDownload className="size-4" /> Export CSV
          </Button>
        )}
      </div>

      {isStudent && (
        <Card>
          <CardContent className="py-4">
            <label className="text-sm font-medium">Select Course</label>
            <input
              className="mt-1 w-full max-w-md rounded-md border bg-background px-3 py-2 text-sm"
              placeholder="Enter course ID"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
            />
          </CardContent>
        </Card>
      )}

      {courseId && loading ? (
        <Skeleton className="h-64 w-full" />
      ) : courseId && grades.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">My Grades</CardTitle>
            <CardDescription>Current grades for this course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Item</th>
                    <th className="pb-2 font-medium text-right">Grade</th>
                    <th className="pb-2 font-medium text-right">Max</th>
                    <th className="pb-2 font-medium text-right">%</th>
                    <th className="pb-2 font-medium">Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.map((g, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2">{g.item.itemname || g.item.itemtype}</td>
                      <td className="py-2 text-right font-medium">{g.grade?.finalgrade ?? "—"}</td>
                      <td className="py-2 text-right text-muted-foreground">{g.item.grademax}</td>
                      <td className="py-2 text-right">
                        {g.percentage != null ? (
                          <BadgeUI variant={g.percentage >= 50 ? "default" : "destructive"}>
                            {g.percentage.toFixed(1)}%
                          </BadgeUI>
                        ) : "—"}
                      </td>
                      <td className="py-2 text-xs text-muted-foreground">{g.grade?.feedback || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : courseId ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <IconChartBar className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No grades available for this course.</p>
          </CardContent>
        </Card>
      ) : null}
    </DashboardShell>
  )
}
