'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { DeploymentTable } from '@/modules/devops/components';
import { useDeployments } from '@/modules/devops/hooks';

export default function DeploymentsPage() {
  const { data, loading } = useDeployments();

  return (
    <CrudPage title="Deployments" description="Histórico de deploys da plataforma">
      {loading ? (
        <LoadingLocal message="Carregando deployments..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum deployment encontrado.</p>
      ) : (
        <DeploymentTable deployments={data} />
      )}
    </CrudPage>
  );
}
