"use client"

import { useState } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useGetCoupons } from "@/generated/hooks/useGetCoupons"
import { useCreateCoupon } from "@/generated/hooks/useCreateCoupon"
import { useUpdateCoupon } from "@/generated/hooks/useUpdateCoupon"
import { useDeactivateCoupon } from "@/generated/hooks/useDeactivateCoupon"
import { formatCurrency, cn, getApiError } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FormInput } from "@/components/form/FormInput"
import { FormSelect } from "@/components/form/FormSelect"
import { Coupon } from "@/generated/types/Coupon"
import {
  Plus,
  Loader2,
  Tag,
  Pencil,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

const couponSchema = z.object({
  code: z.string().min(1, "Code is required").toUpperCase(),
  discount: z.coerce.number({ message: "Required" }).positive("Must be positive"),
  discount_type: z.enum(["percentage", "fixed"]),
  expires_at: z.string().min(1, "Required"),
  usage_limit: z.coerce.number({ message: "Required" }).int().positive("Must be positive"),
  min_order_value: z.coerce.number().nonnegative().optional(),
})

type CouponFormValues = z.infer<typeof couponSchema>

const DISCOUNT_TYPE_OPTS = [
  { label: "Percentage (%)", value: "percentage" },
  { label: "Fixed (R$)", value: "fixed" },
]

function toISODate(dateStr: string) {
  return new Date(dateStr + "T23:59:59.000Z").toISOString()
}

function toDateInput(isoStr: string) {
  return isoStr.substring(0, 10)
}

interface CouponFormPanelProps {
  defaultValues?: Partial<CouponFormValues>
  onSubmit: (values: CouponFormValues) => void
  isPending: boolean
  error: string | null
  onCancel: () => void
  submitLabel?: string
}

function CouponFormPanel({
  defaultValues,
  onSubmit,
  isPending,
  error,
  onCancel,
  submitLabel = "Save Coupon",
}: CouponFormPanelProps) {
  const form = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema) as Resolver<CouponFormValues>,
    defaultValues: {
      code: "",
      discount: undefined,
      discount_type: "percentage",
      expires_at: "",
      usage_limit: undefined,
      min_order_value: undefined,
      ...defaultValues,
    },
  })

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FormInput control={form.control} name="code" label="Code" placeholder="SUMMER20" />
        <FormInput control={form.control} name="discount" label="Discount" type="number" placeholder="20" />
        <FormSelect
          control={form.control}
          name="discount_type"
          label="Type"
          options={DISCOUNT_TYPE_OPTS}
        />
        <FormInput control={form.control} name="expires_at" label="Expires at" type="date" />
        <FormInput control={form.control} name="usage_limit" label="Usage limit" type="number" placeholder="100" />
        <FormInput
          control={form.control}
          name="min_order_value"
          label="Min. order value"
          mask="currency"
          placeholder="0,00"
          description="Leave empty for no minimum"
        />
      </div>

      {error && (
        <p className="text-destructive text-sm bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
      )}

      <div className="flex items-center justify-end gap-3">
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={isPending}>
          Cancel
        </Button>
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Saving…</> : submitLabel}
        </Button>
      </div>
    </form>
  )
}

