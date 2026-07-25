'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { TeamProductivity } from '../types';

interface ProductivityFormProps {
  productivity?: TeamProductivity | null;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
}

export function ProductivityForm({ productivity, onSave, onCancel }: ProductivityFormProps) {
  const [serviceType, setServiceType] = useState(productivity?.serviceType ?? '');
  const [unit, setUnit] = useState(productivity?.unit ?? '');
  const [productionPerHour, setProductionPerHour] = useState(productivity?.productionPerHour ?? 0);
  const [installationPerHour, setInstallationPerHour] = useState(productivity?.installationPerHour ?? 0);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    await onSave({ serviceType, unit, productionPerHour, installationPerHour });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Nova Produtividade</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="prod-serviceType">Tipo de Serviço</Label>
          <Input id="prod-serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)} placeholder="Ex: Impressão Digital" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prod-unit">Unidade</Label>
          <Input id="prod-unit" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="Ex: M2" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="prod-production">Produção por hora</Label>
          <Input id="prod-production" type="number" min={0} value={productionPerHour} onChange={(e) => setProductionPerHour(Number(e.target.value))} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="prod-installation">Instalação por hora</Label>
          <Input id="prod-installation" type="number" min={0} value={installationPerHour} onChange={(e) => setInstallationPerHour(Number(e.target.value))} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleSubmit} disabled={saving || !serviceType}>
          {saving ? 'Salvando...' : 'Adicionar'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancelar</Button>
      </div>
    </div>
  );
}
