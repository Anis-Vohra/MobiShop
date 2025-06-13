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
      .from("appointments")
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
          vin
        )
      `)
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching appointment:", error)
      return new NextResponse("Error fetching appointment", { status: 500 })
    }

    if (!data) {
      return new NextResponse("Appointment not found", { status: 404 })
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
    const {
      customer_id,
      vehicle_id,
      service,
      description,
      date,
      time,
      duration,
      address,
      status,
      notes,
      reminder_email,
      reminder_sms,
    } = body

    // First check if the appointment exists and belongs to the user
    const { data: existingAppointment, error: fetchError } = await supabase
      .from("appointments")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (fetchError || !existingAppointment) {
      return new NextResponse("Appointment not found", { status: 404 })
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

    const { data, error } = await supabase
      .from("appointments")
      .update({
        customer_id: customer_id || undefined,
        vehicle_id: vehicle_id || undefined,
        service: service || undefined,
        description: description !== undefined ? description : undefined,
        date: date || undefined,
        time: time || undefined,
        duration: duration || undefined,
        address: address !== undefined ? address : undefined,
        status: status || undefined,
        notes: notes !== undefined ? notes : undefined,
        reminder_email: reminder_email !== undefined ? reminder_email : undefined,
        reminder_sms: reminder_sms !== undefined ? reminder_sms : undefined,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating appointment:", error)
      return new NextResponse("Error updating appointment", { status: 500 })
    }

    // TODO: Update email and SMS reminders if date/time changed

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
    // First check if the appointment exists and belongs to the user
    const { data: existingAppointment, error: fetchError } = await supabase
      .from("appointments")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (fetchError || !existingAppointment) {
      return new NextResponse("Appointment not found", { status: 404 })
    }

    const { error } = await supabase.from("appointments").delete().eq("id", params.id).eq("user_id", userId)

    if (error) {
      console.error("Error deleting appointment:", error)
      return new NextResponse("Error deleting appointment", { status: 500 })
    }

    // TODO: Cancel any scheduled reminders

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
