'use client';

import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from '@/constants/icons';
import { cepService } from '../services/cep-service';

interface CepFieldProps {
  cep: string;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function CepField({ cep, onChange, disabled }: CepFieldProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCepBlur = useCallback(async () => {
    const digits = cep.replace(/\D/g, '');
    if (digits.length !== 8) return;

    setLoading(true);
    setError(null);

    const result = await cepService.fetchCep(cep);
    if (result) {
      onChange('logradouro', result.logradouro);
      onChange('bairro', result.bairro);
      onChange('cidade', result.cidade);
      onChange('estado', result.estado);
      onChange('cep', result.cep);
    } else {
      setError('CEP não encontrado');
    }

    setLoading(false);
  }, [cep, onChange]);

  return (
    <div className="relative">
      <Label htmlFor="cep">CEP</Label>
      <div className="relative">
        <Input
          id="cep"
          value={cep}
          onChange={(e) => onChange('cep', e.target.value)}
          onBlur={handleCepBlur}
          disabled={disabled || loading}
          placeholder="00000-000"
          maxLength={9}
          className={error ? 'border-destructive pr-8' : 'pr-8'}
        />
        {loading && (
          <Loader2 className="absolute right-2 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
        )}
      </div>
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}
