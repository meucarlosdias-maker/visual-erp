'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { workflowService } from '../services/workflow-service';
import { triggerService } from '../services/trigger-service';
import { actionService } from '../services/action-service';
import { toast } from '@/components/feedback';
import type { WorkflowInput } from '../schemas';

interface WorkflowFormProps {
  onSuccess?: () => void;
}

export function WorkflowForm({ onSuccess }: WorkflowFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState('');
  const [saving, setSaving] = useState(false);

  const triggers = triggerService.list();
  const actions = actionService.list();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !trigger) return;
    setSaving(true);
    try {
      const input: WorkflowInput = {
        name: name.trim(),
        description: description.trim() || null,
        active: true,
        trigger: trigger as WorkflowInput['trigger'],
        steps: [],
      };
      await workflowService.create(input);
      toast.success('Workflow criado com sucesso');
      onSuccess?.();
    } catch {
      toast.error('Erro ao criar workflow');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Workflow</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Notificar lead novo" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição opcional do workflow" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="trigger">Gatilho</Label>
        <Select value={trigger} onValueChange={(v) => setTrigger(v ?? '')}>
          <SelectTrigger><SelectValue placeholder="Selecione o gatilho..." /></SelectTrigger>
          <SelectContent>
            {triggers.map((t) => (
              <SelectItem key={t.type} value={t.type}>{t.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Passos disponíveis</Label>
        <p className="text-sm text-muted-foreground">Adicione passos após criar o workflow.</p>
        <div className="flex flex-wrap gap-2">
          {actions.map((a) => (
            <span key={a.type} className="text-xs bg-muted px-2 py-1 rounded">{a.label}</span>
          ))}
        </div>
      </div>
      <Button type="submit" disabled={saving || !trigger}>
        {saving ? 'Criando...' : 'Criar Workflow'}
      </Button>
    </form>
  );
}
