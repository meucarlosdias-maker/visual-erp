'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { RetentionTable } from '@/modules/security/components';
import { useRetentionPolicies } from '@/modules/security/hooks';

export default function RetentionPage() {
  const { data, loading, update, delete: remove, refetch } = useRetentionPolicies();

  const handleToggle = useCallback(async (id: string, active: boolean) => {
    const ok = await update(id, { active });
    if (ok) toast.success(active ? 'Política ativada' : 'Política desativada');
    else toast.error('Erro ao alterar status');
  }, [update]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Política de retenção removida');
    else toast.error('Erro ao remover política');
  }, [remove]);

  return (
    <CrudPage title="Políticas de Retenção" description="Gerencie a retenção de dados do sistema">
      {loading ? (
        <LoadingLocal message="Carregando políticas de retenção..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma política de retenção encontrada.</p>
      ) : (
        <RetentionTable policies={data} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </CrudPage>
  );
}
