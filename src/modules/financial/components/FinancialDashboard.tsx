'use client';

import type { LucideIcon } from '@/constants/icons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, BarChart3, Loader2 } from '@/constants/icons';
import { useFinancialOverview } from '../hooks/use-financial-overview';
import type { Overview } from '../hooks/use-financial-overview';

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function FinancialCard({ title, value, icon: Icon, color, subtitle }: { title: string; value: string; icon: LucideIcon; color: string; subtitle?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2"><CardTitle className="text-sm font-medium flex items-center gap-2"><Icon className="h-4 w-4 text-muted-foreground" /> {title}</CardTitle></CardHeader>
      <CardContent>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}

export function FinancialDashboard() {
  const { data, loading } = useFinancialOverview();

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const cards = buildCards(data);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => (
        <FinancialCard key={card.title} {...card} />
      ))}
    </div>
  );
}

function buildCards(data: Overview) {
  return [
    {
      title: 'Saldo Atual',
      value: formatCurrency(data.balance),
      icon: DollarSign,
      color: '',
    },
    {
      title: 'A Receber',
      value: formatCurrency(data.receivablesPending),
      icon: TrendingUp,
      color: 'text-green-600',
      subtitle: data.receivablesOverdue > 0 ? `${formatCurrency(data.receivablesOverdue)} vencidos` : undefined,
    },
    {
      title: 'A Pagar',
      value: formatCurrency(data.payablesPending),
      icon: TrendingDown,
      color: 'text-red-600',
      subtitle: data.payablesOverdue > 0 ? `${formatCurrency(data.payablesOverdue)} vencidos` : undefined,
    },
    {
      title: 'Fluxo do Mês',
      value: formatCurrency(data.cashFlowMonth),
      icon: BarChart3,
      color: data.cashFlowMonth >= 0 ? 'text-green-600' : 'text-red-600',
    },
    {
      title: 'Inadimplência',
      value: formatCurrency(data.defaultedAmount),
      icon: TrendingDown,
      color: 'text-red-600',
      subtitle: data.defaultedAmount > 0 ? 'Clientes em atraso' : undefined,
    },
    {
      title: 'Resultado do Mês',
      value: formatCurrency(data.monthlyResult),
      icon: DollarSign,
      color: data.monthlyResult >= 0 ? 'text-green-600' : 'text-red-600',
    },
  ];
}
