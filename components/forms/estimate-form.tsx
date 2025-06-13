"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useFieldArray } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { apiClient } from "@/lib/api"
import { formatCurrency, calculateTotal } from "@/lib/utils"

const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(0.01, "Quantity must be greater than 0"),
  unitPrice: z.number().min(0, "Unit price must be 0 or greater"),
  type: z.enum(["Parts", "Labor"]),
})

const formSchema = z.object({
  job_id: z.string({
    required_error: "Please select a job",
  }),
  line_items: z.array(lineItemSchema).min(1, "At least one line item is required"),
})

type EstimateFormValues = z.infer<typeof formSchema>

interface Job {
  id: string
  service: string
  customers: {
    name: string
  }
  vehicles?: {
    make: string
    model: string
    year: string
  }
}

interface EstimateFormProps {
  initialData?: any
  jobId?: string
  onSuccess?: () => void
}

export function EstimateForm({ initialData, jobId, onSuccess }: EstimateFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loadingJobs, setLoadingJobs] = useState(false)

  const form = useForm<EstimateFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      job_id: jobId || "",
      line_items: [
        {
          description: "",
          quantity: 1,
          unitPrice: 0,
          type: "Labor" as const,
        },
      ],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "line_items",
  })

  const watchedLineItems = form.watch("line_items")

  // Calculate totals
  const lineItemsWithTotals = watchedLineItems.map((item, index) => ({
    ...item,
    total: (item.quantity || 0) * (item.unitPrice || 0),
  }))

  const { subtotal, tax, total } = calculateTotal(lineItemsWithTotals)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoadingJobs(true)
        const data = await apiClient.getJobs({ status: "estimate" })
        setJobs(data)
      } catch (error) {
        console.error("Error fetching jobs:", error)
        toast({
          title: "Error",
          description: "Failed to load jobs. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setLoadingJobs(false)
      }
    }

    if (!jobId) {
      fetchJobs()
    }
  }, [jobId])

  const onSubmit = async (data: EstimateFormValues) => {
    try {
      setLoading(true)

      // Add calculated totals to line items
      const lineItemsWithTotals = data.line_items.map((item) => ({
        ...item,
        total: item.quantity * item.unitPrice,
      }))

      if (initialData) {
        // Update existing estimate
        await apiClient.updateEstimate(initialData.id, {
          line_items: lineItemsWithTotals,
        })
      } else {
        // Create new estimate
        await apiClient.createEstimate({
          job_id: data.job_id,
          line_items: lineItemsWithTotals,
        })
      }

      toast({
        title: initialData ? "Estimate updated" : "Estimate created",
        description: initialData
          ? "Your estimate has been updated successfully."
          : "Your estimate has been created successfully.",
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

  const addLineItem = () => {
    append({
      description: "",
      quantity: 1,
      unitPrice: 0,
      type: "Labor",
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {!jobId && (
          <FormField
            control={form.control}
            name="job_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={loadingJobs}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a job" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {jobs.map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        {job.service} - {job.customers.name}
                        {job.vehicles && ` (${job.vehicles.year} ${job.vehicles.make} ${job.vehicles.model})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Line Items</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addLineItem}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name={`line_items.${index}.description`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input placeholder="Oil filter, Labor, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={`line_items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Qty</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={`line_items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            {...field}
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name={`line_items.${index}.type`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Parts">Parts</SelectItem>
                            <SelectItem value="Labor">Labor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{formatCurrency(lineItemsWithTotals[index]?.total || 0)}</div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (10%):</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Estimate" : "Create Estimate"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
