"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { Product } from "@/generated/types/Product"
import { useCart } from "@/contexts/CartContext"
import { formatCurrency } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  isNew?: boolean
  discount?: number
}

export function ProductCard({ product, isNew, discount }: ProductCardProps) {
  const { addToCart } = useCart()

  const finalPrice = discount ? product.price * (1 - discount / 100) : product.price
  const imageUrl = product.image_url || product.file_url || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
  const category = product.category || "General"

  return (
    <Link
      href={`/products/${product.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-border/50 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-accent/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {isNew && (
            <span className="bg-primary/90 backdrop-blur-md text-primary-foreground text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
              NEW
            </span>
          )}
          {discount && (
            <span className="bg-destructive/90 backdrop-blur-md text-destructive-foreground text-xs font-extrabold px-3 py-1 rounded-full shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-[-100%] flex justify-center p-4 transition-all duration-500 ease-out group-hover:bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
          <Button
            size="sm"
            className="w-full gap-2 rounded-full shadow-lg font-medium tracking-wide"
            onClick={(e) => { e.preventDefault(); addToCart(product) }}
          >
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </Button>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-background/50">
        <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-1">
          {category}
        </span>
        <h3 className="font-heading font-bold text-lg leading-tight mb-3 line-clamp-2 text-foreground">
          {product.name}
        </h3>

        <div className="mt-auto flex items-end gap-2">
          <span className="text-xl font-extrabold text-primary">
            {formatCurrency(finalPrice)}
          </span>
          {discount && (
            <span className="text-sm font-medium text-muted-foreground line-through mb-[2px]">
              {formatCurrency(product.price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
