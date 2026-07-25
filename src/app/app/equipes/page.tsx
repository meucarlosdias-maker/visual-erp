'use client';

import { useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { useTeams } from '@/modules/teams/hooks/use-teams';
import { useMembers } from '@/modules/teams/hooks/use-members';
import { TeamTable } from '@/modules/teams/components/TeamTable';
import { TeamStatsCards } from '@/modules/teams/components/TeamStatsCards';
import { toast } from '@/components/feedback';
import { useConfirm, useDeleteConfirm } from '@/hooks/use-confirm';

export default function EquipesPage() {
  const { data: teams, loading, toggleActive, delete: remove } = useTeams();
  const { data: members } = useMembers();
  const { confirm: confirmToggle, ConfirmDialog: ConfirmToggleDialog } = useConfirm();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const handleToggleActive = useCallback(async (id: string) => {
    const team = teams.find((t) => t.id === id);
    const confirmed = await confirmToggle({
      title: team?.active ? 'Desativar equipe' : 'Ativar equipe',
      description: team?.active
        ? 'A equipe ficará indisponível para novos serviços.'
        : 'A equipe ficará disponível para novos serviços.',
    });
    if (!confirmed) return;
    const ok = await toggleActive(id);
    if (ok) toast.success(team?.active ? 'Equipe desativada' : 'Equipe ativada');
  }, [teams, confirmToggle, toggleActive]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({
      title: 'Remover equipe',
      description: 'Esta ação não pode ser desfeita.',
    });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Equipe removida');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Equipes"
        description="Gerencie as equipes de mão de obra"
        summary={<TeamStatsCards teams={teams} totalMembers={members.length} />}
      >
        <TeamTable
          teams={teams}
          loading={loading}
          onToggleActive={handleToggleActive}
          onRemove={handleRemove}
        />
      </CrudPage>

      {ConfirmToggleDialog}
      {DeleteDialog}
    </>
  );
}
