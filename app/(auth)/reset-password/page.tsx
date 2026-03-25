import { ResetPasswordForm } from "@/components/ResetPasswordForm"
import { AlertTriangle, ShoppingBag } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Reset Password | YznStore",
  description: "Set a new password for your account.",
}

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const { token } = await searchParams

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background relative selection:bg-primary/20 order-last lg:order-first">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="lg:hidden flex items-center gap-2 text-primary font-bold mb-8">
              <ShoppingBag className="h-6 w-6" />
              <span>Yzn<span className="opacity-80">Store</span></span>
            </Link>
            <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">
              Set new password
            </h2>
            <p className="text-muted-foreground mt-2">
              Choose a strong password for your account.
            </p>
          </div>

          {token ? (
            <ResetPasswordForm token={token} />
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>
                Invalid or missing reset token.{" "}
                <Link href="/forgot-password" className="underline underline-offset-4 font-medium">
                  Request a new link.
                </Link>
              </span>
            </div>
          )}

          <p className="px-2 text-center text-sm text-muted-foreground mt-8">
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Back to sign in
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:flex flex-col justify-between items-end p-12 bg-primary overflow-hidden text-primary-foreground text-right order-first lg:order-last">
        <div className="absolute inset-0 bg-gradient-to-bl from-emerald-700 via-teal-900 to-cyan-800 z-0" />
        <div className="absolute bottom-1/4 left-1/4 size-[28rem] bg-teal-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 size-96 bg-emerald-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />

        <Link href="/" className="relative z-10 flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition-opacity">
          <span>Yzn<span className="opacity-80">Store</span></span>
          <ShoppingBag className="size-8" />
        </Link>

        <div className="relative z-10 max-w-lg mt-auto mb-10 flex flex-col items-end">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            ✅ Almost there
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6 leading-[1.1]">
            A fresh start <br />awaits.
          </h1>
          <p className="text-lg opacity-90 leading-relaxed font-light text-right max-w-[90%]">
            Set your new password and get right back to exploring everything YznStore has to offer.
          </p>
        </div>
      </div>
    </div>
  )
}
