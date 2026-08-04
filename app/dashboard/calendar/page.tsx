"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge as BadgeUI } from "@/components/ui/badge"
import { calendarApi } from "@/lib/services"
import type { CalendarEvent } from "@/lib/types"
import { IconCalendarEvent, IconPlus, IconChevronLeft, IconChevronRight } from "@tabler/icons-react"

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    async function fetchEvents() {
      try {
        const month = String(currentMonth.getMonth() + 1).padStart(2, "0")
        const year = String(currentMonth.getFullYear())
        const res = await calendarApi.list({ month, year })
        setEvents(res.data.data || [])
      } catch { } finally { setLoading(false) }
    }
    fetchEvents()
  }, [currentMonth])

  const monthName = currentMonth.toLocaleString("default", { month: "long", year: "numeric" })
  const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay()
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate()
  const today = new Date().toDateString()

  const eventsByDay = events.reduce<Record<number, CalendarEvent[]>>((acc, e) => {
    const day = new Date(e.timestart).getDate()
    if (new Date(e.timestart).getMonth() === currentMonth.getMonth() && new Date(e.timestart).getFullYear() === currentMonth.getFullYear()) {
      if (!acc[day]) acc[day] = []
      acc[day].push(e)
    }
    return acc
  }, {})

  const eventColors: Record<string, string> = {
    course: "bg-blue-500",
    site: "bg-purple-500",
    user: "bg-green-500",
    group: "bg-orange-500",
    category: "bg-cyan-500",
  }

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Calendar" }]}>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
        <Button className="gap-1.5">
          <IconPlus className="size-4" /> New Event
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <IconCalendarEvent className="size-4" /> {monthName}
              </CardTitle>
              <CardDescription>{events.length} events this month</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="rounded-md border p-1.5 hover:bg-muted transition-colors"
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}
              >
                <IconChevronLeft className="size-4" />
              </button>
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
          {loading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <>
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
                      className={`min-h-20 rounded-lg border p-1 text-left ${isToday ? "border-primary bg-primary/5" : "hover:bg-muted/50"} transition-colors`}
                    >
                      <div className={`text-xs ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>{day}</div>
                      <div className="mt-0.5 space-y-0.5">
                        {dayEvents.slice(0, 3).map((e) => (
                          <div
                            key={e.id}
                            className={`truncate rounded px-1 py-0.5 text-xs text-white ${eventColors[e.eventtype] || "bg-gray-500"}`}
                            title={e.name}
                          >
                            {e.name}
                          </div>
                        ))}
                        {dayEvents.length > 3 && <div className="text-xs text-muted-foreground">+{dayEvents.length - 3} more</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-blue-500" /> Course</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-purple-500" /> Site</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-green-500" /> User</span>
                <span className="flex items-center gap-1.5"><span className="size-2.5 rounded bg-orange-500" /> Group</span>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Upcoming events list */}
      {!loading && events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {events
              .filter(e => new Date(e.timestart) >= new Date())
              .sort((a, b) => new Date(a.timestart).getTime() - new Date(b.timestart).getTime())
              .slice(0, 10)
              .map(e => (
                <div key={e.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-3">
                    <div className={`size-2.5 rounded-full ${eventColors[e.eventtype] || "bg-gray-500"}`} />
                    <div>
                      <p className="text-sm font-medium">{e.name}</p>
                      {e.location && <p className="text-xs text-muted-foreground">{e.location}</p>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{new Date(e.timestart).toLocaleDateString()}</p>
                    <p className="text-xs text-muted-foreground">{new Date(e.timestart).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}
    </DashboardShell>
  )
}
