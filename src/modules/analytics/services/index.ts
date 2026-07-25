import type { DashboardData, SavedReportData, MetricSnapshotData, KpiCard, AnalyticsSummary, TimeSeries, AnalyticsFilter, MetricCategory, ChartConfig } from '@/core/analytics';
import { analyticsServiceCore, exportData, buildChartData, dataWarehouse } from '@/core/analytics';
import { DashboardRepository, ReportRepository, MetricRepository } from '../repository';
import type { DashboardCreateInput, ReportCreateInput, ReportUpdateInput } from '../schemas';

export const DashboardService = {
  async list(companyId: string): Promise<DashboardData[]> {
    return DashboardRepository.findAll(companyId);
  },

  async getById(id: string): Promise<DashboardData | null> {
    return DashboardRepository.findById(id);
  },

  async create(companyId: string, input: DashboardCreateInput): Promise<DashboardData> {
    return DashboardRepository.create({
      companyId,
      name: input.name,
      description: input.description ?? null,
      layout: input.layout ?? null,
      widgets: [],
      active: input.active,
    });
  },

  async update(id: string, input: Partial<DashboardCreateInput>): Promise<DashboardData | null> {
    return DashboardRepository.update(id, input as Partial<DashboardData>);
  },

  async delete(id: string): Promise<boolean> {
    return DashboardRepository.delete(id);
  },

  async addWidget(dashboardId: string, widget: DashboardData['widgets'][0]): Promise<DashboardData | null> {
    const dash = await DashboardRepository.findById(dashboardId);
    if (!dash) return null;
    return DashboardRepository.update(dashboardId, {
      widgets: [...dash.widgets, widget],
    });
  },
};

export const ReportService = {
  async list(companyId: string): Promise<SavedReportData[]> {
    return ReportRepository.findAll(companyId);
  },

  async getById(id: string): Promise<SavedReportData | null> {
    return ReportRepository.findById(id);
  },

  async create(companyId: string, input: ReportCreateInput): Promise<SavedReportData> {
    return ReportRepository.create({
      companyId,
      name: input.name,
      description: input.description ?? null,
      module: input.module ?? null,
      filters: input.filters ?? null,
      columns: input.columns ?? null,
      sortBy: input.sortBy ?? null,
      sortOrder: input.sortOrder,
      chartType: input.chartType ?? null,
      shared: input.shared,
    });
  },

  async update(id: string, input: ReportUpdateInput): Promise<SavedReportData | null> {
    return ReportRepository.update(id, input as Partial<SavedReportData>);
  },

  async delete(id: string): Promise<boolean> {
    return ReportRepository.delete(id);
  },
};

export const MetricService = {
  async getKpis(companyId: string, category?: MetricCategory): Promise<KpiCard[]> {
    return analyticsServiceCore.getKpis(companyId, category);
  },

  async getTimeSeries(companyId: string, metric: string, filter?: AnalyticsFilter): Promise<TimeSeries> {
    return analyticsServiceCore.getTimeSeries(companyId, metric, filter);
  },

  async getSummary(companyId: string): Promise<AnalyticsSummary> {
    return analyticsServiceCore.getSummary(companyId);
  },

  async recordSnapshot(companyId: string, data: Omit<MetricSnapshotData, 'id'>): Promise<MetricSnapshotData> {
    return MetricRepository.recordSnapshot({ ...data, companyId });
  },
};

export const ExportService = {
  async exportToFile(format: 'csv' | 'xlsx' | 'pdf', title: string, columns: { key: string; label: string }[], data: Record<string, unknown>[]) {
    return exportData({ format, title, data, columns });
  },
};
