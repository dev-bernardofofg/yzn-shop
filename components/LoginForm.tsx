"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormInput } from "@/components/form/FormInput"
import { Button } from "@/components/ui/button"
import { useLogin } from "@/generated/index"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { getApiError } from "@/lib/utils"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const loginMutation = useLogin()
  const { login } = useAuth()

  const onSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(
      { data },
      {
        onSuccess: (res) => {
          if (res.data?.token && res.data?.user) {
            login(res.data.token, res.data.user)
          }
        },
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <FormInput
          control={form.control}
          name="password"
          label="Password"
          type="password"
          placeholder="Your password"
        />
      </div>

      <div className="flex justify-end pt-1">
        <Link href="/forgot-password" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors underline-offset-4 hover:underline">
          Forgot your password?
        </Link>
      </div>

      <Button
        type="submit"
        className="w-full mt-4"
        size="lg"
        disabled={loginMutation.isPending}
      >
        {loginMutation.isPending ? "Signing in..." : "Sign in"}
      </Button>

      {loginMutation.isError && (
        <p className="text-destructive text-sm mt-3 text-center bg-destructive/10 p-2 rounded-md">
          {getApiError(loginMutation.error, "Incorrect email or password.")}
        </p>
      )}
    </form>
  )
}
