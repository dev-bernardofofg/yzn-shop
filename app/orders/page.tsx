"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useGetOrders } from "@/generated/hooks/useGetOrders"
import { formatCurrency, cn } from "@/lib/utils"
import { StoreHeader } from "@/components/StoreHeader"
import { Button } from "@/components/ui/button"
import { Loader2, Package, ChevronRight } from "lucide-react"
import { Order } from "@/generated/types/Order"

const STATUS_CONFIG: Record<Order["status"], { label: string; className: string }> = {
  pending: { label: "Pending", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400" },
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400" },
}

export default function OrdersPage() {
  const { data, isLoading } = useGetOrders()

  const orders = [...(data?.data || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <StoreHeader />

      <main className="container mx-auto px-4 lg:px-8 py-12 pb-32 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="font-heading text-3xl font-extrabold tracking-tight mb-10">
            My Orders
          </h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
              <p>Loading orders…</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed border-border rounded-2xl bg-accent/5">
              <Package className="h-12 w-12 mb-4 opacity-50 text-primary" />
              <p className="text-xl font-medium text-foreground">No orders yet</p>
              <p className="text-sm mt-1">Your order history will appear here.</p>
              <Link href="/products" className="mt-6">
                <Button variant="outline" size="sm" className="rounded-full px-6">
                  Start shopping
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {orders.map((order) => {
                const status = STATUS_CONFIG[order.status]
                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="group rounded-2xl border border-border bg-card hover:border-primary/40 hover:shadow-sm transition-all p-5 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                        <Package className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-foreground">Order #{order.id}</p>
                          <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", status.className)}>
                            {status.label}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {new Date(order.created_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                          {" · "}
                          {order.items.length} {order.items.length === 1 ? "item" : "items"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="font-bold text-primary">{formatCurrency(order.total)}</span>
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
