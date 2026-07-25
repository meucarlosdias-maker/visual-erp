'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/feedback';
import { useDeleteConfirm } from '@/hooks/use-confirm';
import { useRoles, useRoleForm } from '@/modules/system/hooks/use-roles';
import { RolesList } from '@/modules/system/components/RolesList';
import { RoleFormDialog } from '@/modules/system/components/RoleForm';
import { PermissionsMatrix } from '@/modules/system/components/PermissionsMatrix';
import type { Role, RoleForm } from '@/modules/system/types';
import { ShieldX } from '@/constants/icons';

type TabType = 'list' | 'form' | 'perms';

export default function RolesPage() {
  const { roles, loading, reload } = useRoles();
  const { save, remove } = useRoleForm();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [tab, setTab] = useState<TabType>('list');

  const handleSave = async (data: RoleForm, id?: string) => {
    await save(data, id);
    setShowForm(false);
    setEditingRole(null);
    setTab('list');
    reload();
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDelete({ description: 'Tem certeza que deseja excluir este papel?' });
    if (!confirmed) return;
    try {
      await remove(id);
      toast.success('Papel excluído');
      reload();
    } catch { toast.error('Erro ao excluir papel'); }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowForm(true);
    setTab('form');
  };

  const handleNew = () => {
    setEditingRole(null);
    setShowForm(true);
    setTab('form');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <ShieldX className="h-6 w-6" />
        <div>
          <h1 className="text-2xl font-bold">Papéis</h1>
          <p className="text-sm text-muted-foreground">Gerencie os papéis do sistema</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button variant={tab === 'list' ? 'default' : 'outline'} onClick={() => setTab('list')}>Lista</Button>
        <Button variant={tab === 'perms' ? 'default' : 'outline'} onClick={() => setTab('perms')}>Matriz de Permissões</Button>
      </div>

      {tab === 'list' && (
        <RolesList
          roles={roles}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onNew={handleNew}
        />
      )}

      {showForm && tab === 'form' && (
        <RoleFormDialog
          initial={editingRole}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditingRole(null); setTab('list'); }}
        />
      )}

      {tab === 'perms' && <PermissionsMatrix />}

      {DeleteDialog}
    </div>
  );
}
