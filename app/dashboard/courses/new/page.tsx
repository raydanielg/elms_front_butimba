"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { coursesApi } from "@/lib/services"
import { IconBook2 } from "@tabler/icons-react"

export default function NewCoursePage() {
  const router = useRouter()
  const [code, setCode] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [year, setYear] = useState("1")
  const [semester, setSemester] = useState("1")
  const [credits, setCredits] = useState("3")
  const [programId, setProgramId] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await coursesApi.create({
        code, title, description,
        year: parseInt(year),
        semester,
        credits: parseInt(credits),
        program_id: programId,
        is_active: true,
      })
      router.push("/dashboard/courses")
    } catch { }
  }

  return (
    <DashboardShell breadcrumbs={[
      { title: "Dashboard", href: "/dashboard" },
      { title: "Courses", href: "/dashboard/courses" },
      { title: "New Course" },
    ]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Create New Course</h1>
        <p className="text-sm text-muted-foreground mt-1">Add a new course to the system</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
              <IconBook2 className="size-5 text-primary" />
            </div>
            <CardTitle className="text-base">Course Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field><FieldLabel>Course Code</FieldLabel><Input value={code} onChange={e => setCode(e.target.value)} required placeholder="EDU101" /></Field>
              <Field><FieldLabel>Course Title</FieldLabel><Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Educational Psychology" /></Field>
              <Field><FieldLabel>Description</FieldLabel><Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Course description..." /></Field>
              <div className="grid grid-cols-3 gap-3">
                <Field><FieldLabel>Year</FieldLabel>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={year} onChange={e => setYear(e.target.value)}>
                    <option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option>
                  </select>
                </Field>
                <Field><FieldLabel>Semester</FieldLabel>
                  <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={semester} onChange={e => setSemester(e.target.value)}>
                    <option value="1">Sem 1</option><option value="2">Sem 2</option>
                  </select>
                </Field>
                <Field><FieldLabel>Credits</FieldLabel><Input type="number" value={credits} onChange={e => setCredits(e.target.value)} required /></Field>
              </div>
              <Field><FieldLabel>Program ID</FieldLabel><Input value={programId} onChange={e => setProgramId(e.target.value)} placeholder="Program UUID" /></Field>
              <div className="flex gap-2">
                <Button type="submit">Create Course</Button>
                <Button type="button" variant="outline" onClick={() => router.push("/dashboard/courses")}>Cancel</Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
