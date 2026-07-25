'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { apiKeyService } from '../services/api-key-service';
import { toast } from '@/components/feedback';

interface ApiKeyFormProps {
  onSuccess?: (key: { id: string; rawKey: string; rawSecret: string }) => void;
}

export function ApiKeyForm({ onSuccess }: ApiKeyFormProps) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ rawKey: string; rawSecret: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const created = await apiKeyService.create({ name, permissions: ['*'], active: true });
      const keyResult = { rawKey: created.rawKey, rawSecret: created.rawSecret };
      setResult(keyResult);
      toast.success('Chave de API criada com sucesso');
      onSuccess?.(created as unknown as { id: string; rawKey: string; rawSecret: string });
    } catch {
      toast.error('Erro ao criar chave de API');
    } finally {
      setSaving(false);
    }
  };

  if (result) {
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-yellow-50 space-y-2">
          <p className="text-sm font-medium text-yellow-800">Anote estas informações! O secret não será mostrado novamente.</p>
          <div>
            <Label>API Key</Label>
            <Input readOnly value={result.rawKey} className="bg-white" />
          </div>
          <div>
            <Label>API Secret</Label>
            <Input readOnly value={result.rawSecret} className="bg-white" />
          </div>
        </div>
        <Button variant="outline" onClick={() => setResult(null)}>Criar outra chave</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome da Chave</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Integração com Shopify" required />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? 'Criando...' : 'Criar Chave de API'}
      </Button>
    </form>
  );
}