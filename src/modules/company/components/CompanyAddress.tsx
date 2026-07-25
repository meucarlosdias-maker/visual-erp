'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyAddressProps {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  pais: string;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function CompanyAddress({
  cep, logradouro, numero, complemento, bairro, cidade, estado, pais,
  onChange, disabled,
}: CompanyAddressProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-6">
      <div className="sm:col-span-2">
        <Label htmlFor="cep">CEP</Label>
        <Input id="cep" value={cep} onChange={(e) => onChange('cep', e.target.value)} disabled={disabled} placeholder="00000-000" />
      </div>
      <div className="sm:col-span-4">
        <Label htmlFor="logradouro">Logradouro</Label>
        <Input id="logradouro" value={logradouro} onChange={(e) => onChange('logradouro', e.target.value)} disabled={disabled} />
      </div>
      <div className="sm:col-span-1">
        <Label htmlFor="numero">Número</Label>
        <Input id="numero" value={numero} onChange={(e) => onChange('numero', e.target.value)} disabled={disabled} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="complemento">Complemento</Label>
        <Input id="complemento" value={complemento} onChange={(e) => onChange('complemento', e.target.value)} disabled={disabled} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="bairro">Bairro</Label>
        <Input id="bairro" value={bairro} onChange={(e) => onChange('bairro', e.target.value)} disabled={disabled} />
      </div>
      <div className="sm:col-span-1">
        <Label htmlFor="cidade">Cidade</Label>
        <Input id="cidade" value={cidade} onChange={(e) => onChange('cidade', e.target.value)} disabled={disabled} />
      </div>
      <div className="sm:col-span-1">
        <Label htmlFor="estado">UF</Label>
        <Input id="estado" value={estado} maxLength={2} onChange={(e) => onChange('estado', e.target.value.toUpperCase())} disabled={disabled} />
      </div>
      <div className="sm:col-span-1">
        <Label htmlFor="pais">País</Label>
        <Input id="pais" value={pais} onChange={(e) => onChange('pais', e.target.value)} disabled={disabled} />
      </div>
    </div>
  );
}
