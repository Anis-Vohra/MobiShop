import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Plus, Search } from "lucide-react"
import Link from "next/link"

export default function AppointmentsPage() {
  // Mock data for appointments
  const appointments = [
    {
      id: "1",
      date: "2023-06-15",
      time: "09:00 AM",
      customer: "John Smith",
      vehicle: "Honda Civic (2018)",
      service: "Oil Change",
      status: "Scheduled",
    },
    {
      id: "2",
      date: "2023-06-15",
      time: "11:30 AM",
      customer: "Sarah Johnson",
      vehicle: "Toyota Camry (2020)",
      service: "Brake Inspection",
      status: "Scheduled",
    },
    {
      id: "3",
      date: "2023-06-15",
      time: "02:15 PM",
      customer: "Mike Williams",
      vehicle: "Ford F-150 (2019)",
      service: "Battery Replacement",
      status: "Scheduled",
    },
    {
      id: "4",
      date: "2023-06-16",
      time: "10:00 AM",
      customer: "Emily Davis",
      vehicle: "Chevrolet Malibu (2021)",
      service: "Tire Rotation",
      status: "Scheduled",
    },
    {
      id: "5",
      date: "2023-06-16",
      time: "01:30 PM",
      customer: "Robert Brown",
      vehicle: "Nissan Altima (2017)",
      service: "AC Service",
      status: "Scheduled",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Appointments</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Appointment
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">3 appointments scheduled for today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tomorrow</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2</div>
            <p className="text-xs text-muted-foreground">2 appointments scheduled for tomorrow</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">8 appointments scheduled this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">5 appointments scheduled next week</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointment Calendar</CardTitle>
          <CardDescription>View and manage your upcoming appointments.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search appointments..." className="pl-8 w-full md:w-auto" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select defaultValue="today">
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="tomorrow">Tomorrow</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="next-week">Next Week</SelectItem>
                  <SelectItem value="all">All Appointments</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">Filter</Button>
            </div>
          </div>

          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-lg border p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{appointment.service}</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment.date} at {appointment.time}
                    </p>
                    <p className="text-sm">
                      {appointment.customer} - {appointment.vehicle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end md:self-auto">
                  <div className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                    {appointment.status}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/appointments/${appointment.id}`}>View</Link>
                  </Button>
                  <Button size="sm">Start</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
