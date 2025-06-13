import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, Plus, Search } from "lucide-react"
import Link from "next/link"

export default function JobsPage() {
  // Mock data for jobs
  const jobs = [
    {
      id: "1",
      customer: "John Smith",
      vehicle: "Honda Civic (2018)",
      service: "Oil Change",
      date: "2023-06-10",
      total: "$120.00",
      status: "Completed",
    },
    {
      id: "2",
      customer: "Sarah Johnson",
      vehicle: "Toyota Camry (2020)",
      service: "Brake Inspection",
      date: "2023-06-12",
      total: "$350.00",
      status: "In Progress",
    },
    {
      id: "3",
      customer: "Mike Williams",
      vehicle: "Ford F-150 (2019)",
      service: "Battery Replacement",
      date: "2023-06-14",
      total: "$175.50",
      status: "Estimate",
    },
    {
      id: "4",
      customer: "Emily Davis",
      vehicle: "Chevrolet Malibu (2021)",
      service: "Tire Rotation",
      date: "2023-06-15",
      total: "$80.00",
      status: "Scheduled",
    },
    {
      id: "5",
      customer: "Robert Brown",
      vehicle: "Nissan Altima (2017)",
      service: "AC Service",
      date: "2023-06-08",
      total: "$220.00",
      status: "Completed",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Jobs</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Estimate
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Estimates</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">3 pending estimates</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">2 jobs in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">12 jobs completed this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$4,231.89</div>
            <p className="text-xs text-muted-foreground">Total revenue this month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Job Management</CardTitle>
          <CardDescription>View and manage all jobs, estimates, and invoices.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search jobs..." className="pl-8 w-full md:w-auto" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="estimate">Estimates</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Filter</Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.customer}</TableCell>
                    <TableCell>{job.vehicle}</TableCell>
                    <TableCell>{job.service}</TableCell>
                    <TableCell>{job.date}</TableCell>
                    <TableCell>{job.total}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          job.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : job.status === "In Progress"
                              ? "bg-blue-100 text-blue-800"
                              : job.status === "Estimate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {job.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/jobs/${job.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
