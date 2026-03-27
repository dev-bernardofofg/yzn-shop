"use client"

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { User } from "@/generated/types/User"
import { STORAGE_KEYS } from "@/lib/constants"

const AUTH_COOKIE = "yzn_auth"
const ROLE_COOKIE = "yzn_role"
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function setAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

function setRoleCookie(role: string) {
  document.cookie = `${ROLE_COOKIE}=${role}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearRoleCookie() {
  document.cookie = `${ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  login: (token: string, userData: User, redirectTo?: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function initUser(): User | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem(STORAGE_KEYS.token)
  const storedUser = localStorage.getItem(STORAGE_KEYS.user)
  if (!token || !storedUser) {
    clearAuthCookie()
    clearRoleCookie()
    return null
  }
  try {
    const user = JSON.parse(storedUser) as User
    setAuthCookie()
    if (user.role === "admin") setRoleCookie("admin")
    else clearRoleCookie()
    return user
  } catch {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
    clearAuthCookie()
    clearRoleCookie()
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(initUser)
  const router = useRouter()

  const login = (token: string, userData: User, redirectTo = "/") => {
    localStorage.setItem(STORAGE_KEYS.token, token)
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData))
    setAuthCookie()
    if (userData.role === "admin") {
      setRoleCookie("admin")
      router.push("/admin")
    } else {
      clearRoleCookie()
      router.push(redirectTo)
    }
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.user)
    clearAuthCookie()
    clearRoleCookie()
    setUser(null)
    router.push("/login")
  }

  const logoutRef = useRef(logout)
  useEffect(() => {
    logoutRef.current = logout
  })

  useEffect(() => {
    const handleAuthLogout = () => logoutRef.current()
    window.addEventListener("auth:logout", handleAuthLogout)
    return () => window.removeEventListener("auth:logout", handleAuthLogout)
  }, [])

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
