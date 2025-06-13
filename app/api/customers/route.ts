import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
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
          license_plate
        )
      `)
      .eq("user_id", userId)
      .order("name")

    if (error) {
      console.error("Error fetching customers:", error)
      return new NextResponse("Error fetching customers", { status: 500 })
    }

    return NextResponse.json(data)
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
    const { name, phone, email, address, notes } = body

    if (!name) {
      return new NextResponse("Name is required", { status: 400 })
    }

    const { data, error } = await supabase
      .from("customers")
      .insert({
        user_id: userId,
        name,
        phone,
        email,
        address,
        notes,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating customer:", error)
      return new NextResponse("Error creating customer", { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
