"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useCart } from "@/contexts/CartContext"
import { useGetProductById } from "@/generated/hooks/useGetProductById"
import { useGetReviewsByProduct } from "@/generated/hooks/useGetReviewsByProduct"
import { useCreateReview } from "@/generated/hooks/useCreateReview"
import { formatCurrency, getApiError, cn } from "@/lib/utils"
import { StoreHeader } from "@/components/StoreHeader"
import { Button } from "@/components/ui/button"
import {
  Star,
  Loader2,
  ChevronLeft,
  PackageSearch,
  MessageSquare,
  ShoppingCart,
} from "lucide-react"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"

function StarRow({
  rating,
  max = 5,
  size = "sm",
}: {
  rating: number
  max?: number
  size?: "sm" | "md"
}) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            size === "sm" ? "h-3.5 w-3.5" : "h-5 w-5",
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "fill-muted text-muted"
          )}
        />
      ))}
    </div>
  )
}

export default function ProductDetailPage() {
  const params = useParams()
  const productId = Number(params.id)

  const { isAuthenticated } = useAuth()
  const { setIsCartOpen, addToCart } = useCart()

  const { data: productData, isLoading } = useGetProductById(productId)
  const {
    data: reviewsData,
    refetch: refetchReviews,
  } = useGetReviewsByProduct(productId)
  const createReview = useCreateReview()

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState("")
  const [reviewError, setReviewError] = useState<string | null>(null)

  const product = productData?.data
  const reviews = reviewsData?.data || []
  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      setIsCartOpen(true)
    }
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) return
    setReviewError(null)
    createReview.mutate(
      { data: { product_id: productId, rating, comment: comment.trim() || undefined } },
      {
        onSuccess: () => {
          setRating(0)
          setComment("")
          refetchReviews()
        },
        onError: (err) => setReviewError(getApiError(err)),
      }
    )
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20">
      <StoreHeader />

      <main className="container mx-auto px-4 lg:px-8 py-8 pb-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/products" className="flex items-center gap-1 hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>
        </nav>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
            <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary" />
            <p>Loading product…</p>
          </div>
        ) : !product ? (
          <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed border-border rounded-2xl bg-accent/5">
            <PackageSearch className="h-12 w-12 mb-4 opacity-50 text-primary" />
            <p className="text-xl font-medium text-foreground">Product not found</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Product section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Image */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-accent/20">
                <img
                  src={product.image_url || product.file_url || FALLBACK_IMAGE}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Info */}
              <div className="flex flex-col">
                {product.category && (
                  <span className="text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                    {product.category}
                  </span>
                )}
                <h1 className="font-heading text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground mb-4 leading-tight">
                  {product.name}
                </h1>

                {reviews.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <StarRow rating={Math.round(avgRating)} size="md" />
                    <span className="text-sm text-muted-foreground">
                      {avgRating.toFixed(1)} · {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                    </span>
                  </div>
                )}

                <p className="text-3xl font-extrabold text-primary mb-6">
                  {formatCurrency(product.price)}
                </p>

                {product.description && (
                  <p className="text-muted-foreground leading-relaxed mb-8">
                    {product.description}
                  </p>
                )}

                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-full h-14 px-10 text-base font-semibold shadow-lg shadow-primary/20 mt-auto"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
              </div>
            </div>

            {/* Reviews section */}
            <div className="border-t border-border/40 pt-12">
              <h2 className="font-heading text-2xl font-bold tracking-tight mb-8 flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-primary" />
                Reviews
                {reviews.length > 0 && (
                  <span className="text-base font-normal text-muted-foreground">({reviews.length})</span>
                )}
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-12 items-start">
                {/* Reviews list */}
                <div className="flex flex-col gap-5">
                  {reviews.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border border-dashed border-border rounded-2xl bg-accent/5">
                      <MessageSquare className="h-10 w-10 mb-3 opacity-40" />
                      <p className="font-medium text-foreground">No reviews yet</p>
                      <p className="text-sm mt-1">Be the first to share your thoughts.</p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <div
                        key={review.id}
                        className="rounded-2xl border border-border bg-card p-5 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                              {(review.user_name?.[0] || "U").toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-sm">
                                {review.user_name
                                  ? `${review.user_name} ${review.user_last_name || ""}`.trim()
                                  : "Anonymous"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(review.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <StarRow rating={review.rating} />
                        </div>
                        {review.comment && (
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {review.comment}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>

                {/* Review form */}
                <div className="rounded-2xl border border-border bg-card p-6 sticky top-24">
                  <h3 className="font-heading font-bold text-lg mb-5">Write a Review</h3>
                  {!isAuthenticated ? (
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-4">
                        Sign in to leave a review.
                      </p>
                      <Link href={`/login?redirect=/products/${productId}`}>
                        <Button variant="outline" size="sm" className="rounded-full px-5">
                          Sign in
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                      <div>
                        <p className="text-sm font-medium mb-2">Rating <span className="text-destructive">*</span></p>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-0.5 transition-transform hover:scale-110"
                            >
                              <Star
                                className={cn(
                                  "h-7 w-7 transition-colors",
                                  (hoverRating || rating) >= star
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-muted text-muted-foreground/40"
                                )}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Comment <span className="text-muted-foreground text-xs font-normal">(optional)</span></p>
                        <textarea
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Share your thoughts about this product…"
                          rows={4}
                          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition placeholder:text-muted-foreground"
                        />
                      </div>

                      {reviewError && (
                        <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
                          {reviewError}
                        </p>
                      )}

                      <Button
                        type="submit"
                        disabled={rating === 0 || createReview.isPending}
                        className="rounded-full"
                      >
                        {createReview.isPending ? (
                          <><Loader2 className="h-4 w-4 animate-spin mr-2" />Submitting…</>
                        ) : "Submit Review"}
                      </Button>

                      {createReview.isSuccess && (
                        <p className="text-emerald-600 dark:text-emerald-400 text-sm text-center">
                          Review submitted!
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
