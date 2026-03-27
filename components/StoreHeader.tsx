"use client"

import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { Button } from "@/components/ui/button"
import {
  ShoppingBag,
  User,
  LogOut,
  ShoppingCart,
  LayoutDashboard,
} from "lucide-react"

export function StoreHeader() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems, setIsCartOpen } = useCart()

  return (
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

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {user?.role === "admin" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 rounded-full hidden sm:inline-flex"
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link
                href="/orders"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
              >
                My Orders
              </Link>
              <span className="text-sm font-medium hidden sm:inline-flex items-center gap-2 bg-primary/10 px-3 py-1.5 rounded-full text-primary">
                <User className="h-4 w-4" />
                Hi, {user?.name || "User"}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="rounded-full px-5">
                  Create account
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
