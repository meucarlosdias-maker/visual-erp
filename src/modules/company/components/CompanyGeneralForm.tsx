'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save } from '@/constants/icons';
import { toast } from '@/components/feedback';
import { WORKING_DAYS_LABELS } from '../validators/company-settings-validators';
import type { CompanySettings } from '../types/company-settings';

interface CompanyGeneralFormProps {
  settings: CompanySettings;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
}

export function CompanyGeneralForm({ settings, onSave }: CompanyGeneralFormProps) {
  const [form, setForm] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  const toggleDay = (day: number) => {
    setForm((prev) => {
      const days = prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day].sort();
      return { ...prev, workingDays: days };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const ok = await onSave(form);
    if (ok) toast.success('Configurações salvas');
    else toast.error('Erro ao salvar');
    setSaving(false);
  };

  const field = (label: string, key: keyof CompanySettings, type = 'text') => (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={(form[key] as string) ?? ''} onChange={(e) => setForm((prev) => ({ ...prev, [key]: e.target.value }))} />
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle className="text-base">Dados da Empresa</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {field('Razão Social', 'corporateName')}
          {field('Nome Fantasia', 'tradeName')}
          {field('CNPJ', 'document')}
          {field('Inscrição Estadual', 'stateRegistration')}
          {field('Inscrição Municipal', 'municipalRegistration')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Contato</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {field('Telefone', 'phone')}
          {field('WhatsApp', 'whatsapp')}
          {field('E-mail', 'email', 'email')}
          {field('Site', 'website', 'url')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Endereço</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {field('Logradouro', 'address')}
          {field('Número', 'number')}
          {field('Bairro', 'district')}
          {field('Cidade', 'city')}
          {field('Estado', 'state')}
          {field('CEP', 'zipCode')}
          {field('País', 'country')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Branding</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          {field('Cor Primária', 'primaryColor')}
          {field('Cor Secundária', 'secondaryColor')}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Horário Comercial</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {field('Início', 'workingHoursStart', 'time')}
            {field('Fim', 'workingHoursEnd', 'time')}
          </div>
          <div className="space-y-2">
            <Label>Dias de Trabalho</Label>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                <button
                  key={day}
                  type="button"
                  className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                    form.workingDays.includes(day)
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => toggleDay(day)}
                >
                  {WORKING_DAYS_LABELS[day]?.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Regionalização</CardTitle></CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          {field('Timezone', 'timezone')}
          {field('Moeda', 'currency')}
          {field('Idioma', 'language')}
          {field('Casas Decimais', 'decimalPlaces', 'number')}
          {field('Unidade de Medida', 'measurementUnit')}
          {field('Margem Padrão (%)', 'defaultMargin', 'number')}
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
