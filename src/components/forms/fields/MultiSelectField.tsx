'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { FormField } from '../FormField';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from '@/constants/icons';

interface SelectOption {
  value: string;
  label: string;
}

interface MultiSelectFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  options: SelectOption[];
  disabled?: boolean;
}

export function MultiSelectField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  options,
  disabled,
}: MultiSelectFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const selected: string[] = field.value ?? [];

  const handleToggle = (value: string) => {
    const next = selected.includes(value)
      ? selected.filter((v) => v !== value)
      : [...selected, value];
    field.onChange(next);
  };

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt.value);
          return (
            <Badge
              key={opt.value}
              variant={isSelected ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => !disabled && handleToggle(opt.value)}
            >
              {opt.label}
              {isSelected && (
                <X className="ml-1 h-3 w-3" />
              )}
            </Badge>
          );
        })}
      </div>
    </FormField>
  );
}
