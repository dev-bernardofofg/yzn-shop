"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useCart } from "@/contexts/CartContext"
import { useCreateOrder } from "@/generated/hooks/useCreateOrder"
import { useCreateCheckout } from "@/generated/hooks/useCreateCheckout"
import { useGetCouponByCode } from "@/generated/hooks/useGetCouponByCode"
import { formatCurrency, getApiError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ShoppingBag,
  ArrowLeft,
  Tag,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Trash2,
} from "lucide-react"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart, removeFromCart } = useCart()

  const [couponInput, setCouponInput] = useState("")
  const [appliedCode, setAppliedCode] = useState("")
  const [orderError, setOrderError] = useState<string | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      router.replace("/")
    }
  }, [items.length, router])

  const couponQuery = useGetCouponByCode(appliedCode)
  const createOrder = useCreateOrder()
  const createCheckout = useCreateCheckout()

  const coupon = couponQuery.data?.data

  const isCouponValid = useMemo(() => {
    if (!coupon) return false
    if (!coupon.active) return false
    if (coupon.min_order_value != null && totalPrice < coupon.min_order_value)
      return false
    if (new Date(coupon.expires_at) < new Date()) return false
    if (coupon.current_usage >= coupon.usage_limit) return false
    return true
  }, [coupon, totalPrice])

  const discountAmount = useMemo(() => {
    if (!isCouponValid || !coupon) return 0
    if (coupon.discount_type === "percentage") {
      return Math.round((totalPrice * coupon.discount) / 100)
    }
    return coupon.discount
  }, [isCouponValid, coupon, totalPrice])

  const finalTotal = totalPrice - discountAmount

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase()
    if (code) setAppliedCode(code)
  }

  const handleRemoveCoupon = () => {
    setAppliedCode("")
    setCouponInput("")
  }

  const handlePlaceOrder = async () => {
    setOrderError(null)
    try {
      const productIds = items.flatMap(({ product, quantity }) =>
        Array<number>(quantity).fill(product.id)
      )

      const orderResult = await createOrder.mutateAsync({
        data: {
          product_ids: productIds,
          ...(isCouponValid && appliedCode ? { coupon_code: appliedCode } : {}),
        },
      })

      const orderId = orderResult.data?.id
      if (!orderId) throw new Error("Order ID not returned.")

      const checkoutResult = await createCheckout.mutateAsync({
        data: { order_id: orderId },
      })

      const url = checkoutResult.data?.checkout_url
      if (!url) throw new Error("Checkout URL not returned.")

      clearCart()
      window.location.href = url
    } catch (err) {
      setOrderError(
        getApiError(err, "Could not process your order. Please try again.")
      )
    }
  }

  const isProcessing = createOrder.isPending || createCheckout.isPending
  const totalItems = items.reduce((acc, i) => acc + i.quantity, 0)

  if (items.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="min-h-screen bg-background selection:bg-primary/20"
    >
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity"
          >
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span>
              Yzn<span className="opacity-80">Store</span>
            </span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to store
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 lg:px-8 py-12">
        <h1 className="font-heading text-3xl font-extrabold tracking-tight mb-10">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Left column */}
          <div className="flex flex-col gap-6">
            {/* Items list */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold mb-5">
                Your Items
              </h2>
              <div className="flex flex-col divide-y divide-border/50">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex gap-4 group py-4 first:pt-0 last:pb-0"
                  >
                    <div className="w-20 h-24 rounded-lg bg-accent/20 overflow-hidden flex-shrink-0">
                      <img
                        src={
                          product.image_url || product.file_url || FALLBACK_IMAGE
                        }
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 justify-between py-1">
                      <div className="flex justify-between gap-2">
                        <h4 className="font-semibold text-foreground line-clamp-2 leading-tight">
                          {product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm text-muted-foreground">
                          Qty: {quantity}
                        </span>
                        <span className="font-bold text-primary">
                          {formatCurrency(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-heading text-lg font-bold mb-5 flex items-center gap-2">
                <Tag className="h-5 w-5 text-primary" />
                Coupon Code
              </h2>

              {!appliedCode ? (
                <div className="flex gap-3">
                  <Input
                    value={couponInput}
                    onChange={(e) =>
                      setCouponInput(e.target.value.toUpperCase())
                    }
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleApplyCoupon()
                    }
                    placeholder="Enter coupon code"
                    className="h-10 font-mono uppercase tracking-widest placeholder:normal-case placeholder:tracking-normal placeholder:font-sans"
                  />
                  <Button
                    variant="outline"
                    onClick={handleApplyCoupon}
                    disabled={!couponInput.trim()}
                    className="flex-shrink-0"
                  >
                    Apply
                  </Button>
                </div>
              ) : couponQuery.isPending ? (
                <div className="flex items-center gap-3 text-muted-foreground py-1">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span className="text-sm">Validating coupon…</span>
                </div>
              ) : couponQuery.isError || !isCouponValid ? (
                <div className="flex items-center justify-between p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                  <div className="flex items-center gap-2 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>
                      {couponQuery.isError
                        ? "Coupon not found."
                        : coupon?.min_order_value != null &&
                            totalPrice < coupon.min_order_value
                          ? `Minimum order of ${formatCurrency(coupon.min_order_value)} required.`
                          : "This coupon is no longer valid."}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-destructive hover:opacity-70 ml-3 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span className="font-mono font-semibold tracking-wider">
                      {appliedCode}
                    </span>
                    <span className="text-muted-foreground font-sans font-normal">
                      —{" "}
                      {coupon?.discount_type === "percentage"
                        ? `${coupon.discount}% off`
                        : `${formatCurrency(coupon!.discount)} off`}
                    </span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-muted-foreground hover:text-foreground ml-3 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right column: summary */}
          <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
            <h2 className="font-heading text-lg font-bold mb-5">
              Order Summary
            </h2>

            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Subtotal ({totalItems} {totalItems === 1 ? "item" : "items"})
                </span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>

              {isCouponValid && discountAmount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex justify-between text-emerald-600 dark:text-emerald-400"
                >
                  <span>Discount ({appliedCode})</span>
                  <span>− {formatCurrency(discountAmount)}</span>
                </motion.div>
              )}

              <div className="border-t border-border/50 pt-3 mt-1 flex justify-between font-bold text-base">
                <span>Total</span>
                <span className="text-primary text-lg">
                  {formatCurrency(finalTotal)}
                </span>
              </div>
            </div>

            {orderError && (
              <div className="mt-5 flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{orderError}</span>
              </div>
            )}

            <Button
              size="lg"
              className="w-full h-12 mt-6 rounded-xl shadow-lg shadow-primary/20 font-semibold"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {createOrder.isPending
                    ? "Creating order…"
                    : "Redirecting to payment…"}
                </>
              ) : (
                "Place Order"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground mt-4">
              You will be redirected to a secure payment page.
            </p>
          </div>
        </div>
      </main>
    </motion.div>
  )
}
