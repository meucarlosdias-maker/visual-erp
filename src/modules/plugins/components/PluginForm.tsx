'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Plus } from '@/constants/icons';
import type { PluginCategory } from '@/core/plugins';
import type { PluginFormData } from '../types';
import { PluginService } from '../services';
import { categoryLabels } from './PluginCategoryBadge';

export function PluginForm({
  onSuccess,
  defaultValues,
}: {
  onSuccess: () => void;
  defaultValues?: Partial<PluginFormData>;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(defaultValues?.name ?? '');
  const [slug, setSlug] = useState(defaultValues?.slug ?? '');
  const [version, setVersion] = useState(defaultValues?.version ?? '1.0.0');
  const [author, setAuthor] = useState(defaultValues?.author ?? '');
  const [description, setDescription] = useState(defaultValues?.description ?? '');
  const [category, setCategory] = useState<string>(defaultValues?.category ?? 'other');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await PluginService.create('company-1', {
        name,
        slug,
        version,
        author,
        description,
        category: category as PluginCategory,
        enabled: true,
      });
      setOpen(false);
      onSuccess();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button>
          <Plus className="h-4 w-4 mr-1" />
          Novo Plugin
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{defaultValues ? 'Editar Plugin' : 'Novo Plugin'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Meu Plugin" required />
            </div>
            <div className="space-y-2">
              <Label>Slug</Label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="meu-plugin" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Versão</Label>
              <Input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" />
            </div>
            <div className="space-y-2">
              <Label>Categoria</Label>
              <Select value={category} onValueChange={(v) => setCategory(v ?? 'other')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Autor</Label>
            <Input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Visual ERP" />
          </div>
          <div className="space-y-2">
            <Label>Descrição</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Descrição do plugin..." />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
