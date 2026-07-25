'use client';

import { useFormContext } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  name: string;
  label?: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({
  name,
  label,
  required,
  error: externalError,
  children,
  className,
}: FormFieldProps) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = externalError ?? (errors[name]?.message as string | undefined);

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <Label htmlFor={name}>
          {label}
          {required && (
            <span className="ml-1 text-destructive">*</span>
          )}
        </Label>
      )}
      {children}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
