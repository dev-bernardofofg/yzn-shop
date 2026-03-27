"use client"

import { ProductDialog } from "@/components/admin/ProductDialog"
import { Button } from "@/components/ui/button"
import { useAdminGetProducts } from "@/generated/hooks/useAdminGetProducts"
import { useDeleteProduct } from "@/generated/hooks/useDeleteProduct"
import { cn, formatCurrency, getApiError } from "@/lib/utils"
import { AlertCircle, Loader2, Package, Pencil, Plus } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"

export default function AdminProductsPage() {
  const { data, isLoading, refetch } = useAdminGetProducts()
  const deleteProduct = useDeleteProduct()

  const [confirmId, setConfirmId] = useState<number | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const products = data?.data || []

  const handleDeactivate = (id: number) => {
    setDeleteError(null)
    deleteProduct.mutate(
      { id },
      {
        onSuccess: () => {
          setConfirmId(null)
          refetch()
        },
        onError: (err) => setDeleteError(getApiError(err, "Could not deactivate product.")),
      }
    )
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} total</p>
        </div>
        <ProductDialog
          onSuccess={refetch}
          trigger={
            <Button className="rounded-full gap-2">
              <Plus className="h-4 w-4" />
              New Product
            </Button>
          }
        />
      </div>

      {deleteError && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm mb-6">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {deleteError}
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-32 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed border-border rounded-2xl">
          <Package className="h-10 w-10 mb-3 opacity-40" />
          <p className="font-medium text-foreground">No products yet</p>
          <div className="mt-4">
            <ProductDialog
              onSuccess={refetch}
              trigger={<Button size="sm" className="rounded-full">Add first product</Button>}
            />
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Product</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Category</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Price</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {products.map((product) => (
                <tr key={product.id} className="bg-card hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-10 relative rounded-lg bg-accent/30 overflow-hidden shrink-0">
                        <Image
                          src={product.image_url || product.file_url || FALLBACK_IMAGE}
                          alt={product.name}
                          className="object-cover"
                          fill
                        />
                      </div>
                      <span className="font-medium text-foreground line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell capitalize">
                    {product.category || "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">
                    {formatCurrency(product.price)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      product.active
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {product.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <ProductDialog
                        product={product}
                        onSuccess={refetch}
                        trigger={
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg">
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        }
                      />
                      {confirmId === product.id ? (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs rounded-lg px-2"
                            onClick={() => handleDeactivate(product.id)}
                            disabled={deleteProduct.isPending}
                          >
                            {deleteProduct.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs rounded-lg px-2"
                            onClick={() => setConfirmId(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                          onClick={() => setConfirmId(product.id)}
                          disabled={!product.active}
                        >
                          Deactivate
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
