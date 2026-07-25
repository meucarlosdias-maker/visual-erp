'use client';

import { useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { useMaterialCategories } from '@/modules/materials/hooks/use-material-categories';
import { MaterialCategoryTable } from '@/modules/materials/components/MaterialCategoryTable';
import { MaterialCategoryStatsCards } from '@/modules/materials/components/MaterialCategoryStatsCards';
import { toast } from '@/components/feedback';
import { useConfirm, useDeleteConfirm } from '@/hooks/use-confirm';

export default function CategoriasMateriaisPage() {
  const { data: categories, loading, toggleActive, delete: remove } = useMaterialCategories();
  const { confirm: confirmToggle, ConfirmDialog: ConfirmToggleDialog } = useConfirm();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const handleToggleActive = useCallback(async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    const confirmed = await confirmToggle({
      title: cat?.active ? 'Desativar categoria' : 'Ativar categoria',
      description: cat?.active
        ? 'A categoria ficará indisponível para novos materiais.'
        : 'A categoria ficará disponível para novos materiais.',
    });
    if (!confirmed) return;
    const ok = await toggleActive(id);
    if (ok) toast.success(cat?.active ? 'Categoria desativada' : 'Categoria ativada');
  }, [categories, confirmToggle, toggleActive]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({
      title: 'Remover categoria',
      description: 'Esta ação não pode ser desfeita.',
    });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Categoria removida');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Categorias de Material"
        description="Gerencie as categorias de materiais"
        summary={<MaterialCategoryStatsCards categories={categories} />}
      >
        <MaterialCategoryTable
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
