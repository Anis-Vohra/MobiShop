import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date))
}

export function formatTime(time: string): string {
  // Handle time strings like "09:00:00"
  if (time.includes(":")) {
    const [hours, minutes] = time.split(":")
    const hour = Number.parseInt(hours, 10)
    const ampm = hour >= 12 ? "PM" : "AM"
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }
  return time
}

export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, "")

  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }

  // Return original if not 10 digits
  return phoneNumber
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function calculateTotal(lineItems: any[]): { subtotal: number; tax: number; total: number } {
  const subtotal = lineItems.reduce((sum, item) => sum + (Number.parseFloat(item.total) || 0), 0)
  const tax = subtotal * 0.1 // Assuming 10% tax rate
  const total = subtotal + tax

  return {
    subtotal: Number.parseFloat(subtotal.toFixed(2)),
    tax: Number.parseFloat(tax.toFixed(2)),
    total: Number.parseFloat(total.toFixed(2)),
  }
}
