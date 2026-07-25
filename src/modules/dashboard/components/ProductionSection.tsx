'use client';
import { StatCard } from './StatCard';
import { BarChartCard } from './BarChartCard';
import { PieChartCard } from './PieChartCard';
import { FolderKanban, Clock, HardHat, Building2, AlertTriangle } from '@/constants/icons';
import type { ProductionMetrics, ChartDataPoint } from '../types';

interface ProductionSectionProps {
  metrics: ProductionMetrics;
  productionDeptData: ChartDataPoint[];
  projectsStatusData: ChartDataPoint[];
  loading?: boolean;
}

export function ProductionSection({ metrics, productionDeptData, projectsStatusData, loading }: ProductionSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <HardHat className="h-5 w-5" />
        Produção
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Projetos em Produção" value={metrics.activeProjects} delta={metrics.activeProjectsDelta} icon={<FolderKanban className="h-5 w-5" />} loading={loading} />
        <StatCard title="Ordens Atrasadas" value={metrics.delayedOrders} delta={metrics.delayedOrdersDelta} icon={<AlertTriangle className="h-5 w-5" />} loading={loading} />
        <StatCard title="Tempo Médio" value={`${metrics.averageProductionDays}d`} delta={metrics.averageProductionDaysDelta} icon={<Clock className="h-5 w-5" />} loading={loading} />
        <StatCard title="Inst. Pendentes" value={metrics.pendingInstallations} delta={metrics.pendingInstallationsDelta} icon={<Building2 className="h-5 w-5" />} loading={loading} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartCard title="Produção por Departamento" data={productionDeptData} loading={loading} />
        <PieChartCard title="Projetos por Status" data={projectsStatusData} loading={loading} />
      </div>
    </div>
  );
}
