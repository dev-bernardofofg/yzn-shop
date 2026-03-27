"use client"

import { useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { cn } from "@/lib/utils"
import {
  ShoppingBag,
  Package,
  ShoppingCart,
  Tag,
  Users,
  LogOut,
  ChevronLeft,
} from "lucide-react"

const NAV = [
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/coupons", label: "Coupons", icon: Tag },
  { href: "/admin/users", label: "Users", icon: Users },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user && user.role !== "admin") router.replace("/")
  }, [user, router])

  if (!user || user.role !== "admin") return null

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:flex flex-col w-60 border-r border-border bg-card fixed inset-y-0 left-0 z-40">
        <div className="h-16 flex items-center px-6 border-b border-border flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span>
              Yzn<span className="text-muted-foreground font-normal text-sm"> Admin</span>
            </span>
          </Link>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {NAV.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-border space-y-0.5">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Store
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Top bar — mobile */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-sm">
          <ShoppingBag className="h-4 w-4 text-primary" />
          YznAdmin
        </Link>
        <div className="flex items-center gap-1">
          {NAV.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                "p-2 rounded-lg transition-colors",
                pathname.startsWith(href)
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-4 w-4" />
            </Link>
          ))}
          <button
            onClick={logout}
            title="Sign out"
            className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 lg:pl-60 min-w-0">
        <div className="lg:hidden h-14" />
        {children}
      </div>
    </div>
  )
}
