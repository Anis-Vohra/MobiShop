"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Calendar, FileText, Home, Settings, Users, Wrench, Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState } from "react"
import { UserButton } from "@clerk/nextjs"

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Customers",
    icon: Users,
    href: "/dashboard/customers",
    color: "text-violet-500",
  },
  {
    label: "Vehicles",
    icon: Wrench,
    href: "/dashboard/vehicles",
    color: "text-pink-700",
  },
  {
    label: "Appointments",
    icon: Calendar,
    href: "/dashboard/appointments",
    color: "text-orange-500",
  },
  {
    label: "Jobs",
    icon: FileText,
    href: "/dashboard/jobs",
    color: "text-emerald-500",
  },
  {
    label: "Reports",
    icon: BarChart3,
    href: "/dashboard/reports",
    color: "text-blue-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="flex flex-col h-full">
            <div className="px-3 py-2 flex items-center justify-between border-b">
              <div className="flex items-center pl-2">
                <Wrench className="h-6 w-6" />
                <span className="ml-2 text-xl font-bold">MobiShop</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-2 text-sm font-medium">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                      pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground",
                    )}
                  >
                    <route.icon className={cn("h-4 w-4", route.color)} />
                    {route.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="mt-auto p-4 border-t">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4">
            <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
              <Wrench className="h-6 w-6" />
              <span>MobiShop</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary",
                    pathname === route.href ? "bg-muted text-primary" : "text-muted-foreground",
                  )}
                >
                  <route.icon className={cn("h-4 w-4", route.color)} />
                  {route.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="mt-auto p-4 border-t">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </>
  )
}
