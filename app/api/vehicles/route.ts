import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  const { userId } = auth()
  const url = new URL(req.url)
  const customerId = url.searchParams.get("customerId")

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    let query = supabase
      .from("vehicles")
      .select(`
        *,
        customers!inner (
          id,
          name,
          user_id
        )
      `)
      .eq("customers.user_id", userId)

    if (customerId) {
      query = query.eq("customer_id", customerId)
    }

    const { data, error } = await query.order("make")

    if (error) {
      console.error("Error fetching vehicles:", error)
      return new NextResponse("Error fetching vehicles", { status: 500 })
    }

    // Transform the data to remove the customers object
    const transformedData = data.map((vehicle) => {
      const { customers, ...rest } = vehicle
      return {
        ...rest,
        customer_name: customers.name,
      }
    })

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}

export async function POST(req: Request) {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    const body = await req.json()
    const { customer_id, year, make, model, vin, license_plate, color, notes } = body

    if (!customer_id || !make || !model) {
      return new NextResponse("Customer ID, make, and model are required", { status: 400 })
    }

    // Verify the customer belongs to the user
    const { data: customerData, error: customerError } = await supabase
      .from("customers")
      .select("id")
      .eq("id", customer_id)
      .eq("user_id", userId)
      .single()

    if (customerError || !customerData) {
      return new NextResponse("Customer not found or does not belong to user", { status: 404 })
    }

    const { data, error } = await supabase
      .from("vehicles")
      .insert({
        customer_id,
        year,
        make,
        model,
        vin,
        license_plate,
        color,
        notes,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating vehicle:", error)
      return new NextResponse("Error creating vehicle", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
