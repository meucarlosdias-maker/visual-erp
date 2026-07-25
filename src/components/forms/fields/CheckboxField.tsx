'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField } from '../FormField';

interface CheckboxFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CheckboxField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
}: CheckboxFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Checkbox
        checked={field.value ?? false}
        onCheckedChange={(checked) => field.onChange(checked)}
        disabled={disabled}
      />
    </FormField>
  );
}
