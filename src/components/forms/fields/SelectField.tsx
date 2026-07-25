'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormField } from '../FormField';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
}

export function SelectField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  placeholder = 'Selecione...',
  options,
  disabled,
}: SelectFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Select
        onValueChange={(v) => field.onChange(v ?? '')}
        value={field.value}
        disabled={disabled}
      >
        <SelectTrigger id={name}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormField>
  );
}
