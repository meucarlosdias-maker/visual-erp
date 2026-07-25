'use client';

import { useDashboard } from '@/modules/platform/hooks';
import { PlatformDashboardCards, ActiveAnnouncements } from '@/modules/platform/components';
import { LoadingLocal } from '@/components/feedback';

export default function PlatformPage() {
  const { data, loading } = useDashboard();

  if (loading) return <LoadingLocal message="Carregando painel da plataforma..." />;
  if (!data) return <p className="text-center py-12 text-muted-foreground">Erro ao carregar dados da plataforma.</p>;

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Admin</h1>
        <p className="text-sm text-muted-foreground">Painel de administração global do Visual ERP</p>
      </div>
      {data.recentAnnouncements.length > 0 && (
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-2">Avisos Ativos</h2>
          <ActiveAnnouncements announcements={data.recentAnnouncements} />
        </div>
      )}
      <PlatformDashboardCards data={data} />
    </div>
  );
}
