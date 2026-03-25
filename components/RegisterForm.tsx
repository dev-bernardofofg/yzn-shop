"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormInput } from "@/components/form/FormInput"
import { Button } from "@/components/ui/button"
import { useRegister } from "@/generated/index"
import { useRouter } from "next/navigation"
import { getApiError } from "@/lib/utils"

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  last_name: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

type RegisterFormValues = z.infer<typeof registerSchema>

export function RegisterForm() {
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      last_name: "",
      email: "",
      password: "",
    },
  })

  const registerMutation = useRegister()
  const router = useRouter()

  const onSubmit = (data: RegisterFormValues) => {
    registerMutation.mutate({ data }, {
      onSuccess: () => {
        router.push("/login")
      },
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            control={form.control}
            name="name"
            label="First name"
            placeholder="e.g. Maria"
          />
          <FormInput
            control={form.control}
            name="last_name"
            label="Last name"
            placeholder="e.g. Oliveira"
          />
        </div>
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
          placeholder="Create a strong password"
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-6"
        size="lg"
        disabled={registerMutation.isPending}
      >
        {registerMutation.isPending ? "Creating account..." : "Create account"}
      </Button>

      {registerMutation.isError && (
        <p className="text-destructive text-sm mt-3 text-center">
          {getApiError(registerMutation.error)}
        </p>
      )}

      {registerMutation.isSuccess && (
        <p className="text-green-600 text-sm mt-3 text-center">
          Account created successfully!
        </p>
      )}
    </form>
  )
}
