import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { data, error } = await supabase
      .from("jobs")
      .select(`
        *,
        customers (
          id,
          name,
          phone,
          email,
          address
        ),
        vehicles (
          id,
          make,
          model,
          year,
          license_plate,
          vin,
          color
        ),
        estimates (
          id,
          line_items,
          subtotal,
          tax,
          total,
          approved,
          approved_at
        ),
        invoices (
          id,
          line_items,
          subtotal,
          tax,
          total,
          payment_status,
          payment_method,
          paid_at,
          stripe_checkout_id
        )
      `)
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching job:", error)
      return new NextResponse("Error fetching job", { status: 500 })
    }

    if (!data) {
      return new NextResponse("Job not found", { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { appointment_id, customer_id, vehicle_id, service, description, status, notes, technician, images } = body

    // First check if the job exists and belongs to the user
    const { data: existingJob, error: fetchError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (fetchError || !existingJob) {
      return new NextResponse("Job not found", { status: 404 })
    }

    // If customer_id is provided, verify it belongs to the user
    if (customer_id) {
      const { data: customerData, error: customerError } = await supabase
        .from("customers")
        .select("id")
        .eq("id", customer_id)
        .eq("user_id", userId)
        .single()

      if (customerError || !customerData) {
        return new NextResponse("Customer not found or does not belong to user", { status: 404 })
      }
    }

    // If vehicle_id is provided, verify it belongs to the customer
    if (vehicle_id && customer_id) {
      const { data: vehicleData, error: vehicleError } = await supabase
        .from("vehicles")
        .select("id")
        .eq("id", vehicle_id)
        .eq("customer_id", customer_id)
        .single()

      if (vehicleError || !vehicleData) {
        return new NextResponse("Vehicle not found or does not belong to customer", { status: 404 })
      }
    }

    // If appointment_id is provided, verify it belongs to the user
    if (appointment_id) {
      const { data: appointmentData, error: appointmentError } = await supabase
        .from("appointments")
        .select("id")
        .eq("id", appointment_id)
        .eq("user_id", userId)
        .single()

      if (appointmentError || !appointmentData) {
        return new NextResponse("Appointment not found or does not belong to user", { status: 404 })
      }
    }

    const { data, error } = await supabase
      .from("jobs")
      .update({
        appointment_id: appointment_id || undefined,
        customer_id: customer_id || undefined,
        vehicle_id: vehicle_id || undefined,
        service: service || undefined,
        description: description !== undefined ? description : undefined,
        status: status || undefined,
        notes: notes !== undefined ? notes : undefined,
        technician: technician || undefined,
        images: images || undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating job:", error)
      return new NextResponse("Error updating job", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    // First check if the job exists and belongs to the user
    const { data: existingJob, error: fetchError } = await supabase
      .from("jobs")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (fetchError || !existingJob) {
      return new NextResponse("Job not found", { status: 404 })
    }

    const { error } = await supabase.from("jobs").delete().eq("id", params.id).eq("user_id", userId)

    if (error) {
      console.error("Error deleting job:", error)
      return new NextResponse("Error deleting job", { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
