"use client"

import "@/lib/api"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { CartProvider } from "@/contexts/CartContext"
import { CartDrawer } from "@/components/CartDrawer"
import { AuthRequiredDialog } from "@/components/AuthRequiredDialog"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false)

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          {children}
          <CartDrawer onUnauthenticatedCheckout={() => setIsAuthDialogOpen(true)} />
          <AuthRequiredDialog
            open={isAuthDialogOpen}
            onClose={() => setIsAuthDialogOpen(false)}
          />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
