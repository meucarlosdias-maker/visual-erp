'use client';

import { useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { useSubcategories } from '@/modules/catalog/hooks/use-subcategories';
import { useCategories } from '@/modules/catalog/hooks/use-categories';
import { ServiceSubcategoryTable } from '@/modules/catalog/components/ServiceSubcategoryTable';
import { ServiceSubcategoryStatsCards } from '@/modules/catalog/components/ServiceSubcategoryStatsCards';
import { toast } from '@/components/feedback';
import { useConfirm, useDeleteConfirm } from '@/hooks/use-confirm';

export default function SubcategoriasPage() {
  const { data: subcategories, loading, toggleActive, remove } = useSubcategories();
  const { categories } = useCategories();
  const { confirm: confirmToggle, ConfirmDialog: ConfirmToggleDialog } = useConfirm();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const handleToggleActive = useCallback(async (id: string) => {
    const sub = subcategories.find((s) => s.id === id);
    const confirmed = await confirmToggle({
      title: sub?.active ? 'Desativar subcategoria' : 'Ativar subcategoria',
      description: sub?.active
        ? 'A subcategoria ficará indisponível para novos serviços.'
        : 'A subcategoria ficará disponível para novos serviços.',
    });
    if (!confirmed) return;
    const ok = await toggleActive(id);
    if (ok) toast.success(sub?.active ? 'Subcategoria desativada' : 'Subcategoria ativada');
  }, [subcategories, confirmToggle, toggleActive]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({
      title: 'Remover subcategoria',
      description: 'Esta ação não pode ser desfeita.',
    });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Subcategoria removida');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Subcategorias de Serviço"
        description="Gerencie as subcategorias do catálogo de serviços"
        summary={<ServiceSubcategoryStatsCards subcategories={subcategories} />}
      >
        <ServiceSubcategoryTable
          subcategories={subcategories}
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
