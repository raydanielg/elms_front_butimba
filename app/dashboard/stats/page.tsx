"use client"

import { useEffect, useState } from "react"
import { DashboardShell } from "@/components/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Progress } from "@/components/ui/progress"
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { dashboardApi } from "@/lib/services"
import type { DashboardStats } from "@/lib/types"
import { IconBook2, IconUsers, IconClipboardList, IconChartBar, IconSchool, IconCheck, IconClock } from "@tabler/icons-react"
import { Pie, PieChart, Cell, RadialBar, RadialBarChart, PolarAngleAxis } from "recharts"

export default function StatsPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await dashboardApi.stats()
        setStats(res.data.data)
      } catch {
        // ignore
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  const statCards = [
    { title: "Total Courses", value: stats?.total_courses ?? 0, icon: <IconBook2 className="size-5" />, color: "text-blue-600 bg-blue-50" },
    { title: "Total Students", value: stats?.total_students ?? 0, icon: <IconUsers className="size-5" />, color: "text-green-600 bg-green-50" },
    { title: "Assignments", value: stats?.total_assignments ?? 0, icon: <IconClipboardList className="size-5" />, color: "text-orange-600 bg-orange-50" },
    { title: "Submissions", value: stats?.total_submissions ?? 0, icon: <IconChartBar className="size-5" />, color: "text-purple-600 bg-purple-50" },
  ]

  // Pie chart data
  const usersData = [
    { name: "Students", value: stats?.total_students ?? 0, fill: "#3b82f6" },
    { name: "Lecturers", value: stats?.total_tutors ?? 0, fill: "#10b981" },
    { name: "Other Staff", value: Math.max(0, (stats?.total_users ?? 0) - (stats?.total_students ?? 0) - (stats?.total_tutors ?? 0)), fill: "#f59e0b" },
  ].filter(d => d.value > 0)

  const coursesData = [
    { name: "Published", value: stats?.published_courses ?? 0, fill: "#10b981" },
    { name: "Unpublished", value: Math.max(0, (stats?.total_courses ?? 0) - (stats?.published_courses ?? 0)), fill: "#94a3b8" },
  ].filter(d => d.value > 0)

  const enrollmentsData = [
    { name: "Enrolled", value: stats?.enrolled_courses ?? stats?.total_enrollments ?? 0, fill: "#3b82f6" },
    { name: "Completed", value: stats?.completed_courses ?? 0, fill: "#10b981" },
    { name: "In Progress", value: Math.max(0, (stats?.enrolled_courses ?? 0) - (stats?.completed_courses ?? 0)), fill: "#f59e0b" },
  ].filter(d => d.value > 0)

  const assignmentsData = [
    { name: "Pending", value: stats?.pending_assignments ?? stats?.pending_submissions ?? 0, fill: "#f59e0b" },
    { name: "Submitted", value: stats?.total_submissions ?? 0, fill: "#3b82f6" },
    { name: "Graded", value: stats?.my_submissions ?? 0, fill: "#10b981" },
  ].filter(d => d.value > 0)

  const paymentsData = [
    { name: "Confirmed", value: stats?.confirmed_payments ?? 0, fill: "#10b981" },
    { name: "Pending", value: stats?.pending_payments ?? 0, fill: "#f59e0b" },
  ].filter(d => d.value > 0)

  // Radial chart for completion rate
  const totalEnrolled = stats?.enrolled_courses ?? 0
  const totalCompleted = stats?.completed_courses ?? 0
  const completionRate = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0
  const radialData = [{ name: "Completion", value: completionRate, fill: "#8b5cf6" }]

  // Donut chart for submissions vs assignments
  const totalAssignments = stats?.total_assignments ?? 0
  const totalSubmissions = stats?.total_submissions ?? 0
  const submissionRate = totalAssignments > 0 ? Math.round((totalSubmissions / totalAssignments) * 100) : 0
  const submissionRadialData = [{ name: "Submission Rate", value: submissionRate, fill: "#06b6d4" }]

  // Payment rate radial
  const totalPayments = (stats?.confirmed_payments ?? 0) + (stats?.pending_payments ?? 0)
  const paymentRate = totalPayments > 0 ? Math.round(((stats?.confirmed_payments ?? 0) / totalPayments) * 100) : 0
  const paymentRadialData = [{ name: "Payment Rate", value: paymentRate, fill: "#10b981" }]

  // Enrollment rate radial
  const totalCourses = stats?.total_courses ?? 0
  const totalEnrollments = stats?.total_enrollments ?? 0
  const enrollmentRate = totalCourses > 0 ? Math.min(100, Math.round((totalEnrollments / Math.max(totalCourses, 1)) * 100)) : 0
  const enrollmentRadialData = [{ name: "Enrollment Rate", value: enrollmentRate, fill: "#3b82f6" }]

  return (
    <DashboardShell breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: "Statistics" }]}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
        <p className="text-sm text-muted-foreground mt-1">Detailed system analytics with visual insights</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="size-8 rounded-lg" />
                </CardHeader>
                <CardContent><Skeleton className="h-8 w-16" /></CardContent>
              </Card>
            ))
          : statCards.map((card) => (
              <Card key={card.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                  <div className={`flex size-8 items-center justify-center rounded-lg ${card.color}`}>{card.icon}</div>
                </CardHeader>
                <CardContent><div className="text-2xl font-bold">{card.value}</div></CardContent>
              </Card>
            ))}
      </div>

      {/* Radial / Donut Charts Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Completion Rate Radial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Completion Rate</CardTitle>
            <CardDescription>Course completion percentage</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[200px] w-full" /> : (
              <ChartContainer config={{ completion: { label: "Completion", color: "#8b5cf6" } }} className="mx-auto aspect-square">
                <RadialBarChart data={radialData} startAngle={90} endAngle={-270} innerRadius={60} outerRadius={90}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" background cornerRadius={10} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">
                    {completionRate}%
                  </text>
                </RadialBarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Submission Rate Radial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Submission Rate</CardTitle>
            <CardDescription>Submissions vs assignments</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[200px] w-full" /> : (
              <ChartContainer config={{ rate: { label: "Submission Rate", color: "#06b6d4" } }} className="mx-auto aspect-square">
                <RadialBarChart data={submissionRadialData} startAngle={90} endAngle={-270} innerRadius={60} outerRadius={90}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" background cornerRadius={10} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">
                    {submissionRate}%
                  </text>
                </RadialBarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Payment Rate Radial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Rate</CardTitle>
            <CardDescription>Confirmed vs pending payments</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[200px] w-full" /> : (
              <ChartContainer config={{ rate: { label: "Payment Rate", color: "#10b981" } }} className="mx-auto aspect-square">
                <RadialBarChart data={paymentRadialData} startAngle={90} endAngle={-270} innerRadius={60} outerRadius={90}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" background cornerRadius={10} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">
                    {paymentRate}%
                  </text>
                </RadialBarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Enrollment Rate Radial */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrollment Rate</CardTitle>
            <CardDescription>Enrollments per course ratio</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[200px] w-full" /> : (
              <ChartContainer config={{ rate: { label: "Enrollment Rate", color: "#3b82f6" } }} className="mx-auto aspect-square">
                <RadialBarChart data={enrollmentRadialData} startAngle={90} endAngle={-270} innerRadius={60} outerRadius={90}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar dataKey="value" background cornerRadius={10} />
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-foreground text-2xl font-bold">
                    {enrollmentRate}%
                  </text>
                </RadialBarChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Users Distribution Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">User Distribution</CardTitle>
            <CardDescription>Users by role</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[260px] w-full" /> : (
              <ChartContainer config={{
                students: { label: "Students", color: "#3b82f6" },
                lecturers: { label: "Lecturers", color: "#10b981" },
                staff: { label: "Other Staff", color: "#f59e0b" },
              }} className="mx-auto aspect-square">
                <PieChart>
                  <Pie data={usersData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {usersData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Courses Status Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Course Status</CardTitle>
            <CardDescription>Published vs unpublished</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[260px] w-full" /> : (
              <ChartContainer config={{
                published: { label: "Published", color: "#10b981" },
                unpublished: { label: "Unpublished", color: "#94a3b8" },
              }} className="mx-auto aspect-square">
                <PieChart>
                  <Pie data={coursesData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {coursesData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Enrollments Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrollment Status</CardTitle>
            <CardDescription>Enrolled, completed, in progress</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[260px] w-full" /> : (
              <ChartContainer config={{
                enrolled: { label: "Enrolled", color: "#3b82f6" },
                completed: { label: "Completed", color: "#10b981" },
                progress: { label: "In Progress", color: "#f59e0b" },
              }} className="mx-auto aspect-square">
                <PieChart>
                  <Pie data={enrollmentsData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {enrollmentsData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pie Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Assignments Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Assignment Status</CardTitle>
            <CardDescription>Pending, submitted, graded</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[260px] w-full" /> : (
              <ChartContainer config={{
                pending: { label: "Pending", color: "#f59e0b" },
                submitted: { label: "Submitted", color: "#3b82f6" },
                graded: { label: "Graded", color: "#10b981" },
              }} className="mx-auto aspect-square">
                <PieChart>
                  <Pie data={assignmentsData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {assignmentsData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* Payments Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Payment Status</CardTitle>
            <CardDescription>Confirmed vs pending</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-[260px] w-full" /> : (
              <ChartContainer config={{
                confirmed: { label: "Confirmed", color: "#10b981" },
                pending: { label: "Pending", color: "#f59e0b" },
              }} className="mx-auto aspect-square">
                <PieChart>
                  <Pie data={paymentsData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={90} paddingAngle={2}>
                    {paymentsData.map((entry, i) => (
                      <Cell key={`cell-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
                  <ChartLegend content={<ChartLegendContent />} />
                </PieChart>
              </ChartContainer>
            )}
          </CardContent>
        </Card>

        {/* System Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Overview</CardTitle>
            <CardDescription>Platform-wide metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Enrollments</span>
                  <span className="font-medium">{stats?.total_enrollments ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Published Courses</span>
                  <span className="font-medium">{stats?.published_courses ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending Payments</span>
                  <span className="font-medium">{stats?.pending_payments ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Confirmed Payments</span>
                  <span className="font-medium">{stats?.confirmed_payments ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Users</span>
                  <span className="font-medium">{stats?.total_users ?? 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Total Lecturers</span>
                  <span className="font-medium">{stats?.total_tutors ?? 0}</span>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Progress Bars */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Enrollment Progress</CardTitle>
            <CardDescription>Course enrollment and completion rates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><IconSchool className="size-4" />Enrolled Courses</span>
                    <span className="font-medium">{stats?.enrolled_courses ?? 0}</span>
                  </div>
                  <Progress value={65} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><IconCheck className="size-4" />Completed</span>
                    <span className="font-medium">{stats?.completed_courses ?? 0}</span>
                  </div>
                  <Progress value={40} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><IconClock className="size-4" />Pending Assignments</span>
                    <span className="font-medium">{stats?.pending_assignments ?? 0}</span>
                  </div>
                  <Progress value={25} />
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Teaching & Grading</CardTitle>
            <CardDescription>Tutor workload overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-2 w-full" />
                </div>
              ))
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><IconBook2 className="size-4" />Teaching Courses</span>
                    <span className="font-medium">{stats?.teaching_courses ?? 0}</span>
                  </div>
                  <Progress value={70} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><IconClipboardList className="size-4" />Total Assignments</span>
                    <span className="font-medium">{stats?.total_assignments ?? 0}</span>
                  </div>
                  <Progress value={55} />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 text-muted-foreground"><IconClock className="size-4" />Pending Grading</span>
                    <span className="font-medium">{stats?.pending_submissions ?? 0}</span>
                  </div>
                  <Progress value={30} />
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
