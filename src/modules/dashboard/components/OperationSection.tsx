'use client';
import { StatCard } from './StatCard';
import { FolderKanban, FileText, HardHat, MapPin, Wrench } from '@/constants/icons';
import type { OperationMetrics } from '../types';

interface OperationSectionProps {
  metrics: OperationMetrics;
  loading?: boolean;
}

export function OperationSection({ metrics, loading }: OperationSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <Wrench className="h-5 w-5" />
        Operação
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Projetos Ativos" value={metrics.activeProjects} icon={<FolderKanban className="h-5 w-5" />} loading={loading} />
        <StatCard title="OS em Aberto" value={metrics.openWorkOrders} icon={<FileText className="h-5 w-5" />} loading={loading} />
        <StatCard title="Produções Hoje" value={metrics.todayProductions} icon={<HardHat className="h-5 w-5" />} loading={loading} />
        <StatCard title="Instalações Hoje" value={metrics.todayInstallations} icon={<MapPin className="h-5 w-5" />} loading={loading} />
      </div>
    </div>
  );
}
