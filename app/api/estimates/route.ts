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
      .select("id")
      .eq("id", job_id)
      .eq("user_id", userId)
      .single()

    if (jobError || !jobData) {
      return new NextResponse("Job not found or does not belong to user", { status: 404 })
    }

    // Calculate totals
    const { subtotal, tax, total } = calculateTotal(line_items)

    const { data, error } = await supabase
      .from("estimates")
      .insert({
        job_id,
        line_items,
        subtotal,
        tax,
        total,
        approved: false,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating estimate:", error)
      return new NextResponse("Error creating estimate", { status: 500 })
    }

    // Update job status to estimate if it's not already
    await supabase.from("jobs").update({ status: "estimate" }).eq("id", job_id).eq("user_id", userId)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
