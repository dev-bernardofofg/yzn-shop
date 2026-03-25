"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useCart } from "@/contexts/CartContext"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { X, ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"

interface CartDrawerProps {
  onUnauthenticatedCheckout: () => void
}

export function CartDrawer({ onUnauthenticatedCheckout }: CartDrawerProps) {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, totalPrice } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  const handleCheckout = () => {
    setIsCartOpen(false)
    if (!isAuthenticated) {
      onUnauthenticatedCheckout()
    } else {
      router.push("/checkout")
    }
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[150] overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute right-0 top-0 h-full w-full max-w-md bg-card shadow-2xl border-l border-border flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-6 border-b border-border/50 bg-background/50 backdrop-blur-md z-10">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h2 className="font-heading text-xl font-bold">Your Cart</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(false)}
                className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center opacity-50 space-y-4">
                  <ShoppingBag className="w-16 h-16 mb-2" />
                  <p className="text-lg">Your cart is empty.</p>
                  <p className="text-sm">Why not check out our latest arrivals?</p>
                </div>
              ) : (
                items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-4 group">
                    <div className="w-20 h-24 rounded-lg bg-accent/20 overflow-hidden flex-shrink-0">
                      <img
                        src={product.image_url || product.file_url || FALLBACK_IMAGE}
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
                          className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-3 bg-secondary/50 rounded-full border border-border px-2 py-1">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-semibold w-4 text-center">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="p-1 hover:text-primary transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <span className="font-bold text-primary">
                          {formatCurrency(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-semibold text-muted-foreground">Subtotal</span>
                  <span className="text-2xl font-extrabold text-foreground">
                    {formatCurrency(totalPrice)}
                  </span>
                </div>
                <Button
                  size="lg"
                  className="w-full h-14 text-lg rounded-xl shadow-lg shadow-primary/20"
                  onClick={handleCheckout}
                >
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
