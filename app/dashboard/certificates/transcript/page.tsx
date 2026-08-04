"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { certificateApi } from "@/lib/services"
import { getUser } from "@/lib/auth"
import type { Transcript } from "@/lib/types"
import { IconFileText, IconDownload } from "@tabler/icons-react"

export default function MyTranscriptPage() {
  const [transcript, setTranscript] = useState<Transcript | null>(null)
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    async function fetchTranscript() {
      if (!user) return
      try {
        const res = await certificateApi.generateTranscript({ student_id: user.id })
        setTranscript(res.data.data)
      } catch { } finally { setLoading(false) }
    }
    fetchTranscript()
  }, [user])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Certificates", href: "/dashboard/certificates" }, { title: "Transcript" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Transcript</h1>
        {transcript && (
          <Button variant="outline" size="sm" className="gap-1.5">
            <IconDownload className="size-4" /> Download PDF
          </Button>
        )}
      </div>

      {loading ? (
        <Skeleton className="h-64 w-full" />
      ) : !transcript || transcript.courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <IconFileText className="size-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">No results available yet.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statement of Results</CardTitle>
            <CardDescription>{transcript.student.name} · {transcript.student.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="pb-2 font-medium">Code</th>
                    <th className="pb-2 font-medium">Course</th>
                    <th className="pb-2 font-medium text-right">CA</th>
                    <th className="pb-2 font-medium text-right">Exam</th>
                    <th className="pb-2 font-medium text-right">Total</th>
                    <th className="pb-2 font-medium">Grade</th>
                    <th className="pb-2 font-medium">Year</th>
                    <th className="pb-2 font-medium">Sem</th>
                  </tr>
                </thead>
                <tbody>
                  {transcript.courses.map((c, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2 font-mono text-xs">{c.course_code}</td>
                      <td className="py-2">{c.course_title}</td>
                      <td className="py-2 text-right">{c.ca_marks}</td>
                      <td className="py-2 text-right">{c.exam_marks}</td>
                      <td className="py-2 text-right font-medium">{c.total}</td>
                      <td className="py-2">{c.grade}</td>
                      <td className="py-2 text-xs">{c.academic_year}</td>
                      <td className="py-2 text-xs">{c.semester}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={4} className="pt-3 text-right font-medium">Average:</td>
                    <td className="pt-3 text-right font-bold">{transcript.average}</td>
                    <td colSpan={3} className="pt-3 text-xs text-muted-foreground">
                      {transcript.total_courses} courses
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  )
}
