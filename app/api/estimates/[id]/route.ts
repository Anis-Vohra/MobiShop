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
      .from("estimates")
      .select(`
        *,
        jobs!inner (
          id,
          user_id,
          service,
          customer_id,
          vehicle_id
        )
      `)
      .eq("id", params.id)
      .eq("jobs.user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching estimate:", error)
      return new NextResponse("Error fetching estimate", { status: 500 })
    }

    if (!data) {
      return new NextResponse("Estimate not found", { status: 404 })
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
    const { line_items, approved } = body

    // First check if the estimate exists and belongs to the user's job
    const { data: existingEstimate, error: fetchError } = await supabase
      .from("estimates")
      .select(`
        id,
        job_id,
        jobs!inner (
          user_id
        )
      `)
      .eq("id", params.id)
      .eq("jobs.user_id", userId)
      .single()

    if (fetchError || !existingEstimate) {
      return new NextResponse("Estimate not found", { status: 404 })
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

    // If approved is provided and is true, set approved_at
    if (approved === true) {
      updateData.approved = true
      updateData.approved_at = new Date().toISOString()

      // Update job status to in_progress when estimate is approved
      await supabase
        .from("jobs")
        .update({ status: "in_progress" })
        .eq("id", existingEstimate.job_id)
        .eq("user_id", userId)
    } else if (approved === false) {
      updateData.approved = false
      updateData.approved_at = null
    }

    const { data, error } = await supabase.from("estimates").update(updateData).eq("id", params.id).select().single()

    if (error) {
      console.error("Error updating estimate:", error)
      return new NextResponse("Error updating estimate", { status: 500 })
    }

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
    // First check if the estimate exists and belongs to the user's job
    const { data: existingEstimate, error: fetchError } = await supabase
      .from("estimates")
      .select(`
        id,
        jobs!inner (
          user_id
        )
      `)
      .eq("id", params.id)
      .eq("jobs.user_id", userId)
      .single()

    if (fetchError || !existingEstimate) {
      return new NextResponse("Estimate not found", { status: 404 })
    }

    const { error } = await supabase.from("estimates").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting estimate:", error)
      return new NextResponse("Error deleting estimate", { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
