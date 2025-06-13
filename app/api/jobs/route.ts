import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { userId } = auth()
  const url = new URL(req.url)
  const customerId = url.searchParams.get("customerId")
  const vehicleId = url.searchParams.get("vehicleId")
  const status = url.searchParams.get("status")

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    let query = supabase
      .from("jobs")
      .select(`
        *,
        customers (
          id,
          name
        ),
        vehicles (
          id,
          make,
          model,
          year,
          license_plate
        ),
        estimates (
          id,
          subtotal,
          tax,
          total,
          approved,
          approved_at
        ),
        invoices (
          id,
          subtotal,
          tax,
          total,
          payment_status,
          payment_method,
          paid_at
        )
      `)
      .eq("user_id", userId)

    if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    if (vehicleId) {
      query = query.eq("vehicle_id", vehicleId)
    }

    if (status) {
      query = query.eq("status", status)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching jobs:", error)
      return new NextResponse("Error fetching jobs", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const {
      appointment_id,
      customer_id,
      vehicle_id,
      service,
      description,
      notes,
      technician,
      status = "estimate",
    } = body

    if (!customer_id || !service) {
      return new NextResponse("Customer ID and service are required", { status: 400 })
    }

    // Verify the customer belongs to the user
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("id", customer_id)
      .eq("user_id", userId)
      .single()

    if (customerError || !customerData) {
      return new NextResponse("Customer not found or does not belong to user", { status: 404 })
    }

    // If vehicle_id is provided, verify it belongs to the customer
    if (vehicle_id) {
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
      .insert({
        user_id: userId,
        appointment_id,
        customer_id,
        vehicle_id,
        service,
        description,
        notes,
        technician,
        status,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating job:", error)
      return new NextResponse("Error creating job", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
