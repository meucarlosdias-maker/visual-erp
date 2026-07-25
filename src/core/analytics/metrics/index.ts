import type { MetricDefinition, MetricCategory } from '../types';

const metricsRegistry = new Map<string, MetricDefinition>();

export function registerMetric(metric: MetricDefinition): void {
  metricsRegistry.set(metric.id, metric);
}

export function getMetric(id: string): MetricDefinition | undefined {
  return metricsRegistry.get(id);
}

export function getMetricsByCategory(category: MetricCategory): MetricDefinition[] {
  return Array.from(metricsRegistry.values()).filter((m) => m.category === category);
}

export function getAllMetrics(): MetricDefinition[] {
  return Array.from(metricsRegistry.values());
}

export function calculateChange(current: number, previous: number): { change: number; changePercentage: number } {
  const change = current - previous;
  const changePercentage = previous !== 0 ? (change / previous) * 100 : 0;
  return { change, changePercentage };
}

export function calculateAchievement(current: number, target: number): number {
  if (target === 0) return 0;
  return Math.round((current / target) * 100);
}

// Register default metrics
registerMetric({
  id: 'revenue-month',
  name: 'Receita Mensal',
  description: 'Receita total no mês atual',
  category: 'financial',
  formula: 'SUM(quotations.total) WHERE status = APPROVED',
  unit: 'BRL',
  higherIsBetter: true,
});

registerMetric({
  id: 'projects-active',
  name: 'Projetos Ativos',
  description: 'Total de projetos em andamento',
  category: 'projects',
  formula: 'COUNT(projects) WHERE status IN (IN_PRODUCTION, INSTALLING)',
  unit: 'un',
  higherIsBetter: true,
});

registerMetric({
  id: 'leads-month',
  name: 'Leads no Mês',
  description: 'Total de leads cadastrados no mês',
  category: 'crm',
  formula: 'COUNT(crm_leads) WHERE createdAt = THIS_MONTH',
  unit: 'un',
  higherIsBetter: true,
});

registerMetric({
  id: 'lead-conversion',
  name: 'Taxa de Conversão',
  description: 'Percentual de leads convertidos em clientes',
  category: 'crm',
  formula: '(leads_converted / leads_total) * 100',
  unit: '%',
  higherIsBetter: true,
});

registerMetric({
  id: 'production-efficiency',
  name: 'Eficiência Produtiva',
  description: 'Percentual de ordens concluídas no prazo',
  category: 'production',
  formula: '(orders_on_time / orders_total) * 100',
  unit: '%',
  higherIsBetter: true,
});

registerMetric({
  id: 'installations-month',
  name: 'Instalações no Mês',
  description: 'Total de instalações realizadas no mês',
  category: 'installation',
  formula: 'COUNT(installations) WHERE status = FINISHED AND finishedAt = THIS_MONTH',
  unit: 'un',
  higherIsBetter: true,
});

registerMetric({
  id: 'revenue-receivable',
  name: 'Contas a Receber',
  description: 'Total em contas a receber abertas',
  category: 'financial',
  formula: 'SUM(financial_receber.value) WHERE status = PENDING',
  unit: 'BRL',
  higherIsBetter: false,
});

registerMetric({
  id: 'team-productivity',
  name: 'Produtividade da Equipe',
  description: 'Média de produtividade das equipes no mês',
  category: 'team',
  formula: 'AVG(team_productivity.productionPerHour)',
  unit: 'un/h',
  higherIsBetter: true,
});

registerMetric({
  id: 'clients-active',
  name: 'Clientes Ativos',
  description: 'Total de clientes ativos',
  category: 'clients',
  formula: 'COUNT(clients) WHERE deletedAt IS NULL',
  unit: 'un',
  higherIsBetter: true,
});

registerMetric({
  id: 'quotations-pending',
  name: 'Orçamentos Pendentes',
  description: 'Total de orçamentos aguardando resposta',
  category: 'commercial',
  formula: 'COUNT(quotations) WHERE status = SENT',
  unit: 'un',
  higherIsBetter: false,
});

export { metricsRegistry };
