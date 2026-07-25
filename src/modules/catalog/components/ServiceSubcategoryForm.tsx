'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { SaveButton, CancelButton } from '@/components/shared/actions';
import type { ServiceSubcategory, ServiceCategory } from '../types';

interface ServiceSubcategoryFormProps {
  subcategory?: ServiceSubcategory | null;
  categories: ServiceCategory[];
  onSave: (data: Partial<ServiceSubcategory>) => Promise<boolean>;
  onCancel: () => void;
}

export function ServiceSubcategoryForm({ subcategory, categories, onSave, onCancel }: ServiceSubcategoryFormProps) {
  const [categoryId, setCategoryId] = useState(subcategory?.categoryId ?? '');
  const [name, setName] = useState(subcategory?.name ?? '');
  const [description, setDescription] = useState(subcategory?.description ?? '');
  const [image, setImage] = useState(subcategory?.image ?? '');
  const [sortOrder, setSortOrder] = useState(subcategory?.sortOrder ?? 0);
  const [active, setActive] = useState(subcategory?.active ?? true);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    setSaving(true);
    const ok = await onSave({ categoryId, name, description, image, sortOrder, active } as Partial<ServiceSubcategory>);
    setSaving(false);
  };

  const dirty =
    categoryId !== (subcategory?.categoryId ?? '') ||
    name !== (subcategory?.name ?? '') ||
    description !== (subcategory?.description ?? '') ||
    image !== (subcategory?.image ?? '') ||
    sortOrder !== (subcategory?.sortOrder ?? 0) ||
    active !== (subcategory?.active ?? true);

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-2">
        <Label htmlFor="categoryId">Categoria</Label>
        <Select value={categoryId} onValueChange={(v) => v !== null && setCategoryId(v)}>
          <SelectTrigger id="categoryId" className="w-full">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image">Imagem (URL)</Label>
        <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sortOrder">Ordem</Label>
        <Input id="sortOrder" type="number" min={0} value={sortOrder} onChange={(e) => setSortOrder(Number(e.target.value))} />
      </div>

      <div className="flex items-center gap-2">
        <Switch id="active" checked={active} onCheckedChange={setActive} />
        <Label htmlFor="active">Subcategoria ativa</Label>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <SaveButton onClick={handleSubmit} loading={saving} disabled={!dirty} />
        <CancelButton onClick={onCancel} disabled={saving} />
      </div>
    </div>
  );
}
