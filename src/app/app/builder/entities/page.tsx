'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Search, Plus } from '@/constants/icons';
import { useBuilderEntities, EntityCard, createEntity, updateEntity, deleteEntity } from '@/modules/builder';
import type { CustomEntityRecord } from '@/core/builder';

export default function BuilderEntitiesPage() {
  const router = useRouter();
  const { data, loading, refetch } = useBuilderEntities();
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<CustomEntityRecord | null>(null);

  const filtered = data.filter((e) => {
    if (!search) return true;
    const term = search.toLowerCase();
    return e.name.toLowerCase().includes(term) || e.slug.includes(term);
  });

  const handleCreate = async (form: HTMLFormElement) => {
    const fd = new FormData(form);
    await createEntity('company-1', fd.get('name') as string, fd.get('slug') as string, fd.get('description') as string);
    await refetch();
    form.reset();
  };

  const handleEdit = async (form: HTMLFormElement) => {
    if (!editing) return;
    const fd = new FormData(form);
    await updateEntity(editing.id, { name: fd.get('name') as string, description: fd.get('description') as string });
    setEditing(null);
    await refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta entidade? Essa ação não pode ser desfeita.')) return;
    await deleteEntity(id);
    await refetch();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold">Entidades</h1>
          <p className="text-sm text-muted-foreground">Entidades personalizadas do sistema</p>
        </div>
        <Dialog>
          <DialogTrigger render={<Button />}>
            <Plus className="h-4 w-4 mr-1" /> Nova Entidade
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova Entidade</DialogTitle></DialogHeader>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleCreate(e.currentTarget); }}>
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" placeholder="Ex: Visitas Técnicas" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input id="slug" name="slug" placeholder="Ex: visitas-tecnicas" required pattern="[a-z0-9-]+" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Input id="description" name="description" placeholder="Descrição da entidade" />
              </div>
              <Button type="submit" className="w-full">Criar Entidade</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Pesquisar entidades..." className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">Carregando...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Nenhuma entidade encontrada.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((entity) => (
            <EntityCard
              key={entity.id}
              entity={entity}
              fieldCount={0}
              recordCount={0}
              onEdit={setEditing}
              onDelete={handleDelete}
              onManageFields={(id) => router.push(`/app/builder/entities/${id}`)}
            />
          ))}
        </div>
      )}

      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar Entidade</DialogTitle></DialogHeader>
          {editing && (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleEdit(e.currentTarget); }}>
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome</Label>
                <Input id="edit-name" name="name" defaultValue={editing.name} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Input id="edit-description" name="description" defaultValue={editing.description ?? ''} />
              </div>
              <Button type="submit" className="w-full">Salvar</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
