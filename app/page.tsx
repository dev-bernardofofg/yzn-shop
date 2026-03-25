"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { ProductCard } from "@/components/ProductCard"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, User, LogOut, Loader2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGetProducts } from "@/generated/hooks/useGetProducts"

export default function HomePage() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems, setIsCartOpen } = useCart()
  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts()

  const products = productsData?.data || []

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
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

            {isAuthenticated ? (
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
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button size="sm" className="rounded-full px-5">Create account</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="relative px-4 py-24 sm:py-32 mx-auto max-w-7xl flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/20 blur-[120px] rounded-[100%] -z-10 pointer-events-none" />

        <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary mb-8 tracking-wide">
          ✨ Discover new collections every day
        </div>

        <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-black tracking-tight max-w-5xl text-foreground !leading-[1.1] mb-8">
          Everything you look for, <br className="hidden sm:block" /> your way.
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground max-w-2xl mb-12 font-light">
          YznStore brings together the best in electronics, fashion, and accessories. The perfect stage for your taste.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link href="/products">
            <Button size="lg" className="w-full sm:w-auto rounded-full shadow-lg shadow-primary/25 h-14 px-8 text-base font-semibold">
              Explore Products
            </Button>
          </Link>
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-full h-14 px-8 text-base font-semibold bg-background/50 backdrop-blur-sm border-border hover:bg-primary/5"
            onClick={() => document.getElementById("highlights")?.scrollIntoView({ behavior: "smooth" })}
          >
            View Deals
          </Button>
        </div>
      </section>

      <main id="highlights" className="container mx-auto px-4 lg:px-8 pb-32">
        <div className="flex items-end justify-between mb-10 pb-4 border-b border-border/40">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-extrabold tracking-tight mb-2">Weekly Highlights</h2>
            <p className="text-muted-foreground">Amazing and exclusive items just for you.</p>
          </div>
          <Link href="/products">
            <Button variant="link" className="text-primary font-semibold pr-0 hidden sm:flex">
              View full catalog &rarr;
            </Button>
          </Link>
        </div>

        {isLoadingProducts ? (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p className="text-lg">Loading catalog...</p>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isNew={false}
                discount={0}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-muted-foreground border border-dashed border-border rounded-2xl bg-accent/5">
            <ShoppingBag className="h-12 w-12 mb-4 opacity-50 text-primary" />
            <p className="text-xl font-medium text-foreground">No products found</p>
            <p className="mt-1">Our store is being updated with new items, check back soon!</p>
          </div>
        )}

        {products.length > 0 && (
          <Link href="/products" className="sm:hidden">
            <Button variant="outline" className="w-full mt-8 h-12 rounded-xl border-border">
              View full catalog
            </Button>
          </Link>
        )}
      </main>
    </div>
  )
}
