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

export function CompanyDataForm({ settings, onSave }: Props) {
  const [form, setForm] = useState({
    corporateName: settings.corporateName,
    tradeName: settings.tradeName,
    document: settings.document,
    stateRegistration: settings.stateRegistration,
    municipalRegistration: settings.municipalRegistration,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    website: settings.website,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(form);
    if (ok) toast.success('Dados salvos');
    else toast.error('Erro ao salvar');
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <Card className="p-0 border-none shadow-none">
        <CardContent className="grid gap-4 sm:grid-cols-2 p-0">
          <div className="space-y-1.5"><Label>Razão Social</Label><Input value={form.corporateName} onChange={(e) => setForm((p) => ({ ...p, corporateName: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Nome Fantasia</Label><Input value={form.tradeName} onChange={(e) => setForm((p) => ({ ...p, tradeName: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>CNPJ</Label><Input value={form.document} onChange={(e) => setForm((p) => ({ ...p, document: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Inscrição Estadual</Label><Input value={form.stateRegistration} onChange={(e) => setForm((p) => ({ ...p, stateRegistration: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Inscrição Municipal</Label><Input value={form.municipalRegistration} onChange={(e) => setForm((p) => ({ ...p, municipalRegistration: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Telefone</Label><Input value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>WhatsApp</Label><Input value={form.whatsapp} onChange={(e) => setForm((p) => ({ ...p, whatsapp: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>E-mail</Label><Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Website</Label><Input type="url" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} /></div>
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1" /> {saving ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </div>
  );
}
