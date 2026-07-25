'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { promptService } from '../services/prompt-service';
import { toast } from '@/components/feedback';

const modules = ['CRM', 'Financeiro', 'Produção', 'Comercial', 'Atendimento', 'Projetos'];

interface PromptFormProps {
  onSuccess?: () => void;
}

export function PromptForm({ onSuccess }: PromptFormProps) {
  const [name, setName] = useState('');
  const [module, setModule] = useState('');
  const [prompt, setPrompt] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !module || !prompt.trim()) return;
    setSaving(true);
    try {
      await promptService.create({
        name: name.trim(),
        module,
        prompt: prompt.trim(),
        systemPrompt: systemPrompt.trim() || null,
        active: true,
      });
      toast.success('Prompt criado com sucesso');
      setName(''); setModule(''); setPrompt(''); setSystemPrompt('');
      onSuccess?.();
    } catch {
      toast.error('Erro ao criar prompt');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nome do Prompt</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Análise de Lead" required />
      </div>
      <div className="space-y-2">
        <Label>Módulo</Label>
        <Select value={module} onValueChange={(v) => setModule(v ?? '')}>
          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent>
            {modules.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Prompt</Label>
        <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Instrução para a IA..." required rows={4} />
      </div>
      <div className="space-y-2">
        <Label>System Prompt (opcional)</Label>
        <Textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} placeholder="Personalidade e contexto da IA..." rows={3} />
      </div>
      <Button type="submit" disabled={saving}>{saving ? 'Criando...' : 'Criar Prompt'}</Button>
    </form>
  );
}
