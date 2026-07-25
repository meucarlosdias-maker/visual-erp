'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/feedback';
import type { Role, RoleForm } from '../types';

const ROLE_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#22c55e',
  '#14b8a6', '#06b6d4', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#ec4899', '#78716c',
];

interface RoleFormDialogProps {
  initial?: Role | null;
  onSave: (data: RoleForm, id?: string) => Promise<void>;
  onCancel?: () => void;
}

export function RoleFormDialog({ initial, onSave, onCancel }: RoleFormDialogProps) {
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [color, setColor] = useState(initial?.color ?? '#3b82f6');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { toast.error('Nome é obrigatório'); return; }
    setSaving(true);
    try {
      await onSave({ name: name.trim(), description, color, isSystem: false, active: true }, initial?.id);
      toast.success(initial ? 'Papel atualizado' : 'Papel criado');
    } catch { toast.error('Erro ao salvar papel'); }
    finally { setSaving(false); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initial ? 'Editar Papel' : 'Novo Papel'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Supervisor" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição do papel" />
          </div>
          <div className="space-y-2">
            <Label>Cor</Label>
            <div className="flex flex-wrap gap-2">
              {ROLE_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-black scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
            <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
