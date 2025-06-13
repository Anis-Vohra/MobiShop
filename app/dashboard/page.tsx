"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  FileText,
  Users,
  Wrench,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useDashboardStats, useAppointments, useJobs } from "@/hooks/use-api"
import { formatCurrency, formatTime } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const { stats, loading: statsLoading } = useDashboardStats()
  const { appointments, loading: appointmentsLoading } = useAppointments({
    date: new Date().toISOString().split("T")[0],
  })
  const { jobs, loading: jobsLoading } = useJobs({ status: "in_progress" })

  const todayAppointments = appointments?.slice(0, 3) || []
  const recentJobs = jobs?.slice(0, 3) || []

  if (statsLoading) {
    return (
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-[60px] mb-2" />
                <Skeleton className="h-3 w-[120px]" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/dashboard/appointments/new">
              <Calendar className="mr-2 h-4 w-4" />
              New Appointment
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(stats?.totalRevenueThisMonth || 0)}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {stats?.revenueChange >= 0 ? (
                    <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  {Math.abs(stats?.revenueChange || 0).toFixed(1)}% from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.todayAppointmentsCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.todayAppointmentsCount === 1 ? "appointment" : "appointments"} scheduled
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
                <Wrench className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeJobsCount || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.activeJobsCount === 1 ? "job" : "jobs"} in progress
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalCustomers || 0}</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  {stats?.customerChange >= 0 ? (
                    <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                  ) : (
                    <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                  )}
                  +{stats?.newCustomersThisMonth || 0} this month
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {appointmentsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-3 w-[150px]" />
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 w-16" />
                          <Skeleton className="h-8 w-12" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : todayAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {todayAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center gap-4 rounded-lg border p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {appointment.service}
                            {appointment.vehicles &&
                              ` - ${appointment.vehicles.year} ${appointment.vehicles.make} ${appointment.vehicles.model}`}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(appointment.time)} - {appointment.customers?.name}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/appointments/${appointment.id}`}>Details</Link>
                          </Button>
                          <Button size="sm" asChild>
                            <Link href={`/dashboard/jobs/new?appointment=${appointment.id}`}>Start</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/appointments">
                        View All Appointments
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">No appointments today</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      You don't have any appointments scheduled for today.
                    </p>
                    <Button asChild>
                      <Link href="/dashboard/appointments/new">
                        <Calendar className="h-4 w-4 mr-2" />
                        Schedule Appointment
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>Jobs currently in progress</CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-4 rounded-lg border p-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-[150px]" />
                          <Skeleton className="h-3 w-[100px]" />
                        </div>
                        <Skeleton className="h-6 w-16 rounded-full" />
                      </div>
                    ))}
                  </div>
                ) : recentJobs.length > 0 ? (
                  <div className="space-y-4">
                    {recentJobs.map((job) => (
                      <div key={job.id} className="flex items-center gap-4 rounded-lg border p-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{job.service}</p>
                          <p className="text-sm text-muted-foreground">
                            {job.customers?.name}
                            {job.vehicles && ` - ${job.vehicles.year} ${job.vehicles.make} ${job.vehicles.model}`}
                          </p>
                        </div>
                        <div>
                          <div className="rounded-full px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800">
                            In Progress
                          </div>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/dashboard/jobs">
                        View All Jobs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                    <h3 className="text-lg font-medium">No active jobs</h3>
                    <p className="text-sm text-muted-foreground mb-4">You don't have any jobs in progress.</p>
                    <Button asChild>
                      <Link href="/dashboard/jobs/new">
                        <FileText className="h-4 w-4 mr-2" />
                        Create Job
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Monthly revenue for the past 6 months</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                  <span className="ml-2 text-muted-foreground">Revenue chart will appear here</span>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Job Types</CardTitle>
                <CardDescription>Distribution of job types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center border rounded-md">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                  <span className="ml-2 text-muted-foreground">Job types chart will appear here</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
