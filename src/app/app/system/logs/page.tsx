'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { SystemLogTable } from '@/modules/devops/components';
import { useSystemLogs } from '@/modules/devops/hooks';

export default function LogsPage() {
  const { data, loading } = useSystemLogs();

  return (
    <CrudPage title="Logs do Sistema" description="Registro centralizado de eventos do sistema">
      {loading ? (
        <LoadingLocal message="Carregando logs..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum log encontrado.</p>
      ) : (
        <SystemLogTable logs={data} />
      )}
    </CrudPage>
  );
}
