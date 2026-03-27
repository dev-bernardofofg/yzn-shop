"use client"

import { useState, useMemo } from "react"
import { ProductCard } from "@/components/ProductCard"
import { StoreHeader } from "@/components/StoreHeader"
import { useGetProducts } from "@/generated/hooks/useGetProducts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2, PackageSearch } from "lucide-react"

export default function ProductsPage() {
  const { data: productsData, isLoading } = useGetProducts()

  const [search, setSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const allProducts = productsData?.data || []

  const categories = useMemo(
    () => [...new Set(allProducts.map((p) => p.category).filter((c): c is string => Boolean(c)))],
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
      <StoreHeader />

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
