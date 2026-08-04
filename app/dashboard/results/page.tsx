"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import api from "@/lib/api"
import { IconClipboardCheck } from "@tabler/icons-react"

type Result = {
  id: string
  student_id: string
  course_id: string
  ca_marks: number
  exam_marks: number
  total_marks: number
  grade: string
  status: string
  student?: { full_name: string }
  course?: { code: string; title: string }
}

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Result | null>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => { fetchResults() }, [])

  async function fetchResults() {
    try {
      const res = await api.get("/results")
      setResults(res.data.data || [])
    } catch { } finally { setLoading(false) }
  }

  async function saveResult(data: Record<string, unknown>) {
    try {
      if (editing) {
        await api.put(`/results/${editing.id}`, data)
      } else {
        await api.post("/results", data)
      }
      setOpen(false)
      setEditing(null)
      fetchResults()
    } catch { }
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Results" }]}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Results</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage student results</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm">Add Result</Button>} />
          <DialogContent>
            <DialogHeader><DialogTitle>{editing ? "Edit Result" : "Add Result"}</DialogTitle></DialogHeader>
            <ResultForm result={editing} onSubmit={saveResult} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>CA</TableHead>
                <TableHead>Exam</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                </TableRow>
              )) : results.map(r => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.student?.full_name || "—"}</TableCell>
                  <TableCell>
                    <p>{r.course?.title || "—"}</p>
                    <p className="text-xs text-muted-foreground">{r.course?.code}</p>
                  </TableCell>
                  <TableCell>{r.ca_marks ?? "—"}</TableCell>
                  <TableCell>{r.exam_marks ?? "—"}</TableCell>
                  <TableCell className="font-medium">{r.total_marks ?? "—"}</TableCell>
                  <TableCell><Badge variant="outline">{r.grade || "—"}</Badge></TableCell>
                  <TableCell><Badge variant={r.status === "PASS" ? "default" : "destructive"}>{r.status}</Badge></TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setOpen(true) }}>Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {!loading && results.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconClipboardCheck className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No results found</p>
        </div>
      )}
    </DashboardShell>
  )
}

function ResultForm({ result, onSubmit }: { result: Result | null; onSubmit: (data: Record<string, unknown>) => void }) {
  const [studentId, setStudentId] = useState(result?.student_id || "")
  const [courseId, setCourseId] = useState(result?.course_id || "")
  const [caMarks, setCaMarks] = useState(result?.ca_marks?.toString() || "")
  const [examMarks, setExamMarks] = useState(result?.exam_marks?.toString() || "")

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ student_id: studentId, course_id: courseId, ca_marks: parseFloat(caMarks), exam_marks: parseFloat(examMarks) }) }}>
      <FieldGroup>
        <Field><FieldLabel>Student ID</FieldLabel><Input value={studentId} onChange={e => setStudentId(e.target.value)} required /></Field>
        <Field><FieldLabel>Course ID</FieldLabel><Input value={courseId} onChange={e => setCourseId(e.target.value)} required /></Field>
        <Field><FieldLabel>CA Marks (0-40)</FieldLabel><Input type="number" step="0.1" min="0" max="40" value={caMarks} onChange={e => setCaMarks(e.target.value)} required /></Field>
        <Field><FieldLabel>Exam Marks (0-60)</FieldLabel><Input type="number" step="0.1" min="0" max="60" value={examMarks} onChange={e => setExamMarks(e.target.value)} required /></Field>
        <Button type="submit" className="w-full">{result ? "Update Result" : "Add Result"}</Button>
      </FieldGroup>
    </form>
  )
}
