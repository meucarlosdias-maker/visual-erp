'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { SchedulerTable } from '@/modules/jobs/components';
import { useSchedules } from '@/modules/jobs/hooks';

export default function SchedulerPage() {
  const { data, loading, update, delete: remove, refetch } = useSchedules();

  const handleToggle = useCallback(async (id: string, active: boolean) => {
    const ok = await update(id, { active });
    if (ok) toast.success(active ? 'Agendamento ativado' : 'Agendamento desativado');
    else toast.error('Erro ao alterar status');
  }, [update]);

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Agendamento removido');
    else toast.error('Erro ao remover agendamento');
  }, [remove]);

  return (
    <CrudPage title="Agendamentos" description="Gerencie tarefas agendadas do sistema">
      {loading ? (
        <LoadingLocal message="Carregando agendamentos..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum agendamento encontrado.</p>
      ) : (
        <SchedulerTable schedules={data} onToggle={handleToggle} onDelete={handleDelete} />
      )}
    </CrudPage>
  );
}
