'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { AccessLogTable } from '@/modules/security/components';
import { useAccessLogs } from '@/modules/security/hooks';

export default function LogsPage() {
  const { data, loading } = useAccessLogs();

  return (
    <CrudPage title="Logs de Acesso" description="Registro de acesso a recursos do sistema">
      {loading ? (
        <LoadingLocal message="Carregando logs..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum log de acesso encontrado.</p>
      ) : (
        <AccessLogTable logs={data} />
      )}
    </CrudPage>
  );
}
