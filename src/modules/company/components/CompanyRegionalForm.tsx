'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Save } from '@/constants/icons';
import { toast } from '@/components/feedback';
import { CURRENCY_OPTIONS, LANGUAGE_OPTIONS } from '../validators/company-settings-validators';
import type { CompanySettings } from '../types/company-settings';

interface Props {
  settings: CompanySettings;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
}

export function CompanyRegionalForm({ settings, onSave }: Props) {
  const [form, setForm] = useState({
    language: settings.language,
    currency: settings.currency,
    decimalPlaces: settings.decimalPlaces,
    measurementUnit: settings.measurementUnit,
    defaultMargin: settings.defaultMargin,
    timezone: settings.timezone,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(form);
    if (ok) toast.success('Preferências salvas');
    else toast.error('Erro ao salvar');
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Regionalização</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Idioma</Label>
            <Select value={form.language} onValueChange={(v) => setForm((p) => ({ ...p, language: v ?? 'pt-BR' }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{LANGUAGE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Moeda</Label>
            <Select value={form.currency} onValueChange={(v) => setForm((p) => ({ ...p, currency: v ?? 'BRL' }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{CURRENCY_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5"><Label>Casas Decimais</Label><Input type="number" min="0" max="6" value={form.decimalPlaces} onChange={(e) => setForm((p) => ({ ...p, decimalPlaces: Number(e.target.value) }))} /></div>
          <div className="space-y-1.5"><Label>Unidade de Medida</Label><Input value={form.measurementUnit} onChange={(e) => setForm((p) => ({ ...p, measurementUnit: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Margem Padrão (%)</Label><Input type="number" min="0" max="100" value={form.defaultMargin} onChange={(e) => setForm((p) => ({ ...p, defaultMargin: Number(e.target.value) }))} /></div>
          <div className="space-y-1.5"><Label>Timezone</Label>
            <Select value={form.timezone} onValueChange={(v) => setForm((p) => ({ ...p, timezone: v ?? 'America/Sao_Paulo' }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Sao_Paulo">Brasília (UTC-3)</SelectItem>
                <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
                <SelectItem value="America/Fortaleza">Fortaleza (UTC-3)</SelectItem>
                <SelectItem value="America/Noronha">Fernando de Noronha (UTC-2)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1" /> {saving ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </div>
  );
}
