export type TimeGranularity = 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';

export type ChartType = 'line' | 'bar' | 'pie' | 'area' | 'radar' | 'funnel' | 'gauge' | 'heatmap';

export type WidgetType = 'card' | 'chart' | 'table' | 'kpi' | 'ranking' | 'funnel' | 'goal' | 'calendar';

export type ExportFormat = 'pdf' | 'xlsx' | 'csv';

export type MetricCategory = 'commercial' | 'crm' | 'projects' | 'production' | 'financial' | 'installation' | 'team' | 'clients' | 'general';

export interface AnalyticsFilter {
  dateStart?: string;
  dateEnd?: string;
  granularity?: TimeGranularity;
  module?: string;
  category?: string;
  groupBy?: string[];
}

export interface MetricDefinition {
  id: string;
  name: string;
  description: string;
  category: MetricCategory;
  formula: string;
  unit: string;
  target?: number;
  higherIsBetter: boolean;
}

export interface MetricValue {
  metric: string;
  value: number;
  previousValue?: number;
  change?: number;
  changePercentage?: number;
  target?: number;
  achievement?: number;
  label: string;
  unit: string;
  category: MetricCategory;
  referenceDate: Date;
}

export interface AggregationResult {
  period: string;
  value: number;
  count: number;
  metrics: Record<string, number>;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  label?: string;
  previousValue?: number;
}

export interface TimeSeries {
  metric: string;
  label: string;
  data: TimeSeriesPoint[];
  total: number;
  average: number;
  min: number;
  max: number;
}

export interface ChartConfig {
  type: ChartType;
  title: string;
  description?: string;
  dataSource: string;
  xField: string;
  yField: string;
  groupField?: string;
  colors?: string[];
  showLegend?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
  animated?: boolean;
  height?: number;
}

export interface DashboardLayout {
  columns: number;
  rowHeight: number;
  gap: number;
}

export interface WidgetPosition {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  title: string;
  chartConfig?: ChartConfig;
  kpiMetric?: string;
  tableColumns?: string[];
  position: WidgetPosition;
}

export interface DashboardData {
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

export interface SavedReportData {
  id: string;
  companyId: string;
  name: string;
  description: string | null;
  module: string | null;
  filters: Record<string, unknown> | null;
  columns: string[] | null;
  sortBy: string | null;
  sortOrder: 'asc' | 'desc';
  chartType: ChartType | null;
  shared: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MetricSnapshotData {
  id: string;
  companyId: string;
  metric: string;
  value: number;
  label: string | null;
  category: string | null;
  unit: string | null;
  referenceDate: Date;
  metadata: Record<string, unknown> | null;
}

export interface ExportRequest {
  format: ExportFormat;
  title: string;
  data: Record<string, unknown>[];
  columns: { key: string; label: string }[];
  filters?: AnalyticsFilter;
}

export interface AnalyticsSummary {
  totalDashboards: number;
  totalReports: number;
  totalMetrics: number;
  lastUpdated: Date;
  topMetrics: MetricValue[];
}

export interface ReportColumn {
  key: string;
  label: string;
  type: 'string' | 'number' | 'date' | 'currency' | 'boolean';
  width?: number;
  align?: 'left' | 'center' | 'right';
  format?: string;
}

export interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  module: string;
  defaultColumns: ReportColumn[];
  availableFilters: ReportFilterDef[];
  defaultChartType?: ChartType;
}

export interface ReportFilterDef {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'date-range' | 'number' | 'boolean';
  options?: { value: string; label: string }[];
}

export interface KpiCard {
  id: string;
  title: string;
  value: number;
  previousValue: number | null;
  change: number | null;
  changeType: 'increase' | 'decrease' | 'stable';
  unit: string;
  target: number | null;
  achievement: number | null;
  category: MetricCategory;
  icon: string;
  higherIsBetter: boolean;
}
