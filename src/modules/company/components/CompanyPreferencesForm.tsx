'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Save } from '@/constants/icons';
import { toast } from '@/components/feedback';
import type { CompanyPreferences } from '../types/company-settings';

interface CompanyPreferencesFormProps {
  preferences: CompanyPreferences;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
}

export function CompanyPreferencesForm({ preferences, onSave }: CompanyPreferencesFormProps) {
  const [form, setForm] = useState({ ...preferences });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(form);
    if (ok) toast.success('Preferências salvas');
    else toast.error('Erro ao salvar');
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Padrões</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Validade Padrão do Orçamento (dias)</Label>
            <Input type="number" min="1" value={form.defaultQuotationValidity} onChange={(e) => setForm((prev) => ({ ...prev, defaultQuotationValidity: Number(e.target.value) }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Prazo de Pagamento Padrão</Label>
            <Input value={form.defaultPaymentTerm} onChange={(e) => setForm((prev) => ({ ...prev, defaultPaymentTerm: e.target.value }))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Prefixos de Códigos</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5"><Label>Projetos</Label><Input value={form.defaultProjectPrefix} onChange={(e) => setForm((prev) => ({ ...prev, defaultProjectPrefix: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Orçamentos</Label><Input value={form.defaultQuotationPrefix} onChange={(e) => setForm((prev) => ({ ...prev, defaultQuotationPrefix: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Ordens de Serviço</Label><Input value={form.defaultWorkOrderPrefix} onChange={(e) => setForm((prev) => ({ ...prev, defaultWorkOrderPrefix: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Notas Fiscais</Label><Input value={form.defaultInvoicePrefix} onChange={(e) => setForm((prev) => ({ ...prev, defaultInvoicePrefix: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Clientes</Label><Input value={form.defaultClientCodePrefix} onChange={(e) => setForm((prev) => ({ ...prev, defaultClientCodePrefix: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Fornecedores</Label><Input value={form.defaultSupplierCodePrefix} onChange={(e) => setForm((prev) => ({ ...prev, defaultSupplierCodePrefix: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Produtos</Label><Input value={form.defaultProductCodePrefix} onChange={(e) => setForm((prev) => ({ ...prev, defaultProductCodePrefix: e.target.value }))} /></div>
          <div className="space-y-1.5"><Label>Serviços</Label><Input value={form.defaultServiceCodePrefix} onChange={(e) => setForm((prev) => ({ ...prev, defaultServiceCodePrefix: e.target.value }))} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Automações</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Permitir Estoque Negativo</Label>
            <Switch checked={form.allowNegativeStock} onCheckedChange={(v) => setForm((prev) => ({ ...prev, allowNegativeStock: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Criação Automática de Projetos</Label>
            <Switch checked={form.automaticProjectCreation} onCheckedChange={(v) => setForm((prev) => ({ ...prev, automaticProjectCreation: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Criação Automática de OS</Label>
            <Switch checked={form.automaticWorkOrderCreation} onCheckedChange={(v) => setForm((prev) => ({ ...prev, automaticWorkOrderCreation: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Liberação Automática de Produção</Label>
            <Switch checked={form.automaticProductionRelease} onCheckedChange={(v) => setForm((prev) => ({ ...prev, automaticProductionRelease: v }))} />
          </div>
          <div className="flex items-center justify-between">
            <Label className="cursor-pointer">Geração Automática Financeira</Label>
            <Switch checked={form.automaticFinancialGeneration} onCheckedChange={(v) => setForm((prev) => ({ ...prev, automaticFinancialGeneration: v }))} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-1" /> {saving ? 'Salvando...' : 'Salvar'}
        </Button>
      </div>
    </div>
  );
}
