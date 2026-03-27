import type { CreateProductMutationRequest } from "@/generated/types/CreateProduct"
import type { ProductFormValues } from "@/components/admin/ProductForm"

export function buildProductJsonPayload(
  values: ProductFormValues,
): CreateProductMutationRequest {
  const payload: Omit<CreateProductMutationRequest, "file_url"> & { file_url?: string } = {
    name: values.name,
    price: Math.round(values.price * 100),
    description: values.description?.trim() || undefined,
    category: values.category?.trim() || undefined,
    slug: values.slug?.trim() || undefined,
    image_url: values.image_url.trim() || undefined,
  }

  if (values.product_type === "digital") {
    payload.file_url = values.file_url?.trim() || ""
  }

  return payload as CreateProductMutationRequest
}
