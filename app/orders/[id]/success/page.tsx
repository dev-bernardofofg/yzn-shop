"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useGetOrderById } from "@/generated/hooks/useGetOrderById"
import { formatCurrency } from "@/lib/utils"
import { StoreHeader } from "@/components/StoreHeader"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ChevronRight, Loader2, Package } from "lucide-react"

export default function OrderSuccessPage() {
  const params = useParams()
  const orderId = Number(params.id)

  const { data: orderData, isLoading } = useGetOrderById(orderId)
  const order = orderData?.data

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <StoreHeader />

      <main className="container mx-auto px-4 lg:px-8 py-16 max-w-2xl">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p>Loading order…</p>
          </div>
        ) : !order ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed border-border rounded-2xl bg-accent/5">
            <Package className="h-12 w-12 mb-4 opacity-50 text-primary" />
            <p className="text-xl font-medium text-foreground">Order not found</p>
            <Link href="/orders" className="mt-6">
              <Button variant="outline" size="sm" className="rounded-full px-6">Back to orders</Button>
            </Link>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 20 }}
              className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-500/15 mb-6"
            >
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
            </motion.div>

            <h1 className="font-heading text-3xl font-extrabold tracking-tight mb-2">
              Payment confirmed!
            </h1>
            <p className="text-muted-foreground mb-2">
              Your order <span className="font-semibold text-foreground">#{order.id}</span> has been received.
            </p>
            <p className="text-muted-foreground text-sm mb-10">
              Total: <span className="font-semibold text-primary">{formatCurrency(order.total)}</span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link href={`/orders/${order.id}`}>
                <Button variant="outline" className="w-full sm:w-auto rounded-full px-6 gap-2">
                  View order details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button className="w-full sm:w-auto rounded-full px-6">
                  Continue shopping
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
