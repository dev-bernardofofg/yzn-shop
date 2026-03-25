import { ForgotPasswordForm } from "@/components/ForgotPasswordForm"
import { ShoppingBag } from "lucide-react"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Forgot Password | YznStore",
  description: "Reset your password to regain access to your account.",
}

export default function ForgotPasswordPage() {
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
              Forgot your password?
            </h2>
            <p className="text-muted-foreground mt-2">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>

          <ForgotPasswordForm />

          <p className="px-2 text-center text-sm text-muted-foreground mt-8">
            Remembered it?{" "}
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
        <div className="absolute inset-0 bg-linear-to-bl from-violet-700 via-indigo-900 to-blue-800 z-0" />
        <div className="absolute bottom-1/4 left-1/4 size-[28rem] bg-violet-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 size-96 bg-indigo-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />

        <Link href="/" className="relative z-10 flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition-opacity">
          <span>Yzn<span className="opacity-80">Store</span></span>
          <ShoppingBag className="size-8" />
        </Link>

        <div className="relative z-10 max-w-lg mt-auto mb-10 flex flex-col items-end">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            🔐 Secure account recovery
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6 leading-[1.1]">
            We&apos;ve got <br />your back.
          </h1>
          <p className="text-lg opacity-90 leading-relaxed font-light text-right max-w-[90%]">
            Happens to everyone. Enter your email and we&apos;ll help you get back into your account quickly.
          </p>
        </div>
      </div>
    </div>
  )
}
