'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { ComplianceCards } from '@/modules/security/components';
import { useCompliance } from '@/modules/security/hooks';

export default function CompliancePage() {
  const { data, loading } = useCompliance();

  return (
    <CrudPage title="Compliance" description="Status de conformidade com frameworks regulatórios">
      {loading ? (
        <LoadingLocal message="Carregando status de compliance..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum framework de compliance disponível.</p>
      ) : (
        <ComplianceCards checks={data} />
      )}
    </CrudPage>
  );
}
