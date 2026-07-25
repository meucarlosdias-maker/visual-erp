'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '../FormField';

interface NumberFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
}

export function NumberField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder,
  min,
  max,
  step,
  disabled,
}: NumberFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Input
        id={name}
        type="number"
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        {...field}
        onChange={(e) => {
          const value = e.target.value;
          field.onChange(value === '' ? '' : Number(value));
        }}
      />
    </FormField>
  );
}
