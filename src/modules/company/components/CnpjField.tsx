'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCNPJ, unformat } from '@/utils/helpers';
import { isValidCNPJ } from '../validators/company-validators';
import { useState } from 'react';

interface CnpjFieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  disabled?: boolean;
}

export function CnpjField({ value, onChange, error, disabled }: CnpjFieldProps) {
  const [touched, setTouched] = useState(false);

  const handleChange = (raw: string) => {
    const masked = formatCNPJ(raw);
    onChange(unformat(masked));
  };

  const displayValue = formatCNPJ(value);
  const showError = touched && error;

  return (
    <div>
      <Label htmlFor="cnpj">CNPJ</Label>
      <Input
        id="cnpj"
        value={displayValue}
        onChange={(e) => handleChange(e.target.value)}
        onBlur={() => setTouched(true)}
        disabled={disabled}
        placeholder="00.000.000/0000-00"
        maxLength={18}
        className={showError ? 'border-destructive' : ''}
      />
      {showError && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export function validateCnpj(value: string): string | null {
  const digits = value.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length !== 14) return 'CNPJ deve ter 14 dígitos';
  if (!isValidCNPJ(digits)) return 'CNPJ inválido';
  return null;
}
