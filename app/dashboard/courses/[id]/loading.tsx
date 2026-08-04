"use client"

import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CourseDetailLoading() {
  return (
    <DashboardShell breadcrumbs={[
      { title: "Dashboard", href: "/dashboard" },
      { title: "Courses", href: "/dashboard/courses" },
      { title: "Loading..." },
    ]}>
      <Skeleton className="h-24 w-full" />
      <Tabs>
        <TabsList className="w-full justify-start">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="tutors">Tutors</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
      </Tabs>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader><Skeleton className="h-5 w-2/3" /></CardHeader>
            <CardContent><Skeleton className="h-12 w-full" /></CardContent>
          </Card>
        ))}
      </div>
    </DashboardShell>
  )
}
