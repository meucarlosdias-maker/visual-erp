'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { ProviderTable, ProviderForm } from '@/modules/ai/components';
import { useProviders } from '@/modules/ai/hooks';

export default function AiProvidersPage() {
  const { data, loading, delete: remove, update, refetch } = useProviders();

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Provedor removido');
    else toast.error('Erro ao remover provedor');
  }, [remove]);

  const handleToggleActive = useCallback(async (id: string, active: boolean) => {
    const ok = await update(id, { active });
    if (ok) toast.success(active ? 'Provedor ativado' : 'Provedor desativado');
    else toast.error('Erro ao alterar status');
  }, [update]);

  return (
    <CrudPage
      title="Provedores de IA"
      description="Configure provedores de inteligência artificial"
      toolbar={<ProviderForm onSuccess={refetch} />}
    >
      {loading ? (
        <LoadingLocal message="Carregando provedores..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum provedor configurado.</p>
      ) : (
        <ProviderTable data={data} onDelete={handleDelete} onToggleActive={handleToggleActive} />
      )}
    </CrudPage>
  );
}
