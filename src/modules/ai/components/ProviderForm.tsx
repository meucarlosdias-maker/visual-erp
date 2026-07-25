'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { providerService } from '../services/provider-service';
import { toast } from '@/components/feedback';

interface ProviderFormProps {
  onSuccess?: () => void;
}

export function ProviderForm({ onSuccess }: ProviderFormProps) {
  const [name, setName] = useState('');
  const [provider, setProvider] = useState('');
  const [model, setModel] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !provider || !model.trim() || !apiKey.trim()) return;
    setSaving(true);
    try {
      await providerService.create({
        name: name.trim(),
        provider: provider as 'openai' | 'anthropic' | 'gemini' | 'azure' | 'openrouter',
        model: model.trim(),
        apiKey: apiKey.trim(),
        temperature: 0.7,
        maxTokens: 2048,
        active: true,
      });
      toast.success('Provedor criado com sucesso');
      setName(''); setProvider(''); setModel(''); setApiKey('');
      onSuccess?.();
    } catch {
      toast.error('Erro ao criar provedor');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nome</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: OpenAI Produção" required />
      </div>
      <div className="space-y-2">
        <Label>Provedor</Label>
        <Select value={provider} onValueChange={(v) => setProvider(v ?? '')}>
          <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
          <SelectContent>
            <SelectItem value="openai">OpenAI</SelectItem>
            <SelectItem value="anthropic">Anthropic</SelectItem>
            <SelectItem value="gemini">Google Gemini</SelectItem>
            <SelectItem value="azure">Azure OpenAI</SelectItem>
            <SelectItem value="openrouter">OpenRouter</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Modelo</Label>
        <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="Ex: gpt-4o" required />
      </div>
      <div className="space-y-2">
        <Label>API Key</Label>
        <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk-..." required />
      </div>
      <Button type="submit" disabled={saving}>{saving ? 'Criando...' : 'Criar Provedor'}</Button>
    </form>
  );
}
