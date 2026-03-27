"use client"

import { useState, useReducer } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Controller, type Control, type FieldPath, type FieldValues, type ControllerRenderProps, type FieldError as RHFFieldError } from "react-hook-form"
import { Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { IMaskInput } from "react-imask"
import { cn } from "@/lib/utils"

export type MaskPreset = "cpf" | "currency"

// ── Currency ──────────────────────────────────────────────────────────────────

const moneyFormatter = Intl.NumberFormat("pt-BR", {
  currency: "BRL",
  currencyDisplay: "symbol",
  currencySign: "standard",
  style: "currency",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

function CurrencyInput({
  field,
  invalid,
  placeholder,
  disabled,
}: {
  field: ControllerRenderProps<any, any>
  invalid: boolean
  placeholder?: string
  disabled?: boolean
}) {
  const [display, updateDisplay] = useReducer((_: string, next: string) => {
    const digits = next.replace(/\D/g, "")
    return digits ? moneyFormatter.format(Number(digits) / 100) : ""
  }, field.value != null && field.value !== "" ? moneyFormatter.format(Number(field.value)) : "")

  return (
    <Input
      id={field.name}
      type="text"
      value={display}
      ref={field.ref}
      onBlur={field.onBlur}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={invalid}
      onChange={(e) => {
        updateDisplay(e.target.value)
        const digits = e.target.value.replace(/\D/g, "")
        field.onChange(digits ? Number(digits) / 100 : "")
      }}
    />
  )
}

// ── CPF ───────────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"

function CpfInput({
  field,
  invalid,
  placeholder,
  disabled,
}: {
  field: ControllerRenderProps<any, any>
  invalid: boolean
  placeholder?: string
  disabled?: boolean
}) {
  return (
    <IMaskInput
      mask="000.000.000-00"
      id={field.name}
      value={String(field.value ?? "")}
      inputRef={field.ref}
      onBlur={field.onBlur}
      onAccept={(value: string) => field.onChange(value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-invalid={invalid}
      className={cn(INPUT_CLASS)}
    />
  )
}

// ── FormInput ─────────────────────────────────────────────────────────────────

type FormInputProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  name: FieldPath<TFieldValues>
  label: string
  description?: string
  placeholder?: string
  type?: React.ComponentProps<"input">["type"]
  disabled?: boolean
  mask?: MaskPreset
}

export function FormInput<TFieldValues extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder,
  type = "text",
  disabled,
  mask,
}: FormInputProps<TFieldValues>) {
  const [showPassword, setShowPassword] = useState(false)
  const isPassword = type === "password"
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={field.name}>{label}</FieldLabel>
          <div className="relative">
            {mask === "currency" ? (
              <CurrencyInput
                field={field}
                invalid={fieldState.invalid}
                placeholder={placeholder}
                disabled={disabled}
              />
            ) : mask === "cpf" ? (
              <CpfInput
                field={field}
                invalid={fieldState.invalid}
                placeholder={placeholder}
                disabled={disabled}
              />
            ) : (
              <Input
                {...field}
                id={field.name}
                type={resolvedType}
                placeholder={placeholder}
                disabled={disabled}
                aria-invalid={fieldState.invalid}
                className={isPassword ? "pr-9" : undefined}
              />
            )}
            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={disabled}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                className="absolute inset-y-0 right-0 flex items-center px-2.5 text-muted-foreground hover:text-foreground disabled:pointer-events-none disabled:opacity-50"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            )}
          </div>
          {description && <FieldDescription>{description}</FieldDescription>}
          {fieldState.invalid && <FieldError errors={[fieldState.error as RHFFieldError]} />}
        </Field>
      )}
    />
  )
}
