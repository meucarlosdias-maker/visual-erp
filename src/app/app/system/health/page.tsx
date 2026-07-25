'use client';

import { CrudPage } from '@/components/shared/CrudPage';
import { LoadingLocal } from '@/components/feedback';
import { HealthCheckCards } from '@/modules/devops/components';
import { useHealthChecks } from '@/modules/devops/hooks';

export default function HealthPage() {
  const { data, loading, summary } = useHealthChecks();

  return (
    <CrudPage title="Health Checks" description="Status de saúde dos serviços da plataforma">
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg text-center"><p className="text-xs text-muted-foreground">Saudáveis</p><p className="text-xl font-bold text-green-500">{summary.healthy}</p></div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg text-center"><p className="text-xs text-muted-foreground">Degradados</p><p className="text-xl font-bold text-yellow-500">{summary.degraded}</p></div>
          <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg text-center"><p className="text-xs text-muted-foreground">Indisponíveis</p><p className="text-xl font-bold text-red-500">{summary.unhealthy}</p></div>
          <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-center"><p className="text-xs text-muted-foreground">Desconhecidos</p><p className="text-xl font-bold">{summary.unknown}</p></div>
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-center"><p className="text-xs text-muted-foreground">Méd. Resposta</p><p className="text-xl font-bold text-blue-500">{Math.round(summary.avgResponseTime)}ms</p></div>
        </div>
      )}
      {loading ? (
        <LoadingLocal message="Verificando saúde dos serviços..." />
      ) : data.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum health check disponível.</p>
      ) : (
        <HealthCheckCards checks={data} />
      )}
    </CrudPage>
  );
}
