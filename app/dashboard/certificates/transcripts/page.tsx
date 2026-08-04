"use client"

import { useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { certificateApi } from "@/lib/services"
import type { Transcript } from "@/lib/types"
import { IconFileText, IconDownload } from "@tabler/icons-react"

export default function TranscriptsPage() {
  const [studentId, setStudentId] = useState("")
  const [academicYear, setAcademicYear] = useState("")
  const [transcript, setTranscript] = useState<Transcript | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function generateTranscript() {
    if (!studentId) return
    setLoading(true)
    setError("")
    try {
      const res = await certificateApi.generateTranscript({
        student_id: studentId,
        academic_year: academicYear || undefined,
      })
      setTranscript(res.data.data)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: { message?: string } } } }
      setError(e?.response?.data?.error?.message || "Failed to generate transcript")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Certificates", href: "/dashboard/certificates" }, { title: "Transcripts" }]}>
      <h1 className="text-2xl font-bold tracking-tight">Transcripts</h1>
      <p className="text-sm text-muted-foreground mt-1">Generate a Statement of Results from the gradebook.</p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Generate Transcript</CardTitle>
          <CardDescription>Enter student details to pull grades from the gradebook</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Student ID</label>
              <input
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Enter student UUID"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Academic Year (optional)</label>
              <input
                className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                placeholder="e.g. 2025/2026"
              />
            </div>
          </div>
          <Button onClick={generateTranscript} disabled={!studentId || loading}>
            {loading ? "Generating..." : "Generate Transcript"}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {transcript && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Statement of Results</CardTitle>
                <CardDescription>{transcript.student.name} · {transcript.student.email}</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5">
                <IconDownload className="size-4" /> Download PDF
              </Button>
            </div>
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
                      {transcript.total_courses} courses · Generated {new Date(transcript.generated_at).toLocaleDateString()}
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
