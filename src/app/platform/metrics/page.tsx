'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { MetricCards } from '@/modules/platform/components';
import { useMetrics } from '@/modules/platform/hooks';

export default function PlatformMetricsPage() {
  const { data, loading } = useMetrics();

  return (
    <CrudPage title="Métricas" description="Indicadores de saúde e utilização da plataforma">
      {loading ? (
        <LoadingLocal message="Carregando métricas..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhuma métrica disponível.</p>
      ) : (
        <MetricCards metrics={data} />
      )}
    </CrudPage>
  );
}
