'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { DevOpsDashboardCards, HealthCheckCards } from '@/modules/devops/components';
import { useDevOpsDashboard, useHealthChecks } from '@/modules/devops/hooks';

export default function MonitoringPage() {
  const { data: dashData, loading: dashLoading } = useDevOpsDashboard();
  const { data: healthData, loading: healthLoading } = useHealthChecks();

  if (dashLoading || healthLoading) return <LoadingLocal message="Carregando monitoramento..." />;

  return (
    <CrudPage title="Monitoramento" description="Métricas e saúde do sistema">
      {dashData && <DevOpsDashboardCards data={dashData} />}
      <h2 className="text-lg font-semibold mt-6 mb-3">Serviços</h2>
      <HealthCheckCards checks={healthData} />
    </CrudPage>
  );
}
