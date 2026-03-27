"use client"

import { useAdminGetUsers } from "@/generated/hooks/useAdminGetUsers"
import { User } from "@/generated/types/User"
import { cn } from "@/lib/utils"
import { Loader2, Users } from "lucide-react"

export default function AdminUsersPage() {
  const { data, isLoading } = useAdminGetUsers()

  const users = data?.data || []

  return (
    <div className="p-6 lg:p-10">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-extrabold tracking-tight">Users</h1>
        <p className="text-sm text-muted-foreground mt-1">{users.length} total</p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground border border-dashed border-border rounded-2xl">
          <Users className="h-10 w-10 mb-3 opacity-40" />
          <p className="font-medium text-foreground">No users found</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 border-b border-border">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">User</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden md:table-cell">Email</th>
                <th className="text-center px-4 py-3 font-semibold text-muted-foreground">Role</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground hidden lg:table-cell">Phone</th>
                <th className="text-right px-4 py-3 font-semibold text-muted-foreground hidden sm:table-cell">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {users.map((user: User) => (
                <tr key={user.id} className="bg-card hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name} {user.last_name}</p>
                        <p className="text-xs text-muted-foreground md:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{user.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn(
                      "text-xs font-semibold px-2 py-0.5 rounded-full",
                      user.role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    )}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden lg:table-cell">
                    {user.phone || "—"}
                  </td>
                  <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                      : "—"}
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
