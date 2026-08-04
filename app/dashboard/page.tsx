"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { dashboardApi } from "@/lib/services"
import { getUser } from "@/lib/auth"
import {
  AdminDashboard,
  PrincipalDashboard,
  RegistrarDashboard,
  AccountantDashboard,
  TutorDashboard,
  StudentDashboard,
  ApplicantDashboard,
  StaffDashboard,
} from "@/components/dashboard"
import {
  IconCalendar, IconBell, IconChartBar, IconChevronLeft, IconChevronRight,
  IconBook2, IconUpload, IconUserPlus, IconCreditCard, IconUsers,
} from "@tabler/icons-react"

type CalendarEvent = { id: string; title: string; date: string; type: string }
type ActivityItem = { title: string; type: string; status: string; date: string }

export default function Page() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const user = getUser()

  useEffect(() => {
    async function fetchAll() {
      try {
        const [activityRes] = await Promise.allSettled([dashboardApi.activity()])
        if (activityRes.status === "fulfilled") setActivities(activityRes.value.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchAll()
  }, [])

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const start = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString().split("T")[0]
        const end = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString().split("T")[0]
        const res = await dashboardApi.calendar({ start, end })
        setEvents(res.data.data || [])
      } catch { }
    }
    fetchCalendar()
  }, [currentMonth])

  const role = user?.role || "STUDENT"

  const roleDashboard = (() => {
    switch (role) {
      case "SUPER_ADMIN": return <AdminDashboard />
      case "PRINCIPAL": return <PrincipalDashboard />
      case "REGISTRAR": return <RegistrarDashboard />
      case "ACCOUNTANT": return <AccountantDashboard />
      case "TUTOR": return <TutorDashboard />
      case "STUDENT": return <StudentDashboard />
      case "APPLICANT": return <ApplicantDashboard />
      case "STAFF": return <StaffDashboard />
      default: return <StudentDashboard />
    }
  })()

  // Calendar logic
  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" })
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const today = new Date().toDateString()

  const eventsByDay = events.reduce<Record<number, CalendarEvent[]>>((acc, e) => {
    if (!e.date) return acc
    const day = new Date(e.date).getDate()
    if (new Date(e.date).getMonth() === currentMonth.getMonth() && new Date(e.date).getFullYear() === currentMonth.getFullYear()) {
      if (!acc[day]) acc[day] = []
      acc[day].push(e)
    }
    return acc
  }, {})

  const eventColors: Record<string, string> = {
    assignment: "bg-orange-500",
    class: "bg-blue-500",
    announcement: "bg-purple-500",
  }

  const activityIcons: Record<string, React.ReactNode> = {
    course: <IconBook2 className="size-4 text-blue-600" />,
    submission: <IconUpload className="size-4 text-purple-600" />,
    enrollment: <IconUserPlus className="size-4 text-green-600" />,
    payment: <IconCreditCard className="size-4 text-orange-600" />,
    user: <IconUsers className="size-4 text-cyan-600" />,
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Overview" }]}>
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.full_name?.split(" ")[0] || "User"} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening at Butimba Teachers College today.
          </p>
        </div>
        <Badge variant="secondary" className="capitalize">{role.toLowerCase()}</Badge>
      </div>

      {/* Role-specific dashboard content */}
      {roleDashboard}

      {/* Calendar + Recent Activity (shared across all roles) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Calendar */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <IconCalendar className="size-4" /> Calendar
                </CardTitle>
                <CardDescription>Upcoming events and deadlines</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-md border p-1.5 hover:bg-muted transition-colors"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
                >
                  <IconChevronLeft className="size-4" />
                </button>
                <span className="text-sm font-medium min-w-32 text-center">{monthName}</span>
                <button
                  className="rounded-md border p-1.5 hover:bg-muted transition-colors"
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))}
                >
                  <IconChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d} className="py-1">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dayEvents = eventsByDay[day] || []
                const isToday = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString() === today
                return (
                  <div
                    key={day}
                    className={`min-h-16 rounded-lg border p-1 text-left ${isToday ? "border-primary bg-primary/5" : "hover:bg-muted/50"} transition-colors`}
                  >
                    <div className={`text-xs ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>{day}</div>
                    <div className="mt-0.5 space-y-0.5">
                      {dayEvents.slice(0, 2).map((e) => (
                        <div
                          key={e.id}
                          className={`truncate rounded px-1 py-0.5 text-xs text-white ${eventColors[e.type] || "bg-gray-500"}`}
                          title={e.title}
                        >
                          {e.title}
                        </div>
                      ))}
                      {dayEvents.length > 2 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>}
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-blue-500" /> Class</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-orange-500" /> Assignment</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-purple-500" /> Announcement</span>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="size-9 rounded-lg" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            )) : activities.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <IconChartBar className="size-10 text-muted-foreground/50" />
                <p className="mt-3 text-sm text-muted-foreground">No recent activity</p>
              </div>
            ) : activities.map((item, i) => (
              <div key={i} className="flex items-start gap-3 rounded-lg border p-2.5 hover:bg-muted/50 transition-colors">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {activityIcons[item.type] || <IconBell className="size-4 text-muted-foreground" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs capitalize">{item.status}</Badge>
                    {item.date && <span className="text-xs text-muted-foreground">{new Date(item.date).toLocaleDateString()}</span>}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
