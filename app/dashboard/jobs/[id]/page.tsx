import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowLeft, Calendar, Check, FileText, Pencil, Printer, Send, Wrench } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function JobDetailPage({ params }: { params: { id: string } }) {
  // Mock data for a job
  const job = {
    id: params.id,
    customer: {
      id: "1",
      name: "John Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
      address: "123 Main St, Anytown, CA 12345",
    },
    vehicle: {
      id: "1",
      make: "Honda",
      model: "Civic",
      year: "2018",
      licensePlate: "ABC123",
      vin: "1HGCM82633A123456",
    },
    service: "Oil Change and Tire Rotation",
    description: "Regular maintenance service including oil change, filter replacement, and tire rotation.",
    date: "2023-06-10",
    startTime: "09:00 AM",
    endTime: "10:30 AM",
    status: "Completed",
    lineItems: [
      {
        id: "1",
        description: "Synthetic Oil (5W-30)",
        quantity: 5,
        unitPrice: "$12.00",
        total: "$60.00",
        type: "Parts",
      },
      {
        id: "2",
        description: "Oil Filter",
        quantity: 1,
        unitPrice: "$8.00",
        total: "$8.00",
        type: "Parts",
      },
      {
        id: "3",
        description: "Labor - Oil Change",
        quantity: 0.5,
        unitPrice: "$80.00",
        total: "$40.00",
        type: "Labor",
      },
      {
        id: "4",
        description: "Labor - Tire Rotation",
        quantity: 0.25,
        unitPrice: "$80.00",
        total: "$20.00",
        type: "Labor",
      },
    ],
    subtotal: "$128.00",
    tax: "$12.80",
    total: "$140.80",
    notes:
      "Customer requested synthetic oil. All work completed as requested. Recommended brake inspection on next visit.",
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    paymentDate: "2023-06-10",
    technician: "Mike Johnson",
  }

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/jobs">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Job #{job.id}</h2>
        <Badge
          className={
            job.status === "Completed"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : job.status === "In Progress"
                ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                : job.status === "Estimate"
                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {job.status}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>Service information and line items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 mb-6">
              <div>
                <div className="text-sm font-medium">Service</div>
                <div className="text-sm">{job.service}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Date</div>
                <div className="text-sm">{job.date}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Time</div>
                <div className="text-sm">
                  {job.startTime} - {job.endTime}
                </div>
              </div>
              <div>
                <div className="text-sm font-medium">Technician</div>
                <div className="text-sm">{job.technician}</div>
              </div>
            </div>

            <div className="text-sm font-medium mb-2">Description</div>
            <div className="text-sm mb-6 p-2 border rounded-md">{job.description}</div>

            <div className="text-sm font-medium mb-2">Line Items</div>
            <div className="rounded-md border mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {job.lineItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-xs text-muted-foreground">{item.type}</div>
                      </TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.unitPrice}</TableCell>
                      <TableCell className="text-right">{item.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <div>Subtotal</div>
                <div>{job.subtotal}</div>
              </div>
              <div className="flex justify-between text-sm">
                <div>Tax</div>
                <div>{job.tax}</div>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <div>Total</div>
                <div>{job.total}</div>
              </div>
            </div>

            <div className="mt-6">
              <div className="text-sm font-medium mb-2">Notes</div>
              <div className="text-sm p-2 border rounded-md">{job.notes}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Payment Status:</div>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{job.paymentStatus}</Badge>
              <div className="text-sm text-muted-foreground">
                {job.paymentMethod} - {job.paymentDate}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Send className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button size="sm">
                <Pencil className="h-4 w-4 mr-2" />
                Edit
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
                  <div className="font-medium">{job.customer.name}</div>
                  <div className="text-sm">{job.customer.email}</div>
                  <div className="text-sm">{job.customer.phone}</div>
                  <div className="text-sm text-muted-foreground mt-1">{job.customer.address}</div>
                  <Button variant="link" size="sm" className="px-0 mt-1" asChild>
                    <Link href={`/dashboard/customers/${job.customer.id}`}>View Customer</Link>
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
                        {job.vehicle.year} {job.vehicle.make} {job.vehicle.model}
                      </div>
                      <div className="text-sm">License: {job.vehicle.licensePlate}</div>
                      <div className="text-sm text-muted-foreground">VIN: {job.vehicle.vin}</div>
                      <Button variant="link" size="sm" className="px-0 mt-1" asChild>
                        <Link href={`/dashboard/vehicles/${job.vehicle.id}`}>View Vehicle</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button variant="outline" asChild>
                  <Link href={`/dashboard/appointments/new?customer=${job.customer.id}`}>
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Follow-up
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/dashboard/jobs/new?customer=${job.customer.id}`}>
                    <FileText className="h-4 w-4 mr-2" />
                    Create New Estimate
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList>
          <TabsTrigger value="timeline">Job Timeline</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle>Job Timeline</CardTitle>
              <CardDescription>Timeline of events for this job</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <Check className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Job Completed</p>
                      <p className="text-xs text-muted-foreground">10:30 AM</p>
                    </div>
                    <p className="text-sm text-muted-foreground">All work completed and payment processed.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Wrench className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Work In Progress</p>
                      <p className="text-xs text-muted-foreground">09:15 AM</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Oil change and tire rotation in progress.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                    <Calendar className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Job Started</p>
                      <p className="text-xs text-muted-foreground">09:00 AM</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Vehicle checked in and work started.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <FileText className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Estimate Approved</p>
                      <p className="text-xs text-muted-foreground">06/09/2023 - 04:30 PM</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Customer approved the estimate for oil change and tire rotation.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100">
                    <FileText className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Estimate Created</p>
                      <p className="text-xs text-muted-foreground">06/09/2023 - 02:15 PM</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Estimate created and sent to customer.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="photos">
          <Card>
            <CardHeader>
              <CardTitle>Job Photos</CardTitle>
              <CardDescription>Photos taken during the service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No photos available</h3>
                <p className="text-sm text-muted-foreground mb-4">No photos were taken during this service.</p>
                <Button>Upload Photos</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