export default function AdminCouponsPage() {
  const { data, isLoading, refetch } = useGetCoupons()
  const createCoupon = useCreateCoupon()
  const updateCoupon = useUpdateCoupon()
  const deactivateCoupon = useDeactivateCoupon()

  const [showCreate, setShowCreate] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const coupons = data?.data || []

  const handleCreate = (values: CouponFormValues) => {
    setFormError(null)
    createCoupon.mutate(
      {
        data: {
          code: values.code,
          discount: values.discount,
          discount_type: values.discount_type,
          expires_at: toISODate(values.expires_at),
          usage_limit: values.usage_limit,
          min_order_value: values.min_order_value
            ? Math.round(values.min_order_value * 100)
            : undefined,
        },
      },
      {
        onSuccess: () => { setShowCreate(false); refetch() },
        onError: (err) => setFormError(getApiError(err, "Could not create coupon.")),
      }
    )
  }

  const handleUpdate = (id: number, values: CouponFormValues) => {
    setFormError(null)
    updateCoupon.mutate(
      {
        id,
        data: {
          code: values.code,
          discount: values.discount,
          discount_type: values.discount_type,
          expires_at: toISODate(values.expires_at),
          usage_limit: values.usage_limit,
          min_order_value: values.min_order_value
            ? Math.round(values.min_order_value * 100)
            : undefined,
        },
      },
      {
        onSuccess: () => { setEditingId(null); refetch() },
        onError: (err) => setFormError(getApiError(err, "Could not update coupon.")),
      }
    )
  }

  const handleDeactivate = (id: number) => {
    deactivateCoupon.mutate({ id }, { onSuccess: () => refetch() })
  }

  return (
    <div className="p-6 lg:p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground mt-1">{coupons.length} total</p>
        </div>
        <Button
          className="rounded-full gap-2"
          onClick={() => { setShowCreate((v) => !v); setEditingId(null); setFormError(null) }}
        >
          {showCreate ? <ChevronUp className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showCreate ? "Cancel" : "New Coupon"}
        </Button>
      </div>

      {/* Create form */}
      {showCreate && (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 mb-6">
          <h2 className="font-semibold text-sm mb-4">New Coupon</h2>
          <CouponFormPanel
            onSubmit={handleCreate}
            isPending={createCoupon.isPending}
            error={formError}
            onCancel={() => { setShowCreate(false); setFormError(null) }}
            submitLabel="Create Coupon"
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : coupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed border-border rounded-2xl">
          <Tag className="h-10 w-10 mb-3 opacity-40" />
          <p className="font-medium text-foreground">No coupons yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {coupons.map((coupon: Coupon) => (
            <div key={coupon.id} className="rounded-2xl border border-border bg-card overflow-hidden">
              {/* Row */}
              <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                <span className="font-mono font-bold text-sm tracking-wider text-foreground">
                  {coupon.code}
                </span>
                <span className={cn(
                  "text-xs font-semibold px-2 py-0.5 rounded-full",
                  coupon.active
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                )}>
                  {coupon.active ? "Active" : "Inactive"}
                </span>
                <span className="text-sm text-muted-foreground">
                  {coupon.discount_type === "percentage"
                    ? `${coupon.discount}% off`
                    : `${formatCurrency(coupon.discount)} off`}
                </span>
                {coupon.min_order_value != null && (
                  <span className="text-xs text-muted-foreground">
                    min. {formatCurrency(coupon.min_order_value)}
                  </span>
                )}
                <span className="text-xs text-muted-foreground ml-auto">
                  {coupon.current_usage}/{coupon.usage_limit} uses ·{" "}
                  exp. {new Date(coupon.expires_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 rounded-lg"
                    onClick={() => {
                      setEditingId(editingId === coupon.id ? null : coupon.id)
                      setFormError(null)
                    }}
                  >
                    {editingId === coupon.id ? <X className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
                  </Button>
                  {coupon.active && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg"
                      onClick={() => handleDeactivate(coupon.id)}
                      disabled={deactivateCoupon.isPending}
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              </div>

              {/* Inline edit form */}
              {editingId === coupon.id && (
                <div className="border-t border-border px-5 py-4 bg-muted/20">
                  <CouponFormPanel
                    defaultValues={{
                      code: coupon.code,
                      discount: coupon.discount,
                      discount_type: coupon.discount_type,
                      expires_at: toDateInput(coupon.expires_at),
                      usage_limit: coupon.usage_limit,
                      min_order_value: coupon.min_order_value
                        ? coupon.min_order_value / 100
                        : undefined,
                    }}
                    onSubmit={(values) => handleUpdate(coupon.id, values)}
                    isPending={updateCoupon.isPending}
                    error={formError}
                    onCancel={() => { setEditingId(null); setFormError(null) }}
                    submitLabel="Save Changes"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
