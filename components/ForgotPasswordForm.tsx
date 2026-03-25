"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormInput } from "@/components/form/FormInput"
import { Button } from "@/components/ui/button"
import { useForgotPassword } from "@/lib/hooks/useForgotPassword"
import { getApiError } from "@/lib/utils"

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  })

  const mutation = useForgotPassword()

  const onSubmit = (data: ForgotPasswordFormValues) => {
    mutation.mutate({ data })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormInput
        control={form.control}
        name="email"
        label="Email"
        type="email"
        placeholder="you@example.com"
      />

      <Button
        type="submit"
        className="w-full mt-4"
        size="lg"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Sending..." : "Send reset link"}
      </Button>

      {mutation.isError && (
        <p className="text-destructive text-sm mt-3 text-center bg-destructive/10 p-2 rounded-md">
          {getApiError(mutation.error, "Could not send reset email. Try again.")}
        </p>
      )}

      {mutation.isSuccess && (
        <p className="text-sm mt-3 text-center bg-green-500/10 text-green-600 dark:text-green-400 p-2 rounded-md">
          Check your inbox — we sent you a reset link.
        </p>
      )}
    </form>
  )
}
