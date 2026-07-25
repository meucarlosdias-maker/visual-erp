'use client';

import { useState, useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { useServices } from '@/modules/catalog/hooks/use-services';
import { CatalogServiceTable } from '@/modules/catalog/components/CatalogServiceTable';
import { CatalogServiceStatsCards } from '@/modules/catalog/components/CatalogServiceStatsCards';
import { toast } from '@/components/feedback';
import { useConfirm, useDeleteConfirm } from '@/hooks/use-confirm';

export default function ServicosPage() {
  const { data: services, loading, toggleActive, remove } = useServices();
  const { confirm: confirmToggle, ConfirmDialog: ConfirmToggleDialog } = useConfirm();
  const { confirmDelete, DeleteDialog } = useDeleteConfirm();

  const handleToggleActive = useCallback(async (id: string) => {
    const svc = services.find((s) => s.id === id);
    const confirmed = await confirmToggle({
      title: svc?.active ? 'Desativar serviço' : 'Ativar serviço',
      description: svc?.active
        ? 'O serviço ficará indisponível para novos orçamentos.'
        : 'O serviço ficará disponível para novos orçamentos.',
    });
    if (!confirmed) return;
    const ok = await toggleActive(id);
    if (ok) toast.success(svc?.active ? 'Serviço desativado' : 'Serviço ativado');
  }, [services, confirmToggle, toggleActive]);

  const handleRemove = useCallback(async (id: string) => {
    const confirmed = await confirmDelete({
      title: 'Remover serviço',
      description: 'Esta ação não pode ser desfeita.',
    });
    if (!confirmed) return;
    const ok = await remove(id);
    if (ok) toast.success('Serviço removido');
  }, [confirmDelete, remove]);

  return (
    <>
      <CrudPage
        title="Serviços do Catálogo"
        description="Gerencie os serviços do catálogo"
        summary={<CatalogServiceStatsCards services={services} />}
      >
        <CatalogServiceTable
          services={services}
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
