import type React from "react"
import { DashboardSidebar } from "@/components/dashboard-sidebar"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = auth()

  if (!userId) {
    redirect("/sign-in")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}
