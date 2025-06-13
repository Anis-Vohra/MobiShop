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
      .from("customers")
      .select(`
        *,
        vehicles (
          id,
          make,
          model,
          year,
          license_plate,
          vin,
          color,
          notes
        )
      `)
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching customer:", error)
      return new NextResponse("Error fetching customer", { status: 500 })
    }

    if (!data) {
      return new NextResponse("Customer not found", { status: 404 })
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
    const { name, phone, email, address, notes } = body

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    // First check if the customer exists and belongs to the user
    const { data: existingCustomer, error: fetchError } = await supabase
      .from("customers")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (fetchError || !existingCustomer) {
      return new NextResponse("Customer not found", { status: 404 })
    }

    const { data, error } = await supabase
      .from("customers")
      .update({
        name,
        phone,
        email,
        address,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating customer:", error)
      return new NextResponse("Error updating customer", { status: 500 })
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
    // First check if the customer exists and belongs to the user
    const { data: existingCustomer, error: fetchError } = await supabase
      .from("customers")
      .select("id")
      .eq("id", params.id)
      .eq("user_id", userId)
      .single()

    if (fetchError || !existingCustomer) {
      return new NextResponse("Customer not found", { status: 404 })
    }

    const { error } = await supabase.from("customers").delete().eq("id", params.id).eq("user_id", userId)

    if (error) {
      console.error("Error deleting customer:", error)
      return new NextResponse("Error deleting customer", { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
