"use client"

import { Button } from "@/components/ui/button"
import { AnimatePresence, motion } from "framer-motion"
import { Lock, LogIn, UserPlus } from "lucide-react"
import { useRouter } from "next/navigation"

interface AuthRequiredDialogProps {
  open: boolean
  onClose: () => void
}

export function AuthRequiredDialog({ open, onClose }: AuthRequiredDialogProps) {
  const router = useRouter()

  const handleNavigate = (path: string) => {
    onClose()
    router.push(path)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-pointer"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative w-full max-w-md bg-card border border-border shadow-2xl rounded-3xl p-8 overflow-hidden isolate"
          >
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/20 blur-[80px] rounded-full -z-10" />
            <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-blue-500/20 blur-[80px] rounded-full -z-10" />

            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full text-primary">
                <Lock className="w-8 h-8" />
              </div>
            </div>

            <h3 className="text-2xl font-heading font-extrabold text-center mb-3">
              Sign in required
            </h3>
            <p className="text-muted-foreground text-center mb-8 font-light">
              To complete your purchase and secure your exclusive items, you need to be signed in to YznStore.
            </p>

            <div className="flex flex-col gap-3">
              <Button
                size="lg"
                className="w-full text-md font-semibold h-12 rounded-xl"
                onClick={() => handleNavigate("/login")}
              >
                <LogIn className="w-4 h-4 mr-2" /> Sign In
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full text-md font-semibold h-12 rounded-xl"
                onClick={() => handleNavigate("/register")}
              >
                <UserPlus className="w-4 h-4 mr-2" /> Create Account
              </Button>
            </div>

            <div className="mt-6 text-center">
              <button
                onClick={onClose}
                className="text-sm font-medium text-muted-foreground hover:text-foreground underline-offset-4 hover:underline transition-colors"
              >
                Back to store
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
