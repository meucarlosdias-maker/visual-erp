'use client';
import { StatCard } from './StatCard';
import { LineChartCard } from './LineChartCard';
import { FunnelChartCard } from './FunnelChartCard';
import { Users, TrendingUp, MapPin, FileText, CheckCircle2, DollarSign } from '@/constants/icons';
import type { CommercialMetrics, ChartDataPoint } from '../types';

interface CommercialSectionProps {
  metrics: CommercialMetrics;
  quotationsData: ChartDataPoint[];
  funnelData: ChartDataPoint[];
  loading?: boolean;
}

export function CommercialSection({ metrics, quotationsData, funnelData, loading }: CommercialSectionProps) {
  const formatCurrency = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        Comercial
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Leads do Mês" value={metrics.leadsMonth} delta={metrics.leadsMonthDelta} icon={<Users className="h-5 w-5" />} loading={loading} />
        <StatCard title="Taxa de Conversão" value={`${metrics.conversionRate}%`} delta={metrics.conversionRateDelta} icon={<TrendingUp className="h-5 w-5" />} loading={loading} />
        <StatCard title="Visitas Agendadas" value={metrics.scheduledVisits} delta={metrics.scheduledVisitsDelta} icon={<MapPin className="h-5 w-5" />} loading={loading} />
        <StatCard title="Orçamentos Emitidos" value={metrics.quotationsEmitted} delta={metrics.quotationsEmittedDelta} icon={<FileText className="h-5 w-5" />} loading={loading} />
        <StatCard title="Orçamentos Aprovados" value={metrics.quotationsApproved} delta={metrics.quotationsApprovedDelta} icon={<CheckCircle2 className="h-5 w-5" />} loading={loading} />
        <StatCard title="Ticket Médio" value={formatCurrency(metrics.averageTicket)} delta={metrics.averageTicketDelta} icon={<DollarSign className="h-5 w-5" />} loading={loading} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <LineChartCard title="Orçamentos por Mês" data={quotationsData} loading={loading} dataKey="value" secondaryKey="secondary" />
        <FunnelChartCard title="Funil Comercial" data={funnelData} loading={loading} />
      </div>
    </div>
  );
}
