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
import { toast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"

const formSchema = z.object({
  customer_id: z.string({
    required_error: "Please select a customer",
  }),
  vehicle_id: z.string().optional(),
  appointment_id: z.string().optional(),
  service: z.string().min(1, {
    message: "Service is required",
  }),
  description: z.string().optional(),
  notes: z.string().optional(),
  technician: z.string().optional(),
  status: z.enum(["estimate", "in_progress", "completed", "cancelled"]).default("estimate"),
})

type JobFormValues = z.infer<typeof formSchema>

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

interface Appointment {
  id: string
  service: string
  date: string
  time: string
  customers: {
    name: string
  }
  vehicles?: {
    make: string
    model: string
    year: string
  }
}

interface JobFormProps {
  initialData?: (JobFormValues & { id: string }) | null
  customerId?: string
  appointmentId?: string
  onSuccess?: () => void
}

export function JobForm({ initialData, customerId, appointmentId, onSuccess }: JobFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [vehicles, setVehicles] = useState<any[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  const form = useForm<JobFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      customer_id: customerId || "",
      vehicle_id: "",
      appointment_id: appointmentId || "",
      service: "",
      description: "",
      notes: "",
      technician: "",
      status: "estimate",
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

  useEffect(() => {
    const fetchAppointments = async () => {
      if (selectedCustomerId) {
        try {
          const data = await apiClient.getAppointments({ customerId: selectedCustomerId })
          setAppointments(data)
        } catch (error) {
          console.error("Error fetching appointments:", error)
        }
      } else {
        setAppointments([])
      }
    }

    fetchAppointments()
  }, [selectedCustomerId])

  const onSubmit = async (data: JobFormValues) => {
    try {
      setLoading(true)

      if (initialData) {
        // Update existing job
        await apiClient.updateJob(initialData.id, data)
      } else {
        // Create new job
        await apiClient.createJob(data)
      }

      toast({
        title: initialData ? "Job updated" : "Job created",
        description: initialData
          ? "Your job has been updated successfully."
          : "Your job has been created successfully.",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/dashboard/jobs")
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
          name="appointment_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Related Appointment (Optional)</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!selectedCustomerId}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an appointment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">No related appointment</SelectItem>
                  {appointments.map((appointment) => (
                    <SelectItem key={appointment.id} value={appointment.id}>
                      {appointment.service} - {appointment.date} {appointment.time}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Link this job to an existing appointment</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="service"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service</FormLabel>
              <FormControl>
                <Input placeholder="Oil Change, Brake Repair, etc." {...field} />
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
                <Textarea
                  placeholder="Detailed description of the work to be performed"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="technician"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Technician</FormLabel>
                <FormControl>
                  <Input placeholder="Who will perform the work?" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="estimate">Estimate</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any additional notes or special instructions"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Job" : "Create Job"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
