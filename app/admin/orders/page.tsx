"use client"

import { useState } from "react"
import { useAdminGetOrders } from "@/generated/hooks/useAdminGetOrders"
import { useAdminUpdateOrderStatus } from "@/generated/hooks/useAdminUpdateOrderStatus"
import { formatCurrency, cn } from "@/lib/utils"
import { Loader2, Package } from "lucide-react"
import { Order } from "@/generated/types/Order"

type Status = Order["status"]

const STATUS_OPTS: { value: Status; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
]

const STATUS_CLASS: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400",
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
}

const TABS: { label: string; value: Status | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Cancelled", value: "cancelled" },
]

export default function AdminOrdersPage() {
  const { data, isLoading, refetch } = useAdminGetOrders()
  const updateStatus = useAdminUpdateOrderStatus()
  const [activeTab, setActiveTab] = useState<Status | "all">("all")
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const allOrders = [...(data?.data || [])].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const orders =
    activeTab === "all" ? allOrders : allOrders.filter((o) => o.status === activeTab)

  const handleStatusChange = (id: number, status: Status) => {
    setUpdatingId(id)
    updateStatus.mutate(
      { id, data: { status } },
      {
        onSettled: () => setUpdatingId(null),
        onSuccess: () => refetch(),
      }
    )
  }

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">Orders</h1>
        <p className="text-sm text-muted-foreground mt-1">{allOrders.length} total</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-border">
        {TABS.map((tab) => {
          const count = tab.value === "all"
            ? allOrders.length
            : allOrders.filter((o) => o.status === tab.value).length
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
                activeTab === tab.value
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              <span className="ml-1.5 text-xs opacity-70">({count})</span>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed border-border rounded-2xl">
          <Package className="h-10 w-10 mb-3 opacity-40" />
          <p className="font-medium text-foreground">No orders</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Order</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Date</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Items</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Total</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {orders.map((order) => (
                <tr key={order.id} className="bg-card hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 font-medium">#{order.id}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-center text-muted-foreground hidden sm:table-cell">
                    {order.items.length}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {updatingId === order.id ? (
                      <div className="flex justify-end">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      </div>
                    ) : (
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as Status)}
                        className={cn(
                          "text-xs font-semibold px-2 py-1 rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50",
                          STATUS_CLASS[order.status]
                        )}
                      >
                        {STATUS_OPTS.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-background text-foreground">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    )}
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
