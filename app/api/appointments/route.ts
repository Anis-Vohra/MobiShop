import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { userId } = auth()
  const url = new URL(req.url)
  const customerId = url.searchParams.get("customerId")
  const vehicleId = url.searchParams.get("vehicleId")
  const status = url.searchParams.get("status")
  const date = url.searchParams.get("date")

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    let query = supabase
      .from("appointments")
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

    if (date) {
      query = query.eq("date", date)
    }

    const { data, error } = await query.order("date", { ascending: true }).order("time", { ascending: true })

    if (error) {
      console.error("Error fetching appointments:", error)
      return new NextResponse("Error fetching appointments", { status: 500 })
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
      customer_id,
      vehicle_id,
      service,
      description,
      date,
      time,
      duration,
      address,
      notes,
      reminder_email,
      reminder_sms,
    } = body

    if (!customer_id || !service || !date || !time) {
      return new NextResponse("Customer ID, service, date, and time are required", { status: 400 })
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

    const { data, error } = await supabase
      .from("appointments")
      .insert({
        user_id: userId,
        customer_id,
        vehicle_id,
        service,
        description,
        date,
        time,
        duration: duration || 60,
        address,
        notes,
        reminder_email: reminder_email !== undefined ? reminder_email : true,
        reminder_sms: reminder_sms !== undefined ? reminder_sms : true,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating appointment:", error)
      return new NextResponse("Error creating appointment", { status: 500 })
    }

    // TODO: Schedule email and SMS reminders

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
