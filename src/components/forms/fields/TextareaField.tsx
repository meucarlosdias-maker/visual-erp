'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '../FormField';

interface TextareaFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export function TextareaField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder,
  rows = 3,
  disabled,
}: TextareaFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Textarea
        id={name}
        placeholder={placeholder}
        rows={rows}
        disabled={disabled}
        {...field}
      />
    </FormField>
  );
}
