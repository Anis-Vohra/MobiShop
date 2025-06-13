import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Wrench, Calendar, Users, FileText, BarChart3, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            <span className="text-xl font-bold">MobiShop</span>
          </div>
          <nav className="hidden md:flex gap-6">
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Pricing
            </Link>
            <Link
              href="#testimonials"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Testimonials
            </Link>
            <Link
              href="#contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 space-y-8 md:py-32">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Run your mobile mechanic business <span className="text-primary">smarter</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Manage customers, vehicles, appointments, and invoices all in one place. Built specifically for mobile
              mechanics who work on the go.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/sign-up">
                <Button size="lg">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="features" className="container py-16 space-y-16">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage your mobile mechanic business
            </h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              MobiShop is designed specifically for mobile mechanics who need to manage their business on the go.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Customer Management</h3>
              <p className="text-center text-muted-foreground">
                Create and store customer profiles with contact information, notes, and multiple vehicles per customer.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Appointment Scheduling</h3>
              <p className="text-center text-muted-foreground">
                Calendar-style interface with automated email and SMS reminders for appointments.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Job Workflow</h3>
              <p className="text-center text-muted-foreground">
                Create estimates, convert to work orders, and generate invoices with integrated payment processing.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Customer Portal</h3>
              <p className="text-center text-muted-foreground">
                Give customers secure access to view appointments, service history, and job status.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Admin Dashboard</h3>
              <p className="text-center text-muted-foreground">
                Get a high-level view of appointments, revenue, and jobs by status.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6">
              <div className="rounded-full bg-primary/10 p-4">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Mobile-First Design</h3>
              <p className="text-center text-muted-foreground">
                Touch-friendly interface designed to work seamlessly on phones and tablets.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" className="container py-16 space-y-16">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Simple, transparent pricing</h2>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Choose the plan that's right for your business
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col rounded-lg border p-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Free</h3>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">$0</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Up to 5 customers</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Up to 10 vehicles</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Basic appointment scheduling</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Simple estimates and invoices</span>
                </li>
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/sign-up">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-6 bg-primary/5 border-primary/20">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-muted-foreground">For growing businesses</p>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">$19</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Unlimited customers</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Unlimited vehicles</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Advanced appointment scheduling</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Full estimate and invoice workflow</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>SMS and email reminders</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Customer portal</span>
                </li>
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/sign-up">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
            <div className="flex flex-col rounded-lg border p-6">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">Team</h3>
                <p className="text-muted-foreground">For multi-mechanic businesses</p>
              </div>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-bold">$49</span>
                <span className="ml-1 text-muted-foreground">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Multiple mechanic accounts</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Team scheduling</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Inventory tracking</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Route optimization</span>
                </li>
                <li className="flex items-center">
                  <span className="mr-2">✓</span>
                  <span>Advanced reporting</span>
                </li>
              </ul>
              <div className="mt-auto pt-6">
                <Link href="/sign-up">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-12">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <Wrench className="h-6 w-6" />
            <span className="text-xl font-bold">MobiShop</span>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            &copy; {new Date().getFullYear()} MobiShop. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
