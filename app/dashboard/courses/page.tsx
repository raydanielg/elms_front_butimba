"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { coursesApi } from "@/lib/services"
import type { Course } from "@/lib/types"
import { IconBook2, IconSearch, IconSchool, IconPlus, IconEdit, IconTrash, IconEye } from "@tabler/icons-react"

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Course | null>(null)

  useEffect(() => { fetchCourses() }, [])

  async function fetchCourses() {
    try {
      const res = await coursesApi.list()
      setCourses(res.data.data || [])
    } catch { } finally { setLoading(false) }
  }

  async function deleteCourse(id: string) {
    if (!confirm("Are you sure you want to delete this course?")) return
    try {
      await coursesApi.delete(id)
      fetchCourses()
    } catch { }
  }

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.code.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Courses" }]}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all courses across programs</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger render={<Button size="sm"><IconPlus className="size-4" /> New Course</Button>} />
          <DialogContent className="max-w-lg">
            <DialogHeader><DialogTitle>{editing ? "Edit Course" : "Create Course"}</DialogTitle></DialogHeader>
            <CourseForm course={editing} onSubmit={async (data) => {
              try {
                if (editing) await coursesApi.update(editing.id, data)
                else await coursesApi.create(data)
                setOpen(false)
                setEditing(null)
                fetchCourses()
              } catch { }
            }} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))
          : filtered.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Link href={`/dashboard/courses/${course.id}`} className="flex items-center gap-2">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                        <IconBook2 className="size-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base hover:underline">{course.title}</CardTitle>
                        <p className="text-xs text-muted-foreground">{course.code}</p>
                      </div>
                    </Link>
                    <Badge variant={course.is_active ? "default" : "secondary"}>
                      {course.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {course.description || "No description available"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1">
                      <IconSchool className="size-3.5" />
                      Year {course.year} · Sem {course.semester}
                    </span>
                    <span>{course.credits} credits</span>
                  </div>
                  {course.tutors && course.tutors.length > 0 && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span>Tutors:</span>
                      {course.tutors.map(t => (
                        <Badge key={t.id} variant="outline" className="text-xs">
                          {t.full_name}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 flex items-center gap-2">
                    <Link href={`/dashboard/courses/${course.id}`}>
                      <Button size="sm" variant="outline">
                        <IconEye className="size-3.5" /> View
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(course); setOpen(true) }}>
                      <IconEdit className="size-3.5" /> Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => deleteCourse(course.id)}>
                      <IconTrash className="size-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconBook2 className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">No courses found</p>
        </div>
      )}
    </DashboardShell>
  )
}

function CourseForm({ course, onSubmit }: { course: Course | null; onSubmit: (data: Record<string, unknown>) => void }) {
  const [code, setCode] = useState(course?.code || "")
  const [title, setTitle] = useState(course?.title || "")
  const [description, setDescription] = useState(course?.description || "")
  const [year, setYear] = useState(course?.year?.toString() || "1")
  const [semester, setSemester] = useState(course?.semester || "1")
  const [credits, setCredits] = useState(course?.credits?.toString() || "3")
  const [programId, setProgramId] = useState(course?.program_id || "")
  const [isActive, setIsActive] = useState(course?.is_active ?? true)

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ code, title, description, year: parseInt(year), semester, credits: parseInt(credits), program_id: programId, is_active: isActive }) }}>
      <FieldGroup>
        <Field><FieldLabel>Code</FieldLabel><Input value={code} onChange={e => setCode(e.target.value)} required placeholder="EDU101" /></Field>
        <Field><FieldLabel>Title</FieldLabel><Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Educational Psychology" /></Field>
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
        <Field>
          <FieldLabel>Status</FieldLabel>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={isActive ? "active" : "inactive"} onChange={e => setIsActive(e.target.value === "active")}>
            <option value="active">Active</option><option value="inactive">Inactive</option>
          </select>
        </Field>
        <Button type="submit" className="w-full">{course ? "Update Course" : "Create Course"}</Button>
      </FieldGroup>
    </form>
  )
}
