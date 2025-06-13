import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, FileText, Pencil, Plus, Trash, Wrench } from "lucide-react"
import Link from "next/link"

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  // Mock data for a customer
  const customer = {
    id: params.id,
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "(555) 123-4567",
    address: "123 Main St, Anytown, CA 12345",
    notes: "Prefers evening appointments. Has multiple vehicles that need regular maintenance.",
    createdAt: "2023-01-15",
  }

  // Mock data for vehicles
  const vehicles = [
    {
      id: "1",
      make: "Honda",
      model: "Civic",
      year: "2018",
      licensePlate: "ABC123",
      vin: "1HGCM82633A123456",
      lastService: "2023-05-15",
    },
    {
      id: "2",
      make: "Toyota",
      model: "Corolla",
      year: "2020",
      licensePlate: "DEF456",
      vin: "2T1BURHE5KC123456",
      lastService: "2023-04-22",
    },
  ]

  // Mock data for service history
  const serviceHistory = [
    {
      id: "1",
      date: "2023-05-15",
      vehicle: "Honda Civic (2018)",
      service: "Oil Change",
      amount: "$120.00",
      status: "Completed",
    },
    {
      id: "2",
      date: "2023-04-22",
      vehicle: "Toyota Corolla (2020)",
      service: "Brake Inspection",
      amount: "$85.00",
      status: "Completed",
    },
    {
      id: "3",
      date: "2023-03-10",
      vehicle: "Honda Civic (2018)",
      service: "Tire Rotation",
      amount: "$60.00",
      status: "Completed",
    },
    {
      id: "4",
      date: "2023-02-05",
      vehicle: "Toyota Corolla (2020)",
      service: "Battery Replacement",
      amount: "$175.50",
      status: "Completed",
    },
  ]

  // Mock data for upcoming appointments
  const appointments = [
    {
      id: "1",
      date: "2023-06-20",
      time: "10:00 AM",
      vehicle: "Honda Civic (2018)",
      service: "30,000 Mile Service",
      status: "Scheduled",
    },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/customers">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">{customer.name}</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Contact details and customer notes</CardDescription>
            </div>
            <Button variant="outline" size="icon">
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium">Email</div>
                <div className="text-sm">{customer.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Phone</div>
                <div className="text-sm">{customer.phone}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Address</div>
                <div className="text-sm">{customer.address}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Customer Since</div>
                <div className="text-sm">{customer.createdAt}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-medium">Notes</div>
              <div className="text-sm mt-1 p-2 border rounded-md">{customer.notes}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash className="h-4 w-4 mr-2" />
              Delete Customer
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href={`/dashboard/appointments/new?customer=${customer.id}`}>
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Link>
              </Button>
              <Button asChild>
                <Link href={`/dashboard/jobs/new?customer=${customer.id}`}>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Estimate
                </Link>
              </Button>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Vehicles</CardTitle>
            <CardDescription>Vehicles owned by this customer</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vehicles.map((vehicle) => (
                <div key={vehicle.id} className="flex items-start gap-4 rounded-lg border p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-xs text-muted-foreground">License: {vehicle.licensePlate}</p>
                    <p className="text-xs text-muted-foreground">VIN: {vehicle.vin}</p>
                    <p className="text-xs">Last Service: {vehicle.lastService}</p>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/dashboard/vehicles/${vehicle.id}`}>View</Link>
                  </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/dashboard/vehicles/new?customer=${customer.id}`}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history">Service History</TabsTrigger>
          <TabsTrigger value="appointments">Upcoming Appointments</TabsTrigger>
        </TabsList>
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Service History</CardTitle>
              <CardDescription>Past services and repairs for all vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Service</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {serviceHistory.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.date}</TableCell>
                        <TableCell>{service.vehicle}</TableCell>
                        <TableCell>{service.service}</TableCell>
                        <TableCell>{service.amount}</TableCell>
                        <TableCell>
                          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-green-100 text-green-800">
                            {service.status}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/dashboard/jobs/${service.id}`}>View</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Scheduled appointments for all vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              {appointments.length > 0 ? (
                <div className="space-y-4">
                  {appointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between gap-4 rounded-lg border p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <p className="font-medium">{appointment.service}</p>
                          <p className="text-sm text-muted-foreground">
                            {appointment.date} at {appointment.time}
                          </p>
                          <p className="text-sm">{appointment.vehicle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
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
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="h-10 w-10 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No upcoming appointments</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    This customer doesn't have any scheduled appointments.
                  </p>
                  <Button asChild>
                    <Link href={`/dashboard/appointments/new?customer=${customer.id}`}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Schedule Appointment
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
