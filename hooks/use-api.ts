"use client"

import { useState, useEffect } from "react"
import { apiClient } from "@/lib/api"
import { toast } from "@/components/ui/use-toast"

export function useCustomers() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getCustomers()
      setCustomers(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch customers"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  return {
    customers,
    loading,
    error,
    refetch: fetchCustomers,
  }
}

export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getCustomer(id)
      setCustomer(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch customer"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchCustomer()
    }
  }, [id])

  return {
    customer,
    loading,
    error,
    refetch: fetchCustomer,
  }
}

export function useVehicles(customerId?: string) {
  const [vehicles, setVehicles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVehicles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getVehicles(customerId)
      setVehicles(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch vehicles"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehicles()
  }, [customerId])

  return {
    vehicles,
    loading,
    error,
    refetch: fetchVehicles,
  }
}

export function useAppointments(params?: { customerId?: string; vehicleId?: string; status?: string; date?: string }) {
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getAppointments(params)
      setAppointments(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch appointments"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [params?.customerId, params?.vehicleId, params?.status, params?.date])

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
  }
}

export function useJobs(params?: { customerId?: string; vehicleId?: string; status?: string }) {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getJobs(params)
      setJobs(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch jobs"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchJobs()
  }, [params?.customerId, params?.vehicleId, params?.status])

  return {
    jobs,
    loading,
    error,
    refetch: fetchJobs,
  }
}

export function useDashboardStats() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await apiClient.getDashboardStats()
      setStats(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch dashboard stats"
      setError(errorMessage)
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
