'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanyBankingProps {
  banco: string;
  agencia: string;
  conta: string;
  pix: string;
  favorecido: string;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function CompanyBanking({
  banco, agencia, conta, pix, favorecido, onChange, disabled,
}: CompanyBankingProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="banco">Banco</Label>
        <Input id="banco" value={banco} onChange={(e) => onChange('banco', e.target.value)} disabled={disabled} placeholder="001" />
      </div>
      <div>
        <Label htmlFor="agencia">Agência</Label>
        <Input id="agencia" value={agencia} onChange={(e) => onChange('agencia', e.target.value)} disabled={disabled} placeholder="1234-5" />
      </div>
      <div>
        <Label htmlFor="conta">Conta</Label>
        <Input id="conta" value={conta} onChange={(e) => onChange('conta', e.target.value)} disabled={disabled} placeholder="67890-1" />
      </div>
      <div>
        <Label htmlFor="pix">Chave Pix</Label>
        <Input id="pix" value={pix} onChange={(e) => onChange('pix', e.target.value)} disabled={disabled} />
      </div>
      <div className="sm:col-span-2">
        <Label htmlFor="favorecido">Favorecido</Label>
        <Input id="favorecido" value={favorecido} onChange={(e) => onChange('favorecido', e.target.value)} disabled={disabled} />
      </div>
    </div>
  );
}
