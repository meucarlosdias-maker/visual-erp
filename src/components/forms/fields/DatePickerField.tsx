'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '../FormField';

interface DatePickerFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function DatePickerField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
}: DatePickerFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Input
        id={name}
        type="date"
        disabled={disabled}
        {...field}
        value={field.value ?? ''}
      />
    </FormField>
  );
}
