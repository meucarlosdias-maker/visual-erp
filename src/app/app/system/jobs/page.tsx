'use client';

import { useCallback } from 'react';
import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, toast } from '@/components/feedback';
import { MonitoringCards, JobTable } from '@/modules/jobs/components';
import { useJobs } from '@/modules/jobs/hooks';
import { Button } from '@/components/ui/button';
import { Play } from '@/constants/icons';

export default function JobsPage() {
  const { data, loading, delete: remove, refetch } = useJobs();

  const handleDelete = useCallback(async (id: string) => {
    const ok = await remove(id);
    if (ok) toast.success('Job removido');
    else toast.error('Erro ao remover job');
  }, [remove]);

  const handleView = useCallback((id: string) => {
    window.location.href = `/app/system/jobs?id=${id}`;
  }, []);

  return (
    <CrudPage
      title="Jobs"
      description="Gerencie tarefas assíncronas do sistema"
      toolbar={
        <Button size="sm" onClick={() => refetch()}>
          <Play className="mr-2 h-4 w-4" />
          Atualizar
        </Button>
      }
    >
      {loading ? (
        <LoadingLocal message="Carregando jobs..." />
      ) : (
        <>
          <MonitoringCards jobs={data} />
          {data.length === 0 ? (
            <p className="text-center py-12 text-muted-foreground">Nenhum job encontrado.</p>
          ) : (
            <JobTable jobs={data} onView={handleView} />
          )}
        </>
      )}
    </CrudPage>
  );
}
