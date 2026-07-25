'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from '@/constants/icons';
import { toast } from '@/components/feedback';
import type { CompanySettings } from '../types/company-settings';

interface Props {
  settings: CompanySettings;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
}

export function CompanyAddressForm({ settings, onSave }: Props) {
  const [form, setForm] = useState({
    zipCode: settings.zipCode,
    address: settings.address,
    number: settings.number,
    district: settings.district,
    city: settings.city,
    state: settings.state,
    country: settings.country,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(form);
    if (ok) toast.success('Endereço salvo');
    else toast.error('Erro ao salvar');
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <Card className="p-0 border-none shadow-none">
        <CardContent className="grid gap-4 sm:grid-cols-3 p-0">
          <div className="space-y-1.5"><Label>CEP</Label><Input value={form.zipCode} onChange={(e) => setForm((p) => ({ ...p, zipCode: e.target.value }))} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>Endereço</Label><Input value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Número</Label><Input value={form.number} onChange={(e) => setForm((p) => ({ ...p, number: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Bairro</Label><Input value={form.district} onChange={(e) => setForm((p) => ({ ...p, district: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Cidade</Label><Input value={form.city} onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Estado</Label><Input value={form.state} onChange={(e) => setForm((p) => ({ ...p, state: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>País</Label><Input value={form.country} onChange={(e) => setForm((p) => ({ ...p, country: e.target.value }))} /></div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1" /> {saving ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </div>
  );
}
