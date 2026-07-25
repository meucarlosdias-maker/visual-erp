'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal, EmptyState } from '@/components/feedback';
import { ApiLogTable } from '@/modules/api/components';
import { useApiLogs } from '@/modules/api/hooks';
import { FileText } from '@/constants/icons';

export default function ApiLogsPage() {
  const { data, loading } = useApiLogs();

  return (
    <CrudPage
      title="Logs de API"
      description="Histórico de chamadas realizadas à API"
    >
      {loading ? (
        <LoadingLocal message="Carregando logs..." />
      ) : data.length === 0 ? (
        <EmptyState
          icon={<FileText className="h-12 w-12 text-muted-foreground" />}
          title="Nenhum log"
          description="Os logs aparecerão quando houver chamadas à API."
        />
      ) : (
        <ApiLogTable data={data} />
      )}
    </CrudPage>
  );
}