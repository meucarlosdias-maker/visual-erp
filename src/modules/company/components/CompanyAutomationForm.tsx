'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Save } from '@/constants/icons';
import { toast } from '@/components/feedback';
import type { CompanyPreferences } from '../types/company-settings';

interface Props {
  preferences: CompanyPreferences;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
}

export function CompanyAutomationForm({ preferences, onSave }: Props) {
  const [form, setForm] = useState({
    allowNegativeStock: preferences.allowNegativeStock,
    automaticProjectCreation: preferences.automaticProjectCreation,
    automaticWorkOrderCreation: preferences.automaticWorkOrderCreation,
    automaticProductionRelease: preferences.automaticProductionRelease,
    automaticFinancialGeneration: preferences.automaticFinancialGeneration,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(form);
    if (ok) toast.success('Automações salvas');
    else toast.error('Erro ao salvar');
    setSaving(false);
  };

  const items = [
    { key: 'automaticProjectCreation' as const, label: 'Criar Projeto automaticamente' },
    { key: 'automaticWorkOrderCreation' as const, label: 'Criar OS automaticamente' },
    { key: 'automaticProductionRelease' as const, label: 'Liberar Produção automaticamente' },
    { key: 'automaticFinancialGeneration' as const, label: 'Gerar Financeiro automaticamente' },
    { key: 'allowNegativeStock' as const, label: 'Permitir Estoque Negativo' },
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader><CardTitle className="text-base">Automações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {items.map(({ key, label }) => (
            <div key={key} className="flex items-center justify-between">
              <Label className="cursor-pointer">{label}</Label>
              <Switch checked={form[key]} onCheckedChange={(v) => setForm((p) => ({ ...p, [key]: v }))} />
            </div>
          ))}
        </CardContent>
      </Card>
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}><Save className="h-4 w-4 mr-1" /> {saving ? 'Salvando...' : 'Salvar'}</Button>
      </div>
    </div>
  );
}
