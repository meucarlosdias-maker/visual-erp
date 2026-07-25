'use client';

import { useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { useMaterials } from '@/modules/materials/hooks/use-materials';
import { useMaterialCategories } from '@/modules/materials/hooks/use-material-categories';
import { MaterialTable } from '@/modules/materials/components/MaterialTable';
import { MaterialStatsCards } from '@/modules/materials/components/MaterialStatsCards';
import { toast } from '@/components/feedback';
import { useConfirm, useDeleteConfirm } from '@/hooks/use-confirm';

export default function MateriaisPage() {
  const { data: materials, loading, toggleActive, delete: remove } = useMaterials();
  const { data: categories } = useMaterialCategories();
  const { confirm: confirmToggle, ConfirmDialog: ConfirmToggleDialog } = useConfirm();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const handleToggleActive = useCallback(async (id: string) => {
    const mat = materials.find((m) => m.id === id);
    const confirmed = await confirmToggle({
      title: mat?.active ? 'Desativar material' : 'Ativar material',
      description: mat?.active
        ? 'O material ficará indisponível para novos serviços.'
        : 'O material ficará disponível para novos serviços.',
    });
    if (!confirmed) return;
    const ok = await toggleActive(id);
    if (ok) toast.success(mat?.active ? 'Material desativado' : 'Material ativado');
  }, [materials, confirmToggle, toggleActive]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({
      title: 'Remover material',
      description: 'Esta ação não pode ser desfeita.',
    });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Material removido');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Materiais"
        description="Gerencie os materiais cadastrados"
        summary={<MaterialStatsCards materials={materials} categoriesCount={categories.length} />}
      >
        <MaterialTable
          materials={materials}
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
