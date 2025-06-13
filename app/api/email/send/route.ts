import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import sgMail from "@sendgrid/mail"
import { formatDate, formatTime, formatCurrency } from "@/lib/utils"

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { type, id } = body

    if (!type || !id) {
      return new NextResponse("Type and ID are required", { status: 400 })
    }

    // Handle different email types
    switch (type) {
      case "appointment_reminder":
        return await sendAppointmentReminder(id, userId)
      case "estimate_approval":
        return await sendEstimateApproval(id, userId)
      case "invoice_payment":
        return await sendInvoicePayment(id, userId)
      default:
        return new NextResponse("Invalid email type", { status: 400 })
    }
  } catch (error) {
    console.error("Error sending email:", error)
    return new NextResponse("Error sending email", { status: 500 })
  }
}

async function sendAppointmentReminder(appointmentId: string, userId: string) {
  // Fetch the appointment and related data
  const { data: appointment, error: appointmentError } = await supabase
    .from("appointments")
    .select(`
      *,
      customers (
        id,
        name,
        email
      ),
      vehicles (
        id,
        make,
        model,
        year
      )
    `)
    .eq("id", appointmentId)
    .eq("user_id", userId)
    .single()

  if (appointmentError || !appointment) {
    console.error("Error fetching appointment:", appointmentError)
    return new NextResponse("Appointment not found", { status: 404 })
  }

  // Check if the customer has an email
  if (!appointment.customers.email) {
    return new NextResponse("Customer does not have an email", { status: 400 })
  }

  // Format the vehicle info
  const vehicleInfo = appointment.vehicles
    ? `${appointment.vehicles.year} ${appointment.vehicles.make} ${appointment.vehicles.model}`
    : "your vehicle"

  // Create the email
  const msg = {
    to: appointment.customers.email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Appointment Reminder: ${appointment.service} on ${formatDate(appointment.date)}`,
    text: `Hello ${appointment.customers.name},\n\nThis is a reminder that you have an appointment for ${appointment.service} on ${formatDate(appointment.date)} at ${formatTime(appointment.time)} for ${vehicleInfo}.\n\nIf you need to reschedule, please contact us as soon as possible.\n\nThank you,\nMobiShop`,
    html: `
      <div>
        <h2>Appointment Reminder</h2>
        <p>Hello ${appointment.customers.name},</p>
        <p>This is a reminder that you have an appointment for <strong>${appointment.service}</strong> on <strong>${formatDate(appointment.date)}</strong> at <strong>${formatTime(appointment.time)}</strong> for ${vehicleInfo}.</p>
        <p>If you need to reschedule, please contact us as soon as possible.</p>
        <p>Thank you,<br>MobiShop</p>
      </div>
    `,
  }

  // Send the email
  await sgMail.send(msg)

  return NextResponse.json({ success: true })
}

async function sendEstimateApproval(estimateId: string, userId: string) {
  // Fetch the estimate and related data
  const { data: estimate, error: estimateError } = await supabase
    .from("estimates")
    .select(`
      *,
      jobs!inner (
        id,
        service,
        user_id,
        customers (
          id,
          name,
          email
        ),
        vehicles (
          id,
          make,
          model,
          year
        )
      )
    `)
    .eq("id", estimateId)
    .eq("jobs.user_id", userId)
    .single()

  if (estimateError || !estimate) {
    console.error("Error fetching estimate:", estimateError)
    return new NextResponse("Estimate not found", { status: 404 })
  }

  // Check if the customer has an email
  if (!estimate.jobs.customers.email) {
    return new NextResponse("Customer does not have an email", { status: 400 })
  }

  // Format the vehicle info
  const vehicleInfo = estimate.jobs.vehicles
    ? `${estimate.jobs.vehicles.year} ${estimate.jobs.vehicles.make} ${estimate.jobs.vehicles.model}`
    : "your vehicle"

  // Create the approval URL (this would be a page in your app)
  const approvalUrl = `${process.env.NEXT_PUBLIC_APP_URL}/estimates/${estimateId}/approve`

  // Create the email
  const msg = {
    to: estimate.jobs.customers.email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Estimate for ${estimate.jobs.service}`,
    text: `Hello ${estimate.jobs.customers.name},\n\nWe've prepared an estimate for ${estimate.jobs.service} for ${vehicleInfo}.\n\nTotal: ${formatCurrency(estimate.total)}\n\nTo view and approve this estimate, please visit: ${approvalUrl}\n\nThank you,\nMobiShop`,
    html: `
      <div>
        <h2>Estimate for ${estimate.jobs.service}</h2>
        <p>Hello ${estimate.jobs.customers.name},</p>
        <p>We've prepared an estimate for <strong>${estimate.jobs.service}</strong> for ${vehicleInfo}.</p>
        <p><strong>Total: ${formatCurrency(estimate.total)}</strong></p>
        <p>To view and approve this estimate, please click the button below:</p>
        <p>
          <a href="${approvalUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View and Approve Estimate</a>
        </p>
        <p>Thank you,<br>MobiShop</p>
      </div>
    `,
  }

  // Send the email
  await sgMail.send(msg)

  return NextResponse.json({ success: true })
}

async function sendInvoicePayment(invoiceId: string, userId: string) {
  // Fetch the invoice and related data
  const { data: invoice, error: invoiceError } = await supabase
    .from("invoices")
    .select(`
      *,
      jobs!inner (
        id,
        service,
        user_id,
        customers (
          id,
          name,
          email
        ),
        vehicles (
          id,
          make,
          model,
          year
        )
      )
    `)
    .eq("id", invoiceId)
    .eq("jobs.user_id", userId)
    .single()

  if (invoiceError || !invoice) {
    console.error("Error fetching invoice:", invoiceError)
    return new NextResponse("Invoice not found", { status: 404 })
  }

  // Check if the customer has an email
  if (!invoice.jobs.customers.email) {
    return new NextResponse("Customer does not have an email", { status: 400 })
  }

  // Format the vehicle info
  const vehicleInfo = invoice.jobs.vehicles
    ? `${invoice.jobs.vehicles.year} ${invoice.jobs.vehicles.make} ${invoice.jobs.vehicles.model}`
    : "your vehicle"

  // Create the payment URL (this would be your Stripe checkout page)
  const paymentUrl = `${process.env.NEXT_PUBLIC_APP_URL}/invoices/${invoiceId}/pay`

  // Create the email
  const msg = {
    to: invoice.jobs.customers.email,
    from: process.env.SENDGRID_FROM_EMAIL!,
    subject: `Invoice for ${invoice.jobs.service}`,
    text: `Hello ${invoice.jobs.customers.name},\n\nYour invoice for ${invoice.jobs.service} for ${vehicleInfo} is ready.\n\nTotal: ${formatCurrency(invoice.total)}\n\nTo view and pay this invoice, please visit: ${paymentUrl}\n\nThank you,\nMobiShop`,
    html: `
      <div>
        <h2>Invoice for ${invoice.jobs.service}</h2>
        <p>Hello ${invoice.jobs.customers.name},</p>
        <p>Your invoice for <strong>${invoice.jobs.service}</strong> for ${vehicleInfo} is ready.</p>
        <p><strong>Total: ${formatCurrency(invoice.total)}</strong></p>
        <p>To view and pay this invoice, please click the button below:</p>
        <p>
          <a href="${paymentUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">View and Pay Invoice</a>
        </p>
        <p>Thank you,<br>MobiShop</p>
      </div>
    `,
  }

  // Send the email
  await sgMail.send(msg)

  return NextResponse.json({ success: true })
}
