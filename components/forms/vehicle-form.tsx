"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { toast } from "@/components/ui/use-toast"

const formSchema = z.object({
  customer_id: z.string({
    required_error: "Please select a customer",
  }),
  make: z.string().min(1, {
    message: "Make is required",
  }),
  model: z.string().min(1, {
    message: "Model is required",
  }),
  year: z.string().optional(),
  vin: z.string().optional(),
  license_plate: z.string().optional(),
  color: z.string().optional(),
  notes: z.string().optional(),
})

type VehicleFormValues = z.infer<typeof formSchema>

interface Customer {
  id: string
  name: string
}

interface VehicleFormProps {
  initialData?: (VehicleFormValues & { id: string }) | null
  customerId?: string
  onSuccess?: () => void
}

export function VehicleForm({ initialData, customerId, onSuccess }: VehicleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      customer_id: customerId || "",
      make: "",
      model: "",
      year: "",
      vin: "",
      license_plate: "",
      color: "",
      notes: "",
    },
  })

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true)
        const response = await fetch("/api/customers")

        if (!response.ok) {
          throw new Error("Failed to fetch customers")
        }

        const data = await response.json()
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

  const onSubmit = async (data: VehicleFormValues) => {
    try {
      setLoading(true)

      if (initialData) {
        // Update existing vehicle
        const response = await fetch(`/api/vehicles/${initialData.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to update vehicle")
        }
      } else {
        // Create new vehicle
        const response = await fetch("/api/vehicles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          throw new Error("Failed to create vehicle")
        }
      }

      toast({
        title: initialData ? "Vehicle updated" : "Vehicle created",
        description: initialData
          ? "Your vehicle has been updated successfully."
          : "Your vehicle has been created successfully.",
      })

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(customerId ? `/dashboard/customers/${customerId}` : "/dashboard/vehicles")
        router.refresh()
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Something went wrong.",
      })
    } finally {
      setLoading(false)
    }
  }
}
