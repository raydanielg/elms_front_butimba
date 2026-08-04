"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { coursesApi, lmsApi } from "@/lib/services"
import type { Course } from "@/lib/types"
import { IconClipboardList, IconClock, IconUpload, IconCheck, IconEye, IconCalendar, IconUserCircle } from "@tabler/icons-react"

type Assignment = {
  id: string
  title: string
  description?: string
  due_date: string
  total_marks: number
  course_id: string
  submissions?: { id: string; status: string; marks?: number }[]
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [detailSheet, setDetailSheet] = useState(false)
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)

  function viewAssignment(a: Assignment) { setSelectedAssignment(a); setDetailSheet(true) }

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await coursesApi.myCourses()
        const myCourses: Course[] = res.data.data || []

        const allAssignments: Assignment[] = []
        for (const c of myCourses) {
          try {
            const topicsRes = await lmsApi.getTopics(c.id)
            const topics = topicsRes.data.data || []
            for (const t of topics) {
              try {
                const matsRes = await lmsApi.getMaterials(t.id)
                const mats = matsRes.data.data || []
                for (const m of mats) {
                  if (m.type === "ASSIGNMENT") {
                    allAssignments.push({ ...m, course_id: c.id })
                  }
                }
              } catch { }
            }
          } catch { }
        }
        setAssignments(allAssignments)
      } catch { } finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const now = new Date()
  const pending = assignments.filter(a => {
    const sub = a.submissions?.[0]
    return !sub && new Date(a.due_date) > now
  })
  const submitted = assignments.filter(a => {
    const sub = a.submissions?.[0]
    return sub && sub.status === "SUBMITTED"
  })
  const graded = assignments.filter(a => {
    const sub = a.submissions?.[0]
    return sub && sub.status === "GRADED"
  })

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Assignments" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
        <p className="text-sm text-muted-foreground mt-1">View and manage your assignments</p>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="submitted">Submitted ({submitted.length})</TabsTrigger>
          <TabsTrigger value="graded">Graded ({graded.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-4">
          <AssignmentList loading={loading} assignments={pending} emptyText="No pending assignments" onView={viewAssignment} />
        </TabsContent>
        <TabsContent value="submitted" className="mt-4">
          <AssignmentList loading={loading} assignments={submitted} emptyText="No submitted assignments" onView={viewAssignment} />
        </TabsContent>
        <TabsContent value="graded" className="mt-4">
          <AssignmentList loading={loading} assignments={graded} emptyText="No graded assignments" onView={viewAssignment} />
        </TabsContent>
      </Tabs>

      {/* Assignment Detail Sheet */}
      <Sheet open={detailSheet} onOpenChange={setDetailSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          {selectedAssignment && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><IconClipboardList className="size-5" /> Assignment Details</SheetTitle>
                <SheetDescription>{selectedAssignment.title}</SheetDescription>
              </SheetHeader>
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="flex size-14 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <IconClipboardList className="size-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedAssignment.title}</h3>
                    <Badge variant="outline" className="mt-1">{selectedAssignment.total_marks} marks</Badge>
                  </div>
                </div>
                {selectedAssignment.description && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                    <p className="text-sm">{selectedAssignment.description}</p>
                  </div>
                )}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Details</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><IconClock className="size-4" />Due Date</span>
                      <span className="font-medium">{new Date(selectedAssignment.due_date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-1"><IconCalendar className="size-4" />Status</span>
                      {selectedAssignment.submissions?.[0] ? (
                        <Badge variant={selectedAssignment.submissions[0].status === "GRADED" ? "default" : "secondary"}>
                          {selectedAssignment.submissions[0].status}
                        </Badge>
                      ) : new Date(selectedAssignment.due_date) < new Date() ? (
                        <Badge variant="destructive">Overdue</Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </div>
                    {selectedAssignment.submissions?.[0]?.status === "GRADED" && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Marks</span>
                        <Badge variant="default">{selectedAssignment.submissions[0].marks}/{selectedAssignment.total_marks}</Badge>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <SheetFooter>
                {!selectedAssignment.submissions?.[0] && (
                  <Button onClick={() => { lmsApi.submitAssignment(selectedAssignment.id, { content: "Submitted via ELMS" }); setDetailSheet(false) }}>
                    <IconUpload className="size-4" /> Submit Assignment
                  </Button>
                )}
                <Button variant="outline" onClick={() => setDetailSheet(false)}>Close</Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}

function AssignmentList({ loading, assignments, emptyText, onView }: { loading: boolean; assignments: Assignment[]; emptyText: string; onView: (a: Assignment) => void }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-5 w-2/3" /><Skeleton className="h-4 w-1/3" /></CardHeader>
            <CardContent><Skeleton className="h-12 w-full" /></CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (assignments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <IconClipboardList className="size-12 text-muted-foreground/50" />
        <p className="mt-4 text-sm text-muted-foreground">{emptyText}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {assignments.map(a => {
        const isOverdue = new Date(a.due_date) < new Date()
        const sub = a.submissions?.[0]
        return (
          <Card key={a.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                    <IconClock className="size-3.5" />
                    Due: {new Date(a.due_date).toLocaleString()}
                    {isOverdue && !sub && <Badge variant="destructive" className="ml-1">Overdue</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{a.total_marks} marks</Badge>
                  {sub?.status === "GRADED" && <Badge variant="default">{sub.marks}/{a.total_marks}</Badge>}
                  {sub?.status === "SUBMITTED" && <Badge variant="secondary">Submitted</Badge>}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {a.description && <p className="text-sm text-muted-foreground mb-3">{a.description}</p>}
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" onClick={() => onView(a)}>
                  <IconEye className="size-3.5" /> View Details
                </Button>
                {!sub && (
                  <Button size="sm" onClick={() => lmsApi.submitAssignment(a.id, { content: "Submitted via ELMS" })}>
                    <IconUpload className="size-4" /> Submit
                  </Button>
                )}
                {sub?.status === "SUBMITTED" && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <IconCheck className="size-4 text-green-600" /> Submitted — awaiting grading
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
