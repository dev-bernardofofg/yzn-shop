"use client"

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form"
import { Field, FieldDescription, FieldError } from "@/components/ui/field"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

type FormCheckboxProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  description?: string
  disabled?: boolean
}

export function FormCheckbox<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled,
}: FormCheckboxProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} orientation="horizontal">
          <Checkbox
            id={field.name}
            checked={field.value}
            onCheckedChange={field.onChange}
            onBlur={field.onBlur}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
          />
          <div className="flex flex-col gap-0.5">
            <Label htmlFor={field.name}>{label}</Label>
            {description && <FieldDescription>{description}</FieldDescription>}
          </div>
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  )
}
