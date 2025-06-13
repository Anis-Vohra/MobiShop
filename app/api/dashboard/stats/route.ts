import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET() {
  const { userId } = auth()

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

  try {
    // Get today's date in ISO format
    const today = new Date().toISOString().split("T")[0]

    // Get the first day of the current month
    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)
    const firstDayOfMonthISO = firstDayOfMonth.toISOString()

    // Get the first day of the previous month
    const firstDayOfPrevMonth = new Date()
    firstDayOfPrevMonth.setMonth(firstDayOfPrevMonth.getMonth() - 1)
    firstDayOfPrevMonth.setDate(1)
    firstDayOfPrevMonth.setHours(0, 0, 0, 0)
    const firstDayOfPrevMonthISO = firstDayOfPrevMonth.toISOString()

    // Get total customers
    const { count: totalCustomers, error: customersError } = await supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)

    if (customersError) {
      console.error("Error fetching customers count:", customersError)
      return new NextResponse("Error fetching dashboard stats", { status: 500 })
    }

    // Get new customers this month
    const { count: newCustomersThisMonth, error: newCustomersError } = await supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", firstDayOfMonthISO)

    if (newCustomersError) {
      console.error("Error fetching new customers count:", newCustomersError)
      return new NextResponse("Error fetching dashboard stats", { status: 500 })
    }

    // Get new customers last month
    const { count: newCustomersLastMonth, error: lastMonthCustomersError } = await supabase
      .from("customers")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", firstDayOfPrevMonthISO)
      .lt("created_at", firstDayOfMonthISO)

    if (lastMonthCustomersError) {
      console.error("Error fetching last month customers count:", lastMonthCustomersError)
      return new NextResponse("Error fetching dashboard stats", { status: 500 })
    }

    // Get today's appointments
    const { data: todayAppointments, error: todayApptsError } = await supabase
      .from("appointments")
      .select("id")
      .eq("user_id", userId)
      .eq("date", today)

    if (todayApptsError) {
      console.error("Error fetching today's appointments:", todayApptsError)
      return new NextResponse("Error fetching dashboard stats", { status: 500 })
    }

    // Get active jobs (in_progress)
    const { data: activeJobs, error: activeJobsError } = await supabase
      .from("jobs")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "in_progress")

    if (activeJobsError) {
      console.error("Error fetching active jobs:", activeJobsError)
      return new NextResponse("Error fetching dashboard stats", { status: 500 })
    }

    // Get total revenue this month from paid invoices
    const { data: revenueData, error: revenueError } = await supabase
      .from("invoices")
      .select(`
        total,
        paid_at,
        jobs!inner (
          user_id
        )
      `)
      .eq("jobs.user_id", userId)
      .eq("payment_status", "paid")
      .gte("paid_at", firstDayOfMonthISO)

    if (revenueError) {
      console.error("Error fetching revenue data:", revenueError)
      return new NextResponse("Error fetching dashboard stats", { status: 500 })
    }

    const totalRevenueThisMonth = revenueData.reduce((sum, invoice) => sum + invoice.total, 0)

    // Get total revenue last month from paid invoices
    const { data: lastMonthRevenueData, error: lastMonthRevenueError } = await supabase
      .from("invoices")
      .select(`
        total,
        paid_at,
        jobs!inner (
          user_id
        )
      `)
      .eq("jobs.user_id", userId)
      .eq("payment_status", "paid")
      .gte("paid_at", firstDayOfPrevMonthISO)
      .lt("paid_at", firstDayOfMonthISO)

    if (lastMonthRevenueError) {
      console.error("Error fetching last month revenue data:", lastMonthRevenueError)
      return new NextResponse("Error fetching dashboard stats", { status: 500 })
    }

    const totalRevenueLastMonth = lastMonthRevenueData.reduce((sum, invoice) => sum + invoice.total, 0)

    // Calculate percentage changes
    const revenueChange =
      lastMonthRevenueData.length > 0
        ? ((totalRevenueThisMonth - totalRevenueLastMonth) / totalRevenueLastMonth) * 100
        : 0

    const customerChange =
      newCustomersLastMonth > 0 ? ((newCustomersThisMonth - newCustomersLastMonth) / newCustomersLastMonth) * 100 : 0

    return NextResponse.json({
      totalCustomers,
      newCustomersThisMonth,
      customerChange,
      todayAppointmentsCount: todayAppointments.length,
      activeJobsCount: activeJobs.length,
      totalRevenueThisMonth,
      revenueChange,
    })
  } catch (error) {
    console.error("Error:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
