'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { TEAM_ROLE_LABELS, teamRoleSchema } from '../schemas/member-schema';
import type { TeamMember } from '../types';

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSave: (data: Record<string, unknown>) => Promise<boolean>;
  onCancel: () => void;
}

const roleValues = teamRoleSchema.options;

export function TeamMemberForm({ member, onSave, onCancel }: TeamMemberFormProps) {
  const [name, setName] = useState(member?.name ?? '');
  const [role, setRole] = useState(member?.role ?? 'LEADER');
  const [hourCost, setHourCost] = useState(member?.hourCost ?? 0);
  const [active, setActive] = useState(member?.active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    await onSave({ name, role, hourCost, active });
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-medium">Novo Membro</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mem-name">Nome</Label>
          <Input id="mem-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="mem-role">Cargo</Label>
          <Select value={role} onValueChange={(v) => v !== null && setRole(v)}>
            <SelectTrigger id="mem-role" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roleValues.map((r) => (
                <SelectItem key={r} value={r}>{TEAM_ROLE_LABELS[r] ?? r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="mem-hourCost">Custo por hora (R$)</Label>
          <Input id="mem-hourCost" type="number" min={0} step={0.01} value={hourCost} onChange={(e) => setHourCost(Number(e.target.value))} />
        </div>
        <div className="flex items-center gap-2 pt-6">
          <Switch id="mem-active" checked={active} onCheckedChange={setActive} />
          <Label htmlFor="mem-active">Ativo</Label>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={handleSubmit} disabled={saving || !name}>
          {saving ? 'Salvando...' : 'Adicionar'}
        </Button>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>Cancelar</Button>
      </div>
    </div>
  );
}
