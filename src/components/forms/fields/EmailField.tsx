'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '../FormField';

interface EmailFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function EmailField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder = 'email@exemplo.com',
  disabled,
}: EmailFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Input
        id={name}
        type="email"
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="email"
        {...field}
      />
    </FormField>
  );
}
