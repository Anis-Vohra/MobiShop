import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AppointmentForm } from "@/components/forms/appointment-form"

export default function NewAppointmentPage() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Schedule Appointment</h2>
      </div>

      <Card className="max-w-4xl">
        <CardHeader>
          <CardTitle>Appointment Details</CardTitle>
          <CardDescription>Schedule a new appointment for a customer.</CardDescription>
        </CardHeader>
        <CardContent>
          <AppointmentForm />
        </CardContent>
      </Card>
    </div>
  )
}
