import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { invoice_id, success_url, cancel_url } = body

    if (!invoice_id || !success_url || !cancel_url) {
      return new NextResponse("Invoice ID, success URL, and cancel URL are required", { status: 400 })
    }

    // Fetch the invoice and related data
    const { data: invoice, error: invoiceError } = await supabase
      .from("invoices")
      .select(`
        *,
        jobs!inner (
          id,
          user_id,
          service,
          customer_id,
          vehicle_id,
          customers (
            id,
            name,
            email
          )
        )
      `)
      .eq("id", invoice_id)
      .eq("jobs.user_id", userId)
      .single()

    if (invoiceError || !invoice) {
      console.error("Error fetching invoice:", invoiceError)
      return new NextResponse("Invoice not found", { status: 404 })
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: invoice.jobs.service,
              description: `Invoice #${invoice.id.slice(0, 8)}`,
            },
            unit_amount: Math.round(invoice.total * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      customer_email: invoice.jobs.customers.email || undefined,
      client_reference_id: invoice.id,
      metadata: {
        invoice_id: invoice.id,
        job_id: invoice.job_id,
        customer_id: invoice.jobs.customer_id,
      },
      mode: "payment",
      success_url: `${success_url}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancel_url,
    })

    // Update the invoice with the checkout session ID
    await supabase
      .from("invoices")
      .update({
        stripe_checkout_id: session.id,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoice_id)

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error)
    return new NextResponse("Error creating Stripe checkout session", { status: 500 })
  }
}
