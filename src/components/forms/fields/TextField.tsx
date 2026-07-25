'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '../FormField';

interface TextFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}

export function TextField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder,
  type = 'text',
  disabled,
}: TextFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...field}
      />
    </FormField>
  );
}
