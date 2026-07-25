'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';
import { FormField } from '../FormField';

interface SwitchFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function SwitchField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
}: SwitchFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Switch
        checked={field.value ?? false}
        onCheckedChange={field.onChange}
        disabled={disabled}
      />
    </FormField>
  );
}
