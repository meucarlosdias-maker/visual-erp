'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '../FormField';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

interface MoneyFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function MoneyField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
}: MoneyFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <span className="text-muted-foreground">R$</span>
        </InputGroupAddon>
        <InputGroupInput
          id={name}
          type="text"
          inputMode="decimal"
          disabled={disabled}
          value={field.value ?? ''}
          onChange={(e) => {
            const raw = e.target.value.replace(/\D/g, '');
            const value = raw ? Number(raw) / 100 : 0;
            field.onChange(value);
          }}
        />
      </InputGroup>
    </FormField>
  );
}
