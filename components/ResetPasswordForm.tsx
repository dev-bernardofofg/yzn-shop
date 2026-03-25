"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { FormInput } from "@/components/form/FormInput"
import { Button } from "@/components/ui/button"
import { useResetPassword } from "@/lib/hooks/useResetPassword"
import { useRouter } from "next/navigation"
import { getApiError } from "@/lib/utils"

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  const mutation = useResetPassword()

  const onSubmit = (data: ResetPasswordFormValues) => {
    mutation.mutate(
      { data: { token, password: data.password } },
      {
        onSuccess: () => {
          router.push("/login")
        },
      }
    )
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-4">
        <FormInput
          control={form.control}
          name="password"
          label="New password"
          type="password"
          placeholder="Create a strong password"
        />
        <FormInput
          control={form.control}
          name="confirmPassword"
          label="Confirm new password"
          type="password"
          placeholder="Repeat your new password"
        />
      </div>

      <Button
        type="submit"
        className="w-full mt-4"
        size="lg"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Resetting..." : "Reset password"}
      </Button>

      {mutation.isError && (
        <p className="text-destructive text-sm mt-3 text-center bg-destructive/10 p-2 rounded-md">
          {getApiError(mutation.error, "Could not reset password. The link may have expired.")}
        </p>
      )}
    </form>
  )
}
