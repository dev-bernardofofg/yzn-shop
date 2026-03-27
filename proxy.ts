import { NextResponse } from "next/server"
import type { NextRequest, NextProxy, ProxyConfig } from "next/server"

const AUTH_COOKIE = "yzn_auth"
const ROLE_COOKIE = "yzn_role"

const PROTECTED_ROUTES = ["/checkout", "/orders"]
const ADMIN_ROUTES = ["/admin"]
const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"]

export const proxy: NextProxy = (request: NextRequest) => {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has(AUTH_COOKIE)
  const isAdmin = request.cookies.get(ROLE_COOKIE)?.value === "admin"

  if (ADMIN_ROUTES.some((p) => pathname.startsWith(p))) {
    if (!isAuthenticated) {
      const url = request.nextUrl.clone()
      url.pathname = "/login"
      url.searchParams.set("redirect", pathname)
      return NextResponse.redirect(url)
    }
    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  if (PROTECTED_ROUTES.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if (AUTH_ROUTES.some((p) => pathname === p) && isAuthenticated) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config: ProxyConfig = {
  matcher: [
    "/admin/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
}
