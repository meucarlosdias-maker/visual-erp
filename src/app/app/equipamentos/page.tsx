'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { useEquipments } from '@/modules/equipments/hooks/use-equipments';
import { useEquipmentCategories } from '@/modules/equipments/hooks/use-equipment-categories';
import { EquipmentTable } from '@/modules/equipments/components/EquipmentTable';
import { EquipmentStatsCards } from '@/modules/equipments/components/EquipmentStatsCards';
import { toast } from '@/components/feedback';
import { useConfirm, useDeleteConfirm } from '@/hooks/use-confirm';

export default function EquipamentosPage() {
  const { data: equipments, loading, toggleActive, delete: remove } = useEquipments();
  const { data: categories } = useEquipmentCategories();
  const { confirm: confirmToggle, ConfirmDialog: ConfirmToggleDialog } = useConfirm();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const handleToggleActive = useCallback(async (id: string) => {
    const eq = equipments.find((e) => e.id === id);
    const confirmed = await confirmToggle({
      title: eq?.active ? 'Desativar equipamento' : 'Ativar equipamento',
      description: eq?.active
        ? 'O equipamento ficará indisponível para novos serviços.'
        : 'O equipamento ficará disponível para novos serviços.',
    });
    if (!confirmed) return;
    const ok = await toggleActive(id);
    if (ok) toast.success(eq?.active ? 'Equipamento desativado' : 'Equipamento ativado');
  }, [equipments, confirmToggle, toggleActive]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({
      title: 'Remover equipamento',
      description: 'Esta ação não pode ser desfeita.',
    });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Equipamento removido');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Equipamentos"
        description="Gerencie os equipamentos da empresa"
        summary={<EquipmentStatsCards equipments={equipments} categoriesCount={categories.length} />}
      >
        <EquipmentTable
          equipments={equipments}
          categories={categories}
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
