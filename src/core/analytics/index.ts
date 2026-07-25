export { dataWarehouse } from './warehouse';
export { registerMetric, getMetric, getMetricsByCategory, getAllMetrics, calculateChange, calculateAchievement } from './metrics';
export { aggregateByGranularity, buildTimeSeries, computeSummary, applyDateFilter, formatPeriod } from './aggregations';
export { registerReport, getReport, getAllReports, getReportsByModule, buildReportData, applyFilters } from './reports';
export { buildChartData, defaultColors, aggregateChartData } from './charts';
export { exportData, downloadFile } from './exports';
export { analyticsCache } from './cache';
export { analyticsServiceCore } from './services';

export type {
  TimeGranularity, ChartType, WidgetType, ExportFormat, MetricCategory,
  AnalyticsFilter, MetricDefinition, MetricValue, AggregationResult,
  TimeSeriesPoint, TimeSeries, ChartConfig, DashboardLayout, WidgetPosition,
  WidgetConfig, DashboardData, SavedReportData, MetricSnapshotData,
  ExportRequest, AnalyticsSummary, KpiCard, ReportColumn, ReportDefinition,
} from './types';
