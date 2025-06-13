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
      .from("vehicles")
      .select(`
        *,
        customers!inner (
          id,
          name,
          user_id
        )
      `)
      .eq("id", params.id)
      .eq("customers.user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching vehicle:", error)
      return new NextResponse("Error fetching vehicle", { status: 500 })
    }

    if (!data) {
      return new NextResponse("Vehicle not found", { status: 404 })
    }

    // Transform the data to include customer_name
    const { customers, ...rest } = data
    const transformedData = {
      ...rest,
      customer_name: customers.name,
      customer_id: customers.id,
    }

    return NextResponse.json(transformedData)
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
    const { customer_id, year, make, model, vin, license_plate, color, notes } = body

    if (!make || !model) {
      return new NextResponse("Make and model are required", { status: 400 })
    }

    // First check if the vehicle exists and belongs to a customer of the user
    const { data: existingVehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select(`
        id,
        customers!inner (
          user_id
        )
      `)
      .eq("id", params.id)
      .eq("customers.user_id", userId)
      .single()

    if (fetchError || !existingVehicle) {
      return new NextResponse("Vehicle not found", { status: 404 })
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

    const { data, error } = await supabase
      .from("vehicles")
      .update({
        customer_id: customer_id || undefined,
        year,
        make,
        model,
        vin,
        license_plate,
        color,
        notes,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .select()
      .single()

    if (error) {
      console.error("Error updating vehicle:", error)
      return new NextResponse("Error updating vehicle", { status: 500 })
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
    // First check if the vehicle exists and belongs to a customer of the user
    const { data: existingVehicle, error: fetchError } = await supabase
      .from("vehicles")
      .select(`
        id,
        customers!inner (
          user_id
        )
      `)
      .eq("id", params.id)
      .eq("customers.user_id", userId)
      .single()

    if (fetchError || !existingVehicle) {
      return new NextResponse("Vehicle not found", { status: 404 })
    }

    const { error } = await supabase.from("vehicles").delete().eq("id", params.id)

    if (error) {
      console.error("Error deleting vehicle:", error)
      return new NextResponse("Error deleting vehicle", { status: 500 })
    }

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
