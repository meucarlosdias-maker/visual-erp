'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { collectionService } from '../services/collection-service';
import { toast } from '@/components/feedback';

interface CollectionFormProps {
  onSuccess?: () => void;
}

export function CollectionForm({ onSuccess }: CollectionFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      await collectionService.create({
        name: name.trim(),
        description: description.trim() || null,
        active: true,
      });
      toast.success('Coleção criada com sucesso');
      setName(''); setDescription('');
      onSuccess?.();
    } catch {
      toast.error('Erro ao criar coleção');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Nome da Coleção</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Comercial, Produção, Financeiro" required />
      </div>
      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição opcional" />
      </div>
      <Button type="submit" disabled={saving}>{saving ? 'Criando...' : 'Criar Coleção'}</Button>
    </form>
  );
}
