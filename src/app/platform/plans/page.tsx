'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { PlanTable } from '@/modules/platform/components';
import { usePlans } from '@/modules/platform/hooks';

export default function PlatformPlansPage() {
  const { data, loading, delete: remove } = usePlans();

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Plano removido');
    else toast.error('Erro ao remover plano');
  }, [remove]);

  return (
    <CrudPage title="Planos" description="Gerencie os planos de assinatura">
      {loading ? (
        <LoadingLocal message="Carregando planos..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum plano cadastrado.</p>
      ) : (
        <PlanTable plans={data} onDelete={handleDelete} />
      )}
    </CrudPage>
  );
}
