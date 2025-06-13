import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { calculateTotal } from "@/lib/utils"

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { job_id, line_items } = body

    if (!job_id || !line_items || !Array.isArray(line_items)) {
      return new NextResponse("Job ID and line items are required", { status: 400 })
    }

    // Verify the job belongs to the user
    const { data: jobData, error: jobError } = await supabase
      .from("jobs")
      .select("id, status")
      .eq("id", job_id)
      .eq("user_id", userId)
      .single()

    if (jobError || !jobData) {
      return new NextResponse("Job not found or does not belong to user", { status: 404 })
    }

    // Calculate totals
    const { subtotal, tax, total } = calculateTotal(line_items)

    const { data, error } = await supabase
      .from("invoices")
      .insert({
        job_id,
        line_items,
        subtotal,
        tax,
        total,
        payment_status: "unpaid",
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating invoice:", error)
      return new NextResponse("Error creating invoice", { status: 500 })
    }

    // Update job status to completed if it's in_progress
    if (jobData.status === "in_progress") {
      await supabase.from("jobs").update({ status: "completed" }).eq("id", job_id).eq("user_id", userId)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
