import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getApiError(error: unknown, fallback = "Something went wrong."): string {
  const message = (error as { response?: { data?: { error?: { message?: string } } } } | null)
    ?.response?.data?.error?.message
  return typeof message === "string" && message.length > 0 ? message : fallback
}

export function formatCurrency(valueInCents: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInCents / 100)
}
