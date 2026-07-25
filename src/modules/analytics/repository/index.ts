import type { DashboardData, WidgetConfig, SavedReportData, MetricSnapshotData, DashboardLayout } from '@/core/analytics';

interface DashboardRow {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  layout: DashboardLayout | null;
  widgets: WidgetConfig[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ReportRow {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  module: string | null;
  filters: Record<string, unknown> | null;
  columns: string[] | null;
  sortBy: string | null;
  sortOrder: string;
  chartType: string | null;
  shared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dashboards: DashboardRow[] = [
  {
    id: 'dash-1',
    companyId: 'company-1',
    name: 'Visão Geral',
    description: 'Dashboard principal com indicadores da empresa',
    layout: { columns: 12, rowHeight: 80, gap: 16 },
    widgets: [
      { id: 'w-1', type: 'kpi', title: 'Receita do Mês', position: { x: 0, y: 0, w: 3, h: 2 } },
      { id: 'w-2', type: 'kpi', title: 'Projetos Ativos', position: { x: 3, y: 0, w: 3, h: 2 } },
      { id: 'w-3', type: 'kpi', title: 'Leads do Mês', position: { x: 6, y: 0, w: 3, h: 2 } },
      { id: 'w-4', type: 'chart', title: 'Receita por Mês', position: { x: 0, y: 2, w: 8, h: 4 } },
      { id: 'w-5', type: 'ranking', title: 'Top Clientes', position: { x: 8, y: 2, w: 4, h: 4 } },
    ],
    active: true,
    createdAt: new Date('2026-07-01'),
    updatedAt: new Date('2026-07-01'),
  },
  {
    id: 'dash-2',
    companyId: 'company-1',
    name: 'Financeiro',
    description: 'Indicadores financeiros',
    layout: { columns: 12, rowHeight: 80, gap: 16 },
    widgets: [
      { id: 'w-6', type: 'kpi', title: 'Faturamento', position: { x: 0, y: 0, w: 3, h: 2 } },
      { id: 'w-7', type: 'chart', title: 'Fluxo de Caixa', position: { x: 0, y: 2, w: 12, h: 4 } },
    ],
    active: true,
    createdAt: new Date('2026-07-15'),
    updatedAt: new Date('2026-07-15'),
  },
];

const reports: ReportRow[] = [
  {
    id: 'rep-1',
    companyId: 'company-1',
    name: 'Relatório Comercial',
    description: 'Desempenho comercial mensal',
    module: 'commercial',
    filters: {},
    columns: ['period', 'leads', 'quotations', 'revenue'],
    sortBy: 'period',
    sortOrder: 'desc',
    chartType: 'bar',
    shared: false,
    createdAt: new Date('2026-07-10'),
    updatedAt: new Date('2026-07-10'),
  },
  {
    id: 'rep-2',
    companyId: 'company-1',
    name: 'Relatório Financeiro',
    description: 'Resumo financeiro mensal',
    module: 'financial',
    filters: {},
    columns: ['period', 'revenue', 'expenses', 'profit'],
    sortBy: 'period',
    sortOrder: 'desc',
    chartType: 'area',
    shared: false,
    createdAt: new Date('2026-07-12'),
    updatedAt: new Date('2026-07-12'),
  },
];

function toDashboardData(row: DashboardRow): DashboardData {
  return { ...row };
}

function toReportData(row: ReportRow): SavedReportData {
  return { ...row, sortOrder: row.sortOrder as 'asc' | 'desc', chartType: row.chartType as SavedReportData['chartType'] };
}

export const DashboardRepository = {
  async findAll(companyId: string): Promise<DashboardData[]> {
    return dashboards.filter((d) => d.companyId === companyId).map(toDashboardData);
  },

  async findById(id: string): Promise<DashboardData | null> {
    const row = dashboards.find((d) => d.id === id);
    return row ? toDashboardData(row) : null;
  },

  async create(data: Omit<DashboardRow, 'id' | 'createdAt' | 'updatedAt'>): Promise<DashboardData> {
    const row: DashboardRow = {
      id: `dash-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dashboards.push(row);
    return toDashboardData(row);
  },

  async update(id: string, data: Partial<DashboardRow>): Promise<DashboardData | null> {
    const index = dashboards.findIndex((d) => d.id === id);
    if (index === -1) return null;
    dashboards[index] = { ...dashboards[index], ...data, updatedAt: new Date() };
    return toDashboardData(dashboards[index]);
  },

  async delete(id: string): Promise<boolean> {
    const index = dashboards.findIndex((d) => d.id === id);
    if (index === -1) return false;
    dashboards.splice(index, 1);
    return true;
  },
};

export const ReportRepository = {
  async findAll(companyId: string): Promise<SavedReportData[]> {
    return reports.filter((r) => r.companyId === companyId).map(toReportData);
  },

  async findById(id: string): Promise<SavedReportData | null> {
    const row = reports.find((r) => r.id === id);
    return row ? toReportData(row) : null;
  },

  async create(data: Omit<ReportRow, 'id' | 'createdAt' | 'updatedAt'>): Promise<SavedReportData> {
    const row: ReportRow = {
      id: `rep-${Date.now()}`,
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    reports.push(row);
    return toReportData(row);
  },

  async update(id: string, data: Partial<ReportRow>): Promise<SavedReportData | null> {
    const index = reports.findIndex((r) => r.id === id);
    if (index === -1) return null;
    reports[index] = { ...reports[index], ...data, updatedAt: new Date() };
    return toReportData(reports[index]);
  },

  async delete(id: string): Promise<boolean> {
    const index = reports.findIndex((r) => r.id === id);
    if (index === -1) return false;
    reports.splice(index, 1);
    return true;
  },
};

export const MetricRepository = {
  async findSnapshots(companyId: string, metric: string, limit = 30): Promise<MetricSnapshotData[]> {
    return [];
  },

  async recordSnapshot(data: Omit<MetricSnapshotData, 'id'>): Promise<MetricSnapshotData> {
    const snapshot: MetricSnapshotData = { ...data, id: `snap-${Date.now()}` };
    return snapshot;
  },
};
