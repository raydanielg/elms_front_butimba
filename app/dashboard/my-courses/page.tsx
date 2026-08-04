"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { coursesApi } from "@/lib/services"
import type { Course } from "@/lib/types"
import { IconBook2, IconSchool, IconEye, IconUsers } from "@tabler/icons-react"

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMyCourses() {
      try {
        const res = await coursesApi.myCourses()
        setCourses(res.data.data || [])
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchMyCourses()
  }, [])

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "My Courses" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Courses</h1>
        <p className="text-sm text-muted-foreground mt-1">Courses you are enrolled in or teaching</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader><Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-16 w-full" /></CardContent>
              </Card>
            ))
          : courses.map((course) => (
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
                    {course.pivot && (
                      <Badge variant="outline">{course.pivot.status}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {course.description || "No description available"}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><IconSchool className="size-3.5" />Year {course.year} · Sem {course.semester}</span>
                    <span>{course.credits} credits</span>
                  </div>
                  <Link href={`/dashboard/courses/${course.id}`}>
                    <Button size="sm" variant="outline" className="w-full">
                      <IconEye className="size-3.5" /> View Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
      </div>

      {!loading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <IconBook2 className="size-12 text-muted-foreground/50" />
          <p className="mt-4 text-sm text-muted-foreground">You are not enrolled in any courses yet</p>
        </div>
      )}
    </DashboardShell>
  )
}
