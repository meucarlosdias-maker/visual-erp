'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { PolicyTable } from '@/modules/security/components';
import { usePolicies } from '@/modules/security/hooks';

export default function PoliciesPage() {
  const { data, loading, update, delete: remove, refetch } = usePolicies();

  const handleToggle = useCallback(async (id: string, active: boolean) => {
    const ok = await update(id, { active });
    if (ok) toast.success(active ? 'Política ativada' : 'Política desativada');
    else toast.error('Erro ao alterar status');
  }, [update]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Política removida');
    else toast.error('Erro ao remover política');
  }, [remove]);

  return (
    <CrudPage title="Políticas de Segurança" description="Gerencie as políticas de segurança do sistema">
      {loading ? (
        <LoadingLocal message="Carregando políticas..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma política de segurança encontrada.</p>
      ) : (
        <PolicyTable policies={data} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </CrudPage>
  );
}
