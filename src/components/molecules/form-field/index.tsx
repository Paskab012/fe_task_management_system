import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
  required?: boolean
  description?: string
  icon?: React.ReactNode
}

export const FormField = React.forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, required, description, icon, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label}
          {required && <span className="ml-1 text-destructive">*</span>}
        </Label>
        <div className="relative">
          {icon && (
            <div className="absolute z-10 -translate-y-1/2 left-3 top-1/2">
              {icon}
            </div>
          )}
          <Input
            ref={ref}
            className={cn(
              error && 'border-destructive focus-visible:ring-destructive',
              icon && 'pl-10', // Add left padding when icon is present
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${props.id}-error` : undefined}
            {...props}
          />
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        {error && (
          <p id={`${props.id}-error`} className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }
)
FormField.displayName = 'FormField'