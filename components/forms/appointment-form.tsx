"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"

const formSchema = z.object({
  customer_id: z.string({
    required_error: "Please select a customer",
  }),
  vehicle_id: z.string().optional(),
  service: z.string().min(1, {
    message: "Service is required",
  }),
  description: z.string().optional(),
  date: z.string({
    required_error: "Date is required",
  }),
  time: z.string({
    required_error: "Time is required",
  }),
  duration: z.number().min(15).max(480).default(60),
  address: z.string().optional(),
  notes: z.string().optional(),
  reminder_email: z.boolean().default(true),
  reminder_sms: z.boolean().default(true),
})

type AppointmentFormValues = z.infer<typeof formSchema>

interface Customer {
  id: string
  name: string
  vehicles?: Array<{
    id: string
    make: string
    model: string
    year: string
  }>
}

interface AppointmentFormProps {
  initialData?: (AppointmentFormValues & { id: string }) | null
  customerId?: string
  vehicleId?: string
  onSuccess?: () => void
}

export function AppointmentForm({ initialData, customerId, vehicleId, onSuccess }: AppointmentFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      customer_id: customerId || "",
      vehicle_id: vehicleId || "",
      service: "",
      description: "",
      date: "",
      time: "",
      duration: 60,
      address: "",
      notes: "",
      reminder_email: true,
      reminder_sms: true,
    },
  })

  const selectedCustomerId = form.watch("customer_id")

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true)
        const data = await apiClient.getCustomers()
        setCustomers(data)
      } catch (error) {
        console.error("Error fetching customers:", error)
        toast({
          title: "Error",
          description: "Failed to load customers. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoadingCustomers(false)
      }
    }

    fetchCustomers()
  }, [])

  useEffect(() => {
    const fetchVehicles = async () => {
      if (selectedCustomerId) {
        try {
          const data = await apiClient.getVehicles(selectedCustomerId)
          setVehicles(data)
        } catch (error) {
          console.error("Error fetching vehicles:", error)
        }
      } else {
        setVehicles([])
      }
    }

    fetchVehicles()
  }, [selectedCustomerId])

  const onSubmit = async (data: AppointmentFormValues) => {
    try {
      setLoading(true)

      if (initialData) {
        // Update existing appointment
        await apiClient.updateAppointment(initialData.id, data)
      } else {
        // Create new appointment
        await apiClient.createAppointment(data)
      }

      toast({
        title: initialData ? "Appointment updated" : "Appointment created",
        description: initialData
          ? "Your appointment has been updated successfully."
          : "Your appointment has been created successfully.",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dashboard/appointments")
        router.refresh()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="customer_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Customer</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingCustomers}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a customer" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vehicle_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle (Optional)</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCustomerId}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a vehicle" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">No specific vehicle</SelectItem>
                    {vehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <FormControl>
                <Input placeholder="Oil Change, Brake Inspection, etc." {...field} />
              </FormControl>
              <FormDescription>What service will be performed?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional details about the service" className="min-h-[80px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="15"
                    max="480"
                    {...field}
                    onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 60)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Address</FormLabel>
              <FormControl>
                <Input placeholder="Where will the service be performed?" {...field} />
              </FormControl>
              <FormDescription>Leave blank to use customer's address</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes or special instructions"
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <FormField
            control={form.control}
            name="reminder_email"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Send email reminder</FormLabel>
                  <FormDescription>Send an email reminder to the customer before the appointment</FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="reminder_sms"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Send SMS reminder</FormLabel>
                  <FormDescription>Send an SMS reminder to the customer before the appointment</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Appointment" : "Create Appointment"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
