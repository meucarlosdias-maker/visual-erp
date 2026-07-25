'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { WorkflowTable, WorkflowForm } from '@/modules/workflows/components';
import { useWorkflows } from '@/modules/workflows/hooks';

export default function WorkflowsPage() {
  const { data, loading, delete: remove, update, refetch } = useWorkflows();

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Workflow removido');
    else toast.error('Erro ao remover workflow');
  }, [remove]);

  const handleToggleActive = useCallback(async (id: string, active: boolean) => {
    const ok = await update(id, { active });
    if (ok) toast.success(active ? 'Workflow ativado' : 'Workflow desativado');
    else toast.error('Erro ao alterar status');
  }, [update]);

  return (
    <CrudPage
      title="Workflows"
      description="Automatize processos internos com workflows"
      toolbar={<WorkflowForm onSuccess={refetch} />}
    >
      {loading ? (
        <LoadingLocal message="Carregando workflows..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum workflow cadastrado.</p>
      ) : (
        <WorkflowTable data={data} onDelete={handleDelete} onToggleActive={handleToggleActive} />
      )}
    </CrudPage>
  );
}
