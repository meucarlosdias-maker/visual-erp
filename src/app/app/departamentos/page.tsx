'use client';

import { useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Building2 } from '@/constants/icons';
import { EmptyState, LoadingLocal, toast } from '@/components/feedback';
import { useDepartments } from '@/modules/projects/hooks/use-departments';
import { useDeleteConfirm } from '@/hooks/use-confirm';

export default function DepartamentosPage() {
  const { data: departments, loading, create, update, delete: remove } = useDepartments();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formColor, setFormColor] = useState('#3b82f6');
  const [saving, setSaving] = useState(false);

  const openNew = useCallback(() => {
    setEditingId(null);
    setFormName('');
    setFormDescription('');
    setFormColor('#3b82f6');
    setDialogOpen(true);
  }, []);

  const openEdit = useCallback((dept: typeof departments[number]) => {
    setEditingId(dept.id);
    setFormName(dept.name);
    setFormDescription(dept.description ?? '');
    setFormColor(dept.color);
    setDialogOpen(true);
  }, []);

  const handleSave = useCallback(async () => {
    if (!formName.trim()) { toast.error('Nome é obrigatório'); return; }
    setSaving(true);
    const data = { name: formName.trim(), description: formDescription.trim(), color: formColor };
    const ok = editingId ? await update(editingId, data) : await create(data);
    setSaving(false);
    if (ok) {
      toast.success(editingId ? 'Departamento atualizado' : 'Departamento criado');
      setDialogOpen(false);
    }
  }, [formName, formDescription, formColor, editingId, create, update]);

  const handleRemove = useCallback(async (id: string, name: string) => {
    const confirmed = await confirmDelete({ title: 'Remover departamento', description: `Remover "${name}"?` });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Departamento removido');
  }, [confirmDelete, remove]);

  const COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1'];

  return (
    <>
      <CrudPage
        title="Departamentos"
        description="Gerencie os departamentos da empresa"
        actionNew={{ onClick: openNew }}
      >
        {loading ? (
          <LoadingLocal message="Carregando departamentos..." />
        ) : departments.length === 0 ? (
          <EmptyState icon={<Building2 className="h-12 w-12 text-muted-foreground" />} title="Nenhum departamento" description="Crie os departamentos da sua empresa." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {departments.map((dept) => (
              <Card key={dept.id}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: dept.color }} />
                    <CardTitle className="text-sm font-medium">{dept.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openEdit(dept)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => handleRemove(dept.id, dept.name)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">{dept.description || 'Sem descrição'}</p>
                  <p className="text-xs text-muted-foreground mt-1">Ordem: {dept.sortOrder}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CrudPage>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingId ? 'Editar Departamento' : 'Novo Departamento'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deptName">Nome</Label>
              <Input id="deptName" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Ex: Instalação" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deptDesc">Descrição</Label>
              <Textarea id="deptDesc" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Descrição do departamento" />
            </div>
            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={`h-8 w-8 rounded-full border-2 ${formColor === c ? 'border-foreground' : 'border-transparent'}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setFormColor(c)}
                  />
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={saving}>{saving ? 'Salvando...' : 'Salvar'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {DeleteDialog}
    </>
  );
}
