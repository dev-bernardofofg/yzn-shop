"use client"

import { useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm"
import {
  Dialog,
  DialogCloseButton,
  DialogHeader,
  DialogPopup,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { adminGetProductsQueryKey } from "@/generated/hooks/useAdminGetProducts"
import { useCreateProduct } from "@/generated/hooks/useCreateProduct"
import { useUpdateProduct } from "@/generated/hooks/useUpdateProduct"
import type { Product } from "@/generated/types/Product"
import { buildProductJsonPayload } from "@/lib/product-admin-form-data"
import { getApiError } from "@/lib/utils"

interface ProductDialogProps {
  product?: Product
  onSuccess: () => void
  trigger: React.ReactNode
}

export function ProductDialog({ product, onSuccess, trigger }: ProductDialogProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const isEdit = !!product

  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const isPending = createProduct.isPending || updateProduct.isPending

  const invalidateProducts = () => {
    void queryClient.invalidateQueries({ queryKey: adminGetProductsQueryKey() })
  }

  const handleSubmit = (values: ProductFormValues) => {
    setError(null)
    const data = buildProductJsonPayload(values)

    if (isEdit) {
      updateProduct.mutate(
        { id: product.id, data },
        {
          onSuccess: () => {
            invalidateProducts()
            setOpen(false)
            onSuccess()
          },
          onError: (err) => setError(getApiError(err, "Could not update product.")),
        },
      )
    } else {
      createProduct.mutate(
        { data },
        {
          onSuccess: () => {
            invalidateProducts()
            setOpen(false)
            onSuccess()
          },
          onError: (err) => setError(getApiError(err, "Could not create product.")),
        },
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger as React.ReactElement} />
      <DialogPopup className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? `Edit — ${product.name}` : "New Product"}</DialogTitle>
          <DialogCloseButton />
        </DialogHeader>
        <ProductForm
          defaultValues={isEdit ? {
            product_type: product.file_url ? "digital" : "physical",
            name: product.name,
            description: product.description ?? "",
            price: product.price / 100,
            category: product.category ?? "",
            slug: product.slug ?? "",
            image_url: product.image_url ?? "",
            file_url: product.file_url ?? "",
          } : undefined}
          onSubmit={handleSubmit}
          isPending={isPending}
          submitLabel={isEdit ? "Save Changes" : "Create Product"}
          error={error}
          onCancel={() => setOpen(false)}
        />
      </DialogPopup>
    </Dialog>
  )
}
