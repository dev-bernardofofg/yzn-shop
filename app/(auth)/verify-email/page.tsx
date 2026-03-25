"use client"

import { Button } from "@/components/ui/button"
import { useVerifyEmail } from "@/generated"
import { CheckCircle2, Loader2, ShoppingBag, XCircle } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

const VerifyEmailPage = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const { isSuccess, isError, isPending } = useVerifyEmail(token ?? "")

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background relative selection:bg-primary/20">
        <div className="w-full max-w-[420px]">
          <Link href="/" className="lg:hidden flex items-center gap-2 text-primary font-bold mb-10">
            <ShoppingBag className="h-6 w-6" />
            <span>Yzn<span className="opacity-80">Store</span></span>
          </Link>

          {!token ? (
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">Invalid link</h2>
              <p className="text-muted-foreground">This verification link is invalid or has expired.</p>
              <Link href="/login" className="mt-2">
                <Button className="rounded-full px-6">Back to sign in</Button>
              </Link>
            </div>
          ) : isPending ? (
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">Verifying your email</h2>
              <p className="text-muted-foreground">Please wait while we confirm your account…</p>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
              <CheckCircle2 className="h-12 w-12 text-emerald-500" />
              <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">Email verified!</h2>
              <p className="text-muted-foreground">
                Your account has been confirmed. You can now sign in and start shopping.
              </p>
              <Link href="/login" className="mt-2">
                <Button className="rounded-full px-6">Sign in to your account</Button>
              </Link>
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">Verification failed</h2>
              <p className="text-muted-foreground">
                We could not verify your email. The link may have expired or already been used.
              </p>
              <Link href="/login" className="mt-2">
                <Button variant="outline" className="rounded-full px-6">Back to sign in</Button>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative hidden lg:flex flex-col justify-between items-end p-12 overflow-hidden text-primary-foreground text-right">
        <div className="absolute inset-0 bg-linear-to-bl from-emerald-600 via-teal-800 to-cyan-900 z-0" />
        <div className="absolute bottom-1/4 left-1/4 size-[28rem] bg-teal-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 size-96 bg-emerald-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />

        <Link href="/" className="relative z-10 flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition-opacity">
          <span>Yzn<span className="opacity-80">Store</span></span>
          <ShoppingBag className="h-8 w-8" />
        </Link>

        <div className="relative z-10 max-w-lg mt-auto mb-10 flex flex-col items-end">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            ✅ Almost there
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6 leading-[1.1]">
            One step closer <br />to great finds.
          </h1>
          <p className="text-lg opacity-90 leading-relaxed font-light text-right max-w-[90%]">
            Verify your email to unlock access to thousands of products and exclusive deals curated just for you.
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyEmailPage