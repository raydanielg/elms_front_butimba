"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { coursesApi } from "@/lib/services"
import type { Course } from "@/lib/types"
import { IconBook2, IconSchool, IconUsers } from "@tabler/icons-react"

export default function BrowseCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const res = await coursesApi.list()
        setCourses(res.data.data || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchCourses()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Courses", href: "/dashboard/courses" }, { title: "Browse" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Browse Courses</h1>
        <p className="text-sm text-muted-foreground mt-1">Enroll in available courses</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-20 w-full" /><Skeleton className="h-9 w-full mt-3" /></CardContent>
              </Card>
            ))
          : courses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                      <IconBook2 className="size-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{course.title}</CardTitle>
                      <p className="text-xs text-muted-foreground">{course.code}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {course.description || "No description available"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><IconSchool className="size-3.5" />Year {course.year}</span>
                    <span>{course.credits} credits</span>
                  </div>
                  <Button className="w-full" size="sm" onClick={() => coursesApi.enroll(course.id)}>
                    Enroll Now
                  </Button>
                </CardContent>
              </Card>
            ))}
      </div>
    </DashboardShell>
  )
}
