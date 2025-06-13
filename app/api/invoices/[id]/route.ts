import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { calculateTotal } from "@/lib/utils"

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const { data, error } = await supabase
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
            email,
            phone,
            address
          ),
          vehicles (
            id,
            make,
            model,
            year,
            license_plate
          )
        )
      `)
      .eq("id", params.id)
      .eq("jobs.user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching invoice:", error)
      return new NextResponse("Error fetching invoice", { status: 500 })
    }

    if (!data) {
      return new NextResponse("Invoice not found", { status: 404 })
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
    const { line_items, payment_status, payment_method, paid_at, stripe_checkout_id, stripe_payment_intent_id } = body

    // First check if the invoice exists and belongs to the user's job
    const { data: existingInvoice, error: fetchError } = await supabase
      .from("invoices")
      .select(`
        id,
        jobs!inner (
          user_id
        )
      `)
      .eq("id", params.id)
      .eq("jobs.user_id", userId)
      .single()

    if (fetchError || !existingInvoice) {
      return new NextResponse("Invoice not found", { status: 404 })
    }

    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    // If line_items are provided, recalculate totals
    if (line_items && Array.isArray(line_items)) {
      const { subtotal, tax, total } = calculateTotal(line_items)
      updateData.line_items = line_items
      updateData.subtotal = subtotal
      updateData.tax = tax
      updateData.total = total
    }

    // Update payment information if provided
    if (payment_status) updateData.payment_status = payment_status
    if (payment_method) updateData.payment_method = payment_method
    if (paid_at) updateData.paid_at = paid_at
    if (stripe_checkout_id) updateData.stripe_checkout_id = stripe_checkout_id
    if (stripe_payment_intent_id) updateData.stripe_payment_intent_id = stripe_payment_intent_id

    // If payment_status is set to paid and paid_at is not provided, set it to now
    if (payment_status === "paid" && !paid_at) {
      updateData.paid_at = new Date().toISOString()
    }

    const { data, error } = await supabase.from("invoices").update(updateData).eq("id", params.id).select().single()

    if (error) {
      console.error("Error updating invoice:", error)
      return new NextResponse("Error updating invoice", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
