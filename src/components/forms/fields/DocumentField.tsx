'use client';

import { useController, type Control, type FieldValues, type Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FormField } from '../FormField';
import { formatCPF, formatCNPJ, identifyDocument } from '@/utils/helpers';

interface DocumentFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export function DocumentField<T extends FieldValues>({
  control,
  name,
  label,
  required,
  disabled,
}: DocumentFieldProps<T>) {
  const {
    field,
    fieldState: { error },
  } = useController({ control, name });

  const type = identifyDocument(field.value ?? '');

  return (
    <FormField name={name} label={label} required={required} error={error?.message}>
      <Input
        id={name}
        type="text"
        inputMode="numeric"
        placeholder={type === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'}
        disabled={disabled}
        {...field}
        value={
          field.value
            ? type === 'cpf'
              ? formatCPF(field.value)
              : formatCNPJ(field.value)
            : ''
        }
        onChange={(e) => {
          const raw = e.target.value.replace(/\D/g, '');
          const docType = identifyDocument(raw);
          const formatted =
            docType === 'cpf' ? formatCPF(raw) : formatCNPJ(raw);
          field.onChange(formatted);
        }}
      />
    </FormField>
  );
}
