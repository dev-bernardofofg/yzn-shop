"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { useGetOrderById } from "@/generated/hooks/useGetOrderById"
import { useGetProducts } from "@/generated/hooks/useGetProducts"
import { useCreateCheckout } from "@/generated/hooks/useCreateCheckout"
import { formatCurrency, getApiError, cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Order } from "@/generated/types/Order"
import {
  ShoppingBag,
  User,
  LogOut,
  ShoppingCart,
  Loader2,
  Package,
  ChevronLeft,
  CreditCard,
  AlertCircle,
} from "lucide-react"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"

const STATUS_CONFIG: Record<Order["status"], { label: string; className: string }> = {
  pending: { label: "Pending payment", className: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400" },
  paid: { label: "Paid", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400" },
  cancelled: { label: "Cancelled", className: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400" },
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"

export default function OrderDetailPage() {
  const params = useParams()
  const orderId = Number(params.id)

  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems, setIsCartOpen } = useCart()

  const { data: orderData, isLoading } = useGetOrderById(orderId)
  const { data: productsData } = useGetProducts()
  const createCheckout = useCreateCheckout()
  const [checkoutError, setCheckoutError] = useState<string | null>(null)

  const order = orderData?.data
  const productsMap = new Map(
    (productsData?.data || []).map((p) => [p.id, p])
  )

  const handleRetryPayment = async () => {
    setCheckoutError(null)
    try {
      const result = await createCheckout.mutateAsync({ data: { order_id: orderId } })
      const url = result.data?.checkout_url
      if (url) window.location.href = url
    } catch (err) {
      setCheckoutError(getApiError(err, "Could not initiate payment. Try again."))
    }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>Yzn<span className="opacity-80">Store</span></span>
          </Link>

          <div className="flex items-center gap-3 sm:gap-6">
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full hover:bg-primary/10 hover:text-primary transition-colors overflow-visible"
              onClick={() => setIsCartOpen(true)}
            >
              <motion.div
                key={totalItems}
                initial={{ scale: 1.3, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <ShoppingCart className="h-5 w-5" />
              </motion.div>
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key="cart-badge"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-0 right-0 flex -mt-1 -mr-1 h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
            <div className="h-6 w-px bg-border/60 hidden sm:block" />
            {isAuthenticated && (
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="text-sm font-medium hidden sm:inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full text-primary">
                  <User className="h-4 w-4" />
                  Hi, {user?.name || "User"}
                </span>
                <Button variant="ghost" size="sm" onClick={logout} className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                  <LogOut className="h-4 w-4" />
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-8 pb-24 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/orders" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            My Orders
          </Link>
        </nav>

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
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-6"
          >
            {/* Order header card */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="font-heading text-2xl font-extrabold tracking-tight mb-1">
                    Order #{order.id}
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Placed on{" "}
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <span className={cn("text-sm font-semibold px-3 py-1 rounded-full", STATUS_CONFIG[order.status].className)}>
                  {STATUS_CONFIG[order.status].label}
                </span>
              </div>

              {order.status === "pending" && (
                <div className="mt-5 pt-5 border-t border-border/50">
                  <p className="text-sm text-muted-foreground mb-4">
                    This order is awaiting payment. Complete it to receive your items.
                  </p>
                  {checkoutError && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-4">
                      <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>{checkoutError}</span>
                    </div>
                  )}
                  <Button
                    onClick={handleRetryPayment}
                    disabled={createCheckout.isPending}
                    className="rounded-full px-6"
                  >
                    {createCheckout.isPending ? (
                      <><Loader2 className="h-4 w-4 animate-spin mr-2" />Redirecting…</>
                    ) : (
                      <><CreditCard className="h-4 w-4 mr-2" />Complete Payment</>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Items */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold mb-5">
                Items ({order.items.length})
              </h2>
              <div className="flex flex-col divide-y divide-border/50">
                {order.items.map((item) => {
                  const product = productsMap.get(item.product_id)
                  const imageUrl = product?.image_url || product?.file_url || FALLBACK_IMAGE
                  return (
                    <div key={item.id} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <div className="w-16 h-16 rounded-lg bg-accent/20 overflow-hidden flex-shrink-0">
                        <img
                          src={imageUrl}
                          alt={product?.name || `Product #${item.product_id}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col justify-center flex-1 min-w-0">
                        {product ? (
                          <Link
                            href={`/products/${product.id}`}
                            className="font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                          >
                            {product.name}
                          </Link>
                        ) : (
                          <p className="font-semibold text-foreground">Product #{item.product_id}</p>
                        )}
                        {product?.category && (
                          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{product.category}</p>
                        )}
                      </div>
                      <p className="font-bold text-primary flex-shrink-0 self-center">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Total */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center justify-between text-base font-bold">
                <span>Total</span>
                <span className="text-primary text-xl">{formatCurrency(order.total)}</span>
              </div>
              {order.payment_id && (
                <p className="text-xs text-muted-foreground mt-2">
                  Payment ref: <span className="font-mono">{order.payment_id}</span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
