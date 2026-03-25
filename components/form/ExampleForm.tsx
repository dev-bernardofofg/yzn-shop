"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { FieldGroup } from "@/components/ui/field"
import { FormInput, FormTextarea, FormSelect, FormCheckbox } from "@/components/form"

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Please select a role"),
  bio: z.string().optional(),
  acceptTerms: z.boolean().refine((v) => v === true, {
    message: "You must accept the terms",
  }),
})

type FormValues = z.infer<typeof schema>

export function ExampleForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      role: "",
      bio: "",
      acceptTerms: false,
    },
  })

  function onSubmit(data: FormValues) {
    console.log(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="max-w-md space-y-4">
      <FieldGroup>
        <FormInput
          control={form.control}
          name="name"
          label="Full name"
          placeholder="Your full name"
        />
        <FormInput
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <FormSelect
          control={form.control}
          name="role"
          label="Role"
          placeholder="Select..."
          options={[
            { value: "admin", label: "Administrator" },
            { value: "editor", label: "Editor" },
            { value: "viewer", label: "Viewer" },
          ]}
        />
        <FormTextarea
          control={form.control}
          name="bio"
          label="Bio"
          placeholder="Tell us a bit about yourself"
          description="Optional. Up to 200 characters."
        />
        <FormCheckbox
          control={form.control}
          name="acceptTerms"
          label="I accept the terms of service"
        />
      </FieldGroup>
      <Button type="submit">Submit</Button>
    </form>
  )
}
