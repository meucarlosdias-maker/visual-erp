'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { AuditTable } from '@/modules/security/components';
import { useAuditEvents } from '@/modules/security/hooks';

export default function AuditPage() {
  const { data, loading } = useAuditEvents();

  return (
    <CrudPage title="Auditoria" description="Registro de todas as ações realizadas no sistema">
      {loading ? (
        <LoadingLocal message="Carregando eventos de auditoria..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum evento de auditoria encontrado.</p>
      ) : (
        <AuditTable events={data} />
      )}
    </CrudPage>
  );
}
