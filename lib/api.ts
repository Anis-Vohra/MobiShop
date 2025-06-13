// Client-side API functions
export class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_APP_URL || ""
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}/api${endpoint}`

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || `HTTP error! status: ${response.status}`)
    }

    if (response.status === 204) {
      return {} as T
    }

    return response.json()
  }

  // Customer API methods
  async getCustomers() {
    return this.request<any[]>("/customers")
  }

  async getCustomer(id: string) {
    return this.request<any>(`/customers/${id}`)
  }

  async createCustomer(data: any) {
    return this.request<any>("/customers", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateCustomer(id: string, data: any) {
    return this.request<any>(`/customers/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteCustomer(id: string) {
    return this.request<void>(`/customers/${id}`, {
      method: "DELETE",
    })
  }

  // Vehicle API methods
  async getVehicles(customerId?: string) {
    const params = customerId ? `?customerId=${customerId}` : ""
    return this.request<any[]>(`/vehicles${params}`)
  }

  async getVehicle(id: string) {
    return this.request<any>(`/vehicles/${id}`)
  }

  async createVehicle(data: any) {
    return this.request<any>("/vehicles", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateVehicle(id: string, data: any) {
    return this.request<any>(`/vehicles/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteVehicle(id: string) {
    return this.request<void>(`/vehicles/${id}`, {
      method: "DELETE",
    })
  }

  // Appointment API methods
  async getAppointments(params?: { customerId?: string; vehicleId?: string; status?: string; date?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.customerId) searchParams.append("customerId", params.customerId)
    if (params?.vehicleId) searchParams.append("vehicleId", params.vehicleId)
    if (params?.status) searchParams.append("status", params.status)
    if (params?.date) searchParams.append("date", params.date)

    const query = searchParams.toString()
    return this.request<any[]>(`/appointments${query ? `?${query}` : ""}`)
  }

  async getAppointment(id: string) {
    return this.request<any>(`/appointments/${id}`)
  }

  async createAppointment(data: any) {
    return this.request<any>("/appointments", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateAppointment(id: string, data: any) {
    return this.request<any>(`/appointments/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteAppointment(id: string) {
    return this.request<void>(`/appointments/${id}`, {
      method: "DELETE",
    })
  }

  // Job API methods
  async getJobs(params?: { customerId?: string; vehicleId?: string; status?: string }) {
    const searchParams = new URLSearchParams()
    if (params?.customerId) searchParams.append("customerId", params.customerId)
    if (params?.vehicleId) searchParams.append("vehicleId", params.vehicleId)
    if (params?.status) searchParams.append("status", params.status)

    const query = searchParams.toString()
    return this.request<any[]>(`/jobs${query ? `?${query}` : ""}`)
  }

  async getJob(id: string) {
    return this.request<any>(`/jobs/${id}`)
  }

  async createJob(data: any) {
    return this.request<any>("/jobs", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateJob(id: string, data: any) {
    return this.request<any>(`/jobs/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  async deleteJob(id: string) {
    return this.request<void>(`/jobs/${id}`, {
      method: "DELETE",
    })
  }

  // Estimate API methods
  async createEstimate(data: any) {
    return this.request<any>("/estimates", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async updateEstimate(id: string, data: any) {
    return this.request<any>(`/estimates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // Invoice API methods
  async createInvoice(data: any) {
    return this.request<any>("/invoices", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getInvoice(id: string) {
    return this.request<any>(`/invoices/${id}`)
  }

  async updateInvoice(id: string, data: any) {
    return this.request<any>(`/invoices/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    })
  }

  // Payment API methods
  async createStripeCheckout(data: { invoice_id: string; success_url: string; cancel_url: string }) {
    return this.request<{ url: string }>("/stripe/checkout", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Communication API methods
  async sendSmsReminder(appointmentId: string) {
    return this.request<any>("/sms/reminder", {
      method: "POST",
      body: JSON.stringify({ appointment_id: appointmentId }),
    })
  }

  async sendEmail(data: { type: string; id: string }) {
    return this.request<any>("/email/send", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // File upload
  async uploadJobImage(jobId: string, file: File) {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("jobId", jobId)

    const response = await fetch(`${this.baseUrl}/api/storage/upload`, {
      method: "POST",
      body: formData,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request<any>("/dashboard/stats")
  }
}

export const apiClient = new ApiClient()
