'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { ExecutionTable } from '@/modules/workflows/components';
import { useExecutions } from '@/modules/workflows/hooks';

export default function HistoricoPage() {
  const { data, loading } = useExecutions();

  return (
    <CrudPage
      title="Histórico"
      description="Registro completo de todas as execuções de workflows"
    >
      {loading ? (
        <LoadingLocal message="Carregando histórico..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum registro no histórico.</p>
      ) : (
        <ExecutionTable data={data} />
      )}
    </CrudPage>
  );
}
