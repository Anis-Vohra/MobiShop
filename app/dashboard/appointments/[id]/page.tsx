import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, Check, Clock, FileText, MapPin, Pencil, Phone, Send, Trash, Wrench } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function AppointmentDetailPage({ params }: { params: { id: string } }) {
  // Mock data for an appointment
  const appointment = {
    id: params.id,
    customer: {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
    },
    vehicle: {
      id: "1",
      make: "Honda",
      model: "Civic",
      year: "2018",
      licensePlate: "ABC123",
    },
    service: "Oil Change and Tire Rotation",
    description: "Regular maintenance service including oil change, filter replacement, and tire rotation.",
    date: "2023-06-20",
    time: "10:00 AM",
    duration: "1 hour",
    location: "123 Main St, Anytown, CA 12345",
    status: "Scheduled",
    notes: "Customer requested synthetic oil. This is a repeat customer who prefers morning appointments.",
    reminders: [
      {
        type: "Email",
        status: "Sent",
        sentAt: "2023-06-18 09:00 AM",
      },
      {
        type: "SMS",
        status: "Scheduled",
        sentAt: "2023-06-19 10:00 AM",
      },
    ],
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/appointments">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Appointment Details</h2>
        <Badge
          className={
            appointment.status === "Completed"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : appointment.status === "In Progress"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : appointment.status === "Scheduled"
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {appointment.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Appointment Information</CardTitle>
            <CardDescription>Details about the scheduled service</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div className="flex items-start gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Date</div>
                  <div className="text-sm">{appointment.date}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Time</div>
                  <div className="text-sm">
                    {appointment.time} ({appointment.duration})
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Wrench className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Service</div>
                  <div className="text-sm">{appointment.service}</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-medium">Location</div>
                  <div className="text-sm">{appointment.location}</div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Description</div>
              <div className="text-sm p-2 border rounded-md">{appointment.description}</div>
            </div>

            <div className="mb-6">
              <div className="text-sm font-medium mb-2">Notes</div>
              <div className="text-sm p-2 border rounded-md">{appointment.notes}</div>
            </div>

            <div>
              <div className="text-sm font-medium mb-2">Reminders</div>
              <div className="space-y-2">
                {appointment.reminders.map((reminder, index) => (
                  <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                        {reminder.type === "Email" ? (
                          <Send className="h-4 w-4 text-primary" />
                        ) : (
                          <Phone className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{reminder.type} Reminder</div>
                        <div className="text-xs text-muted-foreground">{reminder.sentAt}</div>
                      </div>
                    </div>
                    <Badge
                      className={
                        reminder.status === "Sent" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {reminder.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash className="h-4 w-4 mr-2" />
              Cancel Appointment
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Send className="h-4 w-4 mr-2" />
                Send Reminder
              </Button>
              <Button variant="outline">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button>
                <Check className="h-4 w-4 mr-2" />
                Start Job
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer & Vehicle</CardTitle>
            <CardDescription>Customer and vehicle information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium mb-1">Customer</div>
                <div className="rounded-lg border p-3">
                  <div className="font-medium">{appointment.customer.name}</div>
                  <div className="text-sm">{appointment.customer.email}</div>
                  <div className="text-sm">{appointment.customer.phone}</div>
                  <Button variant="link" size="sm" className="px-0 mt-1" asChild>
                    <Link href={`/dashboard/customers/${appointment.customer.id}`}>View Customer</Link>
                  </Button>
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-1">Vehicle</div>
                <div className="rounded-lg border p-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      <Wrench className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {appointment.vehicle.year} {appointment.vehicle.make} {appointment.vehicle.model}
                      </div>
                      <div className="text-sm">License: {appointment.vehicle.licensePlate}</div>
                      <Button variant="link" size="sm" className="px-0 mt-1" asChild>
                        <Link href={`/dashboard/vehicles/${appointment.vehicle.id}`}>View Vehicle</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/customers/${appointment.customer.id}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    View Customer History
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/jobs/new?customer=${appointment.customer.id}&appointment=${appointment.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    Create Estimate
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
