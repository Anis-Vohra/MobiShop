import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import twilio from "twilio"
import { formatDate, formatTime } from "@/lib/utils"

const twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { appointment_id } = body

    if (!appointment_id) {
      return new NextResponse("Appointment ID is required", { status: 400 })
    }

    // Fetch the appointment and related data
    const { data: appointment, error: appointmentError } = await supabase
      .from("appointments")
      .select(`
        *,
        customers (
          id,
          name,
          phone
        ),
        vehicles (
          id,
          make,
          model,
          year
        )
      `)
      .eq("id", appointment_id)
      .eq("user_id", userId)
      .single()

    if (appointmentError || !appointment) {
      console.error("Error fetching appointment:", appointmentError)
      return new NextResponse("Appointment not found", { status: 404 })
    }

    // Check if the customer has a phone number
    if (!appointment.customers.phone) {
      return new NextResponse("Customer does not have a phone number", { status: 400 })
    }

    // Format the message
    const vehicleInfo = appointment.vehicles
      ? `${appointment.vehicles.year} ${appointment.vehicles.make} ${appointment.vehicles.model}`
      : "your vehicle"

    const message = `Reminder: You have an appointment for ${appointment.service} on ${formatDate(appointment.date)} at ${formatTime(appointment.time)} for ${vehicleInfo}. Reply C to confirm or R to reschedule.`

    // Send the SMS
    const twilioMessage = await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: appointment.customers.phone,
    })

    return NextResponse.json({
      success: true,
      message_sid: twilioMessage.sid,
    })
  } catch (error) {
    console.error("Error sending SMS reminder:", error)
    return new NextResponse("Error sending SMS reminder", { status: 500 })
  }
}
