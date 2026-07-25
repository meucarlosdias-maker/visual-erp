'use client';

import { useState, useMemo, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { SearchInput } from '@/components/shared';
import { FilterSelect } from '@/components/shared/filters';
import { useUsers } from '@/modules/users/hooks/use-users';
import { UserTable } from '@/modules/users/components/UserTable';
import { UserStatsCards } from '@/modules/users/components/UserStatsCards';
import { UserInviteDialog } from '@/modules/users/components/UserInviteDialog';
import { toast } from '@/components/feedback';
import { useConfirm, useDeleteConfirm } from '@/hooks/use-confirm';

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'active', label: 'Ativo' },
  { value: 'inactive', label: 'Inativo' },
  { value: 'pending', label: 'Pendente' },
  { value: 'blocked', label: 'Bloqueado' },
];

export default function UsuariosPage() {
  const { data: users, loading, invite, toggleActive, delete: remove } = useUsers();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const { confirm: confirmToggle, ConfirmDialog: ConfirmToggleDialog } = useConfirm();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const filtered = useMemo(() => {
    let result = users;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.firstName.toLowerCase().includes(q) ||
          u.lastName.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.position.toLowerCase().includes(q),
      );
    }
    if (statusFilter) {
      result = result.filter((u) => u.status === statusFilter);
    }
    return result;
  }, [users, search, statusFilter]);

  const handleToggleActive = useCallback(async (id: string, current: string) => {
    const confirmed = await confirmToggle({
      title: current === 'active' ? 'Desativar usuário' : current === 'blocked' ? 'Desbloquear' : 'Ativar',
      description: current === 'active'
        ? 'O usuário perderá acesso ao sistema.'
        : 'O usuário poderá acessar o sistema novamente.',
    });
    if (!confirmed) return;
    const ok = await toggleActive(id, current);
    if (ok) toast.success(current === 'active' ? 'Usuário desativado' : 'Usuário ativado');
  }, [confirmToggle, toggleActive]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({
      title: 'Remover usuário',
      description: 'Esta ação não pode ser desfeita.',
    });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Usuário removido');
  }, [confirmDelete, remove]);

  const handleInvite = useCallback(async (data: { firstName: string; lastName: string; email: string; telefone?: string; position?: string; role: string }) => {
    const ok = await invite(data as Parameters<typeof invite>[0]);
    if (ok) toast.success('Convite enviado com sucesso');
    return ok;
  }, [invite]);

  const filters = (
    <div className="flex flex-wrap gap-2">
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nome, email ou cargo..."
        className="w-72"
      />
      <FilterSelect
        value={statusFilter}
        onChange={setStatusFilter}
        options={statusOptions}
        placeholder="Status"
      />
    </div>
  );

  return (
    <>
      <CrudPage
        title="Usuários"
        description="Gerencie os usuários da sua empresa"
        filters={filters}
        summary={<UserStatsCards users={users} />}
        actionNew={{
          label: 'Convidar',
          onClick: () => setInviteOpen(true),
        }}
      >
        <UserTable
          users={filtered}
          loading={loading}
          onToggleActive={handleToggleActive}
          onRemove={handleRemove}
        />
      </CrudPage>

      <UserInviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
      />

      {ConfirmToggleDialog}
      {DeleteDialog}
    </>
  );
}
