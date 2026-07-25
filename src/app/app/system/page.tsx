'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { DevOpsDashboardCards } from '@/modules/devops/components';
import { useDevOpsDashboard } from '@/modules/devops/hooks';

export default function SystemDashboardPage() {
  const { data, loading } = useDevOpsDashboard();

  return (
    <CrudPage title="Sistema" description="Monitoramento e operações da plataforma">
      {loading ? (
        <LoadingLocal message="Carregando dados do sistema..." />
      ) : !data ? (
        <p className="text-center py-12 text-muted-foreground">Erro ao carregar dados.</p>
      ) : (
        <DevOpsDashboardCards data={data} />
      )}
    </CrudPage>
  );
}
