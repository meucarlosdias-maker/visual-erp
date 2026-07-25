'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '../FormField';
import { formatPhone } from '@/utils/helpers';

interface PhoneFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function PhoneField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
}: PhoneFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Input
        id={name}
        type="tel"
        placeholder="(11) 99999-9999"
        disabled={disabled}
        {...field}
        value={field.value ? formatPhone(field.value) : ''}
        onChange={(e) => {
          const masked = formatPhone(e.target.value);
          field.onChange(masked);
        }}
      />
    </FormField>
  );
}
