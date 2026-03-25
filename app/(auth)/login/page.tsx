import { LoginForm } from "@/components/LoginForm"
import { Metadata } from "next"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Sign In | YznStore",
  description: "Sign in to your account to continue.",
}

export default function LoginPage() {
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
              Welcome back
            </h2>
            <p className="text-muted-foreground mt-2">
              Sign in to your account to continue shopping.
            </p>
          </div>

          <LoginForm />

          <p className="px-2 text-center text-sm text-muted-foreground mt-[2rem]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Create one now
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden lg:flex flex-col justify-between items-end p-12 bg-primary overflow-hidden text-primary-foreground text-right order-first lg:order-last">
        <div className="absolute inset-0 bg-gradient-to-bl from-blue-700 via-indigo-900 to-cyan-800 z-0" />
        <div className="absolute bottom-1/4 left-1/4 w-[28rem] h-[28rem] bg-cyan-400/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />

        <Link href="/" className="relative z-10 flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition-opacity">
          <span>Yzn<span className="opacity-80">Store</span></span>
          <ShoppingBag className="h-8 w-8" />
        </Link>

        <div className="relative z-10 max-w-lg mt-auto mb-10 flex flex-col items-end">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            🚀 New arrivals are waiting
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6 leading-[1.1]">
            Your style, <br />our collections.
          </h1>
          <p className="text-lg opacity-90 leading-relaxed font-light text-right max-w-[90%]">
            Keep exploring a vast catalog that understands your needs and reflects your everyday identity.
          </p>
        </div>
      </div>
    </div>
  )
}
