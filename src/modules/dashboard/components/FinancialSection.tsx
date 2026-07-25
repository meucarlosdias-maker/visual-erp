'use client';
import { StatCard } from './StatCard';
import { BarChartCard } from './BarChartCard';
import { AreaChartCard } from './AreaChartCard';
import { DollarSign, TrendingDown, TrendingUp, BarChart3, Calculator, FileText } from '@/constants/icons';
import type { FinancialMetrics, ChartDataPoint } from '../types';

interface FinancialSectionProps {
  metrics: FinancialMetrics;
  revenueData: ChartDataPoint[];
  financialFlowData: ChartDataPoint[];
  loading?: boolean;
}

export function FinancialSection({ metrics, revenueData, financialFlowData, loading }: FinancialSectionProps) {
  const formatCurrency = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">
        <DollarSign className="h-5 w-5" />
        Financeiro
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Receita do Mês" value={formatCurrency(metrics.monthlyRevenue)} delta={metrics.monthlyRevenueDelta} icon={<TrendingUp className="h-5 w-5" />} loading={loading} />
        <StatCard title="Despesas do Mês" value={formatCurrency(metrics.monthlyExpenses)} delta={metrics.monthlyExpensesDelta} icon={<TrendingDown className="h-5 w-5" />} loading={loading} />
        <StatCard title="Fluxo de Caixa" value={formatCurrency(metrics.cashFlow)} delta={metrics.cashFlowDelta} icon={<BarChart3 className="h-5 w-5" />} loading={loading} />
        <StatCard title="Lucro" value={formatCurrency(metrics.profit)} delta={metrics.profitDelta} icon={<DollarSign className="h-5 w-5" />} loading={loading} />
        <StatCard title="Contas a Receber" value={formatCurrency(metrics.accountsReceivable)} delta={metrics.accountsReceivableDelta} icon={<Calculator className="h-5 w-5" />} loading={loading} />
        <StatCard title="Contas a Pagar" value={formatCurrency(metrics.accountsPayable)} delta={metrics.accountsPayableDelta} icon={<FileText className="h-5 w-5" />} loading={loading} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <BarChartCard title="Receita por Mês" data={revenueData} loading={loading} dataKey="value" secondaryKey="secondary" />
        <AreaChartCard title="Fluxo Financeiro" data={financialFlowData} loading={loading} dataKey="value" secondaryKey="secondary" />
      </div>
    </div>
  );
}
