"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { ProductCard } from "@/components/ProductCard"
import { useGetProducts } from "@/generated/hooks/useGetProducts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  ShoppingBag,
  User,
  LogOut,
  ShoppingCart,
  Search,
  Loader2,
  PackageSearch,
} from "lucide-react"

export default function ProductsPage() {
  const { user, isAuthenticated, logout } = useAuth()
  const { totalItems, setIsCartOpen } = useCart()
  const { data: productsData, isLoading } = useGetProducts()

  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const allProducts = productsData?.data || []

  const categories = useMemo(
    () => [...new Set(allProducts.map((p) => p.category).filter(Boolean))],
    [allProducts]
  )

  const filtered = useMemo(() => {
    let result = allProducts

    if (activeCategory) {
      result = result.filter((p) => p.category === activeCategory)
    }

    if (search.trim()) {
      const term = search.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.category?.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      )
    }

    return result
  }, [allProducts, activeCategory, search])

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

      {/* Page title + search */}
      <div className="border-b border-border/40 bg-background">
        <div className="container mx-auto px-4 lg:px-8 py-10">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight mb-6">
            All Products
          </h1>
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="h-10 pl-9"
            />
          </div>
        </div>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="border-b border-border/40 bg-background/60 backdrop-blur-sm sticky top-16 z-40">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveCategory(null)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${
                  activeCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() =>
                    setActiveCategory(activeCategory === cat ? null : cat)
                  }
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors capitalize ${
                    activeCategory === cat
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product grid */}
      <main className="container mx-auto px-4 lg:px-8 py-10 pb-32">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p className="text-lg">Loading products…</p>
          </div>
        ) : filtered.length > 0 ? (
          <>
            <p className="text-sm text-muted-foreground mb-6">
              {filtered.length} {filtered.length === 1 ? "product" : "products"} found
            </p>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((product) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ProductCard product={product} isNew={false} discount={0} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed border-border rounded-2xl bg-accent/5">
            <PackageSearch className="h-12 w-12 mb-4 opacity-50 text-primary" />
            <p className="text-xl font-medium text-foreground">
              No products found
            </p>
            <p className="mt-1 text-sm">
              Try a different search term or category.
            </p>
            {(search || activeCategory) && (
              <Button
                variant="outline"
                size="sm"
                className="mt-6 rounded-full"
                onClick={() => {
                  setSearch("")
                  setActiveCategory(null)
                }}
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
