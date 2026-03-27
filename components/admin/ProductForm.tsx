"use client"

import { FormInput } from "@/components/form/FormInput"
import { FormTextarea } from "@/components/form/FormTextarea"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { Download, Loader2, Package } from "lucide-react"
import { useForm, useWatch, type Resolver } from "react-hook-form"
import * as z from "zod"

const schema = z.object({
  product_type: z.enum(["physical", "digital"]),
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  price: z.coerce.number({ message: "Required" }).positive("Must be greater than 0"),
  category: z.string().optional(),
  image_url: z.union([z.literal(""), z.string().url("Invalid image URL")]),
  slug: z.string().optional(),
  file_url: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.product_type === "digital" && !data.file_url?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "File URL is required for digital products",
      path: ["file_url"],
    })
  }
})

export type ProductFormValues = z.infer<typeof schema>

interface ProductFormProps {
  defaultValues?: Partial<ProductFormValues>
  onSubmit: (values: ProductFormValues) => void
  isPending: boolean
  submitLabel?: string
  error?: string | null
  onCancel?: () => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">
      {children}
    </p>
  )
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isPending,
  submitLabel = "Save Product",
  error,
  onCancel,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(schema) as Resolver<ProductFormValues>,
    defaultValues: {
      product_type: "digital",
      name: "",
      description: "",
      price: undefined,
      category: "",
      image_url: "",
      slug: "",
      file_url: "",
      ...defaultValues,
    },
  })

  const productType = useWatch({ control: form.control, name: "product_type" })
  const isDigital = productType === "digital"

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-7">

      {/* Type switcher */}
      <div className="flex gap-1 p-1 bg-muted rounded-xl">
        {(["physical", "digital"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => form.setValue("product_type", type, { shouldValidate: true })}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg py-2 text-sm font-medium transition-colors",
              productType === type
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {type === "physical"
              ? <><Package className="h-4 w-4" />Physical</>
              : <><Download className="h-4 w-4" />Digital</>
            }
          </button>
        ))}
      </div>

      {/* Basic info */}
      <div>
        <SectionLabel>Basic info</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormInput control={form.control} name="name" label="Name" placeholder="Product name" />
          <FormInput control={form.control} name="price" label="Price" mask="currency" placeholder="0,00" />
          <FormInput control={form.control} name="category" label="Category" placeholder="Electronics, Fashion…" />
          <FormInput control={form.control} name="slug" label="Slug" placeholder="my-product-slug" />
        </div>
      </div>

      {/* Media */}
      <div>
        <SectionLabel>Media</SectionLabel>
        <div className="space-y-4">
          <FormInput
            control={form.control}
            name="image_url"
            label="Image URL"
            type="url"
            placeholder="https://…"
            description="Public URL for the product image"
          />
          {isDigital && (
            <FormInput
              control={form.control}
              name="file_url"
              label="File URL"
              placeholder="https://example.com/file.zip"
              description="URL for the downloadable file"
            />
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <SectionLabel>Description</SectionLabel>
        <FormTextarea
          control={form.control}
          name="description"
          label="Description"
          placeholder="Describe your product…"
          rows={4}
        />
      </div>

      {error && (
        <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}

      <div className="flex items-center justify-end gap-3 pt-1">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</>
          ) : submitLabel}
        </Button>
      </div>
    </form>
  )
}
