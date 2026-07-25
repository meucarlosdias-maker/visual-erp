'use client';

import { useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { useCategories } from '@/modules/catalog/hooks/use-categories';
import { ServiceCategoryTable } from '@/modules/catalog/components/ServiceCategoryTable';
import { ServiceCategoryStatsCards } from '@/modules/catalog/components/ServiceCategoryStatsCards';
import { toast } from '@/components/feedback';
import { useConfirm, useDeleteConfirm } from '@/hooks/use-confirm';

export default function CategoriasPage() {
  const { categories, loading, toggleActive, remove } = useCategories();
  const { confirm: confirmToggle, ConfirmDialog: ConfirmToggleDialog } = useConfirm();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const handleToggleActive = useCallback(async (id: string) => {
    const cat = categories.find((c) => c.id === id);
    const confirmed = await confirmToggle({
      title: cat?.active ? 'Desativar categoria' : 'Ativar categoria',
      description: cat?.active
        ? 'A categoria ficará indisponível para novos serviços.'
        : 'A categoria ficará disponível para novos serviços.',
    });
    if (!confirmed) return;
    const ok = await toggleActive(id);
    if (ok) toast.success(cat?.active ? 'Categoria desativada' : 'Categoria ativada');
  }, [categories, confirmToggle, toggleActive]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({
      title: 'Remover categoria',
      description: 'Esta ação não pode ser desfeita. Categorias com serviços vinculados não podem ser removidas.',
    });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Categoria removida');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Categorias de Serviço"
        description="Gerencie as categorias do catálogo de serviços"
        summary={<ServiceCategoryStatsCards categories={categories} />}
      >
        <ServiceCategoryTable
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
