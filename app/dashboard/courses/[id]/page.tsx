"use client"

import { useEffect, useState, use } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { coursesApi, lmsApi } from "@/lib/services"
import api from "@/lib/api"
import type { Course, Topic, User } from "@/lib/types"
import {
  IconBook2, IconSchool, IconClipboardList, IconUsers, IconVideo,
  IconPlus, IconChevronDown, IconChevronRight, IconFileText, IconBell,
  IconLink, IconEye, IconMail, IconPhone, IconCalendar, IconClock,
  IconCheck, IconX, IconUserCircle,
} from "@tabler/icons-react"

type Material = {
  id: string; topic_id: string; type: string; title: string
  file_url?: string; due_date?: string; total_marks?: number; description?: string
}
type OnlineClass = { id: string; title: string; platform: string; meeting_link: string; scheduled_at: string; status: string }
type Announcement = { id: string; title: string; body: string; is_pinned: boolean; created_at: string }
type StudentDetail = User & { pivot?: { status: string; enrolled_at: string }; email_verified_at?: string }

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [course, setCourse] = useState<Course | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])
  const [students, setStudents] = useState<User[]>([])
  const [tutors, setTutors] = useState<User[]>([])
  const [onlineClasses, setOnlineClasses] = useState<OnlineClass[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null)
  const [topicMaterials, setTopicMaterials] = useState<Record<string, Material[]>>({})
  const [topicSheet, setTopicSheet] = useState(false)
  const [materialSheet, setMaterialSheet] = useState(false)
  const [assignmentSheet, setAssignmentSheet] = useState(false)
  const [announceSheet, setAnnounceSheet] = useState(false)
  const [studentSheet, setStudentSheet] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentDetail | null>(null)
  const [activeTopic, setActiveTopic] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAll() {
      try {
        const results = await Promise.allSettled([
          coursesApi.show(id), lmsApi.getTopics(id), coursesApi.getStudents(id),
          coursesApi.getTutors(id), lmsApi.getAnnouncements(id), lmsApi.getOnlineClasses(id),
        ])
        if (results[0].status === "fulfilled") setCourse(results[0].value.data.data)
        if (results[1].status === "fulfilled") {
          const t = results[1].value.data.data || []
          setTopics(t)
          for (const topic of t) {
            try {
              const matsRes = await lmsApi.getMaterials(topic.id)
              setTopicMaterials(prev => ({ ...prev, [topic.id]: matsRes.data.data || [] }))
            } catch { }
          }
        }
        if (results[2].status === "fulfilled") setStudents(results[2].value.data.data || [])
        if (results[3].status === "fulfilled") setTutors(results[3].value.data.data || [])
        if (results[4].status === "fulfilled") setAnnouncements(results[4].value.data.data || [])
        if (results[5].status === "fulfilled") setOnlineClasses(results[5].value.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchAll()
  }, [id])

  async function createTopic(data: Record<string, unknown>) {
    try { await lmsApi.createTopic(id, data); setTopicSheet(false); const res = await lmsApi.getTopics(id); setTopics(res.data.data || []) } catch { }
  }
  async function createMaterial(topicId: string, data: Record<string, unknown>) {
    try { await lmsApi.createMaterial(topicId, data); setMaterialSheet(false); setActiveTopic(null); const res = await lmsApi.getMaterials(topicId); setTopicMaterials(prev => ({ ...prev, [topicId]: res.data.data || [] })) } catch { }
  }
  async function createAssignment(data: Record<string, unknown>) {
    try { await lmsApi.createAssignment(id, data); setAssignmentSheet(false) } catch { }
  }
  async function createAnnouncement(data: Record<string, unknown>) {
    try { await api.post(`/courses/${id}/announcements`, data); setAnnounceSheet(false); const res = await lmsApi.getAnnouncements(id); setAnnouncements(res.data.data || []) } catch { }
  }
  function viewStudent(s: User) { setSelectedStudent(s as StudentDetail); setStudentSheet(true) }

  const totalMaterials = Object.values(topicMaterials).reduce((sum, mats) => sum + mats.length, 0)
  const totalAssignments = Object.values(topicMaterials).reduce((sum, mats) => sum + mats.filter(m => m.type === "ASSIGNMENT").length, 0)
  const liveClasses = onlineClasses.filter(c => c.status === "LIVE").length

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Courses", href: "/dashboard/courses" }, { title: course?.code || "Course" }]}>
      {loading ? <Skeleton className="h-32 w-full" /> : course ? (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10"><IconBook2 className="size-8 text-primary" /></div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{course.title}</h1>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <span className="font-mono font-medium">{course.code}</span><span>·</span>
                    <span className="flex items-center gap-1"><IconSchool className="size-3.5" />Year {course.year} · Sem {course.semester}</span><span>·</span>
                    <span>{course.credits} credits</span>
                  </div>
                  {course.description && <p className="text-sm text-muted-foreground mt-2 max-w-3xl">{course.description}</p>}
                </div>
              </div>
              <Badge variant={course.is_active ? "default" : "secondary"} className="text-sm">{course.is_active ? "Active" : "Inactive"}</Badge>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Topics", value: topics.length, icon: <IconBook2 className="size-4" />, color: "text-blue-600 bg-blue-50" },
          { label: "Materials", value: totalMaterials, icon: <IconFileText className="size-4" />, color: "text-purple-600 bg-purple-50" },
          { label: "Students", value: students.length, icon: <IconUsers className="size-4" />, color: "text-green-600 bg-green-50" },
          { label: "Assignments", value: totalAssignments, icon: <IconClipboardList className="size-4" />, color: "text-orange-600 bg-orange-50" },
          { label: "Classes", value: onlineClasses.length, icon: <IconVideo className="size-4" />, color: "text-cyan-600 bg-cyan-50" },
        ].map(stat => (
          <Card key={stat.label}><CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div><p className="text-xs text-muted-foreground">{stat.label}</p><p className="text-2xl font-bold mt-1">{loading ? <Skeleton className="h-7 w-8" /> : stat.value}</p></div>
              <div className={`flex size-9 items-center justify-center rounded-lg ${stat.color}`}>{stat.icon}</div>
            </div>
          </CardContent></Card>
        ))}
      </div>

      <Tabs defaultValue="content">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="content"><IconBook2 className="size-4" />Content</TabsTrigger>
          <TabsTrigger value="students"><IconUsers className="size-4" />Students ({students.length})</TabsTrigger>
          <TabsTrigger value="tutors"><IconSchool className="size-4" />Tutors ({tutors.length})</TabsTrigger>
          <TabsTrigger value="assignments"><IconClipboardList className="size-4" />Assignments ({totalAssignments})</TabsTrigger>
          <TabsTrigger value="classes"><IconVideo className="size-4" />Classes ({onlineClasses.length})</TabsTrigger>
          <TabsTrigger value="announcements"><IconBell className="size-4" />Announcements ({announcements.length})</TabsTrigger>
        </TabsList>

        {/* Content Tab */}
        <TabsContent value="content" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Course Content</h2>
            <Button size="sm" onClick={() => setTopicSheet(true)}><IconPlus className="size-4" /> Add Topic</Button>
          </div>
          {loading ? Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
          )) : topics.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconBook2 className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">No topics yet. Add your first topic.</p>
            </div>
          ) : topics.map((topic) => (
            <Card key={topic.id}>
              <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {expandedTopic === topic.id ? <IconChevronDown className="size-4" /> : <IconChevronRight className="size-4" />}
                    <CardTitle className="text-base">{topic.title}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{topicMaterials[topic.id]?.length || 0} materials</Badge>
                    {(topicMaterials[topic.id] || []).filter(m => m.type === "ASSIGNMENT").length > 0 && (
                      <Badge variant="secondary">{topicMaterials[topic.id].filter(m => m.type === "ASSIGNMENT").length} assignments</Badge>
                    )}
                  </div>
                </div>
                {topic.description && <p className="text-sm text-muted-foreground">{topic.description}</p>}
              </CardHeader>
              {expandedTopic === topic.id && (
                <CardContent className="border-t pt-4">
                  <div className="space-y-2">
                    {(topicMaterials[topic.id] || []).map((mat) => (
                      <div key={mat.id} className="flex items-center gap-3 rounded-lg border p-3 hover:bg-muted/30 transition-colors">
                        <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                          {mat.type === "ASSIGNMENT" ? <IconClipboardList className="size-4 text-orange-600" /> :
                           mat.type === "VIDEO" ? <IconVideo className="size-4 text-blue-600" /> :
                           mat.type === "LINK" ? <IconLink className="size-4 text-purple-600" /> :
                           <IconFileText className="size-4 text-gray-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{mat.title}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">{mat.type}</Badge>
                            {mat.due_date && <span className="flex items-center gap-0.5"><IconClock className="size-3" />Due: {new Date(mat.due_date).toLocaleDateString()}</span>}
                            {mat.total_marks != null && <span>· {mat.total_marks} marks</span>}
                          </div>
                          {mat.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{mat.description}</p>}
                        </div>
                        {mat.file_url && <Button size="sm" variant="ghost" onClick={() => window.open(mat.file_url, "_blank")}><IconEye className="size-3.5" /> View</Button>}
                      </div>
                    ))}
                    {(topicMaterials[topic.id] || []).length === 0 && <p className="text-xs text-muted-foreground py-2">No materials in this topic yet.</p>}
                    <Button size="sm" variant="outline" className="w-full" onClick={() => { setActiveTopic(topic.id); setMaterialSheet(true) }}>
                      <IconPlus className="size-3.5" /> Add Material to this Topic
                    </Button>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-4">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow>
                <TableHead>Student</TableHead><TableHead>Email</TableHead><TableHead>Phone</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead>
              </TableRow></TableHeader>
              <TableBody>
                {loading ? Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell><TableCell><Skeleton className="h-5 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell><TableCell><Skeleton className="h-5 w-16" /></TableCell><TableCell><Skeleton className="h-5 w-16" /></TableCell>
                  </TableRow>
                )) : students.map(s => (
                  <TableRow key={s.id} className="hover:bg-muted/50 cursor-pointer" onClick={() => viewStudent(s)}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {s.full_name?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                        <span className="font-medium">{s.full_name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{s.email}</TableCell>
                    <TableCell className="text-muted-foreground">{s.phone || "—"}</TableCell>
                    <TableCell><Badge variant={s.status === "ACTIVE" ? "default" : "secondary"}>{s.status}</Badge></TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={(e) => { e.stopPropagation(); viewStudent(s) }}><IconEye className="size-3.5" /> View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent></Card>
          {!loading && students.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconUsers className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">No students enrolled in this course</p>
            </div>
          )}
        </TabsContent>

        {/* Tutors Tab */}
        <TabsContent value="tutors" className="mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
            )) : tutors.map(t => (
              <Card key={t.id}><CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-12 items-center justify-center rounded-full bg-green-50 text-green-600 text-sm font-medium">
                    {t.full_name?.charAt(0)?.toUpperCase() || "T"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{t.full_name}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                    {t.phone && <p className="text-xs text-muted-foreground">{t.phone}</p>}
                  </div>
                  <Badge variant="outline">Tutor</Badge>
                </div>
              </CardContent></Card>
            ))}
          </div>
          {!loading && tutors.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconSchool className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">No tutors assigned to this course</p>
            </div>
          )}
        </TabsContent>

        {/* Assignments Tab */}
        <TabsContent value="assignments" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Assignments</h2>
            <Button size="sm" onClick={() => setAssignmentSheet(true)}><IconPlus className="size-4" /> Create Assignment</Button>
          </div>
          {loading ? Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
          )) : topics.flatMap(t => topicMaterials[t.id] || []).filter(m => m.type === "ASSIGNMENT").length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconClipboardList className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">No assignments yet. Create your first assignment.</p>
            </div>
          ) : topics.flatMap(t => (topicMaterials[t.id] || []).filter(m => m.type === "ASSIGNMENT").map(m => ({ ...m, topicTitle: t.title }))).map(a => {
            const isOverdue = a.due_date ? new Date(a.due_date) < new Date() : false
            return (
              <Card key={a.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-base">{a.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-1">Topic: {a.topicTitle}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{a.total_marks || 0} marks</Badge>
                      {a.due_date && <Badge variant={isOverdue ? "destructive" : "secondary"}><IconClock className="size-3 mr-0.5" />{isOverdue ? "Overdue" : "Due"}: {new Date(a.due_date).toLocaleDateString()}</Badge>}
                    </div>
                  </div>
                </CardHeader>
                {a.description && <CardContent><p className="text-sm text-muted-foreground">{a.description}</p></CardContent>}
              </Card>
            )
          })}
        </TabsContent>

        {/* Online Classes Tab */}
        <TabsContent value="classes" className="mt-4">
          {liveClasses > 0 && (
            <Card className="border-green-500/30 bg-green-500/5 mb-4">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="size-3 rounded-full bg-red-500 animate-pulse" />
                <span className="font-medium text-green-600">{liveClasses} class{liveClasses > 1 ? "es" : ""} live now!</span>
              </CardContent>
            </Card>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {loading ? Array.from({ length: 2 }).map((_, i) => (
              <Card key={i}><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
            )) : onlineClasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center col-span-2">
                <IconVideo className="size-12 text-muted-foreground/50" />
                <p className="mt-4 text-sm text-muted-foreground">No online classes scheduled</p>
              </div>
            ) : onlineClasses.map(c => (
              <Card key={c.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base">{c.title}</CardTitle>
                    <Badge variant={c.status === "LIVE" ? "default" : c.status === "COMPLETED" ? "secondary" : "outline"}>
                      {c.status === "LIVE" && <span className="size-2 rounded-full bg-red-500 animate-pulse mr-1" />}
                      {c.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><IconCalendar className="size-3" />{new Date(c.scheduled_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><IconClock className="size-3" />{new Date(c.scheduled_at).toLocaleTimeString()}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground mb-3">Platform: {c.platform}</p>
                  <Button size="sm" variant="outline" className="w-full" onClick={() => window.open(c.meeting_link, "_blank")}>
                    <IconVideo className="size-4" /> Join Class
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Announcements Tab */}
        <TabsContent value="announcements" className="mt-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Course Announcements</h2>
            <Button size="sm" onClick={() => setAnnounceSheet(true)}><IconPlus className="size-4" /> Post Announcement</Button>
          </div>
          {loading ? Array.from({ length: 2 }).map((_, i) => (
            <Card key={i}><CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader><CardContent><Skeleton className="h-12 w-full" /></CardContent></Card>
          )) : announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <IconBell className="size-12 text-muted-foreground/50" />
              <p className="mt-4 text-sm text-muted-foreground">No announcements yet</p>
            </div>
          ) : announcements.map(a => (
            <Card key={a.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{a.title}</CardTitle>
                  {a.is_pinned && <Badge variant="default"><IconCheck className="size-3 mr-0.5" />Pinned</Badge>}
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1"><IconCalendar className="size-3" />{new Date(a.created_at).toLocaleString()}</p>
              </CardHeader>
              <CardContent><p className="text-sm text-muted-foreground">{a.body}</p></CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Topic Sheet */}
      <Sheet open={topicSheet} onOpenChange={setTopicSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle>Create New Topic</SheetTitle><SheetDescription>Add a new topic to organize course materials</SheetDescription></SheetHeader>
          <div className="p-4 flex-1 overflow-y-auto"><TopicForm onSubmit={createTopic} /></div>
        </SheetContent>
      </Sheet>

      {/* Material Sheet */}
      <Sheet open={materialSheet} onOpenChange={(v) => { setMaterialSheet(v); if (!v) setActiveTopic(null) }}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Material</SheetTitle>
            <SheetDescription>{activeTopic ? `Adding to: ${topics.find(t => t.id === activeTopic)?.title || ""}` : ""}</SheetDescription>
          </SheetHeader>
          <div className="p-4 flex-1 overflow-y-auto">{activeTopic && <MaterialForm onSubmit={(data) => createMaterial(activeTopic, data)} />}</div>
        </SheetContent>
      </Sheet>

      {/* Assignment Sheet */}
      <Sheet open={assignmentSheet} onOpenChange={setAssignmentSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle>Create Assignment</SheetTitle><SheetDescription>Create a new assignment for this course</SheetDescription></SheetHeader>
          <div className="p-4 flex-1 overflow-y-auto"><AssignmentForm onSubmit={createAssignment} /></div>
        </SheetContent>
      </Sheet>

      {/* Announcement Sheet */}
      <Sheet open={announceSheet} onOpenChange={setAnnounceSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader><SheetTitle>Post Announcement</SheetTitle><SheetDescription>Send an announcement to course students</SheetDescription></SheetHeader>
          <div className="p-4 flex-1 overflow-y-auto"><AnnouncementForm onSubmit={createAnnouncement} /></div>
        </SheetContent>
      </Sheet>

      {/* Student Detail Sheet */}
      <Sheet open={studentSheet} onOpenChange={setStudentSheet}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          {selectedStudent && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><IconUserCircle className="size-5" /> Student Profile</SheetTitle>
                <SheetDescription>Detailed student information</SheetDescription>
              </SheetHeader>
              <div className="p-4 flex-1 overflow-y-auto space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary text-xl font-medium">
                    {selectedStudent.full_name?.charAt(0)?.toUpperCase() || "S"}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{selectedStudent.full_name}</h3>
                    <Badge variant={selectedStudent.status === "ACTIVE" ? "default" : "secondary"} className="mt-1">{selectedStudent.status}</Badge>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 text-sm"><IconMail className="size-4 text-muted-foreground" /><span>{selectedStudent.email}</span></div>
                    {selectedStudent.phone && <div className="flex items-center gap-3 text-sm"><IconPhone className="size-4 text-muted-foreground" /><span>{selectedStudent.phone}</span></div>}
                  </div>
                </div>
                {selectedStudent.pivot && (
                  <div className="space-y-3 pt-4 border-t">
                    <h4 className="text-sm font-medium text-muted-foreground">Enrollment</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Enrollment Status</span><Badge variant="outline">{selectedStudent.pivot.status}</Badge></div>
                      {selectedStudent.pivot.enrolled_at && <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Enrolled On</span><span>{new Date(selectedStudent.pivot.enrolled_at).toLocaleDateString()}</span></div>}
                    </div>
                  </div>
                )}
                <div className="space-y-3 pt-4 border-t">
                  <h4 className="text-sm font-medium text-muted-foreground">Account Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">User ID</span><span className="font-mono text-xs">{selectedStudent.id?.slice(0, 8)}...</span></div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Email Verified</span>
                      {selectedStudent.email_verified_at ? <Badge variant="default" className="text-xs"><IconCheck className="size-3 mr-0.5" />Verified</Badge> : <Badge variant="secondary" className="text-xs"><IconX className="size-3 mr-0.5" />Unverified</Badge>}
                    </div>
                    {selectedStudent.created_at && <div className="flex items-center justify-between text-sm"><span className="text-muted-foreground">Joined</span><span>{new Date(selectedStudent.created_at).toLocaleDateString()}</span></div>}
                  </div>
                </div>
              </div>
              <SheetFooter><Button variant="outline" onClick={() => setStudentSheet(false)}>Close</Button></SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </DashboardShell>
  )
}

function TopicForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [orderNo, setOrderNo] = useState("1")
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title, description, order_no: parseInt(orderNo) }) }}>
      <FieldGroup>
        <Field><FieldLabel>Title</FieldLabel><Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Introduction to..." /></Field>
        <Field><FieldLabel>Description</FieldLabel><Input value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description..." /></Field>
        <Field><FieldLabel>Order</FieldLabel><Input type="number" value={orderNo} onChange={e => setOrderNo(e.target.value)} required /></Field>
        <Button type="submit" className="w-full">Create Topic</Button>
      </FieldGroup>
    </form>
  )
}

function MaterialForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState("")
  const [type, setType] = useState("PDF")
  const [fileUrl, setFileUrl] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [totalMarks, setTotalMarks] = useState("")
  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      const data: Record<string, unknown> = { title, type, file_url: fileUrl, description }
      if (type === "ASSIGNMENT") { data.due_date = dueDate; data.total_marks = parseInt(totalMarks) || 0 }
      onSubmit(data)
    }}>
      <FieldGroup>
        <Field><FieldLabel>Title</FieldLabel><Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Material title" /></Field>
        <Field><FieldLabel>Type</FieldLabel>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={type} onChange={e => setType(e.target.value)}>
            <option value="PDF">PDF Document</option><option value="SLIDE">Slides</option><option value="VIDEO">Video</option><option value="LINK">External Link</option><option value="ASSIGNMENT">Assignment</option>
          </select>
        </Field>
        <Field><FieldLabel>File URL / Link</FieldLabel><Input value={fileUrl} onChange={e => setFileUrl(e.target.value)} placeholder="https://..." /></Field>
        <Field><FieldLabel>Description</FieldLabel><Input value={description} onChange={e => setDescription(e.target.value)} /></Field>
        {type === "ASSIGNMENT" && (
          <>
            <Field><FieldLabel>Due Date</FieldLabel><Input type="datetime-local" value={dueDate} onChange={e => setDueDate(e.target.value)} /></Field>
            <Field><FieldLabel>Total Marks</FieldLabel><Input type="number" value={totalMarks} onChange={e => setTotalMarks(e.target.value)} placeholder="100" /></Field>
          </>
        )}
        <Button type="submit" className="w-full">Add Material</Button>
      </FieldGroup>
    </form>
  )
}

function AssignmentForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState("")
  const [instructions, setInstructions] = useState("")
  const [maxMarks, setMaxMarks] = useState("100")
  const [dueAt, setDueAt] = useState("")
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title, instructions, max_marks: parseInt(maxMarks), due_at: dueAt }) }}>
      <FieldGroup>
        <Field><FieldLabel>Title</FieldLabel><Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Assignment title" /></Field>
        <Field><FieldLabel>Instructions</FieldLabel><textarea className="flex min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Assignment instructions..." /></Field>
        <Field><FieldLabel>Max Marks</FieldLabel><Input type="number" value={maxMarks} onChange={e => setMaxMarks(e.target.value)} required /></Field>
        <Field><FieldLabel>Due Date</FieldLabel><Input type="datetime-local" value={dueAt} onChange={e => setDueAt(e.target.value)} /></Field>
        <Button type="submit" className="w-full">Create Assignment</Button>
      </FieldGroup>
    </form>
  )
}

function AnnouncementForm({ onSubmit }: { onSubmit: (data: Record<string, unknown>) => void }) {
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [isPinned, setIsPinned] = useState(false)
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ title, body, is_pinned: isPinned, scope: "COURSE" }) }}>
      <FieldGroup>
        <Field><FieldLabel>Title</FieldLabel><Input value={title} onChange={e => setTitle(e.target.value)} required placeholder="Announcement title" /></Field>
        <Field><FieldLabel>Body</FieldLabel><textarea className="flex min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm" value={body} onChange={e => setBody(e.target.value)} required placeholder="Announcement content..." /></Field>
        <Field><FieldLabel>Pinned?</FieldLabel>
          <select className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm" value={isPinned ? "yes" : "no"} onChange={e => setIsPinned(e.target.value === "yes")}>
            <option value="no">No</option><option value="yes">Yes - Pin to top</option>
          </select>
        </Field>
        <Button type="submit" className="w-full">Post Announcement</Button>
      </FieldGroup>
    </form>
  )
}
