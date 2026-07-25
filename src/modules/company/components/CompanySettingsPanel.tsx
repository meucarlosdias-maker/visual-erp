'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CompanySettingsPanelProps {
  moeda: string;
  idioma: string;
  timezone: string;
  formatoData: string;
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
}

export function CompanySettingsPanel({
  moeda, idioma, timezone, formatoData, onChange, disabled,
}: CompanySettingsPanelProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <Label htmlFor="moeda">Moeda</Label>
        <Input id="moeda" value={moeda} onChange={(e) => onChange('moeda', e.target.value)} disabled={disabled} placeholder="BRL" />
      </div>
      <div>
        <Label htmlFor="idioma">Idioma</Label>
        <Input id="idioma" value={idioma} onChange={(e) => onChange('idioma', e.target.value)} disabled={disabled} placeholder="pt-BR" />
      </div>
      <div>
        <Label htmlFor="timezone">Fuso Horário</Label>
        <Input id="timezone" value={timezone} onChange={(e) => onChange('timezone', e.target.value)} disabled={disabled} placeholder="America/Sao_Paulo" />
      </div>
      <div>
        <Label htmlFor="formatoData">Formato de Data</Label>
        <Input id="formatoData" value={formatoData} onChange={(e) => onChange('formatoData', e.target.value)} disabled={disabled} placeholder="DD/MM/YYYY" />
      </div>
    </div>
  );
}
