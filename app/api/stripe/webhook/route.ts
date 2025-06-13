import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = req.headers.get("stripe-signature") as string

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error(`Webhook signature verification failed: ${error.message}`)
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 })
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session

    // Get the invoice ID from the metadata
    const invoiceId = session.metadata?.invoice_id

    if (!invoiceId) {
      console.error("No invoice ID found in session metadata")
      return new NextResponse("No invoice ID found in session metadata", { status: 400 })
    }

    // Use the service role client for webhook operations
    const supabase = createServerSupabaseClient()

    // Update the invoice with payment information
    const { error } = await supabase
      .from("invoices")
      .update({
        payment_status: "paid",
        payment_method: "Credit Card",
        paid_at: new Date().toISOString(),
        stripe_payment_intent_id: session.payment_intent as string,
        updated_at: new Date().toISOString(),
      })
      .eq("id", invoiceId)

    if (error) {
      console.error("Error updating invoice:", error)
      return new NextResponse("Error updating invoice", { status: 500 })
    }

    // TODO: Send payment confirmation email to customer
  }

  return new NextResponse(JSON.stringify({ received: true }))
}

export const config = {
  api: {
    bodyParser: false,
  },
}
