"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/generated/types/User"
import { STORAGE_KEYS } from "@/lib/constants"

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (token: string, userData: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function initUser(): User | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(STORAGE_KEYS.token)
  const storedUser = localStorage.getItem(STORAGE_KEYS.user)
  if (!token || !storedUser) return null
  try {
    return JSON.parse(storedUser) as User
  } catch {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initUser)
  const router = useRouter()

  const login = (token: string, userData: User) => {
    localStorage.setItem(STORAGE_KEYS.token, token)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData))
    setUser(userData)
    router.push("/")
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
    setUser(null)
    router.push("/login")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
