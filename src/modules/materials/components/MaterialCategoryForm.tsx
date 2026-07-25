'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import { ALLOWED_MATERIAL_ICONS } from '../validators';
import type { MaterialCategory } from '../types';

interface MaterialCategoryFormProps {
  category?: MaterialCategory | null;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
}

export function MaterialCategoryForm({ category, onSave, onCancel }: MaterialCategoryFormProps) {
  const [name, setName] = useState(category?.name ?? '');
  const [icon, setIcon] = useState(category?.icon ?? '');
  const [color, setColor] = useState(category?.color ?? '#6b7280');
  const [sortOrder, setSortOrder] = useState(category?.sortOrder ?? 0);
  const [active, setActive] = useState(category?.active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const ok = await onSave({ name, icon, color, sortOrder, active });
    setSaving(false);
  };

  const dirty =
    name !== (category?.name ?? '') ||
    icon !== (category?.icon ?? '') ||
    color !== (category?.color ?? '#6b7280') ||
    sortOrder !== (category?.sortOrder ?? 0) ||
    active !== (category?.active ?? true);

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Ícone</Label>
        <Select value={icon} onValueChange={(v) => v !== null && setIcon(v)}>
          <SelectTrigger id="icon" className="w-full">
            <SelectValue placeholder="Selecione um ícone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Nenhum</SelectItem>
            {ALLOWED_MATERIAL_ICONS.map((ic) => (
              <SelectItem key={ic} value={ic}>{ic}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="color">Cor</Label>
          <div className="flex items-center gap-2">
            <input id="color" type="color" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-9 rounded-md border border-input bg-background p-0.5 cursor-pointer" />
            <Input value={color} onChange={(e) => setColor(e.target.value)} className="font-mono" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="sortOrder">Ordem</Label>
          <Input id="sortOrder" type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Switch id="active" checked={active} onCheckedChange={setActive} />
        <Label htmlFor="active">Categoria ativa</Label>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <SaveButton onClick={handleSubmit} loading={saving} disabled={!dirty} />
        <CancelButton onClick={onCancel} disabled={saving} />
      </div>
    </div>
  );
}
