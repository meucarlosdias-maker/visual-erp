import type { AnalyticsFilter, SavedReportData, ChartType, ReportColumn, ReportDefinition, ReportFilterDef } from '../types';

const reportRegistry = new Map<string, ReportDefinition>();

export function registerReport(report: ReportDefinition): void {
  reportRegistry.set(report.id, report);
}

export function getReport(id: string): ReportDefinition | undefined {
  return reportRegistry.get(id);
}

export function getAllReports(): ReportDefinition[] {
  return Array.from(reportRegistry.values());
}

export function getReportsByModule(module: string): ReportDefinition[] {
  return Array.from(reportRegistry.values()).filter((r) => r.module === module);
}

export function buildReportData<T>(data: T[], columns: string[]): Record<string, unknown>[] {
  return data.map((item) => {
    const row: Record<string, unknown> = {};
    for (const col of columns) {
      const keys = col.split('.');
      let value: unknown = item as Record<string, unknown>;
      for (const key of keys) {
        if (value && typeof value === 'object') value = (value as Record<string, unknown>)[key];
        else { value = undefined; break; }
      }
      row[col] = value;
    }
    return row;
  });
}

export function applyFilters<T>(data: T[], filters: AnalyticsFilter, getDate?: (item: T) => Date): T[] {
  let filtered = data;
  if (filters.dateStart && getDate) {
    const start = new Date(filters.dateStart);
    filtered = filtered.filter((item) => getDate(item) >= start);
  }
  if (filters.dateEnd && getDate) {
    const end = new Date(filters.dateEnd);
    filtered = filtered.filter((item) => getDate(item) <= end);
  }
  if (filters.module) {
    filtered = filtered.filter((item) => (item as Record<string, unknown>).module === filters.module);
  }
  if (filters.category) {
    filtered = filtered.filter((item) => (item as Record<string, unknown>).category === filters.category);
  }
  return filtered;
}

registerReport({
  id: 'commercial-overview',
  name: 'Visão Comercial',
  description: 'Visão geral do desempenho comercial',
  module: 'commercial',
  defaultColumns: [
    { key: 'period', label: 'Período', type: 'string' },
    { key: 'leads', label: 'Leads', type: 'number' },
    { key: 'quotations', label: 'Orçamentos', type: 'number' },
    { key: 'conversionRate', label: 'Taxa de Conversão', type: 'number', format: 'percentage' },
    { key: 'revenue', label: 'Receita', type: 'currency' },
  ],
  availableFilters: [
    { key: 'dateRange', label: 'Período', type: 'date-range' },
    { key: 'category', label: 'Categoria', type: 'select' },
  ],
  defaultChartType: 'bar',
});

registerReport({
  id: 'financial-summary',
  name: 'Resumo Financeiro',
  description: 'Resumo das movimentações financeiras',
  module: 'financial',
  defaultColumns: [
    { key: 'period', label: 'Período', type: 'string' },
    { key: 'revenue', label: 'Receita', type: 'currency' },
    { key: 'expenses', label: 'Despesas', type: 'currency' },
    { key: 'profit', label: 'Lucro', type: 'currency' },
    { key: 'margin', label: 'Margem', type: 'number', format: 'percentage' },
  ],
  availableFilters: [
    { key: 'dateRange', label: 'Período', type: 'date-range' },
  ],
  defaultChartType: 'area',
});

registerReport({
  id: 'production-performance',
  name: 'Desempenho Produtivo',
  description: 'Métricas de produção e eficiência',
  module: 'production',
  defaultColumns: [
    { key: 'period', label: 'Período', type: 'string' },
    { key: 'orders', label: 'Ordens', type: 'number' },
    { key: 'completed', label: 'Concluídas', type: 'number' },
    { key: 'onTime', label: 'No Prazo', type: 'number' },
    { key: 'efficiency', label: 'Eficiência', type: 'number', format: 'percentage' },
  ],
  availableFilters: [
    { key: 'dateRange', label: 'Período', type: 'date-range' },
    { key: 'department', label: 'Departamento', type: 'select' },
  ],
  defaultChartType: 'line',
});

export { type ReportColumn, type ReportDefinition, type ReportFilterDef } from '../types';
export { reportRegistry };
