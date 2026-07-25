'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { ExecutionTable } from '@/modules/plugins/components';
import { usePluginExecutions } from '@/modules/plugins/hooks';

export default function PluginHistoryPage() {
  const { executions, loading } = usePluginExecutions();

  return (
    <CrudPage
      title="Histórico de Execuções"
      description="Eventos disparados pelos plugins do sistema"
    >
      {loading ? (
        <p className="text-center py-12 text-muted-foreground">Carregando execuções...</p>
      ) : (
        <ExecutionTable data={executions} />
      )}
    </CrudPage>
  );
}
