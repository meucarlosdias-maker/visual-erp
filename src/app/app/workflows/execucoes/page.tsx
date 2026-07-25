'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { ExecutionTable } from '@/modules/workflows/components';
import { useExecutions } from '@/modules/workflows/hooks';

export default function ExecucoesPage() {
  const { data, loading } = useExecutions();

  return (
    <CrudPage
      title="Execuções"
      description="Histórico de execuções dos workflows"
    >
      {loading ? (
        <LoadingLocal message="Carregando execuções..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma execução encontrada.</p>
      ) : (
        <ExecutionTable data={data} />
      )}
    </CrudPage>
  );
}
