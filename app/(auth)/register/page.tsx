import { RegisterForm } from "@/components/RegisterForm"
import { Metadata } from "next"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export const metadata: Metadata = {
  title: "Create Account | YznStore",
  description: "Create your account and start shopping.",
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col justify-between items-start p-12 bg-primary overflow-hidden text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-purple-700/80 to-blue-900/90 z-0" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-500/30 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: "1s" }} />

        <Link href="/" className="relative z-10 flex items-center gap-2 text-2xl font-bold hover:opacity-90 transition-opacity">
          <ShoppingBag className="h-8 w-8" />
          <span>Yzn<span className="opacity-80">Store</span></span>
        </Link>

        <div className="relative z-10 max-w-lg mt-auto mb-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
            ✨ A new shopping experience
          </div>
          <h1 className="text-4xl lg:text-5xl font-heading font-extrabold tracking-tight mb-6 leading-[1.1]">
            Discover a world of possibilities.
          </h1>
          <p className="text-lg opacity-90 leading-relaxed font-light">
            From cutting-edge electronics to exclusive handcrafted items.
            Everything you can imagine, for every style, all in one place. Join the flexible retail revolution.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background relative selection:bg-primary/20">
        <div className="w-full max-w-[420px]">
          <div className="mb-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/" className="lg:hidden flex items-center gap-2 text-primary font-bold mb-8">
              <ShoppingBag className="h-6 w-6" />
              <span>Yzn<span className="opacity-80">Store</span></span>
            </Link>
            <h2 className="text-3xl font-heading font-bold tracking-tight text-foreground">
              Create your account
            </h2>
            <p className="text-muted-foreground mt-2">
              Fill in the details below to get started.
            </p>
          </div>

          <RegisterForm />

          <p className="px-2 text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary transition-colors"
            >
              Sign in
            </Link>
          </p>

          <p className="px-8 text-center text-xs text-muted-foreground mt-8">
            By continuing, you agree to our{" "}
            <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
